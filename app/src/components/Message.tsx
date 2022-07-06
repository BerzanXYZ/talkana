import tailt from 'tailt'
import { MessageType } from '../utils/talkana'

export default function Message(msg: MessageType) {
    return (
        <MessageArticle>
            <MessageAuthor>{msg.author}</MessageAuthor>
            <MessageContent>{msg.content}</MessageContent>
            <DivMetaData>
                <MessageTopic>{msg.topic} •</MessageTopic>
                <MessageDate>{msg.timestamp?.toLocaleString()}</MessageDate>
                </DivMetaData>
        </MessageArticle>
    )
}

const MessageArticle = tailt.article`
    flex flex-col
    rounded-xl
    p-4 gap-y-5
    shadow-lg
    bg-slate-800
`
const MessageAuthor = tailt.h3`
    font-medium text-sm
    opacity-50
    cursor-pointer
`
const MessageContent = tailt.p`
    font-medium
`
const MessageTopic = tailt.h4`
    font-semibold text-sm
    px-2 py-1 rounded-md
    bg-slate-700 cursor-pointer select-none
`
const MessageDate = tailt.h4`
    font-semibold text-sm
    opacity-50 select-none
`
const DivMetaData = tailt.div`
    flex justify-between
`