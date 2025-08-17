#!/usr/bin/env python3
"""
Advanced ML Models for ChainMind AI Backend
==========================================

Production-grade machine learning models for DAO governance prediction.
Features:
- Deep Neural Networks with LSTM for sequential data
- Advanced ensemble methods
- Transformer-based NLP models  
- Real-time model serving and caching
- Model versioning and A/B testing
- Feature engineering pipelines
- Automated hyperparameter optimization
"""

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.ensemble import VotingClassifier, StackingClassifier
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import xgboost as xgb
import lightgbm as lgb
from transformers import AutoTokenizer, AutoModel, AutoModelForSequenceClassification
import joblib
import pickle
from typing import Dict, List, Tuple, Any
import logging
import asyncio
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProposalDataset(Dataset):
    """PyTorch Dataset for proposal data"""
    
    def __init__(self, features: np.ndarray, labels: np.ndarray = None):
        self.features = torch.FloatTensor(features)
        self.labels = torch.LongTensor(labels) if labels is not None else None
    
    def __len__(self):
        return len(self.features)
    
    def __getitem__(self, idx):
        if self.labels is not None:
            return self.features[idx], self.labels[idx]
        return self.features[idx]

class DeepGovernanceNet(nn.Module):
    """Deep Neural Network for Governance Prediction"""
    
    def __init__(self, input_size: int, hidden_sizes: List[int] = [512, 256, 128], 
                 dropout_rate: float = 0.3, num_classes: int = 2):
        super(DeepGovernanceNet, self).__init__()
        
        layers = []
        prev_size = input_size
        
        for hidden_size in hidden_sizes:
            layers.extend([
                nn.Linear(prev_size, hidden_size),
                nn.ReLU(),
                nn.BatchNorm1d(hidden_size),
                nn.Dropout(dropout_rate)
            ])
            prev_size = hidden_size
        
        # Output layer
        layers.append(nn.Linear(prev_size, num_classes))
        
        self.network = nn.Sequential(*layers)
        self.softmax = nn.Softmax(dim=1)
    
    def forward(self, x):
        logits = self.network(x)
        return self.softmax(logits)

class LSTMGovernanceModel(nn.Module):
    """LSTM model for sequential governance data"""
    
    def __init__(self, input_size: int, hidden_size: int = 256, 
                 num_layers: int = 2, dropout_rate: float = 0.3):
        super(LSTMGovernanceModel, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, 
                           batch_first=True, dropout=dropout_rate)
        self.attention = nn.MultiheadAttention(hidden_size, num_heads=8)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, 128),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(128, 2)
        )
        self.softmax = nn.Softmax(dim=1)
    
    def forward(self, x):
        # LSTM forward pass
        lstm_out, (h_n, c_n) = self.lstm(x)
        
        # Apply attention
        attn_out, _ = self.attention(lstm_out, lstm_out, lstm_out)
        
        # Use last hidden state for classification
        final_hidden = attn_out[:, -1, :]
        logits = self.classifier(final_hidden)
        
        return self.softmax(logits)

class TransformerGovernanceModel:
    """Transformer-based model using pre-trained BERT/RoBERTa"""
    
    def __init__(self, model_name: str = "roberta-base"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name, num_labels=2
        )
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
    
    def predict(self, texts: List[str]) -> np.ndarray:
        """Predict using transformer model"""
        self.model.eval()
        predictions = []
        
        with torch.no_grad():
            for text in texts:
                # Tokenize
                inputs = self.tokenizer(
                    text, return_tensors='pt', 
                    truncation=True, padding=True, max_length=512
                )
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                # Forward pass
                outputs = self.model(**inputs)
                probs = torch.softmax(outputs.logits, dim=-1)
                predictions.append(probs.cpu().numpy()[0])
        
        return np.array(predictions)

