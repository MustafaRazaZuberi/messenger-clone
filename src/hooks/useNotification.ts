import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { setNotifications } from "@/store/slice/notificationsSlice";
import { SendNotificationParam } from "@/types/types.miscellaneous";
import UserNotification from "@/types/types.notification";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Friend from "@/types/type.friend";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useChat from "./useChat";
  
const useNotification = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const notifications = useSelector((state: RootState) => state.notifications);
  const friends = useSelector((state: RootState) => state.friends);
  const { handleOnChatUser } = useChat();

  let unReadNotifications = notifications.data.filter(
    (notf: UserNotification) => !notf.isNotificationRead
  );

  const sendNotification = async ({ by, to, type }: SendNotificationParam) => {
    try {
      let message: string = "";
      if (type === "Request Received")
        message = `${by.displayName} has sent you a friend request.`;
      if (type === "Request Accepted")
        message = `${by.displayName} has accepted your friend request.`;

      const notificationObj: UserNotification = {
        isNotificationRead: false,
        isRequestRead: false,
        timestamp: Date.now(),
        type: type,
        notificationBy: by,
        message,
      };
      console.log("to.uid in sendNotification ---", to.uid);
      const notificationDocRef = collection(
        db,
        "users",
        to.uid,
        "notifications"
      );
      await addDoc(notificationDocRef, { ...notificationObj });
    } catch (error) {
      console.log("Error in sendNotification: ", error);
    }
  };

  const fetchNotifications = () => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "notifications"),
      (querySnapshot) => {
        let notifications: UserNotification[] = [];
        querySnapshot.forEach((doc) => {
          const notificationData = doc.data() as UserNotification;
          notifications.push({ ...notificationData, _id: doc.id });
        });
        // Sorting with time
        notifications = notifications.sort((a, b) => b.timestamp - a.timestamp);
        dispatch(
          setNotifications({ status: STATUSES.IDLE, data: [...notifications] })
        );
      }
    );
    return unsubscribe;
  };

  const handleNotificationDropdown = async (opened: boolean) => {
    if (!unReadNotifications.length || !opened) return;
    unReadNotifications.forEach(async (notificationRef: UserNotification) => {
      const washingtonRef = doc(
        db,
        "users",
        currentUser.uid,
        "notifications",
        notificationRef._id!
      );
      await updateDoc(washingtonRef, {
        isNotificationRead: true,
      });
    });
    unReadNotifications = [];
  };

  const handleOnNotification = (notification: UserNotification) => {
    const isFriend = friends.data.find(
      (friend: Friend) => friend.uid === notification.notificationBy.uid
    ); //This will give friend obj

    if (!isFriend && notification.type === "Request Received")
      router.push("?tab=requests");

    if (isFriend) handleOnChatUser(isFriend);
  };

  return {
    sendNotification,
    fetchNotifications,
    handleNotificationDropdown,
    handleOnNotification,
    unReadNotifications,
    notifications,
  };
};

export default useNotification;
