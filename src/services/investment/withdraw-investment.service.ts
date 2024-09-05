import dayjs from 'dayjs'
import type { InvestmentRepository } from '../../repositories/investment.repository'

export class WithdrawInvestmentService {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly date: Date,
  ) {}
  async execute(investmentUUID: string) {
    const investment =
      await this.investmentRepository.findInvestmentByUUID(investmentUUID)

    if (!investment) {
      return new Error('investment not found')
    }
    if (investment.status === 'WITHDRAWN') {
      return new Error('investment already withdrawn')
    }

    const yearInvestment = investment.createdAt.getUTCFullYear()
    let finalBalance: number
    let taxa: number
    const createdAtFromDayjs = dayjs(investment.createdAt)
    const differenceMonth = Math.abs(createdAtFromDayjs.diff(this.date, 'month'))
    const differenceYear = this.date.getUTCFullYear() - yearInvestment
    const balanceGain =
      investment.initialAmount * (1 + 0.0052) ** differenceMonth -
      investment.initialAmount
    if (differenceYear < 1) {
      taxa = balanceGain * 0.225
      finalBalance = investment.initialAmount + balanceGain - taxa
    } else if (differenceYear >= 1 && differenceYear <= 2) {
      taxa = balanceGain * 0.185
      finalBalance = investment.initialAmount + balanceGain - taxa
    } else {
      taxa = balanceGain * 0.15
      finalBalance = investment.initialAmount + balanceGain - taxa
    }

    investment.withdrawnAt = this.date
    investment.status = 'WITHDRAWN'
    return {
      investment,
      balanceGain: Number(balanceGain.toFixed(4)),
      taxa: Number(taxa.toFixed(4)),
      finalBalance: Number(finalBalance.toFixed(4)),
    }
  }
}
