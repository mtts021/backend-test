import { InvestmentModel } from '../external/database/investment.model'
import { ownerModel } from '../external/database/owner'

export async function clearDatabaseOwner() {
  await ownerModel.deleteMany({})
}
export async function clearDatabaseInvestment() {
  await InvestmentModel.deleteMany({})
}
