
module Types {
    
    public type Tokens = {
        amount_e8s: Nat64;
    };

    public type Account = {
        owner: Text;
        nfts: [NFT];
    };

    public type NFT = {
        nftid: Nat16;
        rarity: Nat8;
        voting_power: Nat8;
    };

    public type ProposalState = {
        #Open;
        #Accepted;
        #Rejected;
        #Executing;
        #Succeeded;
        #Failed;
    };

    public type Proposal = {
        id: Nat64;
        timestamp: Int;
        proposer: Principal;
        payload: ProposalPayload;
        state: ProposalState;
        votes_yes: Nat16;
        votes_no: Nat16;
        voters: [Principal];
    };
    
    public type ProposalPayload = {
        canister_id: Principal; //canister to call (bot canister initially)
        method: Text;  //Buy //Sell //transfer
        message: Blob; //varies depending on call type
    };

    public type Vote = {
        #Yes;
        #No;
    };

    public type VoteArgs = {
        proposal_id: Nat64;
        vote: Vote;
    };

    public type VoteResult = {
        Ok: ProposalState;
        Err: Text;
    };

    public type SystemParams = {
        proposal_vote_threshold: Nat16;
        proposal_submission_deposit: Tokens;
        over_floor_limit: Nat8;
    };

    public type UpdateSystemParamsPayload = {
        proposal_vote_threshold: Nat16;
        proposal_submission_deposit: Tokens;
    };



};