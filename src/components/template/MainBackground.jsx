import {
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
  Easing,
} from 'react-native-reanimated';

const MainBackground = () => {
  const easing = Easing.bezier(0.25, 0.1, 0.25, 1);

  // Shared values for top boy
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
    // Animate them in
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
  }, []);

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require('../../assets/images/orgbg.png')}
        style={{flex: 1, position: 'relative'}}
      />
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
    </SafeAreaView>
  );
};

export default MainBackground;

// import {
//   Image,
//   ImageBackground,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   View,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
//   Easing,
// } from 'react-native-reanimated';

// const MainBackground = () => {
//   // Shared values
//   const topBoyX = useSharedValue(-300);
//   const topBoyOpacity = useSharedValue(0);
//   const topBoyScale = useSharedValue(0.9);

//   const topGirlX = useSharedValue(300);
//   const topGirlOpacity = useSharedValue(0);
//   const topGirlScale = useSharedValue(0.9);

//   const bottomGirlY = useSharedValue(300);
//   const bottomGirlOpacity = useSharedValue(0);
//   const bottomGirlScale = useSharedValue(0.9);

//   const bottomBoyY = useSharedValue(300);
//   const bottomBoyOpacity = useSharedValue(0);
//   const bottomBoyScale = useSharedValue(0.9);

//   const easing = Easing.bezier(0.25, 0.1, 0.25, 1); // Smooth and cinematic

//   useEffect(() => {
//     topBoyX.value = withDelay(200, withTiming(0, {duration: 900, easing}));
//     topBoyOpacity.value = withDelay(200, withTiming(1, {duration: 700}));
//     topBoyScale.value = withDelay(200, withTiming(1, {duration: 700}));

//     topGirlX.value = withDelay(600, withTiming(0, {duration: 900, easing}));
//     topGirlOpacity.value = withDelay(600, withTiming(1, {duration: 700}));
//     topGirlScale.value = withDelay(600, withTiming(1, {duration: 700}));

//     bottomGirlY.value = withDelay(1000, withTiming(0, {duration: 900, easing}));
//     bottomGirlOpacity.value = withDelay(1000, withTiming(1, {duration: 700}));
//     bottomGirlScale.value = withDelay(1000, withTiming(1, {duration: 700}));

//     bottomBoyY.value = withDelay(1400, withTiming(0, {duration: 900, easing}));
//     bottomBoyOpacity.value = withDelay(1400, withTiming(1, {duration: 700}));
//     bottomBoyScale.value = withDelay(1400, withTiming(1, {duration: 700}));
//   }, []);

//   const topBoyStyle = useAnimatedStyle(() => ({
//     transform: [{translateX: topBoyX.value}, {scale: topBoyScale.value}],
//     opacity: topBoyOpacity.value,
//   }));

//   const topGirlStyle = useAnimatedStyle(() => ({
//     transform: [{translateX: topGirlX.value}, {scale: topGirlScale.value}],
//     opacity: topGirlOpacity.value,
//   }));

//   const bottomGirlStyle = useAnimatedStyle(() => ({
//     transform: [
//       {translateY: bottomGirlY.value},
//       {scale: bottomGirlScale.value},
//     ],
//     opacity: bottomGirlOpacity.value,
//   }));

//   const bottomBoyStyle = useAnimatedStyle(() => ({
//     transform: [{translateY: bottomBoyY.value}, {scale: bottomBoyScale.value}],
//     opacity: bottomBoyOpacity.value,
//   }));

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="light-content"
//       />
//       <ImageBackground
//         source={require('../../assets/images/orgbg.png')}
//         style={{flex: 1, position: 'relative'}}
//       />
//       <View style={StyleSheet.absoluteFill}>
//         {/* TOP BOY */}
//         <Animated.Image
//           source={require('../../assets/images/TM.png')}
//           resizeMode="cover"
//           style={[
//             {
//               height: '60%',
//               width: '40%',
//               position: 'absolute',
//               top: 20,
//               left: 0,
//             },
//             topBoyStyle,
//           ]}
//         />

//         {/* TOP GIRL */}
//         <Animated.Image
//           source={require('../../assets/images/TF.png')}
//           resizeMode="cover"
//           style={[
//             {
//               height: '60%',
//               width: '70%',
//               position: 'absolute',
//               top: 10,
//               right: -30,
//             },
//             topGirlStyle,
//           ]}
//         />

//         {/* BOTTOM GIRL */}
//         <Animated.Image
//           source={require('../../assets/images/BG.png')}
//           resizeMode="cover"
//           style={[
//             {
//               height: '60%',
//               width: '60%',
//               position: 'absolute',
//               bottom: -20,
//               left: -30,
//             },
//             bottomGirlStyle,
//           ]}
//         />

//         {/* BOTTOM BOY */}
//         <Animated.Image
//           source={require('../../assets/images/BB.png')}
//           resizeMode="cover"
//           style={[
//             {
//               height: '60%',
//               width: '70%',
//               position: 'absolute',
//               bottom: 10,
//               right: -50,
//             },
//             bottomBoyStyle,
//           ]}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default MainBackground;

// // import {
// //   Image,
// //   ImageBackground,
// //   SafeAreaView,
// //   StatusBar,
// //   StyleSheet,
// //   View,
// // } from 'react-native';
// // import React from 'react';

// // const MainBackground = () => {
// //   return (
// //     <SafeAreaView style={{flex: 1}}>
// //       <StatusBar
// //         translucent={true}
// //         backgroundColor="transparent"
// //         barStyle="light-content"
// //       />
// //       <ImageBackground
// //         source={require('../../assets/images/orgbg.png')}
// //         style={{flex: 1, position: 'relative'}}
// //       />
// //       <View
// //         style={{
// //           width: '100%',
// //           height: '100%',

// //           position: 'absolute',
// //         }}>
// //         {/** TOP BOY */}
// //         <Image
// //           source={require('../../assets/images/TM.png')}
// //           resizeMode="cover"
// //           style={{
// //             height: '60%',
// //             width: '40%',
// //             position: 'absolute',
// //             top: 20,
// //             left: 0,
// //           }}
// //         />
// //         {/** TOP GIRL */}
// //         <Image
// //           source={require('../../assets/images/TF.png')}
// //           resizeMode="cover"
// //           style={{
// //             height: '60%',
// //             width: '70%',
// //             position: 'absolute',
// //             top: 10,
// //             right: -30,
// //           }}
// //         />

// //         {/** Bottom GIRL */}
// //         <Image
// //           source={require('../../assets/images/BG.png')}
// //           resizeMode="cover"
// //           style={{
// //             height: '60%',
// //             width: '60%',
// //             position: 'absolute',
// //             bottom: -20,
// //             left: -30,
// //           }}
// //         />
// //         {/** BOTTOM BOY */}
// //         <Image
// //           source={require('../../assets/images/BB.png')}
// //           resizeMode="cover"
// //           style={{
// //             height: '60%',
// //             width: '70%',
// //             position: 'absolute',
// //             bottom: 10,
// //             right: -50,
// //           }}
// //         />
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // export default MainBackground;

// // const styles = StyleSheet.create({});
