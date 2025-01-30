import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store.ts";
import { deleteCustomer, getCustomers, saveCustomer, updateCustomer } from "../reducers/CustomerSlice.ts";
import { Customer } from "../model/Customer.ts";
import {Trash2} from "react-feather";

function CustomerPage() {
    const dispatch = useDispatch<AppDispatch>();
    const customers = useSelector((state: RootState) => state.customers);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [nic, setNic] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    const handleAdd = () => {
        if (!id || !name || !nic || !email || !phone) {
            alert("All fields are required!");
            return;
        }
        const newCustomer = { id, name, nic, email, phone };
        dispatch(saveCustomer(newCustomer));
        resetForm();
    };

    const handleEdit = (customer: Customer) => {
        setId(customer.id);
        setName(customer.name);
        setNic(customer.nic);
        setEmail(customer.email);
        setPhone(customer.phone);
        setIsEditing(true);
    };

    const handleUpdate = () => {
        if (!id || !name || !nic || !email || !phone) {
            alert("All fields are required!");
            return;
        }
        const updatedCustomer = { id, name, nic, email, phone };
        dispatch(updateCustomer(updatedCustomer));
        resetForm();
    };

    const handleDelete = (customerId: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            dispatch(deleteCustomer(customerId));
        }
    };

    const resetForm = () => {
        setId("");
        setName("");
        setNic("");
        setEmail("");
        setPhone("");
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} className="border p-2 rounded" />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
                <input type="text" placeholder="NIC" value={nic} onChange={(e) => setNic(e.target.value)} className="border p-2 rounded" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" />
            </div>
            <div className="flex justify-end">
                {isEditing ? (
                    <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mr-2">
                        Update
                    </button>
                ) : (
                    <button onClick={handleAdd} className="bg-green-500 text-white p-2 rounded mr-2">
                        Add
                    </button>
                )}
                {isEditing && (
                    <button onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">
                        Cancel
                    </button>
                )}
            </div>
            <table className="min-w-full table-auto border-collapse mt-6">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">NIC</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Phone</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id} onClick={() => handleEdit(customer)} className="hover:cursor-pointer hover:bg-slate-600 hover:text-white">
                        <td className="border px-4 py-2">{customer.id}</td>
                        <td className="border px-4 py-2">{customer.name}</td>
                        <td className="border px-4 py-2">{customer.nic}</td>
                        <td className="border px-4 py-2">{customer.email}</td>
                        <td className="border px-4 py-2">{customer.phone}</td>
                        <td className="border px-4 py-2 text-center">
                            <button onClick={() => handleDelete(customer.id)} className="bg-red-500 text-white p-2 rounded-lg">
                                <Trash2 />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerPage;
