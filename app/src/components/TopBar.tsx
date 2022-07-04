import Link from 'next/link'
import tailt from 'tailt'

export const TopBar = tailt.header`
    sticky top-0 z-30
    flex items-center justify-between
    h-16 px-4
    bg-[#dbfff8]
    dark:bg-[#112320]
    bg-opacity-70
`

export const BrandLabel = () => (
    <Link href='/'>
        <h1 className='font-bold text-2xl text-[#0b6655] dark:text-[#6bffc3] cursor-pointer select-none'>Talkana</h1>
    </Link>
)