import { registerRootComponent } from 'expo'
import Amplify from '@aws-amplify/core'
import awsconfig from './src/aws-exports'
import { AuthModeStrategyType } from 'aws-amplify'
import 'react-native-gesture-handler'
import { LogBox } from 'react-native'

LogBox.ignoreLogs(['Setting a timer', 'DataStore - queryError',
 'DataStore - subscriptionError', 'Failed prop type', ' DataStore - User is unauthorized\
  to query syncCarts with auth mode AMAZON_COGNITO_USER_POOLS.', '[react-native-gesture-handler]'])

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: false
  },
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH
  }
})

import App from './App'
registerRootComponent(App)
