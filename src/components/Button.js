const Button = ({
    isDisabled = false,
    className,
    variant = "primary",
    size = "normal",
    children,
    ...props
}) => {
    const sizeClass = size === "normal" ? "py-3.5 px-6" : "py-2 px-6";
    let colorClass =
        variant === "primary"
            ? "bg-primary-darkblue04 hover:bg-primary-darkblue05  text-white focus:ring-primary-darkblue04 focus:ring-offset-primary-darkblue03 focus:ring-2 focus:ring-offset-2"
            : "bg-white hover:bg-gray-300 border border-primary-darkblue04 focus:bg-gray-300";
    if (isDisabled) colorClass = "bg-neutral-neutral02 text-white";
    const customClass =
        "flex items-center justify-center transition ease-in duration-200 text-center text-sm shadow-md focus:outline-none font-medium rounded-2xl";
    return (
        <button
            className={`${sizeClass} ${colorClass} ${customClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
