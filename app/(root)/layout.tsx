import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Navbar from '@/components/shared/navbar/Navbar';
// import { Toaster } from '@/components/ui/toaster';
import React from 'react';

// idhar pehle soch toh le tu kese banata
// how ould you have  structured your code what are the differences between you and your thinking lets decipher

// what would i have done is
// obviously ak main hota
// usme pehle Navbar hota

// then ak div hota usme children sandwiched hota between the leftsidebar and the rightsidebar

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        <RightSidebar />
      </div>

      {/* <Toaster /> */}
    </main>
  );
};

export default Layout;
