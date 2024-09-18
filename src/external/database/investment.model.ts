import { Schema, model } from 'mongoose'
import type { Investment } from '../../entities/investment'

export const InvestmentModel = model<Investment>(
  'Investment',
  new Schema({
    uuid: String,
    title: String,
    ownerUUID: String,
    initialAmount: Number,
    status: String,
    withdrawnAt: Date,
    createdAt: Date,
    updatedAt: Date,
  }),
)
