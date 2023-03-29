import React from 'react'
import { Flow } from 'react-native-animated-spinkit'
import { View } from 'react-native'

const Loader = () => {
  return (
    <View style={{ justifyContent: 'center', marginVertical: 8 }}>
      <Flow style={{alignSelf: 'center'}} size={120} color='#fa233c' />
    </View>
  )
}
export {Loader}