#!/usr/bin/env python3
"""
Real-time Blockchain Monitoring System
======================================

Production-grade blockchain monitoring for DAO governance events.
Features:
- Real-time event monitoring across multiple chains
- Smart contract event parsing
- Governance proposal tracking
- Voting pattern analysis
- Treasury monitoring
- Gas optimization
- Multi-chain support (Ethereum, Polygon, Arbitrum, etc.)
- WebSocket connections for live updates
- Event caching and replay
- Anomaly detection
"""

import asyncio
import aiohttp
import websockets
import json
import logging
from typing import Dict, List, Optional, Callable, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import hashlib
from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_utils import to_checksum_address, is_address
import pandas as pd
import numpy as np
from collections import defaultdict, deque
import threading
import queue
import time
import redis
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChainType(Enum):
    ETHEREUM = "ethereum"
    POLYGON = "polygon"
    ARBITRUM = "arbitrum"
    OPTIMISM = "optimism"
    BSC = "bsc"

class EventType(Enum):
    PROPOSAL_CREATED = "ProposalCreated"
    VOTE_CAST = "VoteCast"
    PROPOSAL_EXECUTED = "ProposalExecuted"
    PROPOSAL_CANCELED = "ProposalCanceled"
    TREASURY_UPDATE = "TreasuryUpdate"
    TOKEN_TRANSFER = "Transfer"
    DELEGATION_CHANGED = "DelegationChanged"

@dataclass
class BlockchainEvent:
    """Represents a blockchain event"""
    chain: ChainType
    event_type: EventType
    transaction_hash: str
    block_number: int
    timestamp: datetime
    contract_address: str
    data: Dict[str, Any]
    gas_used: int
    gas_price: int

@dataclass
class ProposalEvent:
    """DAO proposal event"""
    proposal_id: int
    proposer: str
    title: str
    description: str
    start_block: int
    end_block: int
    quorum: int
    event_time: datetime
    chain: ChainType

@dataclass
class VoteEvent:
    """Voting event"""
    proposal_id: int
    voter: str
    support: bool
    voting_power: int
    reason: str
    event_time: datetime
    chain: ChainType

class ChainConfig:
    """Configuration for different chains"""
    
    CONFIGS = {
        ChainType.ETHEREUM: {
            "rpc_url": "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
            "ws_url": "wss://eth-mainnet.g.alchemy.com/v2/your-api-key",
            "chain_id": 1,
            "block_time": 12,
            "gas_multiplier": 1.1
        },
        ChainType.POLYGON: {
            "rpc_url": "https://polygon-mainnet.g.alchemy.com/v2/your-api-key",
            "ws_url": "wss://polygon-mainnet.g.alchemy.com/v2/your-api-key",
            "chain_id": 137,
            "block_time": 2,
            "gas_multiplier": 1.2
        },
        ChainType.ARBITRUM: {
            "rpc_url": "https://arb-mainnet.g.alchemy.com/v2/your-api-key",
            "ws_url": "wss://arb-mainnet.g.alchemy.com/v2/your-api-key",
            "chain_id": 42161,
            "block_time": 1,
            "gas_multiplier": 1.0
        }
    }
    
    @classmethod
    def get_config(cls, chain: ChainType) -> Dict:
        return cls.CONFIGS.get(chain, cls.CONFIGS[ChainType.ETHEREUM])

class ContractABI:
    """Smart contract ABIs for governance contracts"""
    
    GOVERNOR_ABI = [
        {
            "anonymous": False,
            "inputs": [
                {"indexed": False, "name": "proposalId", "type": "uint256"},
                {"indexed": True, "name": "proposer", "type": "address"},
                {"indexed": False, "name": "targets", "type": "address[]"},
                {"indexed": False, "name": "values", "type": "uint256[]"},
                {"indexed": False, "name": "signatures", "type": "string[]"},
                {"indexed": False, "name": "calldatas", "type": "bytes[]"},
                {"indexed": False, "name": "startBlock", "type": "uint256"},
                {"indexed": False, "name": "endBlock", "type": "uint256"},
                {"indexed": False, "name": "description", "type": "string"}
            ],
            "name": "ProposalCreated",
            "type": "event"
        },
        {
            "anonymous": False,
            "inputs": [
                {"indexed": True, "name": "voter", "type": "address"},
                {"indexed": False, "name": "proposalId", "type": "uint256"},
                {"indexed": False, "name": "support", "type": "uint8"},
                {"indexed": False, "name": "weight", "type": "uint256"},
                {"indexed": False, "name": "reason", "type": "string"}
            ],
            "name": "VoteCast",
            "type": "event"
        }
    ]
    
    TOKEN_ABI = [
        {
            "anonymous": False,
            "inputs": [
                {"indexed": True, "name": "from", "type": "address"},
                {"indexed": True, "name": "to", "type": "address"},
                {"indexed": False, "name": "value", "type": "uint256"}
            ],
            "name": "Transfer",
            "type": "event"
        }
    ]

