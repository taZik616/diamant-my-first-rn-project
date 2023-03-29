import React, { useState, useEffect, useRef, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, Modal, TouchableOpacity,
 Pressable, Animated, Dimensions, KeyboardAvoidingView, TextInput, BackHandler } from 'react-native'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Performance, Cart, Comment, Product } from '../../src/models'
import { DataStore } from '@aws-amplify/datastore'
import { availabilityNames } from './cats'
import { Auth } from 'aws-amplify'
import {Context} from '../nav/context'
import { useFocusEffect } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
const winWidth = Dimensions.get('window').width 
const winHeight = Dimensions.get('window').height
const limitLetters = 150

const ProductDetail = ({ route, navigation }) => {
  const [visible, setVisible] = useState(false)
  const [comVisible, setComVisible] = useState(false)
  const [isPerfDescr, setIsPerfDescr] = useState(true)
  const [perf, setPerf] = useState([])
  const [loadInfo, setLoadInfo] = useState(true)
  const [isCart, setIsCart] = useState(false)
  const [comments, setComments] = useState([])
  const [commentForm, setCommentForm] = useState({stars: 5, text: '' })
  const [userId, setUserId] = useState('')
  const scrollRef = useRef()
  const {setGoBackVisible, setScreenParams, setGoBackProps, isAuth, isAdmin} = useContext(Context)  
  const lineLoadAnim = useRef(new Animated.Value(-200)).current
  const AnimLinearGrad = Animated.createAnimatedComponent(LinearGradient)

  useEffect(() => { isAuth ? setUserId(Auth.user.attributes.sub) : setUserId('') }, [isAuth])

  useFocusEffect(
    React.useCallback(() => {
    setGoBackVisible(true)
    return () => {
      setGoBackVisible(false)
      setLoadInfo(true)
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }, [])
  )

  const fetchInfo = async () => { 
    try {
      const performance = (await DataStore.query(Performance)).filter(c => c.prod.id === route.params.item.id)
      const prodComments = (await DataStore.query(Comment)).filter(c => c.prod.id === route.params.item.id)
      if (isAuth) {
        const userCart = await DataStore.query(Cart, c => c.owner('eq', Auth.user.attributes.sub))
        setIsCart(userCart.length <= 0 ? false : userCart[0].productsId.includes(route.params.item.id))
      }
      setPerf(performance)
      setLoadInfo(false)
      setComments(prodComments)
      
    } catch(err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (!loadInfo){
      animLine.reset()
      lineLoadAnim.setValue(-200)
    }
    loadInfo &&
    animLine.start()
  }, [loadInfo])

  const animLine = useRef(
    Animated.loop(
        Animated.timing(
          lineLoadAnim, 
          {
            toValue: winWidth + 70,
            duration: 2000,
            useNativeDriver: true
          }
        ) )).current
      
  useEffect(() => {
    setLoadInfo(true)
    setCommentForm({stars: 5, text: '' })
    setScreenParams({toScreen: route.params.isCart ? 'CartProd' : 'Products', screenParams: 
    {search: route.params.search ? true : false,
      searchText: route.params.search ? route.params.searchText : false,
      category: route.params.item.category, 
      subCategory: route.params.subCat, scrollToId: route.params.index%2===0 ?
       route.params.index/2 : route.params.index/2-0.5 }})
    
    setGoBackProps({stack: false, hasParams: true, isGoBack: route.params.main ? true : false})
    setPerf([])
    fetchInfo()
    }, [route.params]
  )
  const addToCart = async () => {
    try {
      setIsCart(true)
      const updateCart = await DataStore.query(Cart, c => c.owner('eq', userId))
      await DataStore.save(
        Cart.copyOf(updateCart[0], updated => {
          updated.productsId = [...updateCart[0].productsId].includes(route.params.item.id) ?
          [...updateCart[0].productsId] : [...updateCart[0].productsId, route.params.item.id]
        })
      )
    } catch (error) {
      console.log(error)
    }
  }
  const StarsSelect = () => {
    const arr = [1, 2, 3, 4, 5]
    return (<View style={{flexDirection: 'row', marginLeft: 20}}>
      {arr.map((item) => 
        <TouchableOpacity key={item} style={{marginHorizontal: 4}}
        onPress={() => setCommentForm(prev => {return{ text: prev.text, stars: item }} )}
         activeOpacity={0.7}>
          {commentForm.stars >= item ? 
          <Icon name='star'
          color='#de1623' size={35} />
          :
          <Icon key={item} name='star-o'
           color='#de1623' size={35} />}
        </TouchableOpacity>
      )}
    </View>)
  }

  const createComment = async() => {
    try {
      const updateItem = await DataStore.query(Product, route.params.item.id)
      await DataStore.save(
        Product.copyOf(updateItem, updated => {
          updated.commentators = updateItem.commentators ? 
          [...updateItem.commentators, userId] :
          [userId],
          updated.stars = updateItem.stars ? [...updateItem.stars, commentForm.stars] 
          : [commentForm.stars],
          updated.totalStars = updateItem.stars ? [...updateItem.stars, 
            commentForm.stars].reduce((a, b) => a+b) / 
          [...updateItem.stars&&updateItem.stars, commentForm.stars].length :
          Number(commentForm.stars)
        })
      )
      const createAt = new Date
      createAt.setHours(createAt.getHours() + 5)
      createAt.setMonth(createAt.getMonth() + 1)
      const correctDate = createAt.getDate()+'-'+createAt.getMonth()+'-'+createAt.getFullYear()
      const newCom = await DataStore.save(new Comment({prodID: updateItem.id,
        owner: userId, username: Auth.user.attributes.name, 
         commentText: commentForm.text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').trim(), stars: Number(commentForm.stars), 
          createDate: correctDate}))
      setComments(prev => [...prev, newCom])

    } catch (error) {
      console.log(error)
    }
  }

  const delComment = async(delCom) => {
    try {
      const updateItem = await DataStore.query(Product, route.params.item.id)
      const com = await DataStore.query(Comment, delCom.id)
      await DataStore.save(
        Product.copyOf(updateItem, updated => {
          const arr = [...updateItem.stars]
          arr.splice(updateItem.stars.findIndex((a) => a === delCom.stars), 1)
          updated.commentators = updateItem.commentators.filter(a => a !== userId),
          updated.stars = arr,
          updated.totalStars = ([...updateItem.stars].reduce((a, b) => a+b) - delCom.stars) / ([...updateItem.stars].length-1)
        })
      )
      await DataStore.delete(com)
      setComments(prev => prev.filter(a => a.id !== delCom.id))
    } catch (error) {
      console.log(error)
    }
  }

  const goSignUp = () => {
    navigation.navigate('SignUp', {fromScreen: route.name, screenParam: {
      item: route.params.item,
      imgRender: route.params.imgRender,
      index: route.params.index,
      subCat: route.params.subCat,
      search: route.params.search ? true : false,
      searchText: route.params.search ? route.params.searchText : false,
    } })
  }

  const RenderComments = (props) => {
    const {item, index} = props
    return (
      <View style={{marginBottom: 10}}>
      <View style={{ borderRadius: 5, paddingVertical: 8, paddingHorizontal: 4, minHeight: 100, backgroundColor: '#e5e5e5', paddingBottom: 15}}>
        <View style={{flexDirection: 'row', marginHorizontal: 5, alignItems: 'center'}}>
          <View style={{borderRadius: 40, backgroundColor: index%2===0 ? '#de8787' : '#878ade',
           width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#fcfcfc', fontWeight: 'bold', fontSize: 17}}>{item.username[0]}</Text>
          </View>
          <View>
            <Text style={[styles.txtBottomEl, {marginRight: 135,fontWeight: '600', marginLeft: 10}]}>{item.username}</Text>
            <Text style={[styles.txtBottomEl, {fontWeight: '600', marginLeft: 10, fontSize: 11.5}]}>
              {item.createDate}</Text>
          </View>
          <View style={{position: 'absolute', flexDirection: 'row', right: 10, top: 10}}>
            <StarsRender totalStars={item.stars}/>
          </View>
        </View>
        <Text style={[styles.txtBottomEl, {fontWeight: '600', marginLeft: 10, fontSize: 16,}]}>{item.commentText}</Text>
      </View>
      {(isAuth && userId === item.owner || isAdmin) &&
      <View style={{ width: 70, alignSelf: 'flex-end', padding: 1, paddingHorizontal: 5, backgroundColor: '#e5e5e5', 
         transform: [{translateY: -1}, {translateX: -15}], borderBottomLeftRadius: 10, borderBottomRightRadius: 10, alignItems: 'center'}}>
        <TouchableOpacity onPress={() => delComment(item)}>
          <Icon name='remove' color='#de1623' size={30} />
        </TouchableOpacity>
      </View>}
      </View>
    )
  }
  return (
    <ScrollView ref={scrollRef} style={styles.container} nestedScrollEnabled>
      <Modal
      animationType='fade'
      visible={visible}
      style={{flex: 1}}
      >
      <TouchableOpacity onPress={() => setVisible(false)}
      style={styles.closeBtn}>
        <Icon name="close" size={50} color="#f2054c" />
      </TouchableOpacity>
      <ReactNativeZoomableView
      zoomEnabled={true}
      maxZoom={1.5}
      minZoom={1}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      style={[styles.centerView, {backgroundColor: '#cfcfcf'}]}>
        <Image
        source={{uri: route.params.imgRender}}
        style={{flex: 1}}
        resizeMode='contain'
        />
      </ReactNativeZoomableView>
      <Text style={styles.diamantBottom}>ДИАМАНТ</Text>
      </Modal>
      <TouchableOpacity style={styles.imageContainer}
      onPress={() => setVisible(true)}
      activeOpacity={1}>
        <Image
          source={{uri: route.params.imgRender}}
          style={{flex: 1, borderRadius: 8}}
          resizeMode='contain'
        />
        <Icon style={styles.closeBtn} name="search-plus" size={50} color="#f2054c"/>
      </TouchableOpacity>
      {!loadInfo ? 
      <>
      <Text style={styles.nameS}>{route.params.item.name}</Text>
      <View style={styles.lineS}></View>
      <View style={styles.costBuyContainer}>
        <View style={styles.costBuyView}>
          <View>
            {route.params.item.discount ?
            <Text style={[styles.costS, {textDecorationLine: 'line-through',
            fontSize: 14, color: '#595959' }]}>
              { route.params.item.cost + ' руб.'}
            </Text> : <></>}
            <Text style={styles.costS}>
              {route.params.item.discount ?
              route.params.item.cost - route.params.item.cost * 
              (route.params.item.discount / 100) + ' руб.'
              : route.params.item.cost + ' руб.'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => isAuth ? !isCart && addToCart() : 
            goSignUp()}
          style={[styles.addcartS, isCart  && isAuth && {backgroundColor: 'transparent'}]} activeOpacity={.5}>
            <Text style={{color: isCart && isAuth ? '#6b6b6b' : '#f2f2f2', fontSize: 19}}>
              {isCart && isAuth ? 'УЖЕ В КОРЗИНЕ' : 'В КОРЗИНУ'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.costBuyView}>
          <Text style={{fontSize: 13, fontWeight: '400', color: '#666', flex: 1}}>ЦЕНА ЗА ЕДИНИЦУ / ШТ</Text>
          <Pressable style={({ pressed }) => [styles.addcartS, {backgroundColor: pressed ? '#b80713' : 'transparent',
          borderWidth: 2, top: pressed ? 2 : 0, borderColor: '#666060'}]}
          activeOpacity={.5}>
            {({ pressed }) => (
            <Text style={{color: pressed ? '#f2f2f2' : '#666060', fontSize: 19}}>КУПИТЬ</Text>
            )}
          </Pressable>
        </View>
      </View>
      <Text style={{fontSize: 13, fontWeight: '400', color: '#666', flex: 1, marginHorizontal: 10, marginBottom: 10}}>
        Цена действительна только для интернет-магазина и может отличаться от цен в розничных магазинах
      </Text>
      <View style={styles.lineS}></View>
      <View style={{flexDirection: 'row', marginTop: 8, marginHorizontal: 5}}>
        <TouchableOpacity onPress={() => setIsPerfDescr(true)}
        style={isPerfDescr ? styles.activeToggleBtnS : styles.toggleBtnS}>
          <Text>ОПИСАНИЕ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsPerfDescr(false)}
        style={!isPerfDescr ? styles.activeToggleBtnS : styles.toggleBtnS}>
          <Text>НАЛИЧИЕ</Text>
        </TouchableOpacity>
      </View>
      {isPerfDescr ? 
        <View>
          {perf.map((item, index) => {
            return <View style={styles.prefAvailContainer}
            key={index.toString()}>
              <Text style={{maxWidth: '40%'}}>{item.title}</Text>
              <View style={[styles.lineS, {marginHorizontal: 10, flex:1 }]}></View>
              <Text style={{maxWidth: '40%'}}>{item.value}</Text>
            </View>
          })}
        </View>
        :
        <View>
          {route.params.item.availability.map((item, index) => {
            return <View key={index.toString()}>
              <View style={styles.prefAvailContainer}
            key={index.toString()}>
                <Text style={{maxWidth: '50%'}}>{availabilityNames[index]}</Text>
                <View style={[styles.lineS, {marginHorizontal: 10, flex:1 }]}></View>
                  {item ? 
                  <View style={{maxWidth: '30%', flexDirection: 'row', alignItems: 'center'}}>
                    <Icon style={{marginRight: 5}} name="check" size={15} color="#56eb10"/>
                    <Text>В наличии</Text>
                  </View>
                  :
                  <View style={{maxWidth: '30%', flexDirection: 'row', alignItems: 'center'}}>
                    <Icon style={{marginRight: 5}} name="times-circle" size={15} color="#696969"/>
                    <Text>Под заказ</Text>
                  </View>
                  }
              </View>
            </View>
          })}
        </View>
      }
      <View style={[styles.lineS, {marginBottom: 20, marginTop: 15}]}></View>
      <View style={{marginBottom: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <View style={{flex: 1.3}}>
            <View style={{marginVertical: 3, flexDirection: 'row'}}>
              <StarsRender totalStars={comments.length > 0? 
            (comments.reduce((a, b) => a+b.stars, 0) / comments.length).toFixed(1) : 0} />
            </View>
            <Text style={styles.starAndComCount}>{comments.length > 0? 
            (comments.reduce((a, b) => a+b.stars, 0) / comments.length).toFixed(1) : 0}</Text>
            <Text style={styles.txtBottomEl}>оценка</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.starAndComCount}>{comments ? 
             comments.length
              : '0'}</Text>
            <Text style={styles.txtBottomEl}>{(comments.length > 0 && comments.length <= 4) 
             ? comments.length == 1 ? 'отзыв' : 'отзыва' : 'отзывов'}</Text>
          </View>
          <View style={{width: 125}}>
          {(isAuth && comments?.find(a => a.owner===userId)) ? 
            <View style={{alignItems: 'center'}}>
              <Icon name='check-circle-o' color='#00ff00' size={38} />
              <Text style={[styles.txtBottomEl, {textAlign: 'center', color: '#00ff00'}]}>спасибо</Text>
            </View>
            :
            isAuth ? 
            <TouchableOpacity style={{alignItems: 'center'}}
            onPress={() => setComVisible(true)}>
              <Icon name='comments-o' color='#de1623' size={38} />
              <Text style={[styles.txtBottomEl, {textAlign: 'center'}]}>оставить отзыв</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{alignItems: 'center'}}
            onPress={() => goSignUp()}>
              <Icon name='comments-o' color='#de1623' size={38} />
              <Text style={[styles.txtBottomEl, {textAlign: 'center'}]}>оставить отзыв</Text>
            </TouchableOpacity>}
          </View>
        </View>
        <View style={[styles.lineS, {marginBottom: 10, marginTop: 15}]}></View>
        <Text style={styles.commentTitle}>Отзывы</Text>
        <View style={{backgroundColor: '#ebebeb', paddingVertical: 15, borderRadius: 10}}>
          <ScrollView nestedScrollEnabled
           showsVerticalScrollIndicator={false}
           style={{maxHeight: 400, marginHorizontal: 15}}>
          { comments.length>0 ? comments.map((item, index) => 
            <RenderComments item={item} index={index} key={index}/>)
            :
            <View>
              <Text style={{textAlign: 'center', fontSize: 18, color: '#3d3d3d'}}>
                Оставьте первый отзыв!</Text>
            </View>
          }
          </ScrollView>
        </View>
        <View style={[styles.lineS, {marginBottom: 10, marginTop: 15}]}></View>
        <Modal visible={comVisible} 
        transparent={true}
        animationType='fade'>
          <Pressable onPress={() => setComVisible(false)}
          style={{backgroundColor: '#82828295', flex: 1, 
           alignItems: 'center', justifyContent: 'center'}}>
             <KeyboardAvoidingView style={styles.modalContainer}>
             <Pressable style={{flex: 1}} onPress={() => {return null}}>
             <View>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Text style={styles.commentTitle}>Ваш отзыв </Text>
                <Icon style={{marginHorizontal: 1.5}}
                name={commentForm.stars>3 ? 'smile-o' : commentForm.stars>1 ? 'meh-o' : 'frown-o' } 
                color={commentForm.stars>3 ? '#18d637' : commentForm.stars>1 ? '#d6d018' : '#d61818'} size={30} />
              </View>
              <StarsSelect />
              <View style={{width: '90%', alignSelf: 'center'}}>
                <TextInput 
                maxLength={limitLetters}
                placeholder='Ваш отзыв должен быть длиннее 10 символов'
                autoFocus
                style={styles.textInput}
                multiline
                value={commentForm.text}
                onChangeText={txt => setCommentForm(prev => {return{stars: prev.stars, text: txt }} )} 
                />
                <Text style={{position: 'absolute', bottom: 5, right: 8}}>
                  { `${commentForm.text.length}/${limitLetters}` }</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 6}}>
                <TouchableOpacity disabled={commentForm.text.length < 10} onPress={() => {createComment()
                setComVisible(false)
                setCommentForm({stars: 5, text: '' })}}
                style={{ marginTop: 5, padding: 10, backgroundColor: commentForm.text.length < 10 ? '#b0cfb3' : '#00ff00', borderRadius: 5}}>
                  <Text style={{color: '#fafafa', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.3}}>Готово</Text>
                </TouchableOpacity>
              </View>
             </View>
             </Pressable>
             </KeyboardAvoidingView>
          </Pressable>
        </Modal>
      </View>
      </> : 
      <View style={{flexWrap: 'wrap', marginTop: 20}}>
        <AnimLinearGrad style={[styles.animLine, {transform: [{translateX: lineLoadAnim},
        { rotateX: "21deg" },{ rotateZ: "21deg" }] }]} colors={['#00000000',
          '#f1f1f1', '#f1f1f1', '#00000000']} start={{x: 0.0, y: 0}} end={{x: 1.0, y: 0.0}}
        />
        <View style={[styles.emptyLine, {height: 30, width: '70%', alignSelf: 'center', marginTop: 35,}]}></View>
        <View style={{flexDirection: 'row'}}>
          <View style={[styles.emptyLine, {height: 24, width: '50%', marginRight: 30}]}></View>
          <View style={[styles.emptyLine, {height: 24, width: '25%'}]}></View>
        </View>
        <View style={[styles.emptyLine, {height: 24, width: '40%', marginLeft: 20}]}></View>
        <View style={[styles.emptyLine, {height: 20, width: '90%'}]}></View>
        <View style={[styles.emptyLine, {height: 20, width: '94%'}]}></View>
        <View style={[styles.emptyLine, {height: 20, width: '80%'}]}></View>
        <View style={[styles.emptyLine, {height: 20, width: '30%'}]}></View>
      </View>}
    </ScrollView>
  )
  
}

