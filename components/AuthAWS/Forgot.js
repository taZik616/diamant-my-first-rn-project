import React, { useState, useContext, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import authStyles from './authStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Keychain from 'react-native-keychain'
import { useFocusEffect } from '@react-navigation/native'
import { Context } from '../nav/context'
import { Flow } from 'react-native-animated-spinkit'
import { CustomInput } from './CustomInput'
import { BgSvg } from './BgSvg'

const Forgot = ({ route, navigation }) => {
  const initForm = {code: '', password: '', passwordConfirmation: ''}
  const [form, setForm] = useState(initForm)
  const [isValid, setIsValid] = useState(false)
  const initError = {code: null, password: null, passwordConfirmation: null, server: null}
  const [error, setError] = useState(initError)

  const { container, input, errorMes, errorBox, subBut, subButText, title } = authStyles
  const {setGoBackVisible, setGoBackProps} = useContext(Context)
  const [load, setLoad] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
    setGoBackProps(prev => {return{stack: prev.stack, hasParams: prev.hasParams, isGoBack: true}})
    setGoBackVisible(true)
    return () => {
      setGoBackVisible(false)
    }
  }, [route.params])
  )

  useEffect(() => {
    setIsValid(error.code === '' && error.password === '' && 
    error.passwordConfirmation === '')
  }, [error])

  useEffect(() => {
    let reCode = /^[0-9]+$/
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
    if (form.code.length >= 6 && reCode.test(form.code)) {
      setError(prev => {return{...prev, code: ''}})
    } else if (form.code.length === 0) {
      setError(prev => {return{...prev, code: null}})
    } else if (!reCode.test(form.code)) {
      setError(prev => {return{...prev, code: 'Только цифры'}})
    } else {
      setError(prev => {return{...prev, code: 'Код должен быть длиною не менее 6 цифр'}})
    }
  }, [form])

  const _onPress = async () => {
    setError(initError)
    setLoad(true)
    try {
      const { code, password } = form
      const {email} = route.params
      await Auth.forgotPasswordSubmit(email, code, password)
      await Keychain.setInternetCredentials('authKeys', email, password)
      navigation.navigate('MainDrawer', {
        initial: false, screen: 'Home'})
      setForm(initForm)
      setLoad(false)
    } catch (err) {
      console.log(err.code)
      setError(prev => {return{ ...prev, server: err.code === 
      'CodeMismatchException' ? 'Предоставлен неверный код подтверждения, \
      попробуйте еще раз.' : 
      err.code === 'LimitExceededException' ? 
      'Превышен лимит, попробуйте через некоторое время.' : 'Неизвестная ошибка'}})
      setLoad(false)
    }
  }

  return (<>
    <BgSvg />
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView style={container}>
        <Text style={title}>Восстановление пароля</Text>
        <CustomInput 
          value={form.code}
          placeholder="Код"
          error={error.code}
          password={false}
          isCorrect={error.code === ''}
          onChange={(txt) => setForm(prev => 
          {return{...prev, code: txt.trim()}})} />
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
          { load ? <Flow style={{marginTop: 10}} size={70} color='red'></Flow> :
          isValid ?
          <TouchableOpacity style={subBut} onPress={_onPress} formik >
            <Text style={ subButText }>Сменить пароль</Text>
          </TouchableOpacity> 
          :
          <View style={[subBut, { opacity: 0.6 }]}>
            <Text style={ subButText }>Сменить пароль</Text>
          </View>
          }
        </View>
        {error.server !== null &&
          <View style={errorBox}>
            <Icon style={{ marginRight: 5, marginTop: 5 }} name="warning" size={25} color="red" />
            <Text style={errorMes}>{error.server}</Text>
          </View>
        }
        <View style={{height: 20}}></View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  )
}
export default Forgot 
