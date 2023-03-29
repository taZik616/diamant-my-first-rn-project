import { StatusBar } from 'expo-status-bar'
import Navigate from './components/nav/Navigate'
import React, { useState, useEffect} from 'react'
import { Hub, Auth, DataStore } from 'aws-amplify'
import { Context } from './components/nav/context'

export default function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [goBackVisible, setGoBackVisible] = useState(false)
  const [goBackProps, setGoBackProps] = useState({stack: true, hasParams: true, isGoBack: true})
  const [screenParams, setScreenParams] = useState({toScreen: '', screenParams: {} })

  const goBackBut = (navigation) => {
    setGoBackVisible(false)
    if (goBackProps.isGoBack) {
      navigation.goBack()
      return null
    }
    if (!goBackProps.stack) {
      navigation.navigate('MainDrawer', goBackProps.hasParams ? 
      {
        screen: screenParams.toScreen, initial: false, 
        params: screenParams.screenParams
      } : {screen: screenParams.toScreen, initial: false})
    }
    else {
      navigation.navigate( screenParams.toScreen, goBackProps.hasParams && screenParams.screenParams )
    }
  }

  useEffect(() => {
    DataStore.clear()
    Hub.listen('auth', (data) => {switch (data.payload.event){
      case 'signOut': 
        setIsAuth(false)
        DataStore.clear()
        break
      case 'signIn': 
        setIsAuth(true)
        setIsAdmin(Auth.user.signInUserSession.accessToken.payload["cognito:groups"] != null
        && Auth.user.signInUserSession.accessToken.payload["cognito:groups"].filter(groupItem => groupItem === 'Admins')[0] ? true : false)
        break
     }
    })
  }, [])
  return (
    <>
      <StatusBar style="auto" />
      <Context.Provider value={{
        goBackVisible, setGoBackVisible, goBackBut, setGoBackProps, isAuth, isAdmin,
        setScreenParams, setSearchText, searchText
      }}>
        <Navigate />
      </Context.Provider>
    </>
  )
}

