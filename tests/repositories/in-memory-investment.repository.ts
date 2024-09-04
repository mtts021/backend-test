import type { Investment } from '../../src/entities/investment'
import type { InvestmentRepository } from '../../src/repositories/investment.repository'

export class InMemoryInvestmentRepository implements InvestmentRepository {
  public investments: Investment[] = []

  async save(investment: Investment): Promise<void> {
    this.investments.push(investment)
  }
  async findInvestmentByUUID(uuid: string): Promise<Investment | null> {
    const investment = this.investments.find((investment) => investment.uuid === uuid)
    if (!investment) {
      return null
    }
    return investment
  }
  async findAllInvestment(): Promise<Investment[]> {
    throw new Error('Method not implemented.')
  }
}