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
      const {diceNo, aiPlayers, totalPlayers} = state.game;
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

      // if (diceNo === 6 || travelCount === 57) {
      //   dispatch(updatePlayerChance({chancePlayer: playerNo}));

      //   if (isAIPlayer) {
      //     // If AI rolled six, automatically roll again after delay
      //     await delay(1200);
      //     dispatch(handleAITurn());
      //   }

      //   if (travelCount === 57) {
      //     playSound('home_win');
      //     const finalPlayerState = getState();
      //     const playerAllPieces = finalPlayerState.game[`player${playerNo}`];

      //     if (checkWinningCriteria(playerAllPieces)) {
      //       dispatch(announceWinner(playerNo));
      //       playSound('cheer');

      //       const currentState = getState();
      //       if (currentState.game.winners.length === 3) {
      //         dispatch(updateFireworks(true));
      //         return;
      //       }

      //       let nextPlayer = playerNo + 1;
      //       if (nextPlayer > 4) nextPlayer = 1;

      //       while (
      //         currentState.game.winners.includes(nextPlayer) &&
      //         nextPlayer !== playerNo
      //       ) {
      //         nextPlayer++;
      //         if (nextPlayer > 4) nextPlayer = 1;
      //       }

      //       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
      //       return;
      //     }

      //     dispatch(updateFireworks(true));
      //     dispatch(unfreezeDice());
      //     return;
      //   }
      // } else {
      //   // let chancePlayer = playerNo + 1;
      //   // if (chancePlayer > 4) {
      //   //   chancePlayer = 1;
      //   // }
      //   // dispatch(updatePlayerChance({chancePlayer}));

      //   // Normal turn passing
      //   let nextPlayer = playerNo + 1;
      //   if (nextPlayer > 4) nextPlayer = 1;
      //   dispatch(updatePlayerChance({chancePlayer: nextPlayer}));

      //   // If next player is AI, trigger their turn
      //   if (aiPlayers.includes(nextPlayer)) {
      //     await delay(800);
      //     dispatch(handleAITurn());
      //   }
      // }

      if (diceNo === 6 || travelCount === 57) {
        dispatch(updatePlayerChance({chancePlayer: playerNo}));

        if (isAIPlayer) {
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
            if (currentState.game.winners.length === totalPlayers - 1) {
              dispatch(updateFireworks(true));
              return;
            }

            // Get next active player, skipping winners
            let nextPlayer = getNextActivePlayer(
              playerNo,
              currentState.game.winners,
              totalPlayers,
            );
            dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
            return;
          }

          dispatch(updateFireworks(true));
          dispatch(unfreezeDice());
          return;
        }
      } else {
        // Get next active player, skipping winners
        const currentState = getState();
        let nextPlayer = getNextActivePlayer(
          playerNo,
          currentState.game.winners,
          totalPlayers,
        );
        dispatch(updatePlayerChance({chancePlayer: nextPlayer}));

        if (aiPlayers.includes(nextPlayer)) {
          await delay(800);
          dispatch(handleAITurn());
        }
      }
    } catch (error) {
      console.error('Error in handleForwardThunk:', error);
      dispatch(unfreezeDice());
    }
  };

// Helper function to get next active player
// Helper function to get next active player
function getNextActivePlayer(currentPlayer, winners, totalPlayers) {
  let nextPlayer = currentPlayer;
  let attempts = 0;

  do {
    nextPlayer = (nextPlayer % totalPlayers) + 1; // Only cycle through active players
    attempts++;

    if (attempts > totalPlayers) {
      return currentPlayer; // fallback to prevent infinite loop
    }
  } while (winners.includes(nextPlayer));

  return nextPlayer;
}
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

// export const handleAITurn = () => async (dispatch, getState) => {
//   const state = getState();
//   const {chancePlayer, aiPlayers, diceNo, isDiceRolled, isRobotThinking} =
//     state.game;

//   // Prevent multiple executions
//   if (!aiPlayers.includes(chancePlayer) || !isDiceRolled || isRobotThinking)
//     return;

//   dispatch(setRobotThinking(true));
//   dispatch(disableTouch()); // This sets touchDiceBlock to true

//   await delay(1000 + Math.random() * 2000);

//   try {
//     const playerPieces = state.game[`player${chancePlayer}`];
//     const currentPositions = selectCurrentPostions(state);

//     const selectedPieceId = AIRobot.selectPiece(
//       chancePlayer,
//       playerPieces,
//       diceNo,
//       currentPositions,
//     );

//     if (selectedPieceId) {
//       const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
//       const pos = selectedPiece ? selectedPiece.pos : 0;