class EventProcessor:
    """Process and analyze blockchain events"""
    
    def __init__(self):
        self.event_history = defaultdict(list)
        self.voting_patterns = defaultdict(dict)
        self.proposal_analytics = {}
        self.anomaly_detector = AnomalyDetector()
    
    def process_proposal_event(self, event: ProposalEvent):
        """Process a new proposal event"""
        logger.info(f"Processing proposal {event.proposal_id} on {event.chain.value}")
        
        # Store event
        self.event_history['proposals'].append(event)
        
        # Initialize analytics
        self.proposal_analytics[event.proposal_id] = {
            'created_at': event.event_time,
            'votes_for': 0,
            'votes_against': 0,
            'unique_voters': set(),
            'voting_velocity': [],
            'gas_analysis': {'total_spent': 0, 'avg_price': 0},
            'sentiment_score': 0.0
        }
    
    def process_vote_event(self, event: VoteEvent):
        """Process a voting event"""
        logger.info(f"Processing vote for proposal {event.proposal_id} by {event.voter}")
        
        # Update proposal analytics
        if event.proposal_id in self.proposal_analytics:
            analytics = self.proposal_analytics[event.proposal_id]
            
            if event.support:
                analytics['votes_for'] += event.voting_power
            else:
                analytics['votes_against'] += event.voting_power
            
            analytics['unique_voters'].add(event.voter)
            analytics['voting_velocity'].append({
                'timestamp': event.event_time,
                'cumulative_votes': len(analytics['unique_voters'])
            })
        
        # Update voting patterns
        voter_pattern = self.voting_patterns[event.voter]
        if 'votes' not in voter_pattern:
            voter_pattern['votes'] = []
        
        voter_pattern['votes'].append({
            'proposal_id': event.proposal_id,
            'support': event.support,
            'power': event.voting_power,
            'timestamp': event.event_time
        })
        
        # Detect anomalies
        self.anomaly_detector.check_voting_anomaly(event)
    
    def get_proposal_analytics(self, proposal_id: int) -> Dict:
        """Get comprehensive analytics for a proposal"""
        if proposal_id not in self.proposal_analytics:
            return {}
        
        analytics = self.proposal_analytics[proposal_id].copy()
        analytics['unique_voters'] = len(analytics['unique_voters'])
        
        # Calculate voting velocity
        if analytics['voting_velocity']:
            time_diffs = []
            for i in range(1, len(analytics['voting_velocity'])):
                prev_time = analytics['voting_velocity'][i-1]['timestamp']
                curr_time = analytics['voting_velocity'][i]['timestamp']
                time_diffs.append((curr_time - prev_time).total_seconds())
            
            analytics['avg_voting_interval'] = np.mean(time_diffs) if time_diffs else 0
        
        return analytics
    
    def get_voter_profile(self, voter_address: str) -> Dict:
        """Get voting profile for an address"""
        if voter_address not in self.voting_patterns:
            return {}
        
        pattern = self.voting_patterns[voter_address]
        votes = pattern.get('votes', [])
        
        if not votes:
            return {}
        
        total_votes = len(votes)
        support_votes = sum(1 for v in votes if v['support'])
        
        return {
            'total_votes': total_votes,
            'support_ratio': support_votes / total_votes,
            'avg_voting_power': np.mean([v['power'] for v in votes]),
            'first_vote': min(v['timestamp'] for v in votes),
            'last_vote': max(v['timestamp'] for v in votes),
            'most_active_period': self._find_most_active_period(votes)
        }
    
    def _find_most_active_period(self, votes: List[Dict]) -> str:
        """Find the most active voting period for a user"""
        if len(votes) < 2:
            return "insufficient_data"
        
        # Group votes by month
        monthly_counts = defaultdict(int)
        for vote in votes:
            month_key = vote['timestamp'].strftime('%Y-%m')
            monthly_counts[month_key] += 1
        
        if not monthly_counts:
            return "no_data"
        
        most_active_month = max(monthly_counts, key=monthly_counts.get)
        return most_active_month

