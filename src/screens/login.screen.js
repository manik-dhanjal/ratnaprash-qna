import { Text,View, ImageBackground, StyleSheet, Keyboard,KeyboardAvoidingView,TouchableWithoutFeedback,Platform, ScrollView } from 'react-native'
import React,{useState, useEffect, useContext} from 'react'
import bg from "../assets/images/bg.png";
// import LoginForm from '../components/login_form.components';
import Container from '../components/container.components';
import Button from '../components/button.components'
import C_TextInput from '../components/c_text_input.component'
import C_RadioInput from '../components/c_radio_btn.components'
import { PENDING, REQUEST_PENDING, REQUEST_SUCCESS, SUCCESS,REQUEST_FAILED } from '../constants/request.constants';
import { signInAnonymously, signInWithPhoneNumber } from '../utils/auth.utils';
import { UserContext, UserProvider } from '../context/user.context';
import { AUTH_TYPE } from '../constants/navigate.constants';
import { COLORS } from '../constants/theme.constants';

const INITIAL_USER_INPUT = {
    name:"",
    age:"",
    phone:"",
    location:""
}
const testingCreds = {
    name:"manik",
    age:"18-24",
    phone:"1111111111",
    location:"outlet location"
}
var age_props = [
    {label: '18-24', value:'18-24'},
    {label: '25-32', value: '25-32' },
    {label:'33-45', value:'33-45'},
    {label:'45+', value:'45-Above'}
  ];
const LoginScreen = ({navigation, route}) => {

    const [user,setUser] = useState(REQUEST_SUCCESS( testingCreds ));
    const { login } = useContext(UserContext);
    const setMessage = (message) => {
        setUser(state => {
            state.message = message;
            return {...state}
        })
    }
    const handleAnonymousLogin = async () => {
        if(user.status===PENDING) return;

        if(!user.data.name){
            setMessage("Please enter your name")
            return
        }if(!user.data.age){
            setMessage("Please select your age")
            return
        }
        if(!user.data.phone || user.data.phone<100000){
            setMessage("Please enter a valid phone number")
            return
        }
        if(!user.data.location ){
            setMessage("Please enter a valid Location")
            return
        }
        setMessage("");
        try{
            await login(user.data)
        }catch(e){
            if(e.code === 'auth/too-many-requests'){
                setUser(state => REQUEST_FAILED(state.data,"Your device is blocked due to too many requests! Please try again later"))
            }else{
                console.log(e.message)
                setUser(state => REQUEST_FAILED(state.data,e.message.replace("["+e.code+"] ","")))
            }
        }
    }

    const handleInputChange = (label,value)=> {
        setUser((state)=>{
            state.data[label] = value
            return { ...state }
        })
        setMessage("")
      }

    useEffect(() =>{
        setMessage(route.params.message);
    }, [route.params.message])
    
    return (
        <ImageBackground style={styles.background} source={bg}>
            <ScrollView>
                <KeyboardAvoidingView 
                    behavior={Platform.OS == 'ios'?'padding':'stretch'}
                    keyboardVerticalOffset={10}
                    style={styles.avoidContainer}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View  style={styles.container}>
                            {/* <Container style={styles.whiteCont}> */}

                                <Text style={styles.heading}>
                                    Please enter your details
                                </Text>
                                    <C_TextInput
                                        label="Name"
                                        name="name"
                                        onChangeText={handleInputChange}
                                        value={user.data.name}
                                        placeholder="Name"
                                        containerStyles={styles.inputGrp}
                                    />
                                    <C_RadioInput
                                        name="age"
                                        label="Age"
                                        radio_props={age_props}
                                        initial={age_props[0].value}
                                        style={styles.radioLabel}
                                        onChange={handleInputChange}
                                        value={user.data.age}
                                        containerStyles={styles.inputGrp}
                                    />
                                    <C_TextInput
                                        label="Mobile No."
                                        name="phone"
                                        onChangeText={handleInputChange}
                                        value={user.data.phone}
                                        placeholder="Mobile No."
                                        containerStyles={styles.inputGrp}
                                        type="tel"
                                        countryCode='+91'
                                    />
                                    <C_TextInput
                                        label="Location"
                                        name="location"
                                        onChangeText={handleInputChange}
                                        value={user.data.location}
                                        placeholder="Location"
                                        containerStyles={styles.inputGrp}
                                    />
                                    <Button
                                        title="Start Quiz"
                                        containerStyle={styles.submit}
                                        onPress={handleAnonymousLogin}
                                        isLoading={user.status===PENDING}
                                    />
                                    {/* <Button
                                        title="Verify Phone"
                                        containerStyle={styles.submit}
                                        onPress={handleFormSubmit}
                                        isLoading={user.status===PENDING}
                                    /> */}
                                    {
                                        user.message &&
                                        <Text style={styles.error}>{user.message}</Text>
                                    }
                            {/* </Container>     */}
                        </View>
                    </TouchableWithoutFeedback>      
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    background:{
        resizeMode:'cover',
        flex:1,
    },
    avoidContainer:{
        flex:1,
    },
    container:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:30,
        paddingBottom:30,
        flex:1,
        alignItems:'center'
    },
    scroll:{
        paddingTop:15

    },
    whiteCont:{
        maxWidth:450,
        width:'100%',
    },  
    heading:{
        fontSize:26,
        color:COLORS.white,
        fontWeight:'600',
        marginBottom:20
    },
    inputGrp:{
        marginBottom:20
    },
    submit:{
        marginTop:20
    },
    error:{
        fontSize:16,
        color:COLORS.orange,
        marginTop:10,
        textAlign:'center',
        fontWeight:"600"
    },
})