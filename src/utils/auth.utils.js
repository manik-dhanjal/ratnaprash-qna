import auth from '@react-native-firebase/auth';

export const signInWithEmailAndPassword = async (email, password) => {
  auth() .signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailAndPassword = async (email, password) => {
  auth().createUserWithEmailAndPassword(email, password);
};

export const signInWithPhoneNumber = async (phoneNumber,forceResend=false) => {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber, forceResend);
        return confirmation
}

export const confirmCodeSentOnPhoneNumber = async(confirmation,code) => {
      const credential = auth.PhoneAuthProvider.credential(confirmation.verificationId, code);
      let userData = await auth().currentUser.linkWithCredential(credential);
      return userData
    //  error code: auth/invalid-verification-code
  }

export const signInAnonymously = async () => {
  return await auth().signInAnonymously();
}
export const signOut = async () => {
  auth().signOut()
};

export const onAuthStateChangedListener = (callback) => {
  return auth().onAuthStateChanged(callback)
}
