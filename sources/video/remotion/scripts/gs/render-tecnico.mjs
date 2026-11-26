// Renders the Alertaí technical-video motions to sources/video/global-solution/motion/.
// Full-screen inserts: H.264 CRF 16, BT.709 limited range (yuv420p tv, same as the OBS takes; the default
// came out yuvj420p, full range, which can shift the Pétala tone next to the takes in Premiere). Overlays (ids from src/gs/tecnico/overlays.tsx): ProRes 4444 with alpha.
//
//   node scripts/gs/render-tecnico.mjs                 # everything
//   node scripts/gs/render-tecnico.mjs GS-M02 GS-M03   # only ids that start with these prefixes
//   Check stills: npx remotion still <id> out/gs/<id>.png --frame=<n>
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = resolve(root, "..", "global-solution", "motion");
// Paths handed to the CLI are relative to the Remotion folder: with shell: true (needed for npx on
// Windows) an absolute path breaks at the space in "John Silverio".
const outRel = "../global-solution/motion";
const stillDir = resolve(root, "out", "gs");
mkdirSync(outDir, { recursive: true });
mkdirSync(stillDir, { recursive: true });

const args = process.argv.slice(2);
const prefixes = args.filter((a) => !a.startsWith("--"));

const remotion = (cmdArgs) =>
  execFileSync("npx", ["remotion", ...cmdArgs, "--log=error"], { cwd: root, stdio: "inherit", shell: true });

const listing = execFileSync("npx", ["remotion", "compositions", "--quiet"], { cwd: root, shell: true }).toString();
const ids = listing
  .split(/\s+/)
  .filter((t) => t.startsWith("GS-") && !t.startsWith("GS-M00"))
  .filter((id) => prefixes.length === 0 || prefixes.some((p) => id.startsWith(p)));

const isOverlay = (id) => /^GS-(M04|M06|M12)/.test(id);

for (const id of [...new Set(ids)]) {
  if (isOverlay(id)) {
    // remotion.config.ts sets a global CRF, which the ProRes encoder rejects. So: PNG sequence with alpha,
    // then ProRes 4444 (yuva444p10le) with the ffmpeg-static build.
    const seqRel = `out/gs/seq-${id}`;
    rmSync(resolve(root, seqRel), { recursive: true, force: true });
    remotion(["render", id, seqRel, "--sequence", "--image-format=png"]);
    const ffmpeg = resolve(root, "node_modules", "ffmpeg-static", "ffmpeg.exe");
    execFileSync(ffmpeg, [
      "-y", "-v", "error", "-framerate", "30", "-i", resolve(root, seqRel, "element-%03d.png"),
      "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-vendor", "apl0",
      resolve(outDir, `${id}.mov`),
    ], { stdio: "inherit" });
    rmSync(resolve(root, seqRel), { recursive: true, force: true });
  } else {
    remotion(["render", id, `${outRel}/${id}.mp4`, "--codec=h264", "--crf=16", "--muted", "--color-space=bt709"]);
  }
}
console.log(`\nSaida: ${outDir}`);
