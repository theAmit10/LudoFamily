// const player1InitialState = [
//   {id: 'A1', pos: 0, travelCount: 0},
//   {id: 'A2', pos: 0, travelCount: 0},
//   {id: 'A3', pos: 0, travelCount: 0},
//   {id: 'A4', pos: 0, travelCount: 0},
// ];

import {Colors} from '../../constrants/Colors';

// const player2InitialState = [
//   {id: 'B1', pos: 0, travelCount: 0},
//   {id: 'B2', pos: 0, travelCount: 0},
//   {id: 'B3', pos: 0, travelCount: 0},
//   {id: 'B4', pos: 0, travelCount: 0},
// ];

// const player3InitialState = [
//   {id: 'C1', pos: 0, travelCount: 0},
//   {id: 'C2', pos: 0, travelCount: 0},
//   {id: 'C3', pos: 0, travelCount: 0},
//   {id: 'C4', pos: 0, travelCount: 0},
// ];

// const player4InitialState = [
//   {id: 'D1', pos: 0, travelCount: 0},
//   {id: 'D2', pos: 0, travelCount: 0},
//   {id: 'D3', pos: 0, travelCount: 0},
//   {id: 'D4', pos: 0, travelCount: 0},
// ];

// export const initialState = {
//   player1: player1InitialState,
//   player2: player2InitialState,
//   player3: player3InitialState,
//   player4: player4InitialState,
//   chancePlayer: 1,
//   diceNo: 1,
//   isDiceRolled: false,
//   pileSelectionPlayer: -1,
//   cellSelectionPlayer: -1,
//   touchDiceBlock: false,
//   currentPositions: [],
//   fireworks: false,
//   winners: [], // Changed from winner: null to an array
//   gameCompleted: false, // New flag to track if all players have finished
//   totalPlayers: 4,
//   aiPlayers: [2, 4], // Array of player numbers that are AI (e.g., [2,4] means players 2 and 4 are AI)
//   isRobotThinking: false, // To track if AI is currently making a decision
// };
const createPlayerPieces = (prefix, count) => {
  return Array.from({length: count}, (_, i) => ({
    id: `${prefix}${i + 1}`,
    pos: 0,
    travelCount: 0,
  }));
};

export const createInitialState = (totalPlayers = 4, aiPlayers = []) => {
  const players = {
    player1: createPlayerPieces('A', 4),
    player2: totalPlayers >= 2 ? createPlayerPieces('B', 4) : [],
    player3: totalPlayers >= 3 ? createPlayerPieces('C', 4) : [],
    player4: totalPlayers >= 4 ? createPlayerPieces('D', 4) : [],
  };

  return {
    ...players,
    playerColors: {
      player1: Colors.red,
      player2: Colors.green,
      player3: Colors.yellow,
      player4: Colors.blue,
    },
    chancePlayer: 1,
    diceNo: 1,
    isDiceRolled: false,
    pileSelectionPlayer: -1,
    cellSelectionPlayer: -1,
    touchDiceBlock: false,
    currentPositions: [],
    fireworks: false,
    winners: [],
    gameCompleted: false,
    totalPlayers,
    aiPlayers: aiPlayers.filter(p => p <= totalPlayers),
    isRobotThinking: false,
  };
};

// Default initialState with 4 players and no AI
export const initialState = createInitialState(4, []);
