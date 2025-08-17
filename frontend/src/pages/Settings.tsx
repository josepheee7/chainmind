import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Wallet, 
  Key,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { account, isConnected, disconnectWallet, network, ethBalance, tokenBalance, setDisplayName } = useWeb3();
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    bio: '',
    avatar: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    proposals: true,
    voting: true,
    rewards: true,
    governance: true,
    email: false,
    push: true
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    autoLock: true
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    showBalance: true,
    showActivity: true,
    publicProfile: false
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('chainmind-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setProfileData(settings.profile || profileData);
      setNotifications(settings.notifications || notifications);
      setSecurity(settings.security || security);
      setAppearance(settings.appearance || appearance);
      setPrivacy(settings.privacy || privacy);
    }
  }, []);

  const saveSettings = () => {
    setLoading(true);
    try {
      const settings = {
        profile: profileData,
        notifications,
        security,
        appearance,
        privacy
      };
      localStorage.setItem('chainmind-settings', JSON.stringify(settings));
      setDisplayName(profileData.displayName);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportData = () => {
    const data = {
      profile: profileData,
      settings: { notifications, security, appearance, privacy },
      wallet: { address: account, network: network?.name },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chainmind-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'wallet', name: 'Wallet', icon: Wallet }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-gray-300 text-lg">Customize your ChainMind experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-purple-300 font-medium mb-2">Display Name</label>
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                        placeholder="Enter your display name"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-purple-300 font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-purple-300 font-medium mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <h3 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                          <p className="text-gray-400 text-sm">
                            {key === 'proposals' && 'Get notified about new proposals'}
                            {key === 'voting' && 'Voting reminders and deadlines'}
                            {key === 'rewards' && 'Reward claims and earnings'}
                            {key === 'governance' && 'Governance updates and changes'}
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'push' && 'Browser push notifications'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, [key]: !value})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <button
                        onClick={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security.twoFactor ? 'bg-purple-500' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl">
                      <label className="block text-white font-medium mb-2">Session Timeout</label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="240">4 hours</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-purple-300 font-medium mb-2">Theme</label>
                      <select
                        value={appearance.theme}
                        onChange={(e) => setAppearance({...appearance, theme: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-purple-300 font-medium mb-2">Language</label>
                      <select
                        value={appearance.language}
                        onChange={(e) => setAppearance({...appearance, language: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-purple-300 font-medium mb-2">Currency</label>
                      <select
                        value={appearance.currency}
                        onChange={(e) => setAppearance({...appearance, currency: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-purple-300 font-medium mb-2">Date Format</label>
                      <select
                        value={appearance.dateFormat}
                        onChange={(e) => setAppearance({...appearance, dateFormat: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <h3 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                          <p className="text-gray-400 text-sm">
                            {key === 'showBalance' && 'Display your token balances publicly'}
                            {key === 'showActivity' && 'Show your governance activity'}
                            {key === 'publicProfile' && 'Make your profile visible to others'}
                          </p>
                        </div>
                        <button
                          onClick={() => setPrivacy({...privacy, [key]: !value})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet Tab */}
              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Wallet Information</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h3 className="text-white font-medium mb-2">Connected Address</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-mono">{account}</span>
                        <button
                          onClick={copyAddress}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h3 className="text-white font-medium mb-2">Network</h3>
                      <span className="text-gray-300">{network?.name || 'Unknown'}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h3 className="text-white font-medium mb-2">ETH Balance</h3>
                        <span className="text-gray-300">{parseFloat(ethBalance).toFixed(4)} ETH</span>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h3 className="text-white font-medium mb-2">MIND Balance</h3>
                        <span className="text-gray-300">{parseFloat(tokenBalance).toLocaleString()} MIND</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={exportData}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                      </button>
                      
                      <button
                        onClick={disconnectWallet}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-white/10 mt-8">
                <motion.button
                  onClick={saveSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Settings</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;