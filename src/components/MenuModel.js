// // import {StyleSheet, View} from 'react-native';
// // import React, {useCallback} from 'react';
// // import {useDispatch} from 'react-redux';
// // import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
// // import {playSound} from '../helpers/SoundUtility';
// // import {goBack} from '../helpers/NavigationUtils';
// // import {Modal, SlideAnimation} from 'react-native-modals'; // Updated to use react-native-modals
// // import LinearGradient from 'react-native-linear-gradient';
// // import GradientButton from './GradientButton';

// // const MenuModel = ({visible, onPressHide}) => {
// //   const dispatch = useDispatch();

// //   // Function to handle new game start
// //   const handleNewGame = useCallback(() => {
// //     try {
// //       dispatch(resetGame()); // Reset game state
// //       playSound('game_start'); // Play game start sound
// //       dispatch(announceWinner(null));
// //       onPressHide(); // Close modal
// //     } catch (error) {
// //       console.error('Error starting new game:', error);
// //     }
// //   }, [dispatch, onPressHide]);

// //   // Function to navigate back to the home screen
// //   const handleHome = useCallback(() => {
// //     try {
// //       goBack(); // Navigate back
// //       onPressHide(); // Close modal
// //     } catch (error) {
// //       console.error('Error navigating home:', error);
// //     }
// //   }, [onPressHide]);

// //   return (
// //     <Modal
// //       visible={visible}
// //       onTouchOutside={onPressHide} // Handles tap outside to close modal
// //       onSwipeOut={onPressHide} // Swipe out to close modal
// //       swipeDirection={['down']}
// //       modalAnimation={new SlideAnimation({slideFrom: 'bottom'})} // Smooth slide animation
// //       modalStyle={styles.bottomModalView}
// //       backdropOpacity={0.8}>
// //       <View style={styles.modalContainer}>
// //         <LinearGradient
// //           colors={['#0f0c29', '#302b63', '#24243e']}
// //           style={styles.gradientContainer}>
// //           <View style={styles.subView}>
// //             {/* Button Component Reusability */}
// //             <GradientButton title="RESUME" onPress={onPressHide} />
// //             <GradientButton title="NEW GAME" onPress={handleNewGame} />
// //             <GradientButton title="HOME" onPress={handleHome} />
// //           </View>
// //         </LinearGradient>
// //       </View>
// //     </Modal>
// //   );
// // };

// // export default MenuModel;

// // const styles = StyleSheet.create({
// //   bottomModalView: {
// //     justifyContent: 'center',
// //     alignSelf: 'center',
// //     width: '95%',
// //   },
// //   gradientContainer: {
// //     borderRadius: 20,
// //     overflow: 'hidden',
// //     padding: 20,
// //     paddingVertical: 40,
// //     width: '96%',
// //     borderWidth: 2,
// //     borderColor: 'gold',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   subView: {
// //     width: '100%',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContainer: {
// //     width: '100%',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// // });

import {StyleSheet, View, Animated, Easing, Dimensions} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import {playSound} from '../helpers/SoundUtility';
import {goBack} from '../helpers/NavigationUtils';
import {Modal, SlideAnimation} from 'react-native-modals';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from './GradientButton';

const {width} = Dimensions.get('window');

const MenuModel = ({visible, onPressHide}) => {
  const dispatch = useDispatch();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: 5000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(rotateValue, {
              toValue: 0,
              duration: 5000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleValue, rotateValue, opacityValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const handleNewGame = useCallback(() => {
    try {
      dispatch(resetGame());
      playSound('game_start');
      dispatch(announceWinner(null));
      onPressHide();
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  }, [dispatch, onPressHide]);

  const handleHome = useCallback(() => {
    try {
      goBack();
      onPressHide();
    } catch (error) {
      console.error('Error navigating home:', error);
    }
  }, [onPressHide]);

  return (
    <Modal
      visible={visible}
      onTouchOutside={onPressHide}
      onSwipeOut={onPressHide}
      swipeDirection={['down']}
      modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
      modalStyle={styles.bottomModalView}
      backdropOpacity={0.8}>
      {/* Semi-transparent overlay instead of blur */}
      <Animated.View style={[styles.overlay, {opacity: opacityValue}]} />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {scale: scaleValue},
              {rotate: rotateInterpolate},
              {perspective: 1000},
            ],
          },
        ]}>
        <LinearGradient
          colors={['orange', 'purple', '#24243e']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientContainer}>
          {/* 3D Border Effect */}
          <View style={styles.outerGlow} />
          <View style={styles.innerGlow} />

          <View style={styles.subView}>
            <View style={styles.buttonContainer}>
              <GradientButton
                title="RESUME"
                onPress={onPressHide}
                style={styles.buttonStyle}
              />
              <GradientButton
                title="NEW GAME"
                onPress={handleNewGame}
                style={styles.buttonStyle}
              />
              <GradientButton
                title="HOME"
                onPress={handleHome}
                style={styles.buttonStyle}
              />
            </View>
          </View>

          {/* Decorative Elements */}
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />

          {/* Floating particles for depth */}
          <View style={styles.particle1} />
          <View style={styles.particle2} />
          <View style={styles.particle3} />
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

export default MenuModel;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  bottomModalView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '95%',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{perspective: 1000}],
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    paddingVertical: 40,
    width: '96%',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    transform: [{perspective: 1000}],
  },
  outerGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    zIndex: -1,
  },
  innerGlow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  subView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  buttonStyle: {
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  // Corner decorations
  cornerTL: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: 'gold',
  },
  cornerTR: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: 'gold',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 30,
    height: 30,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'gold',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'gold',
  },
  // Floating particles for depth effect
  particle1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    transform: [{rotate: '45deg'}],
  },
  particle2: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    transform: [{rotate: '45deg'}],
  },
  particle3: {
    position: 'absolute',
    top: '30%',
    right: '20%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    transform: [{rotate: '45deg'}],
  },
});
