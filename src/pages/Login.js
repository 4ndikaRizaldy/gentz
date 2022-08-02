import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialValues = {
        email: "",
        password: "",
    };
    const validationSchema = () => {
        const validationObject = {
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
            toast.loading("Signing in . . .");
            dispatch(login(values))
                .unwrap()
                .then(() => {
                    toast.dismiss();
                    toast.success("Login berhasil!");
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
                <h2 className="text-2xl font-bold">Masuk</h2>
                <form onSubmit={formik.handleSubmit} method="POST">
                    <fieldset className="flex flex-col gap-1">
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
                            Password <span className="text-red-400">*</span>
                        </label>
                        <Input
                            name="password"
                            id="password"
                            placeholder="Masukkan password"
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
                        Masuk
                    </Button>
                </form>
                <p className="link-login mt-4">
                    Belum punya akun?
                    <Link
                        to="/register"
                        className="text-primary-darkblue04 font-bold ml-2"
                    >
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
