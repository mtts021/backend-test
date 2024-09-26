import { describe, expect, it, vi } from 'vitest'
import type { TokenProvider, payloadData } from '../ports/token.provider'
import { AuthorizationService } from './authorization.service'

describe('Authorization Service', () => {
  const tokenProvider: TokenProvider = {
    createToken: async (payload: payloadData): Promise<string> => {
      return `fake-token-${payload.uuid}`
    },
    verifyToken: async (token: string): Promise<payloadData | Error> => {
      const uuid = token.substring(11)
      return { uuid }
    },
  }
  it('should return uuid if token is valid', async () => {
    const authorizationService = new AuthorizationService(tokenProvider)
    const uuid = '8ad67c86-820b-4108-8f37-e60131540fdf'
    const token = `fake-token-${uuid}`
    const output = await authorizationService.execute(token)

    expect(output).toHaveProperty('uuid', uuid)
  })
})
