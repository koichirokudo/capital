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
  name: string
  password: string
  email: string
  delete: string
}

// グループ
export type Group = {
  id: number
  groupName: string
  inviteCode: string
  inviteLimit: string
  startDay: number
}

// 収支
export type Capital = {
  id: number
  userId: number
  groupId: number
  share: boolean
  date: string
  expensesItem: string
  capitalType: string
  note: string
  money: number
  settlement: boolean
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
  name: string
  memberName: string
  expenses: number
  income: number
  total: number
}

export type ExpensesItem = {
  id: number
  type: number
  value: string
  label: string
}

export type YearlyIncomeAndExpenses = {
  userId: number
  groupId: number
  year: number
  incomeTotal: number
  incomeDetails: {
    January?: number
    February?: number
    March?: number
    April?: number
    May?: number
    June?: number
    July?: number
    August?: number
    September?: number
    October?: number
    November?: number
    December?: number
  }
  expensesTotal: number
  expensesDetails: {
    January?: number
    February?: number
    March?: number
    April?: number
    May?: number
    June?: number
    July?: number
    August?: number
    September?: number
    October?: number
    November?: number
    December?: number
  }
}

export type MonthlyIncomeAndExpenses = {
  userId: number
  groupId: number
  year: number
  month: number
  incomeDetails: {
    salary?: number
    sidejob?: number
    pocketmoney?: number
    investment?: number
    bonus?: number
    extra?: number
  }
  expensesDetails: {
    daily?: number
    education?: number
    transport?: number
    insurance?: number
    beauty?: number
    clothes?: number
    food?: number
    medical?: number
    house?: number
    water?: number
    gas?: number
    electric?: number
    loan?: number
    internet?: number
    smartphone?: number
    entertain?: number
    gift?: number
    fee?: number
  }
}

export type Settlement = {
  id: number
  groupId?: number
  year: number
  month: number
  totalAmount: number
  status: string
  users: Array<{
    name: string
    amount: number
  }>
}
