import tailt from 'tailt'
import { useWallet } from '../contexts/WalletProvider'

export default function ButtonWallet() {
    const w = useWallet()
    return (
        <Button onClick={w.connect}>Connect</Button>
    )
}

const Button = tailt.button`
    h-10 px-5
    rounded-full
    bg-sky-600 hover:bg-sky-500
    hover:scale-95
    font-bold
    duration-200
`