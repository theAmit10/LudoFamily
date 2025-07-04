// import {
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Animated,
// } from 'react-native';
// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import Wrapper from '../components/Wrapper';
// import MenuIcon from '../assets/images/menu.png';
// import {deviceHeight, deviceWidth} from '../constrants/Scaling';
// import Dice from '../components/Dice';
// import {Colors} from '../constrants/Colors';
// import Pocket from '../components/Pocket';
// import VerticalPath from '../components/path/VerticalPath';
// import {Plot1Date, Plot2Date, Plot3Date, Plot4Date} from '../helpers/PlotDate';
// import HorizonatalPath from '../components/path/HorizonatalPath';
// import FourTriangles from '../components/FourTriangles';
// import {useSelector} from 'react-redux';
// import {
//   selectAIPlayers,
//   selectDiceTouch,
//   selectPlayer1,
//   selectPlayer2,
//   selectPlayer3,
//   selectPlayer4,
//   selectTotalPlayers,
// } from '../redux/reducers/gameSelector';
// import {useIsFocused} from '@react-navigation/native';
// import StartGame from '../assets/images/start.png';
// import MenuModel from '../components/MenuModel';
// import {playSound} from '../helpers/SoundUtility';
// import WinModel from '../components/WinModel';
// import {
//   Easing,
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withRepeat,
//   withTiming,
// } from 'react-native-reanimated';

// const LudoboardScreen = () => {
//   const player1 = useSelector(selectPlayer1);
//   const player2 = useSelector(selectPlayer2);
//   const player3 = useSelector(selectPlayer3);
//   const player4 = useSelector(selectPlayer4);
//   const totalPlayer = useSelector(selectTotalPlayers);
//   const AiPlayers = useSelector(selectAIPlayers);

//   // FOR ALL THE ROBOT PLAYER
//   const isPlayer1AI = AiPlayers.includes(1);
//   const isPlayer2AI = AiPlayers.includes(2);
//   const isPlayer3AI = AiPlayers.includes(3);
//   const isPlayer4AI = AiPlayers.includes(4);

//   const isDiceTouch = useSelector(selectDiceTouch);

//   const winner = useSelector(state => state.game.winners);

//   const isFocused = useIsFocused();
//   const [showStartImage, setShowStartImage] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const opacity = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     if (isFocused) {
//       setShowStartImage(true);
//       const blinkAnimation = Animated.loop(
//         Animated.sequence([
//           Animated.timing(opacity, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }),

//           Animated.timing(opacity, {
//             toValue: 1,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//         ]),
//       );

//       blinkAnimation.start();

//       const timeout = setTimeout(() => {
//         blinkAnimation.stop();
//         setShowStartImage(false);
//       }, 2500);

//       return () => {
//         blinkAnimation.stop();
//         clearTimeout(timeout);
//       };
//     }
//   }, [isFocused]);

//   const handleMenuPress = useCallback(() => {
//     console.log('Pressed Menu');
//     playSound('ui');
//     setMenuVisible(true);
//   });

//   const easing = Easing.bezier(0.25, 0.1, 0.25, 1);

//   // Characters animation values
//   const topBoyX = useSharedValue(-300);
//   const topBoyOpacity = useSharedValue(0);
//   const topBoyBounceY = useSharedValue(0);

//   const topGirlX = useSharedValue(300);
//   const topGirlOpacity = useSharedValue(0);
//   const topGirlBounceY = useSharedValue(0);

//   const bottomGirlY = useSharedValue(300);
//   const bottomGirlOpacity = useSharedValue(0);
//   const bottomGirlBounceY = useSharedValue(0);

//   const bottomBoyY = useSharedValue(300);
//   const bottomBoyOpacity = useSharedValue(0);
//   const bottomBoyBounceY = useSharedValue(0);

//   // Text animation values
//   const textOpacity = useSharedValue(0);
//   const textTranslateY = useSharedValue(20);
//   const textColorProgress = useSharedValue(0);

