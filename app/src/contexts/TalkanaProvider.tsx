import { AnchorProvider, Program, Wallet } from "@project-serum/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram } from "@solana/web3.js"
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

    // Returns program
    const getProgram = useCallback(() => {
        if(!wallet.publicKey) return
        const provider = new AnchorProvider(connection, wallet as unknown as Wallet, AnchorProvider.defaultOptions())
        return new Program(TALKANA_IDL, TALKANA_PROGRAM_ID, provider)   
    }, [wallet, connection])


    // Sends message to the program
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


    // Updates allMessages data
    const updateMessages = async () => {
        const program = getProgram()
        if(!program) return
        
        // Fetch messages from the program
        const messages: MessageType[] = (await (program.account.message.all())).map((msg) => {
            return {
                author: msg.account.author.toBase58(),
                topic: msg.account.topic,
                content: msg.account.content,
                timestamp: new Date( parseInt(msg.account.timestamp.toString()) *1000 ),
            }
        })
        // Sort and set allMessages
        setAllMessages(
            messages.sort((a,b) => {
                const x = a.timestamp
                const y = b.timestamp
                if(x>y) return -1
                if(x<y) return 1
                return 0
        }))
    }

/*
    // Updates allMessages when wallet or connection changes
    useEffect(() => { 
        updateMessages()
    }, [connection]) */


    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages, updateMessages }}>
            {children}
        </TalkanaContext.Provider>
    )
}