export interface Investment {
  uuid: string
  title: string
  ownerUUID: string
  initialAmount: number
  status: 'ACTIVE' | 'WITHDRAWN'
  withdrawnAt?: Date
  createdAt: Date
  updatedAt?: Date
}
