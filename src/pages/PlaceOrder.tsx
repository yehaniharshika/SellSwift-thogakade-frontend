import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../reducers/CustomerSlice.ts";
import { getItems } from "../reducers/ItemSlice.ts";
import { AppDispatch, RootState } from "../store/Store.ts";
import { createOrder } from "../reducers/OrderSlice.ts";
import {jsPDF} from "jspdf";

function PlaceOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [getQty, setGetQty] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");

  // Fetch customers and items from Redux store
  const customers = useSelector((state: RootState) => state.customers);
  const items = useSelector((state: RootState) => state.items);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // format as YYYY-MM-DD
    setOrderDate(formattedDate);

    dispatch(getCustomers());
    dispatch(getItems());
    console.log("Fetching items...");
  }, [dispatch]);

  // Calculate total balance
  const calculateTotalBalance = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Handle item selection from dropdown
  const handleItemSelect = (code: string) => {
    if (!items || items.length === 0) {
      console.error("Items array is empty or not loaded yet.");
      return;
    }

    const item = items.find((item) => String(item.code) === String(code));

    if (!item) {
      console.error("Item not found for code:", code);
      return;
    }

    setSelectedItem(item);
    setGetQty(1);
    setTotalPrice(getQty * selectedItem.price);
  };

  // Handle quantity input change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Number(e.target.value);

    if (selectedItem) {
      if (qty < 1 || qty > selectedItem.quantity) {
        alert("Invalid quantity!");
        return;
      }
      setGetQty(qty);
      setTotalPrice(qty * selectedItem.price);
    }
  };

  // Add item to cart
  const handleAddToCart = () => {
    if (!selectedItem) return;

    if (getQty < 1 || getQty > selectedItem.quantity) {
      alert("Invalid quantity!");
      return;
    }

    // Check if item is already in cart
    const existingItem = orderItems.find((item) => item.code === selectedItem.code);

    if (existingItem) {
      // Update quantity and total price of existing item
      const updatedOrderItems = orderItems.map((item) =>
          item.code === selectedItem.code
              ? { ...item, quantity: item.quantity + getQty, totalPrice: (item.quantity + getQty) * item.price }
              : item
      );
      setOrderItems(updatedOrderItems);
    } else {
      // Add new item to cart
      const newItem = {
        ...selectedItem,
        quantity: getQty,
        totalPrice: getQty * selectedItem.price,
      };

      setOrderItems([...orderItems, newItem]);
    }
  };

  // Remove item from cart
  const handleRemoveItem = (code: string) => {
    setOrderItems(orderItems.filter((item) => item.code !== code));
  };

  const resetForm = () => {
    setSelectedCustomer("");
    setOrderItems([]);
    setTotalPrice(0);
    setOrderId("");
    setOrderDate("");
    setSelectedItem(null);
  };

  // Place the order
  const handlePlaceOrder = () => {
    // Create the order data, adding OrderDetailsID to each item
    const orderData = {
      orderId: parseInt(orderId, 10),
      orderDate,
      id: selectedCustomer,
      items: orderItems.map((item, index) => ({
        OrderDetailsID: `OD-${orderId}-${index + 1}`, // Generate a unique ID for each order item
        code: item.code,
        getQty: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      })),
    };

    dispatch(createOrder(orderData));
    console.log("Order placed:", orderData)
    alert("Order placed successfully!");
  };

  const generateBill = () => {
    if (!orderId || !orderDate || orderItems.length === 0 || !selectedCustomer) {
      alert("Missing order details or items. Please ensure the order is created.");
      return;
    }

    const customer = customers.find((cust) => cust.id === selectedCustomer);
    const customerId = customer ? customer.id : "Unknown Customer";

    const doc = new jsPDF();

    // Add Ubuntu Font
    doc.addFileToVFS("Ubuntu-Regular.ttf", "<BASE64_ENCODED_UBUNTU_REGULAR>");
    doc.addFont("Ubuntu-Regular.ttf", "Ubuntu", "normal");
    doc.addFileToVFS("Ubuntu-Bold.ttf", "<BASE64_ENCODED_UBUNTU_BOLD>");
    doc.addFont("Ubuntu-Bold.ttf", "Ubuntu", "bold");

    // Use the bold Ubuntu font for the title
    doc.setFont("Ubuntu", "bold");
    doc.setFontSize(20);
    doc.text("SellSwift", 80, 20);

    // Use regular Ubuntu font for other text
    doc.setFont("Ubuntu", "normal");
    doc.setFontSize(12);
    doc.text("66, DS Senanayaka Street, Panadura", 65, 30);
    doc.text("Tel: 038-2233185", 85, 40);
    doc.line(20, 45, 190, 45); // Line separator

    // Order Details
    doc.text(`Order ID: ${orderId}`, 20, 55);
    doc.text(`Order Date: ${orderDate}`, 20, 65);
    doc.text(`Customer: ${customerId}`, 20, 75);


    // Table Headers
    let yOffset = 90;
    doc.setFontSize(10);
    doc.text("No", 20, yOffset);
    doc.text("Item Name", 40, yOffset);
    doc.text("Qty", 100, yOffset);
    doc.text("Price", 120, yOffset);
    doc.text("Total", 150, yOffset);
    doc.line(20, yOffset + 5, 190, yOffset + 5); // Table header line

    // Order Items
    orderItems.forEach((item, index) => {
      yOffset += 10;
      const itemPrice = Number(item.price);
      const totalPrice = Number(item.totalPrice);

      yOffset += 10;
      doc.text(`${index + 1}`, 20, yOffset);
      doc.text(item.itemName, 40, yOffset);
      doc.text(`${item.quantity}`, 100, yOffset);
      doc.text(`$${itemPrice.toFixed(2)}`, 120, yOffset);
      doc.text(`$${totalPrice.toFixed(2)}`, 150, yOffset);
    });

    // Total Balance
    yOffset += 15;
    doc.line(20, yOffset, 190, yOffset);
    doc.text(`Total Balance: $${calculateTotalBalance().toFixed(2)}`, 150, yOffset + 10);

    // Footer Message
    doc.setFontSize(12);
    doc.text("THANK YOU! COME AGAIN!", 70, yOffset + 20);
    doc.text("Email: sellswift@gmail.com", 70, yOffset + 30);

    // Save the generated PDF
    doc.save(`order-bill-${orderId}.pdf`);
  };



  return (
      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Place Order</h2>

        <label className="block text-sm font-bold mb-2">Order Id</label>
        <input
            type="text"
            value={orderId}
            className="border p-2 rounded w-full"
            onChange={(e) => setOrderId(e.target.value)}
        />

        <label className="block text-sm font-bold mb-2">Order Date</label>
        <input
            type="text"
            value={orderDate}
            className="border p-2 rounded w-full"
            onChange={(e) => setOrderDate(e.target.value)}
        />

        {/* Select Customer */}
        <div>
          <label className="block text-sm font-bold mb-2">Select Customer</label>
          <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="border p-2 rounded w-full"
          >
            <option value="">-- Select Customer --</option>
            {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.id}
                </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-bold mb-2">Select Item</label>
          <select onChange={(e) => handleItemSelect(e.target.value)} className="border p-2 rounded w-full">
            <option value="">-- Select Item --</option>
            {items.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.itemName}
                </option>
            ))}
          </select>
        </div>

        {/* Display Selected Item Details */}
        {selectedItem && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <label className="block text-sm font-bold">Item Name</label>
              <input
                  type="text"
                  value={selectedItem.itemName}
                  className="border p-2 rounded w-full"
                  disabled
              />

              <label className="block text-sm font-bold mt-2">Price</label>
              <input
                  type="text"
                  value={selectedItem.price}
                  className="border p-2 rounded w-full"
                  disabled
              />

              <label className="block text-sm font-bold mt-2">Stock</label>
              <input
                  type="text"
                  value={selectedItem.quantity}
                  className="border p-2 rounded w-full"
                  disabled
              />

              <label className="block text-sm font-bold mt-2">Quantity</label>
              <input
                  type="number"
                  value={getQty}
                  min="0"
                  max={selectedItem.quantity}
                  onChange={handleQuantityChange}
                  className="border p-2 rounded w-full"
              />

              <label className="block text-sm font-bold mt-2">Total Price</label>
              <input
                  type="text"
                  value={totalPrice}
                  className="border p-2 rounded w-full"
                  disabled
              />

              <button onClick={handleAddToCart} className="w-full bg-blue-500 text-white p-2 mt-3 rounded">
                Add to Cart
              </button>
            </div>
        )}

        {/* Order Items Table */}
        <table className="min-w-full table-auto border-collapse mt-4">
          <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
          </thead>
          <tbody>
          {orderItems.map((orderItem) => (
              <tr key={orderItem.code}>
                <td className="border px-4 py-2">{orderItem.itemName}</td>
                <td className="border px-4 py-2">${Number(orderItem.price).toFixed(2)}</td>
                <td className="border px-4 py-2">{orderItem.quantity}</td>
                <td className="border px-4 py-2">${Number(orderItem.totalPrice).toFixed(2)}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                      onClick={() => handleRemoveItem(orderItem.code)}
                      className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    Remove
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        <div className="mt-4 font-bold text-xl">
          Total Balance: ${calculateTotalBalance().toFixed(2)}
        </div>

        {/* Place Order Button */}
        <div className="flex justify-end mt-6">
          <button onClick={handlePlaceOrder} className="bg-green-500 text-white p-2 rounded">
            Place Order
          </button>
        </div>

        {/*npm install jspdf*/}
        <div className="flex justify-end mt-6">
          <button onClick={generateBill} className="bg-red-500 text-white p-2 rounded cursor-pointer">
            Generate Bill
          </button>
        </div>
      </div>
  );
}

export default PlaceOrder;
