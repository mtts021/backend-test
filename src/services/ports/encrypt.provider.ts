export interface EncryptProvider {
  encryptPassword(password: string): Promise<string>
  comparerPassword(password: string, passwordHash: string): Promise<boolean>
}
