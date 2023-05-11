import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";

import { dao_8yg_backend as dao_8yg_backend_actor } from '../../../declarations/dao_8yg_backend';
import { StoicIdentity } from 'ic-stoic-identity';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [identity, setIdentity] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const deleteIndexedDB = (dbName) => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(dbName);
    
      request.onsuccess = () => {
        console.log('IndexedDB successfully deleted');
        window.location.reload();
        resolve();
      };
  
      request.onerror = (event) => {
        console.error('Error deleting IndexedDB:', event);
        reject(event);
      };
  
      request.onblocked = () => {
        console.warn('IndexedDB delete request blocked. Please close all other tabs using the database.');
      };
    });
  };
 
  useEffect(() => {
    StoicIdentity.load().then(async identity => {
      console.log(identity)
      if (identity !== false) {
        //ID is a already connected wallet!
        setIsAuthenticated(true);
        Actor.agentOf(dao_8yg_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await dao_8yg_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
      } else {
        //No existing connection, lets make one!
        setIsAdmin(false);
        identity = await StoicIdentity.connect();
      }
      setIdentity(identity);
      setLoading(false);
      
    });

  }, []);

  useEffect(() => {
    if (!identity) return;

    const interval = setInterval(() => {
      checkLoginStatus(identity);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [identity]);

  

  const login = async () => {
    await StoicIdentity.load().then(async identity => {

      if (identity !== false) {
        //ID is a already connected wallet!
      } else {
        //No existing connection, lets make one!
        identity = await StoicIdentity.connect();
      }
    
      setIdentity(identity);
      setIsAuthenticated(true);
      Actor.agentOf(dao_8yg_backend_actor).replaceIdentity(identity);
      const userIsAdmin = await dao_8yg_backend_actor.isAdmin();
      setIsAdmin(userIsAdmin);
      
    });
  };

  const logout = async () => {
    try {
      await StoicIdentity.disconnect();
    } catch (error) {
      console.error('Error during StoicIdentity disconnect:', error);
    } finally {
      localStorage.removeItem('identity');
      setIdentity(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const checkLoginStatus = async (client) => {
    if(client == null){
      return false;
    }
    const isLoggedIn = await client.isAuthenticated();
    if (isLoggedIn && isTokenValid(client)) {
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };
  

  const isTokenValid = (client) => {
    try {
      const identity = client.getIdentity();
      if (!identity || !identity._delegation || !identity._delegation.delegations) return false;

      const delegation = identity._delegation.delegations[0];
      if (!delegation) return false;

      const expiration = BigInt(delegation.delegation.expiration);
      const currentTime = BigInt(Date.now() * 1000000);
      return currentTime < expiration;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ identity, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
