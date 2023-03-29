import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import DropDownItem from 'react-native-drop-down-item'
import { infoStyles } from '../../styles/infoStyles'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component'

const content = (title) => {
  const widthArr = [40, 160, 140, 70]
  const tableHead = ['№п/п', 'Наименование работ', 'Стоимость', 'Время выполнения']
  const tableTitle = ['1', '2', '3', '4', '5', '6', '7',
   '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
    '18', '19', '20', '21', '22', '23']
  const tableData= [
        ['Пайка цепи, браслета', 'Золото 300 руб.\n Серебро 200 руб.', '10-15 мин.\n+10 мин. чистка'],
        ['Пайка пустотелой цепи', '350 руб.', '15 мин.'],
        ['Полировка (1 изделие) + ультразвуковая мойка', 'от 300 до 500 руб.', '15 мин.'],
        ['Увеличение / уменьшение обручального кольца', 'Женское - 250 руб.\nМужское - 300 руб.', '10 мин. + 10 мин. чистка'],
        ['Увеличение кольца', 'Женское - 250 руб.\nМужское - 300 руб.', '20 мин. + 10 мин. чистка'],
        ['Увеличение кольца путём вставки за 1 г',
         'Женское - 350 руб. + цена металла\nМужское - 400 руб. + цена металла',
          '20-30 мин. + 10 мин. чистка'],
        ['Уменьшение женского кольца', 'Простое - 250 руб.\nС камнем - 300 руб.',
         '20 мин.'],
        ['Уменьшение мужской печатки', 'Простая - до 500 руб.\nС камнем - 600 руб.',
         '20 мин.'],
        ['Пайка кольца', 'Женское - 250 руб.\nМужское - 250 руб.\nС камнями - 350 руб.',
         '20 мин.'],
        ['Пайка серьги', 'Без камней - 300 руб.\nС камнями - от 350 руб.', '20 мин.'],
        ['Пайка кулонного ушка', 'От 200 до 500 руб.', '20 мин.'],
        ['Установка часового браслета',
         'С наращиванием ушка 500-800 руб. + цена металла', '15 мин.\n1-2 дня'],
        ['Вставка камня (фианит, искусственный камень)',
         'от 150 до 400 руб. - камень\n100 руб. - работа', '10 мин.'],
        ['Ремонт изделий с полудрагоценными и драгоценными камнями',
         'Цена договорная', ''],
        ['Родирование изделий', 'от 1500 - 3000 руб.\nС чеками 1000', '30 мин.'],
        ['Замена замка', 'От 250 до 600 руб.', '10 мин.'],
        ['Замена пружины на замке', 'от 100 до 250 руб. + 50 руб. работа', '20 мин.'],
        ['Правка кольца, серьги, подвески, цепи', 'от 200 до 500 руб.', '20 мин.'],
        ['Ремонт ролексовых браслета, колье', 'от 350 до 600 руб.', 'от 30 мин.'],
        ['Наращивание крапана', 'от 300 руб.', 'от 30 мин.'],
        ['Пайка мужской печатки', '	от 450-600 руб.', '30 мин.'],
        ['Поправить штифт, 1 серьга', '50 руб.', '5 мин.'],
        ['Замена шпрингельного замка', '800 руб. + 300 руб. пайка', 'от 30 мин.']]

  switch (title){
    case 'Расчет с использованием платежных карт':
      return <Text style={styles.text}>В наших ювелирных салонах установлены терминалы для безналичной
             оплаты с использованием платежных карт банков "Сбербанк России" и
              "Газпромбанк".</Text>

    case 'Дисконтные карты':
      return <View><Text style={styles.text}>При покупке в наших ювелирных салонах товаров на сумму более 15 000
         рублей вы получаете дисконтную карту со скидкой номиналом 7%, а при покупке
          на сумму более 30 000 рублей, дисконтную карту со скидкой номиналом 10%.</Text>
          </View>
    case 'Подарочные сертификаты':
      return <View>
      <View><Text style={[styles.text,{ textAlign: 'center' }]}>Приобрести подарочный
       сертификат можно в салонах «Диамант» на 
        любую сумму:</Text></View>
        <View style={{ flex: 1,
         flexDirection: 'row', justifyContent: 'space-around',
         marginBottom: 10, marginTop: 7 }}>
          <View style={styles.cost}><Text style={{ color: '#4c4c4c' }}>
           <Text style={styles.dot}>⦁</Text> 1 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 1 500 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 2 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 3 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 4 000 руб.
          </Text></View>
          <View style={styles.cost}><Text>
           <Text style={styles.dot}>⦁</Text> 5 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 6 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 7 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 10 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 15 000 руб.
          </Text></View>
          <View style={styles.cost}><Text>
           <Text style={styles.dot}>⦁</Text> 20 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 25 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 30 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 40 000 руб.{'\n'}
           <Text style={styles.dot}>⦁</Text> 50 000 руб.
          </Text></View>
        </View>
          <Text style={styles.text}>Сертификат не имеет срока действия.{'\n'}{'\n'}

    При покупке сертификата скидки не действуют. Подарочный сертификат 
     (или подарочная карта) – это очень удобное приобретение для тех, кто его дарит.
      И мы уверены, что такой оригинальный подарок сможет удовлетворить любой каприз 
       того, кому он предназначен!</Text>
    </View>
    case 'Расчет картой "Халва"':
      return <Text style={styles.text}>У нас вы можете оплатить ювелирные изделия картой "Халва"</Text>
    case 'Чистка и полировка':
      return <Text style={styles.text}>При покупке ювелирных изделий в наших
       салонах вам предоставляется бессрочное право на чистку и полировку. Важно
        всегда вовремя чистить и полировать украшение, чтобы оно всегда блестело,
         как новое. Если же покупка была совершена в другом магазине, мы почистим
          ваше изделие всего за 150 рублей, за одну единицу.</Text>
    case 'Ювелирная мастерская':
      return <View><Text style={styles.text}>Очень важно ухаживать за ювелирным украшением, чтобы оно
         не потеряло вид. В нашем салоне по улице Володарского, 21 находится
          ювелирная мастерская.{'\n'}{'\n'}

      Если ювелирное украшение было куплено у нас, то услуги мастера вам
       предоставляются бесплатно, по гарантии.{'\n'}{'\n'}
      
      В ином случае, мастер озвучит цену при рассмотрении спектра необходимых работ.</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginVertical: 15 }}>Цены на ремонт ювелирных изделий</Text>
        <ScrollView horizontal={true}
        showsHorizontalScrollIndicator={false}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row data={tableHead} widthArr={widthArr} style={{height: 50,  backgroundColor: '#f1f8ff'}} textStyle={{textAlign: 'center'}}/>
            <TableWrapper style={{flexDirection: 'row'}}>
              <Col data={tableTitle} style={{flex: 1, backgroundColor: '#f6f8fa'}} heightArr={80} textStyle={{textAlign: 'center'}}/>
              <Rows data={tableData} widthArr={[160, 140, 70]} style={{height: 80}} textStyle={{textAlign: 'center'}}/>
            </TableWrapper>
          </Table>
        </ScrollView>
      </View>
  }
}

