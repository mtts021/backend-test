import { describe, expect, it, vi } from 'vitest'
import { InMemoryInvestmentRepository } from '../../../tests/repositories/in-memory-investment.repository'
import { ApiError } from '../../utils/api-error'
import { WithdrawInvestmentService } from './withdraw-investment.service'

describe('Withdraw investment service', () => {
  it('should be able withdrawn investment return', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    investmentRepository.investments.push({
      uuid: '46da0c49-2e62-496d-9240-fd34ffa119b5',
      title: 'Title fake',
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      initialAmount: 1000,
      createdAt: new Date('2022-11-10'),
      status: 'ACTIVE',
    })
    const withdrawInvestmentService = new WithdrawInvestmentService(investmentRepository)

    const output = await withdrawInvestmentService.execute(
      'c8c3h8hc33hc893hv3rv4tv89',
      '46da0c49-2e62-496d-9240-fd34ffa119b5',
    )
    expect(output).toBeTruthy()
    expect(output).toHaveProperty('balanceGain')
    expect(output).toHaveProperty('taxa')
    expect(output).toHaveProperty('finalBalance')
  })
  it('should return an error if “withdrawAt” is in the future', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    investmentRepository.investments.push({
      uuid: '46da0c49-2e62-496d-9240-fd34ffa119b5',
      title: 'Title fake',
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      initialAmount: 1000,
      createdAt: new Date('2022-11-10'),
      status: 'ACTIVE',
    })
    const withdrawInvestmentService = new WithdrawInvestmentService(investmentRepository)

    const withdrawAt = new Date()
    withdrawAt.setMonth(withdrawAt.getMonth() + 1)

    const output = await withdrawInvestmentService.execute(
      'c8c3h8hc33hc893hv3rv4tv89',
      '46da0c49-2e62-496d-9240-fd34ffa119b5',
      withdrawAt,
    )
    expect(output).toBeInstanceOf(ApiError)
    expect(output).toHaveProperty('message', "withdrawAt can't be in the future")
  })
  it('should return error investment not found', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const withdrawInvestmentService = new WithdrawInvestmentService(investmentRepository)

    const output = await withdrawInvestmentService.execute(
      'c8c3h8hc33hc893hv3rv4tv89',
      '46da0c49-2e62-496d-9240-fd34ffa119b5',
    )
    expect(output).toBeInstanceOf(Error)
    expect(output).toHaveProperty('message', 'investment not found')
  })
  it('should return an error "investment already withdrawn" if status WITHDRAWN', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    investmentRepository.investments.push({
      uuid: '46da0c49-2e62-496d-9240-fd34ffa119b5',
      title: 'Title fake',
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      initialAmount: 1000,
      createdAt: new Date('2024-01-01'),
      status: 'WITHDRAWN',
    })
    const withdrawInvestmentService = new WithdrawInvestmentService(investmentRepository)

    const output = await withdrawInvestmentService.execute(
      'c8c3h8hc33hc893hv3rv4tv89',
      '46da0c49-2e62-496d-9240-fd34ffa119b5',
    )
    expect(output).toBeInstanceOf(Error)
    expect(output).toHaveProperty('message', 'investment already withdrawn')
  })
})
