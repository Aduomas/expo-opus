import * as Opus from 'expo-opus';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { File } from 'expo-file-system';
import { useAssets } from 'expo-asset';

export default function App() {
  const [result, setResult] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  // Use the useAssets hook to load the opus file
  const [assets, assetError] = useAssets([require('./assets/chunk_0.opus')]);

  useEffect(() => {
    if (assetError) {
      setError(assetError.message);
      setResult('Failed to load asset');
      return;
    }

    if (assets) {
      testOpusDecoding(assets[0]);
    }
  }, [assets, assetError]);

  const testOpusDecoding = async (asset: any) => {
    try {
      // Initialize the decoder
      Opus.opusStart();
      setResult('Decoder initialized...');

      
      if (!asset.localUri) {
        throw new Error('Asset not available locally');
      }
      
      setResult('Reading opus file...');
      
      // Read the opus file using the new FileSystem API
      const opusFile = new File(asset.localUri);
      const opusBytes = await opusFile.bytes();
      // setResult('opusBytes: ' + opusBytes.byteLength);
      // Decode the opus data
      // Adjust packet size based on your opus file structure (common sizes: 160, 320, 480, 960 bytes)
      const packetSize = 40;
      
      try {
        // Using opusDecodeToSamples for proper Int16Array typed array
        const decodedSamples = Opus.opusDecodeToSamples(opusBytes, packetSize);
        
        if (decodedSamples === undefined || decodedSamples === null) {
          setResult('Decode failed: Native function returned undefined/null');
        } else if (decodedSamples.length === 0) {
          setResult('Decode completed but no samples were decoded');
        } else {
          setResult(`Successfully decoded! Samples: ${decodedSamples.length}, Buffer size: ${decodedSamples.byteLength} bytes`);
        }
      } catch (decodeError) {
        setResult(`Decode failed: ${decodeError instanceof Error ? decodeError.message : 'Unknown decode error'}`);
      }

      // Clean up
      Opus.opusStop();
      
    } catch (err) {
      console.error('Opus decoding error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult('Failed to decode');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Opus Test</Text>
      <Text style={styles.result}>{result}</Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
});
