import React, { useContext } from 'react'
import useSWR from 'swr'
import type { ApiContext, FinancialTransactions } from 'types'
import { EXPENSES, INCOME } from 'const'

type FinancialTransactionsContextType = {
  incomeItem?: FinancialTransactions[]
  expensesItem?: FinancialTransactions[]
}

type FinancialTransactionsContextProviderProps = {
  context: ApiContext
}

const FinancialTransactionsContext =
  React.createContext<FinancialTransactionsContextType>({
    incomeItem: undefined,
    expensesItem: undefined,
  })

export const useFinancialTransactionsContext =
  (): FinancialTransactionsContextType =>
    useContext<FinancialTransactionsContextType>(FinancialTransactionsContext)

/**
 * 収支コンテキストプロバイダー
 * @param params パラメータ
 */
export const FinancialTransactionsContextProvider = ({
  children,
}: React.PropsWithChildren<FinancialTransactionsContextProviderProps>) => {
  const { data: incomeItem } = useSWR<FinancialTransactions[]>(
    `/api/financial-transactions?type=${INCOME}`,
    (url: RequestInfo | URL) => fetch(url).then((res) => res.json()),
  )
  const { data: expensesItem } = useSWR<FinancialTransactions[]>(
    `/api/financial-transactions?type=${EXPENSES}`,
    (url: RequestInfo | URL) => fetch(url).then((res) => res.json()),
  )

  return (
    <FinancialTransactionsContext.Provider value={{ incomeItem, expensesItem }}>
      {children}
    </FinancialTransactionsContext.Provider>
  )
}
