import React, { useRef, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, ScrollView, View, Image } from 'react-native'
import DropDownItem from 'react-native-drop-down-item'
import { infoStyles } from '../../styles/infoStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
      
const IC_ARR_DOWN = require('../../assets/arrowBottom.png');
const IC_ARR_UP = require('../../assets/arrowTop.png');

const content = (title) => {
  switch (title){
    case 'Оформление заказа':
      return <View>
      <Text style={styles.title}>1 ЗАКАЗ ЮВЕЛИРНОГО ИЗДЕЛИЯ</Text>
      <Text style={styles.text}>Вы выбираете понравившиеся Вам изделие и заполняете контактные данные
        в форме «оформить заказ». После оформления заказа, с Вами свяжется 
         менеджер для уточнения наличия изделия и подтверждения заказа. В случае
          выполнения ювелирного изделия под заказ необходимо внести предоплату, 
           размер которой Вам сообщит менеджер. Наш менеджер проконсультирует Вас
            по возникшим вопросам, получению изделия и поможет оформить заказ. 
             Также Вы можете оформить заказ с помощью нашего менеджера по телефону
              +7 (3532) 770951 с понедельника по пятницу с 10 до 19 часов.
      </Text>

      <Text style={styles.title}>2 ЗАКАЗ товара из раздела «ПОДАРКИ
        И БИЗНЕС-СУВЕНИРЫ»</Text>
      <Text style={styles.text}>Вы выбираете понравившейся Вам товар и заполняете контактные
             данные в форме «оформить заказ». После оформления заказа, с 
             Вами свяжется менеджер для уточнения наличия товара и подтверждения
              заказа. В случае отсутствия товара в наличии и Вы желаете его под
               заказ, необходимо внести предоплату, размер которой Вам сообщит
                менеджер. Наш менеджер проконсультирует Вас по возникшим вопросам,
                 получению и доставке товара и поможет оформить заказ. Также Вы
                  можете оформить заказ с помощью нашего менеджера по телефону +7
                   (3532) 770951 с понедельника по пятницу с 10 до 19 часов.</Text></View>
    case 'Доставка и получение товара':
      return <View>
        <Text style={styles.title}>1. ДОСТАВКА и ПОЛУЧЕНИЕ ЮВЕЛИРНОГО ИЗДЕЛИЯ</Text>
        <Text style={styles.text}>Услуги по доставке ювелирного изделия в магазин для ПОКУПАТЕЛЯ оказываются
       Покупателю только при оформлении заказа. Покупатель может получить Заказ
        в выбранном при оформлении Заказа магазине . При получении заказа в магазине,
         Покупатель, совершая покупку, проверяет внешний вид товара и в случае
          отсутствия претензий к ассортименту, количеству, внешнему виду, комплектации
           товара, соответствию полученного товара заказанному, приобретает товар и
            подписью в чеке подтверждает отсутствие любых претензий.</Text>
      <Text style={styles.title}>2.ДОСТАВКА и ПОЛУЧЕНИЕ товара из
       раздела «ПОДАРКИ И БИЗНЕС-СУВЕНИРЫ»</Text>
       <Text style={styles.text}>При оформлении заказа ПОКУПАТЕЛЬ определяет как
        он желает получить товар, забрать товар лично в магазине , или заказать 
        курьерскую доставку.{'\n'}{'\n'}
      
      Доставка заказов по г. Оренбург и пригороду осуществляется курьерами
       в будние дни с 10 до 19 часов в течение 1-3-х дней с момента подтверждения
        заказа. Доставка заказа курьером осуществляется до двери квартиры, офиса
         или до терминала транспортной компании (для региональных покупателей).{'\n'}{'\n'}
      
      Стоимость доставки составляет:{'\n'}{'\n'}
      
      - в пределах г. Оренбург – 200 рублей, при заказе на сумму свыше 10 000
       рублей – бесплатно{'\n'}{'\n'}
      
      - за пределы г. Оренбурга на расстояние до 20 км – 350 рублей{'\n'}{'\n'}
      
      Помимо курьерской доставки существует возможность отправки Ваших
       покупок в регионы и страны ближнего зарубежья с помощью транспортных
        компаний. С тарифами доставки грузов Вы можете ознакомиться в офисах
         транспортных компаний или на их официальных сайтах. При покупке на сумму
          от 10 000 рублей Ваши заказы доставляются нами по г. Оренбургу до
           транспортной компании бесплатно.{'\n'}{'\n'}
      
      При получении заказа Вы проверяете внешний вид товара и
       в случае отсутствия претензий к ассортименту, количеству, внешнему
        виду, комплектации товара, соответствию полученного товара заказанному,
         приобретаете товар и подписью в чеке подтверждаете отсутствие любых 
         претензий.</Text></View>

    case 'Способы оплаты':
      return <>
        <Text style={styles.title}>1 ОПЛАТА ЮВЕЛИРНОГО ИЗДЕЛИЯ</Text>

        <Text style={styles.bolder}>Оплата (предоплата) Заказа производится только в салонах ТД «Диамант»</Text>
        <Text style={styles.text}>
        1.1. Наличными денежными средствами.{'\n'}
        1.2. Банковской картой (Visa International, MasterCard, Мир).{'\n'}
        3.3. Подарочным сертификатом ТД «Диамант»{'\n'}{'\n'}
        

        ПРЕДОПЛАТА составляет 50% от стоимости Заказа.
        Зарезервировать Заказ возможно сроком до 3х дней. Срок может быть увеличен
         при условии предоплаты в размере 50 % от стоимости Заказа.
        </Text>

        <Text style={styles.title}>2. ОПЛАТА товара из раздела
         «ПОДАРКИ И БИЗНЕС-СУВЕНИРЫ»</Text>

        <Text style={styles.bolder}>Оплату (предоплату) Заказа можно произвести :</Text>
        <Text style={styles.text}>
        1.1. При помощи платежной системы размещенной на нашем сайте{'\n'}

        1.2. Наличными денежными средствами, банковской картой (Visa International,
         MasterCard, Мир), подарочным сертификатом ТД «Диамант» в салонах ТД «Диамант»
          и при доставке Заказа курьером.{'\n'}

        Во всех случаях все необходимые финансовые документы Вы получите вместе
         с Заказом.{'\n'}{'\n'}


        ПРЕДОПЛАТА составляет 50% от стоимости Заказа.
        Зарезервировать Заказ возможно сроком до 3х дней. Срок может быть
         увеличен при условии предоплаты в размере 50 % от стоимости Заказа.
        </Text>

        <Text style={[styles.bolder, {fontSize: 15}]}>БЕЗНАЛИЧНЫЙ РАСЧЁТ</Text>
        <Text style={styles.text}>
        При оформлении заказа в корзине Вы можете выбрать вариант безналичной
         оплаты. Мы принимаем карты Visa и Master Card. Для оплаты покупки Вы 
         будете перенаправлены на сервер системы ASSIST, где будет необходимо
          ввести номер карты, срок её действия и имя держателя.{'\n'}
        Вам могут отказать в авторизации в случае:
        </Text>
        <Text style={styles.text}>
          <Text style={{color: 'red'}}>&#10625;</Text> если ваш банк не поддерживает технологию 3D-Secure;{'\n'}
          <Text style={{color: 'red'}}>&#10625;</Text> на карте недостаточно средств для покупки;{'\n'}
          <Text style={{color: 'red'}}>&#10625;</Text> банк не поддерживает услугу платежей в интернете;{'\n'}
          <Text style={{color: 'red'}}>&#10625;</Text> истекло время ожидания ввода данных;{'\n'}
          <Text style={{color: 'red'}}>&#10625;</Text> в данных была допущена ошибка.{'\n'}
        </Text>
        <Text style={styles.text}>
        В этом случае Вы можете повторить авторизацию через 20 минут,
         воспользоваться другой картой или обратиться в свой банк для решения вопроса.{'\n'}

        Для выбора оплаты товара с помощью банковской карты на соответствующей 
        странице необходимо нажать кнопку «Оплата заказа банковской картой».{'\n'}

        Оплата происходит через ПАО СБЕРБАНК с использованием банковских карт 
        следующих платежных систем:
        </Text>
        <View style={[styles.cardView, {marginBottom: 2}]}>
          <Text style={{ color: 'red', fontSize:17 }}>&#10625; </Text>
          <Image style={styles.cards}
          source={require('../../assets/mir-card.png')} />
          <Text fontSize={16}> МИР</Text>
        </View>
        <View style={styles.cardView}>
          <Text style={{ color: 'red', fontSize:17 }}>&#10625; </Text>
          <Icon style={{marginHorizontal: 10}} name='cc-visa' color='#3b64f7' size={70} />
          <Text fontSize={16}> VISA International</Text>
        </View>
        <View style={[styles.cardView, {marginBottom: 10}]}>
          <Text style={{ color: 'red', fontSize:17 }}>&#10625; </Text>
          <Icon style={{marginHorizontal: 10}} name='cc-mastercard' color='#051961' size={70} />
          <Text fontSize={16}> Mastercard Worldwide</Text>
        </View>
        <Text style={styles.text}>
        Для оплаты (ввода реквизитов Вашей карты) Вы будете перенаправлены на
         платежный шлюз ПАО СБЕРБАНК. Соединение с платежным шлюзом и передача
          информации осуществляется в защищённом режиме с использованием протокола
           шифрования SSL. В случае если Ваш банк поддерживает технологию безопасного
            проведения интернет-платежей Verified By Visa или MasterCard SecureCode
             для проведения платежа также может потребоваться ввод специального 
             пароля. Настоящий сайт поддерживает 256-битное шифрование. 
             Конфиденциальность сообщаемой персональной информации обеспечивается 
             ПАО СБЕРБАНК. Введенная информация не будет предоставлена третьим лицам 
             за исключением случаев, предусмотренных законодательством РФ. Проведение
              платежей по банковским картам осуществляется в строгом соответствии с
               требованиями платежных систем МИР, Visa Int. и MasterCard Europe Sprl.
        </Text>


        <Text style={[styles.bolder, {fontSize: 15}]}>ПОКУПАЙ СЕЙЧАС,
         ПЛАТИ ПОТОМ С ТИНЬКОФФ БАНК</Text>
        <Text style={styles.text}>
        Кредит от Тинькофф Банк на ювелирное украшение
        Получите кредит от 3000 до 100 000 рублей, срок кредита от 3 до 24
         месяцев. Без справок и поручителей. Процентная ставка от 16% годовых,
          рассчитывается индивидуально для каждого клиента, зависит от срока и 
          суммы кредитования.</Text>
        <Image  style={{ width: 140, height: 85, alignSelf: 'center' }} 
        source={require('../../assets/tinkoff-card.png')}/>
      </>
    case 'Обмен и возврат':
      return <View>
        <Text style={styles.title}>1 ЮВЕЛИРНЫЕ ИЗДЕЛИЯ</Text>
        <Text style={styles.text}>
          Покупатель имеет право отказаться от товара в любое время до его получения.
           Изделия из драгоценных металлов и драгоценных камней обмену и возврату не
            подлежат, кроме случаев выявления в них скрытых заводских дефектов в
             течении гарантийного срока. В случае выявления в товаре скрытых дефектов
              или производственных недостатков возврат товара осуществляется согласно
               положениям законодательства Российской Федерации.{'\n'}

          Гарантия на ювелирные изделия, заказанные и приобретенные в ТД «Диамант»
           – шесть месяцев с даты их продажи .
          </Text>

          <Text style={styles.title}>2 ПОДАРКИ И БИЗНЕС-СУВЕНИРЫ</Text>

          <Text style={styles.bolder}>Возврат и обмен товара надлежащего
           качества.</Text>
           <Text style={styles.text}>
          Покупатель имеет право отказаться от товара в любое время до его получения. 
          Для возврата товара также необходим документ, удостоверяющий личность. При
           возврате товара надлежащего качества, ТД «Диамант» вернет его стоимость или
            произведет его замену (по Вашему требованию) не позднее чем через 7 рабочих
             дней с момента получения товара, Вашего письменного заявления. Если на 
             момент Вашего обращения по обмену товара, аналогичный товар отсутствует в
              продаже, Вы можете отказаться от товара и потребовать возврат его стоимости.</Text>
          <Text style={styles.bolder}>Возврат и обмен товара ненадлежащего
           качества</Text>
          <Text style={styles.text}>
          Под товаром ненадлежащего качества подразумевается товар, который
           неисправен (имеет дефект) и не может обеспечить исполнение своих
            функциональных качеств. Отличие элементов дизайна или оформления 
            от заявленных в описании на сайте не является неисправностью или не 
            функциональностью товара. Если Вам был продан товар ненадлежащего 
            качества, и оно не было заранее оговорено продавцом, Вы вправе 
            воспользоваться положениями ст. 18 Закона о защите прав потребителей.
             Вы вправе отказаться от исполнения договора купли-продажи, возвратить
              товар ненадлежащего качества и потребовать возврата уплаченной за
               товар денежной суммы либо потребовать его замену в течение 10 дней
                со дня получения Вашего товара. Любые из перечисленных требований
                 должны быть предъявлены Вами в письменной форме посредством
                  заполнения заявления.</Text>


          <Text style={styles.bolder}>Требования о возврате уплаченной 
          за товар денежной суммы либо о его замене
           подлежат удовлетворению:</Text>

          <Text style={styles.text}>
          <Text style={{color: 'red'}}>&#10625; </Text> В течение 10 рабочих дней
           с момента получения (возврата в ТД»Диамант» )
           товара ненадлежащего качества и Вашего письменного заявления в случае
            отсутствия необходимости, в проведении дополнительной экспертизы
             позволяющей установить причину возникновения дефекта;{'\n'}

          <Text style={{color: 'red'}}>&#10625; </Text> В течение 30 рабочих дней
           с момента получения (возврата в ТД»Диамант»)
           товара ненадлежащего качества и Вашего письменного заявления в случае
            необходимости проведения дополнительной экспертизы позволяющей установить
             причину возникновения дефекта.{'\n'}{'\n'}

          Возврат переведенных средств, производится на Ваш банковский счет в 
          течение 5—30 рабочих дней (срок зависит от Банка, который выдал Вашу 
          банковскую карту).{'\n'}{'\n'}


          ВНИМАНИЕ! Возврат или обмен товара надлежащего или ненадлежащего
           качества возможен ТОЛЬКО в салонах ТД»Диамант» . Все расходы, связанные
            с транспортировкой товара от покупателя к продавцу оплачиваются
             покупателем. Стоимость доставки не возмещается.{'\n'}
          </Text>
      </View>
  }
}

