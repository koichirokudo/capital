// 収入カテゴリ
export type IncomeCategory =
  | 'salary'
  | 'sidejob'
  | 'pocketmoney'
  | 'investment'
  | 'bonus'
  | 'extra'

// 支出カテゴリ
export type OutgoCategory =
  | 'daily'
  | 'education'
  | 'transport'
  | 'insurance'
  | 'beauty'
  | 'clothes'
  | 'food'
  | 'medical'
  | 'house'
  | 'water'
  | 'gas'
  | 'electric'
  | 'loan'
  | 'internet'
  | 'smartphone'
  | 'entertain'
  | 'gift'
  | 'fee'

// API Context
export type ApiContext = {
  apiRootUrl: string
}

// ユーザ
export type User = {
  userId: number
  groupId: number
  authType: number
  username: string
  password: string
  email: string
  cancel: boolean
}

// グループ
export type Group = {
  groupId: number
  participants: number
  inviteId: string
  stratDay: number
}

// 収支
export type Capital = {
  capitalId: number
  userId: number
  groupId: number
  date: string
  categoryId: number
  categoryType: string
  note: string
  money: number
  settlement: boolean
}

// カテゴリ
export type Category = {
  categoryId: number
  groupId: number
  categoryType: number
  categoryName: string
}
