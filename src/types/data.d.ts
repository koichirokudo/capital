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
  profileImage: string
  username: string
  password: string
  email: string
  cancel: string
}

// グループ
export type Group = {
  id: number
  groupName: string
  participants: number
  inviteId: string
  stratDay: number
}

// 収支
export type Capital = {
  id: number
  groupId: number
  share: string
  username: string
  date: string
  category: string
  capitalType: string
  note: string
  money: number
  settlement: string
  settlementAt: string
}

export type CapitalHistory = {
  id: number
  status: number
  userId: number
  groupId: number
  date: string
  category: string
  capitalType: number
  note: string
  money: number
  settlement: boolean
  settlementAt: string
}

export type Calculate = {
  id: number
  userId: number
  userName: string
  memberName: string
  outgo: number
  income: number
  total: number
}
