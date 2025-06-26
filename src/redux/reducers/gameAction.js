import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../helpers/PlotDate';
import {playSound} from '../../helpers/SoundUtility';
import {selectCurrentPostions, selectDiceNo} from './gameSelector';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const handleForwardThunk =
  (playerNo, id, pos) => async (dispatch, getState) => {
    console.log('FROM GAME ACTION');
    console.log('playerNo, id, pos :: ', playerNo, id, pos);
    const state = getState();
    const plottedPieces = selectCurrentPostions(state);
    const diceNo = selectDiceNo(state);

    let alpha =
      playerNo == 1 ? 'A' : playerNo == 2 ? 'B' : playerNo == 3 ? 'C' : 'D';

    const peicesAtPosition = plottedPieces?.filter(item => item.pos === pos);
    const piece =
      peicesAtPosition[peicesAtPosition.findIndex(item => item.id[0] == alpha)];

    dispatch(disableTouch());

    let finalPath = piece.pos;
    const beforePlayerPiece = state.game[`player${playerNo}`].find(
      item => item.id == id,
    );

    let travelCount = beforePlayerPiece.travelCount;
    for (let i = 0; i < diceNo; i++) {
      const updatedPosition = getState();
      const playerPiece = updatedPosition?.game[`player${playerNo}`].find(
        item => item.id == id,
      );

      let path = playerPiece.pos + 1;
      if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
        path = victoryStart[playerNo - 1];
      }
      if (path == 53) {
        path = 1;
      }
      finalPath = path;
      travelCount += 1;

      console.log(
        'updatePlayerPieceValue :: ',
        playerNo,
        playerPiece.id,
        path,
        travelCount,
      );

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${playerNo}`,
          pieceId: playerPiece.id,
          pos: path,
          travelCount: travelCount,
        }),
      );

      playSound('pile_move');

      await delay(200);
    }

    const updateState = getState();
    const updatedPlottedPieces = selectCurrentPostions(updateState);

    // CHECKING COLLIDING

    console.log('CHECKING FOR COLLIDING');

    const finalPlot = updatedPlottedPieces?.filter(
      item => item.pos == finalPath,
    );

    const ids = finalPlot.map(item => item.id[0]);
    const uniqueIds = new Set(ids);
    const areDifferentIds = uniqueIds.size > 1;

    console.log('finalPlot :: ', finalPlot);
    console.log('ids :: ', ids);
    console.log('uniqueIds :: ', uniqueIds);
    console.log('areDifferentIds :: ', areDifferentIds);

    console.log(
      'SafeSpots.includes(finalPath[0].pos) :: ',
      SafeSpots.includes(finalPath[0]?.pos),
    );
    console.log(
      'StarSpots.includes(finalPath[0].pos) :: ',
      StarSpots.includes(finalPath[0]?.pos),
    );

    if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
      playSound('safe_spot');
    }

    if (
      areDifferentIds &&
      !SafeSpots.includes(finalPath[0]?.pos) &&
      !StarSpots.includes(finalPath[0]?.pos)
    ) {
      console.log('Time to collide');
      const enemyPiece = finalPlot.find(piece => piece.id[0] !== id[0]);
      const enemyId = enemyPiece.id[0];
      let no = enemyId == 'A' ? 1 : enemyId == 'B' ? 2 : enemyId == 'C' ? 3 : 4;

      let backwordPath = startingPoints[no - 1];
      let i = enemyPiece.pos;
      playSound('collide');

      console.log('enemyPiece :: ', enemyPiece);
      console.log('enemyId :: ', enemyId);
      console.log('no :: ', no);
      console.log('backwordPath :: ', backwordPath);
      console.log('i :: ', i);

      while (i !== backwordPath) {
        dispatch(
          updatePlayerPieceValue({
            playerNo: `player${no}`,
            pieceId: enemyPiece.id,
            pos: i,
            travelCount: 0,
          }),
        );

        await delay(0.4);
        i--;
        if (i == 0) {
          i = 52;
        }
      }

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${no}`,
          pieceId: enemyPiece.id,
          pos: 0,
          travelCount: 0,
        }),
      );

      dispatch(unfreezeDice());
      return;
    }

    if (diceNo == 6 || travelCount == 57) {
      dispatch(updatePlayerChance({chancePlayer: playerNo}));
      // if (travelCount == 57) {
      //   // CHCKING WINNER CRITERIA
      //   playSound('home_win');
      //   const finalPlayerState = getState();
      //   const playerAllPieces = finalPlayerState.game[`player${playerNo}`];
      //   if (checkWinningCriteria(playerAllPieces)) {
      //     dispatch(announceWinner(playerNo));
      //     playSound('cheer');
      //     return;
      //   }

      //   dispatch(updateFireworks(true));
      //   dispatch(unfreezeDice());
      //   return;
      // }
      // Modify the winning logic in handleForwardThunk
      if (travelCount == 57) {
        playSound('home_win');
        const finalPlayerState = getState();
        const playerAllPieces = finalPlayerState.game[`player${playerNo}`];

        if (checkWinningCriteria(playerAllPieces)) {
          dispatch(announceWinner(playerNo));
          playSound('cheer');

          // Check if game should continue or end
          const currentState = getState();
          if (currentState.game.winners.length === 3) {
            // All players have finished
            dispatch(updateFireworks(true));
            return;
          }

          // Continue game for remaining players
          let nextPlayer = playerNo + 1;
          if (nextPlayer > 4) nextPlayer = 1;

          // Find next active player (who hasn't finished yet)
          while (
            currentState.game.winners.includes(nextPlayer) &&
            nextPlayer !== playerNo
          ) {
            nextPlayer++;
            if (nextPlayer > 4) nextPlayer = 1;
          }

          dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
          return;
        }

        dispatch(updateFireworks(true));
        dispatch(unfreezeDice());
        return;
      }
    } else {
      let chancePlayer = playerNo + 1;
      if (chancePlayer > 4) {
        chancePlayer = 1;
      }
      dispatch(updatePlayerChance({chancePlayer}));
    }
  };

// function checkWinningCriteria(pieces) {
//   for (let piece of pieces) {
//     if (piece.travelCount < 57) {
//       return false;
//     }
//   }
//   return true;
// }

function checkWinningCriteria(pieces) {
  return pieces.every(piece => piece.travelCount >= 57);
}
