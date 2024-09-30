import type { Investment } from '../../entities/investment'
import type { InvestmentRepository } from '../../repositories/investment.repository'
import type { OwnerRepository } from '../../repositories/owner.repository'
import { type ApiError, NotFoundError } from '../../utils/api-error'

export class GetAllInvestmentService {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly investmentRepository: InvestmentRepository,
  ) {}
  async execute(
    ownerUUID: string,
    page = 1,
    limit = 10,
  ): Promise<Investment[] | ApiError> {
    const owner = await this.ownerRepository.findOwnerByUUID(ownerUUID)
    if (!owner) {
      return new NotFoundError('Owner not found')
    }

    const skip = limit * page - limit
    const investments = await this.investmentRepository.findAllInvestment(
      ownerUUID,
      limit,
      skip,
    )

    return investments
  }
}
