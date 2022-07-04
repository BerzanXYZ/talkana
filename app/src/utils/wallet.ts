export class Wallet {
    connect() {
        const solana = this.getSolana()
        if(!solana) return
        solana.connect()
    }
    getSolana() {
        const { solana } = window as any
        return solana
    }
}