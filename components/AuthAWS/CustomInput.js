import React, { useState, useEffect } from "react"
import { TextInput, View, Text } from "react-native"
import authStyles from './authStyles'

export const CustomInput = (props) => {
  const [isFocus, setIsFocus] = useState(false) 
  const [color, setColor] = useState('#7e7e7e') 
  const {onChange, placeholder, isCorrect, value, error, password} = props
  
  useEffect(() => {
    if (isFocus || value.length >0) {
      if (isFocus) {
        setColor('#2BF510')
      } else if (isCorrect) {
        setColor('#2BF510')
      } else {
        setColor('#F52A10')
      }
    } else {
      setColor('#7e7e7e')
    }
  }, [isCorrect, isFocus])
  return <View>
  <TextInput
    style={[authStyles.input, {borderColor: color, shadowColor: color} ]}
    value={value}
    onFocus={() => setIsFocus(true)}
    secureTextEntry={password}
    onBlur={() => setIsFocus(false)}
    onChangeText={onChange}
    placeholder={placeholder}
    autoCapitalize="none"
    underlineColorAndroid='transparent'
  />
  <Text style={authStyles.errorMes}>{!isFocus ?error:''}</Text>
  </View>
}