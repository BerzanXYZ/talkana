import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { ConfirmOptions, Keypair, SystemProgram } from "@solana/web3.js"
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { MessageType, TALKANA_IDL, TALKANA_PROGRAM_ID } from "../utils/talkana"

interface TalkanaContextState {
    sendMessage(msg: MessageType): Promise<void>
    allMessages: MessageType[]
    updateMessages(): Promise<void>
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
    const updateMessages = async () => {
        const program = getProgram()
        if(!program) return
        
        const messages: MessageType[] = (await program.account.message.all().catch()).map((msg) => {
            return {
                author: msg.account.author.toBase58(),
                topic: msg.account.topic,
                content: msg.account.content,
                timestamp: new Date( parseInt(msg.account.timestamp.toString()) *1000 ),
            }
        })
        
        setAllMessages(
            messages.sort((a,b) => {
                const x = a.timestamp
                const y = b.timestamp
                if(x>y) return -1
                if(x<y) return 1
                return 0
        }))
    }

    useEffect(() => { 
        updateMessages()
    }, [getProgram])

    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages, updateMessages }}>
            {children}
        </TalkanaContext.Provider>
    )
}