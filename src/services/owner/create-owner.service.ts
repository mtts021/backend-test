import { randomUUID } from 'node:crypto'
import type { Owner } from '../../entities/owner'
import type { OwnerRepository } from '../../repositories/owner.repository'
import { type ApiError, UnprocessableEntityError } from '../../utils/api-error'
import type { EncryptProvider } from '../ports/encrypt.provider'

interface createOwnerRequest {
  name: string
  email: string
  password: string
}

export class CreateOwnerService {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly encryptProvider: EncryptProvider,
  ) {}

  async execute(request: createOwnerRequest): Promise<ApiError | Owner> {
    if (await this.ownerRepository.existOwner(request.email)) {
      return new UnprocessableEntityError('Owner already exist')
    }

    const passwordHash = await this.encryptProvider.encryptPassword(request.password)
    const owner: Owner = {
      ...request,
      password: passwordHash,
      uuid: randomUUID(),
      createdAt: new Date(),
    }

    await this.ownerRepository.save(owner)

    return owner
  }
}
