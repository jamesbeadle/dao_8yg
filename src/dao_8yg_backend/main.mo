import T "./types";
import NFTWallet "./NFTWallet";

actor {
  
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
};
