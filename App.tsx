import {View, Text, StyleSheet, LogBox} from 'react-native';
import React from 'react';
import WordList from './src/WordList';
import Word from './src/components/Word';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

LogBox.ignoreLogs([
  "It looks like you might be using shared value's .value inside reanimated inline style. " +
    'If you want a component to update when shared value changes you should use the shared value' +
    ' directly instead of its current state represented by `.value`. See documentation here: ' +
    'https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/#animations-in-inline-styling',
]);

const words = [
  {id: 1, word: 'I'},
  {id: 8, word: 'Like'},
  {id: 9, word: 'Let'},
  {id: 7, word: 'Native'},
  {id: 3, word: 'some'},
  {id: 2, word: 'React'},
  {id: 6, word: '.'},
  {id: 5, word: 'make'},
  {id: 4, word: 'app'},
];

const App = () => {
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <View
          style={{
            height: 100,
          }}></View>
        <WordList>
          {words.map(words => (
            <Word key={words.id} {...words} />
          ))}
        </WordList>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
