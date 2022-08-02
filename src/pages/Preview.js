import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
    deleteProduct,
    getProductDetails,
    getProductNegoStatus,
    postNegoPrice,
    publishProduct,
} from "../features/product/transactionProductSlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Lazy, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/lazy";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Button from "../components/Button";
import Navbar from "../components/Navbar";

import { toast } from "react-toastify";
import { setPreviewProduct } from "../features/product/previewSlice";
import { addProduct, updateProduct } from "../features/product/productSlice";

const categories = [
    { value: 1, key: "Hobi" },
    { value: 2, key: "Kendaraan" },
    { value: 3, key: "Baju" },
    { value: 4, key: "Elektronik" },
    { value: 5, key: "Kesehatan" },
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

const Preview = () => {
    document.title = "Preview Page";

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        productId,
        productName,
        description,
        price,
        categoryId,
        userName,
        city,
        photoProfile,
        productImages,
        realProductImages,
        hasPreview,
    } = useSelector((state) => state.preview);

    /* ======== for swiper product arrow ======== */
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    /* ======== handle if user intent to access this page directly from url ======== */
    useEffect(() => {
        if (!hasPreview) navigate("/add_product");
    }, [hasPreview]);

    /* ======== handle publish product ======== */
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("categoryId", categoryId);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("productName", productName);

        [...Array(realProductImages.length)].forEach((item, index) => {
            formData.append("images", realProductImages[index]);
        });
        if (productId !== -1) {
            formData.append("productId", productId);

            if (realProductImages === "placeholder")
                formData.set("images", null);

            toast.loading("Memperbarui detail produk . . .");
            dispatch(updateProduct(formData))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Berhasil memperbarui detail produk!");
                    navigate("/list");
                });
        } else {
            toast.loading("Menambahkan produk . . .");
            dispatch(addProduct(formData))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Berhasil menambahkan produk!");
                    navigate("/list");
                });
        }
    };

    return (
        <>
            <Navbar showOnMobile={false} />

            <section className="md:pb-6 md:pt-8">
                {/* ======== shown on mobile ======== */}
                <div className="h-300px md:hidden relative">
                    <Swiper
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        id="product-swiper-mobile"
                    >
                        {productImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="h-300px ">
                                    <img
                                        className="object-cover h-full w-full md:hidden"
                                        src={image}
                                        alt={image}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Link to="/">
                        <div className="z-10 absolute left-back-button top-11 h-8 w-8 rounded-full bg-white hover:bg-gray-300 transition flex justify-center items-center">
                            {/* prettier-ignore  */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 19L5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </Link>
                </div>
                <div className="container-banner relativez-10">
                    <div className="z-10 absolute md:static transfrom -translate-y-12 md:translate-y-0 container-medium md:grid grid-cols-12 gap-x-8">
                        {/* ======== hidden on mobile ======== */}
                        <div className="col-span-7 space-y-6 hidden md:block">
                            <Swiper
                                lazy={true}
                                loop={true}
                                pagination={{ clickable: true }}
                                onSwiper={(swiper) => {
                                    // Delay execution for the refs to be defined
                                    setTimeout(() => {
                                        // Override prevEl & nextEl now that refs are defined
                                        swiper.params.navigation.prevEl =
                                            prevRef.current;
                                        swiper.params.navigation.nextEl =
                                            nextRef.current;

                                        // Re-init navigation
                                        swiper.navigation.destroy();
                                        swiper.navigation.init();
                                        swiper.navigation.update();
                                    });
                                }}
                                modules={[Lazy, Pagination, Navigation]}
                                id="product-swiper"
                            >
                                {productImages.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="h-[27.25rem] ">
                                            <img
                                                className="object-cover h-full w-full swiper-lazy"
                                                src={image}
                                                alt={image}
                                            />
                                            <div className="swiper-lazy-preloader border-primary-darkblue04"></div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                                <div
                                    className="cursor-pointer z-10 absolute top-1/2 w-30px h-30px rounded-full bg-white hover:bg-gray-300 transition -translate-y-1/2 left-4 flex items-center justify-center"
                                    ref={prevRef}
                                >
                                    {/* prettier-ignore */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div
                                    className="cursor-pointer z-10 absolute top-1/2 w-30px h-30px rounded-full bg-white hover:bg-gray-300 transition -translate-y-1/2 right-4 flex items-center justify-center"
                                    ref={nextRef}
                                >
                                    {/* prettier-ignore */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L15 12L9 6" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Swiper>
                        </div>
                        <div className="col-span-5 space-y-4 md:space-y-6">
                            <div className="px-4 pt-4 pb-6 shadow-low rounded-2xl bg-white">
                                <h1 className="font-medium mb-1 md:mb-2">
                                    {productName}
                                </h1>
                                <h2 className="mb-2 md:mb-4 text-neutral-neutral03">
                                    {
                                        categories.find(
                                            (category) =>
                                                category.value ===
                                                parseInt(categoryId)
                                        ).key
                                    }
                                </h2>
                                <h2>Rp {formatRupiah(price)} </h2>

                                <div className="md:space-y-3.5 md:mt-6">
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full hidden md:block"
                                    >
                                        {productId === -1
                                            ? "Terbitkan"
                                            : "Perbarui"}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            navigate(
                                                productId === -1
                                                    ? -1
                                                    : `/edit_product/${productId}`
                                            )
                                        }
                                        variant="secondary"
                                        className="w-full hidden md:block"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 shadow-low rounded-2xl flex items-center space-x-4 bg-white">
                                <div className="h-12 w-12">
                                    <img
                                        src={photoProfile}
                                        alt="avatar"
                                        className="object-cover h-full w-full rounded-xl"
                                    />
                                </div>
                                <div className="">
                                    <h1 className="font-medium mb-1 text-sm">
                                        {userName}
                                    </h1>
                                    <h2 className="text-neutral-neutral03 text-xs">
                                        {city}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-48 md:mt-0 md:pb-8">
                <div className="container-medium md:grid grid-cols-12 gap-x-8">
                    <div className="col-span-7 space-y-6">
                        <div className="shadow-low rounded-2xl p-4 ">
                            <h1 className="text-sm mb-4 font-medium">
                                Deskripsi
                            </h1>
                            <div className="space-y-8 text-neutral-neutral03">
                                <p>{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="fixed w-[90%] left-1/2 transform -translate-x-1/2 bottom-8 md:hidden flex space-x-4">
                <Button
                    onClick={() =>
                        navigate(
                            productId === -1 ? -1 : `/edit_product/${productId}`
                        )
                    }
                    variant="secondary"
                    className="grow"
                >
                    Edit
                </Button>
                <Button onClick={handleSubmit} className="grow">
                    {productId === -1 ? "Terbitkan" : "Perbarui"}
                </Button>
            </div>
        </>
    );
};

export default Preview;
