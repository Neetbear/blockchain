// SPDX-License-Identifier: MIT
pragma solidity >=0.4.19;

contract VoteContract {
    event Voting(address indexed _voter, address indexed _candidate); // 투표 이벤트 발생
    
    mapping(address => address) Vote; // 투표자 => 후보 내가 뽑은 후보가 있나
    mapping(address => address[]) VoteCounts; // 후보 => 투표자 배열 (몇표받았나 length로 확인)

    address[] public Candidates; // 후보자 배열
    uint[] public CandidatesVoteCount; // 각 후보자 득표수

    bool VoteStatus = true; // 투표상태 

    uint256 VoterCounts = 0; // 총 투표수
    uint16 NumberOfCandidates; // 후보수
    address public owner; // contract 관리자

    address ElectedCandidate; // 당선자 

    // 관리자 세팅
    constructor() public {
        owner = msg.sender; 
    }

    // 관리자 확인
    modifier electionOfficer () { 
        require(owner == msg.sender, "You are not Owner of Contract");
        _;
    }

    // 이미 투표했는지 확인
    modifier alreadyVote (address _voter) { 
        require(Vote[_voter] == 0x0000000000000000000000000000000000000000, "You already vote");
        _;
    }

    // 이미 출마했는가
    function whileArrayCheck(address _candidate) public view returns(bool) {
        for (uint i = 0; i < Candidates.length; i++) {
            if (Candidates[i] == _candidate) {
                return false;
            }
        }
        return true;
    }
    modifier alreadyRunningFor (address _candidate) { 
        require(whileArrayCheck(_candidate), "Nonvalid Candidate");
        _;
    }

    // 투표 끝났는지 확인
    modifier checkVoteStatus {
        require(VoteStatus, "Vote already end");
        _;
    }

    // 출마 함수
    function runningForCandidates (address _candidate) public payable alreadyRunningFor(_candidate) checkVoteStatus() { 
        require(msg.value == 0.01 ether);
        NumberOfCandidates++;
        Candidates.push(_candidate);
    }

    // 투표 함수
    function userVote(address _voter, address _candidate) public payable alreadyVote(_voter) checkVoteStatus() returns (uint256) {
        require(msg.value == 0.1 ether);
        Vote[_voter] = _candidate;
        VoteCounts[_candidate].push(_voter);
        VoterCounts++;
        emit Voting(_voter, _candidate);
        if(checkElectedCandidate()) {
            VoteEnd();
        } 
        return VoterCounts;
    }

    // 모든 출마자 확인
    function checkCandidiates() public view returns(address[] memory) {
        return Candidates;
    }

    // 각 출마자 득표수 확인
    function numberOfVotes(address _candidate) public view returns(uint256) {
        return VoteCounts[_candidate].length;
    }

    // 돈 돌려주기 당선자 투표한 모두에게 균등하게 n빵
    function getReward() public payable {
        require(VoteStatus == false, "Voting not finished");
        address[] memory Voters = VoteCounts[ElectedCandidate];
        for(uint i = 0; i < Voters.length; i++) {
            payable(Voters[i]).transfer(address(this).balance / Voters.length);
        }
    }

    // 당선자 확인
    function checkElectedCandidate() public returns(bool) {
        uint Votes = 0;
        for(uint i = 0; i < Candidates.length; i++) {
            CandidatesVoteCount[i] = VoteCounts[Candidates[i]].length;
            if(Votes < VoteCounts[Candidates[i]].length) {
                Votes = VoteCounts[Candidates[i]].length;
                ElectedCandidate = Candidates[i];
            }
        }
        if(Votes == 5) {
            return true;
        }
        return false;
    }
    
    // 투표 끝 모든 정보 읽어주기 (당선자, 총 투표자수, 모든 후보 배열, 각 후보 투표수 배열)
    function VoteEnd() public payable electionOfficer() returns(address, uint256, address[] memory, uint[] memory) {
        VoteStatus = false; // 투표 끝
        getReward(); // 이더 배분
        // 투표 결과 return
        return (ElectedCandidate, VoterCounts, Candidates, CandidatesVoteCount);
    }

    // 투표 다시 -> status 고쳐주고 싹다 초기화 나중에 생각하기 
}