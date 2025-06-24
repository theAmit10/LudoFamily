import {ImageBackground, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import BG from '../assets/images/bg.jpg';
import {deviceHeight, deviceWidth} from '../constrants/Scaling';

const Wrapper = ({children, style}) => {
  return (
    <ImageBackground
      source={require('../assets/images/MainBg.png')}
      resizeMode="cover"
      style={styles.container}
      blurRadius={10}>
      <SafeAreaView style={[styles.safeArea, {...style}]}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Wrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
