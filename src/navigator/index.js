import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserContext } from '../context/user.context';
import { PENDING } from '../constants/request.constants';
import AppStackNavigator from './app-stack.navigator';
import AuthStackNavigator from './auth-stack.navigator';
import SpinnerWrapper from '../components/spinner.component';

const Navigator = () => {
  const {currentUser} = useContext(UserContext)
  console.log(currentUser);
  return (
    <NavigationContainer>
      <SpinnerWrapper isActive={currentUser.status === PENDING}>
        {currentUser.data ? <AppStackNavigator/>:<AuthStackNavigator/>}
      </SpinnerWrapper>
    </NavigationContainer>
  );
}

export default Navigator;