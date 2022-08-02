import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate, useLocation, useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import Button from "./Button";

import queryString from "query-string";
import {
    getNotification,
    readNotification,
} from "../features/notification/notificationSlice";

// prettier-ignore
const Svglogoungu = ({className}) => (
    <svg className={className} width="100" height="34" viewBox="0 0 100 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="34" fill="#4B1979"/>
    </svg>
)
// prettier-ignore
const Svglup = ({className}) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.9999 20.9999L16.6499 16.6499" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
// prettier-ignore
const Svgmasuk = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.33325 14.1666L12.4999 9.99992L8.33325 5.83325" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 10H2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
// prettier-ignore
const SvgBurger = ({className}) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12H21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
// prettier-ignore
const SvgX = ({className}) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
// prettier-ignore
const SvgList = ({className}) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 18H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 18H3.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 12H3.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 6H3.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
// prettier-ignore
const SvgUser = ({className}) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
// prettier-ignore
const SvgBell = ({className, onClick}) => (
    <svg onClick={onClick} className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const formatRupiah = (angka) => {
    angka = angka.toString();
    const number_string = angka.replace(/[^\d]/g, "").toString();
    const split = number_string.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        const separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
};

function Navbar({
    showOnMobile = true,
    showSearchInput = true,
    titleSearch,
    isCustomTitleSearch = false,
}) {
    /* ======== for auth routing ======== */
    const router = useNavigate();
    const { isAuthenticated } = useSelector((store) => store.user);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [transparentBackground, setTransparentBackground] = useState(true);

    /* ======== for notification popup ======== */
    const [showPopupNotification, setShowPopupNotification] = useState(false);
    const [showNewNotification, setShowNewNotification] = useState(true);
    const triggerPopupNotification = () => {
        setShowPopupNotification(!showPopupNotification);
    };

    /* ======== for search movie ======== */
    const location = useLocation();
    const navigate = useNavigate();
    const [filterSearch, setFilterSearch] = useState(
        "productName" in queryString.parse(location.search)
            ? queryString.parse(location.search).productName
            : ""
    );
    const [firstRender, setFirstRender] = useState(true);

    // change background nav when user change page
    useEffect(() => {
        if (window.scrollY >= 100) setTransparentBackground(false);
        else setTransparentBackground(true);
    }, [router]);
    const changeBackgroundNav = () => {
        // console.log(window.scrollY);
        if (window.scrollY >= 100) setTransparentBackground(false);
        else setTransparentBackground(true);
    };
    window.addEventListener("scroll", changeBackgroundNav);

    // handling filter search
    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
        const timeOutId = setTimeout(() => {
            const queryParsed = queryString.parse(location.search);
            if (filterSearch === "") delete queryParsed.productName;
            else queryParsed.productName = filterSearch;

            const queryStringified = queryString.stringify(queryParsed);
            location.search = queryStringified;
            navigate({ pathname: "/", search: location.search });
        }, 500);
        return () => clearTimeout(timeOutId);
    }, [filterSearch]);

    // fetch notification everytime user change url
    const dispatch = useDispatch();
    const { notifications, isLoadingNotification, hasNewNotification } =
        useSelector((state) => state.notification);
    useEffect(() => {
        if (isAuthenticated) dispatch(getNotification());
    }, [location]);
    const handleReadNotification = (notifId) => {
        dispatch(readNotification({ notifId }));
    };

    return (
        <>
            {/* ======== START ::: navbar ======== */}
            <div
                className={`${!showOnMobile && "hidden md:flex items-center"} ${
                    transparentBackground && !isCustomTitleSearch
                        ? "bg-transparent top-6"
                        : "bg-white top-0"
                } transition-all md:bg-white w-full md:shadow-high ${
                    isCustomTitleSearch ? "pt-3" : "fixed top-0 py-[18px]"
                } md:py-[18px] md:sticky md:top-0 z-30 md:min-h-[84px] `}
            >
                <div className="container-big flex items-center font-poppins">
                    <div className="flex items-center w-full">
                        {/* ======== show on desktop ======== */}
                        <Link
                            to="/"
                            className="hidden md:block py-1 px-4 rounded-xl border-2 border-primary-darkblue04"
                        >
                            <h1 className="text-xl font-bold text-primary-darkblue04 underline">
                                GENTZ
                            </h1>
                            {/* <img src="./images/logo.png" alt="logo" /> */}
                        </Link>
                        {/* ======== show on mobile ======== */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            type="button"
                            className="md:hidden bg-white p-3 rounded-2xl"
                        >
                            <SvgBurger />
                        </button>
                        {isCustomTitleSearch && (
                            <div className="hidden md:block relative w-full md:max-w-[500px] ml-4 md:mx-6 ">
                                <input
                                    type="text"
                                    className={`${
                                        transparentBackground
                                            ? "border-none"
                                            : "border border-neutral-neutral02"
                                    } md:border-none text-sm w-full rounded-2xl  md:bg-[#EEEEEE] py-[14px] pl-6 pr-8`}
                                    placeholder="Cari di sini ..."
                                    name="productName"
                                    value={filterSearch}
                                    onChange={(e) =>
                                        setFilterSearch(e.target.value)
                                    }
                                />
                                <Svglup className="absolute top-1/2 right-6 -translate-y-1/2 " />
                            </div>
                        )}
                        {showSearchInput ? (
                            <div className="relative w-full md:max-w-[500px] ml-4 md:mx-6 ">
                                <input
                                    type="text"
                                    className={`${
                                        transparentBackground
                                            ? "border-none"
                                            : "border border-neutral-neutral02"
                                    } md:border-none text-sm w-full rounded-2xl  md:bg-[#EEEEEE] py-[14px] pl-6 pr-8`}
                                    placeholder="Cari di sini ..."
                                    name="productName"
                                    value={filterSearch}
                                    onChange={(e) =>
                                        setFilterSearch(e.target.value)
                                    }
                                />
                                <Svglup className="absolute top-1/2 right-6 -translate-y-1/2 " />
                            </div>
                        ) : (
                            <>
                                {isCustomTitleSearch ? (
                                    <p className="text-[20px] font-bold ml-8 md:hidden">
                                        {titleSearch}
                                    </p>
                                ) : (
                                    <p className="mx-auto -translate-x-1/3">
                                        {titleSearch}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    {/* ======== button masuk, nav on the right side, and popup notification ======== */}
                    {(showSearchInput || isCustomTitleSearch) && (
                        <div className="hidden md:block ml-auto">
                            {isAuthenticated ? (
                                /* ======== nav on the rightside ======== */
                                <div className="flex space-x-7 items-center">
                                    <Link to="/list">
                                        <SvgList className="stroke-[#151515] hover:stroke-primary-darkblue04 transition" />
                                    </Link>
                                    <div className="relative cursor-pointer">
                                        <SvgBell
                                            onClick={triggerPopupNotification}
                                            className={`${
                                                showPopupNotification
                                                    ? "stroke-primary-darkblue04"
                                                    : "stroke-black"
                                            } hover:stroke-primary-darkblue04 transition`}
                                        />
                                        {/* ======== red dots on the bell ======== */}
                                        {hasNewNotification && (
                                            <div className="h-2 w-2 rounded-full bg-alert-danger absolute top-0 right-0" />
                                        )}
                                        {/* ======== popup notification ======== */}
                                        <div
                                            className={`${
                                                showPopupNotification
                                                    ? "visible opacity-1"
                                                    : "invisible opacity-0"
                                            } transition-all absolute shadow-high w-[376px] max-h-[265px] top-10 -right-7 px-6 py-2 overflow-y-scroll divide-y divide-[#E5E5E5] rounded-2xl bg-white`}
                                        >
                                            {isLoadingNotification ? (
                                                <div className="flex items-center justify-center h-[265px]">
                                                    <svg
                                                        role="status"
                                                        className="h-8 w-8 animate-spin mr-2 text-gray-200 fill-gray-600"
                                                        viewBox="0 0 100 101"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"
                                                        />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <>
                                                    {notifications.length ===
                                                    0 ? (
                                                        <div className="py-4">
                                                            Tidak ada notifikasi
                                                            baru
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {notifications.map(
                                                                (
                                                                    notification,
                                                                    index
                                                                ) => {
                                                                    const dateParsed =
                                                                        Date.parse(
                                                                            notification.createdDate
                                                                        );
                                                                    const date =
                                                                        new Date(
                                                                            dateParsed
                                                                        );
                                                                    return (
                                                                        <div
                                                                            onClick={() => {
                                                                                if (
                                                                                    !notification.isRead
                                                                                )
                                                                                    handleReadNotification(
                                                                                        notification.notifId
                                                                                    );
                                                                            }}
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex space-x-4 py-4"
                                                                        >
                                                                            <div className="h-12 w-12">
                                                                                <img
                                                                                    src={
                                                                                        notification.url
                                                                                    }
                                                                                    alt=""
                                                                                    className="object-cover h-full rounded-xl"
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-1 grow">
                                                                                <div className="flex justify-between items-center">
                                                                                    <p className="text-xs text-neutral-neutral03">
                                                                                        {
                                                                                            notification.title
                                                                                        }
                                                                                    </p>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        {/* prettier-ignore  */}
                                                                                        <p className="text-xs text-neutral-neutral03">
                                                                                            {date.getDate()}{" "}
                                                                                            {
                                                                                                monthList[
                                                                                                    date.getMonth()
                                                                                                ]
                                                                                            }
                                                                                            ,{" "}
                                                                                            {date.getHours()}
                                                                                            :
                                                                                            {date.getMinutes()}
                                                                                        </p>
                                                                                        {!notification.isRead && (
                                                                                            <div className="rounded-full bg-alert-danger h-2 w-2 " />
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                {/* prettier-ignore  */}
                                                                                <p className="text-sm">
                                                                            {notification.productName}
                                                                        </p>
                                                                                {/* prettier-ignore  */}
                                                                                <p className="text-sm">
                                                                            Rp {formatRupiah(notification.price)}
                                                                        </p>
                                                                                {/* prettier-ignore  */}
                                                                                {notification.offerNegotiated && (
                                                                                    <p className="text-sm">
                                                                                        Ditawar
                                                                                        Rp
                                                                                        {formatRupiah(
                                                                                            notification.offerNegotiated
                                                                                        )}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Link to="/profile">
                                        <SvgUser className="stroke-[#151515] hover:stroke-primary-darkblue04 transition" />
                                    </Link>
                                </div>
                            ) : (
                                /* ======== button masuk ======== */
                                <Button
                                    type="button"
                                    onClick={() => router("/login")}
                                    className="py-[14px] px-4"
                                >
                                    <Svgmasuk />
                                    <span className="ml-2 my-auto ">Masuk</span>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* ======== END ::: navbar ======== */}
            {/* ======== START ::: sidebar ======== */}
            <div
                className={`${
                    sidebarOpen ? "visible opacity-1" : "invisible opacity-0"
                } fixed md:hidden w-full h-full left-0 top-0 bottom-0 right-0 flex justify-start z-40 transition-all duration-300`}
            >
                {/* ======== overlay black modal ======== */}
                <div className="bg-black opacity-60 absolute w-full h-full left-0 right-0 top-0 bottom-0" />
                {/* ======== actual sidebar ======== */}
                <div
                    className={`${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-all duration-500 font-poppins bg-white h-full w-1/2 z-50 py-[34px] pl-4 pr-6`}
                >
                    <div className="flex items-center justify-between mb-[18px]">
                        <Link to="/">
                            <h1 className="font-bold">GENTZ</h1>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <SvgX />
                        </button>
                    </div>
                    <div>
                        {isAuthenticated ? (
                            <div className="flex flex-col space-y-4">
                                <Link
                                    to="/notification"
                                    className="font-medium"
                                >
                                    Notifikasi
                                </Link>
                                <Link to="/list" className="font-medium">
                                    Daftar Jual
                                </Link>
                                <Link to="/profile" className="font-medium">
                                    Akun Saya
                                </Link>
                            </div>
                        ) : (
                            <Button
                                className="py-[14px] px-4"
                                type="button"
                                onClick={() => router("/login")}
                            >
                                <Svgmasuk />
                                <span className="ml-2 my-auto ">Masuk</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* ======== END ::: sidebar ======== */}
        </>
    );
}

export default Navbar;
