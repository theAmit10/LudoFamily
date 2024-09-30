import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Colors} from '../constrants/Colors';
import LottieView from 'lottie-react-native';
import Fireworks from '../assets/animation/firework.json';
import {Polygon, Svg} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {selectFireworks} from '../redux/reducers/gameSelector';
import {updateFireworks} from '../redux/reducers/gameSlice';
import Pile from './Pile';
import { deviceHeight, deviceWidth } from '../constrants/Scaling';

const FourTriangles = ({player1, player2, player3, player4}) => {
  const [blast, setBlast] = useState(false);

  const size = 300;

  const isFireworks = useSelector(selectFireworks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFireworks) {
      setBlast(true);
      const timer = setTimeout(() => {
        setBlast(false);
        dispatch(updateFireworks(false));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFireworks, dispatch]);

  const playerData = useMemo(
    () => [
      {
        player: player1,
        top: 55,
        left: 15,
        pieceColor: Colors.red,
        translate: 'translateX',
      },
      {
        player: player3,
        top: 52,
        left: 15,
        pieceColor: Colors.yellow,
        translate: 'translateX',
      },
      {
        player: player2,
        top: 20,
        left: -2,
        pieceColor: Colors.green,
        translate: 'translateY',
      },
      {
        player: player4,
        top: 55,
        right: -2,
        pieceColor: Colors.blue,
        translate: 'translateX',
      },
    ],
    [player1, player2, player3, player4],
  );


  const renderPlayerPieces = useCallback((data,index) => (
    <PlayerPieces
    key={index}
    player={data?.player.filter(item => item.travelCount === 57)} 
    style={{
      top: data?.top,
      bottom: data?.bottom,
      left: data?.left,
      right: data?.right,
    }}
    pieceColor={data.pieceColor}
    translate={data.translate}
    ></PlayerPieces>
  ))

  return (
    <View style={styles.container}>
      {blast && (
        <LottieView
          source={Fireworks}
          autoPlay
          loop
          hardwareAccelerationAndroid
          speed={1}
          style={styles.lottieView}
        />
      )}

      <Svg height={size} width={size - 5}>
        <Polygon
          points={`0,0 ${size / 2}, ${size / 2}, ${size},0`}
          fill={Colors.yellow}
        />

        <Polygon
          points={`${size},0 ${size}, ${size}, ${size / 2},${size / 2}`}
          fill={Colors.blue}
        />

        <Polygon
          points={`0, ${size} ${size / 2}, ${size / 2}, ${size},${size}`}
          fill={Colors.red}
        />
        <Polygon
          points={`0,0  ${size / 2}, ${size / 2} 0,${size}`}
          fill={Colors.green}
        />
      </Svg>

      {
        playerData.map(renderPlayerPieces)
      }
    </View>
  );
};

export default FourTriangles;


const PlayerPieces = React.memo(({player,style,pieceColor,translate}) => {
  return(
    <View style={[styles.winnerContainer, style]}>

      {
        player.map((piece,index) => (
          <View
          key={piece.id}
          style={{
            top: 0,
            zIndex: 99,
            position: 'absolute',
            bottom: 0,
            transform: [{scale: 0.5},{[translate]: 14 * index}]
          }}
          >
            <Pile
            cell={true}
            player={player}
            onPress={()=>{}}
            pieceId={piece.id}
            color={pieceColor}
            />
            </View>
        ))
      }
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '20%',
    backgroundColor: 'white',
    borderWidth: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: Colors.bordercolor,
  },
  lottieView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  winnerContainer:{
    width: deviceWidth * 0.063,
    height: deviceHeight * 0.032,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  }
});
