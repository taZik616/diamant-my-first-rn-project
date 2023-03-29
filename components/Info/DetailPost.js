import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, Platform, View, ScrollView,
   KeyboardAvoidingView, Image, TouchableOpacity, Alert, TextInput } from 'react-native'
import { Linking } from 'react-native'
import { MarkdownView } from 'react-native-markdown-view'
import { DataStore } from '@aws-amplify/datastore'
import { Post } from '../../src/models'
import { Storage } from 'aws-amplify'
import { Context } from '../nav/context'
import { useFocusEffect } from '@react-navigation/native'

function DetailPost({ route, navigation }) {
  const [textEdit, setTextEdit] = useState(route.params.item.text)
  const { setGoBackVisible, setGoBackProps } = useContext(Context)
  useEffect(() => {
    setTextEdit(route.params.item.text)
  }, [route.params])
  useFocusEffect(React.useCallback(() => {
    setGoBackVisible(true)
    setGoBackProps(prev => {return{stack: prev.stack, hasParams: prev.hasParams, isGoBack: true}})
    return () => {
      setGoBackVisible(false)
    }
  }, []))

  const delPost = async() => {
    Alert.alert('Подтвердите', 'Вы точно хотите удалить этот пост?',
    [{text: 'Да', onPress: async () => {
    try {
      const delItem = await DataStore.query(Post, route.params.item.id)
      await DataStore.delete(delItem)
      await Storage.remove(delItem.image)
      navigation.navigate('MainDrawer', {
        screen: 'HelpfulInfo', initial: false })
    } catch (err) {
        console.log(err)
    }
    }},
    {text: 'Отмена'} ])
  }
  const updatePost = async() => {
    try {
      const updateItem = await DataStore.query(Post, route.params.item.id)
      await DataStore.save(
        Post.copyOf(updateItem, updated => {
          updated.text = textEdit
        })
      )
      navigation.navigate('MainDrawer', {
        screen: 'HelpfulInfo', initial: false })
    } catch (err) {
        console.log(err)
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
    <ScrollView style={styles.container}>
        {route.params.admin &&
         <View style={{ flexDirection: 'row-reverse' }}>
            <TouchableOpacity style={styles.delBut} onPress={() => delPost()}>
                <Text style={{color: 'red', fontSize: 17}}>Удалить</Text>
            </TouchableOpacity>
        </View>}
        <Text style={styles.titleS}>{route.params.item.title}</Text>
        <Image resizeMode='cover' style={styles.imageS} source={{uri: route.params.image}}/>
        <MarkdownView onLinkPress={(url) => {
        Linking.openURL(url).catch(error =>
          console.warn('An error occurred: ', error),
        )}}>{textEdit}</MarkdownView>
        {route.params.admin && 
        <View>
          <Text style={styles.titleS}>Редактор</Text>
          <TextInput style={styles.inputEl}
          multiline
          value={ textEdit }
          onChange={text => setTextEdit(text.nativeEvent.text)} />
          <View style={{ flexDirection: 'row-reverse' }}>
            <TouchableOpacity style={[styles.delBut, { marginTop: 8,
              borderColor: '#37e5fa'}]} onPress={() => updatePost()}>
                <Text style={{color: '#37e5fa', fontSize: 17}}>Обновить</Text>
            </TouchableOpacity>
          </View>
         </View>
        }
        <View style={{ height: 70 }}></View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    titleS: {
      textAlign: 'center',
      color: '#1b1b1b',
      fontWeight: 'bold', 
      fontSize: 24,
      marginBottom: 5,
    },
    imageS: {
      width: '95%',
      height: 210,
      alignSelf: 'center',
      borderRadius: 10,
      marginTop: 10,
    },
    delBut: {
      borderRadius: 5,
      borderColor: 'red',
      borderWidth: 4,
      padding:5
    },
    inputEl: {
      borderColor: '#5b9da5',
      backgroundColor: '#fbfbfb',
      borderRadius: 6,
      borderWidth: 2,
      padding: 5,
      paddingLeft: 10,
      height: 200,
    },
  })

export { DetailPost }
