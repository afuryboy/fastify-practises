import { FastifyPluginAsync, FastifyRequest } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    try {
      const users =await fastify.prisma.user.findMany()
      return {
        data: users
      }
    } catch (error) {
      fastify.log.error('Failed to query user:', error as any)
    }
  })

  fastify.post('/user', async function (request:FastifyRequest<{Body: {name: string, email: string}}>, reply) {
    try {
      const {name, email} = request.body
      const newUser = await fastify.prisma.user.create({
        data: {
          name,
          email
        }
      })
      return {
        data: newUser
      }
    } catch (error) {
      fastify.log.error((error as Error).message)
      return reply.status(500).send({
        error: 'Internal server error'
      })
    }
  })
}

export default root
