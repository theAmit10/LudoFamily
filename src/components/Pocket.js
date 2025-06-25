import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constrants/Colors';
import Pile from './Pile';
import {useDispatch} from 'react-redux';
import {
  unfreezeDice,
  updatePlayerPieceValue,
} from '../redux/reducers/gameSlice';
import {startingPoints} from '../helpers/PlotDate';

const Pocket = React.memo(({color, player, data}) => {
  const dispatch = useDispatch();
  const handlePress = async value => {
    let playerNo = value?.id[0];
    switch (playerNo) {
      case 'A':
        playerNo = 'player1';
        break;
      case 'B':
        playerNo = 'player2';
        break;
      case 'C':
        playerNo = 'player3';
        break;
      case 'D':
        playerNo = 'player4';
        break;
    }

    console.log('From POCKET');
    console.log(
      'playerNo value.id pos travelCount ',
      playerNo,
      value.id,
      startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
      1,
    );

    dispatch(
      updatePlayerPieceValue({
        playerNo: playerNo,
        pieceId: value.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      }),
    );

    dispatch(unfreezeDice());
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.board}]}>
      <View style={[styles.childFrame, {backgroundColor: color}]}>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={0}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
          <Plot
            pieceNo={1}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
        </View>

        <View style={[styles.flexRow, {marginTop: 20}]}>
          <Plot
            pieceNo={2}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
          <Plot
            pieceNo={3}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
        </View>
      </View>
    </View>
  );
});

const Plot = ({pieceNo, player, color, data, onPress}) => {
  return (
    <View
      style={[
        styles.plot,
        {
          backgroundColor: 'white',
          elevation: 30,
          shadowColor: 'white',
          shadowRadius: 10,
          shadowOffset: {width: 1, height: 1},
          shadowOpacity: 0.5,
        },
      ]}>
      {data && data[pieceNo]?.pos === 0 && (
        <Pile
          color={color}
          player={player}
          onPress={() => onPress(data[pieceNo])}
        />
      )}
    </View>
  );
};

export default Pocket;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '40%',
    borderWidth: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childFrame: {
    height: '70%',
    width: '70%',

    borderColor: Colors.bordercolor,
    borderWidth: 0.4,
    borderRadius: 10,
    padding: 15,
  },
  flexRow: {
    height: '40%',
    with: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plot: {
    height: '80%',
    width: '36%',
    borderRadius: 120,
  },
});
