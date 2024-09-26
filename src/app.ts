import fastify, {
  type FastifyError,
  type FastifyRequest,
  type FastifyReply,
} from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import { authorizationMiddleware } from './external/http/middleware/authorization.middleware'
import { investmentRoute } from './external/http/routes/investment.route'
import { ownerRoute } from './external/http/routes/owner.route'

export class App {
  server = fastify({
    logger: true,
  })

  constructor() {
    this.routes()
    this.plugins()
  }

  routes() {
    this.server.get('/status', () => {
      return 'Hello World'
    })
    this.server.register(ownerRoute)
    this.server.register(investmentRoute)
  }

  plugins() {
    this.server.setValidatorCompiler(validatorCompiler)
    this.server.setSerializerCompiler(serializerCompiler)
    this.server.setErrorHandler(
      (error: FastifyError, req: FastifyRequest, res: FastifyReply) => {
        if (error instanceof ZodError) {
          return res.status(400).send({
            error: {
              code: 'INVALID_INPUT',
              details: error.flatten().fieldErrors,
            },
          })
        }

        res.status(500).send({ message: 'Internal server error' })
      },
    )
  }
}
