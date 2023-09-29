import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {theme} from './theme/theme';
import Header from './components/Header/Header';
import Title from './components/Title/Title';
import List from './components/List/List';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.black} />
      <Header />
      <Title />
      <List />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray600,
  },
});

export default App;
