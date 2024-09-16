import { Schema, model } from 'mongoose'

export const ownerModel = model(
  'Owner',
  new Schema({
    uuid: String,
    name: String,
    email: String,
    password: String,
    created_at: Date,
    updated_at: Date,
  }),
)
