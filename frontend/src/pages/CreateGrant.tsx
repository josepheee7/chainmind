import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Award, FileText, DollarSign, Calendar, Send, Brain } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

const CreateGrant: React.FC = () => {
  const { account, isConnected, connectWallet, daoContract, tokenContract, tokenBalance } = useWeb3();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grantData, setGrantData] = useState({
    title: '',
    description: '',
    requestedAmount: '',
    deliverables: '',
    timeline: '3 months',
    milestones: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setGrantData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitGrant = async () => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!grantData.title.trim() || !grantData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (!daoContract) {
        toast.error('DAO contract not available');
        return;
      }

      const proposalDescription = JSON.stringify({
        title: grantData.title,
        description: grantData.description,
        category: 'grant',
        requestedAmount: grantData.requestedAmount,
        deliverables: grantData.deliverables,
        timeline: grantData.timeline,
        milestones: grantData.milestones
      });

      const targets = [account];
      const values = grantData.requestedAmount ? [ethers.parseEther(grantData.requestedAmount)] : [0];
      const calldatas = ['0x'];

      toast.loading('Creating grant proposal...');
      
      const tx = await daoContract.propose(targets, values, calldatas, proposalDescription);
      await tx.wait();
      
      toast.dismiss();
      toast.success('Grant proposal created successfully!');
      navigate('/proposals');

    } catch (error: any) {
      console.error('Grant creation failed:', error);
      toast.error(error.message || 'Failed to create grant');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to create grant proposals</p>
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-xl transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">Create Grant Proposal</h1>
          <p className="text-gray-300 text-lg">Request funding for development, research, or community initiatives</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-purple-300 font-medium mb-2">Grant Title *</label>
              <input
                type="text"
                value={grantData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., DeFi Integration Research Grant"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-purple-300 font-medium mb-2">Project Description *</label>
              <textarea
                value={grantData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project, its goals, and how it benefits the ChainMind ecosystem..."
                rows={6}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Amount and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-300 font-medium mb-2">Requested Amount (ETH)</label>
                <input
                  type="number"
                  value={grantData.requestedAmount}
                  onChange={(e) => handleInputChange('requestedAmount', e.target.value)}
                  placeholder="25"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-2">Timeline</label>
                <select
                  value={grantData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-purple-300 font-medium mb-2">Expected Deliverables</label>
              <textarea
                value={grantData.deliverables}
                onChange={(e) => handleInputChange('deliverables', e.target.value)}
                placeholder="List the specific deliverables and outcomes expected from this grant..."
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-purple-300 font-medium mb-2">Milestones & Timeline</label>
              <textarea
                value={grantData.milestones}
                onChange={(e) => handleInputChange('milestones', e.target.value)}
                placeholder="Break down your project into key milestones with dates..."
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6 border-t border-white/10">
              <div className="text-sm text-gray-400">
                <span>Your balance: {parseFloat(tokenBalance).toLocaleString()} MIND</span>
              </div>
              
              <motion.button
                onClick={handleSubmitGrant}
                disabled={loading || !grantData.title.trim() || !grantData.description.trim()}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Grant Proposal</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGrant;