import dayjs from 'dayjs'
import type { InvestmentRepository } from '../../repositories/investment.repository'
import {
  calculateBalanceGain,
  calculateFinalBalance,
} from './helpers/calculate-gain.helper'

export class WithdrawInvestmentService {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly date: Date,
  ) {}
  async execute(ownerUUID: string, investmentUUID: string) {
    const investment = await this.investmentRepository.findInvestmentByUUID(
      ownerUUID,
      investmentUUID,
    )

    if (!investment) {
      return new Error('investment not found')
    }
    if (investment.status === 'WITHDRAWN') {
      return new Error('investment already withdrawn')
    }
    const yearInvestment = investment.createdAt.getUTCFullYear()
    const createdAtFromDayjs = dayjs(investment.createdAt)
    const differenceMonth = Math.abs(createdAtFromDayjs.diff(this.date, 'month'))
    const differenceYear = this.date.getUTCFullYear() - yearInvestment

    const balanceGain = calculateBalanceGain(investment.initialAmount, differenceMonth)
    let finalBalance: number
    let taxa: number
    if (differenceYear < 1) {
      taxa = balanceGain * 0.225
      finalBalance = calculateFinalBalance(investment.initialAmount, balanceGain, taxa)
    } else if (differenceYear >= 1 && differenceYear <= 2) {
      taxa = balanceGain * 0.185
      finalBalance = calculateFinalBalance(investment.initialAmount, balanceGain, taxa)
    } else {
      taxa = balanceGain * 0.15
      finalBalance = calculateFinalBalance(investment.initialAmount, balanceGain, taxa)
    }

    investment.withdrawnAt = this.date
    investment.status = 'WITHDRAWN'
    investment.updatedAt = this.date

    this.investmentRepository.update(ownerUUID, investment.uuid, {
      status: investment.status,
      withdrawnAt: investment.withdrawnAt,
      updatedAt: investment.updatedAt,
    })
    return {
      investment,
      balanceGain: Number(balanceGain.toFixed(4)),
      taxa: Number(taxa.toFixed(4)),
      finalBalance: Number(finalBalance.toFixed(4)),
    }
  }
}
