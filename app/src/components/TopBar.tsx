import Link from 'next/link'
import tailt from 'tailt'

export const TopBar = tailt.header`
    sticky top-0 z-30 
    flex items-center justify-between
    w-full h-16 px-4 md:px-12
    bg-slate-900
    bg-opacity-70
    backdrop-blur-xl
`

export const BrandLabel = () => (
    <Link href='/'>
        <h1 className='font-bold text-2xl text-cyan-200 cursor-pointer select-none'>Talkana</h1>
    </Link>
)