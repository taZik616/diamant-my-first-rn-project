import { View, Dimensions } from 'react-native'
import DiamantHouse from '../../assets/diamantHouse.svg'
const winWidth = Dimensions.get('window').width

export const BgSvg = () => {
  return <>
    <View style={{backgroundColor: '#8C8C8C', 
     position: 'absolute', height: '100%',
     width: '100%', bottom: 0}}></View>
    <DiamantHouse style={{width: winWidth+1, 
    height:winWidth*1.778170, position: 'absolute'}} />
  </>
}