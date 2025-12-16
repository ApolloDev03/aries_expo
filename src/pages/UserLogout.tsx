import { useNavigate } from "react-router-dom";

export default function Logout() {
    const nav = useNavigate();

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 p-4">

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md text-center p-10">

                {/* Tea Icon / Illustration */}
                <div className="flex justify-center mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-24 h-24"
                        fill="#bf7e4e"
                        viewBox="0 0 24 24"
                    >
                        <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H8c-1.1 0-2 .9-2 2v4h2V5h11v14H8v-4H6v4c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                    </svg>

                </div>

                {/* Heading */}
                <h2 className="text-2xl font-semibold text-gray-800">
                    You are Logged Out
                </h2>

                {/* Subtext */}
                <p className="text-gray-500 mt-2 mb-8">
                    Thanks for Visiting
                </p>

                {/* Sign In button */}
                <button
                    onClick={() => nav("/")}
                    className="w-full py-3 bg-[#bf7e4e] text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
}
