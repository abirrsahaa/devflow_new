'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../mongoose';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from './shared.types';
import Question from '@/database/question.model';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();

    const { content, author, question, path } = params;
    const answer = await Answer.create({
      author: author,
      question: question,
      content: content,
    });
    if (!answer) throw new Error('answer nahi ban paya bhai');
    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    // TODO: Add interaction...
    // return answer;
    revalidatePath(path);
  } catch (error) {
    console.log('this error was received in createanswer api ', error);
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase();
    const answers = await Answer.find({})
      .sort({
        createdAt: -1,
      })
      .populate({ path: 'author', model: User });

    return { answers };
  } catch (error) {
    console.log('the error was here in getanswers --> ', error);
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    console.log('the params here is upvote-> ', params);

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    console.log('the answer is ->', answer);

    if (!answer) {
      throw new Error('Answer not found');
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    console.log('the params here is downvote-> ', params);

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
