import { z } from 'zod';
import Papa from 'papaparse';
import { pinSchema, type PinterestPin } from '../types/pinterest';

export interface CSVParseResult {
  pins: PinterestPin[];
  errors: Array<{
    row: number;
    errors: string[];
  }>;
}

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const pins: PinterestPin[] = [];
        const errors: CSVParseResult['errors'] = [];

        results.data.forEach((row: any, index) => {
          try {
            // Validate required fields exist
            if (!row.title || !row.link || !row.imageUrl) {
              throw new Error('Missing required fields');
            }

            const pinData = {
              title: row.title.trim(),
              description: row.description?.trim() || '',
              link: row.link.trim(),
              imageUrl: row.imageUrl.trim(),
              boardId: '', // Will be set later
            };

            // Validate using the schema
            const validatedPin = pinSchema.parse(pinData);
            pins.push(validatedPin);
          } catch (error) {
            if (error instanceof z.ZodError) {
              errors.push({
                row: index + 2, // Add 2 for header row and 0-based index
                errors: error.errors.map(e => e.message),
              });
            } else {
              errors.push({
                row: index + 2,
                errors: ['Invalid row format. Please check all required fields are present.'],
              });
            }
          }
        });

        resolve({ pins, errors });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      },
    });
  });
}