import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { chainMindDAOABI, chainMindTokenABI, aiOracleABI } from '../abis';
import { perfectAI } from '../services/perfectAiService';
import { realEthereumService } from '../services/realEthereumService';

// Enhanced contract addresses - will be updated after deployment
const ENHANCED_CONTRACT_ADDRESSES = {
  ChainMindToken: '0x4A679253410272dd5232B3Ff7cF5dbB88f295319',
  AIOracle: '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
  GovernanceStaking: '0x0000000000000000000000000000000000000000', // Will be updated
  TreasuryMultiSig: '0x0000000000000000000000000000000000000000', // Will be updated
  GrantFundingSystem: '0x0000000000000000000000000000000000000000', // Will be updated
  EnhancedChainMindDAO: '0x0000000000000000000000000000000000000000' // Will be updated
};

// Proposal categories
export enum ProposalCategory {
  FUNDING = 0,
  PARAMETER = 1,
  TREASURY = 2,
  EMERGENCY = 3,
  CONSTITUTIONAL = 4,
  PARTNERSHIP = 5,
  TECHNICAL = 6
}

export enum ProposalState {
  PENDING = 0,
  ACTIVE = 1,
  DEFEATED = 2,
  SUCCEEDED = 3,
  QUEUED = 4,
  EXECUTED = 5,
  CANCELED = 6,
  EXPIRED = 7
}

export enum LockPeriod {
  ONE_MONTH = 0,
  THREE_MONTHS = 1,
  SIX_MONTHS = 2,
  ONE_YEAR = 3
}

export interface StakeInfo {
  amount: string;
  startTime: number;
  unlockTime: number;
  lockPeriod: LockPeriod;
  votingPower: string;
  delegatedTo: string;
  active: boolean;
}

export interface ProposalInfo {
  id: number;
  proposer: string;
  title: string;
  description: string;
  category: ProposalCategory;
  state: ProposalState;
  startTime: number;
  endTime: number;
  executionTime?: number;
  votesFor: string;
  votesAgainst: string;
  votesAbstain: string;
  totalVotingPower: string;
  requestedAmount?: string;
  recipient?: string;
  aiAnalysis?: {
    successProbability: number;
    economicImpact: number;
    riskScore: number;
    communitySupport: number;
    analysisComplete: boolean;
  };
}

export interface ExpertDelegate {
  address: string;
  specialty: string;
  totalDelegatedPower: string;
  isVerified: boolean;
  reputation: number;
}

export interface GrantInfo {
  id: number;
  grantee: string;
  title: string;
  category: string;
  totalAmount: string;
  releasedAmount: string;
  status: number;
  milestoneIds: number[];
}

interface EnhancedWeb3ContextType {
  // Basic connection
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: ethers.Network | null;
  provider: ethers.BrowserProvider | null;

  // Contracts
  tokenContract: ethers.Contract | null;
  daoContract: ethers.Contract | null;
  stakingContract: ethers.Contract | null;
  treasuryContract: ethers.Contract | null;
  grantContract: ethers.Contract | null;

  // Token & voting info
  tokenBalance: string;
  stakedBalance: string;
  votingPower: string;
  delegatedVotingPower: string;
  reputation: number;

  // Functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;

  // Enhanced governance functions
  createProposal: (
    title: string,
    description: string,
    category: ProposalCategory,
    target?: string,
    value?: string,
    executionData?: string,
    requestedAmount?: string,
    recipient?: string
  ) => Promise<string>;
  
  castVote: (proposalId: number, support: number, reason?: string) => Promise<void>;
  
  // Staking functions
  stakeForGovernance: (amount: string, lockPeriod: LockPeriod) => Promise<void>;
  unstake: (stakeIndex: number) => Promise<void>;
  getUserStakes: () => Promise<StakeInfo[]>;
  
  // Delegation functions
  delegateVotingPower: (delegate: string, stakeIndex: number) => Promise<void>;
  undelegateVotingPower: (stakeIndex: number) => Promise<void>;
  getExpertDelegates: () => Promise<ExpertDelegate[]>;
  
  // Proposal functions
  getProposals: (limit?: number, offset?: number) => Promise<ProposalInfo[]>;
  getProposal: (proposalId: number) => Promise<ProposalInfo>;
  queueProposal: (proposalId: number) => Promise<void>;
  executeProposal: (proposalId: number) => Promise<void>;
  
  // Grant functions
  proposeGrant: (
    title: string,
    description: string,
    category: string,
    totalAmount: string,
    duration: number,
    milestones: Array<{
      title: string;
      description: string;
      amount: string;
      deadline: number;
    }>
  ) => Promise<number>;
  
  getGrants: () => Promise<GrantInfo[]>;
  
