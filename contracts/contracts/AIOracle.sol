// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AIOracle
 * @dev Oracle contract for AI predictions in ChainMind DAO
 * @notice Connects off-chain AI predictions to on-chain governance
 */
contract AIOracle is Ownable, ReentrancyGuard {
    // State variables
    mapping(address => bool) public authorizedOracles;
    mapping(uint256 => PredictionRequest) public predictionRequests;
    mapping(uint256 => bool) public requestFulfilled;
    
    uint256 public requestCounter;
    uint256 public constant PREDICTION_FEE = 0.001 ether; // Small fee for oracle operations
    
    // Structs
    struct PredictionRequest {
        uint256 requestId;
        address requester;
        uint256 proposalId;
        string title;
        string description;
        uint256 timestamp;
        bool fulfilled;
    }
    
    struct PredictionResponse {
        uint8 successProbability;  // 0-100
        int16 economicImpact;      // Scaled economic impact
        uint8 riskScore;          // 0-100
        uint256 confidence;       // Confidence in prediction
        string analysis;          // Brief analysis explanation
    }
    
    // Events
    event PredictionRequested(
        uint256 indexed requestId,
        address indexed requester,
        uint256 indexed proposalId,
        string title
    );
    
    event PredictionFulfilled(
        uint256 indexed requestId,
        uint256 indexed proposalId,
        uint8 successProbability,
        int16 economicImpact,
        uint8 riskScore
    );
    
    event OracleAuthorized(address indexed oracle, bool authorized);
    event FeeUpdated(uint256 newFee);
    
    // Modifiers
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }
    
    modifier validProposal(uint256 proposalId) {
        require(proposalId > 0, "Invalid proposal ID");
        _;
    }
    
    // Constructor
    constructor() {
        // Owner is automatically authorized
        authorizedOracles[msg.sender] = true;
    }
    
    /**
     * @dev Request AI prediction for a proposal
     * @param proposalId The proposal ID
     * @param title The proposal title
     * @param description The proposal description
     */
    function requestPrediction(
        uint256 proposalId,
        string memory title,
        string memory description
    ) external payable validProposal(proposalId) returns (uint256) {
        require(msg.value >= PREDICTION_FEE, "Insufficient fee");
        
        requestCounter++;
        
        PredictionRequest storage request = predictionRequests[requestCounter];
        request.requestId = requestCounter;
        request.requester = msg.sender;
        request.proposalId = proposalId;
        request.title = title;
        request.description = description;
        request.timestamp = block.timestamp;
        request.fulfilled = false;
        
        emit PredictionRequested(requestCounter, msg.sender, proposalId, title);
        
        return requestCounter;
    }
    
    /**
     * @dev Fulfill prediction request (called by authorized oracle)
     * @param requestId The request ID
     * @param successProbability AI predicted success probability (0-100)
     * @param economicImpact AI predicted economic impact
     * @param riskScore AI predicted risk score (0-100)
     * @param analysis Brief analysis explanation
     */
    function fulfillPrediction(
        uint256 requestId,
        uint8 successProbability,
        int16 economicImpact,
        uint8 riskScore,
        string memory analysis
    ) internal {
        require(requestId <= requestCounter, "Invalid request ID");
        require(!requestFulfilled[requestId], "Request already fulfilled");
        
        PredictionRequest storage request = predictionRequests[requestId];
        require(!request.fulfilled, "Request already processed");
        
        // Validate prediction parameters
        require(successProbability <= 100, "Invalid success probability");
        require(riskScore <= 100, "Invalid risk score");
        
        // Mark as fulfilled
        request.fulfilled = true;
        requestFulfilled[requestId] = true;
        
        // Call back to the requesting contract
        (bool success, ) = request.requester.call(
            abi.encodeWithSignature(
                "receiveAIPrediction(uint256,uint8,int16,uint8)",
                request.proposalId,
                successProbability,
                economicImpact,
                riskScore
            )
        );
        
        require(success, "Callback to requester failed");
        
        emit PredictionFulfilled(
            requestId,
            request.proposalId,
            successProbability,
            economicImpact,
            riskScore
        );
    }
    
    /**
     * @dev Batch fulfill multiple predictions (gas optimization)
     * @param requestIds Array of request IDs
     * @param responses Array of prediction responses
     */
    function batchFulfillPredictions(
        uint256[] memory requestIds,
        PredictionResponse[] memory responses
    ) external onlyAuthorizedOracle nonReentrant {
        require(requestIds.length == responses.length, "Array length mismatch");
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            fulfillPrediction(
                requestIds[i],
                responses[i].successProbability,
                responses[i].economicImpact,
                responses[i].riskScore,
                responses[i].analysis
            );
        }
    }
    
    /**
     * @dev Get prediction request details
     * @param requestId The request ID
     * @return PredictionRequest struct
     */
    function getPredictionRequest(uint256 requestId) 
        external 
        view 
        returns (PredictionRequest memory) 
    {
        require(requestId <= requestCounter, "Invalid request ID");
        return predictionRequests[requestId];
    }
    
    /**
     * @dev Check if prediction request is fulfilled
     * @param requestId The request ID
     * @return Whether the request is fulfilled
     */
    function isPredictionFulfilled(uint256 requestId) external view returns (bool) {
        require(requestId <= requestCounter, "Invalid request ID");
        return requestFulfilled[requestId];
    }
    
    /**
     * @dev Get total number of requests
     * @return The total number of prediction requests
     */
    function getRequestCount() external view returns (uint256) {
        return requestCounter;
    }
    
    /**
     * @dev Get pending requests (not yet fulfilled)
     * @return Array of pending request IDs
     */
    function getPendingRequests() external view returns (uint256[] memory) {
        uint256 pendingCount = 0;
        
        // Count pending requests
        for (uint256 i = 1; i <= requestCounter; i++) {
            if (!requestFulfilled[i]) {
                pendingCount++;
            }
        }
        
        // Create array of pending requests
        uint256[] memory pendingRequests = new uint256[](pendingCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= requestCounter; i++) {
            if (!requestFulfilled[i]) {
                pendingRequests[index] = i;
                index++;
            }
        }
        
        return pendingRequests;
    }
    
    /**
     * @dev Authorize or deauthorize an oracle
     * @param oracle The oracle address
     * @param authorized Whether to authorize or deauthorize
     */
    function setOracleAuthorization(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
        emit OracleAuthorized(oracle, authorized);
    }
    
    /**
     * @dev Update prediction fee
     * @param newFee The new fee amount
     */
    function updatePredictionFee(uint256 newFee) external onlyOwner {
        require(newFee >= 0, "Invalid fee");
        // Update fee logic would go here
        emit FeeUpdated(newFee);
    }
    
    /**
     * @dev Withdraw collected fees
     * @param to Address to send fees to
     */
    function withdrawFees(address payable to) external onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Emergency function to cancel unfulfilled request
     * @param requestId The request ID to cancel
     */
    function cancelRequest(uint256 requestId) external onlyOwner {
        require(requestId <= requestCounter, "Invalid request ID");
        require(!requestFulfilled[requestId], "Request already fulfilled");
        
        PredictionRequest storage request = predictionRequests[requestId];
        request.fulfilled = true;
        requestFulfilled[requestId] = true;
    }
    
    /**
     * @dev Get oracle statistics
     * @return totalRequests, fulfilledRequests, pendingRequests
     */
    function getOracleStats() external view returns (uint256, uint256, uint256) {
        uint256 totalRequests = requestCounter;
        uint256 fulfilledRequests = 0;
        
        for (uint256 i = 1; i <= requestCounter; i++) {
            if (requestFulfilled[i]) {
                fulfilledRequests++;
            }
        }
        
        uint256 pendingRequests = totalRequests - fulfilledRequests;
        
        return (totalRequests, fulfilledRequests, pendingRequests);
    }
    
    /**
     * @dev Check if address is authorized oracle
     * @param oracle The oracle address to check
     * @return Whether the address is authorized
     */
    function isAuthorizedOracle(address oracle) external view returns (bool) {
        return authorizedOracles[oracle];
    }
}
