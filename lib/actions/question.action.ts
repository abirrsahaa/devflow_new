'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import { CreateQuestionParams, EditQuestionParams } from './shared.types';
import Tag from '@/database/tag.model';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to database pehle uske bad baki cheeze dekhi jayegi
    connectToDatabase();
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
    connectToDatabase();
    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });
    console.log('the questions are ', questions);

    return questions;
  } catch (error) {
    console.log('this error was originated in getAllQuestions-> ', error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
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
