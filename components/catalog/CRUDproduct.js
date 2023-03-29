import React, { useState, useContext, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView,
   Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { launchImageLibrary} from 'react-native-image-picker'
import { DataStore } from '@aws-amplify/datastore'
import { Storage } from 'aws-amplify'
import { Product,Performance, Cart } from '../../src/models'
import { nanoid } from 'nanoid/non-secure'
import { cats, subCats, availabilityNames } from './cats'
import { useFocusEffect } from '@react-navigation/native'
import { Context } from '../nav/context'
const winWidth = Dimensions.get('window').width

const CRUDproduct = ({route, navigation}) => {
  const initProd = {name: '',
  image: '', performance: [{title: '', value: ''}], cost: '',
   availability: [false, false, false, false], category: '',
    subCategory: [], subCategoryId: 0, imgFile: '',
     discount: '', article: '' }
  const [prod, setProd] = useState(initProd)
  const [error, setError] = useState('')
  const {setGoBackVisible, setScreenParams, setGoBackProps} = useContext(Context)

  const fetchPerf = async () => { 
    const performance = (await DataStore.query(Performance)).filter(c => c.prod.id === route.params.item.id)
    setProd(prev => {return {...prev, performance: performance}})
  }

  useFocusEffect(
    React.useCallback(() => {
      subCats.map((a) => a[0] === '' ? a.shift() : a)
      setGoBackVisible(true)
      setGoBackProps({stack: false, hasParams: false, isGoBack: true})
      if(route.params) {  
        setScreenParams({toScreen: 'Products', screenParams: 
        {search: route.params.search ? true : false,
          searchText: route.params.search ? route.params.searchText : false,
          category: route.params.item.category, 
          subCategory: route.params.subCat, scrollToId: route.params.index%2===0 ?
          route.params.index/2 : route.params.index/2-0.5 }})
        setGoBackProps({stack: false, hasParams: true, isGoBack: false})
        const {name, image, category, cost,
          availability, subCategory, subCategoryId, discount, 
           article} = route.params.item
        setProd({name: name, image: image, imgFile: route.params.imgRender, 
          category: category, cost: cost.toString(), availability: availability, 
          subCategory: subCategory, subCategoryId: subCategoryId, discount: 
          discount.toString(), article: article})
        fetchPerf()
      } 
      return () => {
        setGoBackVisible(false)
        setProd(initProd)
      }
    }, [route.params])
  )

  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo'
    })
    if (!result.didCancel) {
      setProd((prevState) => ({...prevState, image: result.assets[0].uri, imgFile: ''}))
    }
  }

  const saveProd = async () => {
    try {
      const { name, image, category, performance, cost,
       availability, subCategory, subCategoryId, discount, article } = prod
      const img = await (await fetch(image)).blob()
      let url = undefined

      if (route.params && route.params.item.image !== image) {
        url = `products/${nanoid()}${image.split('/').reverse()[0]}`
        await Storage.remove( route.params.item.image)
      } else if(route.params) { url = route.params.item.image }
      else { url = `products/${nanoid()}${image.split('/').reverse()[0]}` }
      
      const saveProd = await DataStore.save(new Product({image: url, name: name,
         cost: Number(cost), availability: availability,
         category: category, subCategory: subCategory, subCategoryId: subCategoryId,
         discount: Number(discount), article: article
      }))
      performance.map( async (it) =>
       await DataStore.save(new Performance({prodID: saveProd.id,
         title: it.title, value: it.value})))
      await Storage.put(url, img, { contentType: 'image'})
      setError('')
      setProd(initProd)
    } catch(err) {
      setError('Ошибка:\nЗаполните все поля(подкатегории и скидки не обязательно)')
    }
  }

  const delProd = async() => {
    Alert.alert('Подтвердите', 'Вы точно хотите удалить этот товар?',
    [{text: 'Да', onPress: async () => {
    try {
      const delItem = await DataStore.query(Product, route.params.item.id)
      const updateCart = await DataStore.query(Cart)
      updateCart.map(async(cart) => 
        await DataStore.save(
          Cart.copyOf(cart, updated => {
            updated.productsId = [...cart.productsId].filter( a => a !== route.params.item.id)
        }))
      )
      await DataStore.delete(delItem)
      await Storage.remove( route.params ? route.params.item.image : delItem.image)
      navigation.navigate('MainDrawer', {
        screen: 'Products', initial: false, params: {
          category: route.params.item.category,
          subCategory: route.params.subCat ? route.params.subCat : false,
          search: route.params.search ? true : false,
          searchText: route.params.search ? route.params.searchText : false
        } })
    } catch (err) {
      console.log(err)
    }
    }},
    {text: 'Отмена'} ])
  }
  const updateProd = async() => {
    try {
      const { name, image, category, performance, cost,
        availability, subCategory, subCategoryId, discount, article } = prod
      const updateItem = await DataStore.query(Product, route.params.item.id)
      let url = undefined
      let img = undefined

      if (route.params && route.params.item.image !== image) {
        url = `products/${nanoid()}${image.split('/').reverse()[0]}`
        await Storage.remove( route.params.item.image)
        img = await (await fetch(image)).blob()
        await Storage.put(url, img, { contentType: 'image'})
      } else if(route.params) { url = route.params.item.image }
      else { 
        url = `products/${nanoid()}${image.split('/').reverse()[0]}`
        img = await (await fetch(image)).blob()
        await Storage.put(url, img, { contentType: 'image'})
      }
      await DataStore.save(
        Product.copyOf(updateItem, updated => {
          updated.name = name,
          updated.image = url,
          updated.category = category,
          updated.cost = Number(cost),
          updated.availability = availability,
          updated.subCategory = subCategory,
          updated.subCategoryId = subCategoryId,
          updated.discount = Number(discount), 
          updated.article = article
        })
      )
      const delPerformance = (await DataStore.query(Performance)).filter(c => c.prod.id === route.params.item.id)
      delPerformance.map(async(it) =>
      await DataStore.delete(it))
      performance.map( async (it) =>
       await DataStore.save(new Performance({prodID: updateItem.id,
         title: it.title, value: it.value}))) 
      navigation.navigate('MainDrawer', {
        screen: 'Products', initial: false, params: {
          category: route.params.item.category,
          subCategory: route.params.subCat ? route.params.subCat : false,
          scrollToId: route.params.index%2===0 ?
           route.params.index/2 : route.params.index/2-0.5,
          search: route.params.search ? true : false,
          searchText: route.params.search ? route.params.searchText : false
        } })
    } catch (err) {
        console.log(err)
    }
  }


  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => pickImage()}>
        <Text style={{ alignSelf: 'center', padding: 14, fontSize: 18, color: 'red' }}>
          { prod.image != '' ? 'Поменять фото' : 'Выбрать фото товара'}
        </Text>
      </TouchableOpacity>
      {prod.image != '' &&
        <Image source={{ uri: prod.imgFile !== '' ? prod.imgFile : prod.image }}
         style={{ width: winWidth * 0.7, height: winWidth * 0.7 * 0.7, marginBottom: 18, alignSelf: 'center' }}
        />}
      <TextInput style={styles.nameCostInput} 
      placeholder='Название товара' value={prod.name} 
      onChangeText={(txt) => setProd((prev) => {return {...prev, name: txt}
      })}/>
      <TextInput style={styles.nameCostInput} 
      placeholder='Цена товара' value={prod.cost} 
      onChangeText={(txt) => setProd((prev) => {return {...prev, cost: txt}
      })}
      keyboardType = 'numeric'/>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput maxLength={prod.discount?.startsWith('1') ? 3 : 2}
        style={[styles.nameCostInput, {width: 40, textAlign: 'center', 
         alignSelf: 'flex-start', marginLeft: '10%'}]} 
        placeholder='0' value={prod.discount} 
        onChangeText={(txt) => setProd((prev) => {return {...prev, discount: txt.trim()}
        })}
        keyboardType = 'numeric'/>
        <Text style={{fontSize: 17, fontWeight: '600'}}> — Скидка(%)</Text>
      </View>
      <Text style={{fontSize: 17, fontWeight: '600', textAlign: 'center'}}>
  Итоговая цена: {prod.cost - prod.cost * (prod.discount / 100)}</Text>
      <TextInput style={styles.nameCostInput} 
      placeholder='Артикул' value={prod.article} 
      onChangeText={(txt) => setProd((prev) => {return {...prev, article: txt}
      })}/>
      <View style={styles.perfInputsContainer}>
        <Text style={styles.title}>Характеристики товара</Text>
        <Text style={{ marginLeft: 10 }}>Например: Вес - 43гр</Text>
        {prod.performance && prod.performance.map((perf, i) => {
          return (
            <View style={{flexDirection: 'row', alignItems: 'center'}} key={i.toString()}>
              <TextInput placeholder='Параметр'
              value={prod.performance[i].title} 
              onChangeText={ (txt) => setProd((prev) => {return {...prev,
                performance: prev.performance.map((item, id) =>
                {return { title: id == i ? txt : item.title,
                  value: item.value }}  )} 
              })}
              style={styles.perfInputs} /><Text style={{fontWeight: 'bold', fontSize: 22}}>-</Text>
              <TextInput placeholder='Значение'
              value={prod.performance[i].value} 
              onChangeText={ (txt) => setProd((prev) => {return {...prev,
                performance: prev.performance.map((item, id) =>
                {return { title: item.title,
                  value: id == i ? txt : item.value }}  )} 
                  })} 
              style={styles.perfInputs} />
            </View>
          )
        })}

        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
          { prod.performance && prod.performance.length > 1 &&
          <TouchableOpacity style={styles.incrDecr}
          onPress={() => setProd((prev) => {return {...prev,
            performance: prev.performance.slice(0, -1)
          }
          })}>
            <Icon name='minus' size={20} color='#3d3d3d'/>
          </TouchableOpacity>}
          <TouchableOpacity style={styles.incrDecr}
          onPress={() => setProd((prev) => {return {...prev,
            performance: [...prev.performance, {title: '', value: ''}]
          }
          })} >
            <Icon name='plus' size={20} color='#3d3d3d'/>
          </TouchableOpacity>
        </View>
        
      </View>
      <Text style={styles.title}>Наличие:</Text>
      { prod.availability.map((avail, i) => {
        return(
        <View key={i.toString()}>
          <TouchableOpacity onPress={() => {
           setProd((prev) => {return {...prev,
            availability: prev.availability.map((item, id) => id == i ? !item : item) }})
          }} style={{flexDirection: 'row-reverse',
           alignItems: 'center', justifyContent: 'space-between', marginVertical: 5}}>
            { prod.availability[i] ?
            <Icon name='check-square-o' size={30} color='#1af03e'/> :
            <Icon name='square-o' size={30} color='#f01a33'/>}
            <Text style={{ fontSize: 16 }}>{ availabilityNames[i] }</Text>
          </TouchableOpacity>
        </View>)
      }) }
      <Text style={styles.title}>Выберите категорию товара</Text>
      {cats.map((item, id) => {
        return (
          <TouchableOpacity key={id.toString()} onPress={() => {setProd((prev) => {
            return {...prev, category: item, subCategoryId: id, subCategory: []}
          })}}
          style={styles.itemInList}
          >
            <Text style={{ fontSize: 16,
               color: prod.category === item ? '#F61212':'#323131' }}>
                 {item}
            </Text>
          </TouchableOpacity>
        )
      })}
      {(prod.category != '' && subCats[prod.subCategoryId].length > 1) && <Text style={styles.title}>Выберите подкатегорию(и)</Text>}
      { prod.category != '' ?
       subCats[prod.subCategoryId].map((item, id) => {
         return (
          <TouchableOpacity key={id.toString()} onPress={() => {setProd((prev) => {
          if (prev.subCategory.filter((subItem) => subItem === item).length < 1){
            return {...prev, subCategory: [...prev.subCategory, item]}
          } else {
            return {...prev, subCategory: prev.subCategory.filter((subItem) => subItem !== item)}
          }
          })}}
          style={styles.itemInList}
          >
            <Text style={{ fontSize: 16,
              color: prod.subCategory.filter((subItem) => subItem === item).length >= 1 ? '#F61212':'#323131' }}>
                {item}
            </Text>
          </TouchableOpacity>
        )
       }) : null}
      <Text style={{ fontSize: 17, color: 'red', textAlign: 'center' }}>{error}</Text>
      <View style={styles.operationProdContainer}>
        <TouchableOpacity style={styles.upSaveProd}
          onPress={() => saveProd()}>
          <Text style={{ fontSize: 16 }}>Создать</Text>
          <Icon style={{ marginRight: 5 }} name="check-circle-o" size={30} color="red" />
        </TouchableOpacity>
        { route.params && 
        <>
        <TouchableOpacity style={styles.upSaveProd}
          onPress={() => updateProd()}>
          <Text style={{ fontSize: 16 }}>Обновить</Text>
          <Icon style={{ marginRight: 5 }} name="arrow-circle-o-up" size={30} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.upSaveProd}
          onPress={() => delProd()}>
          <Text style={{ fontSize: 16 }}>Удалить</Text>
          <Icon style={{ marginRight: 5 }} name="trash-o" size={30} color="red" />
        </TouchableOpacity></>}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: '#232323',
    fontWeight: '700',
    marginVertical: 7,
  },
  perfInputs: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#A09603',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    marginVertical: 8,
    backgroundColor: '#FEFCD8',
    fontSize: 16,
  },
  perfInputsContainer: {
    flexDirection: 'column', 
    marginVertical: 10,
    backgroundColor: '#DAD9D9',
    borderRadius: 5,
  },
  incrDecr: {
    padding: 8,
    margin: 5,
  },
  itemInList: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1B1111',
    alignItems: 'center'
  },
  nameCostInput: {
    fontSize: 17,
    alignSelf: 'center',
    width: '80%', 
    borderBottomColor: 'red', 
    borderBottomWidth: 1,
    marginVertical: 7,
  },
  upSaveProd: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    flex: 1,
    minWidth: winWidth * 0.4,
    marginVertical: 10,
  },
  operationProdContainer: {
    marginVertical: 20,
    flexDirection: 'row', 
    justifyContent: 'center', 
    flexWrap: 'wrap'
  }
})

export { CRUDproduct }