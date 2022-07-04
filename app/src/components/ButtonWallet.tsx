import tailt from 'tailt'

export default function ButtonWallet() {
    return (
        <Button>Connect</Button>
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