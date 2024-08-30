import { randomUUID } from 'node:crypto'
import type { Investment } from '../../entities/investment'
import type { InvestmentRepository } from '../../repositories/investment.repository'

export interface createInvestmentRequest {
  title: string
  ownerUUID: string
  initialAmount: number
  createdAt?: Date
}

export class CreateInvestmentService {
  constructor(private readonly investmentRepository: InvestmentRepository) {}
  async execute(request: createInvestmentRequest): Promise<Investment | Error> {
    if (request.initialAmount <= 0) {
      return new Error('initial amount cannot be negative')
    }
    if (request.title.length <= 2 || request.title.length > 255) {
      return new Error('title must be less than 2 and less than 255')
    }

    const investment: Investment = {
      ...request,
      uuid: randomUUID(),
      status: 'ACTIVE',
      createdAt: request.createdAt ?? new Date(),
    }

    await this.investmentRepository.save(investment)
    return investment
  }
}
