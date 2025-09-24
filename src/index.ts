import ExpoOpusModule from './ExpoOpusModule';

export const opusStart = () => ExpoOpusModule.opusStart();

export const opusDecode = (concatenatedPackets: Uint8Array, packetSize: number): Uint8Array => 
  ExpoOpusModule.opusDecode(concatenatedPackets, packetSize);

export const opusDecodeToSamples = (concatenatedPackets: Uint8Array, packetSize: number): Int16Array => {
  const pcmBytes = ExpoOpusModule.opusDecode(concatenatedPackets, packetSize);
  return new Int16Array(pcmBytes.buffer, pcmBytes.byteOffset, pcmBytes.byteLength / 2);
};

export const opusStop = () => ExpoOpusModule.opusStop();

export { ExpoOpusModuleEvents } from './ExpoOpus.types';
