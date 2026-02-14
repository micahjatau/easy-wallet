import { memo, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatMoney } from '../lib/formatters.js'
import EmptyState from '../components/EmptyState.jsx'
import ProfileSwitcher from '../components/auth/ProfileSwitcher.jsx'
import { APP_NAME } from '../lib/ledgerConfig.js'

// Stat Card Component
const StatCard = memo(function StatCard({ title, amount, currency, icon, trend }) {
  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="material-symbols-outlined text-2xl text-foreground-muted">
          {icon}
        </span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-success-background text-success' : 'bg-error-background text-error'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-sm text-foreground-muted mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">
        {formatMoney(amount, currency)}
      </p>
    </div>
  )
})

// Transaction Row Component
const TransactionRow = memo(function TransactionRow({ transaction, accounts }) {
  const accountName = accounts?.find(a => a.id === transaction.accountId)?.name || transaction.accountId
  const isIncome = transaction.type === 'income'
  
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border/50 hover:bg-background-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isIncome ? 'bg-success-background' : 'bg-error-background'
        }`}>
          <span className="material-symbols-outlined text-sm">
            {isIncome ? 'trending_up' : 'trending_down'}
          </span>
        </div>
        <div>
          <p className="font-medium text-foreground">{transaction.name}</p>
          <p className="text-xs text-foreground-muted">{transaction.category} • {accountName}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isIncome ? 'text-success' : 'text-foreground'}`}>
          {isIncome ? '+' : '-'}{formatMoney(transaction.amount, transaction.currency)}
        </p>
        <p className="text-xs text-foreground-muted">{transaction.date}</p>
      </div>
    </div>
  )
})

const DashboardView = memo(function DashboardView({
  balance,
  totals,
  baseCurrency,
  filteredTransactions,
  accounts,
  _settings,
  _onEdit,
  _onDelete,
  _onRestore,
}) {
  const recentTransactions = filteredTransactions?.slice(0, 5) || []

  // Prepare chart data - last 7 days spending by category
  const chartData = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) return []
    
    const last7Days = filteredTransactions
      .filter(t => t.type === 'expense')
      .slice(0, 20)
      .reduce((acc, t) => {
        const category = t.category || 'Other'
        acc[category] = (acc[category] || 0) + t.amount
        return acc
      }, {})
    
    return Object.entries(last7Days)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [filteredTransactions])

  // Calculate trends (mock data for now - would compare to previous period)
  const incomeTrend = 12
  const expenseTrend = -5
  const netTrend = 8

  return (
    <div className="space-y-6">
      <section className="lg:hidden rounded-2xl border border-border bg-background-elevated p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <h1 className="font-display text-xl text-foreground">{APP_NAME}</h1>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Dashboard
            </p>
          </div>
          <ProfileSwitcher />
        </div>
      </section>

      <section className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
          Dashboard
        </p>
        <h2 className="mt-1 font-display text-3xl text-foreground">Financial Overview</h2>
      </section>

      {/* Balance Section - Large and prominent */}
      <div className="rounded-3xl border border-border bg-background-elevated p-8 shadow-lg">
        <p className="text-sm text-foreground-muted uppercase tracking-wider mb-2">Total Balance</p>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2">
          {formatMoney(balance, baseCurrency)}
        </h1>
        <p className="text-foreground-muted">
          As of {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Income"
          amount={totals?.income || 0}
          currency={baseCurrency}
          icon="arrow_circle_up"
          trend={incomeTrend}
        />
        <StatCard
          title="Expenses"
          amount={totals?.expense || 0}
          currency={baseCurrency}
          icon="arrow_circle_down"
          trend={expenseTrend}
        />
        <StatCard
          title="Net"
          amount={totals?.balance || 0}
          currency={baseCurrency}
          icon="account_balance_wallet"
          trend={netTrend}
        />
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl border border-border bg-background-elevated p-6 shadow-sm">
        <h2 className="font-display text-xl text-foreground mb-6">Spending by Category</h2>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₦${value}`}
                />
                <Tooltip 
                  formatter={(value) => formatMoney(value, baseCurrency)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#2dc41c" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-foreground-muted text-center py-8">No spending data available</p>
        )}
      </div>

      {/* Recent Transactions - 5 items */}
      <div className="rounded-2xl border border-border bg-background-elevated shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Recent Transactions</h2>
            <span className="text-sm text-foreground-muted">Last {recentTransactions.length} transactions</span>
          </div>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div>
            {recentTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                accounts={accounts}
              />
            ))}
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No transactions yet"
              body="Add your first transaction to see activity here."
            />
          </div>
        )}
      </div>
    </div>
  )
})

export default DashboardView
