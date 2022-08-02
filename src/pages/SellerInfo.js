import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Button from "../components/Button";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import {
    acceptOffer,
    finishOffer,
    getMyOffers,
    rejectOffer,
} from "../features/product/myOffersSlice";
import { toast } from "react-toastify";

// prettier-ignore
const SvgWhatssap = () => (
	<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1.16699 12.8332L4.33431 11.8233C5.185 12.2905 6.14204 12.5317 7.10666 12.5317C10.2664 12.5317 12.8337 9.98433 12.8337 6.8491C12.8337 3.71388 10.2664 1.1665 7.10666 1.1665C3.94694 1.1665 1.37967 3.71388 1.37967 6.8491C1.37967 7.88162 1.6607 8.89906 2.19998 9.78084L1.16699 12.8332ZM7.10666 11.3748C6.18001 11.3748 5.44173 11.0048 4.66699 10.4998L2.91699 11.0832L3.50033 9.62484C2.90788 8.81842 2.62533 7.84698 2.62533 6.85214C2.62533 4.24448 4.47862 2.33317 7.10666 2.33317C9.7347 2.33317 11.667 4.24144 11.667 6.8491C11.667 9.45677 9.7347 11.3748 7.10666 11.3748ZM8.64095 9.69794C9.07389 9.69794 9.78027 9.42662 9.95497 9.00457C10.0233 8.83123 10.0841 8.62021 10.0841 8.43179C10.0841 8.40165 10.0841 8.35643 10.0689 8.31874C10.0157 8.2283 8.77767 7.58769 8.64855 7.58769C8.56955 7.58769 8.46139 7.70466 8.34546 7.84502L8.16839 8.06141C8.05002 8.20177 7.93457 8.31874 7.84342 8.31874C7.78266 8.31874 7.72949 8.29613 7.67632 8.26599C7.25098 8.05496 6.8788 7.8364 6.52941 7.50479C6.24078 7.23347 5.92177 6.8265 5.75467 6.47227C5.73188 6.43459 5.71669 6.39691 5.71669 6.35923C5.71669 6.18588 6.24078 5.86181 6.24078 5.57542C6.24078 5.50005 5.85341 4.47507 5.80024 4.34695C5.72428 4.151 5.68631 4.09071 5.48123 4.09071C5.38249 4.09071 5.29134 4.0681 5.2002 4.0681C5.04069 4.0681 4.91916 4.12839 4.80523 4.2339C4.44065 4.57305 4.25835 4.92727 4.24316 5.42469V5.48498C4.23557 6.00501 4.49382 6.52503 4.78244 6.94708C5.43566 7.90423 6.11165 8.74079 7.19781 9.23067C7.52441 9.3814 8.27637 9.69794 8.64095 9.69794Z" fill="white"/>
	</svg>
)

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

