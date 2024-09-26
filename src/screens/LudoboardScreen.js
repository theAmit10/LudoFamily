import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import {deviceHeight, deviceWidth} from '../constrants/Scaling';
import Dice from '../components/Dice';

const LudoboardScreen = () => {
  return (
    <Wrapper>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
        }}>
        <Image
          source={MenuIcon}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>

      {/** BOARD CONTIANER */}
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <Dice />
        </View>
      </View>
    </Wrapper>
  );
};

export default LudoboardScreen;

const styles = StyleSheet.create({
  container: {
    height: deviceHeight * 0.5,
    width: deviceWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'cyan',
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    flexDirection: 'row',
  },
});
