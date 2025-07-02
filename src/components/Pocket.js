// import {Platform, StyleSheet, Text, View, Image} from 'react-native';
// import React, {useEffect} from 'react';
// import {Colors} from '../constrants/Colors';
// import Pile from './Pile';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   unfreezeDice,
//   updatePlayerPieceValue,
// } from '../redux/reducers/gameSlice';
// import {startingPoints} from '../helpers/PlotDate';
// import {handleAITurn} from '../redux/reducers/gameAction';

// const Pocket = React.memo(({color, player, data}) => {
//   const dispatch = useDispatch();
//   const winners = useSelector(state => state.game.winners);

//   const handlePress = async value => {
//     let playerNo = value?.id[0];
//     switch (playerNo) {
//       case 'A':
//         playerNo = 'player1';
//         break;
//       case 'B':
//         playerNo = 'player2';
//         break;
//       case 'C':
//         playerNo = 'player3';
//         break;
//       case 'D':
//         playerNo = 'player4';
//         break;
//     }

//     console.log('From POCKET');
//     console.log(
//       'playerNo value.id pos travelCount ',
//       playerNo,
//       value.id,
//       startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
//       1,
//     );

//     dispatch(
//       updatePlayerPieceValue({
//         playerNo: playerNo,
//         pieceId: value.id,
//         pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
//         travelCount: 1,
//       }),
//     );

//     dispatch(unfreezeDice());
//   };

//   console.log('Player:: ', player);

//   const chancePlayer = useSelector(state => state.game.chancePlayer);
//   const aiPlayers = useSelector(state => state.game.aiPlayers);
//   const diceNo = useSelector(state => state.game.diceNo);
//   const isDiceRolled = useSelector(state => state.game.isDiceRolled);

//   // Handle AI pocket selection automatically
//   useEffect(() => {
//     const isCurrentPlayerAI = aiPlayers.includes(chancePlayer);
//     const isCurrentPlayer = chancePlayer === player;

//     if (isCurrentPlayerAI && isCurrentPlayer && isDiceRolled && diceNo === 6) {
//       const piecesInHome = data.filter(p => p.pos === 0);

//       if (piecesInHome.length > 0) {
//         const delay = setTimeout(() => {
//           handlePress(piecesInHome[0]);
//           dispatch(handleAITurn()); // Continue AI turn after moving out
//         }, 1000);

//         return () => clearTimeout(delay);
//       }
//     }
//   }, [chancePlayer, aiPlayers, diceNo, isDiceRolled, player, data]);

//   return (
//     <View style={[styles.container, {backgroundColor: Colors.board}]}>
//       <View
//         style={[
//           styles.childFrame,
//           {
//             backgroundColor: color,
//             ...Platform.select({
//               ios: {
//                 shadowColor: 'black',
//                 shadowOffset: {width: 4, height: 4},
//                 shadowOpacity: 0.3,
//                 shadowRadius: 6,
//               },
//               android: {
//                 elevation: 20, // Keep this value between 5-20 for better realism
//               },
//             }),
//           },
//         ]}>
//         <View style={styles.flexRow}>
//           <Plot
//             pieceNo={0}
//             player={player}
//             color={color}
//             data={data}
//             onPress={handlePress}
//           />
//           <Plot
//             pieceNo={1}
//             player={player}
//             color={color}
//             data={data}
//             onPress={handlePress}
//           />
//         </View>

//         {winners.includes(player) && (
//           <Image
//             source={
//               winners.indexOf(player) === 0
//                 ? require('../assets/images/1st.png')
//                 : winners.indexOf(player) === 1
//                 ? require('../assets/images/2nd.png')
//                 : require('../assets/images/3rd.png')
//             }
//             style={{
//               height: '100%',
//               width: '100%',
//               position: 'absolute',
//               top: 10,
//               left: 15,
//             }}
//           />
//         )}

//         <View style={[styles.flexRow, {marginTop: 20}]}>
//           <Plot
//             pieceNo={2}
//             player={player}
//             color={color}
//             data={data}
//             onPress={handlePress}
//           />
//           <Plot
//             pieceNo={3}
//             player={player}
//             color={color}
//             data={data}
//             onPress={handlePress}
//           />
//         </View>
//       </View>
//     </View>
//   );
// });

