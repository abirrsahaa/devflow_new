import Questions from '@/components/shared/forms/Questions';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';



const Page = async () => {
  const { userId } = auth();

  console.log("the  user id is ->",userId);

  // const userId = 'clerk12345';

  if (!userId) redirect('/sign-in');

  // get the user id from mongodb
  const mongoUser = await getUserById({ userId: userId });

  console.log('the user is ', mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        {/* question form which is the main part  */}
        <Questions mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
};

export default Page;

// now i have almost done the necessary things now i need to optimize
// the submit function of the submit form such that it can work for both
// edit and submitting
