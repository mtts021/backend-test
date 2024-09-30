import type { ApiError } from '../../utils/api-error'
import type { TokenProvider, payloadData } from '../ports/token.provider'

export class AuthorizationService {
  constructor(private readonly tokenProvider: TokenProvider) {}
  async execute(accessToken: string): Promise<payloadData | ApiError> {
    const output = this.tokenProvider.verifyToken(accessToken)

    return output
  }
}
