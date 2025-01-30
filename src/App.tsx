import { createBrowserRouter, RouterProvider } from "react-router"
import "./App.css"
import { RootLayout } from "./components/RootLayout"
import Item from "./pages/Item"
import PlaceOrder from "./pages/PlaceOrder"
import Dashboard from "./pages/Dashboard"
import CustomerPage from "./pages/CustomerPage.tsx";
import {Provider} from "react-redux";
import store from "./store/Store.ts";

function App() {
    const routes = createBrowserRouter([
        {
            path: "",
            element: <RootLayout />,
            children: [
                { path: "", element: <Dashboard /> },
                { path: "/customer", element: <CustomerPage /> },
                { path: "/item", element: <Item /> },
                { path: "/place-order", element: <PlaceOrder /> }
            ]
        }
    ])

    return (
        <Provider store={store}>
            <RouterProvider router={routes} />
        </Provider>
    )
}

export default App
