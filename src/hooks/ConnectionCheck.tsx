import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

let currentNetwork: boolean | null;

NetInfo.fetch().then((state) => {
  currentNetwork = state.isConnected;
});

const CheckConnection = () => {
  // const [netInfo, setNetInfo] = useState(currentNetwork);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setNetInfo(state.isConnected);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const netInfo = NetInfo.useNetInfo();
  useEffect(() => {
    setIsConnected(netInfo.isConnected);
  }, [netInfo]);
  return netInfo;
};

export default CheckConnection;
