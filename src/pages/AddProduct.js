import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addProduct, updateProduct } from "../features/product/productSlice";
import { getProductDetails } from "../features/product/transactionProductSlice";
import { setPreviewProduct } from "../features/product/previewSlice";

const categories = [
    { value: 1, key: "Hobi" },
    { value: 2, key: "Kendaraan" },
    { value: 3, key: "Baju" },
    { value: 4, key: "Elektronik" },
    { value: 5, key: "Kesehatan" },
];

const AddProduct = () => {
    const location = useLocation();
    if (location.pathname.includes("edit_product"))
        document.title = "Edit Product";
    else document.title = "Add Product";

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* ======== for changing categories ======== */
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const handleChangeCategory = (e) => {
        // console.log(e.target.value);
        setSelectedCategory(
            categories.find(
                (category) => category.value === parseInt(e.target.value)
            )
        );
        formik.setFieldValue("categoryId", e.target.value);
    };

    /* ======== for changing upload product ======== */
    const [previewProductImages, setPreviewProductImages] = useState([]);
    const FiletoDataURL = (file, callback) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result);
        };
        reader.onerror = function (error) {
            toast.error(error);
        };
    };
    const handleUploadProdct = (e) => {
        const files = e.target.files;
        setPreviewProductImages([]);
        // console.log(e);

        // reset error message
        formik.setFieldError("images", "");
        formik.setFieldValue("images", "");

        // if users upload more than 4 images
        if (files.length > 4) {
            formik.setFieldError("images", "Hanya bisa mengunggah 4 gambar");
            formik.setFieldTouched("images", true);
        } else {
            // set data url images for previews
            [...Array(files.length)].forEach((item, index) => {
                FiletoDataURL(files[index], (result) => {
                    setPreviewProductImages((prevState) => [
                        ...prevState,
                        result,
                    ]);
                });
            });
            // set formik value
            formik.setFieldValue("images", files, files.length <= 4);
        }
    };

    /* ======== formik stuff ======== */
    const initialValues = {
        productName: "",
        price: "",
        categoryId: categories[0].value,
        description: "",
        images: "",
    };

    const validationSchema = () => {
        const validationObject = {
            productName: Yup.string().required("Masukkan nama produk"),
            price: Yup.string()
                .required("Tolong masukkan harga produk")
                .matches(/^[0-9]*$/, "Tolong hanya masukkan angka"),
            description: Yup.string()
                .required("Tolong masukkan deskripsi produk")
                .max(300, "Batas maksimum deskripsi adalah 300 karakter"),
            images: Yup.string().required(
                "Tolong masukkan gambar produk (Maks 4)"
            ),
        };
        return Yup.object().shape(validationObject);
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("categoryId", values.categoryId);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("productName", values.productName);

            [...Array(values.images.length)].forEach((item, index) => {
                formData.append("images", values.images[index]);
            });

            if (location.pathname.includes("edit_product")) {
                formData.append("productId", id);

                if (values.images === "placeholder")
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
        },
    });

    /* ======== for edit product ======== */
    useEffect(() => {
        if (location.pathname.includes("edit_product")) {
            dispatch(getProductDetails(id))
                .unwrap()
                .then((payload) => {
                    formik.setFieldValue("productName", payload.productName);
                    formik.setFieldValue("price", payload.price);
                    formik.setFieldValue("description", payload.description);

                    const category = categories.find(
                        (category) => category.key === payload.categoryName
                    );
                    setSelectedCategory(category);
                    formik.setFieldValue("categoryId", category.value);

                    // set data url images for previews
                    setPreviewProductImages(payload.productImages);
                    formik.setFieldValue("images", "placeholder");
                });
        }
    }, []);

    /* ======== handle preview ======== */
    const { fullName, imageUrl, address } = useSelector((state) => state.user);
    const handlePreview = () => {
        const { productName, price, categoryId, description, images } =
            formik.values;
        if (
            productName === "" ||
            price === "" ||
            description === "" ||
            images === ""
        )
            toast.error("Tolong lengkapi semua data");
        else {
            const previewProduct = {
                productId: location.pathname.includes("edit_product") ? id : -1,
                productName,
                price,
                categoryId,
                description,
                productImages: previewProductImages,
                realProductImages: images,
                userName: fullName,
                photoProfile: imageUrl,
                city: address.city,
            };
            dispatch(setPreviewProduct(previewProduct));
            navigate("/preview");
        }
    };

    return (
        <>
            <Navbar
                showSearchInput={false}
                titleSearch="Lengkapi Detail Produk"
                showOnMobile={false}
            />
            <section className="pt-5 md:pt-8 pb-8">
                <div className="container-small relative">
                    <Link
                        to="/"
                        className="absolute md:-left-76px w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                        {/* prettier-ignore  */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19L5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                    <p className="text-center font-medium mb-10 md:hidden pt-1">
                        Lengkapi Detail Produk
                    </p>
                    <form
                        onSubmit={formik.handleSubmit}
                        method="POST"
                        encType="multipart/form-data"
                    >
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label htmlFor="productName">
                                Nama Produk{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                id="productName"
                                name="productName"
                                placeholder="Nama Produk"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productName}
                            />
                            {formik.touched.productName &&
                                formik.errors.productName && (
                                    <span className="text-sm text-red-500">
                                        {formik.errors.productName}
                                    </span>
                                )}
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label htmlFor="price">
                                Harga Produk{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                id="price"
                                name="price"
                                placeholder="Harga Produk"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                            />
                            {formik.touched.price && formik.errors.price && (
                                <span className="text-sm text-red-500">
                                    {formik.errors.price}
                                </span>
                            )}
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label htmlFor="categoryId">Kategori</label>
                            <Select
                                id="categoryId"
                                name="categoryId"
                                value={selectedCategory.value}
                                onChange={handleChangeCategory}
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category.key}
                                        value={category.value}
                                    >
                                        {category.key}
                                    </option>
                                ))}
                            </Select>
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label htmlFor="description">
                                Deskripsi{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Deskripsi produk"
                                rows="3"
                                cols="50"
                                style={{ resize: "none" }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                            />
                            {formik.touched.description &&
                                formik.errors.description && (
                                    <span className="text-sm text-red-500">
                                        {formik.errors.description}
                                    </span>
                                )}
                        </fieldset>
                        <fieldset className="mt-4">
                            <p className="mb-1">
                                Foto Produk (Maks 4){" "}
                                <span className="text-red-500">*</span>
                            </p>
                            <div className="flex space-x-2">
                                {previewProductImages.map((image, index) => (
                                    <div
                                        key={index}
                                        htmlFor="images"
                                        className=" w-24 h-24 flex items-center justify-center rounded-lg border bg-white hover:bg-gray-100 transition"
                                    >
                                        <img
                                            src={image}
                                            className="object-cover h-full w-full rounded-lg"
                                        />
                                    </div>
                                ))}
                                {previewProductImages.length <= 4 && (
                                    <div>
                                        <input
                                            type="file"
                                            id="images"
                                            name="images"
                                            accept="image/png, image/jpg, image/jpeg"
                                            className="h-full w-full hidden"
                                            multiple
                                            onBlur={formik.handleBlur}
                                            onChange={handleUploadProdct}
                                            onClick={(e) =>
                                                (e.target.value = "")
                                            }
                                        />
                                        <label
                                            htmlFor="images"
                                            className=" w-24 h-24 flex items-center justify-center rounded-lg border-2 border-dashed bg-white hover:bg-gray-100 transition"
                                        >
                                            {/* prettier-ignore  */}
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 5V19" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M5 12H19" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </label>
                                    </div>
                                )}
                            </div>
                            {formik.touched.images && formik.errors.images && (
                                <span className="text-sm text-red-500">
                                    {formik.errors.images}
                                </span>
                            )}
                        </fieldset>
                        <div className="flex flex-row items-start mt-6 gap-4">
                            <Button
                                type="button"
                                onClick={handlePreview}
                                className="w-64"
                                variant="secondary"
                            >
                                Preview
                            </Button>
                            <Button type="submit" className="w-64 ">
                                {location.pathname.includes("edit_product")
                                    ? "Perbarui"
                                    : "Terbitkan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AddProduct;
