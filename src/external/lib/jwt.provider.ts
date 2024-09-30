import jwt, { type SignOptions, JwtPayload } from 'jsonwebtoken'
import type { TokenProvider, payloadData } from '../../services/ports/token.provider'
import 'dotenv/config'
import { type ApiError, BadRequestError } from '../../utils/api-error'

export class JwtTokenProvider implements TokenProvider {
  async verifyToken(token: string): Promise<payloadData | ApiError> {
    try {
      const result = jwt.verify(token, <string>process.env.SECRET_KEY_JWT)
      if (typeof result !== 'object' || !result.uuid) {
        return new BadRequestError('invalid token')
      }
      const uuid = result.uuid
      return { uuid }
    } catch (error) {
      return new BadRequestError('invalid token')
    }
  }
  async createToken(payload: payloadData): Promise<string> {
    const { uuid } = payload
    const options: SignOptions = { expiresIn: '7d' }
    const accessToken = jwt.sign({ uuid }, <string>process.env.SECRET_KEY_JWT, options)
    return accessToken
  }
}
