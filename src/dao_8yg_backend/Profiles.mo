import Nat64 "mo:base/Nat64";
import T "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Account "./Account";
import Debug "mo:base/Debug";

module {

    public class Profiles(){

        private var userProfiles = List.nil<T.Profile>();

        public func setData(stable_profiles: [T.Profile]){
            userProfiles := List.fromArray(stable_profiles);
        };
    
        public func getProfiles() : [T.Profile] {
            return List.toArray(List.map<T.Profile, T.Profile>(userProfiles, func (profile: T.Profile): T.Profile {
                return {
                    principal = profile.principal;
                    depositAddress = profile.depositAddress;
                    withdrawalAddress = profile.withdrawalAddress; 
                    disclaimerAccepted = profile.disclaimerAccepted;
                };
            }));
        };

        public func getProfile(principalName: Text) : ?T.Profile {
            Debug.print(debug_show "getting profile");
            Debug.print(debug_show principalName);
            Debug.print(debug_show userProfiles);
            let foundProfile = List.find<T.Profile>(userProfiles, func (profile: T.Profile): Bool {
                return profile.principal == principalName;
            });

            switch (foundProfile) {
                case (null) { return null; };
                case (?profile) { return ?profile; };
            };
        };

        public func createProfile(principalName: Text, withdrawalAddress: Text, depositAddress: Account.AccountIdentifier, disclaimerAccepted: Bool) : () {
            
            let updatedProfile: T.Profile = {
                principal = principalName;
                withdrawalAddress = withdrawalAddress;
                depositAddress = depositAddress;
                disclaimerAccepted = disclaimerAccepted;
            };
            
            let existingProfile = List.find<T.Profile>(userProfiles, func (profile: T.Profile): Bool {
                return profile.principal == principalName;
            });

            switch (existingProfile) {
                case (null) { 
                    var newProfilesList = List.nil<T.Profile>();
                    newProfilesList := List.push(updatedProfile, newProfilesList);
                    userProfiles := List.append(userProfiles, newProfilesList);
                    };
                case (?existingProfile) { };
            };
        };

        public func updateWithdrawalAddress(principalName: Text, withdrawalAddress: Text) : Result.Result<(), T.Error> {
            
            let existingProfile = List.find<T.Profile>(userProfiles, func (profile: T.Profile): Bool {
                return profile.principal == principalName;
            });

            switch (existingProfile) {
                case (null) { 
                    return #err(#NotFound);
                };
                case (?existingProfile) {

                    if(existingProfile.withdrawalAddress == withdrawalAddress){
                        return #ok(());
                    };
            
                    let updatedProfile: T.Profile = {
                        principal = existingProfile.principal;
                        withdrawalAddress = withdrawalAddress;
                        depositAddress = existingProfile.depositAddress;
                        disclaimerAccepted = existingProfile.disclaimerAccepted;
                    };

                    userProfiles := List.map<T.Profile, T.Profile>(userProfiles, func (profile: T.Profile): T.Profile {
                        if (profile.principal == principalName) { updatedProfile } else { profile }
                    });

                    return #ok(());
                };
            };
        };

        public func acceptDisclaimer(principalName: Text) : Result.Result<(), T.Error> {
            
            let existingProfile = List.find<T.Profile>(userProfiles, func (profile: T.Profile): Bool {
                return profile.principal == principalName;
            });
            switch (existingProfile) {
                case (null) { 
                    return #err(#NotFound);
                };
                case (?existingProfile) {

                    let updatedProfile: T.Profile = {
                        principal = existingProfile.principal;
                        withdrawalAddress = existingProfile.withdrawalAddress;
                        depositAddress = existingProfile.depositAddress;
                        disclaimerAccepted = true;
                    };

                    userProfiles := List.map<T.Profile, T.Profile>(userProfiles, func (profile: T.Profile): T.Profile {
                        if (profile.principal == principalName) { updatedProfile } else { profile }
                    });

                    return #ok(());
                };
            };
        };

        public func hasAcceptedDisclaimer(principal: Principal) : Bool {
            let principalName = Principal.toText(principal);
            let profile = getProfile(principalName);
            switch(profile){
                case (null){
                    return false;
                };
                case (?p){
                    return p.disclaimerAccepted;
                };
            }
            
        };
    }
}
