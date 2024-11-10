import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { App } from '../../../app'
import { clearDatabaseInvestment, clearDatabaseOwner } from '../../../utils/mongoose'
import { makeConnection } from '../../database'
import 'dotenv/config'

describe('/investment', async () => {
  const app = new App()
  await makeConnection(process.env.CONNECTION_STRING_MONGO_TMPFS)

  let accessToken: string

  beforeAll(async () => {
    await app.server.ready()

    await request(app.server.server).post('/owner').send({
      name: 'John Doe',
      email: 'john@email.com',
      password: '12345678',
      passwordConfirmation: '12345678',
    })

    const responseLogin = await request(app.server.server)
      .post('/owner/login')
      .send({ email: 'john@email.com', password: '12345678' })
    accessToken = (<{ accessToken: string }>responseLogin.body).accessToken
  })
  afterEach(async () => {
    await clearDatabaseInvestment()
  })

  afterAll(async () => {
    await clearDatabaseOwner()
    mongoose.disconnect()
    app.server.close
  })

  it('should be able create investment', async () => {
    const response = await request(app.server.server)
      .post('/investment')
      .send({
        title: 'Investment 1',
        initialAmount: 1200.0,
      })
      .set('authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('uuid')
  })
  it('should respond with expected balance', async () => {
    const resCreateInvestment = await request(app.server.server)
      .post('/investment')
      .send({
        title: 'Investment 1',
        initialAmount: 1200.0,
      })
      .set('authorization', `Bearer ${accessToken}`)

    const { uuid } = <{ uuid: string }>resCreateInvestment.body

    const response = await request(app.server.server)
      .get(`/investment/expected-balance/${uuid}`)
      .set('authorization', `Bearer ${accessToken}`)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('expectedBalance')
  })

  it('should respond with balance gain', async () => {
    const resCreateInvestment = await request(app.server.server)
      .post('/investment')
      .send({
        title: 'Investment 1',
        initialAmount: 1200.0,
      })
      .set('authorization', `Bearer ${accessToken}`)

    const { uuid } = <{ uuid: string }>resCreateInvestment.body

    await request(app.server.server)
      .get(`/investment/withdraw/${uuid}`)
      .set('authorization', `Bearer ${accessToken}`)

    const response = await request(app.server.server)
      .get(`/investment/expected-balance/${uuid}`)
      .set('authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('balanceGain')
  })

  it('should be able withdraw an investment', async () => {
    const resCreateInvestment = await request(app.server.server)
      .post('/investment')
      .send({
        title: 'Investment 1',
        initialAmount: 1200.0,
      })
      .set('authorization', `Bearer ${accessToken}`)

    const { uuid } = <{ uuid: string }>resCreateInvestment.body

    const response = await request(app.server.server)
      .get(`/investment/withdraw/${uuid}`)
      .set('authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('taxa')
    expect(response.body).toHaveProperty('finalBalance')
  })

  it('should respond with status code 400 if the uuid parameter is missing', async () => {
    const response = await request(app.server.server)
      .get('/investment/withdraw/invalid-uuid')
      .set('authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(400)

    expect(response.body).toHaveProperty(['error', 'code'], 'INVALID_INPUT')
    expect(response.body).toHaveProperty(['error', 'details', 'uuid'])
  })

  it('should respond with investments', async () => {
    await Promise.all([
      request(app.server.server)
        .post('/investment')
        .send({
          title: 'Investment 1',
          initialAmount: 1200.0,
        })
        .set('authorization', `Bearer ${accessToken}`),
      request(app.server.server)
        .post('/investment')
        .send({
          title: 'Investment 1',
          initialAmount: 1200.0,
        })
        .set('authorization', `Bearer ${accessToken}`),
      request(app.server.server)
        .post('/investment')
        .send({
          title: 'Investment 1',
          initialAmount: 1200.0,
        })
        .set('authorization', `Bearer ${accessToken}`),
    ])
    const response = await request(app.server.server)
      .get('/investment')
      .set('authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toHaveLength(3)
  })
})
