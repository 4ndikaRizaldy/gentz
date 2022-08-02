import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { register } from "../features/user/userSlice";
import { Link } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialValues = {
        fullName: "",
        email: "",
        password: "",
    };
    const validationSchema = () => {
        const validationObject = {
            fullName: Yup.string().required(
                "Tolong masukkan nama lengkap anda"
            ),
            email: Yup.string()
                .email("Email tidak valid")
                .required("Tolong masukkan email"),
            password: Yup.string().required("Tolong masukkan password"),
        };
        return Yup.object().shape(validationObject);
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            toast.loading("Signing up . . .");
            dispatch(register(values))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Register berhasil!");
                    navigate("/");
                });
        },
    });

    return (
        <section className="mx-5 font-poppins lg:grid lg:grid-cols-2 lg:mx-0">
            <img
                src="/images/banner-login.svg"
                alt="banner-login"
                className="banner-login w-full h-screen object-cover"
            />

            <div className="gap-6 flex flex-col sm:w-3/5 sm:m-auto">
                <header className="py-4 lg:hidden">
                    <Link to="/">
                        <img src="/images/fi_arrow-left.svg" alt="" />
                    </Link>
                </header>
                <h2 className="text-2xl font-bold">Daftar</h2>
                <form onSubmit={formik.handleSubmit} method="POST">
                    <fieldset className="flex flex-col gap-1">
                        <label htmlFor="fullName">
                            Nama <span className="text-red-400">*</span>
                        </label>
                        <Input
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="Nama Lengkap"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fullName}
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                            <span className="text-sm text-red-500">
                                {formik.errors.fullName}
                            </span>
                        )}
                    </fieldset>
                    <fieldset className="flex flex-col gap-1 mt-4">
                        <label htmlFor="email">
                            Email <span className="text-red-400">*</span>
                        </label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Contoh: johndee@gmail.com"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <span className="text-sm text-red-500">
                                {formik.errors.email}
                            </span>
                        )}
                    </fieldset>
                    <fieldset className="flex flex-col gap-1 mt-4">
                        <label htmlFor="password">
                            Buat Password{" "}
                            <span className="text-red-400">*</span>
                        </label>
                        <Input
                            name="password"
                            id="password"
                            placeholder="Buat password"
                            isPasswordInput={true}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <span className="text-sm text-red-500">
                                {formik.errors.password}
                            </span>
                        )}
                    </fieldset>
                    <Button type="submit" className="w-full mt-6">
                        Daftar
                    </Button>
                </form>
                <p className="link-register mt-4">
                    Sudah punya akun?
                    <Link
                        to="/login"
                        className="text-primary-darkblue04 font-bold ml-2"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
