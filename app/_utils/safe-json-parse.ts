import { jsonrepair } from 'jsonrepair';

/**
 * Safely parse JSON-like AI responses
 */
export function safeJsonParse<T>(raw: string): T | null {
  try {
    // First try: normal JSON parse
    return JSON.parse(raw) as T;
  } catch {
    try {
      // Second try: repair malformed JSON
      const repaired = jsonrepair(raw);
      return JSON.parse(repaired) as T;
    } catch (err) {
      console.error('Failed to parse JSON response:', err);
      return null;
    }
  }
}
