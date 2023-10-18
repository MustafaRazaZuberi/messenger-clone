"use client";

import { useEffect } from "react";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";
import ChatUsers from "./ChatUsers";
import useHome from "@/hooks/useHome";
import { useSearchParams } from "next/navigation";
import Requests from "./Requests";
import useReq from "@/hooks/useReq";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ChatsBox = () => {
  const params = useSearchParams();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { getAllUsers, getMyFriends, handleAuthStateChange } = useHome();
  const { getChatRequests, getSentRequests, getReceivedRequests } = useReq();

  useEffect(() => {
    if (!currentUser.uid) return;
    handleAuthStateChange();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (!currentUser.uid) return;
    getMyFriends();
    getChatRequests();
    getSentRequests();
    getReceivedRequests();
  }, []);

  const findFriendsTab = params.get("tab") === "findFriends" ? true : false;
  const requestsTab = params.get("tab") === "requests" ? true : false;

  return (
    <main className="sm:w-[350px] w-full border-r min-h-[90vh]">
      {findFriendsTab ? (
        <FindFriends />
      ) : requestsTab ? (
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
