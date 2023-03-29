import React, { useEffect, useState, useContext, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, Image, 
  Alert, TouchableOpacity, Pressable, PanResponder, Animated } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Cart, Product } from '../../src/models'
import { DataStore } from '@aws-amplify/datastore'
import { Storage, Auth } from 'aws-amplify'
import { useFocusEffect } from '@react-navigation/native'
import { Context } from '../nav/context'
import { Loader } from '../Loader'

const CARD_HEIGHT = 170
const PADDING = 0
const MARGIN = 0
const FULL_CARD_HEIGHT = CARD_HEIGHT + PADDING*2 + MARGIN*2
const HEADER_HEIGHT = 70

const CartProd = ({ route, navigation }) => {
  const [data, updateCart] = useState([])
  const [file, setFile] = useState([])
  const [load, setLoad] = useState(true)
  const [fullCost, setFullCost] = useState(0)
  const [prodsCount, setProdsCount] = useState([])
  const [isDrag, setIsDrag] = useState(false)
  const [dragItem, setDragItem] = useState(false)
  const [delDragItem, setDelDragItem] = useState(false)
  const {isAuth} = useContext(Context)
  const [endAnim, setEndAnim] = useState(false)

  useEffect(() => {
    delDragItem===true &&
    setTimeout(delItemInCart, 400, dragItem)
  }, [delDragItem])

  const pan = useRef(new Animated.ValueXY()).current
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        setIsDrag(true)
        // Жест начался. Показывайте визуальную обратную связь, чтобы пользователь 
        // знал, что происходит! gestState.d{x,y} теперь будет равен нулю
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }],
        {useNativeDriver: false}
      ),
        // Самая последняя дистанция перемещения —gestState.move{X,Y} 
        // Накопленная дистанция жеста с тех пор, как он стал ответчиком, 
        // gestState.d{x,y}
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        setEndAnim(true)
        if (gestureState.dx < -120) {
          setDelDragItem(true)
          Animated.spring(pan, {
            toValue: { x: -600, y: 0 },
            useNativeDriver: true
          }).start(() => {
            pan.setValue({ x: 0, y: 0 })
            setEndAnim(false)
          })
        } else if (gestureState.dx >= -120) {
          setDelDragItem(false)
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true
          }).start(() => {
            setEndAnim(false)})
        }
        setIsDrag(false)
        // Пользователь отпустил все касания, пока это представление является 
        // ответчиком. Обычно это означает, что жест был выполнен успешно.
      },
      onPanResponderTerminate: (evt, gestureState) => {
        setEndAnim(true)
        if (gestureState.dx < -100) {
          setDelDragItem(true)
          Animated.spring(pan, {
            toValue: { x: -600, y: 0 },
            useNativeDriver: true
          }).start(() => {
            setEndAnim(false)
          })
        } else if (gestureState.dx >= -100) {
          setDelDragItem(false)
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true
          }).start(({finished}) => {
            setEndAnim(false)})
        }
        setIsDrag(false)
        // Ответчиком стал другой компонент,
        // поэтому этот жест следует отменить.
      }
    })
  ).current

  useFocusEffect(
    React.useCallback(() => {
    if (isAuth) {
      fetchProd()
    }
    }, [isAuth])
  )
  useFocusEffect(
    React.useCallback(() => {
    if (!isAuth){
      updateCart([])
      setLoad(false)
    }
    return () => {
    }
    }, [isAuth])
  )
  useEffect(() => {
    prodsCount.length == data.length &&
    setFullCost(data.reduce((prev, item) => prev + (Number(item.cost) *
     prodsCount.find(a => a.id ===item.id).count), 0))
  }, [load, prodsCount])
  
  const fetchProd = async () => {
      try {
        if (isAuth){
          const cart = await DataStore.query(Cart, c => c.owner('eq', Auth.user.attributes.sub))
          cart[0].productsId.length !== data.length && setLoad(true)
          let mess = await Promise.all(cart[0].productsId.map(async (a, i) =>
            {return await DataStore.query(Product, a)})
          )
          if (mess.length !== data.length) {
            mess.map(async (item) =>{
              const imageKey = await Storage.get(item.image)
              setProdsCount(prev => prev.find((countId) => countId.id === item.id) ?
              prev : [...prev, {count: 1, id: item.id}] )
              setFile(prev => prev.find((failik) => failik.id === item.id) ?
              prev : [...prev, {image: imageKey, id: item.id}] ) 
            })
          }
          updateCart(mess)
          if (mess.length !== data.length || mess.length == 0)
            setLoad(false)
        }
      } catch(err) {
        console.log(err)
      }
    }

  const delItemInCart = async (item) => {
    try {
      updateCart(prev => prev.filter((a) => a.id !== item))
      const delCartItem = await DataStore.query(Cart, 
        c => c.owner('eq', Auth.user.attributes.sub))
       await DataStore.save(
         Cart.copyOf(delCartItem[0], updated => {
           updated.productsId = [...delCartItem[0].productsId.filter((a) => 
           a !== item)]
         })
       )
       setFile(prev => prev.filter(a => a.id !== item))
       setProdsCount(prev => prev.filter(a => a.id !== item))
       setDelDragItem(false)
       setDragItem(false)
    } catch (error) {
      console.log(error)
    }
  }

  const _renderItem = ({ item, index }) => {
    let imgRender = ''
    try {
      imgRender = file.find((failik) => failik.id === item.id).image
    } catch (error) {
      imgRender = ''
    }
    return <>
    <Animated.View style={{
    transform: [{ translateX: (dragItem === item.id) ? pan.x.interpolate({
      inputRange: [-600,-120, 0, 1],
      outputRange: [-600, -120, 0, 0]
    }) : 0 }] }} >
    <Pressable onPressIn={() => {pan.setValue({  x: 0, y: 0 })
      setDragItem(item.id)}} 
    onPress={() => navigation.navigate('ProductDetail', {
        item: item,
        imgRender: imgRender,
        isCart: true
    } )} style={styles.card}>
      <View style={{flex: 1, alignItems:'center'}}>
        {imgRender!=='' &&
        <Image resizeMode='cover'
          style={{ maxWidth: 250, height: '100%', width: '100%'}}
          source={{uri: imgRender}}/>}
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.costS}>{item.name}</Text>
        <Text style={styles.nameS}>{item.cost} руб.</Text>
      </View>
      <View style={styles.counterS}>
        <TouchableOpacity onPressIn={() => 
          prodsCount.find(a => a.id === item.id).count < 99 && 
          setProdsCount(prev => prev.map((a) => 
          a.id === item.id ? {count: a.count+1, id: a.id} : a))}>
          <Icon name='plus' size={30} color={'#545454'} />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{prodsCount.length == data.length ?
        prodsCount.find(a => a.id === item.id).count : '0'}</Text>
        <TouchableOpacity onPressIn={() => prodsCount.find(a => a.id === item.id).count > 1 && setProdsCount(prev => prev.map((a) => 
        a.id === item.id ? {count: a.count-1, id: a.id} : a))}>
          <Icon name='minus' size={30} color={'#545454'} />
        </TouchableOpacity>
      </View>
      </Pressable>
    </Animated.View>
    {(dragItem === item.id && isDrag) &&
      <Animated.View style={[styles.delBox, 
        {transform: [{translateX: pan.x.interpolate({
          inputRange: [-600,-120, 0, 1],
          outputRange: [60,60,0,0]
      }) }]} ]}>
          <Icon name='trash-o' color='#180101' size={35} />
      </Animated.View>}
    </>
  }
  return (
    <View>
      <FlatList
      {...panResponder.panHandlers}
      scrollEnabled={!isDrag}
      style={styles.container}
      getItemLayout={(data, index) => (
        {length: FULL_CARD_HEIGHT, offset: FULL_CARD_HEIGHT * index, index}
      )}
      removeClippedSubviews={true}
      data={data}
      keyExtractor={item => item.id}
      renderItem={_renderItem}
      ItemSeparatorComponent={() => <View style={{
        borderColor: '#949494', borderBottomWidth: 4
      }}></View>}
      ListFooterComponent={<>
      {data.length > 0 && <View style={styles.fullCostContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 19, marginRight: 10}}>Итого:</Text>
          <Text style={{fontSize: 20, color: '#404040', flex: 1, textAlign: 'right'}}>{fullCost} руб.</Text>
        </View>
      </View>}
      </>}
      ListHeaderComponent={
        <View style={{height: HEADER_HEIGHT}}>
          <Text style={styles.title}>Корзина</Text>
        </View>
      }
      />
      {(data.length <= 0 && !load) && <View style={{alignItems: 'center', marginTop: 20, marginHorizontal: 20}}>
        <Icon name='shopping-bag' color='#e50b1a' size={80} />
        <Text style={styles.emptyText}>Ваша корзина пуста, 
        самое время пополнить её</Text>
      </View>}
      {load && <Loader/>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    
  },
  title: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#383838'
  }, 
  card: {
    height: CARD_HEIGHT,
    marginVertical: MARGIN,
    padding: PADDING,
    flexDirection: 'row'
  },
  costS: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: '#2C2B2B',
    marginBottom: 2,
  },
  nameS: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#545454',
    marginHorizontal: 4
  },
  trashIcon: {
    position: 'absolute',
    top: 3,
    right: 3,
    zIndex: 5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    marginHorizontal: 20,
    letterSpacing: 2,
    textAlign: 'center',
    color: '#9c7c7f'
  },
  fullCostContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderColor: '#797f75',
    borderWidth: 1.5,
    borderRadius: 3,
  },
  counterS: {
    backgroundColor: '#e6e6e6', 
    padding: 10,
    alignItems:'center',
    borderRadius: 8,
    zIndex: 10,
    justifyContent: 'center',
    marginVertical: 10
  },
  delBox: {
    width: 120,
    height: FULL_CARD_HEIGHT, 
    position: 'absolute', 
    left: -60, 
    width: 120, 
    opacity: .6, 
    borderBottomRightRadius: 10, 
    borderTopRightRadius: 10, 
    justifyContent: 'center', 
    backgroundColor: '#f42f2f', 
    alignItems: 'center'
  }
})

export { CartProd }
/*
<TouchableOpacity onPress={() => delItemInCart(item.id)}
  style={styles.trashIcon}>
  <Icon name='trash-o' color='#e50b1a' size={45} />
</TouchableOpacity>
*/