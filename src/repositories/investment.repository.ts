import type { Investment } from '../entities/investment'

export type updateInvestmentType = Partial<
  Omit<Investment, 'uuid' | 'ownerUUID' | 'createdAt'>
>

export interface InvestmentRepository {
  save(investment: Investment): Promise<void>
  findInvestmentByUUID(ownerUUID: string, uuid: string): Promise<Investment | null>
  findAllInvestment(ownerUUID: string, limit: number, skip: number): Promise<Investment[]>
  update(ownerUUID: string, uuid: string, data: updateInvestmentType): Promise<void>
}
