import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {Colors} from '../../constrants/Colors';
import Pile from '../Pile';
import {ArrowSpot, SafeSpots, StarSpots} from '../../helpers/PlotDate';
import {StarIcon, ArrowRightIcon} from 'react-native-heroicons/outline';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentPostions} from '../../redux/reducers/gameSelector';
import {handleForwardThunk} from '../../redux/reducers/gameAction';

const Cell = ({color, id}) => {
  // Example of how to display winners
  const winners = useSelector(state => state.game.winners);
  const chancePlayer = useSelector(state => state.game.chancePlayer);
  const aiPlayers = useSelector(state => state.game.aiPlayers);
  function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpot.includes(id), [id]);

  const dispatch = useDispatch();

  // TO GET ALL THE PIECES PLOT IN ANY POSITION
  const plottedPices = useSelector(selectCurrentPostions);

  const peicesAtPosition = useMemo(
    () => plottedPices.filter(item => item.pos == id),
    [plottedPices, id],
  );

  // const handlePress = useCallback(
  //   (playerNo, pieceId) => {
  //     // FORWORD MARCH TOKEN
  //     dispatch(handleForwardThunk(playerNo, pieceId, id));
  //   },
  //   [dispatch, id],
  // );

  const handlePress = useCallback(
    (playerNo, pieceId) => {
      // Only allow press if:
      // 1. It's the current player's turn AND
      // 2. The current player is not a robot
      if (chancePlayer === playerNo && !aiPlayers.includes(playerNo)) {
        dispatch(handleForwardThunk(playerNo, pieceId, id));
      }
    },
    [dispatch, id, chancePlayer, aiPlayers],
  );

  console.log(peicesAtPosition);
  console.log('Showing WinnersList :: ', winners);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isSafeSpot ? color : Colors.cellBackground},
      ]}>
      {isStarSpot && <StarIcon size={20} color="white" />}
      {isArrowSpot && (
        <ArrowRightIcon
          color={color}
          style={{
            transform: [
              {
                rotate:
                  id === 38
                    ? '180deg'
                    : id == 25
                    ? '90deg'
                    : id == 51
                    ? '-90deg'
                    : '0deg',
              },
            ],
          }}
          size={RFValue(12)}
        />
      )}

      {peicesAtPosition?.map((piece, index) => {
        const playerNo =
          piece.id[0] === 'A'
            ? 1
            : piece.id[0] === 'B'
            ? 2
            : piece.id[0] === 'C'
            ? 3
            : 4;

        const pieceColor =
          playerNo == 1
            ? Colors.red
            : playerNo == 2
            ? Colors.green
            : playerNo == 3
            ? Colors.yellow
            : Colors.blue;

        return (
          <View
            key={piece.id}
            style={[
              styles.pieceContainer,
              {
                transform: [
                  {
                    scale: peicesAtPosition.length === 1 ? 1 : 0.7,
                  },
                  {
                    translateX:
                      peicesAtPosition.length === 1
                        ? 0
                        : index % 2 === 0
                        ? -6
                        : 6,
                  },
                  {
                    translateY:
                      peicesAtPosition.length === 1 ? 0 : index < 2 ? -6 : 6,
                  },
                ],
              },
            ]}>
            <Pile
              cell={true}
              player={playerNo}
              onPress={() => handlePress(playerNo, piece.id)}
              pieceId={piece.id}
              color={pieceColor}
            />
          </View>
        );
      })}
      {/* <Pile
      cell={true}
      player={2}
      onPress={()=>{}}
      pieceId={2}
      color={Colors.green}
      /> */}
      {/* <Text>{id}</Text> */}
    </View>
  );
};

export default React.memo(Cell);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.board,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  pieceContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },
});
