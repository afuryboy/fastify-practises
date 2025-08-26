import { FastifyPluginAsync, FastifySchema } from 'fastify'

const schema:FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      type: 'string'
    }
  }
  
}

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', {schema},async function (request, reply) {
    return 'this is an example'
  })
}

export default example
