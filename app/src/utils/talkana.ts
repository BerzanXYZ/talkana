import { Connection, PublicKey } from "@solana/web3.js"

export const getAirdrop = async (publicKey: PublicKey, connection: Connection)  => {
    const sig = await connection.requestAirdrop(publicKey, 1e9)

    const latestBlock = await connection.getLatestBlockhash()

    await connection.confirmTransaction({
        blockhash: latestBlock.blockhash,
        lastValidBlockHeight: latestBlock.lastValidBlockHeight,
        signature: sig,
    })
}