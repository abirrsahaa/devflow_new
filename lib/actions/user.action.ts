import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    console.log('the parms here is ', params);

    const { clerkId } = params;

    console.log('clerkId', clerkId);

    // idhar db call karo to check if the user exists
    const user = await User.findOne({
      clerkId: clerkId,
    });

    return user;
  } catch (error) {
    console.log('this error was in getuserbyId ->', error);
  }
}
