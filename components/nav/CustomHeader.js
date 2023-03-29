import React, { useCallback, useContext, useRef, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TextInput
} from 'react-native'
import {DrawerActions} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Context} from './context'

const screensHasBack = ['CRUDproduct', 'ProductDetail', 'HelpfulInfoAdd', 'DetailPost',
 'SignUp', 'SignIn', 'Forgot']
const screensHasSearch = ['Home', 'CartProd', 'Products', 'About']
const winWidth = Dimensions.get('window').width
function CustomHeader(props) {
  const {goBackVisible, goBackBut, setSearchText, searchText} = useContext(Context)
  const inputRef = useRef()
  const [isFocus, setIsFocus] = useState(false)
  const toggleDrawer = () =>
    props.navigation.dispatch(DrawerActions.toggleDrawer())

  const handleSubmit = () => {
    if (props.route?.params?.screen !== 'Products') {
      props.navigation.navigate('MainDrawer', {
        screen: 'Products', initial: false, params: {
          search: true, searchText: searchText,
        } 
      })
    }
    else {
      props.navigation.setParams({
        params: {
          search: true, searchText: searchText,
        }
      })
    }
  }
  return (
    <>
    <View style={styles.container}>
    {!(props.route.name != null && screensHasBack.includes(props.route.name)) ?
      <View style={[styles.parts, {flexDirection: 'row', justifyContent: 'flex-start'}]}>
        <TouchableOpacity onPress={() => toggleDrawer()}
        style={{paddingLeft: 20}}>
          <Icon size={36} color='#323332' name='bars' />
        </TouchableOpacity>
      </View> 
      :
      <View style={[styles.parts, { flexDirection: 'row', justifyContent: 'flex-start'}]}>
        <TouchableOpacity
          style={{paddingLeft: 15}}
          onPress={() => goBackBut(props.navigation)} >
          <Icon size={40} color='#323332' name='long-arrow-left' />
        </TouchableOpacity>
      </View>}
      {!screensHasSearch.includes(props.route?.params?.screen) ?
      <>
      <View style={[styles.parts, {flex: 1.3, backgroundColor: '#d9d9d9', alignItems: 'center', borderRadius: 10}]}>
        <Text style={{fontSize: 18, fontWeight: '100', color: '#573f44'}}>ДИАМАНТ</Text>
      </View>
      <View style={styles.parts}></View></>
      :
      <View style={{width: winWidth - 100, marginRight: 20, marginVertical: 2}}>
        <TextInput 
        ref={inputRef}
        style={{flex: 1, backgroundColor: '#f2f2f2', padding: 5, paddingLeft: 10,
        borderRadius: 8, borderWidth: 1, borderColor: isFocus  ? '#ff9999' : '#808080', fontSize: 17, paddingRight: 40}} 
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onSubmitEditing={() => {handleSubmit()}}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        placeholder='Поиск товара' />
        <TouchableOpacity onPress={() => {inputRef.current.blur()
          handleSubmit()}} 
        style={{position: 'absolute', right: 0,
        height: '100%', justifyContent: 'center', marginRight: 8, translateY: -1}}>
          <Icon name='search' size={25} color={searchText.length > 0 ? 'red' : '#808080'} />
        </TouchableOpacity>
      </View>}
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 45, 
    backgroundColor: '#e1e1e1', 
    height: 90, 
    flexDirection: 'row', 
    paddingBottom: 5
  },
  parts: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default CustomHeader;
/*<SafeAreaView>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={useCallback(debounce(toggleDrawer, 100), [])}
          style={styles.leftBtn}>
          <Text style={styles.buttonTxt}>МЕНЮ</Text>
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTxt}>ДИАМАНТ</Text>
        </View>
        {goBackVisible &&
        <TouchableOpacity
            onPress={() => goBackProd(props.navigation)}
            style={styles.rightBtn}>
            <Icon size={30} color='#323332' name='long-arrow-left' />
        </TouchableOpacity>}
      </View>
    </SafeAreaView>*/