/**
 * ScanResultSerializer
 * Handles serialization and deserialization of ScanResult objects
 */

import type { IScanResult, ISerializationResult } from './types';

/**
 * Validates that an object has the required ScanResult properties
 * @param obj - The object to validate
 * @returns true if the object is a valid ScanResult
 */
function isValidScanResult(obj: unknown): obj is IScanResult {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.value === 'string' &&
    typeof candidate.codeType === 'string' &&
    typeof candidate.timestamp === 'number'
  );
}

/**
 * ScanResultSerializer class
 * Provides static methods for serializing and deserializing ScanResult objects
 */
export class ScanResultSerializer {
  /**
   * Serialize a ScanResult to a JSON string
   * @param result - The ScanResult to serialize
   * @returns A JSON string representation of the ScanResult
   */
  static serialize(result: IScanResult): string {
    return JSON.stringify({
      value: result.value,
      codeType: result.codeType,
      timestamp: result.timestamp,
    });
  }

  /**
   * Deserialize a JSON string to a ScanResult
   * @param json - The JSON string to deserialize
   * @returns A SerializationResult containing the ScanResult or an error
   */
  static deserialize(json: string): ISerializationResult<IScanResult> {
    try {
      const parsed = JSON.parse(json);

      if (!isValidScanResult(parsed)) {
        return {
          success: false,
          error:
            'Invalid ScanResult structure: missing or invalid required fields (value, codeType, timestamp)',
        };
      }

      return {
        success: true,
        data: {
          value: parsed.value,
          codeType: parsed.codeType,
          timestamp: parsed.timestamp,
        },
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown parsing error';
      return {
        success: false,
        error: `JSON parsing failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Serialize an array of ScanResults to a JSON string
   * @param results - The array of ScanResults to serialize
   * @returns A JSON string representation of the ScanResult array
   */
  static serializeArray(results: IScanResult[]): string {
    return JSON.stringify(
      results.map((result) => ({
        value: result.value,
        codeType: result.codeType,
        timestamp: result.timestamp,
      })),
    );
  }

  /**
   * Deserialize a JSON string to an array of ScanResults
   * @param json - The JSON string to deserialize
   * @returns A SerializationResult containing the ScanResult array or an error
   */
  static deserializeArray(json: string): ISerializationResult<IScanResult[]> {
    try {
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: 'Invalid ScanResult array: expected an array',
        };
      }

      const results: IScanResult[] = [];

      for (let i = 0; i < parsed.length; i++) {
        if (!isValidScanResult(parsed[i])) {
          return {
            success: false,
            error: `Invalid ScanResult at index ${i}: missing or invalid required fields (value, codeType, timestamp)`,
          };
        }

        results.push({
          value: parsed[i].value,
          codeType: parsed[i].codeType,
          timestamp: parsed[i].timestamp,
        });
      }

      return {
        success: true,
        data: results,
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown parsing error';
      return {
        success: false,
        error: `JSON parsing failed: ${errorMessage}`,
      };
    }
  }
}
