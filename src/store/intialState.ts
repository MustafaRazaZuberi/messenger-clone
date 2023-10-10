import User from "@/types/types.user";

export const USER_INITIAL_STATE: User = {
  email: "",
  uid: "",
  displayName: "",
  emailVerified: false,
  friends: [],
  gender: "",
  photoUrl: "",
};

export const USERS_INITIAL_STATE: User[] = [];
