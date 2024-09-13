import type { EncryptProvider } from '../../src/services/ports/encrypt.provider'

export class TestExternalEncryptProvider implements EncryptProvider {
  async comparerPassword(password: string, passwordHash: string): Promise<boolean> {
    return password.split('').reverse().join('') === passwordHash
  }
  async encryptPassword(password: string): Promise<string> {
    return password.split('').reverse().join('')
  }
}