//       if (pos === 0) {
//         // Pocket piece - handled by Pocket component
//         // dispatch(enablePileSelection({playerNo: chancePlayer}));
//         await delay(500);
//         // Find a piece at home to move out
//         const pieceAtHome = playerPieces.find(p => p.pos === 0);
//         if (pieceAtHome) {
//           dispatch(
//             handleForwardThunk(chancePlayer, pieceAtHome.id, pos, diceNo),
//           );
//         }
//       } else {
//         // dispatch(enableCellSelection({playerNo: chancePlayer}));
//         await delay(500);
//         dispatch(
//           handleForwardThunk(chancePlayer, selectedPieceId, pos, diceNo),
//         );
//       }
//     } else {
//       // Pass turn normally
//       let nextPlayer = chancePlayer + 1;
//       if (nextPlayer > 4) nextPlayer = 1;
//       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//       dispatch(unfreezeDice());
//     }
//   } catch (error) {
//     console.error('Error in AI turn:', error);
//     dispatch(unfreezeDice());
//   } finally {
//     dispatch(setRobotThinking(false));
//   }
// };
function checkWinningCriteria(pieces) {
  return pieces.every(piece => piece.travelCount >= 57);
}

// // Not the working one
// export const handleAITurn = () => async (dispatch, getState) => {
//   const state = getState();
//   const {
//     chancePlayer,
//     aiPlayers,
//     diceNo,
//     isDiceRolled,
//     isRobotThinking,
//     totalPlayers,
//   } = state.game;

//   // Prevent multiple executions
//   if (!aiPlayers.includes(chancePlayer) || !isDiceRolled || isRobotThinking)
//     return;

//   dispatch(setRobotThinking(true));
//   dispatch(disableTouch());

//   await delay(1000 + Math.random() * 2000);

//   try {
//     const playerPieces = state.game[`player${chancePlayer}`];
//     const currentPositions = selectCurrentPostions(state);

//     const selectedPieceId = AIRobot.selectPiece(
//       chancePlayer,
//       playerPieces,
//       diceNo,
//       currentPositions,
//     );

//     if (selectedPieceId) {
//       const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
//       const pos = selectedPiece ? selectedPiece.pos : 0;

//       if (pos === 0) {
//         await delay(500);
//         const pieceAtHome = playerPieces.find(p => p.pos === 0);
//         if (pieceAtHome) {
//           dispatch(
//             handleForwardThunk(chancePlayer, pieceAtHome.id, pos, diceNo),
//           );
//         }
//       } else {
//         await delay(500);
//         dispatch(
//           handleForwardThunk(chancePlayer, selectedPieceId, pos, diceNo),
//         );
//       }
//     } else {
//       // Pass turn normally
//       let nextPlayer = chancePlayer + 1;
//       if (nextPlayer > totalPlayers) nextPlayer = 1; // Changed from 4 to totalPlayers
//       dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
//       dispatch(unfreezeDice());
//     }
//   } catch (error) {
//     console.error('Error in AI turn:', error);
//     dispatch(unfreezeDice());
//   } finally {
//     dispatch(setRobotThinking(false));
//   }
// };

export const handleAITurn = () => async (dispatch, getState) => {
  const state = getState();
  const {
    chancePlayer,
    aiPlayers,
    diceNo,
    isDiceRolled,
    isRobotThinking,
    totalPlayers,
  } = state.game;

  // First check if this player is active
  if (chancePlayer > totalPlayers) {
    console.error(`AI Player ${chancePlayer} is not active`);
    dispatch(unfreezeDice());
    dispatch(setRobotThinking(false));
    return;
  }

  if (!aiPlayers.includes(chancePlayer) || !isDiceRolled || isRobotThinking)
    return;

  dispatch(setRobotThinking(true));
  dispatch(disableTouch());

  await delay(1000 + Math.random() * 2000);

  try {
    const playerPieces = state.game[`player${chancePlayer}`];
    const currentPositions = selectCurrentPostions(state);
    const winners = state.game.winners;

    const selectedPieceId = AIRobot.selectPiece(
      chancePlayer,
      playerPieces,
      diceNo,
      currentPositions,
    );

    if (selectedPieceId) {
      // ... existing piece movement logic
      const selectedPiece = playerPieces.find(p => p.id === selectedPieceId);
      const pos = selectedPiece ? selectedPiece.pos : 0;

      if (pos === 0) {
        await delay(500);
        const pieceAtHome = playerPieces.find(p => p.pos === 0);
        if (pieceAtHome) {
          dispatch(
            handleForwardThunk(chancePlayer, pieceAtHome.id, pos, diceNo),
          );
        }
      } else {
        await delay(500);
        dispatch(
          handleForwardThunk(chancePlayer, selectedPieceId, pos, diceNo),
        );
      }
    } else {
      // Pass turn to next active player
      let nextPlayer = getNextActivePlayer(chancePlayer, winners, totalPlayers);
      dispatch(updatePlayerChance({chancePlayer: nextPlayer}));
      dispatch(unfreezeDice());
    }
  } catch (error) {
    console.error('Error in AI turn:', error);
    dispatch(unfreezeDice());
  } finally {
    dispatch(setRobotThinking(false));
  }
};
