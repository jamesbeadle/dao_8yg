import T "./types";
import NFTWallet "./NFTWallet";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor {

  let admins : [Principal] = [
    Principal.fromText("xfi2l-oos4c-7irsb-4qiuu-jmbrg-7qfqj-z4qaf-budpw-rgghp-gihf2-vae")
    //Principal.fromText("ld6pc-7sgvt-fs7gg-fvsih-gspgy-34ikk-wrwl6-ixrkc-k54er-7ivom-wae")
  ];

  
  let CANISTER_IDS: [Text] = [
    "tskpj-aiaaa-aaaag-qaxsq-cai",
    "buja2-4iaaa-aaaam-qa4ca-cai"
  ];

  let nftWalletInstance = NFTWallet.NFTWallet();
  
  public func getNFTWallet() : async [T.NFT] {
    return await nftWalletInstance.getWalletNFTs(CANISTER_IDS);
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
};
