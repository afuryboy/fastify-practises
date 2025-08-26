import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export default fp(async (fastify:FastifyInstance) => {
    await fastify.register(fastifySwagger)
    await fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs'
    })
})