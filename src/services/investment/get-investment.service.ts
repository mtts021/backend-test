import dayjs from 'dayjs'
import type { InvestmentRepository } from '../../repositories/investment.repository'
import { NotFoundError } from '../../utils/api-error'
import { calculateExpectedBalance } from './helpers/calculate-gain.helper'

export class GetInvestmentService {
  constructor(private readonly investmentRepository: InvestmentRepository) {}
  async execute(ownerUUID: string, investmentUUID: string) {
    const investment = await this.investmentRepository.findInvestmentByUUID(
      ownerUUID,
      investmentUUID,
    )
    if (!investment) {
      return new NotFoundError('Investment not found')
    }

    const createdAtFromDayjs = dayjs(investment.createdAt)
    const differenceMonth = Math.abs(createdAtFromDayjs.diff(new Date(), 'month'))
    if (investment.status === 'ACTIVE') {
      const expectedBalance = calculateExpectedBalance(
        investment.initialAmount,
        differenceMonth,
      )

      return {
        investment,
        expectedBalance: expectedBalance.toFixed(4),
      }
    }
    const balanceGain =
      investment.initialAmount * (1 + 0.0052) ** differenceMonth -
      investment.initialAmount

    return {
      investment,
      balanceGain,
    }
  }
}
