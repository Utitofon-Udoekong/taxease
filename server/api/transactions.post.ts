import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

export default defineEventHandler(async (event) => {
    const address = await readBody(event)
    try {
        const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
                baseURL: 'https://sepolia.gateway.request.network/',
            },
        });
        const requestData = await requestClient.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: address,
        });
    
        const requestDatas: ServerTransaction[] = requestData.map((request) => {
            const data = request.getData();
            return normalizeServerTransaction(data)
        });
        return requestDatas;
    } catch (error) {
        console.error(error)
        return error;
    }
})