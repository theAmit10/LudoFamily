// export const selectCurrentPostions = state => state.game.currentPositions;
// export const selectCurrentPlayerChance = state => state.game.chancePlayer;
// export const selectDiceRolled = state => state.game.isDiceRolled;
// export const selectDiceNo = state => state.game.diceNo;

// export const selectPlayer1 = state => state.game.player1;
// export const selectPlayer2 = state => state.game.player2;
// export const selectPlayer3 = state => state.game.player3;
// export const selectPlayer4 = state => state.game.player4;

// export const selectPocketPileSelection = state =>
//   state.game.pileSelectionPlayer;
// export const selectCellSelection = state => state.game.cellSelectionPlayer;
// export const selectDiceTouch = state => state.game.touchDiceBlock;
// export const selectFireworks = state => state.game.fireworks;
// export const selectWinners = state => state.game.winners;
// export const selectTotalPlayers = state => state.game.totalPlayers;
// export const selectAIPlayers = state => state.game.aiPlayers;

export const selectCurrentPostions = state => state.game.currentPositions;
export const selectCurrentPlayerChance = state => state.game.chancePlayer;
export const selectDiceRolled = state => state.game.isDiceRolled;
export const selectDiceNo = state => state.game.diceNo;

export const selectPlayer1 = state => state.game.player1;
export const selectPlayer2 = state => state.game.player2;
export const selectPlayer3 = state =>
  state.game.totalPlayers >= 3 ? state.game.player3 : [];
export const selectPlayer4 = state =>
  state.game.totalPlayers >= 4 ? state.game.player4 : [];

export const selectPocketPileSelection = state =>
  state.game.pileSelectionPlayer;
export const selectCellSelection = state => state.game.cellSelectionPlayer;
export const selectDiceTouch = state => state.game.touchDiceBlock;
export const selectFireworks = state => state.game.fireworks;
export const selectWinners = state => state.game.winners;
export const selectTotalPlayers = state => state.game.totalPlayers;
export const selectAIPlayers = state => state.game.aiPlayers;
export const selectGameCompleted = state => state.game.gameCompleted;
export const selectIsRobotThinking = state => state.game.isRobotThinking;
