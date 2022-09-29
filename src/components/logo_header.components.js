import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import dabarLogo from '../assets/images/dabar-logo.png';
import ratnaprashLogo from "../assets/images/ratanprash-logo.png"
import { COLORS } from '../constants/theme.constants';

const LogoHeader = () => {
  return (
    <View style={styles.container}>
      <Image source={dabarLogo} style={styles.dabarLogo}/>
      <Image source={ratnaprashLogo} style={styles.ratnaLogo}/>
    </View>
  )
}

export default LogoHeader

const styles = StyleSheet.create({
    container:{
        backgroundColor:COLORS.maroon,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:10,
        paddingVertical:5
    },
    dabarLogo:{
        height:50,
        resizeMode:'contain',
        width:50,
    },
    ratnaLogo:{
        height:50,
        resizeMode:'contain',
        width:50
    }
})