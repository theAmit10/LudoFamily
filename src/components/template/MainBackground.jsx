import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
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
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MainBackground = ({children, setStartScreen}) => {
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
    setStartScreen(false);
    // scaleDown.value = withTiming(0.5, {duration: 600});
    // moveToBottom.value = withTiming(SCREEN_HEIGHT / 4, {duration: 600});
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
        '#FF6B6B', // Vibrant Red
        '#FFB347', // Warm Orange
        '#FFD700', // Bright Gold
        '#00FA9A', // Medium Spring Green
        '#1E90FF', // Dodger Blue
        '#9370DB', // Medium Purple
        '#FF69B4', // Hot Pink
        '#FF6B6B', // Back to Red
      ],
    );

    return {
      transform: [{translateY: textTranslateY.value}],
      opacity: textOpacity.value,
      color,
    };
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require('../../assets/images/orgbg.png')}
        style={{flex: 1, position: 'relative'}}>
        {/* Animated Characters */}
        <View style={StyleSheet.absoluteFill}>
          {/* TOP BOY */}
          <Animated.Image
            source={require('../../assets/images/TM.png')}
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

          {/* TOP GIRL */}
          <Animated.Image
            source={require('../../assets/images/TF.png')}
            resizeMode="cover"
            style={[
              {
                height: '60%',
                width: '70%',
                position: 'absolute',
                top: 10,
                right: -50,
              },
              topGirlStyle,
            ]}
          />

          {/* BOTTOM GIRL */}
          <Animated.Image
            source={require('../../assets/images/BG.png')}
            resizeMode="cover"
            style={[
              {
                height: '60%',
                width: '60%',
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
                height: '60%',
                width: '70%',
                position: 'absolute',
                bottom: 10,
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
            Start Playing
          </Animated.Text> */}
          <Animated.View
            style={[
              styles.buttonText,
              animatedTextStyle,
              {
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
              onPress={() => handleTextPress()}
              style={[styles.buttonText, animatedTextStyle]}>
              {`  Start Playing  `}
            </Animated.Text>
          </Animated.View>
          {children}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default MainBackground;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(40),
    textAlign: 'center',
    fontFamily: 'Philosopher-Bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: RFValue(50),
  },
});

// import {
//   ImageBackground,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   View,
//   TouchableWithoutFeedback,
//   Dimensions,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
//   withRepeat,
//   interpolateColor,
//   Easing,
// } from 'react-native-reanimated';
// import {RFValue} from 'react-native-responsive-fontsize';

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');

// const MainBackground = ({children}) => {
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

//   // Press animation
//   const scaleDown = useSharedValue(1);
//   const moveDownY = useSharedValue(0);

//   useEffect(() => {
//     // Character entrance animations
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

//     // Text animations
//     textOpacity.value = withDelay(2400, withTiming(1, {duration: 600, easing}));
//     textTranslateY.value = withDelay(
//       2400,
//       withTiming(0, {duration: 600, easing}),
//     );

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
//   const topBoyStyle = useAnimatedStyle(() => ({
//     transform: [
//       {translateX: topBoyX.value},
//       {translateY: topBoyBounceY.value + moveDownY.value},
//       {scale: scaleDown.value},
//     ],
//     opacity: topBoyOpacity.value,
//   }));

//   const topGirlStyle = useAnimatedStyle(() => ({
//     transform: [
//       {translateX: topGirlX.value},
//       {translateY: topGirlBounceY.value + moveDownY.value},
//       {scale: scaleDown.value},
//     ],
//     opacity: topGirlOpacity.value,
//   }));

//   const bottomGirlStyle = useAnimatedStyle(() => ({
//     transform: [
//       {
//         translateY:
//           bottomGirlY.value + bottomGirlBounceY.value + moveDownY.value,
//       },
//       {scale: scaleDown.value},
//     ],
//     opacity: bottomGirlOpacity.value,
//   }));

//   const bottomBoyStyle = useAnimatedStyle(() => ({
//     transform: [
//       {translateY: bottomBoyY.value + bottomBoyBounceY.value + moveDownY.value},
//       {scale: scaleDown.value},
//     ],
//     opacity: bottomBoyOpacity.value,
//   }));

//   const animatedTextStyle = useAnimatedStyle(() => {
//     const color = interpolateColor(
//       textColorProgress.value,
//       [0, 0.25, 0.5, 0.75, 1],
//       [
//         '#FF6B6B',
//         '#FFB347',
//         '#FFD700',
//         '#00FA9A',
//         '#1E90FF',
//         '#9370DB',
//         '#FF69B4',
//         '#FF6B6B',
//       ],
//     );

//     return {
//       transform: [{translateY: textTranslateY.value}],
//       opacity: textOpacity.value,
//       color,
//     };
//   });

//   const handleTextPress = () => {
//     scaleDown.value = withTiming(0.5, {duration: 600});
//     moveDownY.value = withTiming(SCREEN_HEIGHT / 5, {duration: 600});
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="light-content"
//       />
//       <ImageBackground
//         source={require('../../assets/images/orgbg.png')}
//         style={{flex: 1, position: 'relative'}}>
//         {/* Animated Characters */}
//         <View style={StyleSheet.absoluteFill}>
//           {/* TOP BOY */}
//           <Animated.Image
//             source={require('../../assets/images/TM.png')}
//             resizeMode="cover"
//             style={[
//               {
//                 height: '60%',
//                 width: '60%',
//                 position: 'absolute',
//                 top: 20,
//                 left: 0,
//               },
//               topBoyStyle,
//             ]}
//           />

//           {/* TOP GIRL */}
//           <Animated.Image
//             source={require('../../assets/images/TF.png')}
//             resizeMode="cover"
//             style={[
//               {
//                 height: '60%',
//                 width: '70%',
//                 position: 'absolute',
//                 top: 10,
//                 right: -50,
//               },
//               topGirlStyle,
//             ]}
//           />

//           {/* BOTTOM GIRL */}
//           <Animated.Image
//             source={require('../../assets/images/BG.png')}
//             resizeMode="cover"
//             style={[
//               {
//                 height: '60%',
//                 width: '60%',
//                 position: 'absolute',
//                 bottom: -20,
//                 left: -30,
//               },
//               bottomGirlStyle,
//             ]}
//           />

//           {/* BOTTOM BOY */}
//           <Animated.Image
//             source={require('../../assets/images/BB.png')}
//             resizeMode="cover"
//             style={[
//               {
//                 height: '60%',
//                 width: '70%',
//                 position: 'absolute',
//                 bottom: 10,
//                 right: -50,
//               },
//               bottomBoyStyle,
//             ]}
//           />
//         </View>

//         {/* Text */}
//         <View style={styles.centered}>
//           <TouchableWithoutFeedback onPress={handleTextPress}>
//             <Animated.Text style={[styles.buttonText, animatedTextStyle]}>
//               Start Playing
//             </Animated.Text>
//           </TouchableWithoutFeedback>
//           {children}
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };

// export default MainBackground;

// const styles = StyleSheet.create({
//   buttonText: {
//     fontSize: RFValue(40),
//     textAlign: 'center',
//     fontFamily: 'Philosopher-Bold',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginBottom: RFValue(50),
//   },
// });
