import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    productId: 0,
    productName: "",
    description: "sebuah jam mahal",
    price: 400000,
    categoryId: 1,
    userName: "Michael",
    city: "Madura",
    photoProfile: "./images/avatar_seller.png",
    productImages: ["./images/watch_big.png"],
    realProductImages: [],
    hasPreview: false,
};

const previewSlice = createSlice({
    name: "preview",
    initialState,
    reducers: {
        setPreviewProduct: (state, { payload }) => {
            // console.log(payload);
            state.productId = payload.productId;
            state.productName = payload.productName;
            state.description = payload.description;
            state.price = payload.price;
            state.categoryId = payload.categoryId;
            state.userName = payload.userName;
            state.city = payload.city;
            state.photoProfile = payload.photoProfile;
            state.productImages = payload.productImages;
            state.realProductImages = payload.realProductImages;
            state.hasPreview = true;
        },
    },
    extraReducers: {},
});

export const { setPreviewProduct } = previewSlice.actions;

export default previewSlice.reducer;
