import QuestionCard from '@/components/cards/QuestionCard';
import Filter from '@/components/shared/Filter';
import HomeFilters from '@/components/shared/home/HomeFilters';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import { getAllQuestions } from '@/lib/actions/question.action';
import Link from 'next/link';
import React from 'react';

// pehle all question wala div banao
// local search bar banao jo ki reusable ho and we can use it in many places
// also include filter cards for big devices
// and select menu for filters in small to extra small devices

// and then come down to build the question cards which will be rendered and clicked upon to get to the desired question page

const page = async () => {
  const questions = await getAllQuestions();
  if (!questions || questions.length === 0) {
    console.log('No questions received');
    return;
  }
  console.log('all the questions received are --> ', questions);
  return (
    <>
      {/* first comes to the ask questions part which will be a div of h1 and a button */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* now is the  time to built the localsearch bar and the filter menu  */}
      {/* which will be a select menu for small devices or else they will be just cards */}

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      {/* lets now focus on the cards which will be reusable throughout  */}
      {/* these are nothing but shadcn buttons with props playing the actual game */}
      <HomeFilters />

      {/* now the main thing is to render the question cards which forms the basis of everything  */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions?.length > 0 ? (
          questions?.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default page;
