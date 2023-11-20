import { RootState } from "@/store";
import Image from "next/image";
import { useMemo } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BsFillCameraVideoFill } from "react-icons/bs";
import useVideoCall from "@/hooks/useVideoCall";

const VideoCall = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);
  const { handleOnVideoCall, videoCallDialog, handleVideoCallHangup } =
    useVideoCall();
  return (
    <main>
      <AlertDialog>
        <AlertDialogTrigger>
          <BsFillCameraVideoFill className="text-2xl cursor-pointer text-gray-700 dark:text-gray-300" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Connect with {chatWith?.displayName} via video call?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleOnVideoCall}
              className="flex flex-row gap-x-2 "
            >
              <BsFillCameraVideoFill className="text-xl" />
              <span>Connect</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {videoCallDialog ? (
        <Dialog open={videoCallDialog?.open}>
          <DialogContent hideCrossBtn={true}>
            <section className="lg:max-w-[475px] md:max-w-[475px] max-w-[260px]">
              <section className="px-6 flex flex-col justify-between items-center gap-y-4 min-h-[80vh]">
                <section className="flex flex-col gap-y-3 flex-1 w-full justify-center items-center">
                  {videoCallDialog.callTo.photoUrl ? (
                    <Image
                      src={videoCallDialog.callTo.photoUrl!}
                      alt="Profile Info Profile Picture"
                      width={100}
                      height={100}
                      className="w-40 h-40 rounded-full"
                    />
                  ) : (
                    <div
                      className={`w-40 h-40 rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
                    >
                      {videoCallDialog.callTo.displayName[0]}
                    </div>
                  )}
                  <section className="flex flex-col justify-center items-center">
                    <h3 className="text-gray-700 dark:text-gray-300 text-4xl font-extrabold">
                      {videoCallDialog.callTo.displayName}
                    </h3>
                    {videoCallDialog.callStatus === "connecting" ? (
                      <h6>Calling...</h6>
                    ) : (
                      <h6></h6>
                    )}
                  </section>
                </section>
                <Button
                  variant={"destructive"}
                  className="bg-red-700 py-1 w-full rounded-[2px] flex justify-center items-center cursor-pointer"
                  onClick={handleVideoCallHangup}
                >
                  <ImPhoneHangUp className="text-white text-3xl" />
                </Button>
              </section>
              {videoCallDialog.callStatus === "connecting" && (
                <audio
                  src="https://www.soundjay.com/phone/phone-calling-1.mp3"
                  autoPlay
                  loop
                />
              )}
            </section>
          </DialogContent>
        </Dialog>
      ) : null}
    </main>
  );
};

export default VideoCall;
