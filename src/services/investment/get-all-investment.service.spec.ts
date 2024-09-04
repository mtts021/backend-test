import { describe, expect, it } from 'vitest'
import { InMemoryInvestmentRepository } from '../../../tests/repositories/in-memory-investment.repository'
import { InMemoryOwnerRepository } from '../../../tests/repositories/in-memory-owner.repository'
import { GetAllInvestmentService } from './get-all-investment.service'

describe('Get all investment service', () => {
  const investmentRepository = new InMemoryInvestmentRepository()
  investmentRepository.investments.push(
    {
      uuid: '',
      title: '',
      initialAmount: 100,
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      status: 'ACTIVE',
      createdAt: new Date('2024-05-1'),
    },
    {
      uuid: '',
      title: '',
      initialAmount: 200,
      ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
      status: 'ACTIVE',
      createdAt: new Date('2024-05-1'),
    },
  )
  const ownerRepository = new InMemoryOwnerRepository()

  ownerRepository.owners.push({
    name: '',
    uuid: 'c8c3h8hc33hc893hv3rv4tv89',
    email: '',
    createdAt: new Date(),
    password: 'password123',
  })
  it('should return error if owner not exists', async () => {
    const getAllInvestmentService = new GetAllInvestmentService(
      ownerRepository,
      investmentRepository,
    )

    const output = await getAllInvestmentService.execute('fake-uuid')

    expect(output).toBeInstanceOf(Error)
  })

  it('should return array of investments', async () => {
    const getAllInvestmentService = new GetAllInvestmentService(
      ownerRepository,
      investmentRepository,
    )

    const output = await getAllInvestmentService.execute('c8c3h8hc33hc893hv3rv4tv89')
    expect(output).toBeTruthy()
    expect(output).toHaveLength(2)
  })
})
