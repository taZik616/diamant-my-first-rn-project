import React, { useEffect, useState, useRef, useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View, BackHandler, Alert, 
  ScrollView, Dimensions, Pressable, Animated, Image, Modal, 
  TextInput, TouchableOpacity, Linking } from 'react-native'
import { Context } from './nav/context'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SwiperItem, Product } from '../src/models'
import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore'
import { Auth, Storage } from 'aws-amplify'
import { cats, subCats } from './catalog/cats'
import { launchImageLibrary} from 'react-native-image-picker'
import { nanoid } from 'nanoid/non-secure'
import { Circle } from 'react-native-animated-spinkit'
import LinearGradient from 'react-native-linear-gradient'

const CARD_WIDTH = 200
const CARD_MARGIN = 5
const FULL_CARD_WIDTH = CARD_WIDTH + (CARD_MARGIN*2)
const CONTAINER_PADDING = 15
const emptyArr = ['','','','','','','']
const categ = [...cats]
const subCateg = [...subCats]

const allScreens = [
  {screen: 'Products', name: 'Экран товаров', stack: false},
  {screen: 'CartProd', name: 'Корзина', stack: false},
  {screen: 'About', name: 'О компании', stack: false},
  {screen: 'Services', name: 'Услуги', stack: false},
  {screen: 'HelpfulInfo', name: 'Новости', stack: false},
  {screen: 'PayAndDelivery', name: 'Покупка и доставка', stack: false},
  {screen: 'Contacts', name: 'Контакты', stack: false},
]

