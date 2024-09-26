import { describe, expect, it, vi } from 'vitest'
import { TestExternalEncryptProvider } from '../../../tests/external/test-external-encrypt.provider'
import { InMemoryOwnerRepository } from '../../../tests/repositories/in-memory-owner.repository'
import type { TokenProvider, payloadData } from '../ports/token.provider'
import { Authentication } from './authentication.service'

describe('Authentication Service', () => {
  const tokenProvider: TokenProvider = {
    createToken: async (payload: payloadData): Promise<string> => {
      return `fake-token-${payload.uuid}`
    },
    verifyToken: (token: string): Promise<payloadData | Error> => {
      throw new Error('Function not implemented.')
    },
  }
  it('should return access token when match credentials', async () => {
    const encryptPassword = new TestExternalEncryptProvider()
    const ownerRepository = new InMemoryOwnerRepository()
    const authentication = new Authentication(
      ownerRepository,
      encryptPassword,
      tokenProvider,
    )

    vi.spyOn(encryptPassword, 'comparerPassword').mockReturnValue(Promise.resolve(true))
    ownerRepository.owners.push({
      uuid: 'fake-uuid',
      name: 'John Doe',
      email: 'john@email.com',
      password: 'password1234',
      createdAt: new Date(),
    })
    const accessToken = await authentication.execute('john@email.com', 'password1234')
    expect(accessToken).toHaveProperty('accessToken', 'fake-token-fake-uuid')
  })

  it('should return error when not found email', async () => {
    const encryptPassword = new TestExternalEncryptProvider()
    const ownerRepository = new InMemoryOwnerRepository()
    const authentication = new Authentication(
      ownerRepository,
      encryptPassword,
      tokenProvider,
    )
    const accessToken = await authentication.execute('john@email.com', 'password1234')
    expect(accessToken).toHaveProperty('message', 'email or password incorrect')
  })

  it('should return error when mismatch credentials', async () => {
    const encryptPassword = new TestExternalEncryptProvider()
    const ownerRepository = new InMemoryOwnerRepository()
    const authentication = new Authentication(
      ownerRepository,
      encryptPassword,
      tokenProvider,
    )

    vi.spyOn(encryptPassword, 'comparerPassword').mockReturnValue(Promise.resolve(false))
    const accessToken = await authentication.execute('john@email.com', 'password1234')
    expect(accessToken).toHaveProperty('message', 'email or password incorrect')
  })
})
