import { randomUUID } from 'node:crypto'
import type { Owner } from '../../entities/owner'
import type { OwnerRepository } from '../../repositories/owner.repository'

interface createOwnerRequest {
  name: string
  email: string
  password: string
}

export class CreateOwnerService {
  constructor(private readonly ownerRepository: OwnerRepository) {}

  async execute(request: createOwnerRequest): Promise<Error | Owner> {
    if (await this.ownerRepository.existOwner(request.email)) {
      return new Error('Owner already exist')
    }

    const owner: Owner = { ...request, uuid: randomUUID(), createdAt: new Date() }

    await this.ownerRepository.save(owner)

    return owner
  }
}
