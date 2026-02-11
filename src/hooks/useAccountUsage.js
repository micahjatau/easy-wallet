import { useMemo } from 'react'

export const useAccountUsage = ({ accounts, transactions }) => {
  const accountUsage = useMemo(() => {
    const usage = accounts.reduce((accumulator, account) => {
      accumulator[account.id] = 0
      return accumulator
    }, {})

    transactions.forEach((transaction) => {
      if (usage[transaction.accountId] !== undefined) {
        usage[transaction.accountId] += 1
      }
    })

    return usage
  }, [accounts, transactions])

  return { accountUsage }
}

export default useAccountUsage
