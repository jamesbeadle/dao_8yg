import Nat64 "mo:base/Nat64";


module {

    public class Token(){

        let token_canister = "5mtid-sqaaa-aaaag-abn5q-cai";
        let token_canister_actor = actor (token_canister): actor { icrc1_name: () -> async Text; icrc1_total_supply: () -> async Nat; };
        
        public func getTotalSupply() : async Nat64 {
            return Nat64.fromNat(await token_canister_actor.icrc1_total_supply());
        };

        public func getTokenPriceUSD() : Nat64 {
            return 0;
        };

        
        public func getMarketCap() : Nat64 {
            return 0;
        };
        
        public func getVolume() : Nat64 {
            return 0;
        };
    }
}
