"use client"

import HomeContent from "@/components/HomeContents"
import HomeContents from "@/components/HomeContents"
import { useAccount } from "wagmi"

export default function Home() {
  const { isConnected } = useAccount()
  return (
    <div>
      {isConnected ? (
        <div>
          <HomeContent />
          </div>
      ) : (
        <div>
          Please connect a wallet...
          </div>
      )
      }
    </div>
  );
}