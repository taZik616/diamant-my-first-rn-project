import React from "react"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#7e7e7e',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginTop: 20,
    marginBottom: 13,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 25,

    shadowColor: "#7e7e7e",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    
    elevation: 22,
  },
  errorMes: {
    color: 'red',
    textAlign: "center",
    marginTop: 3,
  },
  errorBox: {
    borderRadius: 7,
    marginRight: 50,
    marginLeft: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  subBut: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '90%',
    backgroundColor: '#e61629',
    marginVertical: 20,
    maxWidth: 240
  },
  subButText: {
    textAlign: 'center',
    color: '#e9e9e9',
    fontWeight: 'bold',
    fontSize: 17.5,
    letterSpacing: 1.3,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
    marginTop: 2,
  }
})
export default styles