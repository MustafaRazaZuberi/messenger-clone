import {
  FriendsState,
  ChatRequestsState,
  UsersState,
  Room,
  Rooms,
  RoomState,
} from "@/types/types.state";
import User from "@/types/types.user";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

export const USER_INITIAL_STATE: User = {
  email: "",
  uid: "",
  displayName: "",
  emailVerified: false,
  gender: "",
  photoUrl: "",
};

export const USERS_INITIAL_STATE: UsersState = {
  status: STATUSES.LOADING,
  data: [],
};

export const FRIENDS_INITIAL_STATE: FriendsState = {
  status: STATUSES.LOADING,
  data: [],
};

export const CHATREQUESTS_INITIAL_STATE: ChatRequestsState = {
  requests: { status: STATUSES.LOADING, data: [] },
  sentRequests: { status: STATUSES.LOADING, data: [] },
  receivedRequests: { status: STATUSES.LOADING, data: [] },
};

export const NOTIFICATIONS_INITIAL_STATE = {
  status: STATUSES.LOADING,
  data: [],
};

export const ROOM_INITIAL_STATE: RoomState = {
  activeRoom: {
    id: "",
    status: STATUSES.LOADING,
    messages: [],
    lastMessage: { id: "", date: Date.now(), img: "", senderId: "", text: "" },
  },
  allRooms: {},
  chatWih: null,
};
