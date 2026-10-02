import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setCrf(18);
// The deck relies on Google Fonts; give the browser room to settle each frame.
Config.setDelayRenderTimeoutInMilliseconds(60000);
