import { StyleSheet } from "react-native"
import { borderLeftColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes"

export const infoStyles = StyleSheet.create({
    title1: {
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
    },
    title2: {
        marginLeft: 20,
        marginTop: 17,
        marginBottom: 13,
        fontSize: 17,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        marginTop: 10,
        width: '90%',
        marginLeft: 20,
        lineHeight: 24,
    },
    hrefs: {
        color: 'red',
    },
})