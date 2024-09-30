import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { Authentication } from '../../../services/owner/authentication.service'
import { CreateOwnerService } from '../../../services/owner/create-owner.service'
import { ApiError } from '../../../utils/api-error'
import { MongooseOwnerRepository } from '../../database/mongoose-owner.repository'
import { BcryptEncryptProvider } from '../../lib/bcrypt-encrypt.provider'
import { JwtTokenProvider } from '../../lib/jwt.provider'

const createOwnerService = new CreateOwnerService(
  new MongooseOwnerRepository(),
  new BcryptEncryptProvider(),
)
export async function ownerRoute(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/owner',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
        }),
      },
    },
    async (req, reply) => {
      const { password, passwordConfirmation } = req.body

      if (password !== passwordConfirmation) {
        return reply.status(400).send({
          error: { code: 'INVALID_INPUT', message: 'password mismatched confirmation' },
        })
      }

      const { name, email } = req.body
      const owner = await createOwnerService.execute({ name, email, password })
      if (owner instanceof ApiError) {
        return reply.status(owner.statusCode).send({
          error: { code: 'VALIDATION_ERROR', message: owner.message },
        })
      }
      reply.status(200).send({ uuid: owner.uuid })
    },
  )

  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/owner/login',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (req, reply) => {
      const { email, password } = req.body

      const ownerRepository = new MongooseOwnerRepository()
      const encryptProvider = new BcryptEncryptProvider()
      const tokenProvider = new JwtTokenProvider()
      const authenticationService = new Authentication(
        ownerRepository,
        encryptProvider,
        tokenProvider,
      )

      const accessToken = await authenticationService.execute(email, password)
      if (accessToken instanceof ApiError) {
        return reply
          .status(accessToken.statusCode)
          .send({ error: { code: 'VALIDATION_ERROR', message: accessToken.message } })
      }
      return reply.status(200).send(accessToken)
    },
  )
}
