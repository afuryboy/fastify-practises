import { FastifyPluginAsync } from "fastify";
import { sseControl, sendSSEControl } from "../../controls/sse.control";


const sse : FastifyPluginAsync = async (fastify, opts) : Promise<void> => {
    fastify.get('/', sseControl)

    fastify.post('/send', sendSSEControl)
}

export default sse