import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./features/notification/notificationSlice";
import myOffersSlice from "./features/product/myOffersSlice";
import myProductSlice from "./features/product/myProductSlice";
import previewSlice from "./features/product/previewSlice";
import productSlice from "./features/product/productSlice";
import transactionProductSlice from "./features/product/transactionProductSlice";
import userSlice from "./features/user/userSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        product: productSlice,
        myProduct: myProductSlice,
        transactionProduct: transactionProductSlice,
        myOffers: myOffersSlice,
        notification: notificationSlice,
        preview: previewSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
