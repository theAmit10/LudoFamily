// import {
//   Animated,
//   Easing,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {LinearGradient} from 'react-native-linear-gradient';
// import {BackgroundImage} from '../helpers/Geticons';
// import LottieView from 'lottie-react-native';
// import DiceRoll from '../assets/animation/diceroll.json';
// import Arrow from '../assets/images/arrow.png';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   selectAIPlayers,
//   selectCellSelection,
//   selectCurrentPlayerChance,
//   selectDiceNo,
//   selectDiceRolled,
//   selectTotalPlayers,
// } from '../redux/reducers/gameSelector';
// import {
//   announceWinner,
//   enableCellSelection,
//   enablePileSelection,
//   updateDiceNo,
//   updateFireworks,
//   updatePlayerChance,
// } from '../redux/reducers/gameSlice';
// import {playSound} from '../helpers/SoundUtility';
// import {handleAITurn} from '../redux/reducers/gameAction';

// const Dice = React.memo(({color, rotate, player, data}) => {
//   const dispatch = useDispatch();
//   const totalPlayer = useSelector(selectTotalPlayers);
//   const AIPlayers = useSelector(selectAIPlayers);
//   const currentPlayerChance = useSelector(selectCurrentPlayerChance);
//   const isDiceRolled = useSelector(selectDiceRolled);
//   const diceNo = useSelector(selectDiceNo);
//   const playerPieces = useSelector(
//     state => state.game[`player${currentPlayerChance}`],
//   );

//   const pileIcon = BackgroundImage.GetImage(color);

//   // const diceNo = 1;
//   const diceIcon = BackgroundImage.GetImage(diceNo);

//   // FOR SELETED PLAYER ANIMATION
//   const arrowAnim = useRef(new Animated.Value(0)).current;
//   const [diceRolling, setDiceRolling] = useState(false);
//   const winners = useSelector(state => state.game.winners);

//   useEffect(() => {
//     const animateArrow = () => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(arrowAnim, {
//             toValue: 10,
//             duration: 600,
//             easing: Easing.out(Easing.ease),
//             useNativeDriver: true,
//           }),

//           Animated.timing(arrowAnim, {
//             toValue: -10,
//             duration: 600,
//             easing: Easing.in(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ]),
//       ).start();
//     };

//     animateArrow();
//   }, []);

//   const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//   const getNextActivePlayer = (currentPlayer, winners) => {
//     let nextPlayer = currentPlayer;
//     let attempts = 0;

//     do {
//       nextPlayer = (nextPlayer % totalPlayer) + 1;
//       attempts++;

//       // Safety check to prevent infinite loops
//       if (attempts > totalPlayer) {
//         return currentPlayer; // fallback
//       }
//     } while (winners.includes(nextPlayer));

//     return nextPlayer;
//   };

//   // Add this useEffect to handle AI dice rolling automatically
//   useEffect(() => {
//     const handleAIDiceRoll = async () => {
//       // Check if current player is AI and it's their turn
//       if (
//         AIPlayers.includes(currentPlayerChance) &&
//         currentPlayerChance === player &&
//         !isDiceRolled
//       ) {
//         // Small delay to make it feel more natural
//         await delay(500 + Math.random() * 1000);

//         // Only proceed if the component is still mounted and it's still AI's turn
//         if (
//           currentPlayerChance === player &&
//           AIPlayers.includes(currentPlayerChance)
//         ) {
//           handleDicePress();
//         }
//       }
//     };

//     handleAIDiceRoll();
//   }, [currentPlayerChance, isDiceRolled, AIPlayers]);

//   // Also modify your handleDicePress to trigger AI move after rolling
//   const handleDicePress = async () => {
//     console.log('Dice Clicked');
//     // Prevent human interaction during AI turn

//     const newDiceNo = Math.floor(Math.random() * 6) + 1;
//     // const newDiceNo = 6;
//     playSound('dice_roll');
//     setDiceRolling(true);
//     await delay(800);
//     dispatch(updateDiceNo({diceNo: newDiceNo}));
//     setDiceRolling(false);

//     // CHECKING ANY GHOTI ALIVE
//     const isAnyPieceAlive = data?.findIndex(i => i.pos != 0 && i.pos != 57);
//     const isAnyPieceLocked = data?.findIndex(i => i.pos == 0);

