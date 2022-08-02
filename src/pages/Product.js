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
import Modal from "../components/Modal";
import Input from "../components/Input";
import Navbar from "../components/Navbar";

import { toast } from "react-toastify";

import * as Yup from "yup";
import { useFormik } from "formik";

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

const Product = () => {
    document.title = "Product Page";

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        productId,
        productName,
        description,
        price,
        categoryName,
        addedBy,
        userName,
        city,
        photoProfile,
        productImages,
        sold,
        published,
        isLoadingDetailProduct,
        negotiationStatus,
    } = useSelector((state) => state.transactionProduct);
    const { email, isAuthenticated, address, phoneNumber } = useSelector(
        (state) => state.user
    );

    let hasCompletedProfile = false;
    if (address.city !== "" || address.street !== "" || phoneNumber)
        hasCompletedProfile = true;

    /* ======== for swiper product arrow ======== */
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    /* ======== for modal ======== */
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, []);

    const publishNewProduct = () => {
        toast.loading("Menerbitkan produk . . .");
        dispatch(publishProduct(productId))
            .unwrap()
            .then(() => {
                toast.dismiss();
                toast.success("Produk berhasil diterbitkan!");
            });
    };

    const formik = useFormik({
        initialValues: { priceNegotiated: "" },
        validationSchema: () =>
            Yup.object().shape({
                priceNegotiated: Yup.string()
                    .required("Tolong masukkan harga nego")
                    .matches(/^[0-9]*$/, "Tolong hanya masukkan angka"),
            }),
        onSubmit: (values, { resetForm }) => {
            values.productId = id;
            dispatch(postNegoPrice(values))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Harga tawarmu berhasil dikirim ke penjual");
                    setModalOpen(false);
                    resetForm(formik.initialValues);
                });
        },
    });

    const handleNego = () => {
        if (!hasCompletedProfile) navigate("/profile");
        else setModalOpen(true);
    };

    const handleDelete = () => {
        toast.loading("Menghapus produk . . .");
        dispatch(deleteProduct(id))
            .unwrap()
            .then(() => {
                toast.dismiss();
                toast.success("Berhasil menghapus produk");
                navigate("/list");
            });
    };

    return (
        <>
            <Navbar showOnMobile={false} />
            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
            >
                <h1 className="text-sm font-medium mb-4">
                    Masukkan Harga Tawarmu
                </h1>
                <h2 className="text-sm text-neutral-neutral03 mb-4">
                    Harga tawaranmu akan diketahui penual, jika penjual cocok
                    kamu akan segera dihubungi penjual.
                </h2>
                <div className="rounded-2xl p-4 flex space-x-4 shadow-low mb-6">
                    <img
                        src={productImages[0]}
                        className="h-12 w-12 rounded-xl"
                        alt="product"
                    />
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-sm font-medium ">{productName}</h3>
                        <h3 className="">Rp. {formatRupiah(price)}</h3>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} method="POST">
                    <div className="mb-6">
                        <label
                            className="text-xs mb-1 block "
                            htmlFor="priceNegotiated"
                        >
                            Harga Tawar
                        </label>
                        <Input
                            type="text"
                            name="priceNegotiated"
                            placeholder="Rp 0.00"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.priceNegotiated}
                        />
                        {formik.touched.priceNegotiated &&
                            formik.errors.priceNegotiated && (
                                <span className="text-xs text-red-500">
                                    {formik.errors.priceNegotiated}
                                </span>
                            )}
                    </div>
                    <Button type="submit" className="w-full">
                        Kirim
                    </Button>
                </form>
            </Modal>

            <section className="md:pb-6 md:pt-8">
                {/* ======== shown on mobile ======== */}
                <div className="h-300px md:hidden relative">
                    {isLoadingDetailProduct ? (
                        <div className="bg-gray-300 animate-pulse h-[300px]"></div>
                    ) : (
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
                    )}
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
                            {isLoadingDetailProduct ? (
                                <div className="h-[27.25rem] rounded-2xl bg-gray-300 animate-pulse" />
                            ) : (
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
                            )}
                        </div>
                        <div className="col-span-5 space-y-4 md:space-y-6">
                            <div className="px-4 pt-4 pb-6 shadow-low rounded-2xl bg-white">
                                {isLoadingDetailProduct ? (
                                    <h1 className="mb-1 md:mb-2 bg-gray-300 text-gray-300 w-max animate-pulse">
                                        placeholder product title
                                    </h1>
                                ) : (
                                    <h1 className="font-medium mb-1 md:mb-2">
                                        {productName}
                                    </h1>
                                )}
                                {isLoadingDetailProduct ? (
                                    <h2 className="mb-2 md:mb-4 bg-gray-300 text-gray-300 w-max animate-pulse">
                                        placeholder
                                    </h2>
                                ) : (
                                    <h2 className="mb-2 md:mb-4 text-neutral-neutral03">
                                        {categoryName}
                                    </h2>
                                )}
                                {isLoadingDetailProduct ? (
                                    <h2 className="bg-gray-300 text-gray-300 w-max animate-pulse">
                                        Rp placeholder{" "}
                                    </h2>
                                ) : (
                                    <h2>Rp {formatRupiah(price)} </h2>
                                )}

                                {isAuthenticated && !isLoadingDetailProduct && (
                                    <div className="md:space-y-3.5 md:mt-6">
                                        {/* ======== if seller ======== */}
                                        {addedBy !== email ? (
                                            <>
                                                {negotiationStatus ===
                                                "Waiting" ? (
                                                    <Button
                                                        isDisabled={true}
                                                        className="w-full hidden md:block"
                                                    >
                                                        Menunggu respon penjual
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={handleNego}
                                                        className="w-full hidden md:block"
                                                    >
                                                        Saya tertarik dan Ingin
                                                        Nego
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {/* {!published && (
                                                    <Button
                                                        type="button"
                                                        onClick={
                                                            publishNewProduct
                                                        }
                                                        className="w-full hidden md:block"
                                                    >
                                                        Terbitkan
                                                    </Button>
                                                )} */}
                                                {!sold ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            onClick={
                                                                handleDelete
                                                            }
                                                            className="w-full hidden md:block"
                                                        >
                                                            Hapus
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/edit_product/${productId}`
                                                                )
                                                            }
                                                            className="w-full hidden md:block"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        isDisabled={true}
                                                        variant="secondary"
                                                        className="w-full hidden md:block"
                                                    >
                                                        Terjual
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 shadow-low rounded-2xl flex items-center space-x-4 bg-white">
                                <div className="h-12 w-12">
                                    {isLoadingDetailProduct ? (
                                        <div className="h-full w-full bg-gray-300 animate-pulse rounded-xl" />
                                    ) : (
                                        <img
                                            src={photoProfile}
                                            alt="avatar"
                                            className="object-cover h-full w-full rounded-xl"
                                        />
                                    )}
                                </div>
                                <div className="">
                                    {isLoadingDetailProduct ? (
                                        <h1 className="bg-gray-300 text-gray-300 animate-pulse mb-1 text-sm">
                                            Placeholder
                                        </h1>
                                    ) : (
                                        <h1 className="font-medium mb-1 text-sm">
                                            {userName}
                                        </h1>
                                    )}
                                    {isLoadingDetailProduct ? (
                                        <h2 className="bg-gray-300 text-gray-300 animate-pulse text-xs">
                                            Placeholder
                                        </h2>
                                    ) : (
                                        <h2 className="text-neutral-neutral03 text-xs">
                                            {city}
                                        </h2>
                                    )}
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
                                {isLoadingDetailProduct ? (
                                    <p className="text-gray-300 bg-gray-300 animate-pulse">
                                        Lorem Ipsum is simply dummy text.
                                    </p>
                                ) : (
                                    <p>{description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isAuthenticated && !isLoadingDetailProduct && (
                <>
                    {/* ======== if u want to nego ======== */}
                    {addedBy !== email ? (
                        <Button
                            onClick={handleNego}
                            className="w-[90%] left-1/2 transform -translate-x-1/2 fixed bottom-8 md:hidden"
                        >
                            Saya tertarik dan Ingin Nego
                        </Button>
                    ) : (
                        <div className="w-[90%] left-[5%] fixed bottom-8 md:hidden flex space-x-4">
                            {!sold ? (
                                <Button
                                    onClick={() =>
                                        navigate(`/edit_product/${productId}`)
                                    }
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Edit
                                </Button>
                            ) : (
                                <Button
                                    isDisabled={true}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Terjual
                                </Button>
                            )}
                            {/* {!published && (
                                <Button
                                    type="button"
                                    onClick={publishNewProduct}
                                    className="w-full"
                                >
                                    Terbitkan
                                </Button>
                            )} */}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Product;
