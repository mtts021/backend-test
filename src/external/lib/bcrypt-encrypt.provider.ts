import bcrypt from 'bcrypt'
import type { EncryptProvider } from '../../services/ports/encrypt.provider'

export class BcryptEncryptProvider implements EncryptProvider {
  async encryptPassword(password: string): Promise<string> {
    const pwHash = bcrypt.hashSync(password, 10)
    return pwHash
  }
  async comparerPassword(password: string, passwordHash: string): Promise<boolean> {
    const match = bcrypt.compareSync(password, passwordHash)

    return match
  }
}
