import { useWallet } from '@solana/wallet-adapter-react'
import { useRef } from 'react'
import tailt from 'tailt'

export default function CreateMessage() {
    const { publicKey } = useWallet()
    const contentRef = useRef<HTMLTextAreaElement>(null)

    function sendMessageOnClick() {
        let content = contentRef.current?.value
        if(!content) return
        alert(`Your message: ${content}`)
    }
    
    return (
        <Message>
            <Content disabled={!publicKey} ref={contentRef} placeholder='Write your message here...' maxLength={64}/>
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
const Button = tailt.button`
    absolute bottom-4 right-4
    h-10 px-5
    rounded-full
    shadow-lg
    hover:scale-95 active:scale-100
    bg-sky-700 hover:bg-sky-600 active:bg-sky-500
    disabled:bg-slate-600
    duration-200 disabled:cursor-not-allowed
`