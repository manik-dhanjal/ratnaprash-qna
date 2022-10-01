import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { APP_TYPE } from '../constants/navigate.constants';
import { UserContext } from '../context/user.context';
import { Button } from 'react-native';
import LogoHeader from '../components/logo_header.components';

import QuizScreen from '../screens/quiz.screen';
import ArtWorkScreen from '../screens/artwork.screen';
import FeedbackScreen from '../screens/feedback.screen';
import ThankyouScreen from '../screens/thankyou.screen';

export const Stack = createNativeStackNavigator();
const AppStackNavigator = () =>{
  const {logout} = useContext(UserContext);
  return (
      <Stack.Navigator
        screenOptions={{
            headerRight:() => <Button title="sign out" onPress={() => logout()}/>,
            headerLeft:() => null,
        }}
        initialRouteName= {APP_TYPE.artworkScreen}
      >
        <Stack.Screen name={ APP_TYPE.quizScreen } component={QuizScreen} options={{
          headerBackVisible:false,
          headerTransparent:true,
          header:() => <LogoHeader/>
        }}
        />
        <Stack.Screen name={APP_TYPE.artworkScreen } component={ArtWorkScreen} options={{
          header:() => null
        }}/>
        <Stack.Screen name={ APP_TYPE.feedbackScreen } component={FeedbackScreen} options={{
          headerBackVisible:false,
          headerTransparent:true,
          header:() => <LogoHeader/>
        }}
        />
        <Stack.Screen name={APP_TYPE.thankYouScreen } component={ThankyouScreen} options={{
          header:() => null
        }}/>
      </Stack.Navigator>
  );
}

export default AppStackNavigator;