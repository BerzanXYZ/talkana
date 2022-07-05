import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { ConfirmOptions, Keypair, SystemProgram } from "@solana/web3.js"
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { MessageType, TALKANA_IDL, TALKANA_PROGRAM_ID } from "../utils/talkana"

interface TalkanaContextState {
    sendMessage(msg: MessageType): Promise<void>
    allMessages: MessageType[]
}

const TalkanaContext = createContext<TalkanaContextState>({} as TalkanaContextState)

export const useTalkana = () => useContext(TalkanaContext)

export const TalkanaProvider = ({ children }: { children: ReactNode }) => {
    const [allMessages, setAllMessages] = useState<MessageType[]>([])
    const { connection } = useConnection()
    const wallet = useWallet()

    async function sendMessage(msg: MessageType) {
        if(!wallet.publicKey) return
        const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions())
        const program = new Program(TALKANA_IDL, TALKANA_PROGRAM_ID, provider)
        if(!program) return

        const msgAcc = Keypair.generate()
        
        const tx = await program.rpc.sendMessage('test', 'Hello solana!', {
            accounts: {
                author: wallet.publicKey,
                message: msgAcc.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [msgAcc]
        })
    }

    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages }}>
            {children}
        </TalkanaContext.Provider>
    )
}