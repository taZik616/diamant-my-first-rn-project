import React, {useState, useEffect, useContext, useRef} from 'react'
import { TouchableOpacity, StyleSheet, FlatList, TextInput,
 View, Text, Image, Pressable, Animated, Dimensions, ScrollView, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore'
import { Storage, Auth } from 'aws-amplify'
import { Product } from '../../src/models'
import { Loader } from '../Loader'
import Tooltip from 'react-native-walkthrough-tooltip'
import { Context } from '../nav/context'
import { StarsRender } from './ProductDetail'
import { Circle } from 'react-native-animated-spinkit'

const CARD_HEIGHT = 280
const PADDING = 0
const MARGIN = 20
const FULL_CARD_HEIGHT = CARD_HEIGHT + PADDING*2 + MARGIN*2
const isCorrectWidth = Dimensions.get('window').width > 345 ? true : false
const winWidth = Dimensions.get('window').width
const colNum = isCorrectWidth ? 2 : 1

function Products({ route, navigation }) {
  const [data, updateProd] = useState([])
  const [costSort, setCostSort] = useState({of: '0', to: '', ascending: undefined})
  const {isAuth, isAdmin} = useContext(Context)
  const [file, setFile] = useState([])
  const [prevParams, setPrevParams] = useState('')
  const [dataLimit, setDataLimit] = useState(5)
  const [load, setLoad] = useState(true)
  const [rateSort, setRateSort] = useState(undefined)
  const [letterSort, setLetterSort] = useState(undefined)
  const [tooltipVis, setTooltipVis] = useState(
    {cost: false, rate: false })
  const scrollY = useRef(new Animated.Value(0)).current
  const scrollRef = useRef()


  const fetchProd = async () => {
    try {
      const mess = await DataStore.query(Product,
        c => c.or(
          route.params.search ? 
          c => c.name('contains', route.params.searchText.toLowerCase().slice(1) )
          .category('contains', route.params.searchText.toLowerCase().slice(1))
          .subCategory('contains', route.params.searchText)
          : Predicates.ALL
        ).or( 
         (Number(costSort.of) < Number(costSort.to) &&
          costSort.to !=='' && costSort.of !=='') ?
           c =>  c.cost('between', [Number(costSort.of), Number(costSort.to)])
            : Predicates.ALL
        ).or(
          c => !route.params.search && route.params.category === route.params.subCategory ?
           c.category('eq', route.params.category) : Predicates.ALL
        ).or(
          c => !route.params.search && route.params.subCategory ? c.subCategory(route.params.category === 
            route.params.subCategory ? 'notContains' :'contains', route.params.subCategory)
              : Predicates.ALL
        ),
        {
          limit: dataLimit,
          sort: s => costSort.ascending !== undefined ?
          s.cost(costSort.ascending ? SortDirection.ASCENDING : SortDirection.DESCENDING)
          : letterSort !== undefined ? s.name(letterSort ? SortDirection.ASCENDING : 
            SortDirection.DESCENDING) : rateSort !== undefined ? s.totalStars(rateSort ? SortDirection.ASCENDING : 
              SortDirection.DESCENDING) : s
        }
      )
      mess.map(async (item) =>{
        const imageKey = await Storage.get(item.image)
        setFile(prev => prev.find((failik) => failik.id === item.id) ?
        prev : [...prev, {image: imageKey, id: item.id}] ) 
      })
      setLoad(false)
      setPrevParams(route.params.subCategory)
      updateProd(mess) //кароч тут сделаешь проверку load && и вон там снизу будешь делать updateProd([])
    } catch(err) {
      console.log(err)
    }
  }


  useEffect(() => {
    dataLimit > 5 &&
    fetchProd()
  }, [dataLimit])

  useEffect(() => {
    fetchProd()
  }, [rateSort, letterSort, costSort])

  useEffect(() => {
      if (route.params.search || prevParams !== route.params.subCategory){
        setLoad(true)        // вот тут
        fetchProd()
        if (route.params.search ? false : true && route.params.scrollToId === undefined) {
          setDataLimit(5)
          setCostSort({of: '0', to: '', ascending: undefined})
          setLetterSort(undefined)
          setRateSort(undefined)
          data.length > 0 && scrollRef.current.scrollToIndex({animated: false, index: 0})
        }
      }
      route.params.scrollToId !== undefined &&
      scrollRef.current.scrollToIndex({animated: true, index: route.params.scrollToId})
    }, [route.params]
  )
  
  const _renderItem = ({ item, index }) => {
    const isEven = index%2===0 //even - четное
    let doobleIndex = index
    if (isCorrectWidth) {
    if (isEven && index!=0) { 
      doobleIndex = index - index/2
    }
    else if (!isEven) { 
      doobleIndex = index - index/2 - 0.5
    }}
    const offsetX = scrollY.interpolate({
      inputRange: [-1, 0,
         FULL_CARD_HEIGHT * (doobleIndex+.38),
          FULL_CARD_HEIGHT * (doobleIndex+.9)],
      outputRange: [0, 0, 0, isEven ? -(FULL_CARD_HEIGHT) : FULL_CARD_HEIGHT ],
      extrapolate: "clamp"
    })
    const opacity = scrollY.interpolate({
      inputRange: [-1, 0,
         FULL_CARD_HEIGHT * (doobleIndex+.38),
          FULL_CARD_HEIGHT * (doobleIndex+1)],
      outputRange: [1, 1, 1, 0],
      extrapolate: "clamp"
    })
    let imgRender = ''
    try {
      imgRender = file.find((failik) => failik.id === item.id).image
    } catch (error) {
      imgRender = ''
    }
    return (
        <Animated.View style={[styles.itemContainerStyle,
         { transform: [{ translateX: offsetX }, {scale: opacity}], opacity,
         maxWidth: isCorrectWidth ? winWidth/2 : winWidth, }]}>
          <Pressable style={{flex: 1}} onPress={() => goDetScreen(item, imgRender, index)}>
          { imgRender != '' ?
          <View style={{flex: 1.5}}  >
            <Image resizeMode='cover'
             style={{flex: 1, borderTopRightRadius: 5, borderTopLeftRadius: 5}}
             source={{uri: imgRender}} />
            {item.discount ? <View style={styles.circleDiscount}>
              <Text style={{color: '#333333'}}>-{item.discount}%</Text>
            </View> : <></>}
          </View> : 
            <View style={{flex: 1, 
              justifyContent: 'center', alignItems: 'center'}}>
              <Circle size={65} color="#ff0066"></Circle>
            </View>
          }
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10, margin: 4}}>
              <Text style={styles.costS}>
                {item.discount ? item.cost - item.cost * 
                (item.discount / 100) : item.cost }
              </Text>
              <Icon style={{transform: [{translateY: 1}]}} name='ruble' color='#454545' size={19} /> 
            </View>
            <View style={{flexDirection: 'row'}}>
              <StarsRender totalStars={item.totalStars? item.totalStars : 'none' } />
              <Text>{item.stars?.length > 0 ? item.stars?.length : ''}</Text>
            </View>
            <Text style={[styles.nameS, {marginHorizontal: 10} ]}
             numberOfLines={3}>{item.name}</Text>
            
          </View>
            {item.availability.includes(true) ? 
            <View style={[styles.availS, {backgroundColor: '#0bc408'}]}> 
              <Text style={{ color: '#fff'}}>В наличии</Text>
            </View> :
            <View style={[styles.availS, {backgroundColor: '#8f8f8f'}]}> 
              <Text style={{ color: '#f0f0f0', transform: [{translateY: -1}]}}>Под заказ</Text>
            </View>}
          </Pressable>
        </Animated.View>
    )
  }

  const goDetScreen = (item, imgRender, index) => {
    (isAuth &&  Auth.user.signInUserSession.accessToken.payload["cognito:groups"] != null) &&
     Auth.user.signInUserSession.accessToken.payload["cognito:groups"]
      .filter(groupItem => groupItem === 'Admins')[0] ?
    Alert.alert('Выберите вариант','Редактировать или просмотреть?',
    [{text: 'Редактировать', onPress: () => {
      navigation.navigate('CRUDproduct', route.params.search ? {
          item: item,
          imgRender: imgRender,
          search: route.params.search,
          searchText: route.params.searchText,
          index: index
        } :
        {
          item: item,
          imgRender: imgRender,
          subCat: route.params.subCategory,
          index: index
        } )
    }},
    {text: 'Смотреть', onPress: () => 
    navigation.navigate('ProductDetail', route.params.search ? {
      item: item,
      imgRender: imgRender,
      search: route.params.search,
      searchText: route.params.searchText,
      index: index
    } :
    {
      item: item,
      imgRender: imgRender,
      subCat: route.params.subCategory,
      index: index
    } )} ])
     :
    navigation.navigate('ProductDetail', route.params.search ? {
      item: item,
      imgRender: imgRender,
      search: route.params.search,
      searchText: route.params.searchText,
      index: index
    } :
    {
      item: item,
      imgRender: imgRender,
      subCat: route.params.subCategory,
      index: index
    } )
  }
  
  return (
    <View style={{flex: 1}}> 
      <Animated.ScrollView contentContainerStyle={{paddingHorizontal:10, backgroundColor: '#0000' }}
      showsHorizontalScrollIndicator={false}
      horizontal
       style={[styles.sortContainer, {transform: [{translateY: scrollY.interpolate({
        inputRange: [-1, 0, 150],
        outputRange: [0, 0, -65 ],
        extrapolate: "clamp"
      }) }],}, isAdmin && {right: 70}]}>
          <View style={[styles.sortBut, {alignSelf: 'center'}]}><Text style={{color: '#4b4e59', fontWeight: '200', fontSize: 16}}>
            Сортировка:</Text></View>
          <Tooltip
            isVisible={tooltipVis.cost}
            backgroundColor="rgba(0,0,0,0.2)"
            content={
            <View style={styles.costSortContainer}>
              <TouchableOpacity style={styles.costAscendingS}
               onPress={() => { setLoad(true)
                 setCostSort(prev =>
                {return {...prev, ascending:
                 prev.ascending===undefined ? true : !prev.ascending}})
                 setLetterSort(undefined)
                 setRateSort(undefined)}}>
                <Icon name={costSort.ascending ? 'toggle-on':"toggle-off"} size={40} color="#eb0e28"/>
                <Text style={[styles.nameS, {textAlign: 'center'}]}>Сортировать по возрастанию</Text>
              </TouchableOpacity>
              <View style={styles.costContainer}>
                <TextInput style={styles.costInputs}
                  keyboardType='numeric'
                  placeholder='от'
                  value={costSort.of}
                  onChangeText={(txt) => {setLoad(true)
                    setCostSort(prev =>
                    {return {...prev, of: txt }})
                  }}
                />
                <Text style={{fontSize: 19, fontWeight: 'bold'}}> — </Text>
                <TextInput style={styles.costInputs}
                  keyboardType='numeric'
                  placeholder='до'
                  value={costSort.to}
                  onChangeText={(txt) => {setLoad(true)
                    setCostSort(prev =>
                    {return {...prev, to: txt }})
                  } }
                />
              </View>
            </View>}
            disableShadow={true}
            contentStyle={{backgroundColor: '#e1eced'}}
            arrowSize={{ width: 16, height: 14 }}
            childContentSpacing={1}
            placement="bottom"
            showChildInTooltip={false}
            onClose={() => setTooltipVis(prev => {return{ ...prev, cost: false }
            })}
          >
            <TouchableOpacity onPress={() => 
            setTooltipVis(prev => {return{ ...prev, cost: true }})}
             style={styles.sortBut}>
              <Text>По цене <Icon name="sort-down" size={18} color="#ed2d50"/></Text>
            </TouchableOpacity> 
          </Tooltip>
          <TouchableOpacity onPress={() => {
            setLoad(true)
            setRateSort(prev => !prev)
            setLetterSort(undefined)
            setCostSort(prev =>
              {return {...prev, ascending: undefined}})
            setTimeout(() => setLoad(false), 1000)
          }} style={styles.sortBut}>
            <Text>По рейтингу <Icon name="sort-down" size={18} color="#ed2d50"/></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
          setLoad(true)
          setRateSort(undefined)
          setLetterSort(prev => 
           !prev)
          setCostSort(prev =>
            {return {...prev, ascending: undefined}})
          setTimeout(() => setLoad(false), 1000)
          }}
           style={styles.sortBut}>
            <Text>По алфавиту <Icon name="sort-down" size={18} color="#ed2d50"/></Text>
          </TouchableOpacity>
      </Animated.ScrollView>
      <Animated.FlatList 
      getItemLayout={(data, index) => (
        {length: FULL_CARD_HEIGHT, offset: FULL_CARD_HEIGHT * index, index}
      )}
      removeClippedSubviews={true}
      contentContainerStyle={styles.container}
      data={data}
      ref={scrollRef}
      renderItem={_renderItem}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      onEndReached={() => {if (data.length >= dataLimit) {setDataLimit((prev) => prev+5)
      setLoad(true)}}}
      numColumns={colNum}
      columnWrapperStyle={colNum > 1 && { justifyContent: 'center' }}
      ListFooterComponent={<View style={{height: 15}}></View>}
      onEndReachedThreshold={0.2}
      onScroll={Animated.event(
        [{
          nativeEvent: {
            contentOffset: {
              y: scrollY,
            },
          },
        }],
        {useNativeDriver: true},
      )}
      ListHeaderComponent={<>{(isAuth && isAdmin) ?
        <TouchableOpacity style={styles.createPostBtn}
          onPress={() => navigation.navigate('CRUDproduct') }>
          <Icon name="plus-square-o" size={50} color="red" />
        </TouchableOpacity> : <View style={{height: 38}}></View>}
        {(!load && data.length <= 0) && 
        <View style={styles.emptyCont}>
          <Text style={styles.emptyTxt}>Ничего не найдено</Text>
          <Icon name="meh-o" size={70} color="#eb0e28"/>
        </View>}
        </>}
      />
      {(!load && data.length > 5) &&
      <TouchableOpacity style={styles.scrollTopArrow}
      onPress={() => scrollRef.current.scrollToIndex({animated: true, index: 0})}>
        <Icon name="arrow-up" size={60} color="#ed2d50"/>
      </TouchableOpacity>
      }
      {load && <View style={{position: 'absolute', bottom: 20, width: '100%' }}><Loader/></View>}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10
  },
  createPostBtn: {
    alignSelf: 'flex-end',
    margin: 8,
  },
  itemContainerStyle: {
    height: CARD_HEIGHT, 
    padding: PADDING,
    marginVertical: MARGIN,
    marginHorizontal: 4,
    flex: 1,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  availS: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 5,
    padding: 2,
    opacity: .9,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingRight: 3,
    paddingLeft: 5,
  },
  costS: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18.5,
    color: '#2C2B2B',
    marginRight: 7
  },
  nameS: {
    fontSize: 16,
    fontWeight: '700',
    color: '#878787',
    marginHorizontal: 4
  },
  buttonDet: {
    backgroundColor: '#ef092f',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  scrollTopArrow: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    zIndex: 3,
  },
  sortContainer: {
    flexDirection: 'row',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 57,
    backgroundColor: '#0000',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    opacity: .95
  },
  sortBut: {
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 4.6,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#b0b0b0',
    alignSelf: 'center',
  },
  sortButImg: {
    marginLeft: 7.5,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  costSortContainer: {
    width: 200,
  },
  costInputs: {
    flex: 1,
    padding: 4,
    fontSize: 17,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#6e6e6e',
    marginVertical: 10
  },
  emptyTxt: {
    fontSize: 22,
    color: '#1b1838',
    fontWeight: 'bold'
  },
  emptyCont: {
    alignItems: 'center',
    marginTop: 50,
  },
  costAscendingS: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDiscount: {
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 35,
    padding: 6,
    position: 'absolute',
    bottom: 5,
    right: 5
  }
})
export { Products }
