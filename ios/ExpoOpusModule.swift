import ExpoModulesCore

public class ExpoOpusModule: Module {
  var opusDecoder: OpaquePointer? = nil
    
  public func definition() -> ModuleDefinition {
    Name("ExpoOpus")
      
    Function("opusStart") {
        var error: Int32 = 0
        self.opusDecoder = opus_decoder_create(16000, 1, &error)
    }
    
    Function("opusDecode") { (concatenatedPackets: Data, packetSize: Int) -> Data in
        var allDecodedPCM = Data()
        let packetCount = concatenatedPackets.count / packetSize
        
        for i in 0..<packetCount {
            let startIndex = i * packetSize
            let endIndex = min(startIndex + packetSize, concatenatedPackets.count)
            let packetData = concatenatedPackets.subdata(in: startIndex..<endIndex)
            
            var pcm = [Int16](repeating: 0, count: 5760)
            let decodedSamples = packetData.withUnsafeBytes { (bytes: UnsafeRawBufferPointer) in
                return Int(opus_decode(self.opusDecoder!, 
                                      bytes.bindMemory(to: UInt8.self).baseAddress, 
                                      opus_int32(packetData.count), 
                                      &pcm, 
                                      5760, 
                                      0))
            }
            
            if decodedSamples > 0 {
                // Convert Int16 samples to Data (raw bytes)
                let pcmData = Data(bytes: pcm, count: decodedSamples * MemoryLayout<Int16>.size)
                allDecodedPCM.append(pcmData)
            }
        }
        
        return allDecodedPCM
    }
    
    Function("opusStop") {
        opus_decoder_destroy(self.opusDecoder)
        self.opusDecoder = nil
    }
  }
}
