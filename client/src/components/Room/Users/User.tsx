import { TUser } from 'librechat-data-provider';
import React from 'react';
import useAvatar from '~/hooks/Messages/useAvatar';
import UserKickButton from './UserKickButton';
import { useChatContext } from '~/Providers';
import { useRecoilValue } from 'recoil';
import store from '~/store';
import TipModal from './TipModal';
import Marquee from 'react-fast-marquee';

export default function User({
  user,
  isCollapsed = false,
}: {
  user: TUser;
  isCollapsed?: boolean;
}) {
  const { conversation } = useChatContext();
  const activeConvo = false;
  const avatarSrc = useAvatar(user);
  const you = useRecoilValue(store.user);

  const aProps = {
    className: `group relative mt-1 flex cursor-pointer items-center gap-2 break-all rounded-lg bg-gray-200 ${
      isCollapsed ? 'px-0 py-0' : 'px-2 py-2'
    } active:opacity-50 dark:bg-gray-700 w-full flex justify-between`,
  };

  if (!activeConvo) {
    aProps.className =
      'group relative grow overflow-hidden whitespace-nowrap rounded-lg active:opacity-50 flex cursor-pointer items-center mt-2 gap-2 break-all rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white py-2 px-2';
  }

  return (
    <a data-testid="convo-item" {...aProps}>
      <img
        src={user && user.avatar ? user.avatar : avatarSrc}
        alt={user.name}
        className="h-6 w-6 flex-shrink-0 rounded-full"
      />
      {user.cryptocurrency &&
        user.cryptocurrency.length !== 0 &&
        !isCollapsed &&
        you?.username !== 'guest-user' &&
        you?.id !== user?._id && <TipModal user={user} />}

      <TipModal user={user} isKarmaOnly={true} OpenButton={<div className="flex gap-3">
        {!isCollapsed && (user.name).length > 15 ? <Marquee speed={30} className="w-full">{user.name}&nbsp; &nbsp; &nbsp; </Marquee>
         : 
           user.name
         }
      </div>} />
      {!isCollapsed && you?.id === conversation?.user.id && you.id !== user.id && (
        <UserKickButton user={user} />
      )}
    </a>
  );
}
