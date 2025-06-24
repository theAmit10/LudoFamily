import {
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

const MainBackground = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require('../../assets/images/orgbg.png')}
        style={{flex: 1, position: 'relative'}}
      />
      <View
        style={{
          width: '100%',
          height: '100%',

          position: 'absolute',
        }}>
        {/** TOP BOY */}
        <Image
          source={require('../../assets/images/TM.png')}
          resizeMode="cover"
          style={{
            height: '60%',
            width: '40%',
            position: 'absolute',
            top: 20,
            left: 0,
          }}
        />
        {/** TOP GIRL */}
        <Image
          source={require('../../assets/images/TF.png')}
          resizeMode="cover"
          style={{
            height: '60%',
            width: '70%',
            position: 'absolute',
            top: 10,
            right: -30,
          }}
        />

        {/** Bottom GIRL */}
        <Image
          source={require('../../assets/images/BG.png')}
          resizeMode="cover"
          style={{
            height: '60%',
            width: '60%',
            position: 'absolute',
            bottom: -20,
            left: -30,
          }}
        />
        {/** BOTTOM BOY */}
        <Image
          source={require('../../assets/images/BB.png')}
          resizeMode="cover"
          style={{
            height: '60%',
            width: '70%',
            position: 'absolute',
            bottom: 10,
            right: -50,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MainBackground;

const styles = StyleSheet.create({});