  // Treasury functions
  getTreasuryBalance: () => Promise<string>;
  proposeTransaction: (
    to: string,
    value: string,
    data: string,
    description: string,
    isEmergency?: boolean
  ) => Promise<number>;
  
  confirmTransaction: (txId: number) => Promise<void>;
  
  // AI integration
  requestAIPrediction: (proposalId: number, title: string, description: string) => Promise<any>;
  getAIAnalysis: (proposalId: number) => Promise<any>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
  
  // Real-time data
  realEthereumMetrics: any;
  performanceMetrics: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
    lastUpdate: Date;
  };
}

const EnhancedWeb3Context = createContext<EnhancedWeb3ContextType | undefined>(undefined);

export const useEnhancedWeb3 = () => {
  const context = useContext(EnhancedWeb3Context);
  if (context === undefined) {
    throw new Error('useEnhancedWeb3 must be used within an EnhancedWeb3Provider');
  }
  return context;
};

interface EnhancedWeb3ProviderProps {
  children: ReactNode;
}

export const EnhancedWeb3Provider: React.FC<EnhancedWeb3ProviderProps> = ({ children }) => {
  // State
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<ethers.Network | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Contracts
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [daoContract, setDaoContract] = useState<ethers.Contract | null>(null);
  const [stakingContract, setStakingContract] = useState<ethers.Contract | null>(null);
  const [treasuryContract, setTreasuryContract] = useState<ethers.Contract | null>(null);
  const [grantContract, setGrantContract] = useState<ethers.Contract | null>(null);

  // Token info
  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [delegatedVotingPower, setDelegatedVotingPower] = useState('0');
  const [reputation, setReputation] = useState(0);

  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  // Real-time data
  const [realEthereumMetrics, setRealEthereumMetrics] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgResponseTime: 0,
    errorRate: 0,
    uptime: 99.9,
    lastUpdate: new Date()
  });

  // Initialize contracts
  const initializeContracts = async (signer: ethers.JsonRpcSigner) => {
    try {
      console.log('Initializing enhanced contracts...');

      // Token contract
      const token = new ethers.Contract(ENHANCED_CONTRACT_ADDRESSES.ChainMindToken, chainMindTokenABI, signer);
      setTokenContract(token);

      // DAO contract (placeholder - will use enhanced ABI)
      const dao = new ethers.Contract(ENHANCED_CONTRACT_ADDRESSES.EnhancedChainMindDAO, chainMindDAOABI, signer);
      setDaoContract(dao);

      // Note: Staking, Treasury, and Grant contracts will need their ABIs
      // For now, we'll use the basic structure

      console.log('Enhanced contracts initialized successfully');
    } catch (error) {
      console.error('Failed to initialize enhanced contracts:', error);
      setError(`Failed to initialize contracts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to use this application.');
      toast.error('MetaMask is not installed');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      if (!account) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setAccount(account);
      setProvider(provider);
      setNetwork(network);
      setIsConnected(true);

      await initializeContracts(signer);
      await refreshBalance();

      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setNetwork(null);
    setIsConnected(false);
    setTokenContract(null);
    setDaoContract(null);
    setStakingContract(null);
    setTreasuryContract(null);
    setGrantContract(null);
    setTokenBalance('0');
    setStakedBalance('0');
    setVotingPower('0');
    setDelegatedVotingPower('0');
    setReputation(0);
    toast.success('Wallet disconnected');
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (!tokenContract || !account) return;

    try {
      const balance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.formatEther(balance));

      if (stakingContract) {
        // Get staking info
        const stakes = await stakingContract.getUserStakes(account);
        let totalStaked = 0;
        let totalVotingPower = 0;

        for (const stake of stakes) {
          if (stake.active) {
            totalStaked += parseFloat(ethers.formatEther(stake.amount));
            totalVotingPower += parseFloat(ethers.formatEther(stake.votingPower));
          }
        }

        setStakedBalance(totalStaked.toString());
        setVotingPower(totalVotingPower.toString());

        // Get reputation
        const rep = await stakingContract.getGovernanceReputation(account);
        setReputation(Number(rep));
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  // Enhanced governance functions
  const createProposal = async (
    title: string,
    description: string,
    category: ProposalCategory,
    target: string = ethers.ZeroAddress,
    value: string = '0',
    executionData: string = '0x',
    requestedAmount: string = '0',
    recipient: string = ethers.ZeroAddress
  ): Promise<string> => {
    if (!daoContract || !account) {
      throw new Error('Wallet not connected or contracts not initialized');
    }

    try {
      const oracleFee = ethers.parseEther("0.001");
      const tx = await daoContract.createProposal(
        title,
        description,
        category,
        target,
        ethers.parseEther(value),
        executionData,
        ethers.parseEther(requestedAmount),
        recipient,
        { value: oracleFee }
      );
      
      const receipt = await tx.wait();
      toast.success('Proposal created successfully!');
      return tx.hash;
    } catch (error: any) {
      console.error('Failed to create proposal:', error);
      setError(error.message || 'Failed to create proposal');
      toast.error('Failed to create proposal');
      throw error;
    }
  };

  const castVote = async (proposalId: number, support: number, reason: string = '') => {
    if (!daoContract || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await daoContract.castVote(proposalId, support, reason);
      await tx.wait();
      toast.success('Vote cast successfully!');
      await refreshBalance();
    } catch (error: any) {
      console.error('Failed to cast vote:', error);
      setError(error.message || 'Failed to cast vote');
      toast.error('Failed to cast vote');
      throw error;
    }
  };

  // Staking functions
  const stakeForGovernance = async (amount: string, lockPeriod: LockPeriod) => {
    if (!stakingContract || !tokenContract) {
      throw new Error('Contracts not initialized');
    }

    try {
      const amountWei = ethers.parseEther(amount);
      
      // Approve staking contract
      const approveTx = await tokenContract.approve(await stakingContract.getAddress(), amountWei);
      await approveTx.wait();
      toast.loading('Approving tokens...');

      // Stake
      const stakeTx = await stakingContract.stakeForGovernance(amountWei, lockPeriod);
      await stakeTx.wait();
      toast.success(`Successfully staked ${amount} MIND tokens!`);
      
      await refreshBalance();
    } catch (error: any) {
      console.error('Staking failed:', error);
      toast.error(error.message || 'Staking failed');
      throw error;
    }
  };

  const unstake = async (stakeIndex: number) => {
    if (!stakingContract) {
      throw new Error('Staking contract not initialized');
    }

    try {
      const tx = await stakingContract.unstake(stakeIndex);
      await tx.wait();
      toast.success('Tokens unstaked successfully!');
      await refreshBalance();
    } catch (error: any) {
      console.error('Unstaking failed:', error);
      toast.error(error.message || 'Unstaking failed');
      throw error;
    }
  };

  const getUserStakes = async (): Promise<StakeInfo[]> => {
    if (!stakingContract || !account) return [];

    try {
      const stakes = await stakingContract.getUserStakes(account);
      return stakes.map((stake: any) => ({
        amount: ethers.formatEther(stake.amount),
        startTime: Number(stake.startTime),
        unlockTime: Number(stake.unlockTime),
        lockPeriod: stake.lockPeriod,
        votingPower: ethers.formatEther(stake.votingPower),
        delegatedTo: stake.delegatedTo,
        active: stake.active
      }));
    } catch (error) {
      console.error('Failed to get user stakes:', error);
      return [];
    }
  };

  // Delegation functions
  const delegateVotingPower = async (delegate: string, stakeIndex: number) => {
    if (!stakingContract) {
      throw new Error('Staking contract not initialized');
    }

    try {
      const tx = await stakingContract.delegateVotingPower(delegate, stakeIndex);
      await tx.wait();
      toast.success('Voting power delegated successfully!');
      await refreshBalance();
    } catch (error: any) {
      console.error('Delegation failed:', error);
      toast.error(error.message || 'Delegation failed');
      throw error;
    }
  };

  const undelegateVotingPower = async (stakeIndex: number) => {
    if (!stakingContract) {
      throw new Error('Staking contract not initialized');
    }

    try {
      const tx = await stakingContract.undelegateVotingPower(stakeIndex);
      await tx.wait();
      toast.success('Voting power undelegated successfully!');
      await refreshBalance();
    } catch (error: any) {
      console.error('Undelegation failed:', error);
      toast.error(error.message || 'Undelegation failed');
      throw error;
    }
  };

  const getExpertDelegates = async (): Promise<ExpertDelegate[]> => {
    if (!stakingContract) return [];

    try {
      const experts = await stakingContract.getExperts();
      const expertData = await Promise.all(
        experts.map(async (address: string) => {
          const specialty = await stakingContract.expertSpecialty(address);
          const delegationInfo = await stakingContract.delegationInfo(address);
          const reputation = await stakingContract.getGovernanceReputation(address);
          
          return {
            address,
            specialty,
            totalDelegatedPower: ethers.formatEther(delegationInfo.totalDelegatedPower),
            isVerified: delegationInfo.isExpertDelegate,
            reputation: Number(reputation)
          };
        })
      );
      
      return expertData;
    } catch (error) {
      console.error('Failed to get expert delegates:', error);
      return [];
    }
  };

  // Proposal functions
  const getProposals = async (limit: number = 10, offset: number = 0): Promise<ProposalInfo[]> => {
    if (!daoContract) return [];

    try {
      // This would need to be implemented based on the enhanced DAO contract
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get proposals:', error);
      return [];
    }
  };

  const getProposal = async (proposalId: number): Promise<ProposalInfo> => {
    if (!daoContract) {
      throw new Error('DAO contract not initialized');
    }

    try {
      const proposal = await daoContract.getProposal(proposalId);
      const aiAnalysis = await daoContract.getAIAnalysis(proposalId);
      
      return {
        id: proposalId,
        proposer: proposal.proposer,
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        state: proposal.state,
        startTime: Number(proposal.startTime),
        endTime: Number(proposal.endTime),
        votesFor: ethers.formatEther(proposal.votesFor),
        votesAgainst: ethers.formatEther(proposal.votesAgainst),
        votesAbstain: ethers.formatEther(proposal.votesAbstain),
        totalVotingPower: '0', // Would need to calculate
        aiAnalysis: {
          successProbability: aiAnalysis.successProbability,
          economicImpact: aiAnalysis.economicImpact,
          riskScore: aiAnalysis.riskScore,
          communitySupport: aiAnalysis.communitySupport,
          analysisComplete: aiAnalysis.analysisComplete
        }
      };
    } catch (error) {
      console.error('Failed to get proposal:', error);
      throw error;
    }
  };

  const queueProposal = async (proposalId: number) => {
    if (!daoContract) {
      throw new Error('DAO contract not initialized');
    }

    try {
      const tx = await daoContract.queueProposal(proposalId);
      await tx.wait();
      toast.success('Proposal queued for execution!');
    } catch (error: any) {
      console.error('Failed to queue proposal:', error);
      toast.error(error.message || 'Failed to queue proposal');
      throw error;
    }
  };

  const executeProposal = async (proposalId: number) => {
    if (!daoContract) {
      throw new Error('DAO contract not initialized');
    }

    try {
      const tx = await daoContract.executeProposal(proposalId);
      await tx.wait();
      toast.success('Proposal executed successfully!');
    } catch (error: any) {
      console.error('Failed to execute proposal:', error);
      toast.error(error.message || 'Failed to execute proposal');
      throw error;
    }
  };

  // Grant functions - placeholder implementations
  const proposeGrant = async (
    title: string,
    description: string,
    category: string,
    totalAmount: string,
    duration: number,
    milestones: Array<{
      title: string;
      description: string;
      amount: string;
      deadline: number;
    }>
  ): Promise<number> => {
    // Implementation would depend on grant contract
    return 0;
  };

  const getGrants = async (): Promise<GrantInfo[]> => {
    // Implementation would depend on grant contract
    return [];
  };

  // Treasury functions - placeholder implementations
  const getTreasuryBalance = async (): Promise<string> => {
    if (!treasuryContract) return '0';
    
    try {
      const balance = await treasuryContract.getBalance();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get treasury balance:', error);
      return '0';
    }
  };

  const proposeTransaction = async (
    to: string,
    value: string,
    data: string,
    description: string,
    isEmergency: boolean = false
  ): Promise<number> => {
    // Implementation would depend on treasury contract
    return 0;
  };

  const confirmTransaction = async (txId: number) => {
    // Implementation would depend on treasury contract
  };

  // AI integration
  const requestAIPrediction = async (proposalId: number, title: string, description: string) => {
    try {
      return await perfectAI.requestPrediction(proposalId, title, description);
    } catch (error) {
      console.error('Failed to request AI prediction:', error);
      return null;
    }
  };

  const getAIAnalysis = async (proposalId: number) => {
    if (!daoContract) return null;

    try {
      return await daoContract.getAIAnalysis(proposalId);
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      return null;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Auto-connect on load
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    };

    autoConnect();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, account]);

  const value: EnhancedWeb3ContextType = {
    // Basic connection
    account,
    isConnected,
    isConnecting,
    network,
    provider,

    // Contracts
    tokenContract,
    daoContract,
    stakingContract,
    treasuryContract,
    grantContract,

    // Token & voting info
    tokenBalance,
    stakedBalance,
    votingPower,
    delegatedVotingPower,
    reputation,

    // Functions
    connectWallet,
    disconnectWallet,
    refreshBalance,

    // Enhanced governance functions
    createProposal,
    castVote,

    // Staking functions
    stakeForGovernance,
    unstake,
    getUserStakes,

    // Delegation functions
    delegateVotingPower,
    undelegateVotingPower,
    getExpertDelegates,

    // Proposal functions
    getProposals,
    getProposal,
    queueProposal,
    executeProposal,

    // Grant functions
    proposeGrant,
    getGrants,

    // Treasury functions
    getTreasuryBalance,
    proposeTransaction,
    confirmTransaction,

    // AI integration
    requestAIPrediction,
    getAIAnalysis,

    // Error handling
    error,
    clearError,

    // Real-time data
    realEthereumMetrics,
    performanceMetrics,
  };

  return (
    <EnhancedWeb3Context.Provider value={value}>
      {children}
    </EnhancedWeb3Context.Provider>
  );
};

export default EnhancedWeb3Context;
