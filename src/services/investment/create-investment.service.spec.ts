import { describe, expect, it, vi } from 'vitest'
import { InMemoryInvestmentRepository } from '../../../tests/repositories/in-memory-investment.repository'
import { InMemoryOwnerRepository } from '../../../tests/repositories/in-memory-owner.repository'
import { CreateInvestmentService } from './create-investment.service'

describe('Create investment Service', () => {
  const ownerRepository = new InMemoryOwnerRepository()
  ownerRepository.owners.push({
    uuid: '16d91145-978d-4534-8f0f-178431ffd997',
    name: 'john',
    email: 'john@email.com',
    password: 'pw12345',
    createdAt: new Date(),
  })
  it('should be able create investment', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const createInvestmentService = new CreateInvestmentService(
      investmentRepository,
      ownerRepository,
    )

    const investment = await createInvestmentService.execute({
      title: 'Title fake',
      ownerUUID: '16d91145-978d-4534-8f0f-178431ffd997',
      initialAmount: 100,
    })

    expect(investment).toBeTruthy()
    expect(investment).toHaveProperty('status', 'ACTIVE')
  })

  it('should be able return an error if initial amount is negative or 0', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const createInvestmentService = new CreateInvestmentService(
      investmentRepository,
      ownerRepository,
    )

    expect(
      await createInvestmentService.execute({
        title: 'title fake',
        ownerUUID: '16d91145-978d-4534-8f0f-178431ffd997',
        initialAmount: 0,
      }),
    ).toBeInstanceOf(Error)
  })
  it('should be able return error if title less than 2', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const createInvestmentService = new CreateInvestmentService(
      investmentRepository,
      ownerRepository,
    )

    expect(
      await createInvestmentService.execute({
        title: '',
        ownerUUID: '16d91145-978d-4534-8f0f-178431ffd997',
        initialAmount: 100,
      }),
    ).toBeInstanceOf(Error)
  })

  it('should be able return error if title less than 2', async () => {
    const investmentRepository = new InMemoryInvestmentRepository()
    const ownerRepository = new InMemoryOwnerRepository()
    const createInvestmentService = new CreateInvestmentService(
      investmentRepository,
      ownerRepository,
    )

    expect(
      await createInvestmentService.execute({
        title: 'a'.repeat(256),
        ownerUUID: 'c8c3h8hc33hc893hv3rv4tv89',
        initialAmount: 100,
      }),
    ).toBeInstanceOf(Error)
  })
})
