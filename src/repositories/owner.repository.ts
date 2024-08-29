import type { Owner } from './entities/owner'

export type OwnerRepository = {
  save(owner: Owner): Promise<void>
  existOwner(email: string): Promise<boolean>
}
