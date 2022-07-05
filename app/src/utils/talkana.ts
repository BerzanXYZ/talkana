import { Connection, PublicKey } from "@solana/web3.js"

export const getAirdrop = async (publicKey: PublicKey, connection: Connection)  => {
    // Request 1 SOL airdrop
    const sig = await connection.requestAirdrop(publicKey, 1e9)
    // Get latest block
    const latestBlock = await connection.getLatestBlockhash()
    // Confirm the airdrop transaction
    await connection.confirmTransaction({
        blockhash: latestBlock.blockhash,
        lastValidBlockHeight: latestBlock.lastValidBlockHeight,
        signature: sig,
    })
}

export interface MessageType {
    author: PublicKey,
    content: string,
    topic: string,
    timestamp: string,
}