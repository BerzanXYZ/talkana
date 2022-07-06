import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useRef } from 'react'
import tailt from 'tailt'
import { useTalkana } from '../contexts/TalkanaProvider'
import { MessageType } from '../utils/talkana'

export default function CreateMessage() {
    const { publicKey } = useWallet()
    const { sendMessage, updateMessages } = useTalkana()
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const topicRef = useRef<HTMLInputElement>(null)

    async function sendMessageOnClick() {
        if(!contentRef.current?.value) return
        let content = contentRef.current?.value

        const message: MessageType = {
            topic: topicRef.current?.value || 'no topic',
            content: content,
        }  as MessageType

        contentRef.current.value = ''
        if(topicRef.current) topicRef.current.value = ''
        
        await sendMessage(message)
        await updateMessages()
    }
    
    return (
        <Message>
            <Content disabled={!publicKey} ref={contentRef} placeholder='Write your message here...' maxLength={64}/>
            <Topic disabled={!publicKey} ref={topicRef} placeholder='Topic...' maxLength={16}/>
            <Button disabled={!publicKey} onClick={sendMessageOnClick}>Send</Button>
        </Message>
    )
}

const Message = tailt.div`
    relative flex
`
const Content = tailt.textarea`
    h-32 w-full p-4
    rounded-xl shadow-lg
    bg-slate-800 placeholder:text-slate-400
    font-medium outline-none resize-none duration-200 disabled:cursor-not-allowed
`
const Topic = tailt.input`
    absolute bottom-4 left-4
    px-2 py-1 rounded-md shadow-lg
    bg-slate-700 hover:bg-slate-600 active:bg-slate-700 placeholder:text-slate-300 hover:placeholder:text-slate-200
    font-medium text-sm duration-200 disabled:cursor-not-allowed outline-none
`
const Button = tailt.button`
    absolute bottom-4 right-4
    h-10 px-5
    rounded-full shadow-lg
    hover:scale-95 active:scale-100
    bg-sky-700 hover:bg-sky-600 active:bg-sky-500
    disabled:bg-slate-600
    duration-200 disabled:cursor-not-allowed
`