//     // Skip if current player has already won
//     if (winners.includes(player)) {
//       const nextPlayer = getNextActivePlayer(player, winners);
//       await delay(600);
//       if (winners.length === totalPlayer - 1) {
//         // All players have finished
//         dispatch(updateFireworks(true));
//         dispatch(announceWinner(player));
//         return;
//       }
//       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//       return;
//     }

//     if (isAnyPieceAlive == -1) {
//       if (newDiceNo == 6) {
//         dispatch(enablePileSelection({playerNo: player}));
//         // If AI player, trigger piece selection after a delay
//         if (AIPlayers.includes(player)) {
//           await delay(1000);
//           dispatch(handleAITurn());
//         }
//       } else {
//         const nextPlayer = getNextActivePlayer(player, winners);
//         await delay(600);
//         dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//       }
//     } else {
//       const canMove = playerPieces.some(
//         pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,
//       );

//       if (
//         (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
//         (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
//         (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
//       ) {
//         const nextPlayer = getNextActivePlayer(player, winners);
//         await delay(600);
//         dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//         return;
//       }

//       if (newDiceNo == 6) {
//         dispatch(enablePileSelection({playerNo: player}));
//       }
//       dispatch(enableCellSelection({playerNo: player}));

//       // If AI player, trigger piece selection after a delay
//       if (AIPlayers.includes(player)) {
//         await delay(1000);
//         dispatch(handleAITurn());
//       }
//     }
//   };

//   return (
//     <View style={[styles.flexRow, {transform: [{scaleX: rotate ? -1 : 1}]}]}>
//       <View style={styles.border1}>
//         <LinearGradient
//           style={styles.linearGradient}
//           colors={['#0052be', '#5f9fcb', '#97c6c9']}
//           start={{x: 0, y: 0.5}}
//           end={{x: 1, y: 0.5}}>
//           <View style={styles.pileContainer}>
//             <Image source={pileIcon} style={styles.pileIcon} />
//           </View>
//         </LinearGradient>
//       </View>

//       <View style={styles.border2}>
//         <LinearGradient
//           style={styles.diceGradient}
//           colors={['#aac8ab', '#aac8ab', '#aac8ab']}
//           start={{x: 0, y: 0.5}}
//           end={{x: 1, y: 0.5}}>
//           <View style={[styles.diceContainer, {backgroundColor: color}]}>
//             {currentPlayerChance === player && !diceRolling && (
//               <TouchableOpacity
//                 disabled={
//                   isDiceRolled || AIPlayers.includes(currentPlayerChance)
//                 }
//                 activeOpacity={0.4}
//                 onPress={handleDicePress}>
//                 <Image source={diceIcon} style={styles.dice} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </LinearGradient>
//       </View>

//       {/** PLAYER TURN ICON */}
//       {currentPlayerChance === player && !isDiceRolled && (
//         <Animated.View style={{transform: [{translateX: arrowAnim}]}}>
//           <Image source={Arrow} style={{width: 50, height: 30}} />
//         </Animated.View>
//       )}

//       {/** FOR DICE ICON ANIMINATION */}
//       {currentPlayerChance === player && diceRolling && (
//         <LottieView
//           source={DiceRoll}
//           style={styles.rollingDice}
//           loop={false}
//           autoPlay
//           cacheComposition={true}
//           hardwareAccelerationAndroid></LottieView>
//       )}
//     </View>
//   );
// });

// export default Dice;

// const styles = StyleSheet.create({
//   diceGradient: {
//     borderWidth: 3,
//     borderLeftWidth: 3,
//     borderColor: '#f0ce2c',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dice: {
//     height: 45,
//     width: 45,
//   },
//   diceContainer: {
//     borderWidth: 1,
//     borderRadius: 5,
//     width: 55,
//     height: 55,
//     paddingHorizontal: 8,
//     padding: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rollingDice: {
//     height: 80,
//     width: 80,
//     zIndex: 99,
//     top: -25,

//     position: 'absolute',
//   },
//   flexRow: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   border1: {
//     borderWidth: 3,
//     borderRightWidth: 0,
//     borderColor: '#f0ce2c',
//   },
//   border2: {
//     borderWidth: 3,
//     padding: 1,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     borderLeftWidth: 3,
//     borderColor: '#aac8ab',
//   },
//   pileIcon: {
//     width: 35,
//     height: 35,
//   },
//   pileContainer: {
//     paddingHorizontal: 3,
//   },
// });

