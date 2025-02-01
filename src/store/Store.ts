import { configureStore } from "@reduxjs/toolkit";
import CustomerSlice from "../reducers/CustomerSlice.ts";
import ItemSlice from "../reducers/ItemSlice.ts";
import OrderSlice from "../reducers/OrderSlice.ts";


const store = configureStore({
    reducer: {
        customers: CustomerSlice,
        items: ItemSlice,
        orders: OrderSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
