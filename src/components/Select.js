const Select = ({ name, options, className, ...props }) => {
    return (
        <select
            as="select"
            id={name}
            name={name}
            className={`rounded-2xl border-transparent flex-1 border border-neutral-neutral02 w-full py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-darkblue03 focus:border-transparent ${className}`}
            {...props}
        >
            {/* {options.map(option => {
                    return(
                        <option key={option.key} value={option.value}>{option.key}</option>
                    )
                })} */}
        </select>
    );
};

export default Select;
