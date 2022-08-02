import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";

import { toast } from "react-toastify";
import { readNotification } from "../features/notification/notificationSlice";

const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
};

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

const Notification = () => {
    document.title = "Notification";

    const dispatch = useDispatch();
    const { notifications, isLoadingNotification } = useSelector(
        (state) => state.notification
    );

    const [width, height] = useWindowSize();
    const navigate = useNavigate();
    useEffect(() => {
        /* ======== breakpoint for medium screen ======== */
        if (width > 768) {
            toast.error("This page not available for desktop screen");
            navigate("/");
        }
    }, [width]);

    const handleReadNotification = (notifId) => {
        dispatch(readNotification({ notifId }));
    };

    return (
        <>
            <Navbar
                titleSearch="Notifikasi"
                showSearchInput={false}
                isCustomTitleSearch={true}
            />
            <section className="pt-2">
                <div className="font-poppins container-small divide-y">
                    {/* ======== card penawaran product ======== */}
                    {isLoadingNotification ? (
                        <>
                            {[...Array(3)].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex space-x-4 py-4"
                                >
                                    {/* ======== item image ======== */}
                                    <div className="h-12 w-12 rounded-xl bg-gray-300 animate-pulse" />
                                    {/* ======== item details ======== */}
                                    <div className="grow">
                                        <div className="mb-1 flex justify-between items-center text-[10px] text-neutral-neutral03">
                                            <h3 className="text-gray-300 bg-gray-300 animate-pulse">
                                                placeholder
                                            </h3>
                                            <h3 className="text-gray-300 bg-gray-300 animate-pulse">
                                                20 Apr, 14:04
                                            </h3>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <h1 className="text-gray-300 bg-gray-300 animate-pulse w-max">
                                                Jam Tangan Casio
                                            </h1>
                                            <h1 className="text-gray-300 bg-gray-300 animate-pulse w-max">
                                                Rp 250.000
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {notifications.length === 0 ? (
                                <div className="pt-8 text-center text-lg">
                                    Tidak ada notifikasi baru
                                </div>
                            ) : (
                                <>
                                    {notifications.map(
                                        (notification, index) => {
                                            const dateParsed = Date.parse(
                                                notification.createdDate
                                            );
                                            const date = new Date(dateParsed);
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        if (
                                                            !notification.isRead
                                                        )
                                                            handleReadNotification(
                                                                notification.notifId
                                                            );
                                                    }}
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
                                                                Ditawar Rp
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
            </section>
        </>
    );
};

export default Notification;
