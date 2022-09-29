import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';

const appIdInFirestore = "Ratnaprash"

export const getQuizQuestions = async() => {
  const questionsSnapshot = await firestore().collection('apps').doc(appIdInFirestore).collection('QuizQuestions').get();
  let tempQuestions = [];
  for(var i=0; i < questionsSnapshot.docs.length; i++){
    const question = await questionsSnapshot.docs[i].data()
    tempQuestions.push({id:questionsSnapshot.docs[i].id,...question});
  }
  return tempQuestions;
};

export const getFeedbackQuestions = async() => {
  const questionsSnapshot = await firestore().collection('apps').doc(appIdInFirestore).collection('feedbackQuestions').get();
  let tempQuestions = [];
  for(var i=0; i < questionsSnapshot.docs.length; i++){
    const question = await questionsSnapshot.docs[i].data()
    tempQuestions.push({id:questionsSnapshot.docs[i].id,...question});
  }
  return tempQuestions;
};


export const createUserDocument = async (userAuth, user={}) => {
  const userDocRefById = firestore().collection('apps').doc(appIdInFirestore).collection('Users').doc(userAuth.uid);
  const userSnapshot = await userDocRefById.get();
  if(!userSnapshot.exists){
    const createdAt = new Date();
    const newUserDoc = {
      phoneNumber:user.phone,
      createdAt,
      name:user.name,
      id:userAuth.uid,
      age: user.age,
      location: user.location
    }
    const usersRef = firestore().collection('apps').doc(appIdInFirestore).collection('Users');
    const userSnapshotsByPhone = await usersRef.where('phoneNumber','==',user.phone).get();

    if(userSnapshotsByPhone.length>0){
      return userSnapshotsByPhone[0].data();
    }else{
      const result = await userDocRefById.set(newUserDoc)
      return newUserDoc;
    }
  }
  return userSnapshot.data()
}

export const getUserDocumentById = async (userId) => {
  const userDocRef = firestore().collection('apps').doc(appIdInFirestore).collection('Users').doc(userId);
  const userSnapshot = await userDocRef.get();
  if(userSnapshot.exists)
    return userSnapshot.data()
  
    return null;
}

export const setQuizResponse = async (questions,userId) => {
  const userRef = firestore().collection('apps').doc(appIdInFirestore).collection('Users').doc(userId);
  const responseCollectionRef = firestore().collection('apps').doc(appIdInFirestore).collection('QuizResponses');

  const createdAt = new Date();
  const formatedQuestionsArr = questions.map((question) => {
    const questionRef = firestore().collection('apps').doc(appIdInFirestore).collection('QuizQuestions').doc(question.id);
    return {
      questionRef,
      selected_answers: question.selected_answers
    }
  })
  const responseDoc = await responseCollectionRef.add({
    userRef:userRef,
    createdAt,
    questions: formatedQuestionsArr
  })

  await userRef.update({
      QuizResponseRef: firebase.firestore.FieldValue.arrayUnion(responseCollectionRef.doc(responseDoc.id)),
  })
  return responseDoc.id;
}

export const setFeedbackResponse = async (questions, userId) => {
  const userRef = firestore().collection('apps').doc(appIdInFirestore).collection('Users').doc(userId);
  const responseCollectionRef = firestore().collection('apps').doc(appIdInFirestore).collection('feedbackResponses');

  const createdAt = new Date();
  const formatedQuestionsArr = questions.map((question) => {
    const questionRef = firestore().collection('apps').doc(appIdInFirestore).collection('feedbackQuestions').doc(question.id);
    return {
      questionRef,
      response: question.type =='option'? question.selected_answers : question.typed_answer
    }
  })
  const responseDoc = await responseCollectionRef.add({
    userRef:userRef,
    createdAt,
    questions: formatedQuestionsArr
  })

  await userRef.update({
      feedbackResponseRef: firebase.firestore.FieldValue.arrayUnion(responseCollectionRef.doc(responseDoc.id)),
  })
  return responseDoc.id;
}
