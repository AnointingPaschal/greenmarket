"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { WalletModal } from "./WalletModal";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });

export function WalletModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <WalletModal open={isOpen} onClose={() => setIsOpen(false)} />
    </Ctx.Provider>
  );
}

export const useWalletModal = () => useContext(Ctx);
