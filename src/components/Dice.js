import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {LinearGradient} from 'react-native-linear-gradient';

const Dice = React.memo(({color, rotate, player, data}) => {
  return (
    <View style={[styles.flexRow, {transform: [{scaleX: rotate ? -1 : 1}]}]}>
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}></LinearGradient>
      </View>
    </View>
  );
});

export default Dice;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  border1:{
    borderWidth: 3,
    borderRightWidth:0,
    borderColor: '#f0ce2c'

  },
  border2:{
    borderWidth: 3,
    padding:1,
    backgroundColor: '#aac8ab',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderColor: '#aac8ab'
  }
});
