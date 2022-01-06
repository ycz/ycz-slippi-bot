const { Ports } = require("@slippi/slippi-js");
const {
  SlpLiveStream,
  SlpRealTime,
  generateDolphinQueuePayload,
} = require("@vinceau/slp-realtime");
const fs = require("fs");

const livestream = new SlpLiveStream("dolphin", { outputFiles: true });
const address = "192.168.16.1",
  slpPort = Ports.DEFAULT;
livestream
  .start(address, slpPort)
  .then(() => {
    console.log("Connected!");
  })
  .catch(console.error);

const realtime = new SlpRealTime();
realtime.setStream(livestream);

realtime.game.start$.subscribe((payload) => {
  console.log("game started");
  console.log(payload);
});

realtime.combo.end$.subscribe((payload) => {
  // console.log("combo: ", payload);
  // console.log("moves: ", payload.combo.moves);
});

const now = new Date();
const dateString = `${now.getFullYear()}_${
  now.getMonth() + 1
}_${now.getDay()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
const outputFile = `highlights/highlights_${dateString}.json`;
const combos = [];

const RECORDING_LENGTH = 60 * 30;

realtime.input.buttonCombo(["D_LEFT", "A"]).subscribe((payload) => {
  console.log("input", payload);
  const filename = livestream.getCurrentFilename();
  console.log("🚀 / realtime.input.buttonCombo / filename", filename);
  if (filename) {
    combos.push({
      path: filename,
      startFrame: Math.max(payload.frame - RECORDING_LENGTH, -120),
      endFrame: payload.frame,
    });
    console.log("🚀 / realtime.input.buttonCombo / combos", combos);
  }
});

process.on("SIGINT", () => {
  const payload = generateDolphinQueuePayload(combos);
  fs.writeFileSync(outputFile, payload);
  console.log(`Wrote ${combos.length} highlights to ${outputFile}`);
  process.exit();
});
