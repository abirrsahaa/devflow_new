import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    return console.log('MISSING MONGODB_URL');
  }

  console.log(process.env.MONGODB_URL);

  if (isConnected) {
    console.log('already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devflow',
    });

    isConnected = true;

    console.log('MongoDB is connected');
  } catch (error) {
    console.log('MongoDB connection failed', error);
  }
};

// fact is simple for anything we used to hit an api
// api are nothing but functions which would interact with db

// what nextjs does is the fact that it takes the api out of context
// it lets us define the function in seperate file which will run in server
// now we just need to pass the parameters in the right way to that function
// and that function will call the database and do the necessary mutations
// and can also return the data you want

// so i need to focus on the logic !
// models and relationships in db
