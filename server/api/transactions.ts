import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

export default defineEventHandler(async (event) => {
    try {
        const requestClient = new RequestNetwork({
            nodeConnectionConfig: {
                baseURL: 'https://sepolia.gateway.request.network/',
            },
        });
        const identityAddress = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";
        const requestData = await requestClient.fromIdentity({
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: identityAddress,
        });
        const requestDatas = requestData.map((request) => request.getData());
        return requestDatas;
    } catch (error) {
        console.error(error)
        return error;
    }
})