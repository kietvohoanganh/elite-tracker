import { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function WeightTrendChart({ data, theme, height }) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={1} debounce={100} initialDimension={{ width: 1, height }}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
        <XAxis dataKey="date" stroke={theme.textSecondary} fontSize={12} tickLine={false} />
        <YAxis stroke={theme.textSecondary} fontSize={12} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
        <Tooltip contentStyle={{ backgroundColor: theme.bgDark, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary }} itemStyle={{ color: theme.textPrimary }} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: theme.textSecondary }} />
        <Line isAnimationActive={false} type="monotone" dataKey="Actual" stroke={theme.accentGold} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: theme.accentGold }} name="Scale Weight" />
        <Line isAnimationActive={false} type="monotone" dataKey="Trend" stroke={theme.primaryRed} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: theme.primaryRed }} name="True Trend (EMA)" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default memo(WeightTrendChart);