//   useEffect(() => {
//     // Character animations
//     topBoyX.value = withDelay(
//       200,
//       withTiming(0, {duration: 900, easing}, () => {
//         topBoyBounceY.value = withRepeat(
//           withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
//           -1,
//           true,
//         );
//       }),
//     );
//     topBoyOpacity.value = withDelay(200, withTiming(1, {duration: 700}));

//     topGirlX.value = withDelay(
//       600,
//       withTiming(0, {duration: 900, easing}, () => {
//         topGirlBounceY.value = withRepeat(
//           withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
//           -1,
//           true,
//         );
//       }),
//     );
//     topGirlOpacity.value = withDelay(600, withTiming(1, {duration: 700}));

//     bottomGirlY.value = withDelay(
//       1000,
//       withTiming(0, {duration: 900, easing}, () => {
//         bottomGirlBounceY.value = withRepeat(
//           withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
//           -1,
//           true,
//         );
//       }),
//     );
//     bottomGirlOpacity.value = withDelay(1000, withTiming(1, {duration: 700}));

//     bottomBoyY.value = withDelay(
//       1400,
//       withTiming(0, {duration: 900, easing}, () => {
//         bottomBoyBounceY.value = withRepeat(
//           withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
//           -1,
//           true,
//         );
//       }),
//     );
//     bottomBoyOpacity.value = withDelay(1400, withTiming(1, {duration: 700}));

//     // Text appearance animation
//     textOpacity.value = withDelay(2400, withTiming(1, {duration: 600, easing}));
//     textTranslateY.value = withDelay(
//       2400,
//       withTiming(0, {duration: 600, easing}),
//     );

//     // Color loop animation
//     textColorProgress.value = withDelay(
//       2400,
//       withRepeat(
//         withTiming(1, {duration: 4000, easing: Easing.linear}),
//         -1,
//         false,
//       ),
//     );
//   }, []);

//   // Animated styles

//   const sharedCharacterStyle = offsetStyle =>
//     useAnimatedStyle(() => ({
//       transform: [
//         ...offsetStyle,
//         {translateY: moveToBottom.value},
//         {scale: scaleDown.value},
//       ],
//     }));

//   const topBoyStyle = useAnimatedStyle(() => ({
//     transform: [{translateX: topBoyX.value}, {translateY: topBoyBounceY.value}],
//     opacity: topBoyOpacity.value,
//   }));

//   const topGirlStyle = useAnimatedStyle(() => ({
//     transform: [
//       {translateX: topGirlX.value},
//       {translateY: topGirlBounceY.value},
//     ],
//     opacity: topGirlOpacity.value,
//   }));

//   const bottomGirlStyle = useAnimatedStyle(() => ({
//     transform: [{translateY: bottomGirlY.value + bottomGirlBounceY.value}],
//     opacity: bottomGirlOpacity.value,
//   }));

//   const bottomBoyStyle = useAnimatedStyle(() => ({
//     transform: [{translateY: bottomBoyY.value + bottomBoyBounceY.value}],
//     opacity: bottomBoyOpacity.value,
//   }));

//   console.log('winner from ludo :: ', winner);

//   return (
//     <Wrapper>
//       <TouchableOpacity
//         style={{
//           position: 'absolute',
//           top: 60,
//           right: 20,

//           padding: 10, // Ensure touch area
//           zIndex: 100, // Ensure it's on top
//         }}
//         onPress={handleMenuPress}
//         activeOpacity={0.7}>
//         <Image
//           source={MenuIcon}
//           style={{
//             width: 30,
//             height: 30,
//           }}
//         />
//       </TouchableOpacity>

//       {/* 2nd player */}
//       <Animated.Image
//         source={
//           isPlayer2AI
//             ? require('../assets/images/robot.png')
//             : require('../assets/images/TM.png')
//         }
//         resizeMode="cover"
//         style={[
//           {
//             height: '60%',
//             width: '40%',
//             position: 'absolute',
//             top: 20,
//             left: 0,
//           },
//         ]}
//       />

