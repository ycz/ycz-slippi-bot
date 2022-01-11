import { Ports } from "@slippi/slippi-js";
import { SlpLiveStream, SlpRealTime } from "@vinceau/slp-realtime";
import setupHighlights from "./setupHighlightRecording.js";
import setupNiceShots from "./setupNiceShots.js";

const livestream = new SlpLiveStream("dolphin", { outputFiles: true });
const address = "192.168.16.1",
  slpPort = Ports.DEFAULT;
livestream
  .start(address, slpPort)
  .then(() => {
    console.log("Connected to Dolphin!");
  })
  .catch(console.error);

const realtime = new SlpRealTime();
realtime.setStream(livestream);

realtime.game.start$.subscribe((payload) => {
  console.log("game started");
  // console.log(payload);
});

realtime.combo.end$.subscribe((payload) => {
  // console.log("combo: ", payload);
  // console.log("moves: ", payload.combo.moves);
});

setupHighlights(livestream, realtime);
setupNiceShots(realtime);
