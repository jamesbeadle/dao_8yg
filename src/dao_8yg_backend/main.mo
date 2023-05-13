import T "./types";
import NFTWallet "./NFTWallet";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";

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

  private stable var stable_collections: [T.Collection] = [];
  private stable var stable_nextCollectionId : Nat16 = 0;
  
  public shared ({caller}) func getNFTWallet() : async [T.NFT] {
    assert not Principal.isAnonymous(caller);
    return await nftWalletInstance.getWalletNFTs(CANISTER_IDS);
  };

  public shared ({caller}) func getCollectionNFTs(collectionId: Nat16, page: Int, pageSize: Int) : async T.DAOWalletDTO {
    assert not Principal.isAnonymous(caller);

    let collection = await getCollection(collectionId);
    switch(collection){
      case (null) {return {nfts = []; totalEntries = 0 }};
      case (?c) { return await nftWalletInstance.getCollectionNFTs(c.canisterId, page, pageSize); }
    };
  };

  public func getCycles() : async Nat {
    return await nftWalletInstance.getCyclesBalance(CANISTER_IDS[0]);
  };

  private func isAdminForCaller(caller: Principal): Bool {
    switch (Array.find<Principal>(admins, func (admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };
  
  public shared query ({caller}) func isAdmin(): async Bool {
    return isAdminForCaller(caller);
  };
  
  public shared query ({caller}) func getAccountId(): async Text {
    return nftWalletInstance.getAccountId(caller);
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


  system func preupgrade() {
    stable_nextCollectionId := nftWalletInstance.getNextCollectionId();
    stable_collections := nftWalletInstance.getCollections();
  };

  system func postupgrade() {
    nftWalletInstance.setData(stable_collections, stable_nextCollectionId);
  };

};
