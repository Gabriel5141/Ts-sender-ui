"use client"

import { InputField } from "@/components/ui/inputField"
import { useMemo, useState } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "@/src/utils"

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("")
  const [recipients, setRecipients] = useState("")
  const [amounts, setAmounts] = useState("")
  const chainId = useChainId()
  const config = useConfig()
  const account = useAccount()
  const total: number = useMemo(() => calculateTotal(amounts), [amounts])
  const { data: hash, isPending, writeContractAsync } = useWriteContract()

  async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
    if (!tSenderAddress || !account.address) return 0
    
    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    })
    return Number(response)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const tSenderAddress = chainsToTSender[chainId]?.tsender
    if (!tSenderAddress) return

    const approvedAmount = await getApprovedAmount(tSenderAddress)
    
    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      })
      
      await waitForTransactionReceipt(config, { hash: approvalHash })
    } else {
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress as `0x${string}`,
          recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(Boolean),
          amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(Boolean),
          BigInt(total),
        ],
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Token Address"
          placeholder="0x..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <InputField
          label="Recipient Addresses"
          placeholder="0x123..., 0x456..."
          value={recipients}
          large={true}
          onChange={(e) => setRecipients(e.target.value)}
        />
        <InputField
          label="Amounts"
          placeholder="100, 200"
          value={amounts}
          large={true}
          onChange={(e) => setAmounts(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Send tokens"}
        </button>
      </form>
    </div>
  )
}