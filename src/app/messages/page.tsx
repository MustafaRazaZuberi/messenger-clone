"use client";
import ChatRoom from "@/customComponents/web/ChatRoom";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const page = () => {
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  if (!roomDetails?.id) {
    return (
      <main className="flex justify-center items-center min-w-full">
        <h1 className=" text-2xl font-extrabold tracking-tight lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          No Chats Selected
        </h1>
      </main>
    );
  }

  return (
    <section className="w-full min-h-full">
      <ChatRoom />
    </section>
  );
};

export default page;
