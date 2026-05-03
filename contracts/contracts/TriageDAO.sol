// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simplified DAO for emergency resource allocation
// Full production would use ZKP-based priority scores
contract TriageDAO {
    
    enum ResourceType { ICU_BED, AMBULANCE, VENTILATOR }
    enum RequestStatus { PENDING, APPROVED, REJECTED, FULFILLED }
    
    struct ResourceRequest {
        uint256 requestId;
        string deviceDid;
        string patientAlias;
        uint8 priorityScore;      // 1-100, higher = more urgent
        ResourceType resourceType;
        RequestStatus status;
        uint256 timestamp;
        uint256 votes;
    }
    
    struct Resource {
        ResourceType resourceType;
        string hospitalId;
        bool available;
    }
    
    ResourceRequest[] public requests;
    Resource[] public resources;
    mapping(address => bool) public daoMembers;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    address public owner;
    uint256 public votingThreshold = 2;  // Min votes to approve (demo: 2)
    
    event ResourceRequested(uint256 indexed requestId, string deviceDid, uint8 priorityScore);
    event RequestApproved(uint256 indexed requestId);
    event ResourceAllocated(uint256 indexed requestId, string hospitalId);
    
    constructor() {
        owner = msg.sender;
        daoMembers[msg.sender] = true;
    }
    
    function addDAOMember(address member) external {
        require(msg.sender == owner);
        daoMembers[member] = true;
    }
    
    function addResource(ResourceType rtype, string calldata hospitalId) external {
        resources.push(Resource({ resourceType: rtype, hospitalId: hospitalId, available: true }));
    }
    
    function requestResource(
        string calldata deviceDid,
        string calldata patientAlias,
        uint8 priorityScore,
        ResourceType resourceType
    ) external returns (uint256 requestId) {
        requestId = requests.length;
        requests.push(ResourceRequest({
            requestId: requestId,
            deviceDid: deviceDid,
            patientAlias: patientAlias,
            priorityScore: priorityScore,
            resourceType: resourceType,
            status: RequestStatus.PENDING,
            timestamp: block.timestamp,
            votes: 0
        }));
        emit ResourceRequested(requestId, deviceDid, priorityScore);
    }
    
    function voteApprove(uint256 requestId) external {
        require(daoMembers[msg.sender], "Not a DAO member");
        require(!hasVoted[requestId][msg.sender], "Already voted");
        hasVoted[requestId][msg.sender] = true;
        requests[requestId].votes++;
        if (requests[requestId].votes >= votingThreshold) {
            requests[requestId].status = RequestStatus.APPROVED;
            _allocateResource(requestId);
            emit RequestApproved(requestId);
        }
    }
    
    function _allocateResource(uint256 requestId) internal {
        ResourceType rtype = requests[requestId].resourceType;
        for (uint i = 0; i < resources.length; i++) {
            if (resources[i].resourceType == rtype && resources[i].available) {
                resources[i].available = false;
                requests[requestId].status = RequestStatus.FULFILLED;
                emit ResourceAllocated(requestId, resources[i].hospitalId);
                break;
            }
        }
    }
    
    function getRequest(uint256 requestId) external view returns (ResourceRequest memory) {
        return requests[requestId];
    }
    
    function getTotalRequests() external view returns (uint256) {
        return requests.length;
    }
}
