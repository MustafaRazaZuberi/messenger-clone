import { useSelector } from "react-redux";
import { RootState } from "@/store";
import getFormattedTime from "@/services/getFormattedTime";
import Message from "@/types/types.message";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Message = ({ msg }: { msg: Message }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const byMe = msg.senderId === currentUser.uid ? true : false;

  return (
    <section
      className={`w-full flex items-center ${
        byMe ? "justify-end" : "justify-start"
      }`}
    >
      <section
        className={`${
          byMe ? "bg-[#005c4b]" : "bg-[#1e293b]"
        } max-w-[70%] px-2 py-2 rounded-[6px] rounded-tr-none`}
      >
        {msg.text && (
          <section className="flex flex-row justify-between gap-x-3">
            <section className="text-[15px] font-extralight">
              {msg.text}
            </section>
            <section className="flex flex-row justify-between items-end gap-x-1">
              <section className="text-[9px] font-extralight flex items-end">
                {getFormattedTime(msg.date)}
              </section>
              {byMe && (
                <section className="relative mb-1">
                  <TwoCheck seen={msg.seen} />
                </section>
              )}
            </section>
          </section>
        )}

        {msg.img && (
          <section className="relative">
            <Image
              src={msg.img}
              width={100}
              height={100}
              alt="Chat room image"
              className="w-96 h-96 blur-[2px]"
            />
            <Button className="absolute top-40 text-black left-32 bg-gray-300">
              Open Image
            </Button>
          </section>
        )}
      </section>
    </section>
  );
};

export default Message;

const TwoCheck = ({ seen }: { seen: boolean }) => {
  return (
    <section className="flex flex-col justify-end items-end">
      <IoCheckmarkDoneSharp
        className={`${
          seen ? "text-[#2c90a0]" : "text-gray-300"
        } relative font-extrabold top-1`}
      />
    </section>
  );
};
