'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import { CreateQuestionParams } from './shared.types';
import Tag from '@/database/tag.model';

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

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the user ask question action
  } catch (error) {
    console.log('this error is in createQuestion', error);
  }
}
