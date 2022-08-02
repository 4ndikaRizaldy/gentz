import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    products: [],
    isLoadingAllProducts: false,
};

export const getAllProducts = createAsyncThunk(
    "/api/v1/home",
    async (queryString, thunkAPI) => {
        let url = `${process.env.REACT_APP_BASE_URL}/api/v1/home${queryString}`;

        try {
            const { isAuthenticated } = thunkAPI.getState().user;
            let resp;

            if (isAuthenticated) {
                const { accessToken } = thunkAPI.getState().user;
                resp = await axios.get(url, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                resp = await axios.get(url);
            }
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
export const addProduct = createAsyncThunk(
    "api/v1/product/add",
    async (payload, thunkAPI) => {
        const { accessToken } = thunkAPI.getState().user;

        console.log(payload);

        const url = `${process.env.REACT_APP_BASE_URL}/api/v1/products/add`;
        console.log(url);
        try {
            const resp = await axios.post(url, payload, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = resp.data.data;
            console.log(data);

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
export const updateProduct = createAsyncThunk(
    "api/v1/products/update",
    async (payload, thunkAPI) => {
        const { accessToken } = thunkAPI.getState().user;

        // for (const pair of payload.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }

        const url = `${process.env.REACT_APP_BASE_URL}/api/v1/products/update`;

        try {
            const resp = await axios.put(url, payload, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = resp.data.data;
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

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: {
        [getAllProducts.pending]: (state) => {
            state.isLoadingAllProducts = true;
        },
        [getAllProducts.fulfilled]: (state, { payload }) => {
            const { totalProducts, totalPages, currentPage, products } =
                payload;
            state.totalPages = totalPages;
            state.totalProducts = totalProducts;
            state.currentPage = currentPage;
            state.products = products;
            state.isLoadingAllProducts = false;
        },
        [getAllProducts.rejected]: (state, action) => {
            state.isLoadingAllProducts = false;
        },
        [addProduct.pending]: (state) => {},
        [addProduct.fulfilled]: (state, { payload }) => {
            // console.log(payload);
        },
        [addProduct.rejected]: (state, action) => {},
    },
});

export default productSlice.reducer;
