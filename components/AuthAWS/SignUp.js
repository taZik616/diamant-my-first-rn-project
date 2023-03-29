import React, { useState, useContext, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { View, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native'
import authStyles from './authStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Keychain from 'react-native-keychain'
import { useFocusEffect } from '@react-navigation/native'
import { Context } from '../nav/context'
import { Flow } from 'react-native-animated-spinkit'
import { CustomInput } from './CustomInput'
import { BgSvg } from './BgSvg'

const SignUp = ({ navigation, route }) => {
  const { container, errorMes, errorBox, subBut, subButText, title } = authStyles
  const initForm = {email: '', password: '', passwordConfirmation: '', name: ''}
  const [form, setForm] = useState(initForm)
  const [isValid, setIsValid] = useState(false)
  const initError = {email: null, name: null, password: null, passwordConfirmation: null, server: null}
  const [error, setError] = useState(initError)

  const [load, setLoad] = useState(false)
  const {setGoBackVisible, setGoBackProps, setScreenParams} = useContext(Context)

  useEffect(() => {
    let reMail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    let reName = /^[a-zA-Zа-яА-я]+$/
    let testEmail = form.email
    testEmail = testEmail.toLowerCase()
    if (form.email.length>=5 && reMail.test(testEmail)) {
      setError(prev => {return{...prev, email: ''}})
    } else if (form.email.length === 0){
      setError(prev => {return{...prev, email: null}})
    } else {
      setError(prev => {return{...prev, email: 'Некорректный адрес электронной почты'}})
    }

    if (form.password.length >= 8) {
      setError(prev => {return{...prev, password: ''}})
    } else if (form.password.length === 0) {
      setError(prev => {return{...prev, password: null}})
    } else {
      setError(prev => {return{...prev, password: 'Слишком короткий пароль'}})
    }
    if (form.passwordConfirmation === form.password) {
      setError(prev => {return{...prev, passwordConfirmation: ''}})
    } else if (form.passwordConfirmation.length === 0) {
      setError(prev => {return{...prev, passwordConfirmation: null}})
    } else {
      setError(prev => {return{...prev, passwordConfirmation: 
        'Пароли не совпадают'}})
    }
    if(form.name.length >= 13) {
      setError(prev => {return{...prev, name: 'До 13 символов!'}})
    } else if (form.name.length >= 2 && reName.test(form.name)) {
      setError(prev => {return{...prev, name: ''}})
    } else if (form.name.length === 0) {
      setError(prev => {return{...prev, name: null}})
    } else if (!reName.test(form.name)) {
      setError(prev => {return{...prev, name: 'Только буквы'}})
    } else {
      setError(prev => {return{...prev, name: 'Имя должно содержать не менее двух букв'}})
    }
  }, [form])

  useEffect(() => {
    setIsValid(error.email === '' && error.password === '' && 
    error.name === '' && error.passwordConfirmation === '')
  }, [error])
  
  useFocusEffect(
    React.useCallback(() => {
    if (route.params?.fromScreen? true : false){
      setGoBackProps({stack: true, hasParams: true, isGoBack: false})
      setScreenParams({toScreen: route.params.fromScreen, screenParams: route.params.screenParam })
    }
    else {
      setGoBackProps(prev => {return{stack: prev.stack, hasParams: prev.hasParams, isGoBack: true}})
    }
    setGoBackVisible(true)
    return () => {
      setGoBackVisible(false)
    }
  }, [])
  )

  const _onPress = async () => {
    setLoad(true)
    const { email, password, name } = form
    setError(initError)
    try {
      const user = await Auth.signUp({username: email, password: password,
        attributes: {
          name: name
        } 
      })
      await Keychain.setInternetCredentials('authKeys', email, password)
      user && navigation.navigate('ConfirmSignUp', {email, password} )
      setForm(initForm)
      setLoad(false)
    } 
    catch (err) {
      setLoad(false)
      setError(prev => {return{...prev, server: 
        err.code === 'UserNotConfirmedException' ? 
        'Аккаунт еще не подтвержден' : err.code === 'UsernameExistsException' ? 
        'Пользователь с данной почтой уже существует' : 'Неизвестная ошибка'}})
    }
    
  }

    return ( <>
      <BgSvg />
      <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView style={container}>
        <Text style={title}>Регистрация</Text>
          <CustomInput 
            value={form.name}
            placeholder="Ваше имя(до 13 символов)"
            error={error.name}
            password={false}
            isCorrect={error.name === ''}
            onChange={(txt) => setForm(prev => 
            {return{...prev, name: txt.trim()}})} />

          <CustomInput 
            value={form.email}
            placeholder="E-mail"
            error={error.email}
            password={false}
            isCorrect={error.email === ''}
            onChange={(txt) => setForm(prev => 
            {return{...prev, email: txt.trim()}})} />
            
          <CustomInput 
            value={form.password}
            placeholder="Пароль"
            error={error.password}
            password={true}
            isCorrect={error.password === ''}
            onChange={(txt) => setForm(prev => 
            {return{...prev, password: txt}})} />

          <CustomInput 
            value={form.passwordConfirmation}
            placeholder="Подтвердите пароль"
            error={error.passwordConfirmation}
            password={true}
            isCorrect={error.passwordConfirmation === ''}
            onChange={(txt) => setForm(prev => 
            {return{...prev, passwordConfirmation: txt}})} />
          
            <View style={{ alignItems: 'center' }}>
                { load ? <Flow size={70} color='red'></Flow> :
                (isValid) ?
                <TouchableOpacity style={subBut} onPress={() => _onPress()}>
                    <Text style={ subButText }>Зарегистрироваться</Text>
                </TouchableOpacity> 
                :
                <View style={[subBut, { opacity: 0.6 }]}>
                    <Text style={ subButText }>Зарегистрироваться</Text>
                </View>
                }
            </View>
            {error.server !== null && 
            <View style={errorBox}>
               <Icon style={{ marginRight: 5 }} name="warning" size={25} color="red" />
               <Text style={errorMes}>{error.server}</Text>
            </View>}
        <View style={{height: 20}}></View>
       </ScrollView>  
       </KeyboardAvoidingView>
       </>
  )
}
export default SignUp
