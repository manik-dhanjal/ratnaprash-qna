import { ImageBackground, StyleSheet } from 'react-native'
import React, {useContext} from 'react'
import thankYouBg from "../assets/images/thank-you.png"
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
      <ImageBackground source={thankYouBg} style={styles.imagebackground}>
        <Button
            title="Thank you"
            onPress={handleLogout}
            containerStyle={styles.logoutBtn}
        />
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
    resizeMode:'cover',
    justifyContent:'flex-end',
    alignItems:'flex-end'
  },
  logoutBtn:{
    marginHorizontal:15,
    marginVertical:30,
    minWidth:0,
    paddingHorizontal:30
  }
})