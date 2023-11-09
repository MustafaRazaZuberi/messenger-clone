"use client";
import { Toaster } from "@/components/ui/toaster";
import ChatsBox from "@/customComponents/web/ChatsBox";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const roomId = roomDetails?.id;
  return (
    <section className="flex flex-row flex-1 w-full max-h-[89vh] min-h-[89vh]">
      <section
        className={`sm:min-w-[30%] sm:flex ${
          !roomId ? "flex" : "hidden"
        } min-w-full sm:max-w-[400px] max-w-full min-h-full`}
      >
        <ChatsBox />
      </section>
      <section className="flex flex-1 w-full">{children}</section>
      <Toaster />
    </section>
  );
}
