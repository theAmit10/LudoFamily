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
  enablePileSelection,
  setRobotThinking,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const handleForwardThunk =
  (playerNo, id, pos) => async (dispatch, getState) => {
    try {
      // const state = getState();
      // const plottedPieces = selectCurrentPostions(state);
      // const diceNo = selectDiceNo(state);

      const state = getState();
      const {diceNo, aiPlayers} = state.game;
      const plottedPieces = selectCurrentPostions(state);
      const isAIPlayer = aiPlayers.includes(playerNo);

      // Find the current piece safely
      const piece = plottedPieces?.find(item => item.id === id);
      if (!piece) {
        console.error(`Piece not found with id: ${id}`);
        dispatch(unfreezeDice());
        return;
      }

      dispatch(disableTouch());

      let finalPath = piece.pos;
      const beforePlayerPiece = state.game[`player${playerNo}`].find(
        item => item.id === id,
      );

      if (!beforePlayerPiece) {
        console.error(`Player piece not found in state with id: ${id}`);
        dispatch(unfreezeDice());
        return;
      }

      let travelCount = beforePlayerPiece.travelCount;
      for (let i = 0; i < diceNo; i++) {
        const updatedPosition = getState();
        const playerPiece = updatedPosition?.game[`player${playerNo}`].find(
          item => item.id === id,
        );

        if (!playerPiece) {
          console.error(
            `Player piece not found during movement with id: ${id}`,
          );
          dispatch(unfreezeDice());
          return;
        }

        let path = playerPiece.pos + 1;
        if (
          turningPoints.includes(path) &&
          turningPoints[playerNo - 1] === path
        ) {
          path = victoryStart[playerNo - 1];
        }
        if (path === 53) {
          path = 1;
        }
        finalPath = path;
        travelCount += 1;

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

      // Check for collisions
      const finalPlot = updatedPlottedPieces?.filter(
        item => item.pos === finalPath,
      );

      const ids = finalPlot.map(item => item.id[0]);
      const uniqueIds = new Set(ids);
      const areDifferentIds = uniqueIds.size > 1;

      if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
        playSound('safe_spot');
      }

      if (
        areDifferentIds &&
        !SafeSpots.includes(finalPath) &&
        !StarSpots.includes(finalPath)
      ) {
        const enemyPiece = finalPlot.find(piece => piece.id[0] !== id[0]);
        if (enemyPiece) {
          const enemyId = enemyPiece.id[0];
          let no =
            enemyId === 'A' ? 1 : enemyId === 'B' ? 2 : enemyId === 'C' ? 3 : 4;

          let backwordPath = startingPoints[no - 1];
          let i = enemyPiece.pos;
          playSound('collide');

          while (i !== backwordPath) {
            dispatch(
              updatePlayerPieceValue({
                playerNo: `player${no}`,
                pieceId: enemyPiece.id,
                pos: i,
                travelCount: 0,
              }),
            );

            await delay(40);
            i--;
            if (i === 0) {
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
      }

      if (diceNo === 6 || travelCount === 57) {
        dispatch(updatePlayerChance({chancePlayer: playerNo}));

        if (isAIPlayer) {
          // If AI rolled six, automatically roll again after delay
          await delay(1200);
          dispatch(handleAITurn());
        }

        if (travelCount === 57) {
          playSound('home_win');
          const finalPlayerState = getState();
          const playerAllPieces = finalPlayerState.game[`player${playerNo}`];

          if (checkWinningCriteria(playerAllPieces)) {
            dispatch(announceWinner(playerNo));
            playSound('cheer');

            const currentState = getState();
            if (currentState.game.winners.length === 3) {
              dispatch(updateFireworks(true));
              return;
            }

            let nextPlayer = playerNo + 1;
            if (nextPlayer > 4) nextPlayer = 1;

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
        // let chancePlayer = playerNo + 1;
        // if (chancePlayer > 4) {
        //   chancePlayer = 1;
        // }
        // dispatch(updatePlayerChance({chancePlayer}));

        // Normal turn passing
        let nextPlayer = playerNo + 1;
        if (nextPlayer > 4) nextPlayer = 1;
        dispatch(updatePlayerChance({chancePlayer: nextPlayer}));

        // If next player is AI, trigger their turn
        if (aiPlayers.includes(nextPlayer)) {
          await delay(800);
          dispatch(handleAITurn());
        }
      }

      // Trigger AI turn if next player is AI
      // const nextState = getState();
      // if (nextState.game.aiPlayers.includes(nextState.game.chancePlayer)) {
      //   dispatch(handleAITurn());
      // }
    } catch (error) {
      console.error('Error in handleForwardThunk:', error);
      dispatch(unfreezeDice());
    }
  };

// Enhanced AI Logic

const AIRobot = {
  // Selects which piece to move based on game state
  selectPiece: (playerNo, playerPieces, diceNo, currentPositions) => {
    const playerPrefix = String.fromCharCode(64 + playerNo); // 'A', 'B', 'C', or 'D'

    // 1. Check if we have pieces at home and dice is 6
    const piecesAtHome = playerPieces.filter(p => p.pos === 0);
    const hasSix = diceNo === 6;

    if (hasSix && piecesAtHome.length > 0) {
      // Always bring out a new piece if possible when we have 6
      const randomIndex = Math.floor(Math.random() * piecesAtHome.length);
      return piecesAtHome[randomIndex].id;
    }

    // 2. Get movable pieces on board
    const movablePieces = playerPieces.filter(
      p => p.pos > 0 && p.travelCount + diceNo <= 57,
    );

    if (movablePieces.length === 0) {
      return null; // No valid moves
    }

    // 3. Try to capture opponent's piece
    const captureMoves = movablePieces.filter(p => {
      const newPos = p.pos + diceNo;
      const piecesAtNewPos = currentPositions.filter(
        item => item.pos === newPos,
      );
      return piecesAtNewPos.some(piece => piece.id[0] !== playerPrefix);
    });

    if (captureMoves.length > 0) {
      // Prefer capturing moves that land on safe spots
      const safeCaptures = captureMoves.filter(
        p =>
          SafeSpots.includes(p.pos + diceNo) ||
          StarSpots.includes(p.pos + diceNo),
      );
      if (safeCaptures.length > 0) {
        return safeCaptures[0].id; // Take first safe capture
      }
      return captureMoves[0].id; // Take first available capture
    }

    // 4. Prefer safe spots and star spots
    const safeMoves = movablePieces.filter(
      p =>
        SafeSpots.includes(p.pos + diceNo) ||
        StarSpots.includes(p.pos + diceNo),
    );

    if (safeMoves.length > 0) {
      // Among safe moves, pick the one closest to home (more protected)
      safeMoves.sort((a, b) => a.travelCount - b.travelCount);
      return safeMoves[0].id;
    }

    // 5. Default: move the piece that's least advanced (most protected)
    movablePieces.sort((a, b) => a.travelCount - b.travelCount);
    return movablePieces[0].id;
  },
};

export const handleAITurn = () => async (dispatch, getState) => {
  const state = getState();
  const {chancePlayer, aiPlayers, diceNo, isDiceRolled} = state.game;

  // Prevent multiple executions
  if (!aiPlayers.includes(chancePlayer) || !isDiceRolled) return;

  dispatch(disableTouch()); // This sets touchDiceBlock to true
  dispatch(setRobotThinking(true));
  await delay(1000 + Math.random() * 2000);

  const playerPieces = state.game[`player${chancePlayer}`];
  const currentPositions = selectCurrentPostions(state);

  const selectedPieceId = AIRobot.selectPiece(
    chancePlayer,
    playerPieces,
    diceNo,
    currentPositions,
  );

  if (selectedPieceId) {
    const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
    const pos = selectedPiece ? selectedPiece.pos : 0;

    if (pos === 0) {
      // Pocket piece - handled by Pocket component
    } else {
      dispatch(enablePileSelection({playerNo: chancePlayer}));
      await delay(500);
      // Pass the exact diceNo to prevent multiple moves
      dispatch(handleForwardThunk(chancePlayer, selectedPieceId, pos, diceNo));
    }
  } else {
    // Pass turn normally
    let nextPlayer = chancePlayer + 1;
    if (nextPlayer > 4) nextPlayer = 1;
    dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
    dispatch(unfreezeDice());
  }

  dispatch(setRobotThinking(false));
};

// export const handleAITurn = () => async (dispatch, getState) => {
//   const state = getState();
//   const {chancePlayer, aiPlayers, diceNo} = state.game;

//   if (!aiPlayers.includes(chancePlayer)) return;

//   dispatch(setRobotThinking(true));
//   await delay(1000 + Math.random() * 2000); // 1-3 second delay

//   const playerPieces = state.game[`player${chancePlayer}`];
//   const currentPositions = selectCurrentPostions(state);

//   const selectedPieceId = AIRobot.selectPiece(
//     chancePlayer,
//     playerPieces,
//     diceNo,
//     currentPositions,
//   );

//   if (selectedPieceId) {
//     const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
//     const pos = selectedPiece ? selectedPiece.pos : 0;

//     if (pos === 0) {
//       // This is a pocket piece - handled by Pocket component's useEffect
//     } else {
//       // Normal board piece
//       dispatch(enablePileSelection({playerNo: chancePlayer}));
//       await delay(500);
//       dispatch(handleForwardThunk(chancePlayer, selectedPieceId, pos));
//     }
//   } else {
//     // No valid moves, pass turn
//     let nextPlayer = chancePlayer + 1;
//     if (nextPlayer > 4) nextPlayer = 1;
//     dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//   }

//   dispatch(setRobotThinking(false));
// };
function checkWinningCriteria(pieces) {
  return pieces.every(piece => piece.travelCount >= 57);
}

// import {
//   SafeSpots,
//   StarSpots,
//   startingPoints,
//   turningPoints,
//   victoryStart,
// } from '../../helpers/PlotDate';
// import {playSound} from '../../helpers/SoundUtility';
// import {selectCurrentPostions, selectDiceNo} from './gameSelector';
// import {
//   announceWinner,
//   disableTouch,
//   unfreezeDice,
//   updateFireworks,
//   updatePlayerChance,
//   updatePlayerPieceValue,
// } from './gameSlice';

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// export const handleForwardThunk =
//   (playerNo, id, pos) => async (dispatch, getState) => {
//     console.log('FROM GAME ACTION');
//     console.log('playerNo, id, pos :: ', playerNo, id, pos);
//     const state = getState();
//     const plottedPieces = selectCurrentPostions(state);
//     const diceNo = selectDiceNo(state);

//     let alpha =
//       playerNo == 1 ? 'A' : playerNo == 2 ? 'B' : playerNo == 3 ? 'C' : 'D';

//     const peicesAtPosition = plottedPieces?.filter(item => item.pos === pos);
//     const piece =
//       peicesAtPosition[peicesAtPosition.findIndex(item => item.id[0] == alpha)];

//     dispatch(disableTouch());

//     let finalPath = piece.pos;
//     const beforePlayerPiece = state.game[`player${playerNo}`].find(
//       item => item.id == id,
//     );

//     let travelCount = beforePlayerPiece.travelCount;
//     for (let i = 0; i < diceNo; i++) {
//       const updatedPosition = getState();
//       const playerPiece = updatedPosition?.game[`player${playerNo}`].find(
//         item => item.id == id,
//       );

//       let path = playerPiece.pos + 1;
//       if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
//         path = victoryStart[playerNo - 1];
//       }
//       if (path == 53) {
//         path = 1;
//       }
//       finalPath = path;
//       travelCount += 1;

//       console.log(
//         'updatePlayerPieceValue :: ',
//         playerNo,
//         playerPiece.id,
//         path,
//         travelCount,
//       );

//       dispatch(
//         updatePlayerPieceValue({
//           playerNo: `player${playerNo}`,
//           pieceId: playerPiece.id,
//           pos: path,
//           travelCount: travelCount,
//         }),
//       );

//       playSound('pile_move');

//       await delay(200);
//     }

//     const updateState = getState();
//     const updatedPlottedPieces = selectCurrentPostions(updateState);

//     // CHECKING COLLIDING

//     console.log('CHECKING FOR COLLIDING');

//     const finalPlot = updatedPlottedPieces?.filter(
//       item => item.pos == finalPath,
//     );

//     const ids = finalPlot.map(item => item.id[0]);
//     const uniqueIds = new Set(ids);
//     const areDifferentIds = uniqueIds.size > 1;

//     console.log('finalPlot :: ', finalPlot);
//     console.log('ids :: ', ids);
//     console.log('uniqueIds :: ', uniqueIds);
//     console.log('areDifferentIds :: ', areDifferentIds);

//     console.log(
//       'SafeSpots.includes(finalPath[0].pos) :: ',
//       SafeSpots.includes(finalPath[0]?.pos),
//     );
//     console.log(
//       'StarSpots.includes(finalPath[0].pos) :: ',
//       StarSpots.includes(finalPath[0]?.pos),
//     );

//     if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
//       playSound('safe_spot');
//     }

//     //  !SafeSpots.includes(finalPath[0]?.pos) &&
//     // !StarSpots.includes(finalPath[0]?.pos)
//     if (
//       areDifferentIds &&
//       !SafeSpots.includes(finalPath) &&
//       !StarSpots.includes(finalPath)
//     ) {
//       console.log('Time to collide');
//       const enemyPiece = finalPlot.find(piece => piece.id[0] !== id[0]);
//       const enemyId = enemyPiece.id[0];
//       let no = enemyId == 'A' ? 1 : enemyId == 'B' ? 2 : enemyId == 'C' ? 3 : 4;

//       let backwordPath = startingPoints[no - 1];
//       let i = enemyPiece.pos;
//       playSound('collide');

//       console.log('enemyPiece :: ', enemyPiece);
//       console.log('enemyId :: ', enemyId);
//       console.log('no :: ', no);
//       console.log('backwordPath :: ', backwordPath);
//       console.log('i :: ', i);

//       while (i !== backwordPath) {
//         dispatch(
//           updatePlayerPieceValue({
//             playerNo: `player${no}`,
//             pieceId: enemyPiece.id,
//             pos: i,
//             travelCount: 0,
//           }),
//         );

//         await delay(0.4);
//         i--;
//         if (i == 0) {
//           i = 52;
//         }
//       }

//       dispatch(
//         updatePlayerPieceValue({
//           playerNo: `player${no}`,
//           pieceId: enemyPiece.id,
//           pos: 0,
//           travelCount: 0,
//         }),
//       );

//       dispatch(unfreezeDice());
//       return;
//     }

//     if (diceNo == 6 || travelCount == 57) {
//       dispatch(updatePlayerChance({chancePlayer: playerNo}));
//       // if (travelCount == 57) {
//       //   // CHCKING WINNER CRITERIA
//       //   playSound('home_win');
//       //   const finalPlayerState = getState();
//       //   const playerAllPieces = finalPlayerState.game[`player${playerNo}`];
//       //   if (checkWinningCriteria(playerAllPieces)) {
//       //     dispatch(announceWinner(playerNo));
//       //     playSound('cheer');
//       //     return;
//       //   }

//       //   dispatch(updateFireworks(true));
//       //   dispatch(unfreezeDice());
//       //   return;
//       // }
//       // Modify the winning logic in handleForwardThunk
//       if (travelCount == 57) {
//         playSound('home_win');
//         const finalPlayerState = getState();
//         const playerAllPieces = finalPlayerState.game[`player${playerNo}`];

//         if (checkWinningCriteria(playerAllPieces)) {
//           dispatch(announceWinner(playerNo));
//           playSound('cheer');

//           // Check if game should continue or end
//           const currentState = getState();
//           if (currentState.game.winners.length === 3) {
//             // All players have finished
//             dispatch(updateFireworks(true));
//             return;
//           }

//           // Continue game for remaining players
//           let nextPlayer = playerNo + 1;
//           if (nextPlayer > 4) nextPlayer = 1;

//           // Find next active player (who hasn't finished yet)
//           while (
//             currentState.game.winners.includes(nextPlayer) &&
//             nextPlayer !== playerNo
//           ) {
//             nextPlayer++;
//             if (nextPlayer > 4) nextPlayer = 1;
//           }

//           dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//           return;
//         }

//         dispatch(updateFireworks(true));
//         dispatch(unfreezeDice());
//         return;
//       }
//     } else {
//       let chancePlayer = playerNo + 1;
//       if (chancePlayer > 4) {
//         chancePlayer = 1;
//       }
//       dispatch(updatePlayerChance({chancePlayer}));
//     }

//     dispatch(handleAITurn());
//   };

// // function checkWinningCriteria(pieces) {
// //   for (let piece of pieces) {
// //     if (piece.travelCount < 57) {
// //       return false;
// //     }
// //   }
// //   return true;
// // }

// function checkWinningCriteria(pieces) {
//   return pieces.every(piece => piece.travelCount >= 57);
// }

// // Basic AI strategies
// export const AIRobot = {
//   // Simple random AI
//   randomMove: (playerNo, pieces, diceNo, currentPositions) => {
//     const movablePieces = pieces.filter(
//       p =>
//         (p.pos === 0 && diceNo === 6) || // Can start a new piece
//         (p.pos > 0 && p.travelCount + diceNo <= 57), // Can move existing piece
//     );

//     if (movablePieces.length === 0) return null;

//     // Randomly select a movable piece
//     const randomIndex = Math.floor(Math.random() * movablePieces.length);
//     return movablePieces[randomIndex].id;
//   },

//   // Slightly smarter AI that prefers safe moves
//   // In aiLogic.js
//   safeMove: (playerNo, movablePieces, diceNo, currentPositions) => {
//     if (movablePieces.length === 0) return null;

//     // Prioritize pieces that can reach safe spots or star spots
//     const safeMoves = movablePieces.filter(p => {
//       const newPos = p.pos + diceNo;
//       return SafeSpots.includes(newPos) || StarSpots.includes(newPos);
//     });

//     // If safe moves available, pick randomly from them
//     if (safeMoves.length > 0) {
//       const randomIndex = Math.floor(Math.random() * safeMoves.length);
//       return safeMoves[randomIndex].id;
//     }

//     // Otherwise look for potential captures
//     const captureMoves = movablePieces.filter(p => {
//       const newPos = p.pos + diceNo;
//       const piecesAtNewPos = currentPositions.filter(
//         item => item.pos === newPos,
//       );
//       return piecesAtNewPos.some(
//         piece => piece.id[0] !== `player${playerNo}`[0],
//       );
//     });

//     if (captureMoves.length > 0) {
//       const randomIndex = Math.floor(Math.random() * captureMoves.length);
//       return captureMoves[randomIndex].id;
//     }

//     // Default to random move
//     const randomIndex = Math.floor(Math.random() * movablePieces.length);
//     return movablePieces[randomIndex].id;
//   },
// };

// export const handleAITurn = () => async (dispatch, getState) => {
//   const state = getState();
//   const {chancePlayer, aiPlayers, diceNo, isDiceRolled} = state.game;

//   // Check if current player is AI and it's their turn
//   if (!aiPlayers.includes(chancePlayer)) return;

//   // Add delay to make it feel more natural
//   await delay(1000 + Math.random() * 1000); // 1-2 second delay

//   const playerPieces = state.game[`player${chancePlayer}`];
//   const currentPositions = selectCurrentPostions(state);

//   // Check if we have a 6 and pieces at home
//   const piecesAtHome = playerPieces.filter(p => p.pos === 0);
//   const hasSix = diceNo === 6;
//   const canBringNewPiece = hasSix && piecesAtHome.length > 0;

//   // Check if we have movable pieces on board
//   const movablePieces = playerPieces.filter(
//     p => p.pos > 0 && p.travelCount + diceNo <= 57,
//   );

//   // Decision making:
//   // 1. If we have a 6 and pieces at home, 50% chance to bring new piece
//   // 2. Otherwise move existing piece if possible
//   // 3. If no valid moves, pass turn

//   if (canBringNewPiece && (movablePieces.length === 0 || Math.random() > 0.5)) {
//     // Bring out a new piece from home
//     const randomIndex = Math.floor(Math.random() * piecesAtHome.length);
//     const selectedPieceId = piecesAtHome[randomIndex].id;

//     dispatch(handleForwardThunk(chancePlayer, selectedPieceId, 0));
//     return;
//   }

//   if (movablePieces.length > 0) {
//     // Select piece to move using AI strategy
//     const selectedPieceId = AIRobot.safeMove(
//       chancePlayer,
//       movablePieces,
//       diceNo,
//       currentPositions,
//     );

//     if (selectedPieceId) {
//       const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
//       dispatch(
//         handleForwardThunk(chancePlayer, selectedPieceId, selectedPiece.pos),
//       );
//       return;
//     }
//   }

//   // No valid moves, pass turn
//   let nextPlayer = chancePlayer + 1;
//   if (nextPlayer > 4) nextPlayer = 1;
//   dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// };

// // export const handleAITurn = () => async (dispatch, getState) => {
// //   const state = getState();
// //   const {chancePlayer, aiPlayers, diceNo, isDiceRolled} = state.game;

// //   // Check if current player is AI and it's their turn
// //   if (!aiPlayers.includes(chancePlayer) || isDiceRolled) return;

// //   const playerPieces = state.game[`player${chancePlayer}`];
// //   const currentPositions = selectCurrentPostions(state);

// //   // First check if we need to select a piece from home (when dice is 6)
// //   if (state.game.pileSelectionPlayer === chancePlayer) {
// //     // Find pieces that are at home (pos 0)
// //     const piecesAtHome = playerPieces.filter(p => p.pos === 0);

// //     if (piecesAtHome.length > 0) {
// //       // Select a random piece from home to bring out
// //       const randomIndex = Math.floor(Math.random() * piecesAtHome.length);
// //       const selectedPieceId = piecesAtHome[randomIndex].id;

// //       // Simulate selecting this piece
// //       dispatch(handleForwardThunk(chancePlayer, selectedPieceId, 0));
// //       return;
// //     }
// //   }

// //   // Otherwise handle normal piece movement
// //   const movablePieces = playerPieces.filter(
// //     p => p.pos > 0 && p.travelCount + diceNo <= 57,
// //   );

// //   if (movablePieces.length === 0) {
// //     // No valid moves, pass turn
// //     let nextPlayer = chancePlayer + 1;
// //     if (nextPlayer > 4) nextPlayer = 1;
// //     dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //     return;
// //   }

// //   // Select AI strategy (can be made configurable)
// //   const selectedPieceId = AIRobot.safeMove(
// //     chancePlayer,
// //     playerPieces,
// //     diceNo,
// //     currentPositions,
// //   );

// //   if (selectedPieceId) {
// //     // Find the position of the selected piece
// //     const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
// //     const pos = selectedPiece ? selectedPiece.pos : 0;

// //     // Execute the move
// //     dispatch(handleForwardThunk(chancePlayer, selectedPieceId, pos));
// //   } else {
// //     // No valid moves, pass turn
// //     let nextPlayer = chancePlayer + 1;
// //     if (nextPlayer > 4) nextPlayer = 1;
// //     dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
// //   }
// // };
