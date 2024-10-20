'use client';

import { Input } from '@/components/ui/input';
import Image from 'next/image';

// as i will be using a onclick handler

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {/* left hoga prop toh woh image left mai ayega  */}
      {/* input component */}
      {/* right hoga toh woh image right mai ayega  */}
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      {/* !just for removing error  */}
      {route}

      <Input
        type="text"
        placeholder={placeholder}
        // value=""
        // onChange={() => {}}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
