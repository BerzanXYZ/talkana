import Link from 'next/link'
import tailt from 'tailt'

export const TextHolder = tailt.div`
    flex
`

const LinkTextSelf = tailt.h2`
    font-semibold text-lg
    text-sky-500 cursor-pointer
`
interface LinkTextState { href: string, children: string }
export const LinkText = ({ href, children}: LinkTextState) => (
    <Link href={href}>
        <LinkTextSelf>{children}</LinkTextSelf>
    </Link>
)

export const Text = tailt.p`
    font-medium text-lg
    text-cyan-200
`