export const StarsRender = (props) => {
  const arr2 = [1, 2, 3, 4, 5]
  const arr1 = [0.5, 1.5, 2.5, 3.5, 4.5]
  if (props.totalStars==='none') {
    return (<>
      {arr2.map((item) => 
        <Icon key={item} style={{marginHorizontal: 1.5}} name='star-o'
         color='#de1623' size={15} />
      )}
    </>)
  } else {
    return (<>
      {arr2.map((item, index) => 
        props.totalStars >= item ?
        <Icon key={item}
         style={{marginHorizontal: 1.5}} name='star' color='#de1623' size={15} />
        :
        props.totalStars >= arr1[index] ? 
        <Icon key={item}
         style={{marginHorizontal: 1.5}} name='star-half-o' color='#de1623' size={15} />
        :
        <Icon key={item}
         style={{marginHorizontal: 1.5}} name='star-o' color='#de1623' size={15} />
      )}
    </>)
  }
}

const styles = StyleSheet.create({
  centerView: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1'
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 18,
    zIndex: 5
  },
  imageContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ededed',
    height: 310,
    borderRadius: 8,
  },
  diamantBottom: {
    position: 'absolute',
    width: '100%',
    bottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#e3222f',
    letterSpacing: 14,
  },
  nameS: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    color: '#3b3b3b',
    marginHorizontal: 10,
    marginVertical: 10
  },
  costBuyContainer: {
    padding:5,
  },
  costBuyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  costS: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  addcartS: {
    backgroundColor: '#eb2a37',
    padding: 7,
  },
  toggleBtnS: {
    padding: 10,
    backgroundColor: '#dedede',
    flex: 1,
    alignItems: 'center'
  },
  activeToggleBtnS: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: '#ed0919',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    flex: 1
  },
  lineS: {
    width: '100%',
    borderTopColor: '#a1a1a1', 
    borderTopWidth: 1,
    minWidth: 50,
    marginBottom: 5
  },
  prefAvailContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginVertical: 7,
  },
  emptyLine: {
    backgroundColor: '#e3e3e3',
    borderRadius: 20,
    marginVertical: 10,
  },
  animLine: {
    position: 'absolute', 
    height: 400, 
    width: 170,
    zIndex: 5,
    top: -30
  },
  starAndComCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 4
  },
  txtBottomEl: {
    color: '#4d4d4d',
    fontSize: 16,
    fontWeight: '700'
  },
  commentTitle: {
    fontSize: 20, 
    textAlign: 'center', 
    fontWeight: '700', 
    color: '#2e2e2e',
    marginBottom: 10
  },
  modalContainer: {
    width: '90%', 
    height: winHeight / 2.5,
    minHeight: 250,
    backgroundColor: '#ededed',
    borderRadius: 15,
    padding: 5
  },
  textInput: {
    width: '100%',
    height: winHeight / 2.5 - 150,
    backgroundColor: '#fafafa',
    textAlignVertical: 'top',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderColor: '#cfcfcf',
    borderWidth: 1.5,
    fontSize: 17,
    color: '#303030'
  }
})

export { ProductDetail }