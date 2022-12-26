import React, { useState, useContext, createContext } from 'react'

const SpinnerContext = createContext<boolean>(false)
const SpinnerActionsContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {})

// スピナーの表示・非表示
export const useSpinnerContext = (): boolean =>
  useContext<boolean>(SpinnerContext)

// スピナーの表示・非表示のアクション
export const useSpinnerActionsContext = (): React.Dispatch<
  React.SetStateAction<boolean>
> =>
  useContext<React.Dispatch<React.SetStateAction<boolean>>>(
    SpinnerActionsContext,
  )

interface SpinnerContextProviderProps {
  children?: React.ReactNode
}

/**
 * スピナーコンテキストプロバイダー
 */
const SpinnerContextProvider = ({ children }: SpinnerContextProviderProps) => {
  const [isSpinnerOn, setSpinner] = useState(false)

  return (
    <SpinnerContext.Provider value={isSpinnerOn}>
      <SpinnerActionsContext.Provider value={setSpinner}>
        {children}
      </SpinnerActionsContext.Provider>
    </SpinnerContext.Provider>
  )
}

export default SpinnerContextProvider
