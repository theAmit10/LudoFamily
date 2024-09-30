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
} from '../redux/reducers/gameSelector';
import {useIsFocused} from '@react-navigation/native';
import StartGame from '../assets/images/start.png';
import MenuModel from '../components/MenuModel';
import {playSound} from '../helpers/SoundUtility';
import WinModel from '../components/WinModel';

const LudoboardScreen = () => {
  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);

  const isDiceTouch = useSelector(selectDiceTouch);
  const winner = useSelector(state => state.game.winner);

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
    playSound('ui');
    setMenuVisible(true);
  });

  return (
    <Wrapper>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
        }}
        onPress={handleMenuPress}>
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

      {winner != null && <WinModel winner={winner} />}
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
    padding: 10,
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#ccc',
  },
  pathContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E5162',
  },
});
