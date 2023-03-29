import React, {useState, useContext} from 'react'
import {
  StyleSheet, ScrollView, View,
  Text, TouchableOpacity, SafeAreaView,
  Image, 
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { Auth } from 'aws-amplify'
import * as Keychain from 'react-native-keychain'
import { Context } from './context'

function CustomDrawerContent(props) {
  const [mainDrawer, setMainDrawer] = useState(true)
  const [filteredItems, setFilteredItems] = useState([])
  const {isAuth} = useContext(Context)

  const toggleMainDrawer = () => {
    setMainDrawer(true);
    setFilteredItems([]);
  };

  const onItemParentPress = (key) => {
    const filteredMainDrawerRoutes = props.drawerItems.find((e) => {
      return e.key === key;
    });
    if (filteredMainDrawerRoutes.routes.length === 1) {
      const selectedRoute = filteredMainDrawerRoutes.routes[0];
      props.navigation.toggleDrawer();
      props.navigation.navigate(selectedRoute.nav, {
        screen: selectedRoute.routeName,
        params: {subCategory: selectedRoute.subCategory, category: selectedRoute.category}
      });
    } else {
      setMainDrawer(false);
      setFilteredItems(filteredMainDrawerRoutes);
    }
  };

  function renderMainDrawer() {
    return (
      <View>
        {props.drawerItems.map((parent) => (
          <View key={parent.key}>
            <TouchableOpacity
              key={parent.key}
              testID={parent.key}
              onPress={() => {
                onItemParentPress(parent.key);
              }}>
              <View style={styles.parentItem}>
                <Text style={[styles.icon, styles.title]}>{parent.title}</Text>
                { parent.icon == 'watch' ? 
                <Icons style={{position: 'absolute', right: 40,}}
                 name={parent.icon} size={25} color="#ff3636" /> 
                 : parent.icon != '' &&
                <Icon style={{position: 'absolute', right: 40,}} name={parent.icon} size={25} color="#ff3636" />}
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {renderLogoutBtn()}
      </View>
    );
  }

  function renderFilteredItemsDrawer() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => toggleMainDrawer()}
          style={styles.backButtonRow}>
          <Text style={[styles.backButtonText, styles.title]}>{'НАЗАД'}</Text>
        </TouchableOpacity>
        {filteredItems.routes.map((route) => {
          return (
            <TouchableOpacity
              key={route.subCategory}
              onPress={() =>
                props.navigation.navigate(route.nav, {
                  screen: route.routeName,
                  params: { subCategory: route.subCategory, category: route.category}
                })
              }
              style={styles.item}>
              <Text style={styles.title}>{route.subCategory}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function renderLogoutBtn() {
    return (
       !isAuth ? 
        <View>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignIn')} testID="customDrawer-logout">
            <View style={styles.parentItem}>
              <Text style={styles.title}>Войти</Text>
              <Icon style={{position: 'absolute', right: 40,}} name="sign-in" size={25} color="#900" />
            </View> 
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
            <View style={styles.parentItem}>
              <Text style={styles.title}>Зарегистрироваться </Text>
              <Icon style={{position: 'absolute', right: 40,}} name="plus-square-o" size={25} color="#900" />
            </View>
          </TouchableOpacity>
        </View>
        :
        <View>
          <TouchableOpacity onPress={async () => {
            try {
              Keychain.resetInternetCredentials('authKeys')
              await Auth.signOut()
              props.navigation.navigate('MainDrawer', {
                initial: false, screen: 'Home'})
            } catch (error) {
              console.log('error signing out: ', error);
            }}}>
            <View style={styles.parentItem}>
              <Text style={styles.title}>Выйти</Text>
              <Icon style={{position: 'absolute', right: 40,}} name="sign-out" size={25} color="#900" />
            </View>
          </TouchableOpacity>
        </View>
      
    );
  }

  return (
    <ScrollView style={styles.drawerContainer}>
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.centered}>
          <Image
            source={require('../../assets/Logo.png')}
            style={styles.logo}
          />
        </View>
        {mainDrawer ? renderMainDrawer() : renderFilteredItemsDrawer()}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    height: 100,
    flexDirection: 'row',
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '90%',
    height: 80
  },
  drawerContainer: {
    paddingTop: 20,
    backgroundColor: '#f6f6f6',
  },
  container: {
    flex: 1,
    zIndex: 100,
    paddingBottom: 70
  },
  centered: {
    alignItems: 'center',
  },
  parentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    margin: 16,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    paddingLeft: 10,
    borderBottomColor: '#111111',
    borderBottomWidth: 1,
  },
  backButtonText: {
    marginLeft: 10,
    color: '#111111',
  },
});

export default CustomDrawerContent;