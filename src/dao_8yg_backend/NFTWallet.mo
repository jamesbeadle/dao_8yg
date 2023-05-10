import T "./types";
import List "mo:base/List";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Principal "mo:base/Principal";

module {
    
  public class NFTWallet(){
    
    private let daoWallet: Text = "0fa2901a7d5b36b1412ae14fc8c71ae424a7977930f59d230a0eb494f5e1b3c6";
    
    public func getCyclesBalance(canisterId: Text) : async Nat {

      let nft_canister = actor (canisterId): actor { 
        availableCycles: () -> async Nat
      };

      return await nft_canister.availableCycles();
    };

    public func get8YGNFTs(canisterId: Text) : async [T.NFT] {

      let nft_canister = actor (canisterId): actor { 
        getRegistry: () -> async [(Nat32, Text)];
      };

      let registryRecords = await nft_canister.getRegistry();

      let registry = Array.map<(Nat32, Text), T.NFT>(registryRecords, updateFn);

      return registry;

    };

    public func getWalletNFTs(canisterIds: [Text]) : async [T.NFT] {

      var combinedNFTs: [T.NFT] = [];

      for (canisterId in Iter.fromArray<Text>(canisterIds)) {
            
        let nft_canister = actor (canisterId): actor { 
          getRegistry: () -> async [(Nat32, Text)];
        };

        let registryRecords = await nft_canister.getRegistry();

        let registry = Array.map<(Nat32, Text), T.NFT>(registryRecords, updateFn);

        let filteredRegistry = Array.filter<T.NFT>(registry, func (nft: T.NFT) : Bool {
            return nft.accountIdentifier == daoWallet;
        });

        var registryWithCanister: [T.NFT] = [];
        let nftBuffer = Buffer.fromArray<T.NFT>(registryWithCanister);
        

        for (nft in Iter.fromArray<T.NFT>(filteredRegistry)) {

          let newNFT: T.NFT = {
            tokenIndex = nft.tokenIndex;
            accountIdentifier = nft.accountIdentifier;
            canisterId = canisterId;
            tokenId = await computeExtTokenIdentifier(Principal.fromText(canisterId), nft.tokenIndex);
          };
          nftBuffer.add(newNFT);
        };

        let buffer = Buffer.fromArray<T.NFT>(combinedNFTs);
        buffer.append(nftBuffer);
        combinedNFTs := Buffer.toArray(buffer);

      };


      return combinedNFTs;

    };

    let updateFn = func(nft: (Nat32, Text)): T.NFT {
      return {
            tokenIndex = nft.0;
            accountIdentifier = nft.1;
            canisterId = "";
            tokenId = "";
          };
    };

    public func computeExtTokenIdentifier(principal: Principal, index: Nat32) : async Text {
      var identifier : [Nat8] = [10, 116, 105, 100]; //b"\x0Atid"
      identifier := Array.append(identifier, Blob.toArray(Principal.toBlob(principal)));
      var rest : Nat32 = index;
      for (i in Iter.revRange(3, 0)) {
        let power2 = Nat32.fromNat(Int.abs(Int.pow(2, (i * 8))));
        let val : Nat32 = rest / power2;
        identifier := Array.append(identifier, [Nat8.fromNat(Nat32.toNat(val))]);
        rest := rest - (val * power2);
      };
      return Principal.toText(Principal.fromBlob(Blob.fromArray(identifier)));
    };





  };
}
