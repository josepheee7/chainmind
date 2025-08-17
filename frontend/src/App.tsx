import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout/Layout';
import { useWeb3 } from './contexts/Web3Context';
import { useTheme } from './contexts/ThemeContext';

// Eager-load Landing to avoid loader on home page
import Landing from './pages/Landing';

// Legacy Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Proposals = lazy(() => import('./pages/Proposals'));
const ProposalDetail = lazy(() => import('./pages/ProposalDetail'));
const CreateProposal = lazy(() => import('./pages/CreateProposal'));
const CreateGrant = lazy(() => import('./pages/CreateGrant'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Community = lazy(() => import('./pages/Community'));
const Treasury = lazy(() => import('./pages/Treasury'));
const Staking = lazy(() => import('./pages/Staking'));
const Rewards = lazy(() => import('./pages/Rewards'));
const Settings = lazy(() => import('./pages/Settings'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Predictions = lazy(() => import('./pages/Predictions'));
const LiveAnalytics = lazy(() => import('./pages/LiveAnalytics'));

// Advanced Pages
const Grants = lazy(() => import('./pages/Grants'));
const GovernanceForums = lazy(() => import('./pages/GovernanceForums'));
const ReputationCenter = lazy(() => import('./pages/ReputationCenter'));
const SnapshotVoting = lazy(() => import('./pages/SnapshotVoting'));
const MobileGovernance = lazy(() => import('./pages/MobileGovernance'));
const CrossChainGovernance = lazy(() => import('./pages/CrossChainGovernance'));
const AITest = lazy(() => import('./pages/AITest'));
const DemoWalkthrough = lazy(() => import('./pages/DemoWalkthrough'));
const GovernanceStaking = lazy(() => import('./pages/GovernanceStaking'));

// Loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Loading ChainMind...
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
        Preparing your governance experience
      </p>
    </motion.div>
  </div>
);

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useWeb3();
  
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Error boundary shell (no extra layout wrapper to avoid double spacing)
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isConnected } = useWeb3();
  const { isDark } = useTheme();

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: isDark ? '#1E293B' : '#FFFFFF',
              color: isDark ? '#F1F5F9' : '#0F172A',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        {/* Main application */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<DemoWalkthrough />} />
            <Route path="/docs" element={<Documentation />} />
            
            {/* Protected routes with layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/proposals"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Proposals />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/proposals/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProposalDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/create-proposal"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateProposal />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-grant"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreateGrant />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Community />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/treasury"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Treasury />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/staking"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Staking />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Rewards />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Legacy Enhanced Features */}
            <Route
              path="/predictions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Predictions />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/live-analytics"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LiveAnalytics />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Advanced Routes */}

            <Route
              path="/grants"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Grants />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/forums"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GovernanceForums />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reputation"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReputationCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/snapshot"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SnapshotVoting />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mobile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MobileGovernance />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cross-chain"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CrossChainGovernance />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-test"
              element={
                <Layout>
                  <AITest />
                </Layout>
              }
            />

            <Route
              path="/governance-staking"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GovernanceStaking />
                  </Layout>
                </ProtectedRoute>
              }
            />



            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
              </div>
    </ErrorBoundary>
  );
};

export default App;
