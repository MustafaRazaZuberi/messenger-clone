import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSelector } from "react-redux";
import { STATUSES } from "@/store/intialState";
import { ChatRequestsState, UsersState } from "@/types/types.state";
import { RootState } from "@/store";
import { BiArrowBack } from "react-icons/bi";
import useReq from "@/hooks/useReq";
import { Button } from "@/components/ui/button";
import getUnknownUsers from "@/services/getUnknownUsers";
import { useEffect, useState } from "react";
import User from "@/types/types.user";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import UserImageAvatar from "./UserImageAvatar";

const FindFriends = () => {
  const [unknownUsers, setUnknownUsers] = useState<User[]>([]);
  const { receivedRequests, sentRequests }: ChatRequestsState = useSelector(
    (state: RootState) => state.chatRequests
  );
  const myFriends = useSelector((state: RootState) => state.friends);
  const allUsers: UsersState = useSelector(
    (state: RootState) => state.allUsers
  );

  useEffect(() => {
    const unknowns = getUnknownUsers({
      allUsers: allUsers.data,
      friends: myFriends.data,
      receivedReqs: receivedRequests.data,
      sentReqs: sentRequests.data,
    });
    setUnknownUsers(unknowns);
  }, [myFriends.data, sentRequests.data, receivedRequests.data]);

  return (
    <section className="min-w-full flex flex-col items-center flex-1 max-h-full overflow-y-auto scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-w-3 scrollbar-track-inherit">
      {allUsers.status === STATUSES.IDLE ? (
        unknownUsers?.map((user) => {
          return <UnknownUser unknownUser={user} key={user.uid} />;
        })
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            No users are available on the website
          </h1>
        </section>
      )}
    </section>
  );
};

export default FindFriends;

export const FindFriendsNav = () => {
  const router = useRouter();
  return (
    <main className="flex flex-col gap-y-3 mt-2 p-2">
      <section className="flex flex-row gap-x-2 items-center w-full">
        <Link href={"/messages"}>
          <BiArrowBack className="cursor-pointer text-2xl" />
        </Link>
        <section className="flex flex-row justify-between w-full">
          <h3 className="text-2xl font-bold">Find Friends</h3>
          <section className="flex flex-row gap-x-2 items-center">
            <span
              className="text-[14px] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400"
              onClick={() => router.push("/messages/?tab=requests")}
            >
              Requests
            </span>
          </section>
        </section>
      </section>
      <section>
        <Input placeholder="Find Friends..." type="search" />
      </section>
    </main>
  );
};

const UnknownUser = ({ unknownUser }: { unknownUser: User }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { theme } = useTheme();
  const hover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-300";
  const { sendChatRequest, loading } = useReq();

  return (
    <section
      className={`flex flex-row justify-between border-b min-w-full py-4 pr-2 p-2 ${hover}`}
    >
      <section className="flex flex-row gap-x-3">
        <section>
          <UserImageAvatar user={unknownUser} />
        </section>
        <section className="flex flex-col">
          <h3>{unknownUser.displayName}</h3>
          <h6 className="text-[12px]">{unknownUser.email}</h6>
        </section>
      </section>
      <section>
        <Button
          className="px-3 h-8"
          onClick={() =>
            sendChatRequest({
              sender: currentUser,
              receiver: {
                displayName: unknownUser.displayName,
                email: unknownUser.email,
                emailVerified: unknownUser.emailVerified,
                uid: unknownUser.uid,
                gender: unknownUser.gender,
                photoUrl: unknownUser.photoUrl,
              },
            })
          }
          disabled={loading}
        >
          Add
        </Button>
      </section>
    </section>
  );
};
