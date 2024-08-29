import { randomUUID } from 'node:crypto'
import type { Owner } from './owner'
import type { OwnerRepository } from './owner.repository'

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

    return owner
  }
}
