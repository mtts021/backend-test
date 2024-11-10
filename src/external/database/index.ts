import { connect } from 'mongoose'
import 'dotenv/config'

const nodeEnv = <string>process.env.NODE_ENV
export async function makeConnection(
  connectionString = process.env.CONNECTION_STRING as string,
) {
  if (nodeEnv === 'docker') {
    return await connect(process.env.CONNECTION_STRING_MONGO as string)
  }

  return await connect(connectionString)
}
