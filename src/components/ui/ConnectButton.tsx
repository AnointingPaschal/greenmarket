"use client";

import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectButton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <RKConnectButton
      showBalance={false}
      chainStatus="none"
      accountStatus="avatar"
    />
  );
}
