import {Customer} from "../model/Customer.ts";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initialState : Customer[] = [];

const api = axios.create({
    baseURL : "http://localhost:3002/customer"
})

export const saveCustomer = createAsyncThunk(
    'customer/saveCustomer',
    async (customer: Customer) => {
        try {
            const response = await api.post('/add', customer);
            return response.data;
        } catch (error) {
            return console.log('error',error)
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async (id : string) =>{
        try{
            const response = await api.delete(`/delete/${id}`);
            return response.data;
        }catch(err){
            console.log(err);
        }
    }
)

export const updateCustomer  = createAsyncThunk(
    'customer/updateCustomer',
    async (customer : Customer) =>{
        try{
            const response = await api.put(`/update/${customer.id}`,customer);
            return response.data;
        }catch(err){
            console.log(err);
        }
    }
)

export const getCustomers = createAsyncThunk(
    'customer/getCustomers',
    async ()=>{
        try{
            const response = await api.get('/view');
            return response.data;
        }catch(err){
            console.log(err);
        }
    }
)

const customerSlice = createSlice({
    name : 'customer',
    initialState,
    reducers: {
        addCustomer(state, action: PayloadAction<Customer>) {
            state.push(action.payload);
        },

        updatedCustomer(state, action: PayloadAction<Customer>) {
            const index = state.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) state[index] = action.payload;
        },

        deletedCustomer(state, action: PayloadAction<string>) {
            return state.filter((c) => c.id !== action.payload);
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(saveCustomer.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(saveCustomer.rejected, (_, action) => {
                console.error("Failed to save customer:", action.payload);
            })
            .addCase(saveCustomer.pending, (state, action) => {
                console.error("Pending");
            });

        builder
            .addCase(deleteCustomer.rejected, (_, action) => {
                console.error("Failed to delete customer:", action.payload);
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                return state = state.filter((customer:Customer)=> customer.id !== action.payload);
            })
            .addCase(deleteCustomer.pending, (_, action) => {
                console.log("Pending delete customer",action.payload);
            });

        builder
            .addCase(updateCustomer.rejected, (_, action) => {
                console.error("Failed to update customer:", action.payload);
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const customer = state.find((customer:Customer) => customer.id === action.payload.id);
                if (customer) {
                    customer.name = action.payload.name;
                    customer.nic = action.payload.nic;
                    customer.phone = action.payload.phone;
                }
            })
            .addCase(updateCustomer.pending, (_, action) => {
                console.log("Pending update customer:", action.payload);
            });

        builder
            .addCase(getCustomers.fulfilled, (_, action) => {
                return action.payload;
            })
            .addCase(getCustomers.pending, (_, action) => {
                console.log("Pending get customer:", action.payload);
            })
            .addCase(getCustomers.rejected, (_, action) => {
                console.error("Failed to get customers:", action.payload);
            })

    }
});

export const {addCustomer,updatedCustomer,deletedCustomer}  = customerSlice.actions;
export default customerSlice.reducer;
