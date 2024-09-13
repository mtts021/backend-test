import type { Owner } from '../../src/entities/owner'
import type { OwnerRepository } from '../../src/repositories/owner.repository'

export class InMemoryOwnerRepository implements OwnerRepository {
  async findOwnerByEmail(email: string): Promise<Owner | null> {
    const owner = this.owners.find((owner) => owner.email === email)

    if (!owner) {
      return null
    }

    return owner
  }
  public owners: Owner[] = []
  async save(owner: Owner): Promise<void> {
    this.owners.push(owner)
  }
  async existOwner(email: string): Promise<boolean> {
    return !!this.owners.find((owner) => owner.email === email)
  }

  async findOwnerByUUID(ownerUUID: string): Promise<Owner | null> {
    const owner = this.owners.find((owner) => owner.uuid === ownerUUID)

    if (!owner) {
      return null
    }

    return owner
  }
}
