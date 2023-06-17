import Nat64 "mo:base/Nat64";
import T "./types";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Account "./Account";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Text "mo:base/Text";

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
                    disclaimerAccepted = profile.disclaimerAccepted;
                    username = profile.username;
                    profilePicture = Blob.fromArray([]);
                    withdrawalAddress = "";
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

        public func createProfile(principalName: Text, depositAddress: Account.AccountIdentifier, disclaimerAccepted: Bool) : () {
            
            let updatedProfile: T.Profile = {
                principal = principalName;
                depositAddress = depositAddress;
                disclaimerAccepted = disclaimerAccepted;
                username = principalName;
                profilePicture = Blob.fromArray([]);
                withdrawalAddress = "";
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
                        depositAddress = existingProfile.depositAddress;
                        disclaimerAccepted = true;
                        username = existingProfile.username;
                        profilePicture = existingProfile.profilePicture;
                        withdrawalAddress = "";
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

        public func updateUsername(principalName: Text, username: Text) : Result.Result<(), T.Error> {
            
            let existingProfile = List.find<T.Profile>(userProfiles, func (profile: T.Profile): Bool {
                return profile.principal == principalName;
            });

            switch (existingProfile) {
                case (null) { 
                    return #err(#NotFound);
                };
                case (?existingProfile) {

                    if(existingProfile.username == username){
                        return #ok(());
                    };
            
                    let updatedProfile: T.Profile = {
                        principal = existingProfile.principal;
                        username = username;
                        depositAddress = existingProfile.depositAddress;
                        disclaimerAccepted = existingProfile.disclaimerAccepted;
                        profilePicture = existingProfile.profilePicture;
                        withdrawalAddress = "";
                    };

                    let nameValid = isUsernameValid(updatedProfile.username);
                    if(not nameValid){
                        return #err(#NotAllowed);
                    };

                    userProfiles := List.map<T.Profile, T.Profile>(userProfiles, func (profile: T.Profile): T.Profile {
                        if (profile.principal == principalName) { updatedProfile } else { profile }
                    });

                    return #ok(());
                };
            };
        };
    
        public func isUsernameValid(username: Text) : Bool {
            
            if (Text.size(username) < 3 or Text.size(username) > 20) {
                return false;
            };

            let isAlphanumeric = func (s: Text): Bool {
                let chars = Text.toIter(s);
                for (c in chars) {
                    if (not((c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9'))) {
                        return false;
                    };
                };
                return true;
            };

            if (not isAlphanumeric(username)) {
                return false;
            };

            let foundProfile = List.find<T.Profile>(userProfiles, func (profile: T.Profile): Bool {
                return profile.username == username;
            });

            if(foundProfile != null){
                return false;
            };

            return true;
        };

        public func updateProfilePicture(principalName: Text, profilePicture: Blob) : Result.Result<(), T.Error> {
            
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
                        username = existingProfile.username;
                        depositAddress = existingProfile.depositAddress;
                        disclaimerAccepted = existingProfile.disclaimerAccepted;
                        profilePicture = profilePicture;
                        withdrawalAddress = "";
                    };

                    userProfiles := List.map<T.Profile, T.Profile>(userProfiles, func (profile: T.Profile): T.Profile {
                        if (profile.principal == principalName) { updatedProfile } else { profile }
                    });

                    return #ok(());
                };
            };
        };
    }
}
