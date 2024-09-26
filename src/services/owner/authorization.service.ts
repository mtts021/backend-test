import type { TokenProvider, payloadData } from '../ports/token.provider'

export class AuthorizationService {
  constructor(private readonly tokenProvider: TokenProvider) {}
  async execute(accessToken: string): Promise<payloadData | Error> {
    const output = this.tokenProvider.verifyToken(accessToken)

    return output
  }
}
