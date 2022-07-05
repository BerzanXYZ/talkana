import tailt from 'tailt'
import { MessageType } from '../utils/talkana'

export default function Message(mS: MessageType) {
    return (
        <MessageArticle>
            <MessageAuthor>{mS.author}</MessageAuthor>
            <MessageContent>{mS.content}</MessageContent>
            <MessageDate>{mS.timestamp?.toLocaleString()}</MessageDate>
            <MessageTopic>{mS.topic}</MessageTopic>
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
`
const MessageDate = tailt.h4`
    font-semibold text-sm
`