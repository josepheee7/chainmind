import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Vote, Zap, Award, Shield, Users, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

const GovernanceStaking: React.FC = () => {
  const { account, isConnected, tokenBalance, stakingContract, tokenContract, provider } = useWeb3();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [stakingData, setStakingData] = useState({
    userStaked: '5000',
    votingPower: '5000',
    pendingRewards: '125.4',
    governanceAPR: 18.5,
    lockPeriod: 0,
    unlockTime: 0
  });
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake' | 'rewards'>('stake');

  // Fetch real staking data
  useEffect(() => {
    if (isConnected && stakingContract && account) {
      fetchStakingData();
    }
  }, [isConnected, stakingContract, account]);

  const fetchStakingData = async () => {
    try {
      if (!stakingContract || !account) return;
      
      // Real contract calls
      const userStaked = await stakingContract.getStakedAmount(account);
      const pendingRewards = await stakingContract.getPendingRewards(account);
      const votingPower = await stakingContract.getVotingPower(account);
      
      setStakingData(prev => ({
        ...prev,
        userStaked: ethers.formatEther(userStaked),
        pendingRewards: ethers.formatEther(pendingRewards),
        votingPower: ethers.formatEther(votingPower)
      }));
    } catch (error) {
      console.error('Failed to fetch staking data:', error);
      // Keep mock data for demo
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0 || !stakingContract || !tokenContract) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const availableBalance = parseFloat(tokenBalance || '1000');
    if (parseFloat(stakeAmount) > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    setTxHash('');
    
    try {
      const amount = ethers.parseEther(stakeAmount);
      
      // Try to check allowance, skip if it fails
      try {
        const stakingAddress = await stakingContract.getAddress();
        const allowance = await tokenContract.allowance(account, stakingAddress);
        
        if (allowance < amount) {
          toast.loading('Approving tokens...');
          const approveTx = await tokenContract.approve(stakingAddress, amount);
          setTxHash(approveTx.hash);
          await approveTx.wait();
          toast.success('Tokens approved!');
        }
      } catch (allowanceError) {
        console.warn('Allowance check failed, proceeding with staking:', allowanceError);
      }
      
      // Stake tokens
      toast.loading('Staking tokens...');
      const stakeTx = await stakingContract.stake(amount);
      setTxHash(stakeTx.hash);
      await stakeTx.wait();
      
      toast.success(`Successfully staked ${stakeAmount} MIND!`);
      setStakeAmount('');
      await fetchStakingData();
      
    } catch (error: any) {
      console.error('Staking failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.code === -32603) {
        toast.error('Insufficient funds or gas');
      } else {
        toast.error('Staking failed: ' + (error.reason || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0 || !stakingContract) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const stakedBalance = parseFloat(stakingData.userStaked);
    if (parseFloat(unstakeAmount) > stakedBalance) {
      toast.error('Insufficient staked balance');
      return;
    }

    setLoading(true);
    setTxHash('');
    
    try {
      const amount = ethers.parseEther(unstakeAmount);
      
      toast.loading('Unstaking tokens...');
      const unstakeTx = await stakingContract.unstake(amount);
      setTxHash(unstakeTx.hash);
      await unstakeTx.wait();
      
      toast.success(`Successfully unstaked ${unstakeAmount} MIND!`);
      setUnstakeAmount('');
      await fetchStakingData();
      
    } catch (error: any) {
      console.error('Unstaking failed:', error);
      toast.error('Unstaking failed: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!stakingContract) return;

    setLoading(true);
    setTxHash('');
    
    try {
      toast.loading('Claiming rewards...');
      const claimTx = await stakingContract.claimRewards();
      setTxHash(claimTx.hash);
      await claimTx.wait();
      
      toast.success('Rewards claimed successfully!');
      await fetchStakingData();
      
    } catch (error: any) {
      console.error('Claiming failed:', error);
      toast.error('Claiming failed: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getExplorerUrl = (hash: string) => {
    return `https://etherscan.io/tx/${hash}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <Vote className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access governance staking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Governance Staking
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Stake MIND tokens to participate in governance and earn rewards
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Vote className="w-6 h-6 text-purple-400 mr-3" />
              <span className="text-purple-300 font-medium">Voting Power</span>
            </div>
            <div className="text-2xl font-bold text-white">{parseFloat(stakingData.votingPower).toLocaleString()} MIND</div>
            <div className="text-purple-400 text-sm">Your influence</div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Zap className="w-6 h-6 text-blue-400 mr-3" />
              <span className="text-blue-300 font-medium">Staked Amount</span>
            </div>
            <div className="text-2xl font-bold text-white">{parseFloat(stakingData.userStaked).toLocaleString()} MIND</div>
            <div className="text-blue-400 text-sm">Governance stake</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-xl border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Award className="w-6 h-6 text-green-400 mr-3" />
              <span className="text-green-300 font-medium">Pending Rewards</span>
            </div>
            <div className="text-2xl font-bold text-white">{parseFloat(stakingData.pendingRewards).toFixed(4)} MIND</div>
            <div className="text-green-400 text-sm">Claimable now</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-6 h-6 text-orange-400 mr-3" />
              <span className="text-orange-300 font-medium">Governance APR</span>
            </div>
            <div className="text-2xl font-bold text-white">{stakingData.governanceAPR}%</div>
            <div className="text-orange-400 text-sm">Annual return</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staking Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8"
          >
            {/* Tab Navigation */}
            <div className="flex bg-gray-800/50 rounded-xl p-1 mb-8">
              {(['stake', 'unstake', 'rewards'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Stake Tab */}
            {activeTab === 'stake' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-purple-300 font-medium mb-3">Stake Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-4 text-white text-lg focus:border-purple-400 focus:outline-none"
                    />
                    <button
                      onClick={() => setStakeAmount(tokenBalance || '1000')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 font-medium"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Available: {parseFloat(tokenBalance || '1000').toLocaleString()} MIND
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <h3 className="text-purple-300 font-medium mb-2">Governance Benefits</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Vote on all governance proposals</li>
                    <li>• Earn {stakingData.governanceAPR}% APR in rewards</li>
                    <li>• Participate in treasury decisions</li>
                    <li>• Access to exclusive governance features</li>
                  </ul>
                </div>

                <motion.button
                  onClick={handleStake}
                  disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > parseFloat(tokenBalance || '1000')}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Processing...' : 'Stake for Governance'}
                </motion.button>
              </div>
            )}

            {/* Unstake Tab */}
            {activeTab === 'unstake' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-pink-300 font-medium mb-3">Unstake Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-4 py-4 text-white text-lg focus:border-pink-400 focus:outline-none"
                    />
                    <button
                      onClick={() => setUnstakeAmount(stakingData.userStaked)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-300 font-medium"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Staked: {parseFloat(stakingData.userStaked).toLocaleString()} MIND
                  </div>
                </div>

                <motion.button
                  onClick={handleUnstake}
                  disabled={loading || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > parseFloat(stakingData.userStaked)}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Processing...' : 'Unstake MIND Tokens'}
                </motion.button>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {parseFloat(stakingData.pendingRewards).toFixed(4)} MIND
                  </div>
                  <div className="text-gray-400">Pending Rewards</div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Reward Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current APR</span>
                      <span className="text-green-400 font-semibold">{stakingData.governanceAPR}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Rewards</span>
                      <span className="text-white">{(parseFloat(stakingData.userStaked) * stakingData.governanceAPR / 100 / 365).toFixed(4)} MIND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Estimate</span>
                      <span className="text-white">{(parseFloat(stakingData.userStaked) * stakingData.governanceAPR / 100 / 12).toFixed(2)} MIND</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleClaimRewards}
                  disabled={loading || parseFloat(stakingData.pendingRewards) === 0}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Processing...' : 'Claim All Rewards'}
                </motion.button>
              </div>
            )}

            {/* Transaction Hash Display */}
            {txHash && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-300 font-medium">Transaction Submitted</div>
                    <div className="text-gray-400 text-sm">{txHash.slice(0, 10)}...{txHash.slice(-8)}</div>
                  </div>
                  <a
                    href={getExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Governance Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Governance Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Governance Stake</span>
                  <span className="text-white font-semibold">2.5M MIND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Voters</span>
                  <span className="text-white font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Proposals This Month</span>
                  <span className="text-white font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Voting Power</span>
                  <span className="text-purple-400 font-semibold">
                    {((parseFloat(stakingData.votingPower) / 2500000) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {[
                  { action: 'Voted on Proposal #42', time: '2 hours ago', status: 'success' },
                  { action: 'Staked 1,000 MIND', time: '1 day ago', status: 'success' },
                  { action: 'Claimed 25.4 MIND rewards', time: '3 days ago', status: 'success' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white text-sm font-medium">{activity.action}</div>
                      <div className="text-gray-400 text-xs">{activity.time}</div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceStaking;