import T "./types";
import NFTWallet "./NFTWallet";
import Token "./Token";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";
import List "mo:base/List";
import Debug "mo:base/Debug";

actor {

  let admins : [Principal] = [
    Principal.fromText("xfi2l-oos4c-7irsb-4qiuu-jmbrg-7qfqj-z4qaf-budpw-rgghp-gihf2-vae"),
    Principal.fromText("zz7dg-r5e4f-evseb-vlqfl-sa66v-v5lng-lqhpy-f24dk-jdnes-bdrhy-yae")
  ];
  
  let CANISTER_IDS: [Text] = [
    "tskpj-aiaaa-aaaag-qaxsq-cai",
    "buja2-4iaaa-aaaam-qa4ca-cai"
  ];

  let nftWalletInstance = NFTWallet.NFTWallet();
  let tokenInstance = Token.Token();

  private stable var stable_collections: [T.Collection] = [];
  private stable var stable_nextCollectionId : Nat16 = 0;
  private stable var stable_localNFTCopies: [(Text, List.List<T.NFT>)] = [];
  private stable var stable_profit_icp : Nat64 = 0;
  private stable var stable_profit_usd : Nat64 = 0;

  public shared query func getHomeDTO() : async T.HomeDTO {
    
    let homeDTO: T.HomeDTO = {
      profit_icp = nftWalletInstance.getProfitICP();
      profit_usd = nftWalletInstance.getProfitUSD();
      purchased_nfts = nftWalletInstance.getPurchasedNFTs();
      sold_nfts = nftWalletInstance.getSoldNFTs();
      owned_NFTs = nftWalletInstance.getOwnedNFTs();
      floor_price = nftWalletInstance.getFloorPrice();
      price_8yg = tokenInstance.getTokenPriceUSD();
      market_cap = tokenInstance.getMarketCap();
      volume = tokenInstance.getVolume();
    };

    return homeDTO;
  };

  public shared func getTotalSupply() : async Nat64 {
    return await tokenInstance.getTotalSupply();
  };

  public shared ({caller}) func getNFTWallet() : async [T.NFT] {
    assert not Principal.isAnonymous(caller);
    return await nftWalletInstance.getWalletNFTs(CANISTER_IDS);
  };

  public shared query ({caller}) func getCollectionNFTs(collectionId: Nat16, page: Int, pageSize: Int) : async T.DAOWalletDTO {
    assert not Principal.isAnonymous(caller);

    let collection = nftWalletInstance.getCollection(collectionId);
    switch(collection){
      case (null) {return {nfts = []; totalEntries = 0 }};
      case (?c) { return nftWalletInstance.getCollectionNFTs(c.canisterId, page, pageSize); }
    };
  };

  private func isAdminForCaller(caller: Principal): Bool {
    switch (Array.find<Principal>(admins, func (admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };
  
  public shared query (msg) func isAdmin(): async Bool {
    Debug.print(debug_show msg.caller);
    return isAdminForCaller(msg.caller);
  };
  
  public shared query ({caller}) func getAccountId(): async Text {
    return nftWalletInstance.getAccountId(caller);
  };

  public shared ({caller}) func hasValidNFT(): async Bool {
    return await nftWalletInstance.hasValidNFT(caller);
  };


  public query func getCollections() : async [T.Collection] {
    return nftWalletInstance.getCollections();
  };

  public query func getCollection(collectionId : Nat16) : async ?T.Collection {
    return nftWalletInstance.getCollection(collectionId);
  };
  
  public shared ({caller}) func createCollection(name : Text, canisterId: Text) : async Result.Result<(), T.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return nftWalletInstance.addCollection(name, canisterId);
  };

  public shared ({caller}) func updateCollection(id : Nat16, newName : Text, newCanisterId : Text) : async Result.Result<(), T.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return nftWalletInstance.updateCollection(id, newName, newCanisterId);
  };

  public shared ({caller}) func deleteCollection(id : Nat16) : async Result.Result<(), T.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };
    return nftWalletInstance.deleteCollection(id);
  };

  public shared ({caller}) func refreshLocalNFTs(canisterId : Text) : async Result.Result<(), T.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };
    return await nftWalletInstance.refreshLocalNFTs(canisterId);
  };


  system func preupgrade() {
    stable_nextCollectionId := nftWalletInstance.getNextCollectionId();
    stable_collections := nftWalletInstance.getCollections();
    stable_localNFTCopies := nftWalletInstance.getLocalNFTs();
    stable_profit_icp := nftWalletInstance.getProfitICP();
    stable_profit_usd := nftWalletInstance.getProfitUSD();
  };

  system func postupgrade() {
    nftWalletInstance.setData(stable_collections, stable_nextCollectionId, stable_localNFTCopies, stable_profit_icp, stable_profit_usd);
  };

};
