import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {WORD_HEIGHT} from '../Layout';

interface WordProps {
  id: number;
  word: string;
}

const Word = ({word}: WordProps) => {
  return (
    <View style={styles.root}>
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>{word}</Text>
        </View>
        <View style={styles.shadow} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 4,
  },
  container: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E6E8',
    backgroundColor: 'white',
    height: WORD_HEIGHT - 8,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderColor: '#E8E6E8',
    top: 4,
  },
  text: {
    fontSize: 19,
  },
});

export default Word;
