'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
} from './shared.types';
import Tag from '@/database/tag.model';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to database pehle uske bad baki cheeze dekhi jayegi
    await connectToDatabase();
    console.log(params);

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // idhar check karo ke aese tag already created hai ke nahi
    // agar already created hai toh fir add kardo chup chap
    // aur nahi hai toh add karo with diving deep in aggregation pipe lines of mongo db

    // !!yeh wala part i need to undersrtand after i have gone through mongo db
    // !!aggregation pipelines which is one of the main thib=ngs in this handling of data using mongodb

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // inserting all the tags in the question document

    // !! ok si it is traversing over the tag array and updating the tag field in question document with the tags !

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the user ask question action

    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log('this error is in createQuestion', error);
  }
}

// bhai simple sa fact hai algo likho
// maine question ka form banaya hai
// usse inputs lene hai
// then usko sanitize karke onsubmit handler mai bhejna hai
// on submit handler kya karega woh ak api call karega yeh question banane ke liye jo ki maine upar likhi hai so just call it with appropriate params
export async function getAllQuestions() {
  try {
    await connectToDatabase();
    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });
    // console.log('the questions are ', questions);

    console.log('the questions are -> ', questions);

    return questions;
  } catch (error) {
    console.log('this error was originated in getAllQuestions-> ', error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate('tags');

    if (!question) {
      throw new Error('Question not found');
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log('this error is in editQuestion ', error);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      })
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({ path: 'answers', model: Answer });

    if (!question) throw new Error('bhaisab iska toh nahi mila ');

    return question;
  } catch (error) {
    console.log('this error has been founded in getQuestionbyId -> ', error);
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();
    // abhi karo jo bhi lauda lasan hai

    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

    // pehle get the question kyu ki usi ko manipulate karna hai

    let updateQuery = {};
    // akbar mil jaye question then check karo
    // agar hasupvoted hai toh phir usko hatao
    // and nahi hai toh usko true karo by pushing it to upvotes kya push karna hai ? --> userID

    // agar upvited hai toh userid ko nikalo upvotes se
    // aur agar downvoted hai toh downvote se nikalo and upvote mai dalo
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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    // aur agar dono nahi hai toh upvotes mai dalo au
    if (!question) {
      throw new Error('Question not found');
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log('this error is found in upvoteQuestion -> ', error);
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    console.log('the params are -> ', params);

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // Increment author's reputation

    revalidatePath(path);

    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
