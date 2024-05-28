// API Context
export type ApiContext = {
  apiRootUrl: string
}

// ユーザ
export type User = {
  id: number
  userGroupId: number
  authType: number
  profileImage: string
  name: string
  password: string
  email: string
  delete: string
  inviteCode: string
}

// user group
export type UserGroup = {
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
  userGroupId: number
  settlementId: number | null
  share: boolean
  date: string
  financialTransactionId: number
  capitalType: number
  note: string
  money: number
}

type Payment = {
  label: string
  paid: {
    [name: string]: number
    total: number
    perPerson: number
  }
  paymentPlan: {
    [name: string]: number
  }
}

export type Calculate = {
  paymentByCategory: Record<string, Payment>
  paymentPlanTotal: {
    [name: string]: number
  }
  users: string[]
}

export type FinancialTransactions = {
  id: number
  type: number
  value: string
  label: string
}

export type FinancialTransactionRatios = {
  id: number
  userGroupId: number
  financialTransactionId: number
  ratio: number
}

export type FinalPayments = {
  fromId: number
  fromName: string
  toId: number
  toName: string
  amount: number
}

export type Decision = {
  year: number
  month: number
  payerId: number
  payeeId: number
  amount: number
}

export type Settlement = {
  id: number
  userGroupId?: number
  year: number
  month: number
  settled: string
}
