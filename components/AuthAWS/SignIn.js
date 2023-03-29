import React, { useState, useContext, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { View, TextInput, Text, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView } from 'react-native'
import authStyles from './authStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Keychain from 'react-native-keychain'
import { useFocusEffect } from '@react-navigation/native'
import { Context } from '../nav/context'
import { Flow } from 'react-native-animated-spinkit'
import { CustomInput } from './CustomInput'
import { BgSvg } from './BgSvg'

const SignIn = ({ navigation }) => {
  const { container, errorMes, errorBox, subBut, subButText, title } = authStyles
  const initError = {email: null, password: null, server: null}
  const [error, setError] = useState(initError)
  const [load, setLoad] = useState(false)
  const initForm = {email: '', password: ''}
  const [form, setForm] = useState(initForm)
  const [isValid, setIsValid] = useState(false)
  const {setGoBackVisible, setGoBackProps} = useContext(Context)

  useEffect(() => {
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    let testEmail = form.email
    testEmail = testEmail.toLowerCase()
    if (form.email.length>=5 && re.test(testEmail)) {
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
  }, [form])

  useEffect(() => {
    setIsValid(error.email === '' && error.password === '')
  }, [error])

  const _onSubmit = async () => {
    setError(initError)
    try {
      setLoad(true)
      const { email, password } = form
      const user = await Auth.signIn(email, password)
      await Keychain.setInternetCredentials('authKeys', email, password)
      setGoBackVisible(false)
      user && navigation.navigate('MainDrawer', {
        initial: false, screen: 'Home'})
      setForm(initForm)
      setLoad(false)
    }
    catch (err) {
      setLoad(false)
      setError(prev => {return{...prev, server: 
        err.code === 'UserNotConfirmedException' ? 
        'Аккаунт еще не подтвержден' : err.code === 'NotAuthorizedException' ? 
        'Forgot Password?' : err.message === 'CodeDeliveryFailureException' ?
        'Ошибка отправки кода на почту' : err.code === 'UserNotFoundException' ? 
        'Такого пользователя не существует' : 'Неизвестная ошибка'}})
    }
  }

  useFocusEffect(
    React.useCallback(() => {
    setGoBackProps(prev => {return{stack: prev.stack, hasParams: prev.hasParams, isGoBack: true}})
    setGoBackVisible(true)
    return () => {
    }
  }, [])
  )

  return (<>
    <BgSvg />
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView style={container}>
        <Text style={title}>Вход</Text>
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
          password={true}
          error={error.password}
          isCorrect={error.password === ''}
          onChange={(txt) => setForm(prev => 
           {return{...prev, password: txt}})} />

          {error.server === 'Forgot Password?' && (
            <TouchableOpacity onPress={async () => {
              try{
               setError('')
               const { email } = form
               await Auth.forgotPassword(email)
               setGoBackVisible(false)
               navigation.navigate('Forgot', { email })
               setForm(initForm)
              } catch (err) {
                setError(prev => {return {...prev, server: err}})
              }
              }}
                activeOpacity={0.6}>
              <Text style={{ color: '#10196e', marginLeft: 30 }}>Забыли пароль?</Text>
            </TouchableOpacity>
          )}
          
          <View style={{ alignItems: 'center' }}>
            { load ? <Flow size={70} color='red'></Flow> :
            isValid ?
            <TouchableOpacity style={subBut} onPress={() => _onSubmit()} >
                <Text style={ subButText }>Войти</Text>
            </TouchableOpacity> 
            :
            <View style={[subBut, { opacity: 0.6 }]}>
                <Text style={ subButText }>Войти</Text>
            </View>
            }
          </View>
          {(error.server !== null) && (error.server !== 'Forgot Password?') &&
            <View style={errorBox}>
               <Icon style={{ marginRight: 5 }} name="warning" size={25} color="red" />
               <Text style={errorMes}>{error.server}</Text>
            </View>
          }
        <View style={{height: 20}}></View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  )
}

export default SignIn