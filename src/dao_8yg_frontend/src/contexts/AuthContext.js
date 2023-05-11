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
 
  useEffect(() => {
    StoicIdentity.load().then(async identity => {
      if (identity !== false) {
        //ID is a already connected wallet!
        setIsAuthenticated(true);
        Actor.agentOf(dao_8yg_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await dao_8yg_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
      } else {
        //No existing connection, lets make one!
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setIdentity(identity);
      setLoading(false);
      
    });

  }, []);

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
      setIdentity(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ identity, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
