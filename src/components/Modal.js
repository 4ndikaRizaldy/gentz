// prettier-ignore
const SvgCloseBtn = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_158_5374)">
            <path d="M23 11L11 23" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 11L23 23" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
            <filter id="filter0_d_158_5374" x="-5" y="-5" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_158_5374"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_158_5374" result="shape"/>
            </filter>
        </defs>
    </svg>
)

const Modal = ({ isOpen = false, onClose, children }) => {
    return (
        /* ======== modal container ======== */
        <section
            className={`${
                isOpen ? "visible opacity-1" : "invisible opacity-0"
            } fixed w-full h-full left-0 top-0 bottom-0 right-0 flex justify-center items-end md:items-center z-40 transition-all duration-300`}
        >
            {/* ======== overlay black modal ======== */}
            <div
                className="bg-black opacity-50 absolute w-full h-full left-0 right-0 top-0 bottom-0"
                onClick={onClose}
            />
            {/* ======== actual modal ======== */}
            <div
                className={`${
                    isOpen
                        ? "translate-y-0 md:translate-y-0"
                        : "translate-y-full md:translate-y-0"
                } transition-all duration-500 font-poppins w-full md:w-[360px] pt-4 px-8 pb-6 bg-white rounded-t-2xl md:rounded-2xl max-h-4/5 z-50 overflow-auto relative `}
            >
                {/* ======== gray bar on mobile ======== */}
                <div className="bg-[#C4C4C4] rounded-[20px] w-[60px] h-[6px] mb-[18px] mx-auto md:hidden" />
                {/* ======== close button on desktop ======== */}
                <button
                    className="ml-auto hidden md:block mb-4"
                    onClick={onClose}
                >
                    <SvgCloseBtn />
                </button>
                {children}
            </div>
        </section>
    );
};

export default Modal;
