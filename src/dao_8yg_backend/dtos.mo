module DTOs {

    public type ProfileDTO = {
        username: Text;
        highestNFTRarity: Nat8;
        totalVotingPower: Nat16;
        airdropShare: Float;
        earnings: Nat64;
        balance: Nat64;
        depositAddress: Blob;
        principal: Text;
        profilePicture: Blob;
    };

};
