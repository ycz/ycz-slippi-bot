import client from "./twitchBot.js";

const CHANNEL = "#ycz6";
const SAMUS_ID = 16;
const CHARGE_SHOT_ID = 18;
const DAMAGE_THRESHOLD = 20;

const isChargedShot = (move, settings) => {
  const player = settings.players.find(
    (player) => player.playerIndex === move.playerIndex
  );
  return (
    move.moveId === CHARGE_SHOT_ID &&
    move.damage > DAMAGE_THRESHOLD &&
    player.characterId === SAMUS_ID
  );
};

const reactToConversion = (conversion) => {
  const { combo, settings } = conversion;
  if (combo.moves.some((move) => isChargedShot(move, settings))) {
    console.log("saying that the shot was nice: ");
    client.say(CHANNEL, "Nice shot! VoHiYo");
  }
};

const setupNiceShots = (realtime) => {
  realtime.combo.conversion$.subscribe((payload) => {
    reactToConversion(payload);
  });
};

export default setupNiceShots;