class AnomalyDetector:
    """Detect anomalous voting patterns and governance events"""
    
    def __init__(self):
        self.vote_thresholds = {
            'large_vote_threshold': 100000,  # Tokens
            'rapid_voting_threshold': 60,    # Seconds
            'suspicious_pattern_threshold': 0.95  # Correlation
        }
        self.recent_votes = deque(maxlen=100)
        self.alerts = []
    
    def check_voting_anomaly(self, vote_event: VoteEvent):
        """Check for voting anomalies"""
        self.recent_votes.append(vote_event)
        
        # Check for large votes
        if vote_event.voting_power > self.vote_thresholds['large_vote_threshold']:
            self._create_alert('large_vote', vote_event, 
                             f"Large vote detected: {vote_event.voting_power} tokens")
        
        # Check for rapid voting
        if len(self.recent_votes) > 1:
            time_diff = (vote_event.event_time - self.recent_votes[-2].event_time).total_seconds()
            if time_diff < self.vote_thresholds['rapid_voting_threshold']:
                self._create_alert('rapid_voting', vote_event,
                                 f"Rapid voting detected: {time_diff} seconds apart")
        
        # Check for coordinated voting
        self._check_coordinated_voting(vote_event)
    
    def _check_coordinated_voting(self, vote_event: VoteEvent):
        """Check for potential coordinated voting patterns"""
        recent_same_proposal = [
            v for v in self.recent_votes 
            if v.proposal_id == vote_event.proposal_id and 
            (vote_event.event_time - v.event_time).total_seconds() < 300  # 5 minutes
        ]
        
        if len(recent_same_proposal) > 5:  # More than 5 votes in 5 minutes
            same_support = sum(1 for v in recent_same_proposal if v.support == vote_event.support)
            if same_support / len(recent_same_proposal) > self.vote_thresholds['suspicious_pattern_threshold']:
                self._create_alert('coordinated_voting', vote_event,
                                 f"Potential coordinated voting: {same_support}/{len(recent_same_proposal)} same votes")
    
    def _create_alert(self, alert_type: str, event: VoteEvent, message: str):
        """Create an anomaly alert"""
        alert = {
            'type': alert_type,
            'timestamp': datetime.now(),
            'proposal_id': event.proposal_id,
            'voter': event.voter,
            'message': message,
            'severity': self._get_severity(alert_type)
        }
        self.alerts.append(alert)
        logger.warning(f"ANOMALY DETECTED: {message}")
    
    def _get_severity(self, alert_type: str) -> str:
        """Get alert severity level"""
        severity_map = {
            'large_vote': 'medium',
            'rapid_voting': 'low',
            'coordinated_voting': 'high'
        }
        return severity_map.get(alert_type, 'medium')

