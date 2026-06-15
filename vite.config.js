import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { randomUUID } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { parseWorkoutTextToParsedTemplate } from './src/utils/exerciseParsing.js'

const execFileAsync = promisify(execFile)
const swiftModuleCachePath = path.join(tmpdir(), 'hypertrophy-tracker-swift-cache')

const getSwiftEnv = () => {
  const fallbackSdkRoot = [
    '/Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk',
    '/Library/Developer/CommandLineTools/SDKs/MacOSX15.sdk',
    '/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk',
  ].find(sdkPath => existsSync(sdkPath))

  return {
    ...process.env,
    CLANG_MODULE_CACHE_PATH: process.env.CLANG_MODULE_CACHE_PATH || swiftModuleCachePath,
    ...(process.env.SDKROOT || fallbackSdkRoot ? { SDKROOT: process.env.SDKROOT || fallbackSdkRoot } : {}),
  }
}

const readRequestJson = (req) => new Promise((resolve, reject) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk
    if (body.length > 8_000_000) {
      reject(new Error('Image payload is too large.'))
      req.destroy()
    }
  })
  req.on('end', () => {
    try {
      resolve(JSON.parse(body || '{}'))
    } catch {
      reject(new Error('Invalid JSON body.'))
    }
  })
  req.on('error', reject)
})

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.end(JSON.stringify(payload))
}

const handleParseWorkoutImageRequest = async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' })
    return
  }

  let tempImagePath = ''

  try {
    const { imageBase64 } = await readRequestJson(req)
    if (!imageBase64) {
      sendJson(res, 400, { error: 'Missing imageBase64.' })
      return
    }

    const tmpDirectory = path.join(tmpdir(), 'hypertrophy-tracker-ocr')
    await mkdir(tmpDirectory, { recursive: true })
    tempImagePath = path.join(tmpDirectory, `${randomUUID()}.png`)
    await writeFile(tempImagePath, Buffer.from(imageBase64, 'base64'))

    const scriptPath = path.resolve('scripts/ocr-workout-image.swift')
    const { stdout } = await execFileAsync('/usr/bin/swift', [scriptPath, tempImagePath], {
      env: getSwiftEnv(),
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    })

    const parsedTemplate = parseWorkoutTextToParsedTemplate(stdout)
    if (parsedTemplate.exercises.length === 0) {
      sendJson(res, 422, {
        error: 'Could not detect a workout plan from this image. Try a clearer image or enter the template manually.',
      })
      return
    }

    sendJson(res, 200, parsedTemplate)
  } catch (error) {
    const errorText = [error.stderr, error.message].filter(Boolean).join('\n')
    const isOcrError = /OCR failed|CVPixelBuffer|Command failed|swift|timeout/i.test(errorText)

    sendJson(res, 500, {
      error: isOcrError
        ? 'Could not read text from this image. Try a clearer image or enter the template manually.'
        : error.message || 'Image parser service is not configured.',
    })
  } finally {
    if (tempImagePath) {
      await rm(tempImagePath, { force: true }).catch(() => {})
    }
  }
}

const localApiPlugin = () => ({
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use('/api/parse-workout-image', handleParseWorkoutImageRequest)
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/parse-workout-image', handleParseWorkoutImageRequest)
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    localApiPlugin(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
})
