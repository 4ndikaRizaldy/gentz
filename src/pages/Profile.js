import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Select from "../components/Select";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import regions from "../data/regions.json";

import { useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { logout, updateProfile } from "../features/user/userSlice";

// prettier-ignore
const SvgCamera = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#7126B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#7126B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const Profile = () => {
    document.title = "Profile Page";

    const { id, fullName, address, phoneNumber, imageUrl } = useSelector(
        (store) => store.user
    );
    const navigate = useNavigate();

    let tempRegion = address;
    let tempCity;

    /* 
        if user's city is not exist, set it to default value which
        is the first region
    */
    if (!tempRegion) {
        tempRegion = regions[0];
        tempCity = tempRegion.kota[0];
    } else {
        // check if the user's city is registered on the dataset
        tempCity = tempRegion.city;
        tempRegion = regions.find((region) =>
            region.kota.find((city) => city === tempRegion.city)
        );

        /* 
            if user's city is exist but not registered, 
            set it to default value which
            is the first region
        */
        if (!tempRegion) {
            tempRegion = regions[0];
            tempCity = tempRegion.kota[0];
        }
    }

    const [selectedRegion, setSelectedRegion] = useState(tempRegion);
    const allProvinces = regions.map((region) => region.provinsi);
    const [fileAvatar, setFileAvatar] = useState("");

    const dispatch = useDispatch();

    const initialValues = {
        name: fullName,
        city: tempCity,
        street: address ? address.street : "",
        phoneNumber: phoneNumber ? phoneNumber : "",
        image: imageUrl ? imageUrl : "",
    };
    const validationSchema = () => {
        const validationObject = {
            name: Yup.string()
                .required("Tolong masukkan nama lengkap anda")
                .matches(/^[\A-Za-z\s]+$/, "Tolong hanya masukkan alphabet"),
            city: Yup.string().required(),
            street: Yup.string().required(
                "Tolong masukkan alamat lengkap anda"
            ),
            phoneNumber: Yup.string()
                .required("Tolong masukkan nomor handphone anda")
                .matches(/^[\0-9]+$/, "Tolong hanya masukkan angka")
                .min(11, "Nomor handphone minimal 11 angka")
                .max(13, "Nomor handphone maksimal 13 angka"),
            image: Yup.string().required("Tolong pilih Avatar"),
        };
        return Yup.object().shape(validationObject);
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            values.userId = id.toString();

            if (fileAvatar === "") {
                values.image = null;
            }

            toast.loading("Memperbarui profil . . .");
            dispatch(updateProfile(values))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Berhasil memperbarui profil!");
                    navigate("/");
                });
        },
    });

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
    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];
        // console.log("debug", file);
        if (file) {
            if (file.size / 1000000 <= 2) {
                formik.setFieldValue("image", file);
                FiletoDataURL(e.target.files[0], (result) => {
                    // formik.setFieldValue("image", result);
                    setFileAvatar(result);
                });
            } else {
                formik.setFieldError("image", "Maksimal ukuran file 2 Mb");
            }
        }
    };
    const handleChangeProvince = (e) => {
        setSelectedRegion(
            regions.find((region) => region.provinsi === e.target.value)
        );
    };
    const handleLogout = () => {
        dispatch(logout());
        toast.error("Berhasil logout!");
    };

    return (
        <>
            <Navbar
                showSearchInput={false}
                titleSearch="Lengkapi Info Akun"
                showOnMobile={false}
            />
            <section className="pt-5 md:pt-8">
                <div className="container-small relative">
                    <Link
                        to="/"
                        className="absolute md:-left-76px block w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                        {/* prettier-ignore  */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19L5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                    <p className="text-center font-medium mb-10 md:hidden pt-1">
                        Lengkapi Info Akun
                    </p>
                    <form
                        onSubmit={formik.handleSubmit}
                        method="POST"
                        encType="multipart/form-data"
                    >
                        <fieldset>
                            <label
                                htmlFor="image"
                                className="w-24 h-24 flex items-center justify-center mx-auto rounded-lg bg-primary-darkblue01"
                            >
                                {/* prettier-ignore  */}
                                {formik.values.image === "" ||
                                !formik.values.image ? (
                                    <SvgCamera />
                                ) : (
                                    <img
                                        src={
                                            fileAvatar === ""
                                                ? formik.values.image
                                                : fileAvatar
                                        }
                                        className={` h-full w-full object-cover rounded-lg`}
                                    />
                                )}
                            </label>
                            <input
                                name="image"
                                id="image"
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpg, image/jpeg"
                                onChange={handleChangeAvatar}
                                onClick={(e) => (e.target.value = "")}
                            />
                            {formik.touched.image && formik.errors.image && (
                                <p className="mt-1 text-sm text-red-500 text-center">
                                    {formik.errors.image}
                                </p>
                            )}
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label>
                                Nama <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nama"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <span className="text-sm text-red-500">
                                    {formik.errors.name}
                                </span>
                            )}
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label>Pilih Provinsi</label>
                            <Select
                                name="province"
                                value={selectedRegion.provinsi}
                                onChange={handleChangeProvince}
                            >
                                {allProvinces.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </Select>
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label>Pilih Kota</label>
                            <Select
                                name="city"
                                value={formik.values.city}
                                onChange={(e) =>
                                    formik.setFieldValue("city", e.target.value)
                                }
                            >
                                {selectedRegion.kota.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </Select>
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label>
                                Alamat <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="street"
                                type="text"
                                placeholder="Contoh: Jalan Ikan Hiu 33"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.street}
                            />
                            {formik.touched.street && formik.errors.street && (
                                <span className="text-sm text-red-500">
                                    {formik.errors.street}
                                </span>
                            )}
                        </fieldset>
                        <fieldset className="flex flex-col mt-4 space-y-1">
                            <label>
                                No Handphone
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                name="phoneNumber"
                                placeholder="Contoh: +6282222222"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phoneNumber}
                            />
                            {formik.touched.phoneNumber &&
                                formik.errors.phoneNumber && (
                                    <span className="text-sm text-red-500">
                                        {formik.errors.phoneNumber}
                                    </span>
                                )}
                        </fieldset>
                        <div className="w-full mt-6 flex space-x-2">
                            <Button
                                type="button"
                                className="grow"
                                variant="secondary"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                            <Button type="submit" className="grow">
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Profile;
