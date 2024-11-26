import { z } from 'zod';

// Auth types
export interface PinterestAuth {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

// Error types
export interface PinterestErrorResponse {
  code: number;
  message: string;
  status: string;
}

// Board types
export interface PinterestBoard {
  id: string;
  name: string;
  owner: {
    username: string;
  };
  privacy: 'public' | 'secret' | 'protected';
  description: string;
  created_at: string;
  collaborator_count?: number;
  pin_count?: number;
  follower_count?: number;
}

export interface PinterestBoardResponse {
  items: PinterestBoard[];
  bookmark?: string;
}

// User types
export interface PinterestUser {
  username: string;
  account_type: 'BUSINESS' | 'PERSONAL';
  profile_image: string;
  website_url?: string;
  bio?: string;
}

// Pin types
export const pinSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  link: z.string().url('Must be a valid URL'),
  imageUrl: z.string()
    .url('Must be a valid URL')
    .startsWith('https://', 'Image URL must use HTTPS'),
  boardId: z.string(),
  scheduledTime: z.date().optional(),
});

export type PinterestPin = z.infer<typeof pinSchema>;

export interface CreatePinResponse {
  id: string;
  link: string;
  title: string;
  created_at: string;
  board_id: string;
  media: {
    images: {
      originals: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
}

// Account settings
export const accountSettingsSchema = z.object({
  dailyPinLimit: z.number()
    .min(1, 'Must schedule at least 1 pin per day')
    .max(100, 'Cannot schedule more than 100 pins per day'),
  preferredTimeStart: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be in HH:mm format'),
  preferredTimeEnd: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be in HH:mm format'),
  timezone: z.string(),
});

export type AccountSettings = z.infer<typeof accountSettingsSchema>;