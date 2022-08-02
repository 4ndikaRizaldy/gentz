import { Link } from "react-router-dom";

const categories = [
    { id: 0, name: "Semua" },
    { id: 1, name: "Hobi" },
    { id: 2, name: "Kendaraan" },
    { id: 3, name: "Baju" },
    { id: 4, name: "Elektronik" },
    { id: 5, name: "Kesehatan" },
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

const CardProduct = ({ isLoading = true, product, goToOffersPage = false }) => {
    if (isLoading)
        return (
            <div className="rounded shadow-low px-2 pt-2 pb-4 animate-pulse">
                <div className="mb-2 h-[100px] w-full bg-gray-300 rounded" />
                <h2 className="text-sm mb-1 bg-gray-300 text-gray-300 w-min">
                    placeholder
                </h2>
                <h3 className="text-xs mb-2 bg-gray-300 text-gray-300 w-min">
                    placeholder
                </h3>
                <h3 className="text-sm bg-gray-300 text-gray-300 w-max">
                    Rp 250.000
                </h3>
            </div>
        );

    const { productId, productName, price, categoryId, productImages } =
        product;
    return (
        <Link
            to={
                goToOffersPage
                    ? `/offers/${productId}`
                    : `/product/${productId}`
            }
            className="h-full"
        >
            <div className="rounded shadow-low px-2 pt-2 pb-4 transform hover:scale-105 transition h-full">
                <div className="mb-2 h-[100px]">
                    <img
                        src={productImages[0]}
                        className="h-full w-full object-cover rounded"
                        alt=""
                    />
                </div>
                <h2 className="text-sm mb-1">{productName}</h2>
                <h3 className="text-xs text-neutral-neutral03 mb-2">
                    {categories.find(({ id }) => id === categoryId).name}
                </h3>
                <h3 className="text-sm">Rp {formatRupiah(price)}</h3>
            </div>
        </Link>
    );
};

export default CardProduct;
