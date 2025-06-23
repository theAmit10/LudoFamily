import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const HeaderComp = () => {
  return (
    <View
      style={{
        height: 100,
        width: '100%',
        backgroundColor: 'yellow',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          textAlignVertical: 'center',
          alignContent: 'center',
        }}>
        Ludo War
      </Text>
    </View>
  );
};

export default HeaderComp;

const styles = StyleSheet.create({});
