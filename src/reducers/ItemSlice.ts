import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Item} from "../model/Item.ts";
import axios from "axios";
import {getCustomers} from "./CustomerSlice.ts";

export const initialState: Item[] = [];

const api = axios.create({
    baseURL: "http://localhost:3002/item",
})

export const saveItem = createAsyncThunk(
    'item/saveItem',
    async (item:Item) => {
        try {
            const response = await api.post('/add',item);
            return response.data;
        }catch (error) {
            return console.log('error',error)
        }
    }
)

export const deleteItem = createAsyncThunk(
    'item/deleteItem',
    async (code : string ) => {
        try {
            const response = await api.delete(`/delete/${code}`);
            return response.data;
        }catch (error) {
            return console.log('error',error)
        }
    }
)

export const updateItem = createAsyncThunk(
    'item/updateItem',
    async (item:Item) => {
        try {
            const response = await api.put(`/update/${item.code}`,item);
            return response.data;
        }catch (error) {
            return console.log('error',error)
        }
    }
)

export const getItems = createAsyncThunk(
    'item/getItems',
    async () => {
        try {
            const response = await api.get('/view');
            return response.data;
        }catch (error) {
            return console.log('error',error)
        }
    }
)

const itemSlice = createSlice({
    name : 'item',
    initialState,
    reducers: {
        addItem(state,action:PayloadAction<Item>) {
            state.push(action.payload);
        },

        updatedItem(state, action: PayloadAction<Item>) {
            const index = state.findIndex((i) => i.code === action.payload.code);
            if (index !== -1) state[index] = action.payload;
        },

        deletedItem(state, action: PayloadAction<string>) {
            return state.filter((i) => i.code !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveItem.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(saveItem.rejected, (_, action) => {
                console.error("Failed to save item:", action.payload);
            })
            .addCase(saveItem.pending, (state, action) => {
                console.error("Pending");
            });

        builder
            .addCase(deleteItem.fulfilled, (state, action) => {
                return state = state.filter((item:Item) => item.code !== action.payload);
            })
            .addCase(deleteItem.rejected, (_, action) => {
                console.error("Failed to delete item:", action.payload);
            })
            .addCase(deleteItem.pending, (_, action) => {
                console.error("Pending delete customer",action.payload);
            })

        builder
            .addCase(updateItem.fulfilled,(state,action) => {
                const item = state.find((item:Item) => item.code === action.payload);
                if (item) {
                    item.itemName = action.payload.itemName;
                    item.quantity = action.payload.quantity;
                    item.price = action.payload.price;
                }
            })
            .addCase(updateItem.rejected, (_, action) => {
                console.error("Failed to update item:", action.payload);
            })
            .addCase(updateItem.pending, (_, action) => {
                console.error("Pending update item:", action.payload);
            })

        builder
            .addCase(getItems.fulfilled,(_,action) => {
                return action.payload;
            })
            .addCase(getItems.rejected, (_, action) => {
                console.error("Failed to get items:", action.payload);
            })
            .addCase(getCustomers.pending, (_, action) => {
                console.log("Pending get items:", action.payload);
            })

    }
});

export default itemSlice.reducer;