"use client";

import { useState, useCallback } from "react";
import {
  initialize,
  stake,
  withdraw,
  claim,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function TokenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  color,
}: {
  name: string;
  params: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

type Tab = "stake" | "withdraw" | "claim" | "admin";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("stake");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Stake inputs
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  // Withdraw inputs
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Claim
  const [isClaiming, setIsClaiming] = useState(false);

  // Admin inputs
  const [adminAddr, setAdminAddr] = useState("");
  const [stakingToken, setStakingToken] = useState("");
  const [rewardToken, setRewardToken] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleStake = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!stakeAmount.trim() || parseFloat(stakeAmount) <= 0) return setError("Enter a valid amount");
    setError(null);
    setIsStaking(true);
    setTxStatus("Awaiting signature...");
    try {
      // Convert to bigint (assuming 7 decimal places for typical tokens)
      const amount = BigInt(Math.floor(parseFloat(stakeAmount) * 10000000));
      await stake(walletAddress, walletAddress, amount);
      setTxStatus("Tokens staked successfully!");
      setStakeAmount("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsStaking(false);
    }
  }, [walletAddress, stakeAmount]);

  const handleWithdraw = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!withdrawAmount.trim() || parseFloat(withdrawAmount) <= 0) return setError("Enter a valid amount");
    setError(null);
    setIsWithdrawing(true);
    setTxStatus("Awaiting signature...");
    try {
      const amount = BigInt(Math.floor(parseFloat(withdrawAmount) * 10000000));
      await withdraw(walletAddress, walletAddress, amount);
      setTxStatus("Tokens withdrawn successfully!");
      setWithdrawAmount("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsWithdrawing(false);
    }
  }, [walletAddress, withdrawAmount]);

  const handleClaim = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    setError(null);
    setIsClaiming(true);
    setTxStatus("Awaiting signature...");
    try {
      await claim(walletAddress, walletAddress);
      setTxStatus("Rewards claimed successfully!");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsClaiming(false);
    }
  }, [walletAddress]);

  const handleInitialize = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!adminAddr.trim() || !stakingToken.trim() || !rewardToken.trim()) return setError("Fill in all fields");
    setError(null);
    setIsInitializing(true);
    setTxStatus("Awaiting signature...");
    try {
      await initialize(walletAddress, adminAddr.trim(), stakingToken.trim(), rewardToken.trim());
      setTxStatus("Contract initialized successfully!");
      setAdminAddr("");
      setStakingToken("");
      setRewardToken("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsInitializing(false);
    }
  }, [walletAddress, adminAddr, stakingToken, rewardToken]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "stake", label: "Stake", icon: <ArrowDownIcon />, color: "#34d399" },
    { key: "withdraw", label: "Withdraw", icon: <ArrowUpIcon />, color: "#fbbf24" },
    { key: "claim", label: "Claim", icon: <GiftIcon />, color: "#7c6cf0" },
    { key: "admin", label: "Setup", icon: <SettingsIcon />, color: "#4fc3f7" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("success") || txStatus.includes("successfully") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#34d399]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c6cf0]">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Token Farming</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Stake */}
            {activeTab === "stake" && (
              <div className="space-y-5">
                <MethodSignature name="stake" params="(user: Address, amount: i128)" color="#34d399" />
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <TokenIcon />
                    <span>Stake your tokens to earn rewards</span>
                  </div>
                  <p className="text-[10px] text-white/25">
                    Note: Approve the contract to spend your tokens before staking
                  </p>
                </div>
                <Input 
                  label="Amount to Stake" 
                  type="number"
                  value={stakeAmount} 
                  onChange={(e) => setStakeAmount(e.target.value)} 
                  placeholder="e.g. 1000" 
                />
                {walletAddress ? (
                  <ShimmerButton onClick={handleStake} disabled={isStaking} shimmerColor="#34d399" className="w-full">
                    {isStaking ? <><SpinnerIcon /> Staking...</> : <><ArrowDownIcon /> Stake Tokens</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#34d399]/20 bg-[#34d399]/[0.03] py-4 text-sm text-[#34d399]/60 hover:border-[#34d399]/30 hover:text-[#34d399]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to stake tokens
                  </button>
                )}
              </div>
            )}

            {/* Withdraw */}
            {activeTab === "withdraw" && (
              <div className="space-y-5">
                <MethodSignature name="withdraw" params="(user: Address, amount: i128)" color="#fbbf24" />
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <ArrowUpIcon />
                    <span>Withdraw your staked tokens</span>
                  </div>
                  <p className="text-[10px] text-white/25">
                    Withdrawn tokens will be transferred to your wallet
                  </p>
                </div>
                <Input 
                  label="Amount to Withdraw" 
                  type="number"
                  value={withdrawAmount} 
                  onChange={(e) => setWithdrawAmount(e.target.value)} 
                  placeholder="e.g. 500" 
                />
                {walletAddress ? (
                  <ShimmerButton onClick={handleWithdraw} disabled={isWithdrawing} shimmerColor="#fbbf24" className="w-full">
                    {isWithdrawing ? <><SpinnerIcon /> Withdrawing...</> : <><ArrowUpIcon /> Withdraw Tokens</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] py-4 text-sm text-[#fbbf24]/60 hover:border-[#fbbf24]/30 hover:text-[#fbbf24]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to withdraw tokens
                  </button>
                )}
              </div>
            )}

            {/* Claim */}
            {activeTab === "claim" && (
              <div className="space-y-5">
                <MethodSignature name="claim" params="(user: Address)" color="#7c6cf0" />
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <GiftIcon />
                    <span>Claim your farming rewards</span>
                  </div>
                  <p className="text-[10px] text-white/25">
                    Rewards are calculated as 10% of your staked amount
                  </p>
                </div>
                <div className="rounded-xl border border-[#7c6cf0]/10 bg-[#7c6cf0]/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Estimated Reward</span>
                    <span className="font-mono text-sm text-[#7c6cf0]">10% of staked amount</span>
                  </div>
                </div>
                {walletAddress ? (
                  <ShimmerButton onClick={handleClaim} disabled={isClaiming} shimmerColor="#7c6cf0" className="w-full">
                    {isClaiming ? <><SpinnerIcon /> Claiming...</> : <><GiftIcon /> Claim Rewards</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to claim rewards
                  </button>
                )}
              </div>
            )}

            {/* Admin */}
            {activeTab === "admin" && (
              <div className="space-y-5">
                <MethodSignature name="initialize" params="(admin: Address, staking_token: Address, reward_token: Address)" color="#4fc3f7" />
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <SettingsIcon />
                    <span>Initialize the farming contract</span>
                  </div>
                  <p className="text-[10px] text-white/25">
                    This should only be called once by the admin
                  </p>
                </div>
                <Input 
                  label="Admin Address" 
                  value={adminAddr} 
                  onChange={(e) => setAdminAddr(e.target.value)} 
                  placeholder="G..." 
                />
                <Input 
                  label="Staking Token Address" 
                  value={stakingToken} 
                  onChange={(e) => setStakingToken(e.target.value)} 
                  placeholder="C... (token to stake)" 
                />
                <Input 
                  label="Reward Token Address" 
                  value={rewardToken} 
                  onChange={(e) => setRewardToken(e.target.value)} 
                  placeholder="C... (token for rewards)" 
                />
                {walletAddress ? (
                  <ShimmerButton onClick={handleInitialize} disabled={isInitializing} shimmerColor="#4fc3f7" className="w-full">
                    {isInitializing ? <><SpinnerIcon /> Initializing...</> : <><SettingsIcon /> Initialize Contract</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#4fc3f7]/20 bg-[#4fc3f7]/[0.03] py-4 text-sm text-[#4fc3f7]/60 hover:border-[#4fc3f7]/30 hover:text-[#4fc3f7]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to initialize
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Token Farming Platform &middot; Soroban</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#34d399]" />
                <span className="font-mono text-[9px] text-white/15">Stake</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#fbbf24]" />
                <span className="font-mono text-[9px] text-white/15">Earn</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#7c6cf0]" />
                <span className="font-mono text-[9px] text-white/15">Claim</span>
              </span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
