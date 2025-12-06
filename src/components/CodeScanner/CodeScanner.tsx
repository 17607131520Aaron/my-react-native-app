/**
 * CodeScanner Component
 * A barcode/QR code scanner component based on react-native-camera-kit
 */

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

import ScanFrame from './ScanFrame';
import { useCodeScanner } from './useCodeScanner';
import { useScannerLifecycle } from './useScannerLifecycle';

import type { ICodeScannerProps } from './types';

/**
 * CodeScanner component for scanning QR codes and barcodes
 */
export const CodeScanner: React.FC<ICodeScannerProps> = ({
  onScan,
  onDuplicateScan,
  onPermissionDenied,
  scanInterval = 1000,
  enableDuplicateDetection = true,
  allowDuplicateScan = false,
  cacheConfig,
  paused = false,
  torchMode = 'off',
  showScanFrame = true,
  scanFrameStyle,
  style,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { handleScan, isDuplicate } = useCodeScanner({
    scanInterval,
    cacheConfig,
    enableDuplicateDetection,
  });

  // Manage lifecycle based on app state and navigation focus
  const { shouldPause } = useScannerLifecycle({
    externalPaused: paused,
  });

  // Request camera permission on mount
  useEffect(() => {
    const requestPermission = async (): Promise<void> => {
      try {
        // react-native-camera-kit handles permission internally
        // We just need to check if it's available
        setHasPermission(true);
      } catch {
        setHasPermission(false);
        onPermissionDenied?.();
      }
    };

    requestPermission();
  }, [onPermissionDenied]);

  /**
   * Handle barcode read event from camera
   */
  const handleReadCode = useCallback(
    (event: { nativeEvent: { codeStringValue: string; codeFormat?: string } }) => {
      // Use shouldPause which considers app state, navigation focus, and external paused prop
      if (shouldPause) {
        return;
      }

      const { codeStringValue, codeFormat } = event.nativeEvent;
      const codeType = codeFormat ?? 'unknown';

      // Check for duplicate
      const isDuplicateScan = isDuplicate(codeStringValue);

      // Process scan through hook
      const result = handleScan(codeStringValue, codeType);

      if (!result) {
        // Throttled, ignore
        return;
      }

      if (isDuplicateScan) {
        // Notify duplicate
        onDuplicateScan?.(result);

        // Only call onScan if allowDuplicateScan is true
        if (allowDuplicateScan) {
          onScan(result);
        }
      } else {
        // New scan
        onScan(result);
      }
    },
    [shouldPause, isDuplicate, handleScan, onDuplicateScan, allowDuplicateScan, onScan],
  );

  // Handle permission denied
  if (hasPermission === false) {
    onPermissionDenied?.();
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Camera
        cameraType={CameraType.Back}
        scanBarcode={!shouldPause}
        showFrame={false}
        style={styles.camera}
        torchMode={torchMode}
        onReadCode={handleReadCode}
      />
      {showScanFrame && <ScanFrame style={scanFrameStyle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
});

export default CodeScanner;
