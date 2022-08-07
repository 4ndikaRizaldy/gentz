import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { updateProfile, changePassword } from "../features/user/userSlice";
// import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Password = () => {
    document.title = "Password Page";

    const { id, oldPassword, newPassword, retrypePassword } = useSelector(
        (store) => store.user
    );

    const initialValues = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        retrypePassword: retrypePassword,
}

const navigate = useNavigate();
const dispatch = useDispatch();

const validationSchema = () => {
    const validationObject = {
        oldPassword: Yup.string()
            .required("Tolong masukkan password lama"),
        newPassword: Yup.string()
        .required("Masukkan password baru")
        .min(6, "Password minimal 6 karakter"),
        retrypePassword: Yup.string().required(
            "Tolong masukkan ulang password Anda"
        ),
    };
    return Yup.object().shape(validationObject);
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            values.userId = id.toString();

            if (oldPassword === "") {
                values.image = null;
            }

            toast.loading("Memperbarui password . . .");
            dispatch(updateProfile(values))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Berhasil mengganti password!");
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
};

function ChangePassword() {
  return (
    
    <Form>
            <Navbar
                showSearchInput={false}
                titleSearch="Ganti Password Akun"
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
                    <fieldset className="flex flex-col mt-4 space-y-1">
                        <label>
                            Password Lama <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="oldPassword"
                            type="text"
                            />
                    </fieldset>
                    <fieldset className="flex flex-col mt-4 space-y-1">
                        <label>
                            Password Baru <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="newPassword"
                            type="text"
                            />
                    </fieldset>
                    <fieldset className="flex flex-col mt-4 space-y-1">
                        <label>
                            Konfirmasi Password <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="retrypePassword"
                            type="text"
                            />
                    </fieldset>
                    <div className="w-full mt-6 flex space-x-2">
                            <Button type="submit" className="grow">
                                Simpan
                            </Button>
                        </div>
                </div>
            </section>
      </Form>
  );
}

export default ChangePassword;