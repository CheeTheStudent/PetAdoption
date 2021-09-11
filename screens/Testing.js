import React from 'react';
import { View, StyleSheet } from 'react-native';

const Testing = () => {

  const pan = useState(new Animated.ValueXY())[0];

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event([null, {
        dx: pan.x, dy: pan.y
      }]),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  )[0];

  return (
    <View style={styles.body}>
      <Animated.View style={[{
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: 'red'
      }, pan.getLayout()]} {...panResponder.panHandlers} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Testing;