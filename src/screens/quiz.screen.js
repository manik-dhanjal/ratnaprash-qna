import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import SpinnerWrapper from '../components/spinner.component';
import ResultModal from '../components/result_modal.components';
import Button from '../components/button.components';

import {getQuestions, setQuizResponse} from '../utils/database.utils';
import { UserContext } from '../context/user.context';

import bg from "../assets/images/bg.jpg";
import {COLORS} from '../constants/theme.constants';
import { APP_TYPE } from '../constants/navigate.constants';
import { PENDING,FAILED, REQUEST_FAILED, REQUEST_PENDING, REQUEST_SUCCESS } from '../constants/request.constants';


const INITIAL_QUIZ_DATA = {
    questions:[],
    currentQuestionId:-1,
}
const QuizScreen = ({navigation, route}) => {
    const {currentUser} = useContext(UserContext);
    const [quiz, setQuiz] = useState(REQUEST_PENDING(INITIAL_QUIZ_DATA));
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
        return array;
    };

    const getQuestionDetails = async () => {
        try{
            setQuiz(REQUEST_SUCCESS(INITIAL_QUIZ_DATA));
            // Get Questions for current quiz
            const questions = await getQuestions();
            // Transform and shuffle options
            let tempQuestions = [];
            questions.forEach(async question => {

                question.allOptions = shuffleArray([
                    ...question.wrong_answers,
                    ...question.correct_answers,
                ]);  
                question.selectedAnswer = null;
                tempQuestions.push({...question});
            });
            setQuiz( REQUEST_SUCCESS({
                questions:tempQuestions,
                currentQuestionId:0
            }) )
        }
        catch(e){
            setQuiz( REQUEST_FAILED(INITIAL_QUIZ_DATA) )
            console.log("message from getQuestions()",e.message)
        }
    };

    const getCorrectQuestionCount = () => {
        if(quiz.data.questions.length==0) return -1;

        let correctCount = quiz.data.questions.reduce((correctCount,{correct_answers, selectedAnswer}) => {
            if( correct_answers.includes(selectedAnswer) ) return correctCount+1;
            return correctCount;
        },0)
        return correctCount;
    } 

    const getIncorrectQuestionCount = () => {
        if(quiz.data.questions.length==0) return -1;

        let incorrectCount = quiz.data.questions.reduce((incorrectCount, {wrong_answers, selectedAnswer}) => {
            if( wrong_answers.includes(selectedAnswer) ) return incorrectCount+1;
            return incorrectCount;
        },0)
        return incorrectCount;
    }

    const getCurrentQuestion = () =>{
        if(!quiz.data || quiz.data.questions.length==0) return null;

        return quiz.data.questions[quiz.data.currentQuestionId];
    }

    const getOptionBgColor = (currentOption) => {

        if (getCurrentQuestion().selectedAnswer==currentOption) {
            if (getCurrentQuestion().correct_answers.includes(currentOption)) {
                return COLORS.success;
            } else {
                return COLORS.error;
            }
        } else {
            return COLORS.white+"00";
        }
    };

    const getOptionTextColor = (currentOption) => {
        if (getCurrentQuestion().selectedAnswer) {
            if (getCurrentQuestion().selectedAnswer==currentOption) {
                return COLORS.white;
            } else {
                return COLORS.black;
            }
        } else {
            return COLORS.black;
        }
    };

    const handleOptionSelect = (selectedOption) => {
        if ( getCurrentQuestion().selectedAnswer ) {
            return null;
        }

        setQuiz((state) => {
           state.data.questions[state.data.currentQuestionId].selectedAnswer = selectedOption;
           return {...state};
        })
    }   

    const handleSubmitQuiz = async () => {
        try{
            setQuiz(state => REQUEST_PENDING(state.data))

            await setQuizResponse(quiz.data.questions,currentUser.data.uid);
            setIsResultModalVisible(true);

            setQuiz(state => REQUEST_SUCCESS(state.data))
        }
        catch(e){
            setQuiz(state => REQUEST_FAILED(state.data,"Internal Error! Unable to submit your response, Please try again"))
            console.log("error in submitting response", e.message);
        }
    }

    const handlePrevQuestionChange = () => {
        setQuiz(state => {
            state.data.currentQuestionId--;
            return {...state};
        })
    }

    const handleNextQuestionChange = () => {
        setQuiz(state => {
            state.data.currentQuestionId++;
            return {...state};
        })
    }

    const handleQuizTryAgain = () => {
        getQuestionDetails();
        setIsResultModalVisible(false)
    }
    useEffect(() => {
        getQuestionDetails();
        setIsResultModalVisible(false)
    }, []);

    if(quiz.status===PENDING || !quiz.data.questions.length){
        return (
            <SpinnerWrapper isActive={ true }/>
        )
    }
    if( quiz.status===FAILED && !quiz.data.questions.length){
        return (
            <View styles={styles.errorWindow}>
                <Text style={styles.errorMessageTitle}>
                    Internal Error! Failed to fetch questions
                </Text>
                <Button title="Try again" onPress = {() => getQuestionDetails() }/>
            </View>
        )
    }

    return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
                    <ImageBackground style={styles.imageBackground} source={bg}>
                        <View style={styles.container}>
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>
                                            {quiz.data.currentQuestionId + 1}. { getCurrentQuestion().question }
                                </Text>
                            </View>

                            {getCurrentQuestion().allOptions.map((option, optionIndex) => {
                                return (
                                    <TouchableOpacity
                                        key={optionIndex}
                                        style={[styles.optionContainer,{
                                            backgroundColor: getOptionBgColor(option),
                                        }]}
                                        onPress={() => handleOptionSelect(option)}
                                    >
                                        <Text style={[styles.optionTextBullet,{
                                                color: getOptionTextColor(option),
                                            }]}>
                                            {optionIndex + 1}
                                        </Text>
                                        <Text style={[styles.optionText, {color: getOptionTextColor(option)}]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            <View>
                            {
                                getCurrentQuestion().selectedAnswer &&
                                (
                                    <View style={styles.message}>
                                        <Text style={styles.messageText}>
                                            {getCurrentQuestion().message}
                                        </Text>
                                    </View>
                                )

                            }
                            </View>
                        </View>
                        <View style={styles.bottomView}>
                                {/* <Button title="Submit" onPress={handleQuizSubmit}/> */}
                                {
                                    quiz.data.currentQuestionId>0?
                                        <Button title="Previous" onPress={handlePrevQuestionChange} containerStyle={styles.buttonPrev}/>
                                        :<View/>
                                }
                                {
                                    getCurrentQuestion().selectedAnswer&&(
                                        quiz.data.currentQuestionId < quiz.data.questions.length-1?
                                            <Button title="Next" onPress={handleNextQuestionChange} containerStyle={styles.buttonNext}/>
                                            :<Button title="Submit Quiz" onPress={handleSubmitQuiz} containerStyle={styles.buttonSubmit}/>
                                    )
                                }                   
                        </View>

                </ImageBackground>

                {/* Result Modal */}
                <ResultModal
                    isModalVisible={isResultModalVisible}
                    correctCount={getCorrectQuestionCount()}
                    incorrectCount={getIncorrectQuestionCount()}
                    totalCount={quiz.data.questions.length}
                    handleOnClose={() => {
                        setIsResultModalVisible(false);
                    }}
                    handleCheckout={() => {
                        navigation.navigate( APP_TYPE.gratificationScreen );
                        setIsResultModalVisible(false);
                    }}
                    handleQuizTryAgain = {handleQuizTryAgain}
                />
            </SafeAreaView>
    );
};

export default QuizScreen;

const styles = StyleSheet.create({
    statusBarWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        elevation: 4,
    },
    safeArea:{
        flex: 1,
        position: 'relative',
    },
    statusBarTitle:{
        fontSize: 16, 
        marginLeft: 10
    },
    scoreCounter:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    correctCounter:{
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    incorrectCount:{
        backgroundColor: COLORS.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    imageBackground:{
        flex:1
    },
    container:{
        marginTop: 14,
        marginHorizontal: 10,
        backgroundColor: COLORS.white+"f2",
        elevation: 2,
        borderRadius: 2,
    },
    questionContainer:{
        padding: 20,
        marginBottom:10
    },
    questionText:{
        fontSize:18,
        color:COLORS.black
    },
    optionContainer:{
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    optionTextBullet:{
        width: 25,
        height: 25,
        padding: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
        textAlign: 'center',
        marginRight: 16,
        borderRadius: 25,
    },
    optionText:{
        textAlign: 'center',
        marginRight: 16,
    },
    bottomView:{
        marginTop: 14,
        marginHorizontal: 10,
        borderRadius: 2,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    buttonNext:{
        width:150
    },
    buttonPrev:{
        width:150,
        backgroundColor:COLORS.secondary,
        borderColor:COLORS.secondary
    },
    buttonSubmit:{
        width:200
    },
    message:{
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    messageText:{
        color:COLORS.secondary,
        fontSize:14
    },
    errorWindow:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    errorMessageTitle:{
        marginBottom:100,
        fontSize:25,
        fontWeight:600,
        color:'#000'
    }
})