import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import Video from 'react-native-video'
import * as Keychain from 'react-native-keychain'
import { Auth } from 'aws-amplify'
import { useFocusEffect } from '@react-navigation/native'

function Splash({ navigation }) {
  const [finished, setFinished] = useState(false)
  const [visibility, setVisibility] = useState(false)
  useEffect(async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('authKeys')
      const { username, password } = credentials
      if (credentials) {
        await Auth.signIn(username, password)
      } 
    }
     catch (err) {
       if (err === '[UserNotConfirmedException: User is not confirmed.]'){
         console.log('err', err)
       } else {
         console.log('error', err)
       }
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
    setFinished(false)
    setVisibility(false)
    return () => {
      setFinished(true)
    }
    }, [])
  )

  return (
    <View style={styles.container}>
      <Video source={require('./assets/zastavkaDiamant.webm')} 
        style={{ height: '100%', width: '100%' }}
        resizeMode="stretch"
        onEnd={() => {!finished &&
          navigation.navigate('MainDrawer',
          {initial: false, screen: 'Home'})
        }}
        onReadyForDisplay={() => {
          setVisibility(true)
        }}
      />
      {visibility &&
      <TouchableOpacity style={{ position: 'absolute', bottom: 20,
       left: 30, padding: 7, borderRadius: 7, backgroundColor: '#55cedc', opacity: 0.5,
        flexDirection: 'row', alignItems: 'center'}}
       onPress={() => {
         navigation.navigate('MainDrawer',
         {initial: false, screen: 'Home'})
         }
        }
       >
        <Text style={{ opacity: 0.7, marginRight:7 }}>
            Пропустить
        </Text>
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export { Splash }