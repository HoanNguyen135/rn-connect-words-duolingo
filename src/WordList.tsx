import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {ReactElement, useState} from 'react';
import {useSharedValue, runOnUI, runOnJS} from 'react-native-reanimated';
import SortableWord from './SortableWord';
import Lines from './components/Line';
import {calculateLayout} from './Layout';

interface WordListProps {
  children: ReactElement<{id: number}>[];
}

const containerWidth = Dimensions.get('window').width;

const WordList = ({children}: WordListProps) => {
  const [ready, setReady] = useState(false);

  const offsets = children.map(() => ({
    order: useSharedValue(-1),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child: any, index: any) => {
          return (
            <View
              key={index}
              onLayout={({
                nativeEvent: {
                  layout: {x, y, width, height},
                },
              }) => {
                const offset = offsets[index];

                offset.order.value = -1;

                offset.width.value = width;

                offset.height.value = height;

                offset.originalX.value = x;

                offset.originalY.value = y;

                runOnUI(() => {
                  'worklet';
                  if (offsets.filter(o => o.order.value !== -1).length == 0) {
                    calculateLayout(offsets, containerWidth);
                    runOnJS(setReady)(true);
                  }
                })();
              }}>
              {child}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Lines />
      {children.map((child, index) => (
        <SortableWord
          key={index}
          offsets={offsets}
          index={index}
          containerWidth={containerWidth}>
          {child}
        </SortableWord>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default WordList;