function PayAndDelivery() {
  const contents = [
      {
        title: 'Оформление заказа'
      },
      {
        title: 'Доставка и получение товара',
      },
      {
        title: 'Способы оплаты',
      },
      {
        title: 'Обмен и возврат'
      }
    ]


  return (
    <View style={{flex: 1}}>
        <ScrollView style={{ alignSelf: 'stretch', padding: 10 }}>
        <Text style={infoStyles.title1}>Оплата и доставка</Text>
          {
            contents
              ? contents.map((param, i) => {
                return (
                  <DropDownItem
                    key={i}
                    style={styles.container}
                    contentVisible={false}
                    invisibleImage={IC_ARR_DOWN}
                    visibleImage={IC_ARR_UP}
                    header={
                      <View>
                        <Text style={styles.button}>{ param.title }</Text>
                      </View>
                    }
                  >
                    <View style={styles.textContainer}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderColor: '#b5b5b5',
    borderWidth: 0.2,
    minHeight:55,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 11,
    marginBottom: 8,
  },
  text: {
    lineHeight: 24,
    fontSize: 15,
    color: '#4c4c4c',
    marginBottom: 13,
    letterSpacing: .4,
    lineHeight: 23
  },
  title: {
    color: '#4c4c4c',
    fontSize: 16,
    marginBottom: 16,
    marginTop:4
  },
  button: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  bolder: {
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 7,
    fontSize: 15,
  },
  cards: {
    width: 90,
    height: 60,
    marginHorizontal: 10
  },
  textContainer: {
    marginTop: 16,
    paddingBottom: 10
  },
  cardView: {
    alignItems: 'center',
    flexDirection: 'row'
  }
})
export { PayAndDelivery }

