import { Link } from "react-router-dom";
import CardProduct from "../components/CardProduct";

const SaleListPageProduct = ({ products, isLoadingMyProducts }) => {
    return (
        <article className="w-full mt-6 md:mt-0 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Link
                to="/add_product"
                className="rounded border-2 border-neutral-neutral02 border-dashed flex hover:bg-gray-300 transition h-[198px] block"
            >
                <div className="m-auto">
                    <div className="m-auto w-max">
                        {/* prettier-ignore */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 12H19" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className="text-xs text-neutral-neutral03 mt-2">
                        Tambah Produk
                    </p>
                </div>
            </Link>
            {isLoadingMyProducts ? (
                <>
                    {[...Array(20)].map((product, index) => {
                        return (
                            <CardProduct
                                product={{ productId: index }}
                                key={index}
                            />
                        );
                    })}
                </>
            ) : (
                <>
                    {products.map((product, index) => {
                        return (
                            <CardProduct
                                isLoading={false}
                                product={product}
                                key={index}
                            />
                        );
                    })}
                </>
            )}
        </article>
    );
};

export default SaleListPageProduct;
