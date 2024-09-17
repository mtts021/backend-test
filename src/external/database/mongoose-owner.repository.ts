import type { Owner } from '../../entities/owner'
import type { OwnerRepository } from '../../repositories/owner.repository'
import { ownerModel } from './owner'

export class MongooseOwnerRepository implements OwnerRepository {
  async save(owner: Owner): Promise<void> {
    ownerModel.create({ ...owner, created_at: owner.createdAt })
  }
  async findOwnerByUUID(ownerUUID: string): Promise<Owner | null> {
    const output = await ownerModel.findOne({ uuid: ownerUUID }).lean()
    if (!output) {
      return null
    }
    const { _id, ...owner } = output

    return owner
  }
  async findOwnerByEmail(email: string): Promise<Owner | null> {
    const output = await ownerModel.findOne({ email }).lean()
    if (!output) {
      return null
    }
    const { _id, ...owner } = output

    return owner
  }
  async existOwner(email: string): Promise<boolean> {
    return !!(await ownerModel.findOne({ email }).lean())
  }
}
