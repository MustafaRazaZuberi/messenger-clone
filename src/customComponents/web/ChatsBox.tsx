"use client";

import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import ChatsBoxNav from "./ChatsBoxNav";
import ChatUsers from "./ChatUsers";
import Requests from "./Requests";
import useHome from "@/hooks/useHome";
import useReq from "@/hooks/useReq";
import { RootState } from "@/store";
import FindFriendsSuspense from "./FindFriendsSuspense";

const FindFriends = React.lazy(() => import("./FindFriends"));

const ChatsBox = () => {
  const params = useSearchParams();
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const { getAllUsers, getMyFriends, handleAuthStateChange } = useHome();
  const { getChatRequests, getSentRequests, getReceivedRequests } = useReq();

  useEffect(() => {
    if (currentUser.uid) {
      handleAuthStateChange();
      getAllUsers();
      getMyFriends();
      getChatRequests();
      getSentRequests();
      getReceivedRequests();
    }
  }, [currentUser.uid]);

  const isFindFriendsTab = params.get("tab") === "findFriends";
  const isRequestsTab = params.get("tab") === "requests";

  return (
    <main className="sm:w-[350px] w-full border-r min-h-[90vh]">
      {isFindFriendsTab ? (
        <Suspense fallback={<FindFriendsSuspense />}>
          <FindFriends />
        </Suspense>
      ) : isRequestsTab ? (
        <Requests />
      ) : (
        <section>
          <ChatsBoxNav />
          <ChatUsers />
        </section>
      )}
    </main>
  );
};

export default ChatsBox;
