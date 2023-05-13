import T "./types";
import List "mo:base/List";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import SHA224 "./SHA224";
import Text "mo:base/Text";
import CRC32 "./CRC32";

module {
    
  public type Subaccount = Blob;
  public type AccountIdentifier = Blob;

  public class NFTWallet(){
    
    private let daoNFTCanisterId = "tskpj-aiaaa-aaaag-qaxsq-cai";
    private let daoWallet: Text = "0fa2901a7d5b36b1412ae14fc8c71ae424a7977930f59d230a0eb494f5e1b3c6";
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];

    
    private var collections = List.nil<T.Collection>();
    private var nextCollectionId : Nat16 = 1;

    public func getNextCollectionId() : Nat16 {
        return nextCollectionId;
    };
    
    public func setData(stable_collections: [T.Collection], stable_collectionId : Nat16){
        collections := List.fromArray(stable_collections);
        nextCollectionId := stable_collectionId;
    };

    public func getCollections() : [T.Collection] {
        return List.toArray(List.map<T.Collection, T.Collection>(collections, func (collection: T.Collection): T.Collection {
            return {
                id = collection.id;
                name = collection.name;
                canisterId = collection.canisterId;
            };
        }));
    };

    public func getCollection(collectionId: Nat16) : ?T.Collection {
        let foundCollection = List.find<T.Collection>(collections, func (collection: T.Collection): Bool {
            return collection.id == collectionId;
        });

        switch (foundCollection) {
            case (null) { return null; };
            case (?collection) {
                let collectionInfo = {
                    id = collection.id;
                    name = collection.name;
                    canisterId = collection.canisterId;
                };
                return ?collectionInfo;
            };
        };
    };

    
    public func addCollection(name : Text, canisterId : Text) : Result.Result<(), T.Error> {
        
        let id = nextCollectionId;
        let newCollection : T.Collection = {
          id = id;
          name = name;
          canisterId = canisterId;
        };

        var newCollectionList = List.nil<T.Collection>();
        newCollectionList := List.push(newCollection, newCollectionList);

        collections := List.append(collections, newCollectionList);
        
        nextCollectionId := nextCollectionId + 1;
        return #ok(());
    };

    public func updateCollection(id : Nat16, newName : Text, newCanisterId : Text) : Result.Result<(), T.Error> {
    
        collections := List.map<T.Collection, T.Collection>(collections,
            func (collection: T.Collection): T.Collection {
                if (collection.id == id) {
                { id = collection.id; name = newName; canisterId = newCanisterId }
                } 
                else { collection }
        });

        return #ok(());
    };

    public func deleteCollection(id : Nat16) : Result.Result<(), T.Error> {
        
        collections := List.filter(collections, func(collection: T.Collection): Bool { collection.id != id });
        return #ok(());
    };
    
    public func getCyclesBalance(canisterId: Text) : async Nat {

      let nft_canister = actor (canisterId): actor { 
        availableCycles: () -> async Nat
      };

      return await nft_canister.availableCycles();
    };

    public func getCollectionNFTs(canisterId: Text, page: Int, pageSize: Int) : async T.DAOWalletDTO {

      let nft_canister = actor (canisterId): actor { 
        getRegistry: () -> async [(Nat32, Text)];
      };

      let registryRecords = await nft_canister.getRegistry();

      let registry = Array.map<(Nat32, Text), T.NFT>(registryRecords, updateFn);

      let filteredRegistry = Array.filter<T.NFT>(registry, func (nft: T.NFT) : Bool {
          return nft.accountIdentifier == daoWallet;
      });

      let buffer = Buffer.fromArray<T.NFT>([]);
      var index = 0;
      let startIndex = (page - 1) * pageSize;
      let endIndex = page * pageSize;
      for (nft in Iter.fromArray<T.NFT>(filteredRegistry)) {
        if (index >= startIndex and index < endIndex) {
              buffer.add({
                  tokenIndex = nft.tokenIndex;
                  accountIdentifier = nft.accountIdentifier;
                  canisterId = canisterId;
                  tokenId = await computeExtTokenIdentifier(Principal.fromText(canisterId), nft.tokenIndex);
              });
          };
          index := index + 1;
      };

      let dto: T.DAOWalletDTO = {
        nfts = Buffer.toArray(buffer);
        totalEntries = Nat64.fromNat(Array.size(filteredRegistry));
      };

      return dto;
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
      var principalBlob : [Nat8] = Blob.toArray(Principal.toBlob(principal));

      let buffer = Buffer.fromArray<Nat8>(identifier);
      buffer.append(Buffer.fromArray(principalBlob));

      var rest : Nat32 = index;
      for (i in Iter.revRange(3, 0)) {
        let power2 = Nat32.fromNat(Int.abs(Int.pow(2, (i * 8))));
        let val : Nat32 = rest / power2;
        buffer.append(Buffer.fromArray([Nat8.fromNat(Nat32.toNat(val))]));
        rest := rest - (val * power2);
      };
      return Principal.toText(Principal.fromBlob(Blob.fromArray(Buffer.toArray(buffer))));
    };

    public func hasValidNFT(principal: Principal) : async Bool {
      let principalAccountId = getAccountId(principal);
      let nft_canister = actor (daoNFTCanisterId): actor { 
        getRegistry: () -> async [(Nat32, Text)];
      };

      let registryRecords = await nft_canister.getRegistry();

      let registry = Array.map<(Nat32, Text), T.NFT>(registryRecords, updateFn);

      let filteredRegistry = Array.filter<T.NFT>(registry, func (nft: T.NFT) : Bool {
          return nft.accountIdentifier == principalAccountId;
      });
      
      return Array.size(filteredRegistry) > 0;
    };

    
    public func getAccountId(principal: Principal) : Text {
      
      let accountIdentifierBlob = accountIdentifier(principal, Blob.fromArrayMut(Array.init(32, 0 : Nat8)));
      return blobToHexString(accountIdentifierBlob);
    };

    func blobToHexString(blob: Blob) : Text {
      return Text.join("", Iter.map<Nat8, Text>(Iter.fromArray(Blob.toArray(blob)), func (x: Nat8) : Text {
        let a = Nat8.toNat(x / 16);
        let b = Nat8.toNat(x % 16);
        hexChars[a] # hexChars[b]
      }));
    };
    
    
    func accountIdentifier(principal: Principal, subaccount: Subaccount) : AccountIdentifier {
      let hash = SHA224.Digest();
      hash.write([0x0A]);
      hash.write(Blob.toArray(Text.encodeUtf8("account-id")));
      hash.write(Blob.toArray(Principal.toBlob(principal)));
      hash.write(Blob.toArray(subaccount));
      let hashSum = hash.sum();
      let crc32Bytes = beBytes(CRC32.ofArray(hashSum));

      let buffer = Buffer.fromArray<Nat8>(crc32Bytes);
      for (x in hashSum.vals()) {
        buffer.add(x);
      };
      
      Blob.fromArray(Buffer.toArray(buffer));
    };

    func beBytes(n: Nat32) : [Nat8] {
      func byte(n: Nat32) : Nat8 {
        Nat8.fromNat(Nat32.toNat(n & 0xff))
      };
      [byte(n >> 24), byte(n >> 16), byte(n >> 8), byte(n)]
    };


  };
}
