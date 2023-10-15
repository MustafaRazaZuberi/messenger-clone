import { createSlice } from "@reduxjs/toolkit";
import { CHATREQUESTS_INITIAL_STATE } from "../intialState";
import { ChatRequestsState } from "@/types/types.state";

const chatRequestsSlice = createSlice({
  name: "chatRequests",
  initialState: CHATREQUESTS_INITIAL_STATE,
  reducers: {
    setChatRequests: (state, action: { payload: ChatRequestsState }) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setChatRequests } = chatRequestsSlice.actions;
export default chatRequestsSlice.reducer;
