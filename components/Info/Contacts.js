import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, Animated } from 'react-native'
//import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

function Contacts() {

  const Images = [
    {image: {uri: 'https://td-diamant.com/upload/iblock/ede/edebc060e6ef223681d2aba71c3cdfc9.png'}},
    {image: {uri: 'https://td-diamant.com/upload/iblock/ede/edebc060e6ef223681d2aba71c3cdfc9.png'}},
    {image: {uri: 'https://td-diamant.com/upload/iblock/b78/b783113e7f837a1b8467ca60414a478a.jpg'}},
  ]
  state = {
    markers: [{
      latlng: { latitude: 51.76729403564033, longitude: 55.10075348084392 },
      title: "Салон «Подарки»",
      description: 'ул. Комсомольская 43, 2 этаж',
      image: Images[0].image
    },
    {
      latlng: { latitude: 51.76736387324181, longitude: 55.1006461095258 },
      title: "Ювелирный салон",
      description: 'ул. Володарского 21',
      image: Images[1].image
    },
    {
      latlng: { latitude: 51.766236354590895, longitude: 55.098503086192096 },
      title: "Ювелирный салон",
      description: 'ул. Советская 31',
      image: Images[2].image
    }], 
    region: {
      latitude: 51.766826633182696,
      longitude: 	55.099804572615646,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003
    },
  }

  return(<View>
    <Text>MAP</Text>
  </View>)
/*
  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / width * 0.8 + 0.3);
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if( mapIndex !== index ) {
          mapIndex = index;
          const { latlng } = this.state.markers[index+1];
          _map.current.animateToRegion(
            {
              ...latlng,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });

  const interpolations = this.state.markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.15, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = (markerID * CARD_WIDTH) + (markerID * 20); 
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  }

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
      ref={_map}
      mapType='hybrid'
      provider={PROVIDER_GOOGLE}
      initialRegion={ this.state.region } >
        {this.state.markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            onPress={(e)=>onMarkerPress(e)} >
            <Animated.View style={[styles.markerWrap]}> 
              <Animated.Image source={require('../../assets/customMarker.png')}
              style={[{ width:42, height: 60 },
               {transform: [{scale: interpolations[index].scale}]} ]}
                />
            </Animated.View>
          </Marker>
        ))}
      </MapView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        pagingEnabled
        snapToInterval={width * 0.8 + 20}
        snapToAlignment='center'
        contentContainerStyle={{ paddingHorizontal: width * 0.1 - 10 }}
        onScroll={Animated.event(
          [{
            nativeEvent: {
              contentOffset: {
                x: mapAnimation,
              },
            },
          }],
          {useNativeDriver: true}
        )}
      >
        {this.state.markers.map((marker, index) => (
          <View style={styles.card} key={index}>
            <Image source={marker.image} style={styles.cardImage}/>
            <View style={styles.textContent}>
              <Text style={styles.cardtitle}>{marker.title}</Text>
              <Text style={styles.cardDescription}>{marker.description}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  )*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  map: {
    height: '100%',
    width: '100%'
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 190,
    width: width * 0.8,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  cardtitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width:100,
    height:100,
  },
});
export { Contacts }
