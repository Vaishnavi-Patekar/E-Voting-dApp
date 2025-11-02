// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    enum Phase { Init, Registration, Voting, Ended }
    Phase public phase;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
    }
    mapping(address => Voter) public voters;

    event CandidateAdded(uint id, string name);
    event VoterRegistered(address voter);
    event VoteCast(address voter, uint candidateId);
    event PhaseChanged(Phase newPhase);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier inPhase(Phase _phase) {
        require(phase == _phase, "Function cannot be called in this phase");
        _;
    }

    constructor() {
        admin = msg.sender;
        phase = Phase.Init;
    }

    function startRegistration() external onlyAdmin inPhase(Phase.Init) {
        phase = Phase.Registration;
        emit PhaseChanged(phase);
    }

    function addCandidate(string calldata _name)
        external
        onlyAdmin
        inPhase(Phase.Registration)
    {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function registerVoter(address _voter)
        external
        onlyAdmin
        inPhase(Phase.Registration)
    {
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter].isRegistered = true;
        emit VoterRegistered(_voter);
    }

    function startVoting() external onlyAdmin inPhase(Phase.Registration) {
        require(candidatesCount > 0, "No candidates registered");
        phase = Phase.Voting;
        emit PhaseChanged(phase);
    }

    function vote(uint _candidateId) external inPhase(Phase.Voting) {
        require(voters[msg.sender].isRegistered, "You are not registered");
        require(!voters[msg.sender].hasVoted, "You already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function endVoting() external onlyAdmin inPhase(Phase.Voting) {
        phase = Phase.Ended;
        emit PhaseChanged(phase);
    }

    function winningCandidate()
        external
        view
        inPhase(Phase.Ended)
        returns (uint id, string memory name, uint votes)
    {
        uint maxVotes = 0;
        uint winnerId = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        if (winnerId > 0) {
            return (winnerId, candidates[winnerId].name, maxVotes);
        } else {
            return (0, "", 0);
        }
    }
    function getAllCandidates() public view returns (Candidate[] memory) {
    Candidate[] memory allCandidates = new Candidate[](candidatesCount);
    for (uint i = 1; i <= candidatesCount; i++) {
        allCandidates[i - 1] = candidates[i];
    }
    return allCandidates;
}

}
