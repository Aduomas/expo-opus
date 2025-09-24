import { NativeModule, requireNativeModule } from 'expo';

import { ExpoOpusModuleEvents } from './ExpoOpus.types';

declare class ExpoOpusModule extends NativeModule<ExpoOpusModuleEvents> {
  opusStart: () => void;
  opusDecode: (concatenatedPackets: Uint8Array, packetSize: number) => Uint8Array;
  opusStop: () => void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoOpusModule>('ExpoOpus');
