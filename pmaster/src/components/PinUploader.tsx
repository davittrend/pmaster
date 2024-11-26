import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { parseCSVFile, type CSVParseResult } from '../lib/csvParser';
import type { PinterestPin } from '../types/pinterest';

interface PinUploaderProps {
  onPinsLoaded: (pins: PinterestPin[]) => void;
}

export function PinUploader({ onPinsLoaded }: PinUploaderProps) {
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setParseResult(null);

    try {
      const result = await parseCSVFile(file);
      setParseResult(result);
      
      if (result.pins.length > 0) {
        onPinsLoaded(result.pins);
      }
    } catch (error) {
      console.error('Failed to parse CSV:', error);
      setParseResult({
        pins: [],
        errors: [{
          row: 0,
          errors: ['Failed to parse CSV file. Please check the file format.']
        }]
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onPinsLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isProcessing
            ? 'Processing file...'
            : isDragActive
            ? 'Drop the CSV file here'
            : 'Drag and drop a CSV file, or click to select'}
        </p>
        <div className="mt-4 text-xs text-gray-500">
          <p>CSV format requirements:</p>
          <ul className="list-disc list-inside">
            <li>Title (required, max 100 characters)</li>
            <li>Description (optional, max 500 characters)</li>
            <li>Link (required, valid URL)</li>
            <li>Image URL (required, HTTPS URL)</li>
          </ul>
        </div>
      </div>

      {parseResult?.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h4 className="font-medium">Validation Errors</h4>
          </div>
          <ul className="space-y-2 text-sm text-red-700">
            {parseResult.errors.map((error, index) => (
              <li key={index}>
                {error.row > 0 ? `Row ${error.row}: ` : ''}
                {error.errors.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parseResult?.pins.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Successfully loaded {parseResult.pins.length} pins
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-700 mb-2">Example CSV Format</h4>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          Title,Description,Link,Image URL{'\n'}
          My Pin Title,A great description,https://example.com,https://example.com/image.jpg
        </pre>
      </div>
    </div>
  );
}