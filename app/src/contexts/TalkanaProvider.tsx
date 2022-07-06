import { AnchorProvider, Program, Wallet } from "@project-serum/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, Keypair, SystemProgram } from "@solana/web3.js"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { MessageType, sortMessages, TALKANA_IDL, TALKANA_PROGRAM_ID } from "../utils/talkana"

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
        setAllMessages( messages.sort(sortMessages) )
    }
    
    // Updates all messages without using user's wallet and connection
    const updateMessagesIfNotConnected = async () => {
        const provider = new AnchorProvider(new Connection(clusterApiUrl('devnet'),'confirmed'), {} as Wallet, AnchorProvider.defaultOptions())
        const program = new Program(TALKANA_IDL, TALKANA_PROGRAM_ID, provider)
        const messages: MessageType[] = (await program.account.message.all()).map(msg => {
            return {
                author: msg.account.author.toBase58(),
                topic: msg.account.topic,
                content: msg.account.content,
                timestamp: new Date( parseInt(msg.account.timestamp.toString()) * 1000 ),
            }
        })
        // Sort and set allMessages
        setAllMessages( messages.sort(sortMessages) )
    }


    // Updates allMessages when page gets loaded
    useEffect(() => { 
        if(wallet.publicKey && connection) {
            updateMessages()
         } else {
            updateMessagesIfNotConnected()
        }
    }, [])

    // Request 1 SOL airdrop for once when wallet gets connected
    useEffect(() => {
        (async() => {
            if(!wallet.publicKey) return
            // If it didn't request airdrop before, do so
            if(!localStorage.getItem('airdrop')) {
                const latestBlock = await connection.getLatestBlockhash()
                await connection.confirmTransaction({
                blockhash: latestBlock.blockhash,
                lastValidBlockHeight:latestBlock.lastValidBlockHeight,
                signature: await connection.requestAirdrop(wallet.publicKey, 1e9)
                })
                localStorage.setItem('airdrop', 'yes')
                alert('🎁 Berzan gave you 1 SOL to send a message ;)')
            }
        })()
    }, [wallet.publicKey])



    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages, updateMessages }}>
            {children}
        </TalkanaContext.Provider>
    )
}