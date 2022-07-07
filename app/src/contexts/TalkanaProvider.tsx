import { AnchorProvider, Program, Wallet } from "@project-serum/anchor"
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, Keypair, SystemProgram } from "@solana/web3.js"
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { filterMessages, MessageType, sortMessages, TALKANA_IDL, TALKANA_PROGRAM_ID } from "../utils/talkana"

interface TalkanaContextState {
    sendMessage(msg: MessageType): Promise<void>
    allMessages: MessageType[]
    updateMessages(): Promise<void>
    setSpecifiedAddress: Dispatch<SetStateAction<string>>
    setSpecifiedTopic: Dispatch<SetStateAction<string>>
}

const TalkanaContext = createContext<TalkanaContextState>({} as TalkanaContextState)

export const useTalkana = () => useContext(TalkanaContext)

export const TalkanaProvider = ({ children }: { children: ReactNode }) => {
    const [allMessages, setAllMessages] = useState<MessageType[]>([])
    const [specifiedAddress, setSpecifiedAddress] = useState<string>('')
    const [usedSpecifiedAddress, setUsedSpecifiedAddress] = useState<string>('')
    const [specifiedTopic, setSpecifiedTopic] = useState<string>('')
    const [usedSpecifiedTopic, setUsedSpecifiedTopic] = useState<string>('')

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
        setAllMessages( messages.filter(filterMessages).sort(sortMessages) )
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
        setAllMessages( messages.filter(filterMessages).sort(sortMessages) )
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

    // If user specifies an address, update allMessages as the messages from this address
    useEffect(() => {
        (async() => {
            const program = getProgram()
            
            if(!program || !specifiedAddress) return

            if(specifiedAddress !== usedSpecifiedAddress) {
                // Fetch messages filtered by an address
                const messages: MessageType[] = (await (program.account.message.all([{
                    memcmp: {offset: 8, bytes: specifiedAddress},
                }]))).map(msg => {
                    return {
                        author: msg.account.author.toBase58(),
                        topic: msg.account.topic,
                        content: msg.account.content,
                        timestamp: new Date( parseInt(msg.account.timestamp.toString()) *1000 ),
                     }
                })
                // Sort and set allMessages
                setAllMessages( messages.filter(filterMessages).sort(sortMessages) )
                // Set used address as specified address
                setUsedSpecifiedAddress(specifiedAddress)
                // Set specifed address as empty to be able to run this effect
                // when the user specifies the same address again
                setSpecifiedAddress('')
            } else {
                setUsedSpecifiedAddress('')
                // If user has already specified the same address, disable filtering, show all messages
                updateMessages()
                // Set specifed address as empty to be able to run this effect
                // when the user specifies the same address again
                setSpecifiedAddress('')
            }
        })()
    }, [specifiedAddress])


    // If user specifies a topic, update allMessages as the messages on this topic
    useEffect(() => {
        (async () => {
            const program = getProgram()
            
            if(!program || !specifiedTopic) return

            if(specifiedTopic !== usedSpecifiedTopic) {
                // Fetch messages speficed by a topic
                const messages: MessageType[] = (await program.account.message.all([{
                    memcmp: { offset: 52, bytes: bs58.encode(Buffer.from(specifiedTopic)) },
                }])).map(msg => {
                    return {
                        author: msg.account.author.toBase58(),
                        topic: msg.account.topic,
                        content: msg.account.content,
                        timestamp: new Date( parseInt(msg.account.timestamp.toString()) *1000 ),
                    }
                })
                // Sort and set allMessages
                setAllMessages( messages.filter(filterMessages).sort(sortMessages) )
                // Set used topic as specified topic
                setUsedSpecifiedTopic(specifiedTopic)
                // Set specifed topic as empty to be able to run this effect
                // when the user specifies the same topic again
                setSpecifiedTopic('')
            } else {
                setUsedSpecifiedTopic('')
                updateMessages()
                // Set specifed topic as empty to be able to run this effect
                // when the user specifies the same topic again
                setSpecifiedTopic('')
            }
        })()
    }, [specifiedTopic])

    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages, updateMessages, setSpecifiedAddress, setSpecifiedTopic }}>
            {children}
        </TalkanaContext.Provider>
    )
}