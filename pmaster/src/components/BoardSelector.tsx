import React from 'react';
import { useQuery } from 'react-query';
import { Loader, AlertCircle } from 'lucide-react';
import { getBoards } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { PinterestBoard } from '../types/pinterest';

interface BoardSelectorProps {
  selectedBoard: string;
  onBoardSelect: (boardId: string) => void;
}

export function BoardSelector({ selectedBoard, onBoardSelect }: BoardSelectorProps) {
  const { auth } = useAuthStore();
  const { data: boards, isLoading, error, refetch } = useQuery<PinterestBoard[]>(
    'boards',
    () => getBoards(auth!.access_token),
    {
      enabled: !!auth,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      retry: 2, // Retry failed requests twice
      onError: (error) => {
        console.error('Error fetching boards:', error);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        <Loader className="h-5 w-5 text-pink-500 animate-spin" />
        <span className="text-gray-600">Loading boards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-800 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load boards</span>
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!boards?.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          No boards found. Please create a board on Pinterest first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={selectedBoard}
        onChange={(e) => onBoardSelect(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                 focus:border-pink-500 focus:ring-pink-500 bg-white"
      >
        <option value="">Select a board</option>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name} {board.privacy === 'secret' && '(Secret)'}
          </option>
        ))}
      </select>
      {selectedBoard && boards.find(b => b.id === selectedBoard)?.privacy === 'secret' && (
        <p className="text-sm text-yellow-600">
          Note: This is a secret board. Pins will only be visible to you and any collaborators.
        </p>
      )}
    </div>
  );
}