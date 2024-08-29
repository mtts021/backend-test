import type { Owner } from '../../src/entities/owner'
import type { OwnerRepository } from '../../src/owner.repository'

export class InMemoryOwnerRepository implements OwnerRepository {
  public owners: Owner[] = []
  async save(owner: Owner): Promise<void> {
    this.owners.push(owner)
  }
  async existOwner(email: string): Promise<boolean> {
    return !!this.owners.find((owner) => owner.email === email)
  }
}
