import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import {deviceHeight, deviceWidth} from '../constrants/Scaling';
import Dice from '../components/Dice';
import {Colors} from '../constrants/Colors';
import Pocket from '../components/Pocket';
import VerticalPath from '../components/path/VerticalPath';
import {Plot1Date, Plot2Date, Plot3Date, Plot4Date} from '../helpers/PlotDate';
import HorizonatalPath from '../components/path/HorizonatalPath';
import FourTriangles from '../components/FourTriangles';
import {useSelector} from 'react-redux';
import {
  selectDiceTouch,
  selectPlayer1,
  selectPlayer2,
  selectPlayer3,
  selectPlayer4,
  selectTotalPlayers,
} from '../redux/reducers/gameSelector';
import {useIsFocused} from '@react-navigation/native';
import StartGame from '../assets/images/start.png';
import MenuModel from '../components/MenuModel';
import {playSound} from '../helpers/SoundUtility';
import WinModel from '../components/WinModel';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const LudoboardScreen = () => {
  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const totalPlayer = useSelector(selectTotalPlayers);

  console.log('totalPlayer :: ', totalPlayer);
  const isDiceTouch = useSelector(selectDiceTouch);
  // const winner = useSelector(state => state.game.winner);
  const winner = useSelector(state => state.game.winners);

  const isFocused = useIsFocused();
  const [showStartImage, setShowStartImage] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      setShowStartImage(true);
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),

          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );

      blinkAnimation.start();

      const timeout = setTimeout(() => {
        blinkAnimation.stop();
        setShowStartImage(false);
      }, 2500);

      return () => {
        blinkAnimation.stop();
        clearTimeout(timeout);
      };
    }
  }, [isFocused]);

  const handleMenuPress = useCallback(() => {
    console.log('Pressed Menu');
    playSound('ui');
    setMenuVisible(true);
  });

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

  console.log('winner from ludo :: ', winner);

  return (
    <Wrapper>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 60,
          right: 20,

          padding: 10, // Ensure touch area
          zIndex: 100, // Ensure it's on top
        }}
        onPress={handleMenuPress}
        activeOpacity={0.7}>
        <Image
          source={MenuIcon}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>

      {/* <Animated.Image
        source={require('../assets/images/TM.png')}
        resizeMode="cover"
        style={[
          {
            height: '60%',
            width: '40%',
            position: 'absolute',
            top: 20,
            left: 0,
          },
        ]}
      /> */}

      {/* TOP BOY */}
      <Animated.Image
        source={require('../assets/images/TM.png')}
        resizeMode="cover"
        style={[
          {
            height: '60%',
            width: '40%',
            position: 'absolute',
            top: 20,
            left: 0,
          },
        ]}
      />

      {/* TOP GIRL */}
      <Animated.Image
        source={require('../assets/images/TF.png')}
        resizeMode="cover"
        style={[
          {
            height: '60%',
            width: '70%',
            position: 'absolute',
            top: 10,
            right: -50,
          },
        ]}
      />

      {/* BOTTOM GIRL */}
      <Animated.Image
        source={require('../assets/images/BG.png')}
        resizeMode="cover"
        style={[
          {
            height: '60%',
            width: '60%',
            position: 'absolute',
            bottom: -350,
            left: -30,
          },
        ]}
      />

      {/* BOTTOM BOY */}
      <Animated.Image
        source={require('../assets/images/BB.png')}
        resizeMode="cover"
        style={[
          {
            height: '60%',
            width: '70%',
            position: 'absolute',
            bottom: -350,
            right: -60,
          },
        ]}
      />

      {/** BOARD CONTIANER */}
      <View style={styles.container}>
        {/** TOP PLAYER */}
        <View
          style={styles.flexRow}
          pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={Colors.green} player={2} data={player2} />
          <Dice color={Colors.yellow} rotate player={3} data={player3} />
        </View>

        {/**  LUDO BOARD */}
        <View style={styles.ludoBoard}>
          <View style={styles.plotContainer}>
            <Pocket color={Colors.green} player={2} data={player2} />
            <VerticalPath cells={Plot2Date} color={Colors.yellow} />
            <Pocket color={Colors.yellow} player={3} data={player3} />
          </View>

          <View style={styles.pathContainer}>
            <HorizonatalPath cells={Plot1Date} color={Colors.green} />
            <FourTriangles
              player1={player1}
              player2={player2}
              player3={player3}
              player4={player4}
            />
            <HorizonatalPath cells={Plot3Date} color={Colors.blue} />
          </View>

          <View style={styles.plotContainer}>
            <Pocket color={Colors.red} player={1} data={player1} />
            <VerticalPath cells={Plot4Date} color={Colors.red} />
            <Pocket color={Colors.blue} player={4} data={player4} />
          </View>
        </View>

        {/** BOTTOM PLAYER */}
        <View
          style={styles.flexRow}
          pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={Colors.red} player={1} data={player1} />
          <Dice color={Colors.blue} rotate player={4} data={player4} />
        </View>
      </View>

      {/** INITIAL START BLINK */}
      {showStartImage && (
        <Animated.Image
          source={StartGame}
          style={{
            height: deviceHeight * 0.5,
            width: deviceWidth,
            position: 'absolute',
            opacity,
          }}></Animated.Image>
      )}

      {menuVisible && (
        <MenuModel
          onPressHide={() => setMenuVisible(false)}
          visible={menuVisible}
        />
      )}

      {winner != null && winner.length === 3 && <WinModel winner={winner[0]} />}
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
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    flexDirection: 'row',
  },
  ludoBoard: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    padding: 20,
    backgroundColor: Colors.blue,
    borderRadius: 20,
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.board,
  },
  pathContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.board,
  },
});
