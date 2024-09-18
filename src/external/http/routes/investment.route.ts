import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CreateInvestmentService } from '../../../services/investment/create-investment.service'
import { GetInvestmentService } from '../../../services/investment/get-investment.service'
import { MongooseInvestmentRepository } from '../../database/mongoose-investment.repository'
import { MongooseOwnerRepository } from '../../database/mongoose-owner.repository'

const investmentRepository = new MongooseInvestmentRepository()
const ownerRepository = new MongooseOwnerRepository()
const createInvestmentService = new CreateInvestmentService(
  investmentRepository,
  ownerRepository,
)

const getInvestmentService = new GetInvestmentService(investmentRepository)

export async function investmentRoute(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/investment',
    {
      schema: {
        body: z.object({
          title: z.string().max(255),
          ownerUUID: z.string().uuid(),
          initialAmount: z.number().min(1),
        }),
      },
    },
    async (req, reply) => {
      const investment = await createInvestmentService.execute(req.body)

      if (investment instanceof Error) {
        return reply.status(422).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: investment.message,
          },
        })
      }
      reply.status(200).send({ uuid: investment.uuid })
    },
  )

  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/investment/:uuid',
    {
      schema: {
        params: z.object({
          uuid: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { uuid } = req.params

      const response = await getInvestmentService.execute(uuid)
      if (response instanceof Error) {
        return reply.send(422).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: response.message,
          },
        })
      }

      reply.status(200).send(response)
    },
  )
}
