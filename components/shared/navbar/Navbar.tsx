import React from 'react';

// what i thought is
// flex thakbo
// would have 3 div/elements
// onw for the logo image
// one for the localsearchbar
// one for theme switcher and the profile provided by clerk

// functionality wise bad mai ate hai

// abhi ke liye functionality kya sochega is the theme switcher and the profile provided by clerk

// abhi ke liye dive deep into the code for theme switcher

import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import Theme from './Theme';
import MobileNav from './MobileNav';
import GlobalSearch from '../search/GlobalSearch';

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      {/* this is for the image of devflow which will be serving as the image */}
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="DevFlow"
        />

        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev <span className="text-primary-500">Overflow</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className="flex-between gap-5">
        <Theme />

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10',
              },
              variables: {
                colorPrimary: '#ff7000',
              },
            }}
          />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
