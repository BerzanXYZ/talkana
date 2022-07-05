import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export const getAirdrop = async ()  => {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    if(!publicKey) return

    const sig = await connection.requestAirdrop(publicKey, 1e9)
    
    const latestBlock = await connection.getLatestBlockhash()

    await connection.confirmTransaction({
        blockhash: latestBlock.blockhash,
        lastValidBlockHeight: latestBlock.lastValidBlockHeight,
        signature: sig,
    })
}