import { differenceInMonths, differenceInYears } from 'date-fns'
import type { InvestmentRepository } from '../../repositories/investment.repository'
import { NotFoundError, UnprocessableEntityError } from '../../utils/api-error'
import {
  calculateBalanceGain,
  calculateFinalBalance,
} from './helpers/calculate-gain.helper'

export class WithdrawInvestmentService {
  constructor(private readonly investmentRepository: InvestmentRepository) {}
  async execute(ownerUUID: string, investmentUUID: string, withdrawAt?: Date) {
    if (withdrawAt && withdrawAt > new Date()) {
      return new UnprocessableEntityError("withdrawAt can't be in the future")
    }

    const investment = await this.investmentRepository.findInvestmentByUUID(
      ownerUUID,
      investmentUUID,
    )

    if (!investment) {
      return new NotFoundError('investment not found')
    }
    if (investment.status === 'WITHDRAWN') {
      return new UnprocessableEntityError('investment already withdrawn')
    }

    const dateToday = withdrawAt ?? new Date()
    const differenceMonth = differenceInMonths(dateToday, investment.createdAt)

    const differenceYear = differenceInYears(dateToday, investment.createdAt)

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

    investment.withdrawnAt = dateToday
    investment.updatedAt = dateToday
    investment.status = 'WITHDRAWN'

    await this.investmentRepository.update(ownerUUID, investment.uuid, {
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
