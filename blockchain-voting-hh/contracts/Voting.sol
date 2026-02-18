// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        string manifesto;
        address candidateAddress;
    }

    mapping(uint => Candidate) public candidates;
    mapping(uint => mapping(address => bool)) public roundVoters; // round => voter => hasVoted
    mapping(uint => uint) public roundVotes; // round => total votes
    
    address public admin;
    bool public votingActive = false;
    uint public candidatesCount;
    uint public currentRound = 1;
    uint public totalVotes = 0;

    // Events
    event Voted(uint indexed round, uint indexed candidateId, address indexed voter);
    event CandidateAdded(uint indexed candidateId, string name);
    event CandidateRemoved(uint indexed candidateId);
    event VotingEnded();
    event VotingStarted();
    event VotingReset(uint newRound);
    event ManifestoUpdated(uint indexed candidateId, string manifesto);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier votingIsActive() {
        require(votingActive, "Voting not active");
        _;
    }

    modifier validCandidate(uint _candidateId) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        _;
    }

    constructor() {
        admin = msg.sender;
        votingActive = false;
        
        // Add initial candidates
        addCandidate("Akhil Krantikari", admin);
        addCandidate("ANNFSU", admin);
        addCandidate("NSU", admin);
        addCandidate("Independent", admin);
    }

    function addCandidate(string memory _name, address _addr) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, "", _addr);
        emit CandidateAdded(candidatesCount, _name);
    }

    function removeCandidate(uint _candidateId) public onlyAdmin validCandidate(_candidateId) {
        for (uint i = _candidateId; i < candidatesCount; i++) {
            candidates[i] = candidates[i + 1];
            candidates[i].id = i;
        }
        delete candidates[candidatesCount];
        candidatesCount--;
        emit CandidateRemoved(_candidateId);
    }

    function startVoting() public onlyAdmin {
        require(!votingActive, "Already active");
        votingActive = true;
        emit VotingStarted();
    }

    function endVoting() public onlyAdmin {
        require(votingActive, "Not active");
        votingActive = false;
        emit VotingEnded();
    }

    // 🔥 FIXED: Now increments round so everyone can vote again!
    function resetVoting() public onlyAdmin {
        require(!votingActive, "Must end voting before resetting");
        
        // Store round results
        roundVotes[currentRound] = totalVotes;
        
        // Reset candidate vote counts for new round
        for (uint i = 1; i <= candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
        
        // Move to next round
        currentRound++;
        totalVotes = 0;
        votingActive = true;
        
        emit VotingReset(currentRound);
    }

    function vote(uint _candidateId) public votingIsActive validCandidate(_candidateId) {
        require(!roundVoters[currentRound][msg.sender], "Already voted this round");
        
        roundVoters[currentRound][msg.sender] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        emit Voted(currentRound, _candidateId, msg.sender);
    }

    function updateManifesto(uint _candidateId, string memory _manifesto)
        public validCandidate(_candidateId)
    {
        require(msg.sender == candidates[_candidateId].candidateAddress, "Not authorized");
        candidates[_candidateId].manifesto = _manifesto;
        emit ManifestoUpdated(_candidateId, _manifesto);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory all = new Candidate[](candidatesCount);
        for (uint i = 0; i < candidatesCount; i++) {
            all[i] = candidates[i + 1];
        }
        return all;
    }

    function hasVotedInRound(uint _round, address _voter) public view returns (bool) {
        return roundVoters[_round][_voter];
    }
}