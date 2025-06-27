import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    resetGame: () => initialState,
    updateDiceNo: (state, action) => {
      state.diceNo = action.payload.diceNo;
      state.isDiceRolled = true;
    },
    enablePileSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.pileSelectionPlayer = action.payload.playerNo;
    },
    enableCellSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = action.payload.playerNo;
    },
    disableTouch: state => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = -1;
      state.pileSelectionPlayer = -1;
    },
    unfreezeDice: state => {
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    updateFireworks: (state, action) => {
      state.fireworks = action.payload;
    },
    announceWinner: (state, action) => {
      state.winner = action.payload;
    },
    updatePlayerChance: (state, action) => {
      state.chancePlayer = action.payload.chancePlayer;
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    // Modify the announceWinner reducer
    announceWinner: (state, action) => {
      const playerNo = action.payload;

      // Check if player is already in winners array
      if (!state.winners.includes(playerNo)) {
        state.winners.push(playerNo);

        // Check if all players have finished (game completed)
        if (state.winners.length === 3) {
          state.gameCompleted = true;
        }
      }
    },
    updatePlayerPieceValue: (state, action) => {
      const {playerNo, pieceId, pos, travelCount} = action.payload;

      const playerPieces = state[playerNo];
      console.log(
        'playerNo, pieceId, pos, travelCount :: ',
        playerNo,
        pieceId,
        pos,
        travelCount,
      );
      console.log('playerPieces :: ', playerPieces);
      const piece = playerPieces.find(p => p.id === pieceId);
      state.pileSelectionPlayer = -1;

      console.log('piece :: ', piece);
      if (piece) {
        piece.pos = pos;
        piece.travelCount = travelCount;
        const currentPositionIndex = state.currentPositions.findIndex(
          p => p.id === pieceId,
        );

        console.log('POS :: ' + pos);
        console.log('piece.pos :: ' + piece.pos);

        if (pos == 0) {
          if (currentPositionIndex !== -1) {
            state.currentPositions.splice(currentPositionIndex, 1);
          }
        } else {
          if (currentPositionIndex !== -1) {
            state.currentPositions[currentPositionIndex] = {
              id: pieceId,
              pos,
            };
          } else {
            state.currentPositions.push({id: pieceId, pos});
          }
        }
      }
    },
    setAIPlayers: (state, action) => {
      state.aiPlayers = action.payload;
    },
    setRobotThinking: (state, action) => {
      state.isRobotThinking = action.payload;
    },
  },
});

export const {
  resetGame,
  updateDiceNo,
  enablePileSelection,
  enableCellSelection,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  announceWinner,
  updatePlayerChance,
  updatePlayerPieceValue,
  setRobotThinking,
} = gameSlice.actions;

export default gameSlice.reducer;