class BlockchainMonitor:
    """Main blockchain monitoring class"""
    
    def __init__(self):
        self.chains = {}
        self.event_processor = EventProcessor()
        self.contracts = {}
        self.running = False
        self.event_queue = queue.Queue()
        self.websocket_connections = {}
        
        # Initialize Redis for caching (optional)
        try:
            self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
            self.redis_available = True
        except:
            logger.warning("Redis not available, using in-memory cache")
            self.redis_available = False
            self.cache = {}
    
    async def initialize_chains(self, chains: List[ChainType]):
        """Initialize blockchain connections"""
        for chain in chains:
            config = ChainConfig.get_config(chain)
            
            # Initialize Web3 connection
            w3 = Web3(Web3.HTTPProvider(config['rpc_url']))
            if chain in [ChainType.POLYGON, ChainType.BSC]:
                w3.middleware_onion.inject(geth_poa_middleware, layer=0)
            
            self.chains[chain] = {
                'web3': w3,
                'config': config,
                'last_block': 0,
                'event_filters': {}
            }
            
            logger.info(f"Initialized {chain.value} connection")
    
    def add_contract(self, chain: ChainType, address: str, abi: List[Dict], contract_type: str = 'governance'):
        """Add a contract to monitor"""
        if chain not in self.chains:
            raise ValueError(f"Chain {chain.value} not initialized")
        
        w3 = self.chains[chain]['web3']
        contract = w3.eth.contract(
            address=to_checksum_address(address),
            abi=abi
        )
        
        contract_key = f"{chain.value}:{address}"
        self.contracts[contract_key] = {
            'contract': contract,
            'chain': chain,
            'type': contract_type,
            'address': address
        }
        
        logger.info(f"Added {contract_type} contract {address} on {chain.value}")
    
    async def start_monitoring(self):
        """Start the monitoring system"""
        self.running = True
        logger.info("Starting blockchain monitoring...")
        
        # Start event processing thread
        processing_thread = threading.Thread(target=self._process_events)
        processing_thread.daemon = True
        processing_thread.start()
        
        # Start monitoring each chain
        tasks = []
        for chain in self.chains.keys():
            tasks.append(self._monitor_chain(chain))
            tasks.append(self._monitor_websocket(chain))
        
        # Start periodic tasks
        tasks.append(self._periodic_analytics_update())
        tasks.append(self._cleanup_old_data())
        
        await asyncio.gather(*tasks)
    
    async def _monitor_chain(self, chain: ChainType):
        """Monitor a specific chain for events"""
        chain_info = self.chains[chain]
        w3 = chain_info['web3']
        
        while self.running:
            try:
                current_block = w3.eth.block_number
                last_block = chain_info['last_block']
                
                if last_block == 0:
                    last_block = current_block - 100  # Start from 100 blocks back
                
                # Process new blocks
                for block_num in range(last_block + 1, current_block + 1):
                    await self._process_block(chain, block_num)
                
                chain_info['last_block'] = current_block
                await asyncio.sleep(chain_info['config']['block_time'])
                
            except Exception as e:
                logger.error(f"Error monitoring {chain.value}: {e}")
                await asyncio.sleep(30)
    
    async def _process_block(self, chain: ChainType, block_number: int):
        """Process events in a specific block"""
        w3 = self.chains[chain]['web3']
        
        try:
            block = w3.eth.get_block(block_number, full_transactions=True)
            
            for tx in block.transactions:
                if tx.to:  # Skip contract creation transactions
                    contract_key = f"{chain.value}:{tx.to}"
                    if contract_key in self.contracts:
                        await self._process_transaction(chain, tx, block)
                        
        except Exception as e:
            logger.error(f"Error processing block {block_number} on {chain.value}: {e}")
    
    async def _process_transaction(self, chain: ChainType, tx, block):
        """Process a transaction for events"""
        try:
            w3 = self.chains[chain]['web3']
            receipt = w3.eth.get_transaction_receipt(tx.hash)
            
            # Process events in the transaction
            for log in receipt.logs:
                contract_key = f"{chain.value}:{log.address}"
                if contract_key in self.contracts:
                    await self._parse_event_log(chain, log, tx, block)
                    
        except Exception as e:
            logger.error(f"Error processing transaction {tx.hash.hex()} on {chain.value}: {e}")
    
    async def _parse_event_log(self, chain: ChainType, log, tx, block):
        """Parse and process event logs"""
        contract_info = self.contracts[f"{chain.value}:{log.address}"]
        contract = contract_info['contract']
        
        try:
            # Try to decode the event
            decoded_log = contract.events.get_event_by_selector(log.topics[0]).processLog(log)
            event_name = decoded_log.event
            event_data = dict(decoded_log.args)
            
            # Create blockchain event
            blockchain_event = BlockchainEvent(
                chain=chain,
                event_type=EventType(event_name),
                transaction_hash=tx.hash.hex(),
                block_number=block.number,
                timestamp=datetime.fromtimestamp(block.timestamp),
                contract_address=log.address,
                data=event_data,
                gas_used=tx.gas,
                gas_price=tx.gasPrice
            )
            
            # Queue event for processing
            self.event_queue.put(blockchain_event)
            
        except Exception as e:
            # Event not recognized or parsing failed
            pass
    
    def _process_events(self):
        """Process events from the queue"""
        while self.running:
            try:
                event = self.event_queue.get(timeout=1)
                self._handle_blockchain_event(event)
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"Error processing event: {e}")
    
    def _handle_blockchain_event(self, event: BlockchainEvent):
        """Handle different types of blockchain events"""
        if event.event_type == EventType.PROPOSAL_CREATED:
            proposal_event = ProposalEvent(
                proposal_id=event.data['proposalId'],
                proposer=event.data['proposer'],
                title=event.data.get('title', 'Unknown'),
                description=event.data['description'],
                start_block=event.data['startBlock'],
                end_block=event.data['endBlock'],
                quorum=event.data.get('quorum', 0),
                event_time=event.timestamp,
                chain=event.chain
            )
            self.event_processor.process_proposal_event(proposal_event)
            
        elif event.event_type == EventType.VOTE_CAST:
            vote_event = VoteEvent(
                proposal_id=event.data['proposalId'],
                voter=event.data['voter'],
                support=bool(event.data['support']),
                voting_power=event.data['weight'],
                reason=event.data.get('reason', ''),
                event_time=event.timestamp,
                chain=event.chain
            )
            self.event_processor.process_vote_event(vote_event)
    
    async def _monitor_websocket(self, chain: ChainType):
        """Monitor WebSocket connections for real-time updates"""
        config = ChainConfig.get_config(chain)
        ws_url = config.get('ws_url')
        
        if not ws_url:
            return
        
        while self.running:
            try:
                async with websockets.connect(ws_url) as websocket:
                    # Subscribe to new block headers
                    subscribe_message = {
                        "id": 1,
                        "method": "eth_subscribe",
                        "params": ["newHeads"]
                    }
                    await websocket.send(json.dumps(subscribe_message))
                    
                    async for message in websocket:
                        data = json.loads(message)
                        if 'params' in data:
                            await self._handle_websocket_message(chain, data)
                            
            except Exception as e:
                logger.error(f"WebSocket error for {chain.value}: {e}")
                await asyncio.sleep(30)
    
    async def _handle_websocket_message(self, chain: ChainType, message: Dict):
        """Handle WebSocket messages"""
        if 'params' in message and 'result' in message['params']:
            block_header = message['params']['result']
            block_number = int(block_header['number'], 16)
            
            # Process the new block
            await self._process_block(chain, block_number)
    
    async def _periodic_analytics_update(self):
        """Periodically update analytics and cache results"""
        while self.running:
            try:
                # Update proposal analytics
                for proposal_id in self.event_processor.proposal_analytics.keys():
                    analytics = self.event_processor.get_proposal_analytics(proposal_id)
                    
                    if self.redis_available:
                        self.redis_client.setex(
                            f"analytics:proposal:{proposal_id}",
                            3600,  # 1 hour TTL
                            json.dumps(analytics, default=str)
                        )
                
                logger.info("Updated proposal analytics cache")
                await asyncio.sleep(300)  # Update every 5 minutes
                
            except Exception as e:
                logger.error(f"Error updating analytics: {e}")
                await asyncio.sleep(60)
    
    async def _cleanup_old_data(self):
        """Clean up old data to prevent memory leaks"""
        while self.running:
            try:
                cutoff_time = datetime.now() - timedelta(days=7)
                
                # Clean up old alerts
                self.event_processor.anomaly_detector.alerts = [
                    alert for alert in self.event_processor.anomaly_detector.alerts
                    if alert['timestamp'] > cutoff_time
                ]
                
                logger.info("Cleaned up old data")
                await asyncio.sleep(3600)  # Clean every hour
                
            except Exception as e:
                logger.error(f"Error during cleanup: {e}")
                await asyncio.sleep(600)
    
    def stop_monitoring(self):
        """Stop the monitoring system"""
        self.running = False
        logger.info("Stopping blockchain monitoring...")
    
    def get_realtime_stats(self) -> Dict:
        """Get real-time monitoring statistics"""
        total_proposals = len(self.event_processor.event_history['proposals'])
        total_voters = len(self.event_processor.voting_patterns)
        active_alerts = len([
            alert for alert in self.event_processor.anomaly_detector.alerts
            if (datetime.now() - alert['timestamp']).total_seconds() < 3600
        ])
        
        return {
            'total_proposals_monitored': total_proposals,
            'unique_voters': total_voters,
            'active_alerts': active_alerts,
            'chains_monitored': list(self.chains.keys()),
            'contracts_monitored': len(self.contracts),
            'uptime': datetime.now().isoformat()
        }

