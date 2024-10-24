'use server';
import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import { FilterQuery } from 'mongoose';
import Tag from '@/database/tag.model';

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    console.log('the parms here is ', params);

    const { userId } = params;

    console.log('clerkId', userId);

    // idhar db call karo to check if the user exists
    const user = await User.findOne({
      clerkId: userId,
    });

    return user;
  } catch (error) {
    console.log('this error was in getuserbyId ->', error);
  }
}

// actions for create user , delete user and update user
export async function createUser(params: CreateUserParams) {
  try {
    await connectToDatabase();

    const user = await User.create(params);
    return user;
  } catch (error) {
    console.log('the error occured in create user action ', error);
  }
}

// yeh hogaya update ka !

export async function UpdateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log('the error is in update user ', error);
  }
}

// yeh hogaya delete ka

// !! need to go through the delete function kinda in doubt of how the algo is franed and the logic behind it

export async function DeleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log('this error is in delete user ', error);
  }
}
// params: GetAllUsersParams
export async function GetAllUsers() {
  try {
    await connectToDatabase();
    // idhar pagination bhi lagana hai
    // const { page, pageSize, filter, searchQuery } = params;

    const users = await User.find({}).sort({ joinedAt: -1 });

    return { users };

    // !dont we need to specify the type which the function will be sending??
  } catch (error) {
    console.log('this error was received in getqallusers --> ', error);
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    console.log(' i got called here ');
    await connectToDatabase();

    const { userId, questionId, path } = params;

    // find user and search in that array if this question id exists
    const user = await User.findById(userId);

    // check in the saved array if this questionid exists
    if (!user) {
      throw new Error('user not found');
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove from the save
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: { saved: questionId },
        },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log('this is error where we are toggling save question', error);
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
    // !this is a new thing in mongodb thAT i need to explore
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