// const Plot = ({pieceNo, player, color, data, onPress}) => {
//   return (
//     <View
//       style={[
//         styles.plot,
//         {
//           backgroundColor: 'white',
//         },
//       ]}>
//       {data && data[pieceNo]?.pos === 0 && (
//         <Pile
//           color={color}
//           player={player}
//           onPress={() => onPress(data[pieceNo])}
//         />
//       )}
//     </View>
//   );
// };

// export default Pocket;

// const styles = StyleSheet.create({
//   container: {
//     height: '100%',
//     width: '40%',

//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   childFrame: {
//     height: '70%',
//     width: '70%',
//     borderColor: Colors.bordercolor,
//     borderWidth: 0.4,
//     borderRadius: 10,
//     padding: 15,
//   },
//   flexRow: {
//     height: '40%',
//     with: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   plot: {
//     height: '80%',
//     width: '36%',
//     borderRadius: 120,
//   },
// });

import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {Colors} from '../constrants/Colors';
import Pile from './Pile';
import {useDispatch, useSelector} from 'react-redux';
import {
  unfreezeDice,
  updatePlayerPieceValue,
} from '../redux/reducers/gameSlice';
import {startingPoints} from '../helpers/PlotDate';
import {handleAITurn} from '../redux/reducers/gameAction';
import {
  selectAIPlayers,
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
  selectTotalPlayers,
  selectWinners,
} from '../redux/reducers/gameSelector';

const Pocket = React.memo(({color, player, data}) => {
  const dispatch = useDispatch();
  const winners = useSelector(selectWinners);
  const chancePlayer = useSelector(selectCurrentPlayerChance);
  const aiPlayers = useSelector(selectAIPlayers);
  const diceNo = useSelector(selectDiceNo);
  const isDiceRolled = useSelector(selectDiceRolled);
  const totalPlayers = useSelector(selectTotalPlayers);

  // If this player doesn't exist in the current game configuration
  if (player > totalPlayers) {
    return (
      <View style={[styles.container, {backgroundColor: Colors.board}]}>
        <View
          style={[
            styles.childFrame,
            {
              backgroundColor: color,
              ...Platform.select({
                ios: {
                  shadowColor: 'black',
                  shadowOffset: {width: 4, height: 4},
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                },
                android: {
                  elevation: 20,
                },
              }),
            },
          ]}>
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
  }

  const handlePress = async value => {
    let playerNo = `player${value?.id[0].charCodeAt(0) - 64}`;

    dispatch(
      updatePlayerPieceValue({
        playerNo,
        pieceId: value.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      }),
    );

    dispatch(unfreezeDice());
  };

  // Handle AI pocket selection automatically
  useEffect(() => {
    const isCurrentPlayerAI = aiPlayers.includes(chancePlayer);
    const isCurrentPlayer = chancePlayer === player;

    if (isCurrentPlayerAI && isCurrentPlayer && isDiceRolled && diceNo === 6) {
      const piecesInHome = data.filter(p => p.pos === 0);

      if (piecesInHome.length > 0) {
        const delay = setTimeout(() => {
          handlePress(piecesInHome[0]);
          dispatch(handleAITurn()); // Continue AI turn after moving out
        }, 1000);

        return () => clearTimeout(delay);
      }
    }
  }, [chancePlayer, aiPlayers, diceNo, isDiceRolled, player, data]);

  return (
    <View style={[styles.container, {backgroundColor: Colors.board}]}>
      <View
        style={[
          styles.childFrame,
          {
            backgroundColor: color,
            ...Platform.select({
              ios: {
                shadowColor: 'black',
                shadowOffset: {width: 4, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 6,
              },
              android: {
                elevation: 20,
              },
            }),
          },
        ]}>
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

        {winners.includes(player) && (
          <Image
            source={
              winners.indexOf(player) === 0
                ? require('../assets/images/1st.png')
                : winners.indexOf(player) === 1
                ? require('../assets/images/2nd.png')
                : require('../assets/images/3rd.png')
            }
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 10,
              left: 15,
            }}
          />
        )}

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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
