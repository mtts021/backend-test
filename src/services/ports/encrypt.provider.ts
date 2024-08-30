export interface EncryptProvider {
  encryptPassword(password: string): Promise<string>
}
