import React from 'react';
import { LoadingContext } from '../interfaces/loading.interface';

export const AuthContext = React.createContext(null);
export const AppContext = React.createContext<LoadingContext>({
  loading: false,
  setLoading: (value) => {},
});

export const TabBarVisibilityContext = React.createContext({
  visible: false,
  setVisible: (value: boolean) => {},
  setShowOpacity: (value: boolean) => {},
  showOpacity: false,
});
