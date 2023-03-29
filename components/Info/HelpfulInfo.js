import React, {useEffect, useState, useRef, useContext} from 'react'
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Image, ScrollView } from 'react-native'
import { DataStore, Predicates,SortDirection } from '@aws-amplify/datastore'
import { Storage } from 'aws-amplify'
import { Post } from '../../src/models'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useFocusEffect } from '@react-navigation/native'
import {Loader} from '../Loader'
import { Context } from '../nav/context'

const HelpfulInfo = ({ navigation }) => {
  const ScrollRef = useRef(null)
  const [data, updatePost] = useState([])
  const [pageNum, setPageNum] = useState(0)
  const [file, setFile] = useState([])
  const [load, setLoad] = useState(true)
  const {isAuth, isAdmin} = useContext(Context)
  const {container, card, bottomBtnContainer, buttonDetail, prevBTNnext,
    descr, titleS, createPostBtn } = styles

  const fetchPost = async () => {
    try {
      let mess = await DataStore.query(Post, Predicates.ALL, {
        sort: p => p.createdAt(SortDirection.DESCENDING),
        page: pageNum,
        limit: 3
      })
      if (data.length !== mess.length || (data.length > 0 && mess.length > 0) && data[0].id !== mess[0].id) {
        mess.map(async (item) =>{
          const imageKey = await Storage.get(item.image)
          setFile(prev => prev.find((failik) => failik.id === item.id) ?
          prev : [...prev, {image: imageKey, id: item.id}] ) 
        })
        setLoad(false)
      }
      if (data.length === mess.length && mess.length == 0) {
        setLoad(false)
      }
      load &&
      updatePost(mess)
    } catch(err) {
      console.log(err)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
    fetchPost()
    const subscription = DataStore.observe(Post).subscribe(() => fetchPost())
      return () => {
        subscription.unsubscribe()
      };
    }, [data])
  );
  useEffect(() => {
    
  }, [pageNum])

  const goToDetailScreen = (item, image) => {
    let admin = false;
    isAuth && isAdmin ?
    admin = true : admin = false
    navigation.navigate('DetailPost', {
      item: item, image: image, admin: admin })
  }

  const _renderItem = ({ item }) => {
    let imgRender = ''
    try {
      imgRender = file.find((failik) => failik.id === item.id).image
    } catch (error) {
      imgRender = ''
    }
    return (
      <Pressable key={item.id} style={({pressed}) => [card,
       {backgroundColor: pressed ? '#e6e8e8' : '#fdfdfd' }]}
        onPress={() => goToDetailScreen(item, imgRender)}>
        {({ pressed }) => (
          <View style={{flexDirection: 'row', flex: 1}}>
            { imgRender != '' &&
            <Image resizeMode='cover'
             style={{flex: 1}} 
             source={{uri: imgRender}} />}
            <View style={{flex: 1}}>
              <Text style={titleS}>{item.title}</Text>
              <View style={{marginBottom: 35}}>
                <Text style={descr}> {item.description.split('').length > 80 ?
                 item.description.split('', 78).join('')+'...' : item.description }</Text>
              </View>
              <View style={[buttonDetail, pressed && { backgroundColor: '#ef092f' }]}>
                <Text style={{color: '#edf0f0'}}>
                  Подробнее
                </Text>
              </View>
            </View>
          </View>
        )}
      </Pressable>
    )
  }
  return (
    <ScrollView style={container} ref={ScrollRef}>
      <Text style={[titleS, {fontSize: 22, marginBottom: 10, paddingTop: 15,}]}>Новости</Text>
      { isAuth &&  isAdmin ?
      <TouchableOpacity style={createPostBtn}
       onPress={() => {navigation.navigate('HelpfulInfoAdd')} }>
        <Icon name="plus-square-o" size={50} color="red" />
      </TouchableOpacity> : null}
      {data && data.map((item) => {return _renderItem({item})}) }
      {load && <Loader/>}
      {!load &&
      <View style={bottomBtnContainer}>
        { pageNum != 0 ?
        <Pressable style={({pressed}) => [prevBTNnext, {marginRight: 7, borderColor: pressed ? '#f82b40' : '#393a3a' }]}
        onPress={() => { setLoad(true)
          updatePost([])
          setPageNum(prevState => prevState -1)
            ScrollRef.current.scrollTo({x: 0, y: 0, animated: false}) }}>
          <Text style={{ color: '#292929', textAlign: 'center' }}>Предыдущая страница</Text>
          <Icon name="arrow-circle-o-left" size={25} color="red" />
        </Pressable> : <View style={{flex: 1}}></View>}
        { data.length === 3 ?
        <Pressable style={({pressed}) => [prevBTNnext, {marginLeft: 7, borderColor: pressed ? '#f82b40' : '#393a3a' }]}
        onPress={() => { setLoad(true)
          updatePost([])
          setPageNum(prevState => prevState +1)
           ScrollRef.current.scrollTo({x: 0, y: 0, animated: false}) }}>
          <Text style={{ color: '#292929', textAlign: 'center' }}>Следующая страница</Text>
          <Icon name="arrow-circle-o-right" size={25} color="red" />
        </Pressable> : <View style={{flex: 1}}></View> }
      </View>}
      {(data.length === 0 && !load) &&<View style={{ height: 400, justifyContent: 'center' }}>
      <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold'  }}>
         Упс, посты закончились...
      </Text></View>}
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    minHeight: 150,
    width: '100%',
    borderRadius: 2,
    borderColor: '#909090',
    marginVertical: 10,
    paddingBottom: 1.3
  },
  buttonDetail: {
    padding: 5,
    paddingLeft: 8,
    backgroundColor: '#35c0cc',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 10,
  },
  prevBTNnext: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center'
  },
  bottomBtnContainer: {
    flexDirection: 'row',
    paddingHorizontal: 3,
    paddingBottom: 6,
  },
  descr: {
    color: '#484848',
    fontSize: 16,
    lineHeight: 20,
    marginHorizontal: 5,
  },
  titleS: {
    textAlign: 'center',
    color: '#1b1b1b',
    fontWeight: '700', 
    fontSize: 17,
    marginTop: 2,
  },
  createPostBtn: {
    alignSelf: 'flex-end',
    margin: 8,
  },
})
export { HelpfulInfo }
/**/