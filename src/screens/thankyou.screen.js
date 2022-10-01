import { ImageBackground, StyleSheet, Image, View } from 'react-native'
import React, {useContext} from 'react'
import thankYouText from "../assets/images/thank-you-text.png"
import bottle from "../assets/images/bottle.png"
import tableBg from "../assets/images/table-bg.png"
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../components/button.components'
import { UserContext } from '../context/user.context'
const ThankyouScreen = () => {
  const {logout} = useContext( UserContext );

  const handleLogout = async () => {
    await logout()
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ImageBackground source={tableBg} style={styles.imagebackground}>
        <View style={styles.title}>
          <Image source={thankYouText} style={styles.titleImg}/>
        </View>
          <View style={styles.bottom}>
            <Image source={bottle} style={styles.bottleImg}/>
            <Button
                title="Thank you"
                onPress={handleLogout}
                containerStyle={styles.logoutBtn}
            />
          </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default ThankyouScreen

const styles = StyleSheet.create({
  safeAreaView:{
    flex:1,
  },
  imagebackground:{
    flex:1,
    resizeMode:'contain',
    justifyContent:'space-between',
    alignItems:'center'
  },
  bottom:{
    justifyContent:'center',
    width:'100%'
  },
  bottleImg:{
    width:260,
    resizeMode:'contain',
    height:400,
    alignSelf:'center',
    // backgroundColor:'red'
  },
  title:{
    width:'100%',
    paddingHorizontal:20
  },
  titleImg:{
    width:'100%',
    resizeMode:'contain'
  },
  logoutBtn:{
    marginHorizontal:15,
    marginBottom:30,
    minWidth:0,
    paddingHorizontal:30,
    alignSelf:'flex-end'
  }
})