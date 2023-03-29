import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {drawerItemsMain} from './drawerItemsMain'

import { About, Contacts, HelpfulInfo, PayAndDelivery, Services, HelpfulInfoAdd, DetailPost } from '../Info'
import { Main } from '../Main'
import { Products, CRUDproduct, ProductDetail, CartProd } from '../catalog'
import { Splash } from '../../Splash'
import CustomDrawerContent from './CustomDrawerContent'
import CustomHeader from './CustomHeader'

import SignIn from '../AuthAWS/SignIn'
import SignUp from '../AuthAWS/SignUp'
import ConfirmSignUp from '../AuthAWS/ConfirmSignUp'
import Forgot from '../AuthAWS/Forgot'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function MainDrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => (
        <CustomDrawerContent drawerItems={drawerItemsMain} {...props} />
      )}
      screenOptions={{headerShown: false, swipeEdgeWidth: 10}}>
      <Drawer.Screen name="Home" component={Main}/>
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Services" component={Services} />
      <Drawer.Screen name="HelpfulInfo" component={HelpfulInfo} />
      <Drawer.Screen name="PayAndDelivery" component={PayAndDelivery} />
      <Drawer.Screen name="Contacts" component={Contacts} />
        
      <Drawer.Screen name="Products" component={Products} />
      <Drawer.Screen name="CartProd" component={CartProd} />
    </Drawer.Navigator>
  );
}

function Navigate () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerMode: 'screen',
          headerTintColor: '#404554',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          header: (props) => {
            return <CustomHeader {...props} />;
          },
        }}>
        <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}}/>
        <Stack.Screen name="MainDrawer" component={MainDrawerNavigation}/>

        <Stack.Screen name="CRUDproduct" component={CRUDproduct} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="HelpfulInfoAdd" component={HelpfulInfoAdd} />
        <Stack.Screen name="DetailPost" component={DetailPost}/>
        
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUp} options={{headerShown: false}} />
        <Stack.Screen name="Forgot" component={Forgot}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigate