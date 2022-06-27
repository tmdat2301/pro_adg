/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import MainApp from './src';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';
enableScreens();

const App = () => {
  return <MainApp />;
};
export default App;