// // import {
// //   Animated,
// //   Easing,
// //   Image,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import React, {useEffect, useRef, useState} from 'react';
// // import {LinearGradient} from 'react-native-linear-gradient';
// // import {BackgroundImage} from '../helpers/Geticons';
// // import LottieView from 'lottie-react-native';
// // import DiceRoll from '../assets/animation/diceroll.json';
// // import Arrow from '../assets/images/arrow.png';
// // import {useDispatch, useSelector} from 'react-redux';
// // import {
// //   selectAIPlayers,
// //   selectCellSelection,
// //   selectCurrentPlayerChance,
// //   selectDiceNo,
// //   selectDiceRolled,
// //   selectTotalPlayers,
// // } from '../redux/reducers/gameSelector';
// // import {
// //   announceWinner,
// //   enableCellSelection,
// //   enablePileSelection,
// //   updateDiceNo,
// //   updateFireworks,
// //   updatePlayerChance,
// // } from '../redux/reducers/gameSlice';
// // import {playSound} from '../helpers/SoundUtility';
// // import {handleAITurn} from '../redux/reducers/gameAction';

// // const Dice = React.memo(({color, rotate, player, data}) => {
// //   const dispatch = useDispatch();
// //   const totalPlayer = useSelector(selectTotalPlayers);
// //   const AIPlayers = useSelector(selectAIPlayers);
// //   const currentPlayerChance = useSelector(selectCurrentPlayerChance);
// //   const isDiceRolled = useSelector(selectDiceRolled);
// //   const diceNo = useSelector(selectDiceNo);
// //   const playerPieces = useSelector(
// //     state => state.game[`player${currentPlayerChance}`],
// //   );

// //   const pileIcon = BackgroundImage.GetImage(color);

// //   // const diceNo = 1;
// //   const diceIcon = BackgroundImage.GetImage(diceNo);

// //   // FOR SELETED PLAYER ANIMATION
// //   const arrowAnim = useRef(new Animated.Value(0)).current;
// //   const [diceRolling, setDiceRolling] = useState(false);
// //   const winners = useSelector(state => state.game.winners);

// //   useEffect(() => {
// //     const animateArrow = () => {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.timing(arrowAnim, {
// //             toValue: 10,
// //             duration: 600,
// //             easing: Easing.out(Easing.ease),
// //             useNativeDriver: true,
// //           }),

// //           Animated.timing(arrowAnim, {
// //             toValue: -10,
// //             duration: 600,
// //             easing: Easing.in(Easing.ease),
// //             useNativeDriver: true,
// //           }),
// //         ]),
// //       ).start();
// //     };

// //     animateArrow();
// //   }, []);

// //   // console.log(currentPlayerChance);

// //   const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// //   // const handleDicePress = async () => {
// //   //   console.log('Dice Clicked');
// //   //   const newDiceNo = Math.floor(Math.random() * 6) + 1;
// //   //   // const newDiceNo = 1; // For testing, replace with random later
// //   //   playSound('dice_roll');
// //   //   setDiceRolling(true);
// //   //   await delay(800);
// //   //   dispatch(updateDiceNo({diceNo: newDiceNo}));
// //   //   setDiceRolling(false);

// //   //   // CHECKING ANY GHOTI ALIVE
// //   //   const isAnyPieceAlive = data?.findIndex(i => i.pos != 0 && i.pos != 57);
// //   //   const isAnyPieceLocked = data?.findIndex(i => i.pos == 0);

// //   //   // Skip if current player has already won
// //   //   if (winners.includes(player)) {
// //   //     const nextPlayer = getNextActivePlayer(player, winners);
// //   //     await delay(600);
// //   //     if (winners.length === totalPlayer - 1) {
// //   //       // All players have finished
// //   //       dispatch(updateFireworks(true));
// //   //       dispatch(announceWinner(player));
// //   //       // playSound('cheer');
// //   //       return;
// //   //     }
// //   //     dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //   //     return;
// //   //   }

// //   //   if (isAnyPieceAlive == -1) {
// //   //     if (newDiceNo == 6) {
// //   //       dispatch(enablePileSelection({playerNo: player}));
// //   //     } else {
// //   //       const nextPlayer = getNextActivePlayer(player, winners);
// //   //       await delay(600);
// //   //       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //   //     }
// //   //   } else {
// //   //     const canMove = playerPieces.some(
// //   //       pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,
// //   //     );

// //   //     if (
// //   //       (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
// //   //       (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
// //   //       (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
// //   //     ) {
// //   //       const nextPlayer = getNextActivePlayer(player, winners);
// //   //       await delay(600);
// //   //       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //   //       return;
// //   //     }

