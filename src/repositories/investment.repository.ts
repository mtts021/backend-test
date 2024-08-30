import type { Investment } from '../entities/investment'

export interface InvestmentRepository {
  save(investment: Investment): Promise<void>
  findInvestmentByUUID(uuid: string): Promise<Investment | null>
  findAllInvestment(): Promise<Investment[]>
}
