import UserCard from '@/components/cards/UserCard';
import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';

import { UserFilters } from '@/constants/filters';
import { GetAllUsers } from '@/lib/actions/user.action';
import Link from 'next/link';

const page = async () => {
  const result = await GetAllUsers();
  return (
    <>
      {/* first comes to the ask questions part which will be a div of h1 and a button */}

      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      {/* now is the  time to built the localsearch bar and the filter menu  */}
      {/* which will be a select menu for small devices or else they will be just cards */}

      {/* yeh section hogaya filter aur searchbar ka  */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex"
        />
      </div>

      {/* iss section mai toh mereko user card ko render karwana hai  */}
      {/* uske liye mereko har user ki details chahiye  */}
      <section className="mt-12 flex flex-wrap gap-4">
        {result?.users.length == undefined || result.users.length > 0 ? (
          result?.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default page;
