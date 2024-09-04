import dayjs from 'dayjs'
import type { Investment } from '../../entities/investment'
import type { InvestmentRepository } from '../../repositories/investment.repository'
import type { OwnerRepository } from '../../repositories/owner.repository'

export class GetAllInvestmentService {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly investmentRepository: InvestmentRepository,
  ) {}
  async execute(ownerUUID: string): Promise<Investment[] | Error> {
    const owner = await this.ownerRepository.findOwnerByUUID(ownerUUID)
    if (!owner) {
      return new Error('Owner not found')
    }

    const investments = await this.investmentRepository.findAllInvestment(ownerUUID)

    return investments
  }
}