//       {/* 3rd Player */}
//       <Animated.Image
//         source={
//           isPlayer3AI
//             ? require('../assets/images/robot.png')
//             : require('../assets/images/TF.png')
//         }
//         resizeMode="cover"
//         style={[
//           {
//             height: '60%',
//             width: '70%',
//             position: 'absolute',
//             top: 10,
//             right: -50,
//             transform: [
//               {scaleX: isPlayer3AI ? -1 : 1}, // Flip horizontally when AI
//             ],
//           },
//         ]}
//       />

//       {/* 1 st player*/}
//       <Animated.Image
//         source={
//           isPlayer1AI
//             ? require('../assets/images/robot.png')
//             : require('../assets/images/BG.png')
//         }
//         resizeMode="cover"
//         style={[
//           {
//             height: '60%',
//             width: '60%',
//             position: 'absolute',
//             bottom: -350,
//             left: -30,
//           },
//         ]}
//       />

//       {/* 4th Player */}
//       <Animated.Image
//         source={
//           isPlayer4AI
//             ? require('../assets/images/robot.png')
//             : require('../assets/images/BB.png')
//         }
//         resizeMode="cover"
//         style={[
//           {
//             height: '60%',
//             width: '70%',
//             position: 'absolute',
//             bottom: -350,
//             right: -30,
//             transform: [
//               {scaleX: isPlayer4AI ? -1 : 1}, // Flip horizontally when AI
//             ],
//           },
//         ]}
//       />

//       {/** BOARD CONTIANER */}
//       <View style={styles.container}>
//         {/** TOP PLAYER */}
//         <View
//           style={styles.flexRow}
//           pointerEvents={isDiceTouch ? 'none' : 'auto'}>
//           <Dice color={Colors.green} player={2} data={player2} />
//           <Dice color={Colors.yellow} rotate player={3} data={player3} />
//         </View>

//         {/**  LUDO BOARD */}
//         <View style={styles.ludoBoard}>
//           <View style={styles.plotContainer}>
//             <Pocket color={Colors.green} player={2} data={player2} />
//             <VerticalPath cells={Plot2Date} color={Colors.yellow} />
//             <Pocket color={Colors.yellow} player={3} data={player3} />
//           </View>

//           <View style={styles.pathContainer}>
//             <HorizonatalPath cells={Plot1Date} color={Colors.green} />
//             <FourTriangles
//               player1={player1}
//               player2={player2}
//               player3={player3}
//               player4={player4}
//             />
//             <HorizonatalPath cells={Plot3Date} color={Colors.blue} />
//           </View>

//           <View style={styles.plotContainer}>
//             <Pocket color={Colors.red} player={1} data={player1} />
//             <VerticalPath cells={Plot4Date} color={Colors.red} />
//             <Pocket color={Colors.blue} player={4} data={player4} />
//           </View>
//         </View>

//         {/** BOTTOM PLAYER */}
//         <View
//           style={styles.flexRow}
//           pointerEvents={isDiceTouch ? 'none' : 'auto'}>
//           <Dice color={Colors.red} player={1} data={player1} />
//           <Dice color={Colors.blue} rotate player={4} data={player4} />
//         </View>
//       </View>

//       {/** INITIAL START BLINK */}
//       {showStartImage && (
//         <Animated.Image
//           source={StartGame}
//           style={{
//             height: deviceHeight * 0.5,
//             width: deviceWidth,
//             position: 'absolute',
//             opacity,
//           }}></Animated.Image>
//       )}

//       {menuVisible && (
//         <MenuModel
//           onPressHide={() => setMenuVisible(false)}
//           visible={menuVisible}
//         />
//       )}

//       {winner != null && winner.length === 3 && <WinModel winner={winner[0]} />}
//     </Wrapper>
//   );
// };

// export default LudoboardScreen;

