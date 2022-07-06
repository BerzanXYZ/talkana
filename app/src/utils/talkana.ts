import { PublicKey } from "@solana/web3.js"
import { IDL } from "./talkanatype"

// Constant values for Talkana program
export const TALKANA_IDL = IDL
export const TALKANA_PROGRAM_ID: PublicKey = new PublicKey("6w18Ct9KbWY7qtVmkzZX8E8HLHhAT3qhHNCcjh5SuTT6")

// Message type that represents a message
export interface MessageType {
    author: string,
    content: string,
    topic: string,
    timestamp: Date,
}

export function sortMessages(a: MessageType ,b: MessageType) {
    const x = a.timestamp
    const y = b.timestamp
    if(x>y) return -1
    if(x<y) return 1
    return 0
}


