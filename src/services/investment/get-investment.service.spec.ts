import { describe, expect, it } from 'vitest'
import { InMemoryInvestmentRepository } from '../../../tests/repositories/in-memory-investment.repository'
import { GetInvestmentService } from './get-investment.service'

describe('Get investment service', () => {
  it('should return error if investment not found by uuid', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()

    const getInvestmentService = new GetInvestmentService(investmentRepository)

    const output = await getInvestmentService.execute('fake-uuid')

    expect(output).toBeInstanceOf(Error)
  })

  it('should return investment with expected balance if investment be active', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const createdAt = new Date('2024-05-01')
    investmentRepository.investments.push({
      uuid: '46da0c49-2e62-496d-9240-fd34ffa119b5',
      title: 'Title fake',
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      initialAmount: 100,
      createdAt,
      status: 'ACTIVE',
    })

    const getInvestmentService = new GetInvestmentService(investmentRepository)

    const output = await getInvestmentService.execute(
      '46da0c49-2e62-496d-9240-fd34ffa119b5',
    )

    expect(output).toHaveProperty('expectedBalance')
    expect(output).toHaveProperty('investment')
  })

  it('should return investment with balance gain if investment withdrawn', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const createdAt = new Date('2024-05-01')
    investmentRepository.investments.push({
      uuid: '46da0c49-2e62-496d-9240-fd34ffa119b5',
      title: 'Title fake',
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      initialAmount: 100,
      createdAt,
      status: 'WITHDRAWN',
    })

    const getInvestmentService = new GetInvestmentService(investmentRepository)

    const output = await getInvestmentService.execute(
      '46da0c49-2e62-496d-9240-fd34ffa119b5',
    )

    expect(output).toHaveProperty('investment')
    expect(output).toHaveProperty('balanceGain')
  })
})
