const Textarea = ({ ...props }) => {
    return (
        <textarea
            {...props}
            className="rounded-2xl border-transparent flex-1 appearance-none border border-neutral-neutral02 w-full py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-darkblue03 focus:border-transparent"
        />
    );
};

export default Textarea;
