import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { TagFilters } from '@/constants/filters';
import { GetAllTags } from '@/lib/actions/tag.action';
import Link from 'next/link';
export const runtime = 'edge';
const page = async () => {
  // const result = await GetAllUsers();
  const result = await GetAllTags();
  return (
    <>
      {/* first comes to the ask questions part which will be a div of h1 and a button */}

      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      {/* now is the  time to built the localsearch bar and the filter menu  */}
      {/* which will be a select menu for small devices or else they will be just cards */}

      {/* yeh section hogaya filter aur searchbar ka  */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex"
        />
      </div>

      {/* iss section mai toh mereko user card ko render karwana hai  */}
      {/* uske liye mereko har user ki details chahiye  */}
      <section className="mt-12 flex flex-wrap gap-4">
        {result?.tags.length == undefined || result?.tags.length == 0 ? (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a question"
          />
        ) : (
          result?.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>

                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>{' '}
                  Questions
                </p>
              </article>
            </Link>
          ))
        )}
      </section>
    </>
  );
};

export default page;
