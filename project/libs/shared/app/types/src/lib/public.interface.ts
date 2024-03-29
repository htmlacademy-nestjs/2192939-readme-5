import { Comment } from './comment.interface';
export interface Public {
  publicId?: string;
  userId: string;

  // Repost
  isRepost: boolean;
  originalUserId?: string;
  originalPublicId?: string;

  // VideoPublic
  title?: string;
  video?: string;

  // TextPublic
  notice?: string;
  text?: string;

  // QuotePublic
  quote?: string;
  author?: string;

  // PhotoPublic
  photo?: string;

  // LinkPublic
  link?: string;
  description?: string;

  // Counts
  commentsCount: number;
  likesCount: number;

  // Common
  tags?: string[];
  comments?: Comment[];

  // Service
  createAt?: Date;
  updateAt?: Date;

  publicType: string;
  publicStatus: string;
}
