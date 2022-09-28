import { ImageBackground, View,Text,Image,StyleSheet, Pressable, ScrollView } from 'react-native'
import React from 'react'
import bg from "../assets/images/red-bg.png";
import bannerLogo from "../assets/images/ratanprash-logo.png"
import welcomeBtn from "../assets/images/welcome-btn.png"
import { AUTH_TYPE } from '../constants/navigate.constants';

const styles = StyleSheet.create({
    scrollview:{
        flex:1,
    },
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-evenly',
        alignItems:'center',
    },
    bannerLogoImg:{
        width:"100%",
        maxHeight:"60%",
        resizeMode:'contain',
    },
    welcomeBtn:{
        width:280,
    },
    welcomeBtnImg:{
        width:"100%",
        resizeMode:'contain',
    },
});
const WelcomeScreen = ({navigation}) => {

  const changeScreen = ()=>{
    navigation.navigate(AUTH_TYPE.loginScreen ,{
        screen:"login"
    });
  }

  return (
    <ImageBackground
        source={bg}
        resizeMode="cover"
        style={styles.container}
        >
            <Image
                source={bannerLogo}
                style={styles.bannerLogoImg}
            />
            <Pressable onPress={changeScreen} style={styles.welcomeBtn}>
                <Image 
                    source={welcomeBtn}
                    style={styles.welcomeBtnImg}
                />
            </Pressable>
    </ImageBackground>
  )
}

export default WelcomeScreen