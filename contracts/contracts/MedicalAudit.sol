// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalAudit {
    
    struct BatchLog {
        bytes32 merkleRoot;
        string ipfsCid;
        string deviceDid;
        uint256 batchSize;
        uint256 timestamp;
        address submitter;
    }
    
    BatchLog[] public batchLogs;
    mapping(bytes32 => bool) public rootExists;
    mapping(bytes32 => uint256) public rootToIndex;
    
    address public owner;
    mapping(address => bool) public authorizedSubmitters;
    
    event BatchLogged(
        bytes32 indexed merkleRoot,
        string ipfsCid,
        string deviceDid,
        uint256 batchSize,
        uint256 timestamp,
        uint256 indexed logIndex
    );
    
    modifier onlyOwner() { require(msg.sender == owner); _; }
    modifier onlyAuthorized() { require(authorizedSubmitters[msg.sender] || msg.sender == owner); _; }
    
    constructor() {
        owner = msg.sender;
        authorizedSubmitters[msg.sender] = true;
    }
    
    function authorizeSubmitter(address submitter) external onlyOwner {
        authorizedSubmitters[submitter] = true;
    }
    
    function logBatch(
        bytes32 merkleRoot,
        string calldata ipfsCid,
        string calldata deviceDid,
        uint256 batchSize
    ) external onlyAuthorized returns (uint256 logIndex) {
        require(!rootExists[merkleRoot], "Root already logged");
        
        logIndex = batchLogs.length;
        batchLogs.push(BatchLog({
            merkleRoot: merkleRoot,
            ipfsCid: ipfsCid,
            deviceDid: deviceDid,
            batchSize: batchSize,
            timestamp: block.timestamp,
            submitter: msg.sender
        }));
        
        rootExists[merkleRoot] = true;
        rootToIndex[merkleRoot] = logIndex;
        
        emit BatchLogged(merkleRoot, ipfsCid, deviceDid, batchSize, block.timestamp, logIndex);
        return logIndex;
    }
    
    function verifyRoot(bytes32 merkleRoot) external view returns (bool exists, uint256 timestamp, uint256 logIndex) {
        exists = rootExists[merkleRoot];
        if (exists) {
            logIndex = rootToIndex[merkleRoot];
            timestamp = batchLogs[logIndex].timestamp;
        }
    }
    
    function getBatchLog(uint256 index) external view returns (BatchLog memory) {
        return batchLogs[index];
    }
    
    function getTotalLogs() external view returns (uint256) {
        return batchLogs.length;
    }
}
