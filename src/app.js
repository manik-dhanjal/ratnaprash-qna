import React from 'react';
import { UserProvider } from './context/user.context';
import Navigator from "./navigator";

const App = () => {
  return (
    <UserProvider>
      <Navigator/>
    </UserProvider>
  );
}

export default App;