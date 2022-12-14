import React, { createContext, useState, useEffect } from 'react';
import { REQUEST_PENDING, REQUEST_SUCCESS, REQUEST_FAILED } from '../constants/request.constants';
import { onAuthStateChangedListener, signInAnonymously, signOut } from '../utils/auth.utils';
import { createUserDocument, getUserDocumentById } from '../utils/database.utils';

const initialState = REQUEST_PENDING(null);
export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
   const [state, setState] = useState(initialState);

   // Actions for changing state
    async function logout() {
     try{
        if(!state.data) throw new Error("No one is Signed In")
        setState( REQUEST_PENDING(state.data) )
        await signOut()
        setState(REQUEST_SUCCESS(null));
     }catch(e){
        setState( REQUEST_FAILED(state.data,e.message) )
     }
   }

   async function login( user ){
      try{
         setState( REQUEST_PENDING(null) )
         const userAuth = await signInAnonymously();
         const newUserDoc =  await createUserDocument(userAuth.user,user)
         setState( REQUEST_SUCCESS(newUserDoc) )
         console.log("login(): ",newUserDoc);
      }
      catch(e){
         console.log(e)
         setState( REQUEST_FAILED( null,"Unable to login" ));
      }

   }

   const onAuthStateChanged = async (userAuth)=> {
      try{
         if( userAuth != null){
            const newUserDoc =  await getUserDocumentById(userAuth.uid)
            if(newUserDoc != null){
               setState( REQUEST_SUCCESS(newUserDoc) )
            }
         }else{
            setState(REQUEST_SUCCESS(null));
         }
         
      }
      catch(e){
         console.log(e);
         setState(REQUEST_FAILED(null,"Unable to connect to Firebase !Try again later"));
      }
   }

   useEffect(() => {
        const subscribe = onAuthStateChangedListener(onAuthStateChanged);
        return subscribe;
    },[]);
   return(
    <UserContext.Provider value = {{currentUser:state,login,logout}}> 
            {children} 
    </UserContext.Provider>
   )
}