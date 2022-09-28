import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const styles = StyleSheet.create({
    container:{
      width:'100%'
    },
    input:{
        backgroundColor:"#ffffffb0",
        borderColor:"#ffffff80",
        paddingHorizontal:15,
        paddingVertical:8,
        borderWidth:1,
        width:'100%',
        color:"#000",
        fontSize:18,
        borderRadius:5,

    },
    phoneInputContainer:{
      backgroundColor:"#ffffffb0",
      borderColor:"#ffffff80",
      paddingHorizontal:15,
      paddingVertical:8,
      borderWidth:1,
      width:'100%',
      borderRadius:2,
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center'
    },
    phoneInput:{
      color:'#000',
      fontSize:16,
      padding:0,
      marginLeft:10
    },
    countryCode:{
      color:'#000',
      fontSize:16
    },
    label:{
        marginBottom:10,
        fontSize:18,
        color:"#fff",
        fontWeight:"600"
    },
})

const C_TextInput = ({
    label="",
    containerStyles={},
    labelStyles={},
    style={},
    onChangeText,
    name,
    type="",
    countryCode="",
    ...props
}) => {
  if(type=='tel' && !countryCode) throw new Error("countryCode not provided");
  
  return (
    <View style={[styles.container,containerStyles]}>
      {
        label 
        && <Text style={[styles.label,labelStyles]}>{label}</Text>
      }
      {
        type=="tel"?
        (
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>
              {countryCode} |
            </Text>
            <TextInput
              {...props}
              style={[styles.phoneInput,style]}
              onChangeText={(text) => onChangeText(name,text)}
              keyboardType='numeric'
              secureTextEntry = {false}
            />
          </View>
        ):(
          <TextInput 
            {...props}
            style={[styles.input,style]}
            onChangeText={(text) => onChangeText(name,text)}
            placeholderTextColor="gray"
          />
        )
      }
    </View>
  )
}

export default C_TextInput