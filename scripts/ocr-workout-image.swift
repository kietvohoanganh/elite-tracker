import Foundation
import Vision

guard CommandLine.arguments.count > 1 else {
  fputs("Missing image path\n", stderr)
  exit(1)
}

let imageURL = URL(fileURLWithPath: CommandLine.arguments[1])
var recognizedLines: [(text: String, box: CGRect)] = []

let request = VNRecognizeTextRequest { request, error in
  if let error = error {
    fputs("OCR failed: \(error.localizedDescription)\n", stderr)
    return
  }

  let observations = request.results as? [VNRecognizedTextObservation] ?? []
  recognizedLines = observations.compactMap { observation in
    guard let candidate = observation.topCandidates(1).first else { return nil }
    return (candidate.string, observation.boundingBox)
  }
}

request.recognitionLevel = .fast
request.usesLanguageCorrection = true
request.recognitionLanguages = ["en-US"]

let handler = VNImageRequestHandler(url: imageURL, options: [:])

do {
  try handler.perform([request])
} catch {
  let nsError = error as NSError
  fputs("OCR failed: \(error.localizedDescription) [\(nsError.domain) \(nsError.code)] \(nsError.userInfo)\n", stderr)
  exit(1)
}

let sortedLines = recognizedLines.sorted { left, right in
  let verticalDelta = abs(left.box.midY - right.box.midY)
  if verticalDelta > 0.015 {
    return left.box.midY > right.box.midY
  }
  return left.box.minX < right.box.minX
}

print(sortedLines.map(\.text).joined(separator: "\n"))
