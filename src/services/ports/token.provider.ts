export interface payloadData {
  uuid: string
}

export interface TokenProvider {
  createToken(payload: payloadData): Promise<string>
  verifyToken(token: string): Promise<payloadData | Error>
}