const winWidth = Dimensions.get('window').width
const Main = ({navigation}) => {
  const mainSwiperRef = useRef()
  const {isAuth, isAdmin} = useContext(Context)
  const [newSlideFinal, setNewSlideFinal] = useState(false)
  const [file, setFile] = useState([])
  const [novProds, setNovProds] = useState([])
  const [fileNov, setFileNov] = useState([])
  const [load, setLoad] = useState(true)
  const initialNewSlide = {image: '',
  text: '', buttonText: '', href: undefined, hrefPath: '', toScreen: '', 
  category: '', subCategory: '' }
  const [ newSlide, setNewSlide] = useState(initialNewSlide)
  const AnimDot = Animated.createAnimatedComponent(Pressable)
  const scrollX = useRef(new Animated.Value(0)).current
  const scrollXNov = useRef(new Animated.Value(0)).current
  const lineLoadAnim = useRef(new Animated.Value(-200)).current
  const AnimLinearGrad = Animated.createAnimatedComponent(LinearGradient)
  const [swiperItems, setSwiperItems] = useState([])
  const [reloadFetch, setReloadFetch] = useState(true)

  const fetchSlides = async() => {
    try {
      const mess = await DataStore.query(SwiperItem, Predicates.ALL, {
        limit: 10
      })
      if (mess.length == 0 && reloadFetch) {
        setReloadFetch(false)
        fetchSlides()
        return
      }
      const novelties = await DataStore.query(Product, Predicates.ALL, {
        sort: s =>  s.createdAt(SortDirection.DESCENDING),
        limit: 12,
      })
      novelties.map(async (item) => {
        const imageKey = await Storage.get(item.image)
        setFileNov(prev => prev.find((failik) => failik.id === item.id) ?
        prev : [...prev, {image: imageKey, id: item.id}] ) 
      })
      mess.map(async (item) => {
        const imageKey = await Storage.get(item.image)
        setFile(prev => prev.find((failik) => failik.id === item.id) ?
        prev : [...prev, {image: imageKey, id: item.id}] ) 
      })
      setLoad(false)
      setSwiperItems(mess)
      setNovProds(novelties)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(async() => {
    await DataStore.start()
  }, [])
  useEffect(() => {

    categ[0] !== '' && categ.unshift('')
    subCateg.map((a) => a[0] !== '' ? a.unshift('') : a)
  }, [])


  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo'
    })
    if (!result.didCancel) {
      setNewSlide((prevState) => ({...prevState, image: result.assets[0].uri, imgFile: ''}))
    }
  }

  const back = () => {
    Alert.alert("Подождите!", "Вы уверены, что хотите выйти?", [
      {
        text: "Отмена",
        onPress: () => null,
        style: "cancel"
      },
      { text: "Да", onPress: () => BackHandler.exitApp() }
    ], { cancelable: true})
    return true
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', back)
      setLoad(true)
      fetchSlides()
      return () => {
        
      }
    }, [])
  )
  
  const handleSwiperButton = (item) => {
    navigation.navigate('MainDrawer', item.toScreen !== "Products" ?
    {screen: item.toScreen}
    : {
      screen: item.toScreen,
      params: item.category ? {
        category: item.category,
        subCategory: item.subCategory ? item.subCategory : item.category,
      } : {
        search:  true,
        searchText: '',
      }
    })
  }

  const goHref = async (href) => {
    await Linking.openURL(href)
  }

  const renderSwiperItems = (item, index) => {
    let imgRender = ''
    try {
      imgRender = file.find((failik) => failik.id === item.id).image
    } catch (error) {
      imgRender = ''
    }
    return <View style={styles.mainSwiperItemCont} key={index.toString()}>
      { imgRender != '' ?
      <Image style={{width: '100%',height: '100%', position: 'absolute'}}
          source={{uri: imgRender}} /> : !load && <View style={{ width: '100%',height: '100%', position: 'absolute', 
          width: winWidth, alignItems: 'center', justifyContent: 'center'}}>
          <Circle color='#e6005c' size={70}></Circle>
        </View>}
      <View style={{width: '55%', marginTop: 30, marginLeft: 10}}>
        <Text numberOfLines={5}
        style={{fontWeight: '300', fontStyle: 'italic', fontSize: 18, color: '#1a1a1a'}}>{item.text}</Text>
      </View>
      {item.buttonText !== '' &&
      <View style={{flexDirection: 'row', position: 'absolute', bottom: 40, left: 20}}>
        <TouchableOpacity onPress={() => item.href ? goHref(item.hrefPath) : handleSwiperButton(item)}
        style={{paddingVertical: 6, paddingHorizontal: 10, borderWidth: 2, borderColor: '#262626'}}>
          <Text style={{fontWeight: 'bold', fontSize: 17, color: '#262626'}}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>}
      {isAuth && isAdmin ? <View style={{flexDirection: 'row', position: 'absolute', right: 15, top: 15}}>
        <Pressable onPress={() => handleDeleteSwiperItem(item)}>
          <Icon name='trash-o' color='#99003d' size={45} />
        </Pressable>
      </View> : <></>}
    </View>
  }
  const renderDots = (item, index) => {
    return <AnimDot onPressIn={() => 
      mainSwiperRef.current.scrollTo({x: winWidth*index, animated: true })}
    key={index.toString()} onPress={() => {}}
    style={[styles.dot, { transform: [{scale: scrollX.interpolate({
      inputRange: [winWidth * (index-1), winWidth * index, 
        winWidth * (index+1)],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp'
    }) }] }]}>
      <Animated.View style={[ styles.centerDot, { opacity: scrollX.interpolate({
        inputRange: [winWidth * (index-1), winWidth * index, 
          winWidth * (index+1)],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp'
      }) }]}></Animated.View>
    </AnimDot>
  }

  const renderChoseBtn = (item, index, setFunc, selectedItem) => {
    return <TouchableOpacity onPress={() => setFunc(item)}
     key={index.toString()}
     style={[styles.radioBtnContainer, {minWidth: '40%'}]}>
      <View style={styles.radioBtn}>
        {(item.screen ? item.screen : item) === selectedItem &&
        <View style={styles.selectRadioBtn}></View>}
      </View>
      <Text style={[styles.H2, {fontSize: 16, flex: 1, 
        textAlign: 'left'}]}>{item.name? item.name : item === '' ? 'Все' : item}</Text>
    </TouchableOpacity>
  }

  const setScreen = (item) => {
    setNewSlide(prev => {return {...prev, toScreen: item.screen}})
  }
  const setCategory = (item) => {
    setNewSlide(prev => {return {...prev, category: item}})
  }
  const setSubCategory = (item) => {
    setNewSlide(prev => {return {...prev, subCategory: item}})
  }

  const handleCreateSwiperItem = async () => {
    try {
      const { image,
      text, buttonText, href, hrefPath, toScreen, 
      category, subCategory} = newSlide
      const img = await (await fetch(image)).blob()
      const url = `swiper/${nanoid()}${image.split('/').reverse()[0]}`
      await DataStore.save(new SwiperItem({
        href: href,
        buttonText: buttonText,
        image: url,
        text: text,
        hrefPath: hrefPath,
        toScreen: toScreen,
        category: category,
        subCategory: subCategory
       }))
       await Storage.put(url, img, { contentType: 'image'})
       setNewSlide(initialNewSlide)
       setNewSlideFinal(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteSwiperItem = (item) => {
    Alert.alert('Подтвердите', 'Вы точно хотите удалить этот слайд?',
    [{text: 'Да', onPress: async () => {
    try {
      const delItem = await DataStore.query(SwiperItem, item.id)
      await DataStore.delete(delItem)
      await Storage.remove(item.image)
      setSwiperItems(prev => prev.filter((a) => a.id !== item.id))
      setFile(prev => prev.filter((a) => a.id !== item.id))
    } catch (err) {
      console.log(err)
    }
    }},
    {text: 'Отмена'} ])
  }

  const goDetails = (item, imgRender) => {
    navigation.navigate('ProductDetail', {
      item: item,
      imgRender: imgRender,
      main: true,
    })
  }

  useEffect(() => {
    if (load) {
      animLine.start()
    } else {
      animLine.reset()
      lineLoadAnim.setValue(-200)
    }
  }, [load])

  const animLine = useRef(
    Animated.loop(
        Animated.timing(
          lineLoadAnim, 
          {
            toValue: FULL_CARD_WIDTH + 200,
            duration: 2000,
            useNativeDriver: true
          }
        ) )).current

  const _renderEmptyItem = () => {
    return <View style={[styles.itemContainerStyle, {overflow: 'hidden'}]}>
      <AnimLinearGrad style={[styles.animLine, {transform: [{translateX: lineLoadAnim},
        { rotateX: "15deg" },{ rotateZ: "15deg" }] }]} colors={['#00000000',
          '#f1f1f1', '#f1f1f1', '#00000000']} start={{x: 0.0, y: 0}} end={{x: 1.0, y: 0.0}}
      />
    </View>
  }

  const _renderItem = ({ item, index }) => {
    let imgRender = ''
    try {
      imgRender = fileNov.find((failik) => failik.id === item.id).image
    } catch (error) {
      imgRender = ''
    }
    return <Pressable onPress={() => goDetails(item, imgRender)}
    style={styles.itemContainerStyle}>
      {item.availability.includes(true) ? 
            <View style={[styles.availS, {backgroundColor: '#0bc408'}]}> 
              <Text style={{ color: '#fff'}}>В наличии</Text>
            </View> :
            <View style={[styles.availS, {backgroundColor: '#8f8f8f'}]}> 
              <Text style={{ color: '#f0f0f0', transform: [{translateY: -1}]}}>Под заказ</Text>
            </View>}
      { imgRender != '' ?
      <View style={{width: 200, height: 170}}  >
        <Image resizeMode='cover'
         style={{flex: 1, borderTopRightRadius: 8, borderTopLeftRadius: 8}}
         source={{uri: imgRender}} />
      </View> : 
      <View style={{width: 200, height: 170, 
         justifyContent: 'center', alignItems: 'center'}}>
        <Circle size={65} color="#ff0066"></Circle>
      </View>}
      <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8, marginTop: 4}}>
        <Text style={styles.costS}>{item.cost}</Text>
        <Icon style={{transform: [{translateY: .7}]}} name='ruble' color='#454545' size={18} /> 
      </View>
      <Text numberOfLines={3} style={[styles.H2, {fontSize: 15.5, marginHorizontal: 5, 
        textAlign: 'left', marginTop: 1,}]}>{item.name}</Text>
    </Pressable>
  }

  return (
    <ScrollView style={styles.container}>
      <Modal
      visible={newSlideFinal}
      animationType='slide'
      transparent
      style={{flex: 1}}
      >
      <View style={{flex: 1, backgroundColor: newSlideFinal ? 'rgba(130, 130, 130, .4)' : 'transparent'}}>
        <View style={styles.modalS}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={{zIndex: 5, marginLeft: 5 }}
            onPress={() => setNewSlideFinal(false)}>
              <Icon name='angle-double-left' color='#ff0066' size={50} />
            </TouchableOpacity>
            {(newSlide.href && newSlide.hrefPath.length > 5 ||
             !newSlide.href && newSlide.toScreen !== '') ?
            <TouchableOpacity style={{zIndex: 5, marginRight: 5 }}
            onPress={() => handleCreateSwiperItem()}>
              <Icon name='check' color='#00e600' size={50} />
            </TouchableOpacity> : <></>}
          </View>
          <View style={{width: '100%', 
          borderTopWidth: 2, borderTopColor: '#ff0066', marginTop: 10}}></View>
          <ScrollView 
          style={{flex: 1}}
          >
            <Text style={styles.H1}>Настройка кнопки</Text>
            <Text style={styles.H2}>Куда ведёт кнопка?</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setNewSlide(prev => 
              {return {...prev, href: true}})}
              style={styles.radioBtnContainer}>
                <View style={styles.radioBtn}>
                  {newSlide.href === true &&
                  <View style={styles.selectRadioBtn}></View>}
                </View>
                <Text style={[styles.H2, {fontSize: 16, flex: 1, 
                  textAlign: 'left'}]}>На интернет страницу</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewSlide(prev => 
              {return {...prev, href: false}})}
              style={styles.radioBtnContainer}>
                <View style={styles.radioBtn}>
                  {newSlide.href === false &&
                  <View style={styles.selectRadioBtn}></View>}
                </View>
                <Text style={[styles.H2, {fontSize: 16, flex: 1, 
                  textAlign: 'left'}]}>В отдел приложения</Text>
              </TouchableOpacity>
            </View>
            {newSlide.href === true && <>
            <Text style={styles.H2}>Введите ссылку</Text>
            <TextInput 
            value={newSlide.hrefPath}
            onChangeText={(txt) => setNewSlide(prev => 
              {return {...prev, hrefPath: txt}})}
            style={{borderBottomColor: '#828282', alignSelf: 'center',
            borderBottomWidth: 1, width: '70%', textAlign: 'center'}}
            />
            </>}
            {newSlide.href === false &&
            <>
              <Text style={styles.H2}>На какой экран ведёт кнопка?</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {allScreens.map((item, index) => {return renderChoseBtn(item, index, setScreen, newSlide.toScreen)} )}
              </View>
              { newSlide.toScreen === 'Products' && 
              <>
                <Text style={styles.H2}>Выберите категорию(не обязательно)</Text>
                {categ.map((item, index) => {return renderChoseBtn(item, index, setCategory, newSlide.category)})}
              </>
              }
              { (newSlide.category !== '' && newSlide.category !== 'Часы' 
                && newSlide.category !== 'Столовое серебро' ) && 
              <>
                <Text style={styles.H2}>Выберите подкатегорию(не обязательно)</Text>
                {subCateg[categ.findIndex((a) => a === newSlide.category)-1].map((item, index) => 
                  {return renderChoseBtn(item, index, setSubCategory, newSlide.subCategory)})}
              </>
              }
            </>}
            <Text style={[styles.H2, {fontSize: 15, fontWeight: '400'}]}>
              Примечание: если вы не дадите название кнопке, то её не будет</Text>
          </ScrollView>
        </View>
      </View>
      </Modal>
      <View>
      <Animated.ScrollView
        removeClippedSubviews
        disableIntervalMomentum
        decelerationRate={.8}
        ref={mainSwiperRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToInterval={winWidth}
        style={styles.mainSwiper}
        onScroll={Animated.event(
          [{
            nativeEvent: {
              contentOffset: {
                x: scrollX,
              },
            },
          }],
          {useNativeDriver: true},
        )}
      >
        {isAuth && isAdmin ?
        <View style={styles.mainSwiperItemCont}>
          {newSlide.image !== '' ? <Image style={{width: '100%',height: '100%', position: 'absolute'}}
          source={{uri: newSlide.image}} /> : <></>}
          <View style={{ marginTop: 45, marginHorizontal: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '55%'}}>
              <TextInput 
                value={newSlide.text}
                onChangeText={(txt) => 
                  setNewSlide(prev => {return {...prev, text: txt}})}
                placeholder='Новый слайд'
                multiline
                maxLength={60}
                style={{ height: 100, backgroundColor: 'rgba(242, 242, 242, 0.4)', 
                padding: 10, borderWidth: 1, borderColor: '#ff0066', borderRadius: 8, 
                textAlignVertical: 'top', fontSize: 18}}
              />
              <TextInput 
                maxLength={15}
                value={newSlide.buttonText}
                onChangeText={(txt) => 
                  setNewSlide(prev => {return {...prev, buttonText: txt}})}
                placeholder='Текст кнопки'
                style={{ height: 30, width: '70%', alignSelf: 'center', textAlign: 'center',
                borderColor: '#ff0066', borderWidth: 2, marginTop: 10, padding: 5,
                backgroundColor: 'rgba(242, 242, 242, 0.2)'}}
              />
            </View>
            <TouchableOpacity style={{marginRight: 20}}
             onPress={() => pickImage()}>
              <Icon name='file-photo-o' color='#ff0066' size={50} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setNewSlideFinal(true)}
          disabled={!(newSlide.image !== '' && 
          newSlide.text.length > 5)}
          style={{marginLeft: 20, marginTop: 5}}>
              <Icon name='angle-double-right' color={
              newSlide.image !== '' && newSlide.text.length > 5 ?
              '#ff0066' : 'rgba(153, 0, 61, 0.5)'} size={50} />
          </TouchableOpacity>
          </View>
        </View> : <></>}
        {load && <View style={{flex: 1, width: winWidth, alignItems: 'center', justifyContent: 'center'}}>
          <Circle color='#e6005c' size={70}></Circle>
        </View>}
        {swiperItems.map((item, index) => {
          return renderSwiperItems(item, index)
        })}
      </Animated.ScrollView>
        <View style={{position: 'absolute', bottom: 10, width: winWidth,
         alignItems: 'center'}}>
           <View style={styles.dotsContainer}>
              {swiperItems.map((item, index) => {
                return renderDots(item, isAuth && isAdmin ? index+1 : index)
              })}
           </View>
        </View>
      </View>
      <Text style={[styles.H1, {marginTop: 20}]}>Новинки</Text>
      <View style={{height: 5, width: '70%', backgroundColor: '#d4d4d4', 
       alignSelf: 'center',marginBottom: 10}}>
        <Animated.View style={{flex: 1, backgroundColor: 'red', 
        scaleX: novProds.length > 2 ? scrollXNov.interpolate({
          inputRange: [0, (FULL_CARD_WIDTH * (novProds.length -2)) + CONTAINER_PADDING],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }) : 0,translateX: novProds.length > 2 ? scrollXNov.interpolate({
          inputRange: [0, (FULL_CARD_WIDTH * (novProds.length -2)) + CONTAINER_PADDING],
          outputRange: [-(winWidth*0.35), 0],
          extrapolate: 'clamp'
        }) : 0
        }}></Animated.View>
      </View>
      <Animated.FlatList
        removeClippedSubviews
        decelerationRate={.8}
        style={{width: '100%'}}
        contentContainerStyle={{paddingHorizontal: CONTAINER_PADDING, paddingVertical: 5}}
        keyExtractor={(item, index) => novProds.length > 2 ? item.id : index.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={novProds.length > 2 ? novProds : emptyArr}
        renderItem={novProds.length > 2 ? _renderItem : _renderEmptyItem}
        onScroll={Animated.event(
          [{
            nativeEvent: {
              contentOffset: {
                x: scrollXNov,
              },
            },
          }],
          {useNativeDriver: true},
        )}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  mainSwiper: {
    height: 250,
    width: winWidth,
  },
  mainSwiperItemCont: {
    width: winWidth,
    backgroundColor: '#e6e6e6',
  },
  dot: {
    borderRadius: 25, 
    backgroundColor: 'red', 
    width: 14, 
    height: 14, 
    marginHorizontal: 3, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  dotsContainer: {
    minWidth: 220,
    height: 25, 
    justifyContent: 'center', 
    width: '60%', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  centerDot: {
    borderRadius: 20, 
    backgroundColor: '#f2f2f2', 
    width: 11, 
    height: 11
  },
  modalS: {
    flex: 1,
    marginTop: 30,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10, 
    backgroundColor: '#f2f2f2',
    padding: 10
  },
  H1: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 14,
    marginTop: 7,
  },
  H2: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#595959',
    marginBottom: 6,
    marginTop: 4,
  },
  radioBtn: {
    borderRadius: 30, 
    backgroundColor: 'transparent', 
    width: 30, 
    height: 30, 
    marginHorizontal: 3, 
    marginRight: 7,
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: 'red',
    borderWidth: 3,
  },
  selectRadioBtn: {
    borderRadius: 25, 
    backgroundColor: 'red', 
    width: 18, 
    height: 18
  },
  radioBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 4,
  },
  itemContainerStyle: {
    height: 260,
    margin: CARD_MARGIN,
    width: CARD_WIDTH,
    borderRadius: 8,
    backgroundColor: '#ebebeb'
  }, 
  costS: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2C2B2B',
    marginRight: 7
  },
  availS: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 8,
    padding: 2,
    opacity: .9,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingRight: 3,
    paddingLeft: 5,
    zIndex: 5,
  },
  animLine: {
    position: 'absolute', 
    height: 400, 
    width: 120,
    zIndex: 5,
    top: -30
  },
})
export { Main }
