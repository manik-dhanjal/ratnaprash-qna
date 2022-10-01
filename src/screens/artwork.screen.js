import React from 'react'
import { Image, ImageBackground, StyleSheet, View } from 'react-native'
import artworkBg from "../assets/images/artwork-bg.png"
import artworkHead from "../assets/images/artwork-head.png"
import Button from '../components/button.components'
import { APP_TYPE } from '../constants/navigate.constants'

const ArtWorkScreen = ({navigation}) => {
  const handleNextPress = () => {
    navigation.navigate(APP_TYPE.feedbackScreen)
  }
  return (
    <ImageBackground source={artworkBg} style={styles.imagebackground}>
      <View style={styles.artworkHead}>
        <Image source={artworkHead} style={styles.artworkImg}/>
      </View>
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
        justifyContent:'space-between',
        alignItems:'flex-end'
    },
    artworkHead:{
      width:'100%',
      paddingHorizontal:20
    },
    artworkImg:{
      width:'100%',
      resizeMode:'contain'
    },
    nextBtn:{
        marginHorizontal:15,
        marginVertical:20,
        minWidth:0,
        paddingHorizontal:25,
        height:35
    }
})