function Services() {
  const Images = [
    'https://td-diamant.com/upload/iblock/e21/e21e0cbaf207748461a49e86b94cb3f0.jpg',
    'https://td-diamant.com/upload/iblock/907/9074aba5e7a891a11536958a0070abe3.jpg',
    'https://td-diamant.com/upload/iblock/288/288d689d3d9cedb057881815c2565e67.jpg',
    'https://td-diamant.com/upload/iblock/d56/d5673e65fd96bf1132568230284f46a0.jpg',
    'https://td-diamant.com/upload/iblock/bfc/bfc4c8c958aa1d09dbe08098fdcb47cf.jpeg',
    'https://td-diamant.com/upload/iblock/360/3608339f88edcccc9e686c6873f8f396.jpg',
  ]

    const Data = {
      contents: [
        {
          title: 'Расчет с использованием платежных карт',
          description: 'В наших ювелирных салонах установлены терминалы для безналичной оплаты.',
          img: Images[0]
        },
        {
          title: 'Дисконтные карты',
          description: 'При покупке в наших ювелирных салонах вы получаете дисконтную карту!',
          img: Images[1]
        },
        {
          title: 'Подарочные сертификаты',
          description: 'Приобрести подарочный сертификат можно в салонах «Диамант» на любую сумму.',
          img: Images[2]
        },
        {
          title: 'Расчет картой "Халва"',
          description: 'У нас вы можете приобрести ювелирные изделия оплатив их картой "Халва"',
          img: Images[3]
        },
        {
          title: 'Чистка и полировка',
          description: 'При покупке ювелирных изделий в наших салонах вам предоставляется бессрочное право на чистку и полировку.',
          img: Images[4],
        },
        {
          title: 'Ювелирная мастерская',
          description: 'Ювелирная мастерская, ремонт украшений в ювелирном салоне по адресу Володарского, 21. Прайс-лист.',
          img: Images[5]
        }
      ],
    };
    
    return (
      <View style={{flex: 1}}>
          <ScrollView style={{ alignSelf: 'stretch', padding: 10 }}>
          <Text style={infoStyles.title1}>Услуги</Text>
            {
              Data.contents
                ? Data.contents.map((param, i) => {
                  return (
                    <DropDownItem
                      key={i}
                      style={styles.container}
                      contentVisible={false}
                      header={
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingTop: 6, paddingBottom: 10, marginRight: 5}}
                        >
                          <View style={{ flex: 2 }}>
                            <Image source={{uri: param.img}} style={{ width: "100%", height: "100%", borderRadius: 6 }} />
                          </View>
                          <View style={{ flex: 3, marginLeft: 6}}>
                            <Text style={styles.button}>{ param.title }</Text>
                            <Text style={[styles.text, { lineHeight: 16 }]}>{ param.description }</Text>
                            <Text style={[styles.text, { fontSize: 15, paddingTop:3, color: 'red' }]}> Подробнее &#119119; </Text>
                          </View>
                        </View>
                      }
                    >
                      <View style={{ paddingBottom: 10 }}>
                      { content(param.title) }
                      </View>
                    </DropDownItem>
                  );
                })
                : null
            }
            <View style={{ height: 96 }}/>
          </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  dot: {
    color: 'red',

  },
  container: {
    width: '100%',
    borderColor: '#b5b5b5',
    borderWidth: 0.5,
    minHeight:55,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 11,
    borderRadius: 5,
    marginBottom: 10,
  },
  cost: {
    flex: 1,
  },
  text: {
    lineHeight: 20,
    fontSize: 14,
    color: '#4c4c4c',
  },
  title: {
    color: '#4c4c4c',
    fontSize: 16,
    marginBottom: 16,
    marginTop:16
  },
  button: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 7,
  },
  bolder: {
    fontWeight: 'bold',
  },
  cards: {
    width: 90,
    height: 60
  },
});
export { Services }