// //   //     if (newDiceNo == 6) {
// //   //       dispatch(enablePileSelection({playerNo: player}));
// //   //     }
// //   //     dispatch(enableCellSelection({playerNo: player}));
// //   //   }
// //   // };

// //   // Helper function to find next active player
// //   const getNextActivePlayer = (currentPlayer, winners) => {
// //     let nextPlayer = currentPlayer;
// //     let attempts = 0;

// //     do {
// //       nextPlayer = (nextPlayer % totalPlayer) + 1;
// //       attempts++;

// //       // Safety check to prevent infinite loops
// //       if (attempts > totalPlayer) {
// //         return currentPlayer; // fallback
// //       }
// //     } while (winners.includes(nextPlayer));

// //     return nextPlayer;
// //   };

// //   // Add this useEffect to handle AI dice rolling automatically
// //   useEffect(() => {
// //     const handleAIDiceRoll = async () => {
// //       // Check if current player is AI and it's their turn
// //       if (
// //         AIPlayers.includes(currentPlayerChance) &&
// //         currentPlayerChance === player &&
// //         !isDiceRolled
// //       ) {
// //         // Small delay to make it feel more natural
// //         await delay(500 + Math.random() * 1000);

// //         // Only proceed if the component is still mounted and it's still AI's turn
// //         if (
// //           currentPlayerChance === player &&
// //           AIPlayers.includes(currentPlayerChance)
// //         ) {
// //           handleDicePress();
// //         }
// //       }
// //     };

// //     handleAIDiceRoll();
// //   }, [currentPlayerChance, isDiceRolled, AIPlayers]);

// //   // Also modify your handleDicePress to trigger AI move after rolling
// //   const handleDicePress = async () => {
// //     console.log('Dice Clicked');
// //     const newDiceNo = Math.floor(Math.random() * 6) + 1;
// //     // const newDiceNo = 6;
// //     playSound('dice_roll');
// //     setDiceRolling(true);
// //     await delay(800);
// //     dispatch(updateDiceNo({diceNo: newDiceNo}));
// //     setDiceRolling(false);

// //     // CHECKING ANY GHOTI ALIVE
// //     const isAnyPieceAlive = data?.findIndex(i => i.pos != 0 && i.pos != 57);
// //     const isAnyPieceLocked = data?.findIndex(i => i.pos == 0);

// //     // Skip if current player has already won
// //     if (winners.includes(player)) {
// //       const nextPlayer = getNextActivePlayer(player, winners);
// //       await delay(600);
// //       if (winners.length === totalPlayer - 1) {
// //         // All players have finished
// //         dispatch(updateFireworks(true));
// //         dispatch(announceWinner(player));
// //         return;
// //       }
// //       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //       return;
// //     }

// //     if (isAnyPieceAlive == -1) {
// //       if (newDiceNo == 6) {
// //         dispatch(enablePileSelection({playerNo: player}));
// //         // If AI player, trigger piece selection after a delay
// //         if (AIPlayers.includes(player)) {
// //           await delay(1000);
// //           dispatch(handleAITurn());
// //         }
// //       } else {
// //         const nextPlayer = getNextActivePlayer(player, winners);
// //         await delay(600);
// //         dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //       }
// //     } else {
// //       const canMove = playerPieces.some(
// //         pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,
// //       );

// //       if (
// //         (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
// //         (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
// //         (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
// //       ) {
// //         const nextPlayer = getNextActivePlayer(player, winners);
// //         await delay(600);
// //         dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //         return;
// //       }

// //       if (newDiceNo == 6) {
// //         dispatch(enablePileSelection({playerNo: player}));
// //       }
// //       dispatch(enableCellSelection({playerNo: player}));

// //       // If AI player, trigger piece selection after a delay
// //       if (AIPlayers.includes(player)) {
// //         await delay(1000);
// //         dispatch(handleAITurn());
// //       }
// //     }
// //   };

// //   return (
// //     <View style={[styles.flexRow, {transform: [{scaleX: rotate ? -1 : 1}]}]}>
// //       <View style={styles.border1}>
// //         <LinearGradient
// //           style={styles.linearGradient}
// //           colors={['#0052be', '#5f9fcb', '#97c6c9']}
// //           start={{x: 0, y: 0.5}}
// //           end={{x: 1, y: 0.5}}>
// //           <View style={styles.pileContainer}>
// //             <Image source={pileIcon} style={styles.pileIcon} />
// //           </View>
// //         </LinearGradient>
// //       </View>

