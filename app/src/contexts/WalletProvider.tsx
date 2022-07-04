import { createContext, ReactNode, useContext } from "react";

interface WalletContextState {
    publicKey: string
    connect(): void
}

const WalletContext = createContext<WalletContextState>({} as WalletContextState)


export const useWallet = () => useContext(WalletContext)


export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const Value: WalletContextState = {
        
    } as WalletContextState
    
    return (
        <WalletContext.Provider value={Value}>
            {children}
        </WalletContext.Provider>
    )
}