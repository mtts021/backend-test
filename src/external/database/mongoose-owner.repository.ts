import { randomUUID } from 'node:crypto'
import { makeConnection } from '.'
import type { Owner } from '../../entities/owner'
import type { OwnerRepository } from '../../repositories/owner.repository'
import { ownerModel } from './owner'

export class MongooseOwnerRepository implements OwnerRepository {
  async save(owner: Owner): Promise<void> {
    ownerModel.create({ ...owner, created_at: owner.createdAt })
  }
  findOwnerByUUID(ownerUUID: string): Promise<Owner | null> {
    throw new Error('Method not implemented.')
  }
  findOwnerByEmail(email: string): Promise<Owner | null> {
    throw new Error('Method not implemented.')
  }
  existOwner(email: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}

const ownerRepository = new MongooseOwnerRepository()
