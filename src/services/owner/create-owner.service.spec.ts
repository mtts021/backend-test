import { afterAll, describe, expect, it, vi } from 'vitest'
import { TestExternalEncryptProvider } from '../../../tests/external/test-external-encrypt.provider'
import { InMemoryOwnerRepository } from '../../../tests/repositories/in-memory-owner.repository'
import { CreateOwnerService } from './create-owner.service'

vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(() => 'f6a01205-081d-4b73-86d0-3e5e5c39d0f1'),
}))
describe('Create owner service', () => {
  const encryptPassword = new TestExternalEncryptProvider()
  const fixedDate = new Date()
  const mockDate = vi
    .spyOn(globalThis, 'Date')
    .mockImplementation(() => fixedDate as unknown as Date)

  afterAll(() => {
    mockDate.mockRestore()
  })

  it('should be able create owner', async () => {
    const ownerRepository = new InMemoryOwnerRepository()
    const createOwnerService = new CreateOwnerService(ownerRepository, encryptPassword)

    const owner = await createOwnerService.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'passwordFake',
    })

    expect(owner).toBeTruthy()
    expect(owner).toEqual({
      name: 'John Doe',
      email: 'john@email.com',
      password: await encryptPassword.encryptPassword('passwordFake'),
      uuid: 'f6a01205-081d-4b73-86d0-3e5e5c39d0f1',
      createdAt: fixedDate,
    })
  })

  it('should return an error with message', async () => {
    const ownerRepository = new InMemoryOwnerRepository()
    const createOwnerService = new CreateOwnerService(ownerRepository, encryptPassword)

    vi.spyOn(ownerRepository, 'existOwner').mockReturnValue(
      Promise<false> as unknown as Promise<false>,
    )
    const owner = await createOwnerService.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'passwordFake',
    })

    expect(owner).toBeInstanceOf(Error)
  })
})
