import type { FlattenMaps, Types } from 'mongoose'
import type { Investment } from '../../entities/investment'
import type {
  InvestmentRepository,
  updateInvestmentType,
} from '../../repositories/investment.repository'
import { InvestmentModel } from './investment.model'

export class MongooseInvestmentRepository implements InvestmentRepository {
  async save(investment: Investment): Promise<void> {
    try {
      InvestmentModel.create(investment)
    } catch (error) {
      console.log(error)
      throw new Error('Internal Server Error')
    }
  }
  async findInvestmentByUUID(
    ownerUUID: string,
    uuid: string,
  ): Promise<Investment | null> {
    try {
      const output = await InvestmentModel.findOne({ uuid, ownerUUID }).lean()
      if (!output) {
        return null
      }

      const { _id, ...investment } = output
      return investment
    } catch (error) {
      console.log(error)
      throw new Error('Internal Sever Error')
    }
  }
  async findAllInvestment(
    ownerUUID: string,
    limit: number,
    skip: number,
  ): Promise<Investment[]> {
    const output = await InvestmentModel.find({ ownerUUID })
      .skip(skip)
      .limit(limit)
      .lean()

    return output.map(toDomain)
  }

  async update(
    ownerUUID: string,
    uuid: string,
    data: updateInvestmentType,
  ): Promise<void> {
    await InvestmentModel.updateOne({ uuid, ownerUUID }, { $set: data })
  }
}

type investmentAllTypeMongoose = FlattenMaps<Investment> & {
  _id: Types.ObjectId
}
function toDomain(investmentMongoose: investmentAllTypeMongoose): Investment {
  const { _id, ...investment } = investmentMongoose
  return investment
}
