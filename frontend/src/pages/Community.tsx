import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import {
  Brain,
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target,
  BarChart3,
  Lock,
  Wallet,
  Coins,
  Sparkles,
  Globe,
  Rocket,
  FileText,
  Vote,
  BarChart,
  Activity,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  Hash,
  Eye,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  XCircle,
  AlertTriangle,
  MessageCircle,
  Send,
  Mail,
  Github,
  Twitter,
  Heart,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Users2,
  Award as AwardIcon
} from 'lucide-react';

// Social Media Post Interface
interface Post {
  id: string;
  author: {
    address: string;
    name: string;
    avatar: string;
    reputation: number;
    isVerified: boolean;
  };
  content: string;
  image?: string;
  timestamp: number;
  likes: number;
  comments: Comment[];
  shares: number;
  category: 'general' | 'governance' | 'technical' | 'social';
  isLiked: boolean;
  isFollowing: boolean;
}

interface Comment {
  id: string;
  author: {
    address: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

interface UserProfile {
  address: string;
  name: string;
  bio: string;
  avatar: string;
  reputation: number;
  followers: number;
  following: number;
  postsCount: number;
  isVerified: boolean;
  badges: string[];
  isOnline: boolean;
}

const Community: React.FC = () => {
  const { account, isConnected, daoContract, tokenContract } = useWeb3();
  
  // State Management
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'people' | 'my-posts'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'general' | 'governance' | 'technical' | 'social'>('general');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [followingList, setFollowingList] = useState<Set<string>>(new Set());
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

  // Initialize social data
  useEffect(() => {
    initializeSocialData();
  }, []);

  const initializeSocialData = () => {
    // Sample user profiles
    const profiles: UserProfile[] = [
      {
        address: '0x1234...5678',
      name: 'Vitalik Buterin',
        bio: 'Ethereum co-founder, blockchain researcher, cat lover 🐱',
      avatar: 'VB',
      reputation: 9850,
        followers: 284000,
        following: 150,
        postsCount: 847,
        isVerified: true,
      badges: ['Founder', 'Core Contributor', 'AI Expert'],
      isOnline: true
    },
    {
        address: '0x2345...6789',
        name: 'DAO Researcher',
        bio: 'Governance systems, DeFi protocols, building the future 🚀',
        avatar: 'DR',
      reputation: 7840,
        followers: 15200,
        following: 892,
        postsCount: 456,
        isVerified: true,
      badges: ['Governance Expert', 'DeFi Pioneer'],
      isOnline: true
    },
    {
        address: '0x3456...7890',
        name: 'AI Specialist',
        bio: 'Machine Learning engineer focusing on DAO predictions',
        avatar: 'AS',
      reputation: 6520,
        followers: 8400,
        following: 234,
        postsCount: 289,
        isVerified: false,
      badges: ['AI Expert', 'ML Researcher'],
      isOnline: false
      }
    ];

    // Sample posts
    const samplePosts: Post[] = [
      {
        id: '1',
        author: profiles[0],
        content: 'Excited to see ChainMind\'s AI-powered governance in action! The prediction accuracy is incredible. This could revolutionize how DAOs make decisions. 🧠⚡',
        timestamp: Date.now() - 3600000, // 1 hour ago
        likes: 284,
        comments: [
          {
            id: 'c1',
            author: profiles[1],
            content: 'Absolutely agree! The AI insights have helped our proposals pass with better community consensus.',
            timestamp: Date.now() - 3000000,
            likes: 45,
            isLiked: false
          }
        ],
        shares: 67,
        category: 'governance',
        isLiked: false,
        isFollowing: false
      },
      {
        id: '2',
        author: profiles[1],
        content: 'New treasury diversification proposal is live! Check out how we\'re planning to allocate funds across different DeFi protocols. Your feedback is crucial! 💰📊',
        image: 'https://via.placeholder.com/600x300/8B5CF6/FFFFFF?text=Treasury+Allocation+Chart',
        timestamp: Date.now() - 7200000, // 2 hours ago
        likes: 156,
        comments: [],
        shares: 23,
        category: 'governance',
        isLiked: false,
        isFollowing: false
      },
      {
        id: '3',
        author: profiles[2],
        content: 'Working on improving our ML models for proposal outcome prediction. Currently achieving 93% accuracy! The future of governance is data-driven. 🤖📈',
        timestamp: Date.now() - 10800000, // 3 hours ago
        likes: 98,
        comments: [],
        shares: 12,
        category: 'technical',
        isLiked: false,
        isFollowing: false
      }
    ];

    setUserProfiles(profiles);
    setPosts(samplePosts);
  };

  // BLOCKCHAIN INTEGRATION - Real social actions on-chain
  const handleLikePost = async (postId: string) => {
    if (!account) return;
    
    try {
      // Store like on blockchain via smart contract
      const tx = await daoContract?.socialLike(postId, account);
      if (tx) {
        toast.success('Like recorded on blockchain!');
        await tx.wait();
      }
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      ));
    } catch (error) {
      console.error('Blockchain like failed:', error);
      // Fallback to local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      ));
    }
  };

  const handleFollowUser = (userAddress: string) => {
    const newFollowing = new Set(followingList);
    if (newFollowing.has(userAddress)) {
      newFollowing.delete(userAddress);
    } else {
      newFollowing.add(userAddress);
    }
    setFollowingList(newFollowing);
  };

