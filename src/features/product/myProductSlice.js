import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    myProducts: [],
    myInterestedProducts: [],
    mySoldProducts: [],
    isLoadingMyProducts: false,
};

export const getMyProducts = createAsyncThunk(
    "/api/v1/products/show/user_id",
    async (payload, thunkAPI) => {
        const { id, accessToken } = thunkAPI.getState().user;
        let url = `${process.env.REACT_APP_BASE_URL}/api/v1/products/show/${id}`;

        try {
            const resp = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const { data } = resp.data;
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
            return thunkAPI.rejectWithValue();
        }
    }
);
export const getMyInterestedProducts = createAsyncThunk(
    "/api/v1/offers/seller/interested/user_id",
    async (payload, thunkAPI) => {
        const { id, accessToken } = thunkAPI.getState().user;
        let url = `${process.env.REACT_APP_BASE_URL}/api/v1/offers/seller/interested/${id}`;

        try {
            const resp = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const { data } = resp.data;
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
            return thunkAPI.rejectWithValue();
        }
    }
);
export const getMySoldProducts = createAsyncThunk(
    "/api/v1/products/sold/user_id",
    async (payload, thunkAPI) => {
        const { id, accessToken } = thunkAPI.getState().user;
        let url = `${process.env.REACT_APP_BASE_URL}/api/v1/products/sold/${id}`;

        try {
            const resp = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const { data } = resp.data;
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
            return thunkAPI.rejectWithValue();
        }
    }
);

const myProductSlice = createSlice({
    name: "myProduct",
    initialState,
    reducers: {},
    extraReducers: {
        [getMyProducts.pending]: (state) => {
            state.isLoadingMyProducts = true;
        },
        [getMyProducts.fulfilled]: (state, { payload }) => {
            // handle if there are no data do not make it as null
            if (payload) {
                state.myProducts = payload;
            }

            state.isLoadingMyProducts = false;
        },
        [getMyProducts.rejected]: (state, action) => {
            state.isLoadingMyProducts = false;
        },
        [getMyInterestedProducts.pending]: (state) => {
            state.isLoadingMyProducts = true;
        },
        [getMyInterestedProducts.fulfilled]: (state, { payload }) => {
            // handle if there are no data do not make it as null
            if (payload) {
                state.myInterestedProducts = payload;
            }

            state.isLoadingMyProducts = false;
        },
        [getMyInterestedProducts.rejected]: (state, action) => {
            state.isLoadingMyProducts = false;
        },
        [getMySoldProducts.pending]: (state) => {
            state.isLoadingMyProducts = true;
        },
        [getMySoldProducts.fulfilled]: (state, { payload }) => {
            // handle if there are no data do not make it as null
            if (payload) {
                state.mySoldProducts = payload;
            }

            state.isLoadingMyProducts = false;
        },
        [getMySoldProducts.rejected]: (state, action) => {
            state.isLoadingMyProducts = false;
        },
    },
});

export default myProductSlice.reducer;
