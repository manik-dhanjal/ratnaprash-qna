import React, { createContext, useState, useEffect } from 'react';
import { REQUEST_PENDING, REQUEST_SUCCESS, REQUEST_FAILED } from '../constants/request.constants';
import { signOut } from '../utils/auth.utils';
import auth from '@react-native-firebase/auth';
import { createUserDocument, getUserDocument } from '../utils/database.utils';
import { ToastAndroid } from 'react-native';

const initialState = REQUEST_SUCCESS(null);

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
   const [state, setState] = useState(initialState);
   const [tempUser, setTempUser] = useState(null);
   // Actions for changing state
    async function logout() {
     try{
        if(!state.data) throw new Error("No one is Signed In")
        setState( REQUEST_PENDING(state.data) )
        signOut()

     }catch(e){
        setState( REQUEST_FAILED(state.data,e.message) )
     }
   }

   async function login(userAuth, user){
        const newUserDoc =  await createUserDocument(userAuth,user)
        setState( REQUEST_SUCCESS(newUserDoc) )
   }

   const onAuthStateChanged = async (user)=> {
       setState(REQUEST_PENDING(null));
      try{
         if(!user){
            setState(REQUEST_SUCCESS(user));
         }else{
            // logic for checking if someone is already logged in
            console.log("logged from user context listner",user.uid," ", tempUser);
            const newUserDoc =  await createUserDocument(user,tempUser)
            setState( REQUEST_SUCCESS(newUserDoc) )
         }
      }
      catch(e){
         setState(REQUEST_FAILED(null,"Internal Error !Try again later"));
      }
   }

   useEffect(() => {
        const subscribe = auth().onAuthStateChanged(onAuthStateChanged);
        return subscribe;
    },[tempUser]);
   return(
    <UserContext.Provider value = {{currentUser:state,login,logout, tempUser, setTempUser}}> 
            {children} 
    </UserContext.Provider>
   )
}