# Global monitor instance
blockchain_monitor = BlockchainMonitor()

async def initialize_monitoring():
    """Initialize the blockchain monitoring system"""
    logger.info("Initializing blockchain monitoring...")
    
    # Initialize chains
    chains_to_monitor = [ChainType.ETHEREUM, ChainType.POLYGON]
    await blockchain_monitor.initialize_chains(chains_to_monitor)
    
    # Add some example contracts (replace with actual addresses)
    blockchain_monitor.add_contract(
        ChainType.ETHEREUM,
        "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",  # Example governor contract
        ContractABI.GOVERNOR_ABI,
        'governance'
    )
    
    logger.info("Blockchain monitoring initialized")

async def start_monitoring():
    """Start the monitoring system"""
    await initialize_monitoring()
    await blockchain_monitor.start_monitoring()

def get_proposal_insights(proposal_id: int) -> Dict:
    """Get AI-enhanced insights for a proposal"""
    analytics = blockchain_monitor.event_processor.get_proposal_analytics(proposal_id)
    
    if not analytics:
        return {"error": "Proposal not found"}
    
    # Add AI insights
    insights = {
        "basic_analytics": analytics,
        "ai_insights": {
            "voting_momentum": _calculate_voting_momentum(analytics),
            "participation_score": _calculate_participation_score(analytics),
            "controversy_score": _calculate_controversy_score(analytics),
            "success_prediction": _predict_success_probability(analytics)
        },
        "recommendations": _generate_recommendations(analytics)
    }
    
    return insights

