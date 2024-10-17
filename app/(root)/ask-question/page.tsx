import Questions from '@/components/shared/forms/Questions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Page = () => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        {/* question form which is the main part  */}
        <Questions />
      </div>
    </div>
  );
};

export default Page;
