import { Schema, model } from 'mongoose'
import type { Owner } from '../../entities/owner'

export const ownerModel = model<Owner>(
  'Owner',
  new Schema({
    uuid: String,
    name: String,
    email: String,
    password: String,
    createdAt: Date,
    updatedAt: Date,
  }),
)
