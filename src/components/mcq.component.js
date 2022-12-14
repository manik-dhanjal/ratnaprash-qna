import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';
import React from 'react'
import { COLORS } from '../constants/theme.constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MCQ = ({
    idx = null,
    question,
    correct_answers, 
    all_answers,
    selected_answers=[],
    message=null,
    handleOptionSelect
}) => {

    const getOptionTextColor = (currentOption) => {
        if (selected_answers.length) {
            if (selected_answers.includes(currentOption)) {
                return COLORS.orange;
            } else {
                return COLORS.white;
            }
        } else {
            return COLORS.white;
        }
    }; 

    const getOptionBullet = (currentOption) => {
        if (selected_answers.includes(currentOption)) {
            if (correct_answers.includes(currentOption)) {
                return <MaterialIcons name="check" style={{color: COLORS.orange,fontSize:20}} />
            } else {
                return <MaterialIcons name="close" style={{color: COLORS.orange,fontSize:20}} />
            }
        } else {
            return  <View style={styles.circleIcon}/>
        }
        
    }
  return (
    <View style={styles.container}>
        <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
                        Q-{typeof idx !== null && idx}. { question }
            </Text>
        </View>

        {   all_answers.map((option, optionIndex) => {
            return (
                <TouchableOpacity
                    key={optionIndex}
                    style={[styles.optionContainer,{
                        // backgroundColor: getOptionBgColor(option),
                    }]}
                    onPress={() => handleOptionSelect(option)}
                >
                    <View style={styles.optionBullet}>
                        { getOptionBullet(option)}
                    </View>
                    <Text style={[styles.optionText, {color: getOptionTextColor(option)}]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            );
        })}
        {
            (selected_answers.length && message != null)?
            (
                <View style={styles.message}>
                    <Text style={styles.messageText}>
                        {message}
                    </Text>
                </View>
            ):null

        }
    </View>
  )
}

export default MCQ

const styles = StyleSheet.create({
    questionContainer:{
        marginBottom:10
    },
    questionText:{
        color:COLORS.white,
        fontWeight:'600'
    },
    optionContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:8,
        paddingVertical:5,
        marginVertical:2
    },
    circleIcon:{
        width:8,
        height:8,
        borderRadius:100,
        marginHorizontal:6,
        backgroundColor:COLORS.white
    },
    optionBullet:{
        marginRight:5
    },
    container:{
        marginVertical:10,
        paddingHorizontal:15
    }
})