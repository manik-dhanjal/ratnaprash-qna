import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import bg from "../assets/images/bg.png"
import { REQUEST_FAILED, REQUEST_PENDING, REQUEST_SUCCESS, PENDING, FAILED } from '../constants/request.constants'
import { getFeedbackQuestions, setFeedbackResponse } from '../utils/database.utils'
import MCQ from '../components/mcq.component'
import TextQuestion from "../components/text-question.components"
import Button from '../components/button.components'
import SpinnerWrapper from '../components/spinner.component'
import { COLORS } from '../constants/theme.constants'
import { UserContext } from '../context/user.context'
import { APP_TYPE } from '../constants/navigate.constants'

const FeedbackScreen = ({navigation}) => {
  const [feedback,setFeedback] = useState( REQUEST_SUCCESS([]));
  const {currentUser} = useContext(UserContext);

  const getFeedbackQuestionsDetails = async () => {
    try{
        setFeedback( REQUEST_PENDING([]) );
        let feedbackQuestions = await getFeedbackQuestions();
        feedbackQuestions = feedbackQuestions.map((question) => {
            if( question.type === 'option'){
                return {
                    ...question,
                    selected_answers:[],
                    all_answers:[...question.options],
                    correct_answers:[...question.options]
                }
            }else{
                return {
                    ...question,
                    typed_answer:""
                }
            }

        }).sort((a,b) => a.index-b.index)
        setFeedback( REQUEST_SUCCESS(feedbackQuestions) );
    }catch(e){
        console.log(e);
        setFeedback( REQUEST_FAILED([],"Unable to fetch feedback Questions") )
    }
  }
  const handleOptionChange = (selectedOption, questionIdx) => {
    if ( 
        feedback.data[questionIdx].selected_answers.length > 0
        || feedback.data[questionIdx].selected_answers.includes(selectedOption) 
      ) {
        return null;
    }

    setFeedback((state) => {
       state.data[questionIdx].selected_answers.push(selectedOption);
       return { ...state }
    })
  }
  const handleTextChange = (value, questionIdx) => {
    setFeedback((state) => {
        state.data[questionIdx].typed_answer = value;
        return { ...state }
     })
  }
  const getSelectedQuestionCount = () => {
    let count = 0;
    feedback.data.forEach(question => {
        if(question.type == 'text' && question.typed_answer.length>0) count++;
        if(question.type == 'option' && question.selected_answers.length>0) count++;
    })
    return count;
  }
  const handleSubmitFeedback = async() => {
    try{
        setFeedback(state => REQUEST_PENDING(state.data))
        await setFeedbackResponse(feedback.data,currentUser.data.id);
        setFeedback(state => REQUEST_SUCCESS(state.data));
        navigation.navigate(APP_TYPE.thankYouScreen);
    }
    catch(e){
        setFeedback(state => REQUEST_FAILED(state.data,"Internal Error! Unable to submit your response, Please try again"))
        console.log("error in submitting response", e);
    }
  }
  useEffect(() => {
    getFeedbackQuestionsDetails();
  },[])

    if( feedback.status===PENDING ){
        return (
            <SpinnerWrapper isActive={ true }/>
        )
    }
    if( feedback.status===FAILED || !feedback.data.length){
        return (
        <SafeAreaView style={styles.safeAreaView}>
            <ImageBackground style={[styles.imageBackground, styles.errorWindow]} source={bg}>
                <Text style={styles.errorMessageTitle}>
                    {feedback.message? feedback.message : "Internal Error! Failed to fetch feedback questions"}
                </Text>
                <Button title="Try again" onPress = {() => getQuestionDetails() }/>
            </ImageBackground>
        </SafeAreaView>
        )
    }

  return (
    <SafeAreaView style={styles.safeAreaView}>
        <ImageBackground source={bg} style={styles.imageBackground}>
            <FlatList
                data={feedback.data}
                renderItem ={({item,index}) => {
                    if(item.type === 'option'){
                        return(
                            <MCQ
                                {
                                    ...item
                                }
                                idx={index+1}
                                handleOptionSelect={(option) => handleOptionChange(option,index) }
                            />
                        )
                    }
                    if(item.type === 'text'){
                        return(
                            <TextQuestion
                                question={item.question}
                                handleChange = {(value) => handleTextChange(value,index) }
                                idx = {index+1}
                                value = {item.response}
                            />
                        )
                    }
                }}
                keyExtractor = {(item) => item.id}
                ListFooterComponent = {
                    <Button 
                      title="Submit Feedback" 
                      onPress={handleSubmitFeedback} 
                      containerStyle={styles.buttonSubmit}
                      isActive = {getSelectedQuestionCount() === feedback.data.length}
                    />
                  }
                  ListFooterComponentStyle={styles.listFooter}
                  style={[styles.questionList]}
            />
        </ImageBackground>
    </SafeAreaView>
  )
}

export default FeedbackScreen

const styles = StyleSheet.create({
    safeAreaView:{
        flex:1
      },
      imageBackground:{
        flex:1,
        resizeMode:'cover',
      },
      questionList:{
        paddingTop:20,
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