// const styles = StyleSheet.create({
//   container: {
//     height: deviceHeight * 0.5,
//     width: deviceWidth,
//     alignSelf: 'center',
//     justifyContent: 'center',
//   },
//   flexRow: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 30,
//     flexDirection: 'row',
//   },
//   ludoBoard: {
//     width: '100%',
//     height: '100%',
//     alignSelf: 'center',
//     padding: 20,
//     backgroundColor: Colors.blue,
//     borderRadius: 20,
//   },
//   plotContainer: {
//     width: '100%',
//     height: '40%',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     backgroundColor: Colors.board,
//   },
//   pathContainer: {
//     width: '100%',
//     height: '20%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.board,
//   },
// });

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as RNAnimated,
  Modal,
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
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAIPlayers,
  selectDiceTouch,
  selectPlayer1,
  selectPlayer2,
  selectPlayer3,
  selectPlayer4,
  selectPlayerColors,
  selectTotalPlayers,
} from '../redux/reducers/gameSelector';
import {useIsFocused} from '@react-navigation/native';
import StartGame from '../assets/images/start.png';
import MenuModel from '../components/MenuModel';
import {playSound} from '../helpers/SoundUtility';
import WinModel from '../components/WinModel';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  resetGame,
  setTotalPlayers,
  setAIPlayers,
  setPlayerColors,
} from '../redux/reducers/gameSlice';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const LudoboardScreen = ({route}) => {
  const dispatch = useDispatch();
  const [setupModalVisible, setSetupModalVisible] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState(4);
  const [selectedAI, setSelectedAI] = useState(0);

  // Get player count from navigation params if available
  useEffect(() => {
    if (route.params?.playerCount) {
      setSelectedPlayers(route.params.playerCount);
      setSelectedAI(route.params.aiCount || 0);
      startGame(route.params.playerCount, route.params.aiCount || 0);
    }
  }, [route.params]);

  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const totalPlayers = useSelector(selectTotalPlayers);
  const AiPlayers = useSelector(selectAIPlayers);
  const playerColors = useSelector(selectPlayerColors);

  console.log('Total Player :: ', totalPlayers);

  const isPlayer1AI = AiPlayers.includes(1);
  const isPlayer2AI = AiPlayers.includes(2);
  const isPlayer3AI = AiPlayers.includes(3);
  const isPlayer4AI = AiPlayers.includes(4);

  const isDiceTouch = useSelector(selectDiceTouch);
  const winner = useSelector(state => state.game.winners);
  const isFocused = useIsFocused();
  const [showStartImage, setShowStartImage] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const opacity = useRef(new RNAnimated.Value(1)).current;

  // In LudoboardScreen.js
  const [selectedColors, setSelectedColors] = useState({
    player1: Colors.red,
    player2: Colors.green,
    player3: Colors.yellow,
    player4: Colors.blue,
  });

  const availableColors = [
    Colors.red,
    Colors.green,
    Colors.yellow,
    Colors.blue,
  ];

  // const handleColorSelect = (playerNum, color) => {
  //   setSelectedColors(prev => ({
  //     ...prev,
  //     [`player${playerNum}`]: color,
  //   }));
  // };

  const handleColorSelect = (playerNum, color) => {
    setSelectedColors(prevColors => {
      // Create a copy of current colors
      const newColors = {...prevColors};
      const currentPlayerKey = `player${playerNum}`;
      const currentPlayerColor = prevColors[currentPlayerKey];

      // If selecting the same color, do nothing
      if (currentPlayerColor === color) {
        return prevColors;
      }

      // Find which player (if any) is currently using this color
      const [playerUsingColorKey] =
        Object.entries(prevColors).find(
          ([key, value]) => key !== currentPlayerKey && value === color,
        ) || [];

      if (playerUsingColorKey) {
        // Swap colors - give the other player our current color
        newColors[playerUsingColorKey] = currentPlayerColor;
      }

      // Assign the new color to current player
      newColors[currentPlayerKey] = color;

      return newColors;
    });
  };
  // const startGame = (players = selectedPlayers, aiCount = selectedAI) => {
  //   const aiPlayers = [];
  //   for (let i = 0; i < aiCount; i++) {
  //     aiPlayers.push(players - i);
  //   }

  //   // Reset the game with the new player count
  //   dispatch(resetGame());

  //   // Set the players and AI after reset
  //   dispatch(setTotalPlayers(players));
  //   dispatch(setAIPlayers(aiPlayers));

  //   setSetupModalVisible(false);
  // };

  const startGame = (players = selectedPlayers, aiCount = selectedAI) => {
    const aiPlayers = [];
    const playerColors = {};

    // Assign colors to active players
    for (let i = 1; i <= players; i++) {
      playerColors[`player${i}`] = selectedColors[`player${i}`];
    }

    // Assign AI players (last players)
    for (let i = 0; i < aiCount; i++) {
      aiPlayers.push(players - i);
    }

    dispatch(resetGame());
    dispatch(setTotalPlayers(players));
    dispatch(setAIPlayers(aiPlayers));
    dispatch(setPlayerColors(playerColors)); // You'll need to add this action
    setSetupModalVisible(false);
  };

  useEffect(() => {
    if (isFocused && !setupModalVisible) {
      setShowStartImage(true);
      const blinkAnimation = RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          RNAnimated.timing(opacity, {
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
  }, [isFocused, setupModalVisible]);

  const handleMenuPress = useCallback(() => {
    console.log('Pressed Menu');
    playSound('ui');
    setMenuVisible(true);
  });

  // Reanimated values
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

  useEffect(() => {
    if (!setupModalVisible) {
      // Character animations
      topBoyX.value = withDelay(
        200,
        withTiming(0, {
          duration: 900,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        () => {
          topBoyBounceY.value = withRepeat(
            withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
            -1,
            true,
          );
        },
      );
      topBoyOpacity.value = withDelay(200, withTiming(1, {duration: 700}));

      topGirlX.value = withDelay(
        600,
        withTiming(0, {
          duration: 900,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        () => {
          topGirlBounceY.value = withRepeat(
            withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
            -1,
            true,
          );
        },
      );
      topGirlOpacity.value = withDelay(600, withTiming(1, {duration: 700}));

      bottomGirlY.value = withDelay(
        1000,
        withTiming(0, {
          duration: 900,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        () => {
          bottomGirlBounceY.value = withRepeat(
            withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
            -1,
            true,
          );
        },
      );
      bottomGirlOpacity.value = withDelay(1000, withTiming(1, {duration: 700}));

      bottomBoyY.value = withDelay(
        1400,
        withTiming(0, {
          duration: 900,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        () => {
          bottomBoyBounceY.value = withRepeat(
            withTiming(-5, {duration: 500, easing: Easing.inOut(Easing.ease)}),
            -1,
            true,
          );
        },
      );
      bottomBoyOpacity.value = withDelay(1400, withTiming(1, {duration: 700}));
    }
  }, [setupModalVisible]);

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

  const [gameFinished, setGameFinished] = useState(false);
  useEffect(() => {
    if (
      Array.isArray(winner) &&
      winner.length === Number.parseInt(totalPlayers) - 1
    ) {
      setGameFinished(true);
    }
  }, [winner, totalPlayers]);

  return (
    <Wrapper>
      {/* Setup Modal - Only shown if no playerCount passed in route */}
      {setupModalVisible && !route.params?.playerCount && (
        <Modal
          visible={setupModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSetupModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Game Setup</Text>
              <Text style={styles.modalSection}>Number of Players:</Text>
              {/* <View style={styles.buttonRow}>
                {[2, 3, 4].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      selectedPlayers === num && styles.selectedButton,
                    ]}
                    onPress={() => {
                      setSelectedPlayers(num);
                      if (selectedAI > num) setSelectedAI(0);
                    }}>
                    <Text style={styles.buttonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View> */}
              <View style={styles.buttonRow}>
                {[2, 3, 4].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      selectedPlayers === num && styles.selectedButton,
                    ]}
                    onPress={() => {
                      setSelectedPlayers(num);
                      if (selectedAI > num) setSelectedAI(0);
                    }}>
                    <Text style={styles.buttonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Add color selection for each active player */}
              {[...Array(selectedPlayers)].map((_, i) => (
                <View key={i} style={styles.colorSelection}>
                  <Text>Player {i + 1} Color:</Text>
                  <View style={styles.colorOptions}>
                    {availableColors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          {backgroundColor: color},
                          selectedColors[`player${i + 1}`] === color &&
                            styles.selectedColor,
                        ]}
                        onPress={() => handleColorSelect(i + 1, color)}
                      />
                    ))}
                  </View>
                </View>
              ))}
              <Text style={styles.modalSection}>Number of AI Players:</Text>
              <View style={styles.buttonRow}>
                {[0, 1, 2, 3].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      selectedAI === num && styles.selectedButton,
                      num > selectedPlayers - 1 && styles.disabledButton,
                    ]}
                    disabled={num > selectedPlayers - 1}
                    onPress={() => setSelectedAI(num)}>
                    <Text style={styles.buttonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startGame()}>
                <Text style={styles.startButtonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Main Game UI */}
      {!setupModalVisible && (
        <>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 60,
              right: 20,
              padding: 10,
              zIndex: 100,
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

          {/* 2nd player */}

          {totalPlayers >= 2 && (
            <AnimatedImage
              source={
                isPlayer2AI
                  ? require('../assets/images/robot.png')
                  : require('../assets/images/TM.png')
              }
              resizeMode="cover"
              style={[
                {
                  height: '60%',
                  width: '40%',
                  position: 'absolute',
                  top: 20,
                  left: 0,
                },
                topBoyStyle,
              ]}
            />
          )}

          {/* 3rd Player */}
          {/* {totalPlayers >= 3 && (
            <AnimatedImage
              source={
                isPlayer3AI
                  ? require('../assets/images/robot.png')
                  : require('../assets/images/TF.png')
              }
              resizeMode="cover"
              style={[
                {
                  height: '60%',
                  width: '70%',
                  position: 'absolute',
                  top: 10,
                  right: -50,
                  transform: [{scaleX: isPlayer3AI ? -1 : 1}],
                },
                topGirlStyle,
              ]}
            />
          )} */}
          {totalPlayers >= 3 && (
            <View
              style={[
                {
                  height: '60%',
                  width: '70%',
                  position: 'absolute',
                  top: 10,
                  right: -50,
                  transform: [{scaleX: isPlayer3AI ? -1 : 1}],
                },
              ]}>
              <Animated.Image
                source={
                  isPlayer3AI
                    ? require('../assets/images/robot.png')
                    : require('../assets/images/TF.png')
                }
                resizeMode="cover"
                style={[
                  {
                    height: '100%',
                    width: '100%',
                  },
                  topGirlStyle,
                ]}
              />
            </View>
          )}

          {/* 1 st player*/}
          <AnimatedImage
            source={
              isPlayer1AI
                ? require('../assets/images/robot.png')
                : require('../assets/images/BG.png')
            }
            resizeMode="cover"
            style={[
              {
                height: '60%',
                width: '60%',
                position: 'absolute',
                bottom: -350,
                left: -30,
              },
              bottomGirlStyle,
            ]}
          />

          {/* 4th Player */}

          {/* {totalPlayers >= 4 && (
            <AnimatedImage
              source={
                isPlayer4AI
                  ? require('../assets/images/robot.png')
                  : require('../assets/images/BB.png')
              }
              resizeMode="cover"
              style={[
                {
                  height: '60%',
                  width: '70%',
                  position: 'absolute',
                  bottom: -350,
                  right: -30,
                  transform: [{scaleX: isPlayer4AI ? -1 : 1}],
                },
                bottomBoyStyle,
              ]}
            />
          )} */}

          {totalPlayers >= 4 && (
            <View
              style={[
                {
                  height: '60%',
                  width: '70%',
                  position: 'absolute',
                  bottom: -350,
                  right: -30,
                  transform: [{scaleX: isPlayer4AI ? -1 : 1}],
                },
              ]}>
              <Animated.Image
                source={
                  isPlayer4AI
                    ? require('../assets/images/robot.png')
                    : require('../assets/images/BB.png')
                }
                resizeMode="cover"
                style={[
                  {
                    height: '100%',
                    width: '100%',
                  },
                  bottomBoyStyle,
                ]}
              />
            </View>
          )}

          {/** BOARD CONTIANER */}
          <View style={styles.container}>
            {/** TOP PLAYER */}
            {/* <View
              style={styles.flexRow}
              pointerEvents={isDiceTouch ? 'none' : 'auto'}>
              <Dice color={Colors.green} player={2} data={player2} />
              <Dice color={Colors.yellow} rotate player={3} data={player3} />
            </View> */}

            <View style={styles.flexRow}>
              {/** GREEN */}
              {/* Only show player 2 if they're active */}
              {totalPlayers >= 2 && (
                <Dice color={playerColors.player2} player={2} data={player2} />
              )}

              {/** YELLOW */}
              {/* Only show player 3 if they're active */}
              {totalPlayers >= 3 && (
                <Dice
                  color={playerColors.player3}
                  rotate
                  player={3}
                  data={player3}
                />
              )}
            </View>

            {/**  LUDO BOARD */}
            <View style={styles.ludoBoard}>
              <View style={styles.plotContainer}>
                <Pocket
                  color={playerColors.player2}
                  player={2}
                  data={player2}
                />
                <VerticalPath cells={Plot2Date} color={playerColors.player3} />
                <Pocket
                  color={playerColors.player3}
                  player={3}
                  data={player3}
                />
              </View>

              <View style={styles.pathContainer}>
                <HorizonatalPath
                  cells={Plot1Date}
                  color={playerColors.player2}
                />
                <FourTriangles
                  player1={player1}
                  player2={player2}
                  player3={player3}
                  player4={player4}
                />
                <HorizonatalPath
                  cells={Plot3Date}
                  color={playerColors.player4}
                />
              </View>

              <View style={styles.plotContainer}>
                <Pocket
                  color={playerColors.player1}
                  player={1}
                  data={player1}
                />
                <VerticalPath cells={Plot4Date} color={playerColors.player1} />
                <Pocket
                  color={playerColors.player4}
                  player={4}
                  data={player4}
                />
              </View>
            </View>

            {/** BOTTOM PLAYER */}
            {/* <View
              style={styles.flexRow}
              pointerEvents={isDiceTouch ? 'none' : 'auto'}>
              <Dice color={Colors.red} player={1} data={player1} />
              <Dice color={Colors.blue} rotate player={4} data={player4} />
            </View> */}

            <View style={styles.flexRow}>
              {/** RED */}
              <Dice color={playerColors.player1} player={1} data={player1} />
              {/** BLUE */}
              {/* Only show player 4 if they're active */}
              {totalPlayers >= 4 && (
                <Dice
                  color={playerColors.player4}
                  rotate
                  player={4}
                  data={player4}
                />
              )}
            </View>
          </View>

          {/** INITIAL START BLINK */}
          {showStartImage && (
            <RNAnimated.Image
              source={StartGame}
              style={{
                height: deviceHeight * 0.5,
                width: deviceWidth,
                position: 'absolute',
                opacity,
              }}
            />
          )}

          {menuVisible && (
            <MenuModel
              onPressHide={() => setMenuVisible(false)}
              visible={menuVisible}
            />
          )}

          {gameFinished && winner[0] !== undefined && (
            <WinModel winner={winner[0]} />
          )}
        </>
      )}
    </Wrapper>
  );
};

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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.blue,
  },
  modalSection: {
    fontSize: 18,
    marginVertical: 10,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: Colors.blue,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  startButton: {
    marginTop: 20,
    backgroundColor: Colors.green,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
    width: '100%',
  },
  colorOptions: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: 'black',
  },
  disabledColor: {
    opacity: 0.3,
  },
});

export default LudoboardScreen;
