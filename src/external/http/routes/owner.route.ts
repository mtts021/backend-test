import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CreateOwnerService } from '../../../services/owner/create-owner.service'
import { MongooseOwnerRepository } from '../../database/mongoose-owner.repository'
import { BcryptEncryptProvider } from '../../lib/bcrypt-encrypt.provider'

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
      if (owner instanceof Error) {
        return reply.status(422).send({
          error: { code: 'VALIDATION_ERROR', message: owner.message },
        })
      }
      reply.status(200).send({ uuid: owner.uuid })
    },
  )
}
