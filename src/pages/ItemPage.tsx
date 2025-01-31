import {useEffect, useState} from "react"
import { Trash2 } from "react-feather"
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.ts";
import {deleteItem, getItems, saveItem, updateItem} from "../reducers/ItemSlice.ts";
import {Item} from "../model/Item.ts";

function ItemPage() {
   const dispatch = useDispatch<AppDispatch>();
   const items = useSelector((state: RootState) => state.items);

    const [code, setCode] = useState("");
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(getItems());
    },[dispatch]);

    const handleAdd = () => {
        if (!code || !itemName || !quantity || !price) {
            alert("All fields are required!")
            return;
        }

        const newItem = {code,itemName,quantity,price};
        dispatch(saveItem(newItem));
        resetForm();
    }

    const handleEdit = (item: Item) => {
        setCode(item.code);
        setItemName(item.itemName);
        setQuantity(item.quantity);
        setPrice(item.price);
        setIsEditing(true);
    }

    const handleUpdate = () => {
        if (!code || !itemName || !quantity || !price) {
            alert("All fields are required!")
            return;
        }

        const updatedItem = {code,itemName,quantity,price};
        dispatch(updateItem(updatedItem));
        resetForm();
    }

    const handleDelete = (code: string) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteItem(code));
        }
    }

    const resetForm = () => {
        setCode("");
        setItemName("");
        setQuantity("");
        setPrice("");
        setIsEditing(false);
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    name="item_id"
                    placeholder="Item ID"
                    value={code ?? ""}
                    onChange={(e) => setCode(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 rounded"
                />
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
                    <th className="border px-4 py-2">Item code</th>
                    <th className="border px-4 py-2">Item Name</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={item.code || `item-${index}`} onClick={() => handleEdit(item)} className="hover:cursor-pointer hover:bg-slate-600 hover:text-white">
                        <td className="border px-4 py-2">{item.code}</td>
                        <td className="border px-4 py-2">{item.itemName}</td>
                        <td className="border px-4 py-2">{item.quantity}</td>
                        <td className="border px-4 py-2">{item.price}</td>
                        <td className="border px-4 py-2 text-center">
                            <button
                                onClick={() => handleDelete(item.code)}
                                className="bg-red-500 text-white p-2 rounded-lg">
                                <Trash2 />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ItemPage
