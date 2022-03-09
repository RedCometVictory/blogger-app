import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

// general Post search, list posts made by all users
const handler = nc({ onError, onNoMatch });
handler.get();

export default handler;