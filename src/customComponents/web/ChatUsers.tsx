import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { useSelector } from "react-redux";
import Link from "next/link";
import React, { useEffect } from "react";
import UsersSkeleton from "./UsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";
import useChat from "@/hooks/useChat";
import Room from "@/types/types.room";
import Friend from "@/types/type.friend";
import { MdInsertPhoto } from "react-icons/md";
import Message from "@/types/types.message";
import { FaUserFriends } from "react-icons/fa";

const ChatUsers = () => {
  const friends = useSelector((state: RootState) => state.friends);
  const rooms = useSelector((state: RootState) => state.rooms);
  const {
    getFriendFromRoomUsers,
    getRoomsUnseenMessages,
    roomsUnseenMessages,
  } = useChat();

  useEffect(() => {
    if (rooms.length) getRoomsUnseenMessages();
  }, [rooms.length]);

  return (
    <section className="flex px-2 flex-col flex-1 max-h-full overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit">
      {rooms?.length ? (
        rooms?.map((room: Room) => {
          const friend: Friend | null = getFriendFromRoomUsers(room);
          if (!friend) return null; // Return null when no friend found
          return (
            <ChatUser
              friend={friend}
              room={room}
              roomsUnseenMessages={roomsUnseenMessages}
              key={room.id}
            />
          );
        })
      ) : friends.status === STATUSES.LOADING ? (
        <UsersSkeleton skeletonLength={10} />
      ) : (
        <NoFriendsToChat />
      )}
    </section>
  );
};

export default ChatUsers;

const NoFriendsToChat = () => {
  return (
    <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
      <h1 className="text-[19px] font-light">
        You have no friends to chat with.
      </h1>
      <Link href={`?tab=findFriends`}>
        <span className="text-[17px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          <Button>Find Friends</Button>
        </span>
      </Link>
    </section>
  );
};

const LastMessage: React.FC<{ message: Message }> = ({ message }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const msgByMe = message.senderId === currentUser.uid;
  const messageText = msgByMe ? `You: ${message.text}` : message.text;

  return (
    <section>
      <div className="text-gray-500 text-[13px]">
        {message.text &&
          messageText &&
          `${messageText.slice(0, 40)}${messageText.length > 40 ? "..." : ""}`}
        {message.img && (
          <div className="flex flex-row gap-x-1 items-center">
            Photo <MdInsertPhoto className="text-[17px]" />
          </div>
        )}
        {message.friend && (
          <div className="flex flex-row gap-x-1 items-center">
            {msgByMe ? "You: " : ""} Shared a Friend
            <FaUserFriends className="text-[17px]" />
          </div>
        )}
      </div>
    </section>
  );
};

export const LastActive: React.FC<{
  friend: Friend;
}> = ({ friend }) => {
  const activeUsers = useSelector((state: RootState) => state.activeUsers);
  const { getTimeDifference } = useChat();
  return (
    <section className="w-full">
      {activeUsers[friend.uid]?.isActive ? (
        <section className="flex flex-row gap-x-1">
          <span className="text-green-600 text-[12px]">Active</span>
          <section className="w-4 h-4 rounded-full bg-green-600"></section>
        </section>
      ) : (
        <section className="flex flex-row gap-x-1">
          <span className="text-gray-600 text-[12px]">
            Active {getTimeDifference(activeUsers[friend.uid]?.lastActive)} ago
          </span>
        </section>
      )}
    </section>
  );
};

type ChatUserProps = {
  friend: Friend;
  room: Room;
  roomsUnseenMessages: { [x: string]: Message[] };
};

const ChatUser: React.FC<ChatUserProps> = ({
  friend,
  room,
  roomsUnseenMessages,
}) => {
  const { handleOnChatUser } = useChat();
  return (
    <section
      className="flex flex-row justify-between border-b min-w-full cursor-pointer py-2 pr-2"
      onClick={() => handleOnChatUser(friend)}
    >
      <section className="flex flex-row gap-x-3 w-full items-center">
        <section>
          <UserImageAvatar user={friend} size={10} />
        </section>
        <section className="flex flex-col w-full">
          <section className="flex flex-row justify-between w-full">
            <section>
              <h3>{friend.displayName}</h3>
            </section>
            <section>
              <LastActive friend={friend} />
            </section>
          </section>
          <section>
            {room.lastMessage && !roomsUnseenMessages[room.id!]?.length ? (
              <LastMessage message={room.lastMessage} />
            ) : roomsUnseenMessages[room.id!]?.length ? (
              <section className="flex flex-row gap-x-1 items-center">
                <span className="w-2 h-2 rounded-full bg-blue-700" />
                <p className="text-gray-700 font-extrabold text-[13px]">
                  {`${roomsUnseenMessages[room.id!]?.length} new message${
                    roomsUnseenMessages[room.id!]?.length > 1 ? "s." : "."
                  }`}
                </p>
              </section>
            ) : null}
          </section>
        </section>
      </section>
    </section>
  );
};
