import { connect } from 'mongoose'

export async function makeConnection() {
  await connect('mongodb://root:root@localhost:27017/test?authSource=admin')
}
