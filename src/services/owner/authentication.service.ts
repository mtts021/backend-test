import type { OwnerRepository } from '../../repositories/owner.repository'
import { UnprocessableEntityError } from '../../utils/api-error'
import type { EncryptProvider } from '../ports/encrypt.provider'
import type { TokenProvider } from '../ports/token.provider'

export class Authentication {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly encryptProvider: EncryptProvider,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(email: string, password: string) {
    const owner = await this.ownerRepository.findOwnerByEmail(email)

    if (!owner) {
      return new UnprocessableEntityError('email or password incorrect')
    }

    const isMatch = await this.encryptProvider.comparerPassword(password, owner.password)
    if (!isMatch) {
      return new UnprocessableEntityError('email or password incorrect')
    }

    const accessToken = await this.tokenProvider.createToken({ uuid: owner.uuid })
    return {
      accessToken,
    }
  }
}