// //       <View style={styles.border2}>
// //         <LinearGradient
// //           style={styles.diceGradient}
// //           colors={['#aac8ab', '#aac8ab', '#aac8ab']}
// //           start={{x: 0, y: 0.5}}
// //           end={{x: 1, y: 0.5}}>
// //           <View style={[styles.diceContainer, {backgroundColor: color}]}>
// //             {currentPlayerChance === player && !diceRolling && (
// //               <TouchableOpacity
// //                 disabled={
// //                   isDiceRolled || AIPlayers.includes(currentPlayerChance)
// //                 }
// //                 activeOpacity={0.4}
// //                 onPress={handleDicePress}>
// //                 <Image source={diceIcon} style={styles.dice} />
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </LinearGradient>
// //       </View>

// //       {/** PLAYER TURN ICON */}
// //       {currentPlayerChance === player && !isDiceRolled && (
// //         <Animated.View style={{transform: [{translateX: arrowAnim}]}}>
// //           <Image source={Arrow} style={{width: 50, height: 30}} />
// //         </Animated.View>
// //       )}

// //       {/** FOR DICE ICON ANIMINATION */}
// //       {currentPlayerChance === player && diceRolling && (
// //         <LottieView
// //           source={DiceRoll}
// //           style={styles.rollingDice}
// //           loop={false}
// //           autoPlay
// //           cacheComposition={true}
// //           hardwareAccelerationAndroid></LottieView>
// //       )}
// //     </View>
// //   );
// // });

// // export default Dice;

// // const styles = StyleSheet.create({
// //   diceGradient: {
// //     borderWidth: 3,
// //     borderLeftWidth: 3,
// //     borderColor: '#f0ce2c',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   dice: {
// //     height: 45,
// //     width: 45,
// //   },
// //   diceContainer: {
// //     borderWidth: 1,
// //     borderRadius: 5,
// //     width: 55,
// //     height: 55,
// //     paddingHorizontal: 8,
// //     padding: 4,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   rollingDice: {
// //     height: 80,
// //     width: 80,
// //     zIndex: 99,
// //     top: -25,

// //     position: 'absolute',
// //   },
// //   flexRow: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //   },
// //   border1: {
// //     borderWidth: 3,
// //     borderRightWidth: 0,
// //     borderColor: '#f0ce2c',
// //   },
// //   border2: {
// //     borderWidth: 3,
// //     padding: 1,
// //     backgroundColor: 'red',
// //     borderRadius: 10,
// //     borderLeftWidth: 3,
// //     borderColor: '#aac8ab',
// //   },
// //   pileIcon: {
// //     width: 35,
// //     height: 35,
// //   },
// //   pileContainer: {
// //     paddingHorizontal: 3,
// //   },
// // });

import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {BackgroundImage} from '../helpers/Geticons';
import LottieView from 'lottie-react-native';
import DiceRoll from '../assets/animation/diceroll.json';
import Arrow from '../assets/images/arrow.png';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAIPlayers,
  selectCellSelection,
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
  selectTotalPlayers,
} from '../redux/reducers/gameSelector';
import {
  announceWinner,
  enableCellSelection,
  enablePileSelection,
  updateDiceNo,
  updateFireworks,
  updatePlayerChance,
} from '../redux/reducers/gameSlice';
import {playSound} from '../helpers/SoundUtility';
import {handleAITurn} from '../redux/reducers/gameAction';