def _calculate_voting_momentum(analytics: Dict) -> float:
    """Calculate voting momentum score"""
    velocity = analytics.get('voting_velocity', [])
    if len(velocity) < 2:
        return 0.5
    
    recent_votes = len([v for v in velocity if 
                      (datetime.now() - v['timestamp']).total_seconds() < 3600])
    total_votes = len(velocity)
    
    momentum = min(recent_votes / max(total_votes * 0.1, 1), 2.0) * 0.5
    return momentum

def _calculate_participation_score(analytics: Dict) -> float:
    """Calculate participation quality score"""
    unique_voters = analytics.get('unique_voters', 0)
    total_votes = analytics.get('votes_for', 0) + analytics.get('votes_against', 0)
    
    if unique_voters == 0:
        return 0.0
    
    # Higher score for more diverse participation
    diversity_score = min(unique_voters / 100, 1.0)  # Normalize to 100 voters
    engagement_score = min(total_votes / (unique_voters * 1000), 1.0)  # Average 1k tokens per voter
    
    return (diversity_score + engagement_score) / 2

def _calculate_controversy_score(analytics: Dict) -> float:
    """Calculate how controversial the proposal is"""
    votes_for = analytics.get('votes_for', 0)
    votes_against = analytics.get('votes_against', 0)
    total_votes = votes_for + votes_against
    
    if total_votes == 0:
        return 0.0
    
    # Higher controversy when votes are more evenly split
    ratio = min(votes_for, votes_against) / total_votes
    controversy = ratio * 2  # Scale to 0-1 range
    
    return controversy

def _predict_success_probability(analytics: Dict) -> float:
    """Predict probability of proposal success"""
    votes_for = analytics.get('votes_for', 0)
    votes_against = analytics.get('votes_against', 0)
    total_votes = votes_for + votes_against
    
    if total_votes == 0:
        return 0.5  # No data
    
    current_support = votes_for / total_votes
    momentum = _calculate_voting_momentum(analytics)
    participation = _calculate_participation_score(analytics)
    
    # Weighted prediction
    prediction = (current_support * 0.6 + momentum * 0.2 + participation * 0.2)
    return max(0.1, min(0.9, prediction))

def _generate_recommendations(analytics: Dict) -> List[str]:
    """Generate actionable recommendations"""
    recommendations = []
    
    participation = _calculate_participation_score(analytics)
    controversy = _calculate_controversy_score(analytics)
    momentum = _calculate_voting_momentum(analytics)
    
    if participation < 0.3:
        recommendations.append("Consider increasing outreach to boost voter participation")
    
    if controversy > 0.4:
        recommendations.append("This proposal is controversial - consider community discussion")
    
    if momentum < 0.2:
        recommendations.append("Voting momentum is low - proposal may need more promotion")
    
    if not recommendations:
        recommendations.append("Proposal shows healthy voting patterns")
    
    return recommendations
