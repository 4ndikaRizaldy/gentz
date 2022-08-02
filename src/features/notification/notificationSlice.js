import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    notifications: [],
    isLoadingNotification: false,
    hasNewNotification: false,
};

export const getNotification = createAsyncThunk(
    "/api/v1/notification/get/user_id",
    async (payload, thunkAPI) => {
        const { id, accessToken } = thunkAPI.getState().user;
        let url = `${process.env.REACT_APP_BASE_URL}/api/v1/notification/get/${id}`;

        try {
            const resp = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = resp.data;
            // console.log(data);

            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            toast.dismiss();
            toast.error(message);
            console.log(message);
            return thunkAPI.rejectWithValue();
        }
    }
);
export const readNotification = createAsyncThunk(
    "api/v1/notification/read/notif_id",
    async (payload, thunkAPI) => {
        const { accessToken } = thunkAPI.getState().user;

        const url = `${process.env.REACT_APP_BASE_URL}/api/v1/notification/read/${payload.notifId}`;

        try {
            const resp = await axios.put(url, payload, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = { notifId: parseInt(payload.notifId) };
            // console.log(resp);

            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            toast.dismiss();
            toast.error(message);
            return thunkAPI.rejectWithValue();
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {},
    extraReducers: {
        [getNotification.pending]: (state) => {
            state.isLoadingNotification = true;
        },
        [getNotification.fulfilled]: (state, { payload }) => {
            state.notifications = payload;

            /* ======== check if there is notification that hasn't read ======== */
            const newNotification = payload.find(
                (notification) => notification.isRead === false
            );
            if (newNotification) state.hasNewNotification = true;

            state.isLoadingNotification = false;
        },
        [getNotification.rejected]: (state, action) => {
            state.isLoadingNotification = false;
        },
        [readNotification.pending]: (state) => {},
        [readNotification.fulfilled]: (state, { payload }) => {
            const updatedState = state.notifications.find(
                (notification) => notification.notifId === payload.notifId
            );
            updatedState.isRead = true;

            const newNotification = state.notifications.find(
                (notification) => notification.isRead === false
            );
            if (!newNotification) state.hasNewNotification = false;
        },
        [readNotification.rejected]: (state, action) => {},
    },
});

export default notificationSlice.reducer;
