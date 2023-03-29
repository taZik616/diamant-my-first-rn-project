import React, { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import authStyles from './authStyles'
import { View, TouchableOpacity, Text, BackHandler, KeyboardAvoidingView, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { DataStore } from '@aws-amplify/datastore'
import { Cart } from '../../src/models'
import { useFocusEffect } from '@react-navigation/native'
import { Flow } from 'react-native-animated-spinkit'
import { CustomInput } from './CustomInput'
import { BgSvg } from './BgSvg'

const ConfirmSignUp = ({ route, navigation }) => {

  const { container, errorMes, errorBox, subBut, subButText, title } = authStyles
  const initError = {server: null, code: null}
  const [error, setError] = useState(initError)
  const [load, setLoad] = useState(false)
  const [code, setCode] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    setIsValid(error.code === '')
  }, [error])

  useEffect(() => {
    let reCode = /^[0-9]+$/
    if (code.length >= 6 && reCode.test(code)) {
      setError(prev => {return{...prev, code: ''}})
    } else if (code.length === 0) {
      setError(prev => {return{...prev, code: null}})
    } else if (!reCode.test(code)) {
      setError(prev => {return{...prev, code: 'Только цифры'}})
    } else {
      setError(prev => {return{...prev, code: 'Код должен быть длиною не менее 6 цифр'}})
    }
  }, [code])

  const back = () => {return true}
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', back)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', back)
      }
    }, [])
  )

  const _onPress = async () => {
    setLoad(true)
    setError(initError)
    try {
      const { email, password } = route.params
      await Auth.confirmSignUp(email, code, { forceAliasCreation: true })
      const user = await Auth.signIn(email, password)
      await DataStore.save(new Cart({owner: Auth.user.attributes.sub,
        username: email, productsId: []}))
      user && navigation.navigate('MainDrawer', {
        initial: false, screen: 'Home'})
      setCode('')
      setLoad(false)
    }
    catch (err) {
      setCode('')
      setError(prev => {return{...prev, server: 'Неправильный код'}})
      setLoad(false)
    }
  }

  const _onResend = async () => {
    try {
      const { email } = route.params
      await Auth.resendSignUp(email)
    } catch (err) {
      setError('')
    }
  }

  return (<>
    <BgSvg />
    <KeyboardAvoidingView style={{flex: 1}}>
      <View style={[container, {justifyContent: 'center'}]}>
        <Text style={title}>Подтвердите почту</Text>
        {!isValid &&
        <TouchableOpacity style={{flexDirection: 'row'}}
        onPress={_onResend} activeOpacity={0.6}>
          <Text style={{ color: '#10196e', marginTop: 8,
          marginBottom: 2, marginLeft: 35 }}>Повторить отправку?</Text>
        </TouchableOpacity>}
        <CustomInput 
          value={code}
          placeholder="Введите ваш код"
          error={error.code}
          password={false}
          isCorrect={error.code === ''}
          onChange={(txt) => setCode(txt.trim())} />

          <View style={{ alignItems: 'center' }}>
            { load ? <Flow style={{marginTop: 10}} size={70} color='red'></Flow> :
              isValid ?
              <TouchableOpacity style={subBut} onPress={() => _onPress()}>
                <Text style={ subButText }>Подтвердить</Text>
              </TouchableOpacity> 
              :
              <View style={[subBut, { opacity: 0.6 }]}>
                <Text style={ subButText }>Подтвердить</Text>
              </View>
            }
          </View>
          {error.server !== null && 
          <View style={errorBox}>
               <Icon style={{ marginRight: 5 }} name="warning" size={25} color="red" />
               <Text style={errorMes}>{error.server}</Text>
           </View>}
        <View style={{height: 20}}></View>
      </View>
    </KeyboardAvoidingView>
    </>
  )
}

export default ConfirmSignUp