import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme.constants'

const TextQuestion = ({
    question,
    handleChange,
    value,
    idx = null,
}) => {
  return (
    <View style={styles.container}>
        <View style={styles.question}>
            <Text style={[styles.questionText]}> 
                { idx!=null && (`Q-${idx}. `) }
                {question} 
            </Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput
                multiline={true}
                numberOfLines={5}
                onChangeText={ text => handleChange(text) }
                value={value}
                style={styles.textinput}
                maxLength={250}
                cursorColor={COLORS.orange}
            />
        </View>
    </View>
  )
}

export default TextQuestion

const styles = StyleSheet.create({
    question:{
        marginBottom:20
    },
    questionText:{
        color:COLORS.white,
        fontWeight:'600'
    },
    container:{
        marginVertical:10,
        paddingHorizontal:15,
        marginBottom:20
    },
    textinput:{
        backgroundColor:COLORS.white,
        borderRadius:10,
        borderColor:COLORS.border,
        borderWidth:1,
        padding:10
    }
})