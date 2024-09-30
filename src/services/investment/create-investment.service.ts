import { randomUUID } from 'node:crypto'
import type { Investment } from '../../entities/investment'
import type { InvestmentRepository } from '../../repositories/investment.repository'
import type { OwnerRepository } from '../../repositories/owner.repository'
import {
  type ApiError,
  NotFoundError,
  UnprocessableEntityError,
} from '../../utils/api-error'

export interface createInvestmentRequest {
  title: string
  ownerUUID: string
  initialAmount: number
  createdAt?: Date
}

export class CreateInvestmentService {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}
  async execute(request: createInvestmentRequest): Promise<Investment | ApiError> {
    const ownerOrNull = await this.ownerRepository.findOwnerByUUID(request.ownerUUID)
    if (!ownerOrNull) {
      return new NotFoundError('owner not found')
    }
    if (request.initialAmount <= 0) {
      return new UnprocessableEntityError('initial amount cannot be negative')
    }
    if (request.title.length <= 2 || request.title.length > 255) {
      return new UnprocessableEntityError('title must be less than 2 and less than 255')
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
