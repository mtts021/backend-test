import type { EncryptProvider } from '../../src/services/ports/encrypt.provider'

export class TestExternalEncryptProvider implements EncryptProvider {
  async encryptPassword(password: string): Promise<string> {
    return password.split('').reverse().join('')
  }
}
