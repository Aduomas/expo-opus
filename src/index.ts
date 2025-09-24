import ExpoOpusModule from './ExpoOpusModule';

export const opusStart = () => ExpoOpusModule.opusStart();
export const opusDecode = (concatenatedPackets: Uint8Array, packetSize: number): Uint8Array => 
  ExpoOpusModule.opusDecode(concatenatedPackets, packetSize);
export const opusDecodeSingle = (packet: Uint8Array): Uint8Array => 
  ExpoOpusModule.opusDecodeSingle(packet);
export const opusStop = () => ExpoOpusModule.opusStop();

export { ExpoOpusModuleEvents } from './ExpoOpus.types';
