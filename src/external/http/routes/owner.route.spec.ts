import mongoose from 'mongoose'
import { afterAll, describe, expect, it } from 'vitest'
import { App } from '../../../app'
import { clearDatabaseOwner } from '../../../utils/mongoose'
import { makeConnection } from '../../database'

const app = new App()
makeConnection().then(() => {
  return
})

afterAll(async () => {
  await clearDatabaseOwner()
  mongoose.disconnect()
})
describe('owner', async () => {
  it('should be able create owner', async () => {
    const response = await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 'John Doe',
        email: 'john@email.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      },
    })

    const body = JSON.parse(response.body)
    expect(response.statusCode).toEqual(200)
    expect(body).toHaveProperty('uuid')
  })

  it('should response error INVALID_INPUT and status code 400', async () => {
    const response = await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 1,
        email: 'john@.com',
        password: '1234567',
        passwordConfirmation: '12345678',
      },
    })

    expect(response.statusCode).toEqual(400)
    const body = JSON.parse(response.body)
    expect(body).toHaveProperty('error')
    expect(body.error).toHaveProperty('code', 'INVALID_INPUT')
    expect(body.error).toHaveProperty('details')

    expect(body.error.details).toHaveProperty('name')
    expect(body.error.details).toHaveProperty('email')
    expect(body.error.details).toHaveProperty('password')
  })

  it('should response error INVALID_INPUT and status code 400 when password mismatched', async () => {
    const response = await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 'John',
        email: 'john@email.com',
        password: '123456789',
        passwordConfirmation: '12345678',
      },
    })

    expect(response.statusCode).toEqual(400)
    const body = JSON.parse(response.body)

    expect(body).toHaveProperty('error')
    expect(body.error).toHaveProperty('code', 'INVALID_INPUT')
    expect(body.error).toHaveProperty('message', 'password mismatched confirmation')
  })

  it('should response with error and status code 422 when owner already exist', async () => {
    await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 'John Doe',
        email: 'johnalreadyexist@email.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      },
    })
    const response = await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 'John Doe',
        email: 'johnalreadyexist@email.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      },
    })

    expect(response.statusCode).toEqual(422)
    const body = JSON.parse(response.body)
    expect(body.error).toHaveProperty('code', 'VALIDATION_ERROR')
    expect(body.error).toHaveProperty('message', 'Owner already exist')
  })
})

describe('/owner/login', async () => {
  it('should be able make login', async () => {
    await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 'John Doe',
        email: 'john@email.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      },
    })
    const response = await app.server.inject({
      method: 'POST',
      url: '/owner/login',
      body: {
        email: 'john@email.com',
        password: '12345678',
      },
    })
    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
    expect(body).toHaveProperty('accessToken')
  })
  it('should response status code 422 and code VALIDATION_ERROR', async () => {
    await app.server.inject({
      method: 'POST',
      url: '/owner',
      body: {
        name: 'John Doe',
        email: 'johnalreadyexist@email.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      },
    })

    const response = await app.server.inject({
      method: 'POST',
      url: '/owner/login',
      body: {
        email: 'johnalreadyexist@email.com',
        password: '12345679',
      },
    })

    expect(response.statusCode).toEqual(422)
    const body = JSON.parse(response.body)
    expect(body).toHaveProperty(['error', 'code'], 'VALIDATION_ERROR')
    expect(body).toHaveProperty(['error', 'message'], 'email or password incorrect')
  })
})
