import { AnchorProvider, Wallet } from "@project-serum/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { ConfirmOptions } from "@solana/web3.js"
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { MessageType } from "../utils/talkana"

interface TalkanaContextState {
    sendMessage(): Promise<void>
    allMessages: MessageType[]
}

const TalkanaContext = createContext<TalkanaContextState>({} as TalkanaContextState)

export const useTalkana = () => useContext(TalkanaContext)

export const TalkanaProvider = ({ children }: { children: ReactNode }) => {
    const [allMessages, setAllMessages] = useState<MessageType[]>([])
    const { connection } = useConnection()
    const wallet = useWallet()

    async function sendMessage() {
    }

    return (
        <TalkanaContext.Provider value={{ sendMessage, allMessages }}>
            {children}
        </TalkanaContext.Provider>
    )
}