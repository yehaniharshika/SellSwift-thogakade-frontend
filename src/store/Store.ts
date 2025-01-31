import { configureStore } from "@reduxjs/toolkit";
import CustomerSlice from "../reducers/CustomerSlice.ts";
import ItemSlice from "../reducers/ItemSlice.ts";


const store = configureStore({
    reducer: {
        customers: CustomerSlice,
        items: ItemSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
