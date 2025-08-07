"use client";

import { useEffect, useState } from "react";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { ReclaimClient } from "@reclaimprotocol/js-sdk";

// Your Reclaim Protocol App ID
const RECLAIM_APP_ID = "0xE11e72D9D5f0593304CfD7D2feF95Ab54d245ae4"; // Replace with your actual App ID

export default function Home() {
  const { isConnected, account } = useAbstraxionAccount();
  const { client, isReady } = useAbstraxionSigningClient();
  const [verificationStatus, setVerificationStatus] = useState("idle");

  const handleVerify = async () => {
    if (!isConnected || !client) {
      alert("Please connect your wallet first.");
      return;
    }

    setVerificationStatus("verifying");
    try {
      const reclaimClient = new ReclaimClient(RECLAIM_APP_ID);

      const claim = await reclaimClient.getVerificationRequest({
        title: "Superfan Verification",
        claims: [{ type: "twitter-followers-count", parameters: {}}],
      });

      const reclaimLink = reclaimClient.getVerificationUrl(claim);
      window.open(reclaimLink, "_blank");

      const proof = await reclaimClient.startProofCollection(claim.id);
      
      // On-chain transaction upon successful Reclaim proof
      if (proof) {
        // Here, we send a simple memo transaction as an MVP.
        // In a full app, this would be a contract interaction.
        const txResult = await client.signAndBroadcast(account.bech32Address, [{
          type: "cosmos-sdk/MsgSend",
          value: {
            from_address: account.bech32Address,
            to_address: "xion1...", // Replace with a dummy or real recipient
            amount: [{
              denom: "uxion",
              amount: "1",
            }],
          },
        }], {
          gas: "200000",
          amount: [{ denom: "uxion", amount: "100" }],
        }, `Superfan Verified: ${account.bech32Address}`);

        console.log("Transaction Result:", txResult);
        setVerificationStatus("success");
      } else {
        setVerificationStatus("failed");
      }

    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationStatus("failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Hackathon Superfan App</h1>

      <div className="flex flex-col space-y-4 w-full max-w-md">
        {!isConnected ? (
          <button
            onClick={() => useAbstraxionAccount().connect()}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <p className="text-sm text-gray-400">Connected: {account.bech32Address}</p>
            <button
              onClick={handleVerify}
              disabled={verificationStatus === "verifying"}
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {verificationStatus === "verifying" ? "Verifying..." : "Verify Superfan Status"}
            </button>
          </>
        )}
      </div>

      {verificationStatus === "success" && (
        <p className="mt-8 text-green-400">Superfan Verification Successful! A transaction has been sent.</p>
      )}
      {verificationStatus === "failed" && (
        <p className="mt-8 text-red-400">Verification Failed. Please try again.</p>
      )}
    </div>
  );
}
