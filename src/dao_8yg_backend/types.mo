
module Types {

    public type AccountIdentifier = Blob;

    
    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #NotAllowed;
        #DecodeError;
    };

    public type Collection = {
        id: Nat16;
        name: Text;
        canisterId: Text; 
    };
    
    public type Tokens = {
        amount_e8s: Nat64;
    };

    public type Account = {
        owner: Text;
        nfts: [NFT];
    };

    public type NFT = {
        tokenIndex: Nat32;
        accountIdentifier: Text;
        canisterId: Text;
        tokenId: Text;
    };

    public type ListingDetails = {
        locked: ?Nat;
        price: Nat64;
        seller: Principal;
    };

    public type Listing = (Nat32, ListingDetails);

    public type HomeDTO = {
        profit_icp: Nat64;
        profit_usd: Nat64;
        purchased_nfts: Nat32;
        sold_nfts: Nat32;
        owned_NFTs: Nat32;
        floor_price: Nat64;
        price_8yg: Nat64;
        market_cap: Nat64;
        volume: Nat64;
    }; 

    public type DAOWalletDTO = {
        nfts: [NFT];
        totalEntries: Nat64;
    }; 

    public type Profile = {
        principal: Text;
        depositAddress: Blob;
        withdrawalAddress: Text;
        disclaimerAccepted: Bool;
    };

    public type VotingNFT = {
        id: Nat32;
        votingPower: Nat8;
        canisterId: Text;
        tokenId: Text;
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
