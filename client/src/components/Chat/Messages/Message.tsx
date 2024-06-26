import { useRecoilValue } from 'recoil';
import { useAuthContext, useMessageHelpers, useLocalize } from '~/hooks';
import type { TMessageProps } from '~/common';
import { Plugin } from '~/components/Messages/Content';
import MessageContent from './Content/MessageContent';
import SiblingSwitch from './SiblingSwitch';
// eslint-disable-next-line import/no-cycle
import MultiMessage from './MultiMessage';
import HoverButtons from './HoverButtons';
import SubRow from './SubRow';
import { cn } from '~/utils';
import store from '~/store';
import { isPremiumUser } from '~/utils/checkUserValid';
import { TUser } from 'librechat-data-provider';
import { useEffect } from 'react';

export default function Message(props: TMessageProps) {
  const UsernameDisplay = useRecoilValue<boolean>(store.UsernameDisplay);
  const convoType = useRecoilValue(store.convoType);
  const { user } = useAuthContext();
  const localize = useLocalize();

  const {
    ask,
    icon,
    edit,
    isLast,
    enterEdit,
    handleScroll,
    conversation,
    isSubmitting,
    latestMessage,
    handleContinue,
    copyToClipboard,
    regenerateMessage,
    isImage,
    downloadImage,
    copyDisabled,
  } = useMessageHelpers(props);

  // useEffect(() => {
  //   if (user && user.username !== 'guest-user') {
  //     localStorage.removeItem('prevUrl');
  //   }
  // }, [user]);

  const { message, siblingIdx, siblingCount, setSiblingIdx, currentEditId, setCurrentEditId } =
    props;

  if (!message) {
    return null;
  }

  const { text, children, messageId = null, isCreatedByUser, error, unfinished } = message ?? {};

  let messageLabel = '',
    userAvatar = '';
  if (isCreatedByUser && convoType === 'c') {
    messageLabel = UsernameDisplay ? user?.name : localize('com_user_message');
  } else if (convoType === 'c') {
    messageLabel = message.sender;
  }

  if (convoType === 'r' && isCreatedByUser) {
    if (message.user) {
      if (typeof message.user === 'string') {
        let messageOwner;
        if (conversation && conversation.user && conversation.users) {
          if (conversation?.user._id === message.user) {
            messageOwner = conversation.user;
          }
          if (conversation.users.map((i) => i._id).indexOf(message.user) > -1) {
            messageOwner = conversation?.users.filter((i) => i._id === message.user)[0];
          }
          if (messageOwner) {
            messageLabel = messageOwner.name;
            userAvatar = messageOwner.avatar;
          }
        }
      } else {
        messageLabel = message.user.name;
        userAvatar = message.user.avatar;
      }

      if (message.sender === 'Tip Bot' || message.sender === 'Karma Bot') {
        messageLabel = message.sender;
      }
    } else {
      messageLabel = user?.name as string;
      userAvatar = user?.avatar as string;
    }
  }

  return (
    <>
      <div
        className="text-token-text-primary w-full border-0 bg-transparent dark:border-0 dark:bg-transparent"
        onWheel={handleScroll}
        onTouchMove={handleScroll}
      >
        <div className="m-auto justify-center p-4 py-2 text-base md:gap-6 ">
          <div className="final-completion group mx-auto flex flex-1 gap-3 text-base md:max-w-3xl md:px-5 lg:max-w-[40rem] lg:px-1 xl:max-w-[48rem] xl:px-5">
            <div className="relative flex flex-shrink-0 flex-col items-end">
              <div>
                {message.sender === 'Tip Bot' ? (
                  <div className="relative pt-0.5">
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                      <img src="/assets/tipbot.png" />
                    </div>
                  </div>
                ) : message.sender === 'Karma Bot' ? (
                  <div className="relative pt-0.5">
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                      <img src="/assets/karmabot.png" />
                    </div>
                  </div>
                ) : (
                  <div className="relative pt-0.5">
                    {isPremiumUser(user as TUser) && (
                      <img
                        src="/assets/premium.png"
                        alt="premium"
                        className="absolute -right-1 -top-1 h-4 w-4"
                      />
                    )}
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                      {userAvatar ? (
                        <img src={userAvatar} />
                      ) : typeof icon === 'string' && /[^\\x00-\\x7F]+/.test(icon as string) ? (
                        <span className=" direction-rtl w-40 overflow-x-scroll">{icon}</span>
                      ) : (
                        icon
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className={cn('relative flex w-11/12 flex-col', isCreatedByUser ? '' : 'agent-turn')}
            >
              <div className="select-none font-semibold">
                {messageLabel}{' '}
                {message.sender === 'User' && (
                  <i className="text-xs font-thin text-gray-600">
                    {message.user?.karma ?? 0} karma
                  </i>
                )}
              </div>
              <div className="flex-col gap-1 md:gap-3">
                <div className="flex max-w-full flex-grow flex-col gap-0">
                  {/* Legacy Plugins */}
                  {message?.plugin && <Plugin plugin={message?.plugin} />}
                  <MessageContent
                    ask={ask}
                    edit={edit}
                    isLast={isLast}
                    text={text ?? ''}
                    message={message}
                    enterEdit={enterEdit}
                    error={!!error}
                    isSubmitting={isSubmitting}
                    unfinished={unfinished ?? false}
                    isCreatedByUser={isCreatedByUser ?? true}
                    siblingIdx={siblingIdx ?? 0}
                    setSiblingIdx={
                      setSiblingIdx ??
                      (() => {
                        return;
                      })
                    }
                  />
                </div>
              </div>
              {isLast && isSubmitting ? null : (
                <SubRow classes="text-xs">
                  <SiblingSwitch
                    siblingIdx={siblingIdx}
                    siblingCount={siblingCount}
                    setSiblingIdx={setSiblingIdx}
                  />
                  {message.sender !== 'Tip Bot' && message.sender !== 'Karma Bot' && (
                    <HoverButtons
                      isEditing={edit}
                      message={message}
                      enterEdit={enterEdit}
                      isSubmitting={isSubmitting}
                      conversation={conversation ?? null}
                      regenerate={() => regenerateMessage()}
                      copyToClipboard={copyToClipboard}
                      handleContinue={handleContinue}
                      latestMessage={latestMessage}
                      isLast={isLast}
                      isImage={isImage}
                      downloadImage={downloadImage}
                      copyDisabled={copyDisabled}
                    />
                  )}
                </SubRow>
              )}
            </div>
          </div>
        </div>
      </div>
      <MultiMessage
        key={messageId}
        messageId={messageId}
        conversation={conversation}
        messagesTree={children ?? []}
        currentEditId={currentEditId}
        setCurrentEditId={setCurrentEditId}
      />
    </>
  );
}
