import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerInfo from "./pages/SellerInfo";
import { useSelector } from "react-redux";
import SaleListPage from "./pages/SaleListPage";
import Notification from "./pages/Notification";
import Preview from "./pages/Preview";

function App() {
    const { isAuthenticated, address, phoneNumber } = useSelector(
        (store) => store.user
    );

    const AuthRoute = ({ children }) => {
        if (!isAuthenticated) {
            return children;
        } else return <Navigate to="/profile" replace />;
    };
    const ContentRoute = ({ children }) => {
        if (isAuthenticated) {
            return children;
        } else return <Navigate to="/login" replace />;
    };
    const ContentRouteProtected = ({ children }) => {
        if (address.city !== "" || address.street !== "" || phoneNumber) {
            return children;
        } else return <Navigate to="/login" replace />;
    };
    return (
        <BrowserRouter>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                // autoClose={false}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/product/:id" element={<Product />}></Route>
                <Route
                    path="/profile"
                    element={
                        <ContentRoute>
                            <Profile />
                        </ContentRoute>
                    }
                ></Route>
                <Route
                    path="/register"
                    element={
                        <AuthRoute>
                            <Register />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/add_product"
                    element={
                        <ContentRoute>
                            <ContentRouteProtected>
                                <AddProduct />
                            </ContentRouteProtected>
                        </ContentRoute>
                    }
                ></Route>
                <Route
                    path="/edit_product/:id"
                    element={
                        <ContentRoute>
                            <ContentRouteProtected>
                                <AddProduct />
                            </ContentRouteProtected>
                        </ContentRoute>
                    }
                ></Route>
                <Route
                    path="/offers/:id"
                    element={
                        <ContentRoute>
                            <ContentRouteProtected>
                                <SellerInfo />
                            </ContentRouteProtected>
                        </ContentRoute>
                    }
                ></Route>
                <Route
                    path="/list"
                    element={
                        <ContentRoute>
                            <ContentRouteProtected>
                                <SaleListPage />
                            </ContentRouteProtected>
                        </ContentRoute>
                    }
                ></Route>
                <Route
                    path="/notification"
                    element={
                        <ContentRoute>
                            <ContentRouteProtected>
                                <Notification />
                            </ContentRouteProtected>
                        </ContentRoute>
                    }
                ></Route>
                <Route
                    path="/preview"
                    element={
                        <ContentRoute>
                            <ContentRouteProtected>
                                <Preview />
                            </ContentRouteProtected>
                        </ContentRoute>
                    }
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
