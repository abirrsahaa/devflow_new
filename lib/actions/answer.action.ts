'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../mongoose';
import { CreateAnswerParams, GetAnswersParams } from './shared.types';
import Question from '@/database/question.model';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

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
    connectToDatabase();
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
