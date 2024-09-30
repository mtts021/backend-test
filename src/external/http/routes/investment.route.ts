import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CreateInvestmentService } from '../../../services/investment/create-investment.service'
import { GetAllInvestmentService } from '../../../services/investment/get-all-investment.service'
import { GetInvestmentService } from '../../../services/investment/get-investment.service'
import { WithdrawInvestmentService } from '../../../services/investment/withdraw-investment.service'
import { ApiError } from '../../../utils/api-error'
import { MongooseInvestmentRepository } from '../../database/mongoose-investment.repository'
import { MongooseOwnerRepository } from '../../database/mongoose-owner.repository'
import { authorizationMiddleware } from '../middleware/authorization.middleware'

const investmentRepository = new MongooseInvestmentRepository()
const ownerRepository = new MongooseOwnerRepository()
const createInvestmentService = new CreateInvestmentService(
  investmentRepository,
  ownerRepository,
)

const getInvestmentService = new GetInvestmentService(investmentRepository)
const getAllInvestmentService = new GetAllInvestmentService(
  ownerRepository,
  investmentRepository,
)

const withdrawInvestmentService = new WithdrawInvestmentService(
  investmentRepository,
  new Date(),
)

export async function investmentRoute(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authorizationMiddleware)
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/investment',
    {
      schema: {
        body: z.object({
          title: z.string().max(255),
          initialAmount: z.number().min(1),
        }),
      },
    },
    async (req, reply) => {
      const { title, initialAmount } = req.body
      const ownerUUID = req.owner?.uuid as string
      const investment = await createInvestmentService.execute({
        title,
        ownerUUID,
        initialAmount,
      })

      if (investment instanceof ApiError) {
        return reply.status(investment.statusCode).send({
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
    '/investment/expect-balance/:uuid',
    {
      schema: {
        params: z.object({
          uuid: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { uuid } = req.params
      const ownerUUID = req.owner?.uuid as string

      const response = await getInvestmentService.execute(ownerUUID, uuid)
      if (response instanceof Error) {
        return reply.send(response.statusCode).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: response.message,
          },
        })
      }

      reply.status(200).send(response)
    },
  )

  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/investment/',
    {
      schema: {
        querystring: z.object({
          skip: z.number().positive().optional(),
        }),
      },
    },
    async (req, reply) => {
      const ownerUUID = req.owner?.uuid as string
      const { skip } = req.query
      const response = await getAllInvestmentService.execute(ownerUUID, skip)
      if (response instanceof ApiError) {
        return reply.send(response.statusCode).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: response.message,
          },
        })
      }

      reply.status(200).send(response)
    },
  )

  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/investment/withdraw/:uuid',
    {
      schema: {
        params: z.object({
          uuid: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { uuid } = req.params
      const ownerUUID = req.owner?.uuid as string
      const response = await withdrawInvestmentService.execute(ownerUUID, uuid)
      if (response instanceof ApiError) {
        return reply.send(response.statusCode).send({
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
