import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';

const appIdInFirestore = "ratnaprash"

export const createUserDocument = async (userAuth, user={}) => {
  const userDocRef = firestore().collection('Users').doc(userAuth.uid);
  const userSnapshot = await userDocRef.get();
  if(!userSnapshot.exists){
    const {phoneNumber} = userAuth;
    const createdAt = new Date();
    const newUserDoc = {
      phoneNumber:user.phone,
      createdAt,
      name:user.name,
      uid:userAuth.uid,
      age: user.age,
      location: user.location
    }
    const result = await userDocRef.set(newUserDoc)
    return newUserDoc;
  }
  return userSnapshot.data()
}

export const getUserDocument = async (userId) => {
  const userDocRef = firestore().collection('Users').doc(userId);
  const userSnapshot = await userDocRef.get();
  if(userSnapshot.exists)
    return userSnapshot.data()
  
    return null;
}

export const setQuizResponse = async (questions,userId) => {
  
  const userRef = firestore().collection('Users').doc(userId);
  const responseCollectionRef = firestore().collection('apps').doc(appIdInFirestore).collection('Responses');

  const createdAt = new Date();
  const formatedQuestionsArr = questions.map((question) => {
    const questionRef = firestore().collection('apps').doc(appIdInFirestore).collection('Questions').doc(question.id);
    return {
      questionRef,
      selectedAnswer: question.selectedAnswer
    }
  })
  const responseDoc = await responseCollectionRef.add({
    userRef:userRef,
    createdAt,
    questions: formatedQuestionsArr
  })

  await userRef.update({
      odomosResponseRef: firebase.firestore.FieldValue.arrayUnion(responseCollectionRef.doc(responseDoc.id)),
  })
  return responseDoc.id;
}

