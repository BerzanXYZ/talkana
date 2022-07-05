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

    const getProgram = useCallback(() => {
        if(!wallet.publicKey) return
        const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions())
        return new Program(TALKANA_IDL, TALKANA_PROGRAM_ID, provider)   
    }, [wallet, connection])

    async function sendMessage(msg: MessageType) {
        const program = getProgram()
        if(!program || !wallet.publicKey) return

        const msgAcc = Keypair.generate()

        const tx = await program.rpc.sendMessage(msg.topic, msg.content, {
            accounts: {
                author: wallet.publicKey,
                message: msgAcc.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [msgAcc]
        })
    }

    useEffect(() => {
        const fetchAllMessages = async () => {
            const program = getProgram()
            if(!program) return
            
            const messages = (await program.account.message.all().catch()).map((msg) => {
                return ({
                    author: msg.account.author.toBase58(),
                    topic: msg.account.topic,
                    content: msg.account.content,
                    timeStamp: msg.account.timestamp.toString()
                } as unknown as MessageType)
            })
            setAllMessages(messages)
        }
        fetchAllMessages()
    }, [getProgram])

    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages }}>
            {children}
        </TalkanaContext.Provider>
    )
}