import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthorizationService } from '../../../services/owner/authorization.service'
import { JwtTokenProvider } from '../../lib/jwt.provider'

export async function authorizationMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenProvider = new JwtTokenProvider()

  const authorizationService = new AuthorizationService(tokenProvider)

  const authHeaders = request.headers.authorization
  if (!authHeaders) {
    return reply.status(401).send({
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Credentials not informed',
      },
    })
  }

  const [authType, token] = authHeaders.split(' ')
  if (authType !== 'Bearer' || !token) {
    return reply.status(400).send({
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid authentication type',
      },
    })
  }
  const output = await authorizationService.execute(token)
  if (output instanceof Error) {
    return reply.status(400).send({
      error: {
        code: 'INVALID_INPUT',
        message: output.message,
      },
    })
  }

  request.owner = output
}
