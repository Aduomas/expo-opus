package expo.modules.opus

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream

class ExpoOpusModule : Module() {
  
  private val opus = OpusVedro()
  
  override fun definition() = ModuleDefinition {
    Name("ExpoOpus")

    Function("opusStart") {
      opus.decoderInit(16000, 1)
    }
    
    Function("opusDecode") { concatenatedPackets: ByteArray, packetSize: Int ->
      val allDecodedPCM = ByteArrayOutputStream()
      val packetCount = concatenatedPackets.size / packetSize
      
      for (i in 0 until packetCount) {
        val startIndex = i * packetSize
        val endIndex = minOf(startIndex + packetSize, concatenatedPackets.size)
        val packet = concatenatedPackets.copyOfRange(startIndex, endIndex)
        
        val pcmBuffer = ByteArray(5760 * 2)
        val decodedSamples = opus.decode(packet, pcmBuffer)
        
        if (decodedSamples > 0) {
          allDecodedPCM.write(pcmBuffer, 0, decodedSamples * 2)
        }
      }
      
      allDecodedPCM.toByteArray()
    }
    
    Function("opusDecodeSingle") { value: ByteArray ->
      val output = ByteArray(5760 * 2)
      val res = opus.decode(value, output)
      output.copyOfRange(0, res * 2)
    }
    
    Function("opusStop") {
      opus.decoderRelease()
    }
  }
}