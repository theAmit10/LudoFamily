import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import SoundPlayer from 'react-native-sound-player';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {playSound} from '../../helpers/SoundUtility';
import {deviceWidth} from '../../constrants/Scaling';
import {selectCellSelection} from '../../redux/reducers/gameSelector';
import {resetGame} from '../../redux/reducers/gameSlice';
import {navigate} from '../../helpers/NavigationUtils';
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SB = ({children}) => {
  const easing = Easing.bezier(0.25, 0.1, 0.25, 1);

  // Characters animation values
  const topBoyX = useSharedValue(-300);
  const topBoyOpacity = useSharedValue(0);
  const topBoyBounceY = useSharedValue(0);

  const topGirlX = useSharedValue(300);
  const topGirlOpacity = useSharedValue(0);
  const topGirlBounceY = useSharedValue(0);

  const bottomGirlY = useSharedValue(300);
  const bottomGirlOpacity = useSharedValue(0);
  const bottomGirlBounceY = useSharedValue(0);

  const bottomBoyY = useSharedValue(300);
  const bottomBoyOpacity = useSharedValue(0);
  const bottomBoyBounceY = useSharedValue(0);

  // Text animation values
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const textColorProgress = useSharedValue(0);

  // For Scaling
  const scaleDown = useSharedValue(1);
  const moveToBottom = useSharedValue(0);

  const handleTextPress = () => {
    console.log('Pressed');
    // scaleDown.value = withTiming(0.5, {duration: 600});
    // moveToBottom.value = withTiming(SCREEN_HEIGHT / 4, {duration: 600});
    Alert.alert('Comming Soon');
  };

  useEffect(() => {
    // Character animations
    topBoyX.value = withDelay(
      200,
      withTiming(0, {duration: 900, easing}, () => {
        topBoyBounceY.value = withRepeat(
          withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
          -1,
          true,
        );
      }),
    );
    topBoyOpacity.value = withDelay(200, withTiming(1, {duration: 700}));

    topGirlX.value = withDelay(
      600,
      withTiming(0, {duration: 900, easing}, () => {
        topGirlBounceY.value = withRepeat(
          withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
          -1,
          true,
        );
      }),
    );
    topGirlOpacity.value = withDelay(600, withTiming(1, {duration: 700}));

    bottomGirlY.value = withDelay(
      1000,
      withTiming(0, {duration: 900, easing}, () => {
        bottomGirlBounceY.value = withRepeat(
          withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
          -1,
          true,
        );
      }),
    );
    bottomGirlOpacity.value = withDelay(1000, withTiming(1, {duration: 700}));

    bottomBoyY.value = withDelay(
      1400,
      withTiming(0, {duration: 900, easing}, () => {
        bottomBoyBounceY.value = withRepeat(
          withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
          -1,
          true,
        );
      }),
    );
    bottomBoyOpacity.value = withDelay(1400, withTiming(1, {duration: 700}));

    // Text appearance animation
    textOpacity.value = withDelay(2400, withTiming(1, {duration: 600, easing}));
    textTranslateY.value = withDelay(
      2400,
      withTiming(0, {duration: 600, easing}),
    );

    // Color loop animation
    textColorProgress.value = withDelay(
      2400,
      withRepeat(
        withTiming(1, {duration: 4000, easing: Easing.linear}),
        -1,
        false,
      ),
    );
  }, []);

  // Animated styles

  const sharedCharacterStyle = offsetStyle =>
    useAnimatedStyle(() => ({
      transform: [
        ...offsetStyle,
        {translateY: moveToBottom.value},
        {scale: scaleDown.value},
      ],
    }));

  const topBoyStyle = useAnimatedStyle(() => ({
    transform: [{translateX: topBoyX.value}, {translateY: topBoyBounceY.value}],
    opacity: topBoyOpacity.value,
  }));

  const topGirlStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: topGirlX.value},
      {translateY: topGirlBounceY.value},
    ],
    opacity: topGirlOpacity.value,
  }));

  const bottomGirlStyle = useAnimatedStyle(() => ({
    transform: [{translateY: bottomGirlY.value + bottomGirlBounceY.value}],
    opacity: bottomGirlOpacity.value,
  }));

  const bottomBoyStyle = useAnimatedStyle(() => ({
    transform: [{translateY: bottomBoyY.value + bottomBoyBounceY.value}],
    opacity: bottomBoyOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      textColorProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [
        '#FFF700', // Pure Yellow
        '#FFD700', // Golden Yellow
        '#FFA500', // Standard Orange
        '#FF8C00', // Dark Orange
        '#00CFFF', // Sky Blue
        '#00BFFF', // Deep Sky Blue
        '#ADD8E6', // Light Blue
        '#FFF700', // Back to Pure Yellow
      ],
    );

    return {
      transform: [{translateY: textTranslateY.value}],
      opacity: textOpacity.value,
      color,
    };
  });

  const dispatch = useDispatch();
  // const navigate = useNavigation();

  const startGame = async (isNew = false) => {
    SoundPlayer.stop();
    if (isNew) {
      dispatch(resetGame());
    }
    navigate('LudoBoardScreen');
    playSound('game_start');
  };

  const handlerNewGamePress = useCallback(() => {
    startGame(true);
  }, []);

  // const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
  // const scaleXAnim = useRef(new Animated.Value(-1)).current;

  const currentPosition = useSelector(selectCellSelection);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      playSound('home');
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require('../../assets/images/MainBg.png')}
        style={{flex: 1, position: 'relative'}}>
        {/* Animated Characters */}
        <View style={StyleSheet.absoluteFill}>
          {/* TOP ROBOT */}

          <Animated.Image
            source={require('../../assets/images/board.png')}
            resizeMode="cover"
            style={[
              {
                height: '50%',
                width: '100%',
                position: 'absolute',
                top: 20,
                left: 0,
              },
              topBoyStyle,
            ]}
          />
          {/* <Animated.Image
            source={require('../../assets/images/robot.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '60%',
                position: 'absolute',
                top: 50,
                left: 20,
              },
              topBoyStyle,
            ]}
          /> */}
          <Animated.Image
            source={require('../../assets/images/robot.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '60%',
                position: 'absolute',
                top: 20,
                left: 0,
              },
              topBoyStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.buttonText,
              animatedTextStyle,
              {
                position: 'absolute',
                top: 150,
                left: 80,
                width: '60%',
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // translucent dark background
                borderRadius: 12,
                zIndex: 1,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
              }, // center text inside the container
            ]}>
            <Animated.Text
              onPress={handleTextPress}
              style={[
                styles.buttonText,
                animatedTextStyle,
                {textAlign: 'center'}, // center text inside the container
              ]}>
              {`Vs \nComputer`}
            </Animated.Text>
          </Animated.View>

          {/* TOP GIRL */}
          <Animated.Image
            source={require('../../assets/images/TF.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '50%',
                position: 'absolute',
                top: 50,
                right: 20,
              },
              topGirlStyle,
            ]}
          />

          <Animated.Image
            source={require('../../assets/images/board.png')}
            resizeMode="cover"
            style={[
              {
                height: '50%',
                width: '100%',
                position: 'absolute',
                bottom: 20,
                left: 0,
              },
              topBoyStyle,
            ]}
          />

          {/* TOP BOY */}
          <Animated.Image
            source={require('../../assets/images/TM.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '50%',
                position: 'absolute',
                top: SCREEN_HEIGHT * 0.5,
                left: 0,
              },
              topBoyStyle,
            ]}
          />

          {/* TOP GIRL */}
          <Animated.Image
            source={require('../../assets/images/TF.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '50%',
                position: 'absolute',
                top: SCREEN_HEIGHT * 0.5,
                right: 0,
              },
              topGirlStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.buttonText,
              animatedTextStyle,
              {
                position: 'absolute',
                bottom: 150,
                left: 80,
                width: '60%',
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // translucent dark background
                borderRadius: 12,
                zIndex: 1,
                shadowColor: 'black',
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
              }, // center text inside the container
            ]}>
            <Animated.Text
              onPress={handlerNewGamePress}
              style={[
                styles.buttonText,
                animatedTextStyle,
                {textAlign: 'center'}, // center text inside the container
              ]}>
              {`Play \n&\nPass`}
            </Animated.Text>
          </Animated.View>

          {/* BOTTOM GIRL */}
          <Animated.Image
            source={require('../../assets/images/BG.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '50%',
                position: 'absolute',
                bottom: -20,
                left: -30,
              },
              bottomGirlStyle,
            ]}
          />

          {/* BOTTOM BOY */}
          <Animated.Image
            source={require('../../assets/images/BB.png')}
            resizeMode="cover"
            style={[
              {
                height: '40%',
                width: '50%',
                position: 'absolute',
                bottom: -10,
                right: -50,
              },
              bottomBoyStyle,
            ]}
          />
        </View>

        {/* Text Content */}
        <View style={styles.centered}>
          {/* <Animated.Text
            onPress={() => handleTextPress()}
            style={[styles.buttonText, animatedTextStyle]}>
            Vs Computer
          </Animated.Text>
          <Animated.Text
            onPress={() => handleTextPress()}
            style={[styles.buttonText, animatedTextStyle]}>
            Pass & Play
          </Animated.Text> */}
          {children}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SB;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(40),
    textAlign: 'center',
    fontFamily: 'Philosopher-Bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(50),
  },
});
