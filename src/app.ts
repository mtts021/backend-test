import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
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
  }

  plugins() {
    this.server.setValidatorCompiler(validatorCompiler)
    this.server.setSerializerCompiler(serializerCompiler)
  }
}
