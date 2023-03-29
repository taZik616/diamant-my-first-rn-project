import React, { useState, useContext } from 'react'
import { View, Text, Image, TouchableOpacity, Modal, TextInput, 
  StyleSheet, ScrollView, Pressable, Keyboard } from 'react-native'
import { MarkdownEditor } from 'react-native-markdown-editor'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary} from 'react-native-image-picker'
import { DataStore } from '@aws-amplify/datastore'
import { Storage } from 'aws-amplify'
import { Post } from '../../src/models'
import { nanoid } from 'nanoid/non-secure'
import { Context } from '../nav/context'
import { useFocusEffect } from '@react-navigation/native'

const HelpfulInfoAdd = () => {
  const [post, setPost] = useState({title: '', 
  description: '', image: '', text: '' })
  const [visible, setVisible] = useState(false)
  const { setGoBackVisible, setGoBackProps } = useContext(Context)
  const [keyboardStatus, setKeyboardStatus] = useState(false)

  useFocusEffect(React.useCallback(() => {
    setGoBackVisible(true)
    setGoBackProps(prev => {return{stack: prev.stack, hasParams: prev.hasParams, isGoBack: true}})
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true)
    })
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false)
    })
    return () => {
      setGoBackVisible(false)
      showSubscription.remove();
      hideSubscription.remove();
    }
  }, []))

  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo'
    })
    if (!result.didCancel) {
      setPost((prevState) => ({...prevState, image: result.assets[0].uri}))
    }
  }

  const handleVisible = () => {
    setVisible(!visible)
  }
  const handleSubmit = async () => {
    try {
      const { title, image, text, description } = post
      const img = await (await fetch(image)).blob()
      const url = `images/${nanoid()}${image.split('/').reverse()[0]}`
      await DataStore.save(new Post({image: url,
         description: description,text: text, title: title}))
      await Storage.put(url, img, { contentType: 'image'})
    } catch(err) {
      console.log(err)
    }
    setPost({title: '', description: '', image: '', text: ''})
  }
  
  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <Modal animationType="slide" transparent={true}
      visible={visible} 
      >
        <Pressable onPress={() => setVisible(false)} style={styles.modalBack}>
          <View style={styles.modalWin}>
              <View style={styles.modalClose}>
                <TouchableOpacity onPress={() => handleVisible()}>
                  <Icon name="window-close-o" style={{ margin: 8 }} size={30} color="red" />
                </TouchableOpacity>
              </View>
             <ScrollView style={{ padding: 10 }}>
               <Text style={{marginLeft: 5, fontSize: 18, textAlign: 'center' }}>
                 Еще 1 шаг!
               </Text>
              <TextInput style={styles.modalInput}
                value={post.title}
                placeholder='Заголовок поста'
                onChangeText={title => setPost(prevState => ({...prevState, title: title}) )}
              />
              <TextInput style={styles.modalInput}
                value={post.description}
                multiline
                placeholder='Описание статьи или текст начала(желательно до 80 символов)'
                onChangeText={description => setPost(prevState => ({...prevState, description: description}) )}
              />
              <TouchableOpacity style={styles.modalSubmit} onPress={() => pickImage()}>
                <Text style={{ color: 'white', fontWeight: 'bold',
                 fontSize: 16, textAlign: 'center' }}>{post.image != '' ? 'Изменить' : 'Добавить'} картинку</Text>
              </TouchableOpacity>
              {post.image != '' && <Image source={{ uri: post.image }} style={{ width: 150, height: 100, marginBottom: 18, alignSelf: 'center' }} />}
              <TouchableOpacity style={styles.modalSubmit} onPress={() => handleSubmit()}>
                <Text style={{ color: 'white', fontWeight: 'bold',
                fontSize: 16, textAlign: 'center' }}>Выложить</Text>
              </TouchableOpacity>
             </ScrollView>
          </View>
        </Pressable>
      </Modal>
      <TouchableOpacity style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
         onPress={() => handleVisible()}>
        <Text style={{ fontSize: 16 }}>Закончите заполнение</Text>
        <Icon style={{ marginRight: 5 }} name="check-circle-o" size={30} color="red" />
      </TouchableOpacity>
      <View style={{paddingBottom: keyboardStatus ? 0 : 15, flex: 1}}>
      <MarkdownEditor
      onMarkdownChange={someText => 
        setPost((prevState) => ({...prevState, text: someText}))}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalBack: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5e5e5e58'
  },
  modalWin: {
    width: '80%',
    height: 340,
    backgroundColor: '#94d4dc',
    borderRadius: 10
  },
  modalClose: {
    width: '100%',
    borderBottomColor: '#199ed5', borderBottomWidth: 1,
    borderTopEndRadius: 10, borderTopStartRadius: 10,
    backgroundColor: '#c8f3f8', flexDirection: 'column',
    alignItems: 'flex-end', 
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#7e7e7e',
    borderRadius: 7,
    padding: 7,
    fontSize: 16,
    marginVertical: 20,
    backgroundColor: '#f0f0f0'
  },
  modalSubmit: {
    backgroundColor: '#24d22c',
    padding: 10,
    borderRadius: 20,
    marginBottom: 18,
  }
})

export { HelpfulInfoAdd }