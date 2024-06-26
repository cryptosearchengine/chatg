import { forwardRef, useState, useCallback, useMemo, Ref } from 'react';
import { Search, X } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import debounce from 'lodash/debounce';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import store from '~/store';
import { SearchOptions } from '~/store/conversation';

type SearchBarProps = {
  clearSearch: () => void;
};

const SearchBar = forwardRef((props: SearchBarProps, ref: Ref<HTMLDivElement>) => {
  const convoType = useRecoilValue(store.convoType);
  const roomSearchIndex = useRecoilValue<'user' | 'all'>(store.roomSearchIndex);
  const searchOptions = useRecoilValue<SearchOptions>(store.searchOptions);
  const { clearSearch } = props;
  const setSearchQuery = useSetRecoilState(store.searchQuery);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [text, setText] = useState('');
  const localize = useLocalize();

  const clearText = useCallback(() => {
    setShowClearIcon(false);
    setSearchQuery({
      text: '',
      category: roomSearchIndex as 'user' | 'all',
      searchOptions,
    });
    clearSearch();
    setText('');
  }, [setSearchQuery, clearSearch, roomSearchIndex, searchOptions]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Backspace' && value === '') {
      clearText();
    }
  };

  const sendRequest = useCallback((value: string) => setSearchQuery({
    text: value,
    category: roomSearchIndex as 'user' | 'all',
    searchOptions,
  }), [setSearchQuery, roomSearchIndex, searchOptions]);

  const debouncedSendRequest = useMemo(() => debounce(sendRequest, 350), [sendRequest]);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setShowClearIcon(value.length > 0);
    setText(value);
    debouncedSendRequest(value);
  };

  return (
    <div
      ref={ref}
      className="relative mt-1 flex h-10 cursor-pointer items-center gap-3 rounded-lg border-white bg-gray-50 px-3 py-2 text-black transition-colors duration-200 hover:bg-gray-200 focus:bg-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
    >
      {<Search className="absolute left-3 h-4 w-4" />}
      <input
        type="text"
        className="m-0 mr-0 w-full border-none bg-transparent p-0 pl-7 text-sm leading-tight outline-none"
        value={text}
        onChange={onChange}
        onKeyDown={(e) => {
          e.code === 'Space' ? e.stopPropagation() : null;
        }}
        placeholder={convoType === 'c' ? localize('com_nav_search_placeholder') : 'Search Rooms'}
        onKeyUp={handleKeyUp}
      />
      <X
        className={cn(
          'absolute right-[7px] h-5 w-5 cursor-pointer transition-opacity duration-1000',
          showClearIcon ? 'opacity-100' : 'opacity-0',
        )}
        onClick={clearText}
      />
    </div>
  );
});

export default SearchBar;
