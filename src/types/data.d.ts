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
  username: string
  password: string
  email: string
  cancel: boolean
  create_at: string
  update_at: string
}

// グループ
export type Group = {
  id: number
  groupName: string
  participants: number
  inviteId: string
  stratDay: number
  create_at: string
  update_at: string
}

// 収支
export type Capital = {
  id: number
  userId: number
  groupId: number
  date: string
  categoryId: number
  categoryType: string
  note: string
  money: number
  settlement: boolean
  settlement_at: string
  create_at: string
  update_at: string
}

// カテゴリ
export type Category = {
  id: number
  groupId: number
  categoryType: number
  categoryName: string
  create_at: string
  update_at: string
}
