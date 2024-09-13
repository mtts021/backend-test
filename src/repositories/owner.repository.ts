import type { Owner } from '../entities/owner'

export type OwnerRepository = {
  save(owner: Owner): Promise<void>
  findOwnerByUUID(ownerUUID: string): Promise<Owner | null>
  findOwnerByEmail(email: string): Promise<Owner | null>
  existOwner(email: string): Promise<boolean>
}
