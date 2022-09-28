import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import SpinnerWrapper from '../components/spinner.component';
import Button from '../components/button.components';
import Question from '../components/question.component';

import {getQuizQuestions, setQuizResponse} from '../utils/database.utils';
import { UserContext } from '../context/user.context';

import bg from "../assets/images/red-bg.png";
import {COLORS} from '../constants/theme.constants';
import { APP_TYPE } from '../constants/navigate.constants';
import { PENDING,FAILED, REQUEST_FAILED, REQUEST_PENDING, REQUEST_SUCCESS } from '../constants/request.constants';
import RP_Utils from '../utils';


const QuizScreen = ({navigation, route}) => {
    const {currentUser} = useContext(UserContext);
    const [quiz, setQuiz] = useState(REQUEST_PENDING([]));

    const getQuestionDetails = async () => {
        try{
            setQuiz(REQUEST_PENDING([]));
            const questions = await getQuizQuestions();
            const parsedQuestions = questions.map( question => {
                return {
                  ...question,
                  selected_answers:[],
                  all_answers: RP_Utils.shuffleArray([ ...question.correct_answers, ...question.wrong_answers ])
                }
            }); 
            setQuiz( REQUEST_SUCCESS(parsedQuestions) )
        }
        catch(e){
            setQuiz( REQUEST_FAILED([],"Unable to fetch Questions. Please Try Again!") )
            console.log("message from getQuestions()",e.message)
        }
    };

    const getSelectedQuestionCount = () => {
      let count = 0;
      quiz.data.forEach(question => {
        if(question.selected_answers.length>0) count++;
      })
      return count;
    }

    const handleSubmitQuiz = async () => {
        try{
            setQuiz(state => REQUEST_PENDING(state.data))
            await setQuizResponse(quiz.data,currentUser.data.id);
            setQuiz(state => REQUEST_SUCCESS(state.data))
        }
        catch(e){
            setQuiz(state => REQUEST_FAILED(state.data,"Internal Error! Unable to submit your response, Please try again"))
            console.log("error in submitting response", e);
        }
    }
    const handleOptionSelect = (selectedOption,questionIdx) => {
      if ( 
          quiz.data[questionIdx].selected_answers.length > 0
          || quiz.data[questionIdx].selected_answers.includes(selectedOption) 
        ) {
          return null;
      }

      setQuiz((state) => {
         state.data[questionIdx].selected_answers.push(selectedOption);
         return { ...state }
      })
   }  

    useEffect(() => {
        getQuestionDetails();
    }, []);

    if( quiz.status===PENDING ){
        return (
            <SpinnerWrapper isActive={ true }/>
        )
    }
    if( quiz.status===FAILED || !quiz.data.length){
        return (
          <SafeAreaView style={styles.safeAreaView}>
            <ImageBackground style={[styles.imageBackground, styles.errorWindow]} source={bg}>
                  <Text style={styles.errorMessageTitle}>
                      {quiz.message? quiz.message : "Internal Error! Failed to fetch questions"}
                  </Text>
                  <Button title="Try again" onPress = {() => getQuestionDetails() }/>
              </ImageBackground>
          </SafeAreaView>
        )
    }

    return (
            <SafeAreaView style={styles.safeAreaView}>
                  <ImageBackground style={styles.imageBackground} source={bg}>
                    <FlatList
                        data={quiz.data}
                        renderItem={({ item, index }) => (
                          <Question
                            {
                              ...item
                            }
                            idx={index+1}
                            handleOptionSelect = { (selectedOption) => handleOptionSelect(selectedOption,index) }
                          />
                        )}
                        contentContainerStyle={{
                          flexGrow: 1,
                          }}
                        keyExtractor={(item) => item.id}
                        ListFooterComponent = {
                          <Button 
                            title="Submit Quiz" 
                            onPress={handleSubmitQuiz} 
                            containerStyle={styles.buttonSubmit}
                            isActive = {getSelectedQuestionCount() === quiz.data.length}
                          />
                        }
                        ListFooterComponentStyle={styles.listFooter}
                        style={styles.questionList}
                      />
                </ImageBackground>
            </SafeAreaView>
    );
};

export default QuizScreen;

const styles = StyleSheet.create({
    safeAreaView:{
      flex:1
    },
    imageBackground:{
      flex:1,
      resizeMode:'cover',
    },
    questionList:{
      paddingTop:20
    },
    listFooter:{
      flexDirection:'row',
      justifyContent:'center',
      paddingTop:10,
      paddingBottom:40
    },
   errorWindow:{
    justifyContent:'center',
    paddingHorizontal:15,
    alignItems:'center'
   },
    errorMessageTitle:{
        fontSize:25,
        fontWeight:'600',
        color:COLORS.white,
        textAlign:'center',
        marginBottom:30
    }
})