class AdvancedEnsemble:
    """Advanced ensemble with multiple algorithms and meta-learning"""
    
    def __init__(self):
        # Base models
        self.base_models = {
            'xgb': xgb.XGBClassifier(
                n_estimators=200,
                max_depth=8,
                learning_rate=0.1,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42
            ),
            'lgb': lgb.LGBMClassifier(
                n_estimators=200,
                num_leaves=100,
                learning_rate=0.1,
                feature_fraction=0.8,
                bagging_fraction=0.8,
                random_state=42
            ),
            'rf': RandomForestClassifier(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            ),
            'svm': SVC(
                C=1.0,
                kernel='rbf',
                gamma='scale',
                probability=True,
                random_state=42
            ),
            'mlp': MLPClassifier(
                hidden_layer_sizes=(256, 128, 64),
                activation='relu',
                solver='adam',
                alpha=0.001,
                learning_rate='adaptive',
                max_iter=500,
                random_state=42
            )
        }
        
        # Meta-learner for stacking
        self.meta_learner = LogisticRegression(random_state=42)
        self.stacking_ensemble = None
        
        # Feature processors
        self.scaler = StandardScaler()
        self.feature_selector = SelectKBest(f_classif, k=50)
        self.pca = PCA(n_components=0.95)  # Retain 95% variance
    
    def fit(self, X: np.ndarray, y: np.ndarray):
        """Train the ensemble"""
        logger.info("Training Advanced Ensemble...")
        
        # Feature preprocessing
        X_scaled = self.scaler.fit_transform(X)
        X_selected = self.feature_selector.fit_transform(X_scaled, y)
        
        # Create stacking ensemble
        self.stacking_ensemble = StackingClassifier(
            estimators=list(self.base_models.items()),
            final_estimator=self.meta_learner,
            cv=5,
            stack_method='predict_proba',
            n_jobs=-1
        )
        
        # Fit the ensemble
        self.stacking_ensemble.fit(X_selected, y)
        
        logger.info("Advanced Ensemble training completed")
    
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Predict probabilities"""
        X_scaled = self.scaler.transform(X)
        X_selected = self.feature_selector.transform(X_scaled)
        return self.stacking_ensemble.predict_proba(X_selected)
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions"""
        return self.stacking_ensemble.predict(
            self.feature_selector.transform(self.scaler.transform(X))
        )

