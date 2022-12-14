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
  id: number
  groupId: number
  authType: number
  userName: string
  password: string
  email: string
  cancel: boolean
  createAt: string
  updateAt: string
}

// グループ
export type Group = {
  id: number
  groupName: string
  participants: number
  inviteId: string
  stratDay: number
  createAt: string
  updateAt: string
}

// 収支
export type Capital = {
  id: number
  userName: string
  groupId: number
  date: string
  category: string
  categoryType: string
  note: string
  money: number
  settlement: string
  settlementAt: string
  createAt: string
  updateAt: string
}

export type CapitalHistory = {
  id: number
  status: number
  userId: number
  groupId: number
  date: string
  category: string
  categoryType: number
  note: string
  money: number
  settlement: boolean
  settlementAt: string
  createAt: string
  updateAt: string
}
