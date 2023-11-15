import { Button } from "@/components/ui/button";
import useReq from "@/hooks/useReq";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import UsersSkeleton from "./ChatUsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";
import TailwindSpinner from "./TailwindSpinner";
import { useTheme } from "next-themes";

const ReceivedRequests = () => {
  const receivedRequests = useSelector(
    (state: RootState) => state.chatRequests.receivedRequests
  );
  const { theme } = useTheme();
  const hover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-300";
  const { confirmChatRequest, loading } = useReq();

  return (
    <section className="mt-3 flex flex-col gap-y-4">
      {receivedRequests.data?.length && receivedRequests.status === "idle" ? (
        receivedRequests.data?.map((req) => (
          <section
            className={`flex flex-row justify-between items-center px-1 min-w-full cursor-pointer p-2 ${hover}`}
            key={req.id}
          >
            <section className="flex flex-row gap-x-3">
              <section>
                <UserImageAvatar user={req.sender} />
              </section>
              <section className="flex flex-col ">
                <h3>{req.sender.displayName}</h3>
                <h6 className="text-[12px]">{req.sender.email}</h6>
              </section>
            </section>
            <section>
              <Button
                className="px-3 h-8"
                onClick={() => confirmChatRequest(req)}
                disabled={loading}
              >
                Confirm
              </Button>
            </section>
          </section>
        ))
      ) : false && receivedRequests.status === "loading" ? (
        <UsersSkeleton skeletonLength={7} />
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            You have no requests to accept.
          </h1>
        </section>
      )}
    </section>
  );
};

export default ReceivedRequests;
