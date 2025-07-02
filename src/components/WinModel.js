import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import {playSound} from '../helpers/SoundUtility';
import {goBack, resetAndNavigate} from '../helpers/NavigationUtils';
import {Modal, SlideAnimation} from 'react-native-modals';
import LinearGradient from 'react-native-linear-gradient';
import Pile from './Pile';
import {colorPlayer} from '../helpers/PlotDate';
import LottieView from 'lottie-react-native';
import GradientButton from './GradientButton';
import HeartGirl from '../assets/animation/girl.json';
import Trophy from '../assets/animation/trophy.json';
import Firework from '../assets/animation/firework.json';

const WinModel = ({winner}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(!!winner);

  useEffect(() => {
    setVisible(!!winner);
  }, [winner]);

  // const handleNewGame = () => {
  //   dispatch(resetGame());
  //   dispatch(announceWinner(null));
  //   playSound('game_start');
  // };

  // const handleHome = () => {
  //   dispatch(resetGame());
  //   dispatch(announceWinner(null));
  //   resetAndNavigate('HomeScreen');
  // };

  const handleNewGame = useCallback(() => {
    try {
      dispatch(resetGame());
      playSound('game_start');
      dispatch(announceWinner(null));
      // onPressHide();
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  }, [dispatch]);

  const handleHome = useCallback(() => {
    try {
      goBack();
      // onPressHide();
    } catch (error) {
      console.error('Error navigating home:', error);
    }
  }, [onPressHide]);

  return (
    <Modal
      visible={visible}
      onTouchOutside={() => {}}
      onSwipeOut={() => {}}
      swipeDirection={['down']}
      modalAnimation={new SlideAnimation({slideFrom: 'bottom'})}
      modalStyle={styles.modal}
      backdropOpacity={0.8}>
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.gradientContainer}>
        <View style={styles.content}>
          <View style={styles.pileContainer}>
            <Pile player={1} color={colorPlayer[winner - 1]} />
          </View>
        </View>

        <Text style={styles.congratsText}>
          Congratulations! PLAYER {winner}
        </Text>

        {/* Trophy Animation */}
        <LottieView
          autoPlay
          hardwareAccelerationAndroid
          loop={true}
          source={Trophy}
          style={styles.trophyAnimation}
        />

        {/* Firework Animation */}
        <LottieView
          autoPlay
          hardwareAccelerationAndroid
          loop={true}
          source={Firework}
          style={styles.fireworkAnimation}
        />

        <GradientButton title="NEW GAME" onPress={handleNewGame} />
        <GradientButton title="HOME" onPress={handleHome} />
      </LinearGradient>

      {/* Girl Animation */}
      <LottieView
        autoPlay
        hardwareAccelerationAndroid
        loop={true}
        source={HeartGirl}
        style={styles.girlAnimation}
      />
    </Modal>
  );
};

export default WinModel;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  gradientContainer: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  pileContainer: {
    width: 90,
    height: 40,
  },
  congratsText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Philosopher-Bold',
    marginTop: 10,
  },
  trophyAnimation: {
    height: 200,
    width: 200,
    marginTop: 20,
  },
  fireworkAnimation: {
    height: 200,
    width: 500,
    position: 'absolute',
    zIndex: -1,
    marginTop: 20,
  },
  girlAnimation: {
    height: 500,
    width: 380,
    position: 'absolute',
    bottom: -200,
    right: -120,
    zIndex: 99,
  },
});

// import {StyleSheet, Text, View} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {useDispatch} from 'react-redux';
// import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
// import {playSound} from '../helpers/SoundUtility';
// import {resetAndNavigate} from '../helpers/NavigationUtils';
// import {Modal, SlideAnimation} from 'react-native-modals';
// import LinearGradient from 'react-native-linear-gradient';
// import Pile from './Pile';
// import {colorPlayer} from '../helpers/PlotDate';
// import LottieView from 'lottie-react-native';
// import GradientButton from './GradientButton';
// import HeartGirl from '../assets/animation/girl.json';
// import Trophy from '../assets/animation/trophy.json';
// import Firework from '../assets/animation/firework.json';

// const WinModel = ({winner}) => {
//   const dispatch = useDispatch();
//   const [visible, setVisible] = useState(!!winner);

//   useEffect(() => {
//     setVisible(!winner);
//   }, [winner]);

//   const handleNewGame = () => {
//     dispatch(resetGame());
//     dispatch(announceWinner(null));
//     playSound('game_start');
//   };
//   const handleHome = () => {
//     dispatch(resetGame());
//     dispatch(announceWinner(null));
//     resetAndNavigate('HomeScreen');
//   };

//   return (
//     <Modal
//       visible={visible}

//       onTouchOutside={()=>{}} // Handles tap outside to close modal
//       onSwipeOut={()=>{}} // Swipe out to close modal
//       swipeDirection={['down']}
//       modalAnimation={new SlideAnimation({slideFrom: 'bottom'})} // Smooth slide animation
//       modalStyle={styles.modal}
//       backdropOpacity={0.8}>
//       <LinearGradient
//         colors={['#0f0c29', '#302b63', '#24243e']}
//         style={styles.gradientContainer}>
//         <View style={styles.content}>
//           <View style={styles.pileContainer}>
//             <Pile player={1} color={colorPlayer[winner - 1]} />
//           </View>
//         </View>
//         <Text style={styles.congratsText}>Congratulation! PLAYER{winner}</Text>
//         <LottieView
//           autoPlay
//           hardwareAccelerationAndroid
//           loop={true}
//           source={Trophy}
//           style={styles.trophyAnimation}>
//           <LottieView
//             autoPlay
//             hardwareAccelerationAndroid
//             loop={true}
//             source={Firework}
//             style={styles.fireworkAnimation}></LottieView>

//           <GradientButton title="NEW GAME" onPress={handleNewGame} />
//           <GradientButton title="HOME" onPress={handleHome} />
//         </LottieView>
//       </LinearGradient>

//       <LottieView
//         autoPlay
//         hardwareAccelerationAndroid
//         loop={true}
//         source={HeartGirl}
//         style={styles.girlAnimation}></LottieView>
//     </Modal>
//   );
// };

// export default WinModel;

// const styles = StyleSheet.create({
//   modal: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gradientContainer: {
//     borderRadius: 20,
//     padding: 20,
//     width: '96%',
//     borderWidth: 2,
//     borderColor: 'gold',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   pileContainer: {
//     width: 90,
//     height: 40,
//   },
//   congratsText: {
//     fontSize: 18,
//     color: 'white',
//     fontFamily: 'Philosopher-Bold',
//     marginTop: 10,
//   },
//   trophyAnimation: {
//     height: 200,
//     width: 200,
//     marginTop: 20,
//   },
//   fireworkAnimation: {
//     height: 200,
//     width: 500,
//     position: 'absolute',
//     zIndex: -1,
//     marginTop: 20,
//   },
//   girlAnimation: {
//     height: 500,
//     width: 380,
//     position: 'absolute',
//     bottom: -200,
//     right: -120,
//     zIndex: 99,
//   },
// });
