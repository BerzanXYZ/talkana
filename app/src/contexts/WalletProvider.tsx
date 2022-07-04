import { web3 } from "@project-serum/anchor";
import { createContext, ReactNode, useContext, useMemo } from "react";

interface WalletContextState {
    publicKey: web3.PublicKey
    connect(): void
}

const WalletContext = createContext<WalletContextState>({} as WalletContextState)


export const useWallet = () => useContext(WalletContext)


export const WalletProvider = ({ children }: { children: ReactNode }) => {
    
    return (
        <WalletContext.Provider value={{} as WalletContextState}>
            {children}
        </WalletContext.Provider>
    )
}