const SellerInfo = () => {
    document.title = "My Offers";

    const { id } = useParams();

    const dispatch = useDispatch();
    const { myOffers, isLoadingMyOffers } = useSelector(
        (state) => state.myOffers
    );

    const [modalAcceptNego, setModalAcceptNego] = useState(false);
    const [dataModalAcceptNego, setDataModalAcceptNego] = useState({
        avatarBuyer: "",
        buyer: "",
        cityBuyer: "",
        productImages: [],
        productName: "",
        price: 0,
        priceOffer: 0,
    });

    const [modalStatus, setModalStatus] = useState(false);

    useEffect(() => {
        dispatch(getMyOffers(id));
    }, []);

    const handleReject = (e) => {
        const offerId = e.target.getAttribute("data-offerid");

        toast.loading("Menolak harga nego . . .");
        dispatch(rejectOffer({ offerId, offerStatus: "Rejected" }))
            .unwrap()
            .then(() => {
                toast.dismiss();
                toast.success("Berhasil menolak harga nego!");
            });
    };

    const handleAccept = (e) => {
        const offerId = e.target.getAttribute("data-offerid");

        setDataModalAcceptNego(
            myOffers.find((offer) => offer.offerId === parseInt(offerId))
        );

        toast.loading("Menerima harga nego . . .");
        dispatch(acceptOffer({ offerId, offerStatus: "Accepted" }))
            .unwrap()
            .then(() => {
                toast.dismiss();
                setModalAcceptNego(true);
            });
    };

    /* ======== for change status form modal ======== */
    const [isProductSold, setIsProductSold] = useState(true);
    const [offerIdStatus, setOfferIdStatus] = useState(-1);
    const handleStatus = (e) => {
        const offerId = e.target.getAttribute("data-offerid");

        setOfferIdStatus(offerId);
        setModalStatus(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isProductSold) {
            toast.loading("Menolak harga nego . . .");
            dispatch(
                rejectOffer({ offerId: offerIdStatus, offerStatus: "Rejected" })
            )
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Berhasil menolak harga nego!");
                    setModalStatus(false);
                    setIsProductSold(false);
                });
        } else {
            toast.loading("Memperbarui status . . .");
            dispatch(finishOffer(offerIdStatus))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Status produk berhasil diperbarui");
                    setModalStatus(false);
                    setIsProductSold(false);
                });
        }
    };

    return (
        <>
            {/* ======== modal accept nego ======== */}
            <Modal
                isOpen={modalAcceptNego}
                onClose={() => {
                    setModalAcceptNego(false);
                }}
            >
                <h1 className="text-sm font-medium mb-4">
                    Yeay kamu berhasil mendapat harga yang sesuai
                </h1>
                <h2 className="text-sm text-neutral-neutral03 mb-4">
                    Segera hubungi pembeli melalui whatsapp untuk transaksi
                    selanjutnya
                </h2>
                <div className="rounded-2xl p-4 flex flex-col shadow-low mb-6 bg-[#EEEEEE]">
                    <h1 className="text-sm text-center font-medium">
                        Product Match
                    </h1>
                    <div className="flex space-x-4 mt-4">
                        <img
                            src={dataModalAcceptNego.avatarBuyer}
                            className="h-12 w-12 rounded-xl"
                            alt="product"
                        />
                        <div className="flex flex-col space-y-1">
                            <h3 className="font-medium mb-1 text-sm">
                                {dataModalAcceptNego.buyer}
                            </h3>
                            <h3 className="text-neutral-neutral03 text-xs">
                                {dataModalAcceptNego.cityBuyer}
                            </h3>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <img
                            src={dataModalAcceptNego.productImages[0]}
                            className="h-12 w-12 rounded-xl"
                            alt="product"
                        />
                        <div className="flex flex-col space-y-1">
                            <h3 className="text-sm">
                                {dataModalAcceptNego.productName}{" "}
                            </h3>
                            <h3 className="text-sm line-through">
                                Rp {formatRupiah(dataModalAcceptNego.price)}{" "}
                            </h3>
                            <h3 className="text-sm">
                                Ditawar Rp{" "}
                                {formatRupiah(dataModalAcceptNego.priceOffer)}
                            </h3>
                        </div>
                    </div>
                </div>
                <Button className="w-full">
                    <span className="mr-3">Hubungi via whatsapp</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.3335 14.6668L4.95329 13.5127C5.92551 14.0467 7.01926 14.3223 8.12169 14.3223C11.7328 14.3223 14.6668 11.411 14.6668 7.8279C14.6668 4.24478 11.7328 1.3335 8.12169 1.3335C4.51058 1.3335 1.57655 4.24478 1.57655 7.8279C1.57655 9.00792 1.89773 10.1707 2.51405 11.1785L1.3335 14.6668ZM8.12169 13.0002C7.06266 13.0002 6.21891 12.5773 5.3335 12.0002L3.3335 12.6668L4.00016 11.0002C3.32308 10.0785 3.00016 8.96832 3.00016 7.83137C3.00016 4.85118 5.11822 2.66683 8.12169 2.66683C11.1252 2.66683 13.3335 4.84771 13.3335 7.8279C13.3335 10.8081 11.1252 13.0002 8.12169 13.0002ZM9.87516 11.0837C10.37 11.0837 11.1772 10.7736 11.3769 10.2913C11.455 10.0932 11.5245 9.85202 11.5245 9.63668C11.5245 9.60223 11.5245 9.55055 11.5071 9.50748C11.4463 9.40413 10.0314 8.672 9.88384 8.672C9.79357 8.672 9.66996 8.80568 9.53745 8.96609L9.33509 9.21339C9.19982 9.37381 9.06787 9.50748 8.9637 9.50748C8.89426 9.50748 8.8335 9.48164 8.77273 9.44719C8.28662 9.20602 7.86127 8.95624 7.46197 8.57725C7.13211 8.26717 6.76752 7.80206 6.57655 7.39723C6.55051 7.35417 6.53315 7.3111 6.53315 7.26804C6.53315 7.06993 7.13211 6.69956 7.13211 6.37226C7.13211 6.28612 6.6894 5.11472 6.62864 4.96829C6.54183 4.74435 6.49843 4.67544 6.26405 4.67544C6.1512 4.67544 6.04704 4.6496 5.94287 4.6496C5.76058 4.6496 5.62169 4.71851 5.49148 4.83909C5.07482 5.22669 4.86648 5.63152 4.84912 6.19999V6.2689C4.84044 6.86321 5.13558 7.45753 5.46544 7.93987C6.21197 9.03375 6.98454 9.98983 8.22586 10.5497C8.59912 10.722 9.4585 11.0837 9.87516 11.0837Z"
                            fill="white"
                        />
                    </svg>
                </Button>
            </Modal>
            {/* ======== modal status ======== */}
            <Modal
                isOpen={modalStatus}
                onClose={() => {
                    setModalStatus(false);
                }}
            >
                <h1 className="text-sm font-medium mb-6">
                    Perbarui status penjualan produkmu
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-10 md:mb-8 space-y-6">
                        <div className="flex space-x-4">
                            <input
                                name="status"
                                type="radio"
                                id="berhasil_terjual"
                                value={true}
                                checked={isProductSold}
                                onChange={() => setIsProductSold(true)}
                                className="h-4 w-4 bg-[#C4C4C4] border-none checked:bg-gray-400 text-[#C4C4C4] checked:ring-0 checked:ring-offset-0 transition "
                            />
                            <label
                                htmlFor="berhasil_terjual"
                                className="space-y-1"
                            >
                                <h3 className="font-medium mb-1 text-sm">
                                    Berhasil terjual
                                </h3>
                                <h3 className="text-neutral-neutral03 text-sm">
                                    Kamu telah sepakat menjual produk ini kepada
                                    pembeli
                                </h3>
                            </label>
                        </div>
                        <div className="flex space-x-4">
                            <input
                                name="status"
                                type="radio"
                                id="batalkan_transaksi"
                                value={false}
                                checked={!isProductSold}
                                onChange={() => setIsProductSold(false)}
                                className="h-4 w-4 bg-[#C4C4C4] border-none checked:bg-gray-400 text-[#C4C4C4] checked:ring-0 checked:ring-offset-0 transition "
                            />
                            <label
                                htmlFor="batalkan_transaksi"
                                className="space-y-1"
                            >
                                <h3 className="font-medium mb-1 text-sm">
                                    Batalkan transaksi
                                </h3>
                                <h3 className="text-neutral-neutral03 text-sm">
                                    Kamu membatalkan transaksi produk ini dengan
                                    pembeli
                                </h3>
                            </label>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        kirim
                    </Button>
                </form>
            </Modal>
            <Navbar
                showSearchInput={false}
                titleSearch="Info Penawar"
                showOnMobile={false}
            />
            <section className="font-poppins pt-5 md:pt-10">
                <div className="container-small relative">
                    <Link
                        to="/list?list=Diminati"
                        className="absolute md:-left-76px block w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                        {/* prettier-ignore  */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19L5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                    <p className="text-center font-medium mb-8 md:mb-10 md:hidden pt-1">
                        Info Penawar
                    </p>
                    {/* ======== card offers ======== */}
                    <div className="space-y-6 pb-4">
                        {isLoadingMyOffers ? (
                            <div>
                                <div className="mb-6 p-4 shadow-low rounded-2xl flex items-center space-x-4 bg-white">
                                    <div className="h-12 w-12 rounded-xl bg-gray-300 animate-pulse" />

                                    <div className="">
                                        <h1 className="font-medium mb-1 text-sm text-gray-300 bg-gray-300 animate-pulse">
                                            placeholder
                                        </h1>
                                        <h2 className="text-xs text-gray-300 bg-gray-300 animate-pulse">
                                            placeholder
                                        </h2>
                                    </div>
                                </div>
                                <h2 className="font-medium mb-1 text-sm">
                                    Produkmu yang Ditawar
                                </h2>
                                {/*===============line info penawar 1======================*/}
                                <div className="mt-6 pb-4 border-b bg-white">
                                    <div className="flex  space-x-4 ">
                                        <div className="w-12 h-12 rounded-xl bg-gray-300 animate-pulse" />
                                        <div className="grow">
                                            <div className="flex justify-between mb-2 ">
                                                <h1 className="text-neutral-neutral03 text-xs">
                                                    Penawaran produk
                                                </h1>
                                                <h2 className="text-xs text-gray-300 bg-gray-300 animate-pulse">
                                                    date placeholder
                                                </h2>
                                            </div>
                                            <h2 className="font-medium mb-2 text-sm w-max text-gray-300 bg-gray-300 animate-pulse">
                                                product name placeholder
                                            </h2>
                                            <h2 className="font-medium mb-2 text-sm w-max text-gray-300 bg-gray-300 animate-pulse">
                                                Rp placeholder
                                            </h2>
                                            <h2 className="font-medium mb-2 text-sm w-max text-gray-300 bg-gray-300 animate-pulse">
                                                Ditawar Rp placeholder
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {myOffers.map(
                                    (
                                        {
                                            offerId,
                                            avatarBuyer,
                                            buyer,
                                            cityBuyer,
                                            productImages,
                                            productName,
                                            price,
                                            priceOffer,
                                            dateCreated,
                                            statusOffer,
                                        },
                                        index
                                    ) => {
                                        const dateParsed =
                                            Date.parse(dateCreated);
                                        const date = new Date(dateParsed);

                                        return (
                                            <div key={index}>
                                                <div className="mb-6 p-4 shadow-low rounded-2xl flex items-center space-x-4 bg-white">
                                                    <div className="h-12 w-12">
                                                        <img
                                                            src={avatarBuyer}
                                                            alt="avatar"
                                                            className="object-cover h-full w-full rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <h1 className="font-medium mb-1 text-sm">
                                                            {buyer}
                                                        </h1>

                                                        <h2 className="text-neutral-neutral03 text-xs">
                                                            {cityBuyer}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <h2 className="font-medium mb-1 text-sm">
                                                    Produkmu yang Ditawar
                                                </h2>
                                                <div className="mt-6 pb-4 border-b bg-white">
                                                    <div className="flex  space-x-4 ">
                                                        <div className="w-12">
                                                            <img
                                                                src={
                                                                    productImages[0]
                                                                }
                                                                alt={
                                                                    productName
                                                                }
                                                                className="rounded-xl h-12 w-12"
                                                            />
                                                        </div>
                                                        <div className="grow">
                                                            <div className="flex justify-between mb-2 ">
                                                                <h1 className="text-neutral-neutral03 text-xs">
                                                                    Penawaran
                                                                    produk
                                                                </h1>
                                                                <h2 className="text-neutral-neutral03 text-xs">
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
                                                                </h2>
                                                            </div>
                                                            <h2 className="font-medium mb-2 text-sm">
                                                                {productName}
                                                            </h2>
                                                            <h2 className="font-medium mb-2 text-sm">
                                                                Rp{" "}
                                                                {formatRupiah(
                                                                    price
                                                                )}
                                                            </h2>
                                                            <h2 className="font-medium mb-2 text-sm">
                                                                Ditawar Rp{" "}
                                                                {formatRupiah(
                                                                    priceOffer
                                                                )}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center md:justify-end space-x-4 mt-4">
                                                        {statusOffer ===
                                                            "Waiting" && (
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    variant="secondary"
                                                                    className="grow md:grow-0 md:w-[158px] px-10"
                                                                    data-offerid={
                                                                        offerId
                                                                    }
                                                                    onClick={
                                                                        handleReject
                                                                    }
                                                                >
                                                                    Tolak
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    data-offerid={
                                                                        offerId
                                                                    }
                                                                    onClick={
                                                                        handleAccept
                                                                    }
                                                                    className="grow md:grow-0 md:w-[158px] px-10"
                                                                >
                                                                    Terima
                                                                </Button>
                                                            </>
                                                        )}
                                                        {statusOffer ===
                                                            "Rejected" && (
                                                            <Button
                                                                size="small"
                                                                variant="secondary"
                                                                className="grow md:grow-0 md:w-[158px] px-10"
                                                                isDisabled={
                                                                    true
                                                                }
                                                            >
                                                                Ditolak
                                                            </Button>
                                                        )}
                                                        {statusOffer ===
                                                            "Accepted" && (
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    variant="secondary"
                                                                    className="grow md:grow-0 md:w-[158px] px-10"
                                                                    data-offerid={
                                                                        offerId
                                                                    }
                                                                    onClick={
                                                                        handleStatus
                                                                    }
                                                                >
                                                                    Status
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    className="grow md:grow-0 md:w-[158px] px-2"
                                                                >
                                                                    <span className="mr-2">
                                                                        Hubungi
                                                                        di
                                                                    </span>
                                                                    <SvgWhatssap />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default SellerInfo;
