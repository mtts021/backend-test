import jwt, { type SignOptions } from 'jsonwebtoken'
import type { TokenProvider, payloadData } from '../../services/ports/token.provider'
import 'dotenv/config'

export class JwtTokenProvider implements TokenProvider {
  async createToken(payload: payloadData): Promise<string> {
    const { uuid } = payload
    const options: SignOptions = { expiresIn: '7d' }
    const accessToken = jwt.sign({ uuid }, <string>process.env.SECRET_KEY_JWT, options)
    return accessToken
  }
}
