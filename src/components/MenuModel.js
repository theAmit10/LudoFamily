import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import {playSound} from '../helpers/SoundUtility';
import {goBack} from '../helpers/NavigationUtils';
import {Modal,SlideAnimation} from 'react-native-modals';  // Updated to use react-native-modals
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from './GradientButton';

const MenuModel = ({visible, onPressHide}) => {
  const dispatch = useDispatch();

  // Function to handle new game start
  const handleNewGame = useCallback(() => {
    try {
      dispatch(resetGame());           // Reset game state
      playSound('game_start');         // Play game start sound
      dispatch(announceWinner(null))
      onPressHide();                   // Close modal
    } catch (error) {
      console.error("Error starting new game:", error);
    }
  }, [dispatch, onPressHide]);

  // Function to navigate back to the home screen
  const handleHome = useCallback(() => {
    try {
      goBack();                        // Navigate back
      onPressHide();                   // Close modal
    } catch (error) {
      console.error("Error navigating home:", error);
    }
  }, [onPressHide]);

  return (
    <Modal
      visible={visible}
      onTouchOutside={onPressHide}         // Handles tap outside to close modal
      onSwipeOut={onPressHide}             // Swipe out to close modal
      swipeDirection={['down']}
      modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}  // Smooth slide animation
      modalStyle={styles.bottomModalView}
      backdropOpacity={0.8}>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#0f0c29', '#302b63', '#24243e']}
          style={styles.gradientContainer}>
          <View style={styles.subView}>
            {/* Button Component Reusability */}
            <GradientButton title="RESUME" onPress={onPressHide} />
            <GradientButton title="NEW GAME" onPress={handleNewGame} />
            <GradientButton title="HOME" onPress={handleHome} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default MenuModel;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '95%',
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    paddingVertical: 40,
    width: '96%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


// import {StyleSheet, Text, View} from 'react-native';
// import React, {useCallback} from 'react';
// import {useDispatch} from 'react-redux';
// import {resetGame} from '../redux/reducers/gameSlice';
// import {playSound} from '../helpers/SoundUtility';
// import {goBack} from '../helpers/NavigationUtils';
// import Modal from 'react-native-models';
// import LinearGradient from 'react-native-linear-gradient';
// import GradientButton from './GradientButton';

// const MenuModel = ({visible, onPressHide}) => {
//   const dispatch = useDispatch();
//   const handleNewGame = useCallback(() => {
//     dispatch(resetGame());
//     playSound('game_start');
//     onPressHide();
//   }, [dispatch, onPressHide]);

//   const handleHome = useCallback(() => {
//     goBack();
//   });
//   return (
//     <Modal
//       style={styles.bottomModelView}
//       isVisible={visible}
//       backdropColor="black"
//       backdropOpacity={0.8}
//       onBackDropPress={onPressHide}
//       animationIn="zoomIn"
//       animationOut="zoomOut"
//       onBackButtonPress={onPressHide}>
//       <View style={styles.modalContainer}>
//         <LinearGradient
//           colors={['#0f0c29', '#302b63', '#24243e']}
//           style={styles.gradientContainer}>
//           <View style={styles.subView}>
//             <GradientButton title="RESUME" onPress={onPressHide} />
//             <GradientButton title="NEW GAME" onPress={handleNewGame} />
//             <GradientButton title="HOME" onPress={handleHome} />
//           </View>
//         </LinearGradient>
//       </View>
//     </Modal>
//   );
// };

// export default MenuModel;

// const styles = StyleSheet.create({
//     bottomModelView:{
//         justifyContent: 'center',
//         width: '95%',
//         alignSelf: 'center'
//     },
//     gradientContainer:{
//         borderRadius : 20,
//         overflow: 'hidden',
//         padding: 20,
//         paddingVertical : 40,
//         width: '96%',
//         borderWidth: 2,
//         borderColor: 'gold',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     subView: {
//         width: '100%',
//         alignSelf: 'center',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     modalContainer:{
//         width: '100%',
//         justifyContent: 'center',
//         alignItems: 'center'
//     }

// });