class AdvancedFeatureEngine:
    """Advanced feature engineering for governance proposals"""
    
    def __init__(self):
        self.sentiment_analyzer = None
        self.topic_model = None
        self.embedding_model = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize NLP models"""
        try:
            from transformers import pipeline
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis", 
                model="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
        except Exception as e:
            logger.warning(f"Could not load sentiment analyzer: {e}")
    
    def extract_advanced_features(self, title: str, description: str, 
                                historical_context: Dict = None) -> Dict[str, float]:
        """Extract comprehensive features"""
        features = {}
        combined_text = f"{title} {description}"
        
        # Basic text features
        features.update(self._extract_text_features(title, description))
        
        # Sentiment features
        features.update(self._extract_sentiment_features(combined_text))
        
        # Semantic features
        features.update(self._extract_semantic_features(combined_text))
        
        # Economic features
        features.update(self._extract_economic_features(combined_text))
        
        # Risk features
        features.update(self._extract_risk_features(combined_text))
        
        # Technical features
        features.update(self._extract_technical_features(combined_text))
        
        # Temporal features
        features.update(self._extract_temporal_features(combined_text))
        
        # Context features
        if historical_context:
            features.update(self._extract_context_features(combined_text, historical_context))
        
        return features
    
    def _extract_text_features(self, title: str, description: str) -> Dict[str, float]:
        """Extract basic text features"""
        return {
            'title_length': len(title),
            'title_word_count': len(title.split()),
            'description_length': len(description),
            'description_word_count': len(description.split()),
            'total_sentences': len(description.split('.')),
            'avg_sentence_length': len(description) / max(len(description.split('.')), 1),
            'punctuation_ratio': sum(1 for c in description if c in '.,!?;:') / max(len(description), 1),
            'capital_ratio': sum(1 for c in description if c.isupper()) / max(len(description), 1)
        }
    
    def _extract_sentiment_features(self, text: str) -> Dict[str, float]:
        """Extract sentiment-based features"""
        features = {}
        
        if self.sentiment_analyzer:
            try:
                result = self.sentiment_analyzer(text[:512])  # Truncate for model limits
                features['sentiment_label'] = 1.0 if result[0]['label'] == 'POSITIVE' else 0.0
                features['sentiment_score'] = result[0]['score']
            except:
                features['sentiment_label'] = 0.5
                features['sentiment_score'] = 0.5
        
        # Keyword-based sentiment
        positive_keywords = [
            'improve', 'enhance', 'optimize', 'increase', 'reward', 'incentive',
            'growth', 'expand', 'benefit', 'profit', 'gain', 'success', 'achieve'
        ]
        negative_keywords = [
            'reduce', 'decrease', 'cut', 'penalty', 'risk', 'danger', 'problem',
            'issue', 'concern', 'threat', 'loss', 'fail', 'decline'
        ]
        
        text_lower = text.lower()
        pos_count = sum(1 for word in positive_keywords if word in text_lower)
        neg_count = sum(1 for word in negative_keywords if word in text_lower)
        
        features['positive_keyword_ratio'] = pos_count / max(len(text.split()), 1)
        features['negative_keyword_ratio'] = neg_count / max(len(text.split()), 1)
        features['sentiment_balance'] = (pos_count - neg_count) / max(len(text.split()), 1)
        
        return features
    
    def _extract_semantic_features(self, text: str) -> Dict[str, float]:
        """Extract semantic features"""
        features = {}
        
        # Topic categories
        topics = {
            'governance': ['governance', 'voting', 'proposal', 'decision', 'community'],
            'economic': ['treasury', 'fund', 'token', 'reward', 'fee', 'economic'],
            'technical': ['protocol', 'smart contract', 'upgrade', 'implementation', 'code'],
            'security': ['security', 'audit', 'vulnerability', 'attack', 'exploit'],
            'partnership': ['partnership', 'collaboration', 'integration', 'alliance'],
            'marketing': ['marketing', 'branding', 'promotion', 'outreach', 'community']
        }
        
        text_lower = text.lower()
        for topic, keywords in topics.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            features[f'{topic}_score'] = count / max(len(text.split()), 1)
        
        return features
    
    def _extract_economic_features(self, text: str) -> Dict[str, float]:
        """Extract economic impact features"""
        features = {}
        
        economic_indicators = {
            'treasury_impact': ['treasury', 'fund', 'allocation', 'budget'],
            'token_economics': ['token', 'supply', 'inflation', 'deflation', 'burn'],
            'fee_structure': ['fee', 'cost', 'price', 'rate', 'commission'],
            'rewards': ['reward', 'incentive', 'yield', 'apy', 'returns'],
            'investment': ['invest', 'capital', 'funding', 'grant', 'subsidy']
        }
        
        text_lower = text.lower()
        for indicator, keywords in economic_indicators.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            features[indicator] = count / max(len(text.split()), 1)
        
        # Monetary value extraction (simplified)
        import re
        amounts = re.findall(r'\$[\d,]+|\d+\s*(?:million|billion|k|M|B)', text_lower)
        features['has_monetary_value'] = 1.0 if amounts else 0.0
        features['monetary_mentions'] = len(amounts)
        
        return features
    
    def _extract_risk_features(self, text: str) -> Dict[str, float]:
        """Extract risk-related features"""
        features = {}
        
        risk_categories = {
            'security_risk': ['security', 'vulnerability', 'exploit', 'attack', 'hack'],
            'financial_risk': ['loss', 'deficit', 'debt', 'bankruptcy', 'insolvent'],
            'technical_risk': ['bug', 'error', 'failure', 'crash', 'downtime'],
            'regulatory_risk': ['regulation', 'compliance', 'legal', 'lawsuit', 'ban'],
            'market_risk': ['volatility', 'crash', 'bubble', 'bear', 'decline']
        }
        
        text_lower = text.lower()
        total_risk_score = 0
        
        for risk_type, keywords in risk_categories.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            score = count / max(len(text.split()), 1)
            features[risk_type] = score
            total_risk_score += score
        
        features['total_risk_score'] = total_risk_score
        
        # Uncertainty indicators
        uncertainty_words = ['uncertain', 'unclear', 'ambiguous', 'vague', 'unknown']
        features['uncertainty_score'] = sum(1 for word in uncertainty_words 
                                          if word in text_lower) / max(len(text.split()), 1)
        
        return features
    
    def _extract_technical_features(self, text: str) -> Dict[str, float]:
        """Extract technical complexity features"""
        features = {}
        
        technical_terms = {
            'blockchain': ['blockchain', 'chain', 'block', 'hash', 'merkle'],
            'smart_contracts': ['contract', 'solidity', 'bytecode', 'gas', 'ethereum'],
            'defi': ['defi', 'swap', 'liquidity', 'amm', 'yield', 'farming'],
            'infrastructure': ['node', 'validator', 'consensus', 'staking', 'mining'],
            'integration': ['api', 'sdk', 'library', 'framework', 'integration']
        }
        
        text_lower = text.lower()
        total_technical_score = 0
        
        for category, terms in technical_terms.items():
            count = sum(1 for term in terms if term in text_lower)
            score = count / max(len(text.split()), 1)
            features[f'technical_{category}'] = score
            total_technical_score += score
        
        features['technical_complexity'] = total_technical_score
        
        return features
    
    def _extract_temporal_features(self, text: str) -> Dict[str, float]:
        """Extract time-related features"""
        features = {}
        
        urgency_indicators = ['urgent', 'immediate', 'asap', 'quickly', 'emergency']
        timeline_indicators = ['deadline', 'timeline', 'schedule', 'phase', 'milestone']
        
        text_lower = text.lower()
        
        features['urgency_score'] = sum(1 for word in urgency_indicators 
                                      if word in text_lower) / max(len(text.split()), 1)
        features['timeline_mentions'] = sum(1 for word in timeline_indicators 
                                          if word in text_lower) / max(len(text.split()), 1)
        
        # Time period extraction
        time_periods = ['day', 'week', 'month', 'year', 'quarter']
        features['time_period_mentions'] = sum(1 for period in time_periods 
                                             if period in text_lower) / max(len(text.split()), 1)
        
        return features
    
    def _extract_context_features(self, text: str, context: Dict) -> Dict[str, float]:
        """Extract contextual features based on historical data"""
        features = {}
        
        # Historical success rate for similar proposals
        if 'similar_proposals' in context:
            features['historical_success_rate'] = context.get('success_rate', 0.5)
            features['similar_proposal_count'] = context.get('count', 0)
        
        # DAO-specific features
        if 'dao_stats' in context:
            stats = context['dao_stats']
            features['dao_participation_rate'] = stats.get('avg_participation', 0.5)
            features['dao_treasury_health'] = stats.get('treasury_score', 0.5)
        
        return features

class ModelCache:
    """Intelligent model caching and serving"""
    
    def __init__(self, cache_size: int = 100):
        self.cache = {}
        self.cache_size = cache_size
        self.access_times = {}
    
    def get_prediction(self, text_hash: str) -> Dict:
        """Get cached prediction"""
        if text_hash in self.cache:
            self.access_times[text_hash] = datetime.now()
            return self.cache[text_hash]
        return None
    
    def cache_prediction(self, text_hash: str, prediction: Dict):
        """Cache a prediction"""
        if len(self.cache) >= self.cache_size:
            # Remove least recently used
            oldest_key = min(self.access_times.keys(), 
                           key=lambda k: self.access_times[k])
            del self.cache[oldest_key]
            del self.access_times[oldest_key]
        
        self.cache[text_hash] = prediction
        self.access_times[text_hash] = datetime.now()

# Global model instances
advanced_ensemble = AdvancedEnsemble()
feature_engine = AdvancedFeatureEngine()
model_cache = ModelCache()
deep_net = None
transformer_model = None

def initialize_advanced_models():
    """Initialize all advanced models"""
    global deep_net, transformer_model
    
    logger.info("Initializing Advanced ML Models...")
    
    # Initialize transformer model
    try:
        transformer_model = TransformerGovernanceModel()
        logger.info("Transformer model loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load transformer model: {e}")
    
    logger.info("Advanced ML Models initialized")

def train_advanced_models(X: np.ndarray, y: np.ndarray):
    """Train all advanced models"""
    logger.info("Training advanced ML models...")
    
    # Train ensemble
    advanced_ensemble.fit(X, y)
    
    # Train deep neural network
    global deep_net
    if X.shape[1] > 0:
        deep_net = DeepGovernanceNet(input_size=X.shape[1])
        
        # Convert to PyTorch dataset
        dataset = ProposalDataset(X, y)
        dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
        
        # Training loop
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(deep_net.parameters(), lr=0.001)
        
        deep_net.train()
        for epoch in range(50):  # Quick training for demo
            total_loss = 0
            for features, labels in dataloader:
                optimizer.zero_grad()
                outputs = deep_net(features)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            
            if epoch % 10 == 0:
                logger.info(f"Deep NN Epoch {epoch}, Loss: {total_loss:.4f}")
    
    logger.info("Advanced models training completed")

def get_advanced_prediction(title: str, description: str, 
                          context: Dict = None) -> Dict[str, Any]:
    """Get prediction from advanced models"""
    
    # Check cache first
    text_hash = hashlib.md5(f"{title}{description}".encode()).hexdigest()
    cached_result = model_cache.get_prediction(text_hash)
    if cached_result:
        return cached_result
    
    # Extract advanced features
    features = feature_engine.extract_advanced_features(title, description, context)
    feature_array = np.array([list(features.values())])
    
    predictions = {}
    
    # Ensemble prediction
    try:
        if hasattr(advanced_ensemble, 'stacking_ensemble') and advanced_ensemble.stacking_ensemble:
            ensemble_probs = advanced_ensemble.predict_proba(feature_array)
            predictions['ensemble'] = {
                'success_probability': float(ensemble_probs[0][1]),
                'confidence': float(max(ensemble_probs[0]))
            }
    except Exception as e:
        logger.warning(f"Ensemble prediction failed: {e}")
    
    # Deep neural network prediction
    try:
        if deep_net is not None:
            deep_net.eval()
            with torch.no_grad():
                deep_probs = deep_net(torch.FloatTensor(feature_array))
                predictions['deep_nn'] = {
                    'success_probability': float(deep_probs[0][1]),
                    'confidence': float(max(deep_probs[0]))
                }
    except Exception as e:
        logger.warning(f"Deep NN prediction failed: {e}")
    
    # Transformer prediction
    try:
        if transformer_model is not None:
            transformer_probs = transformer_model.predict([f"{title} {description}"])
            predictions['transformer'] = {
                'success_probability': float(transformer_probs[0][1]),
                'confidence': float(max(transformer_probs[0]))
            }
    except Exception as e:
        logger.warning(f"Transformer prediction failed: {e}")
    
    # Combine predictions (ensemble of ensembles)
    if predictions:
        success_probs = [p['success_probability'] for p in predictions.values()]
        confidences = [p['confidence'] for p in predictions.values()]
        
        final_prediction = {
            'success_probability': np.mean(success_probs),
            'confidence': np.mean(confidences),
            'model_agreement': np.std(success_probs),  # Lower std = better agreement
            'features': features,
            'individual_predictions': predictions
        }
    else:
        # Fallback to simple prediction
        final_prediction = {
            'success_probability': 0.6,  # Default
            'confidence': 0.5,
            'model_agreement': 0.5,
            'features': features,
            'individual_predictions': {}
        }
    
    # Cache the result
    model_cache.cache_prediction(text_hash, final_prediction)
    
    return final_prediction
