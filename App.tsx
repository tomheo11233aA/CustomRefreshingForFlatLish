import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Loading from './src/screens/Loading'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading />
    </SafeAreaView>
  )
}

export default App