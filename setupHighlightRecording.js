import { generateDolphinQueuePayload } from "@vinceau/slp-realtime";
import fs from "fs";

const now = new Date();
const dateString = `${now.getFullYear()}_${
  now.getMonth() + 1
}_${now.getDay()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
const outputFile = `/mnt/C/Users/ycz/Documents/Slippi/Clippi/bot-highlights/highlights_${dateString}.json`;
const combos = [];

const RECORDING_LENGTH = 60 * 30;

const setupHighlights = (livestream, realtime) => {
  realtime.input.buttonCombo(["D_LEFT", "A"]).subscribe((payload) => {
    console.log("input", payload);
    const filename = livestream.getCurrentFilename();
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
    if (combos.length) {
      const payload = generateDolphinQueuePayload(combos);
      fs.writeFileSync(outputFile, payload);
      console.log(`Wrote ${combos.length} highlights to ${outputFile}`);
    }
    process.exit();
  });
};

export default setupHighlights;
