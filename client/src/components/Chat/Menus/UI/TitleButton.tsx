import { Trigger } from '@radix-ui/react-popover';
import { ArrowLeft } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import store from '~/store';

export default function TitleButton({ primaryText = '', secondaryText = '' }) {
  const convoType = useRecoilValue(store.convoType);
  return (
    <Trigger asChild>
      <div
        className="group flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2 text-lg font-medium hover:bg-gray-50 radix-state-open:bg-gray-50 dark:text-white dark:hover:bg-gray-700 dark:radix-state-open:bg-gray-700"
        // type="button"
      >
        <div>
          {primaryText}{' '}
          {!!secondaryText && <span className="text-token-text-secondary">{secondaryText}</span>}
        </div>
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          className="text-token-text-tertiary"
        >
          <path
            d="M11.3346 7.83203L8.00131 11.1654L4.66797 7.83203"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {convoType === 'r' && <p className='flex gap-1 items-center ml-3 text-gray-600 dark:text-gray-300 text-[15px]'><ArrowLeft size={20} /> Change Model Set</p>}
      </div>
    </Trigger>
  );
}
