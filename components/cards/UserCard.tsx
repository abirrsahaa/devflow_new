'use client';
import { getTopInteractedTags } from '@/lib/actions/tag.action';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RenderTag from '../shared/RenderTag';
import { Badge } from '../ui/badge';

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = ({ user }: Props) => {
  // idhar woh interaction ka kuch karna hai
  const [interactedTags, setInteractedTags] = useState<
    { _id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchInteractedTags = async () => {
      const tags = await getTopInteractedTags({
        userId: user._id,
      });
      setInteractedTags(tags);
    };

    fetchInteractedTags();
  }, []);
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        {/* yeh wala part bad mai karna hai after finding the interaction wala thing */}

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
