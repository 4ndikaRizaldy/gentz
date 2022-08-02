module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        fontFamily: {
            poppins: ["Poppins", "sans-serif"],
        },
        extend: {
            screens: {
                'xsm'   : '360px'
            },
            colors: {
                primary: {
                    darkblue05: "#4B1979",
                    darkblue04: "#7126B5",
                    darkblue03: "#A06ECE",
                    darkblue02: "#D0B7E6",
                    darkblue01: "#E2D4F0",

                    limegreen05: "#AA9B87",
                    limegreen04: "#D4C2A8",
                    limegreen03: "#FFE9CA",
                    limegreen02: "#FFF0DC",
                    limegreen01: "#FFF8ED",
                },
                alert: {
                    danger: "#FA2C5A",
                    warning: "#F9CC00",
                    succes: "#73CA5C",
                },
                neutral: {
                    neutral05: "#151515",
                    neutral04: "#3C3C3C",
                    neutral03: "#8A8A8A",
                    neutral02: "#D0D0D0",
                    neutral01: "#FFFFFF",
                },
            },
            boxShadow: {
                low: "0px 0px 4px rgba(0, 0, 0, 0.15)",
                high: "0px 0px 10px rgba(0, 0, 0, 0.15)",
            },
            borderRadius: {
                "20px": "20px",
            },
            lineHeight: {
                "56px": "56px",
            },
            spacing: {
                "76px": "76px",
                "30px": "30px",
                "116px": "116px",
                "118px": "118px",
                "300px": "300px",
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
