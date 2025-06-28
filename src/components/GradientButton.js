// // // import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// // // import React from 'react';
// // // import {playSound} from '../helpers/SoundUtility';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import {
// // //   ComputerDesktopIcon,
// // //   HomeIcon,
// // //   PlayCircleIcon,
// // //   PlayPauseIcon,
// // //   UsersIcon,
// // // } from 'react-native-heroicons/outline';
// // // import {RFValue} from 'react-native-responsive-fontsize';

// // // const iconSize = RFValue(40);

// // // const GradientButton = ({title, onPress, iconColor = '#d5be3e'}) => {
// // //   return (
// // //     <View
// // //       style={{
// // //         borderRadius: 10,
// // //         borderWidth: 2,
// // //         borderColor: '#000',
// // //         marginVertical: 10,
// // //       }}>
// // //       <TouchableOpacity
// // //         activeOpacity={0.4}
// // //         onPress={() => {
// // //           playSound('ui');
// // //           onPress();
// // //         }}
// // //         style={styles.btnContainer}>
// // //         <LinearGradient
// // //           colors={['#4c669f', '#3b5998', '#192f6a']}
// // //           style={styles.button}
// // //           start={{x: 0, y: 0}}
// // //           end={{x: 0, y: 1}}>
// // //           {title == 'RESUME' ? (
// // //             <PlayPauseIcon size={iconSize} color={iconColor} />
// // //           ) : title == 'NEW GAME' ? (
// // //             <PlayCircleIcon size={iconSize} color={iconColor} />
// // //           ) : title == 'VS CPU' ? (
// // //             <ComputerDesktopIcon size={iconSize} color={iconColor} />
// // //           ) : title == 'HOME' ? (
// // //             <HomeIcon size={iconSize} color={iconColor} />
// // //           ) : (
// // //             <UsersIcon size={iconSize} color={iconColor} />
// // //           )}
// // //           <Text style={styles.buttonText}>{title}</Text>
// // //         </LinearGradient>
// // //       </TouchableOpacity>
// // //     </View>
// // //   );
// // // };

// // // export default GradientButton;

// // // const styles = StyleSheet.create({
// // //   button: {
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 5,
// // //     borderWidth: 2,
// // //     borderColor: '#000',
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     gap: 20,
// // //   },
// // //   btnContainer: {
// // //     borderWidth: 2,
// // //     borderRadius: 10,
// // //     elevation: 5,
// // //     backgroundColor: 'white',
// // //     shadowColor: '#d5be3e',
// // //     shadowOpacity: 0.5,
// // //     shadowOffset: {width: 1, height: 1},
// // //     shadowRadius: 10,
// // //     borderColor: '#d5be3e',
// // //     width: 240,
// // //   },
// // //   buttonText: {
// // //     color: 'white',
// // //     fontSize: RFValue(16),
// // //     width: '70%',
// // //     textAlign: 'left',
// // //     fontFamily: 'Philosopher-Bold',
// // //   },
// // // });

// import {
//   StyleSheet,
//   Text,
//   TouchableWithoutFeedback,
//   Animated,
//   View,
// } from 'react-native';
// import React, {useRef} from 'react';
// import {playSound} from '../helpers/SoundUtility';
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   ComputerDesktopIcon,
//   HomeIcon,
//   PlayCircleIcon,
//   PlayPauseIcon,
//   UsersIcon,
// } from 'react-native-heroicons/outline';
// import {RFValue} from 'react-native-responsive-fontsize';

// const iconSize = RFValue(28);

// const GradientButton = ({title, onPress, iconColor = '#ffe36e'}) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const handlePressIn = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.95,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       friction: 3,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//     playSound('ui');
//     onPress();
//   };

//   const renderIcon = () => {
//     switch (title) {
//       case 'RESUME':
//         return <PlayPauseIcon size={iconSize} color={iconColor} />;
//       case 'NEW GAME':
//         return <PlayCircleIcon size={iconSize} color={iconColor} />;
//       case 'VS CPU':
//         return <ComputerDesktopIcon size={iconSize} color={iconColor} />;
//       case 'HOME':
//         return <HomeIcon size={iconSize} color={iconColor} />;
//       default:
//         return <UsersIcon size={iconSize} color={iconColor} />;
//     }
//   };

//   return (
//     <View style={styles.outerGlow}>
//       <TouchableWithoutFeedback
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}>
//         <Animated.View
//           style={[styles.btnContainer, {transform: [{scale: scaleAnim}]}]}>
//           <LinearGradient
//             colors={['#FF6B6B', '#FFD93D', '#6BCB77']}
//             style={styles.button}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 1}}>
//             {renderIcon()}
//             <Text style={styles.buttonText}>{title}</Text>
//           </LinearGradient>
//         </Animated.View>
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

// export default GradientButton;

// const styles = StyleSheet.create({
//   outerGlow: {
//     marginVertical: 10,
//     borderRadius: 16,
//     shadowColor: '#FFD93D',
//     shadowOffset: {width: 0, height: 0},
//     shadowOpacity: 0.8,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   btnContainer: {
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   button: {
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     gap: 14,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: RFValue(17),
//     fontFamily: 'Philosopher-Bold',
//     letterSpacing: 1,
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
  View,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  ComputerDesktopIcon,
  HomeIcon,
  PlayCircleIcon,
  PlayPauseIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';
import {RFValue} from 'react-native-responsive-fontsize';
import {playSound} from '../helpers/SoundUtility';

const iconSize = RFValue(26);

const GradientButton = ({title, onPress, iconColor = '#00ffe7'}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 🔄 Pulse Animation for Icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    playSound('ui');
    onPress();
  };

  const renderIcon = () => {
    const IconComponent =
      title === 'RESUME'
        ? PlayPauseIcon
        : title === 'NEW GAME'
        ? PlayCircleIcon
        : title === 'VS CPU'
        ? ComputerDesktopIcon
        : title === 'HOME'
        ? HomeIcon
        : UsersIcon;

    return (
      <Animated.View style={{transform: [{scale: pulseAnim}]}}>
        <IconComponent size={iconSize} color={iconColor} />
      </Animated.View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[styles.glowContainer, {transform: [{scale: scaleAnim}]}]}>
        <LinearGradient
          colors={['#00f0ff', '#ff00f0', '#ffea00']}
          start={{x: 0.1, y: 0}}
          end={{x: 0.9, y: 1}}
          style={styles.borderWrapper}>
          <View style={styles.innerContainer}>
            {renderIcon()}
            <Text style={styles.glowingText}>{title}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  glowContainer: {
    borderRadius: 20,
    marginVertical: 12,
    shadowColor: '#00ffe7',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
  },
  borderWrapper: {
    borderRadius: 20,
    padding: 2.5, // glowing border thickness
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: 'purple', // dark background for neon contrast
    borderRadius: 18,
    gap: 16,
  },
  glowingText: {
    fontSize: RFValue(17),
    fontFamily: 'Philosopher-Bold',
    color: '#ffffff',
    textShadowColor: '#00ffe7',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
    letterSpacing: 1.2,
  },
});
