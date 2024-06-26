import React, { useEffect, useState } from 'react';
import { SearchOptions, TConversation, request } from 'librechat-data-provider';
import Room from './Room';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useSearchInfiniteQuery } from '~/data-provider';
import store from '~/store';

export default function Rooms({
  toggleNav,
  moveToTop,
}: {
  moveToTop: () => void;
  toggleNav: () => void;
}) {
  const [rooms, setRooms] = useRecoilState(store.rooms);
  const searchQuery = useRecoilValue(store.searchQuery);
  const roomSearchIndex = useRecoilValue(store.roomSearchIndex);
  const [searchOptions ] = useRecoilState<SearchOptions>(store.searchOptions);

  const searchQueryRes = useSearchInfiniteQuery(
    { pageNumber: '1', searchQuery: searchQuery.text, roomIndex: roomSearchIndex, searchOptions: searchOptions },
    { enabled: true },
  );

  const [searchResult, setSearchResult] = useState<TConversation[]>([]);

  useEffect(() => {
    request
      .get('/api/rooms/query')
      .then((res: unknown) => setRooms(res as TConversation[]))
      .catch((error) => console.error(error));
  }, [setRooms]);

  useEffect(() => {
    if (searchOptions.sort === 'participants-desc') {
      setSearchResult(
        searchQueryRes.data?.pages[0].conversations
          .map((obj) => (!obj.users ? { ...obj, users: [] } : obj))
          .sort((a, b) => (a.users?.length ?? 0) - (b.users?.length ?? 0)) ?? [],
      );
    } else if (searchOptions.sort === 'participants-asc') {
      setSearchResult(
        searchQueryRes.data?.pages[0].conversations
          .map((obj) => (!obj.users ? { ...obj, users: [] } : obj))
          .sort((a, b) => (b.users?.length ?? 0) - (a.users?.length ?? 0)) ?? [],
      );
    } else {
      setSearchResult(
        searchQueryRes.data?.pages[0].conversations ?? []);
    }
  }, [searchQueryRes.data?.pages, setSearchResult]);

  return (
    <div className="text-token-text-primary flex flex-col gap-2 pb-2 text-sm">
      <div>
        <div>
          <span>
            {!searchQuery &&
              rooms.map((room) => (
                <Room
                  key={`${room.conversationId}-${room}`}
                  // isLatestConvo={room.conversationId === firstTodayConvoId}
                  room={room}
                  retainView={moveToTop}
                  toggleNav={toggleNav}
                />
              ))}
            {searchQuery &&
              searchResult &&
              searchResult.map((room) => (
                <Room
                  key={`${room.conversationId}-${room}`}
                  // isLatestConvo={room.conversationId === firstTodayConvoId}
                  room={room}
                  retainView={moveToTop}
                  toggleNav={toggleNav}
                />
              ))}
          </span>
        </div>
      </div>
    </div>
  );
}
