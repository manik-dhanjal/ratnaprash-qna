import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import artworkBg from "../assets/images/artwork.png"
import Button from '../components/button.components'
import { APP_TYPE } from '../constants/navigate.constants'

const ArtWorkScreen = ({navigation}) => {
  const handleNextPress = () => {
    navigation.navigate(APP_TYPE.feedbackScreen)
  }
  return (
    <ImageBackground source={artworkBg} style={styles.imagebackground}>
        <Button
            title="Next"
            onPress={handleNextPress}
            containerStyle={styles.nextBtn}
        />
    </ImageBackground>
  )
}

export default ArtWorkScreen

const styles = StyleSheet.create({
    imagebackground:{
        flex:1,
        resizeMode:'cover',
        justifyContent:'flex-end',
        alignItems:'flex-end'
    },
    nextBtn:{
        marginHorizontal:15,
        marginVertical:20,
        minWidth:0,
        paddingHorizontal:25,
        height:35
    }
})