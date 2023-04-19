import { setTimer; recurringTimer } = "mo:base/Timer";
import { print } = "mo:base/Debug";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import T "types";
import { now } = "mo:base/Time";

actor DAO {
    let votingPeriod = 1_000_000_000 * 86_400 * 8;

    private stable var open_proposals : [T.Proposal] = [];
    private stable var accepted_proposals : [T.Proposal] = [];
    private stable var rejected_proposals : [T.Proposal] = [];
    private stable var executed_proposals : [T.Proposal] = [];
    private stable var successful_proposals : [T.Proposal] = [];
    private stable var failed_proposals : [T.Proposal] = [];

    public func beginVotingPeriod(proposalId: Nat64) : async () {
        ignore setTimer(#nanoseconds votingPeriod, votingPeriodComplete);
    };

    private func votingPeriodComplete() : async () {
        switch (Array.find<T.Proposal>(open_proposals, func (proposal) { proposal.timestamp + votingPeriod >= now() })) {
            case null {  };
            case _ { 
                print("Voting complete"); 
            };
        };
    };


}

//all dao functions

//verify user NFTs

//deposit user funds

//call dao buy nft

//call dao sell nft

//call dao transfer nft

//call dao distribute 8yg

//vote

//raise proposal

//verify proposed purchase not belonging to voter

//price check proposed purchase not lower than floor price

//price check propsed purchase not greater than floor price + over_floor_price limit %

//check proposal voting period ended

//check that voter has nft at time of raising proposal, voting and when rewards are distributed
 