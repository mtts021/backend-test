import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    owner?: {
      uuid: string
    }
  }
}
