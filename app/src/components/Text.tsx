import Link from 'next/link'
import tailt from 'tailt'

const LinkTextSelf = tailt.h2`
    font-medium text-lg
    text-sky-500
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