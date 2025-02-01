import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Order } from "../model/Order";

export const initialState: Order[] = [];

const api = axios.create({
    baseURL: "http://localhost:3002/order",
});

export const createOrder = createAsyncThunk(
    'order/saveOrder',
    async (orderData: Order) => {
        try {
            const response = await api.post('/create', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        createdOrder(state, action: PayloadAction<Order>) {
            state.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(createOrder.rejected, (_, action) => {
                console.error("Failed to create order:", action.error);
            })
            .addCase(createOrder.pending, () => {
                console.log("Pending create order");
            });
    }
});

export const { createdOrder } = orderSlice.actions;
export default orderSlice.reducer;