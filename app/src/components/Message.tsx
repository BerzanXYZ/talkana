import tailt from 'tailt'
import { useTalkana } from '../contexts/TalkanaProvider'
import { MessageType } from '../utils/talkana'

export default function Message(msg: MessageType) {
    const { setSpecifiedAddress, setSpecifiedTopic } = useTalkana()

    return (
        <MessageArticle>
            <MessageAuthor onClick={() => setSpecifiedAddress(msg.author)}>{msg.author}</MessageAuthor>
            <MessageContent>{msg.content}</MessageContent>
            <DivMetaData>
                <MessageTopic onClick={() => setSpecifiedTopic(msg.topic)}>{msg.topic} •</MessageTopic>
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
    font-medium text-xs sm:text-sm
    opacity-50 hover:opacity-80 active:opacity-100
    hover:text-cyan-200 active:text-white
    cursor-pointer select-none duration-200
`
const MessageContent = tailt.p`
    font-medium
`
const MessageTopic = tailt.h4`
    font-semibold text-sm
    px-2 py-1 rounded-md
    bg-slate-700 hover:bg-slate-600 active:bg-slate-400
    cursor-pointer select-none duration-200
`
const MessageDate = tailt.h4`
    font-semibold text-sm
    opacity-50 select-none
`
const DivMetaData = tailt.div`
    flex justify-between
`