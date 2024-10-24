'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { GetTopInteractedTagsParams } from './shared.types';
import Tag from '@/database/tag.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    // Find interactions for the user and group by tags...
    // Interaction...

    return [
      { _id: '1', name: 'tag' },
      { _id: '2', name: 'tag2' },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GetAllTags() {
  try {
    await connectToDatabase();
    const tags = await Tag.find({}).sort({ createdOn: -1 });

    return { tags };
  } catch (error) {
    console.log('the error lies in getalltags -->', error);
  }
}