const Dice = React.memo(({color, rotate, player, data}) => {
  const dispatch = useDispatch();
  const totalPlayer = useSelector(selectTotalPlayers);
  const AIPlayers = useSelector(selectAIPlayers);
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(
    state => state.game[`player${currentPlayerChance}`],
  );

  // Don't render if this player is beyond the total player count
  if (player > totalPlayer) {
    return null;
  }

  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);

  const arrowAnim = useRef(new Animated.Value(0)).current;
  const [diceRolling, setDiceRolling] = useState(false);
  const winners = useSelector(state => state.game.winners);

  useEffect(() => {
    const animateArrow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 10,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(arrowAnim, {
            toValue: -10,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateArrow();
  }, []);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const getNextActivePlayer = (currentPlayer, winners) => {
    let nextPlayer = currentPlayer;
    let attempts = 0;

    do {
      nextPlayer = (nextPlayer % totalPlayer) + 1;
      attempts++;

      if (attempts > totalPlayer) {
        return currentPlayer; // fallback
      }
    } while (winners.includes(nextPlayer));

    return nextPlayer;
  };

  useEffect(() => {
    const handleAIDiceRoll = async () => {
      if (
        AIPlayers.includes(currentPlayerChance) &&
        currentPlayerChance === player &&
        !isDiceRolled
      ) {
        await delay(500 + Math.random() * 1000);

        if (
          currentPlayerChance === player &&
          AIPlayers.includes(currentPlayerChance)
        ) {
          handleDicePress();
        }
      }
    };

    handleAIDiceRoll();
  }, [currentPlayerChance, isDiceRolled, AIPlayers]);

  const handleDicePress = async () => {
    console.log('Dice Clicked');
    // const newDiceNo = 2;
    const newDiceNo = Math.floor(Math.random() * 6) + 1;
    playSound('dice_roll');
    setDiceRolling(true);
    await delay(800);
    dispatch(updateDiceNo({diceNo: newDiceNo}));
    setDiceRolling(false);

    const isAnyPieceAlive = data?.findIndex(i => i.pos != 0 && i.pos != 57);
    const isAnyPieceLocked = data?.findIndex(i => i.pos == 0);

    if (winners.includes(player)) {
      const nextPlayer = getNextActivePlayer(player, winners);
      await delay(600);
      if (winners.length === totalPlayer - 1) {
        dispatch(updateFireworks(true));
        dispatch(announceWinner(player));
        return;
      }
      dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
      return;
    }

    if (isAnyPieceAlive == -1) {
      if (newDiceNo == 6) {
        dispatch(enablePileSelection({playerNo: player}));
        if (AIPlayers.includes(player)) {
          await delay(1000);
          dispatch(handleAITurn());
        }
      } else {
        const nextPlayer = getNextActivePlayer(player, winners);
        await delay(600);
        dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
      }
    } else {
      const canMove = playerPieces.some(
        pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,
      );

      if (
        (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
      ) {
        const nextPlayer = getNextActivePlayer(player, winners);
        await delay(600);
        dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
        return;
      }

      if (newDiceNo == 6) {
        dispatch(enablePileSelection({playerNo: player}));
      }
      dispatch(enableCellSelection({playerNo: player}));

      if (AIPlayers.includes(player)) {
        await delay(1000);
        dispatch(handleAITurn());
      }
    }
  };

  return (
    <View style={[styles.flexRow, {transform: [{scaleX: rotate ? -1 : 1}]}]}>
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View style={styles.pileContainer}>
            <Image source={pileIcon} style={styles.pileIcon} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.border2}>
        <LinearGradient
          style={styles.diceGradient}
          colors={['#aac8ab', '#aac8ab', '#aac8ab']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View style={[styles.diceContainer, {backgroundColor: color}]}>
            {currentPlayerChance === player && !diceRolling && (
              <TouchableOpacity
                disabled={
                  isDiceRolled || AIPlayers.includes(currentPlayerChance)
                }
                activeOpacity={0.4}
                onPress={handleDicePress}>
                <Image source={diceIcon} style={styles.dice} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {/** PLAYER TURN ICON */}
      {currentPlayerChance === player && !isDiceRolled && (
        <Animated.View style={{transform: [{translateX: arrowAnim}]}}>
          <Image source={Arrow} style={{width: 50, height: 30}} />
        </Animated.View>
      )}

      {/** FOR DICE ICON ANIMINATION */}
      {currentPlayerChance === player && diceRolling && (
        <LottieView
          source={DiceRoll}
          style={styles.rollingDice}
          loop={false}
          autoPlay
          cacheComposition={true}
          hardwareAccelerationAndroid></LottieView>
      )}
    </View>
  );
});

export default Dice;

const styles = StyleSheet.create({
  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    height: 45,
    width: 45,
  },
  diceContainer: {
    borderWidth: 1,
    borderRadius: 5,
    width: 55,
    height: 55,
    paddingHorizontal: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rollingDice: {
    height: 80,
    width: 80,
    zIndex: 99,
    top: -25,
    position: 'absolute',
  },
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  border1: {
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
  },
  border2: {
    borderWidth: 3,
    padding: 1,
    backgroundColor: 'red',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderColor: '#aac8ab',
  },
  pileIcon: {
    width: 35,
    height: 35,
  },
  pileContainer: {
    paddingHorizontal: 3,
  },
});