  // BLOCKCHAIN POST CREATION - Store posts on-chain with token gating
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !account) return;
    
    try {
      // Check if user has minimum MIND tokens for posting
      const minTokens = ethers.parseEther('100'); // 100 MIND minimum
      const userBalance = await tokenContract?.balanceOf(account);
      
      if (userBalance && userBalance < minTokens) {
        toast.error('Need at least 100 MIND tokens to post!');
        return;
      }
      
      // Create post on blockchain
      const postData = {
        content: newPostContent,
        category: newPostCategory,
        timestamp: Date.now()
      };
      
      const tx = await daoContract?.createSocialPost(
        JSON.stringify(postData),
        newPostCategory
      );
      
      if (tx) {
        toast.loading('Publishing to blockchain...');
        await tx.wait();
        toast.success('Post published on-chain!');
      }
      
      const newPost: Post = {
        id: Date.now().toString(),
        author: {
          address: account,
          name: 'You',
          avatar: account.slice(2, 4).toUpperCase(),
          reputation: 1250,
          isVerified: false
        },
        content: newPostContent,
        timestamp: Date.now(),
        likes: 0,
        comments: [],
        shares: 0,
        category: newPostCategory,
        isLiked: false,
        isFollowing: false
      };

      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setShowCreatePost(false);
      
    } catch (error: any) {
      console.error('Blockchain post failed:', error);
      toast.error('Failed to publish on blockchain');
    }
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        address: account || '0x0000...0000',
        name: 'You',
        avatar: account ? account.slice(2, 4).toUpperCase() : 'YU'
      },
      content: newComment,
      timestamp: Date.now(),
      likes: 0,
      isLiked: false
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
    setNewComment('');
    setSelectedPost(null);
  };

  const timeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = posts.filter(post => 
    activeTab === 'feed' || 
    (activeTab === 'my-posts' && post.author.address === account) ||
    (activeTab === 'trending' && post.likes > 100)
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect to Join Community</h2>
          <p className="text-gray-400">Please connect your wallet to access the social features</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">ChainMind Social</h1>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                {userProfiles.length} Active Members
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <motion.button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Post</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            {[
              { id: 'feed', name: 'Feed', icon: MessageCircle },
              { id: 'trending', name: 'Trending', icon: TrendingUp },
              { id: 'people', name: 'People', icon: Users },
              { id: 'my-posts', name: 'My Posts', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - User Profiles */}
          {activeTab === 'people' && (
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Active Members</h3>
                <div className="space-y-4">
                  {userProfiles.map((profile) => (
                    <motion.div
                      key={profile.address}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{profile.avatar}</span>
                          </div>
                          {profile.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-purple-900"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <h4 className="font-medium text-white text-sm">{profile.name}</h4>
                            {profile.isVerified && (
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">{profile.followers.toLocaleString()} followers</p>
                        </div>
              </div>
                      <motion.button
                        onClick={() => handleFollowUser(profile.address)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                          followingList.has(profile.address)
                            ? 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                            : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {followingList.has(profile.address) ? (
                          <><CheckCircle className="w-3 h-3" /><span>Following</span></>
                        ) : (
                          <><UserPlus className="w-3 h-3" /><span>Follow</span></>
                        )}
                      </motion.button>
                    </motion.div>
            ))}
          </div>
        </div>
            </div>
          )}

          {/* Main Feed */}
          <div className={activeTab === 'people' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            
            {/* Create Post Modal */}
            <AnimatePresence>
              {showCreatePost && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowCreatePost(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 w-full max-w-lg border border-white/20"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white">Create Post</h3>
                      <button
                        onClick={() => setShowCreatePost(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select
                          value={newPostCategory}
                          onChange={(e) => setNewPostCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="general">General</option>
                          <option value="governance">Governance</option>
                          <option value="technical">Technical</option>
                          <option value="social">Social</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">What's on your mind?</label>
                        <textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Share your thoughts with the community..."
                          rows={4}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowCreatePost(false)}
                          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePost}
                          disabled={!newPostContent.trim()}
                          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post
                        </button>
            </div>
          </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{post.author.avatar}</span>
                        </div>
                        {post.author.isVerified && (
                          <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">{post.author.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{timeAgo(post.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-300 text-sm">⭐ {post.author.reputation}</span>
                      <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-200 leading-relaxed">{post.content}</p>
                    {post.image && (
                      <div className="mt-4">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments.length}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                        <Send className="w-5 h-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {selectedPost === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        {/* Existing Comments */}
                        <div className="space-y-3 mb-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-xs">{comment.author.avatar}</span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-white/5 rounded-lg p-3">
                                  <h5 className="font-medium text-white text-sm">{comment.author.name}</h5>
                                  <p className="text-gray-300 text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-gray-500 text-xs">{timeAgo(comment.timestamp)}</span>
                                  <button className="text-gray-500 hover:text-red-400 text-xs">Like</button>
                                  <span className="text-gray-500 text-xs">{comment.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
            
                        {/* Add Comment */}
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium text-xs">
                              {account ? account.slice(2, 4).toUpperCase() : 'YU'}
                            </span>
              </div>
                          <div className="flex-1 flex space-x-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment.trim()}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Post
                            </button>
            </div>
              </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
          </div>
        </div>
    </div>
  );
};

export default Community;