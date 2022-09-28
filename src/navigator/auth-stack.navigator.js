import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/welcome.screen';
import LoginScreen from '../screens/login.screen';
// import OTPVerifyScreen from '../screens/otp_verify.screen';
import {AUTH_TYPE} from "../constants/navigate.constants"
import LogoHeader from '../components/logo_header.components';

export const Stack = createNativeStackNavigator();
const AuthStackNavigator = () =>{
  return (
      <Stack.Navigator initialRouteName={AUTH_TYPE.welcomeScreen} >
        <Stack.Screen name={AUTH_TYPE.welcomeScreen} component={WelcomeScreen} />
        <Stack.Screen 
          name={AUTH_TYPE.loginScreen} 
          component={LoginScreen} 
          initialParams = {{
            message:null
          }}
          options={{
            header:() => <LogoHeader/>
          }}
        />
      </Stack.Navigator>
  );
}

export default AuthStackNavigator;