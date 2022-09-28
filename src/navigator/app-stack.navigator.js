import React, { useContext } from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { APP_TYPE } from '../constants/navigate.constants';
import { UserContext } from '../context/user.context';
import { Button } from 'react-native';

// import ThankYouScreen from '../screens/thankyou.screen';
// import GratificationScreen from '../screens/gratification.screens';
import QuizScreen from '../screens/quiz.screen';


export const Stack = createNativeStackNavigator();
const AppStackNavigator = () =>{
  const {logout} = useContext(UserContext);
  return (
      <Stack.Navigator
        screenOptions={{
            headerRight:() => <Button title="sign out" onPress={() => logout()}/>,
            headerLeft:() => null,
        }}
        initialRouteName= {APP_TYPE.quizScreen}
      >
        <Stack.Screen name={ APP_TYPE.quizScreen } component={QuizScreen} options={{
          headerTitle:"Quiz",
          headerBackVisible:false
        }}
        />
        {/* <Stack.Screen name={ APP_TYPE.gratificationScreen } component={GratificationScreen} options={{
          headerTitle:"Gratification",
          gestureEnabled:false,
          headerBackVisible:false
        }}/>
        <Stack.Screen name={ APP_TYPE.thankYouScreen } component={ThankYouScreen} options={{
          headerTitle:"Thank You",
          headerBackVisible:false
        }}/> */}
      </Stack.Navigator>
  );
}

export default AppStackNavigator;