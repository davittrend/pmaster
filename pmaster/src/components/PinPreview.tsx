import React from 'react';
import type { PinterestPin } from '../types/pinterest';

interface PinPreviewProps {
  pins: PinterestPin[];
}

export function PinPreview({ pins }: PinPreviewProps) {
  if (pins.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Preview ({pins.length} pins)</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pins.map((pin, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-medium text-gray-900 truncate">{pin.title}</h4>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{pin.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}