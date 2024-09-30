import type { Investment } from '../../src/entities/investment'
import { InvestmentModel } from '../../src/external/database/investment.model'
import type {
  InvestmentRepository,
  updateInvestmentType,
} from '../../src/repositories/investment.repository'

export class InMemoryInvestmentRepository implements InvestmentRepository {
  public investments: Investment[] = []

  async save(investment: Investment): Promise<void> {
    this.investments.push(investment)
  }
  async findInvestmentByUUID(
    ownerUUID: string,
    uuid: string,
  ): Promise<Investment | null> {
    const investment = this.investments.find((investment) => {
      return investment.uuid === uuid && investment.ownerUUID === ownerUUID
    })
    if (!investment) {
      return null
    }
    return investment
  }
  async findAllInvestment(
    ownerUUID: string,
    limit: number,
    skip: number,
  ): Promise<Investment[]> {
    const investments = this.investments.filter(
      (investment) => investment.ownerUUID === ownerUUID,
    )
    return investments.slice(skip, skip + limit)
  }
  async update(
    ownerUUID: string,
    uuid: string,
    data: updateInvestmentType,
  ): Promise<void> {
    const investment = this.investments.find((investment) => {
      return investment.uuid === uuid && investment.ownerUUID === ownerUUID
    })
    if (investment) {
      const index = this.investments.indexOf(investment)
      this.investments[index] = { ...investment, ...data }
    }
  }
}
