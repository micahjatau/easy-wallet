import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatMoney } from '../lib/formatters.js'
import EmptyState from './EmptyState.jsx'

const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="rounded-2xl border border-border bg-background-elevated/90 px-4 py-3 text-sm shadow-float backdrop-blur dark:shadow-black/40">
      <p className="font-semibold text-foreground">{label || entry?.name}</p>
      <p className="mt-1 text-foreground-muted">
        {formatter ? formatter(entry.value) : entry.value}
      </p>
    </div>
  )
}

const CategoryBreakdown = ({
  variant = 'desktop',
  categoryData,
  categoryTotal,
  topCategory,
  topCategoryPercent,
  totalExpense,
  baseCurrency,
  className = '',
}) => {
  const isMobile = variant === 'mobile'
  const chartSize = isMobile ? 'h-44 w-44' : 'h-48 w-48'
  const innerRadius = isMobile ? 50 : 60
  const outerRadius = isMobile ? 80 : 90
  const listClass = isMobile
    ? 'mt-5 grid gap-2'
    : 'mt-6 grid gap-2 text-sm text-foreground-muted'
  const itemClass = isMobile
    ? 'flex items-center justify-between rounded-2xl bg-background-muted/40 px-4 py-3 text-xs'
    : 'flex items-center justify-between rounded-2xl bg-background-muted/40 px-4 py-3'
  const valueClass = isMobile
    ? 'block text-xs font-semibold text-foreground'
    : 'block text-xs font-semibold text-foreground'
  const percentClass = isMobile ? 'text-[9px] text-foreground-muted' : 'text-[9px] text-foreground-muted'

  return (
    <div
      className={`rounded-3xl border border-border bg-background-elevated/90 p-6 shadow-soft h-full flex flex-col dark:shadow-black/40 ${
        isMobile ? '' : 'md:p-7'
      } ${className}`.trim()}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground-muted">
            Allocation
          </p>
          <h2 className="mt-2 font-display text-xl text-foreground">Spending mix</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-foreground">
            {formatMoney(totalExpense, baseCurrency)}
          </span>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
            Total
          </span>
        </div>
      </div>

      {categoryData.data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No expense data"
            body="Add expense transactions to see a category breakdown."
          />
        </div>
      ) : (
        <div className="mt-6">
            <div className={`relative mx-auto ${chartSize}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {categoryData.data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(value) => formatMoney(value, baseCurrency)}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-foreground-subtle">
                  Top category
                </span>
                <span
                  className={`mt-1 font-display ${
                    isMobile ? 'text-base' : 'text-lg'
                  } text-foreground`}
                >
                  {topCategory ? topCategory.name : 'No data'}
                </span>
                {!isMobile && topCategory ? (
                  <span className="mt-1 text-[10px] text-foreground-muted">
                    {topCategoryPercent}% of spend
                  </span>
                ) : null}
              </div>
            </div>
          <div className={listClass}>
            {categoryData.data.map((entry) => {
              const percent = categoryTotal
                ? Math.round((entry.value / categoryTotal) * 100)
                : 0
              return (
                <div key={entry.name} className={itemClass}>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs font-semibold text-foreground-muted">
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={valueClass}>
                      {formatMoney(entry.value, baseCurrency)}
                    </span>
                    <span className={percentClass}>{percent}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {categoryData.missingRates > 0 && !isMobile ? (
        <p className="mt-4 text-xs text-error">
          {categoryData.missingRates} expense entries are missing exchange rates.
        </p>
      ) : null}
    </div>
  )
}

export default CategoryBreakdown
