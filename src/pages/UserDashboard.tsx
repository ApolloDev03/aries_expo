export default function UserDashboard() {
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
                <p className="text-white/80 mt-1">Here's what's happening today</p>
            </div>

            {/* TOP USER STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card 1 */}
                <div className="bg-white shadow rounded-xl p-6 border-l-4 border-blue-500">
                    <h2 className="text-sm text-gray-500">Your Registered Exhibitions</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white shadow rounded-xl p-6 border-l-4 border-green-500">
                    <h2 className="text-sm text-gray-500">Tickets Downloaded</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">7</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white shadow rounded-xl p-6 border-l-4 border-purple-500">
                    <h2 className="text-sm text-gray-500">Upcoming Events</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">2</p>
                </div>

            </div>

            {/* UPCOMING EXPO */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                    Upcoming Expo For You
                </h2>

                <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                        🎪
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Mega Industrial Expo 2025</h3>
                        <p className="text-gray-600 mt-1">Ahmedabad Exhibition Ground</p>
                        <p className="text-gray-500 text-sm mt-1">12 January 2025</p>

                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* RECENT ACTIVITY + QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Recent Activity */}
                <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Recent Activity
                    </h2>

                    <ul className="space-y-4">
                        <li className="flex justify-between text-gray-700 border-b pb-2">
                            <span>Registered for Industrial Expo 2025</span>
                            <span className="text-sm text-gray-500">2 days ago</span>
                        </li>
                        <li className="flex justify-between text-gray-700 border-b pb-2">
                            <span>Updated Profile Details</span>
                            <span className="text-sm text-gray-500">1 week ago</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span>Downloaded Entry Pass</span>
                            <span className="text-sm text-gray-500">3 weeks ago</span>
                        </li>
                    </ul>
                </div>

                {/* Quick Support */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Need Help?
                    </h2>

                    <p className="text-gray-600 mb-4">
                        Our support team is here for you.
                    </p>

                    <button className="bg-green-600 w-full text-white py-2 rounded-lg shadow hover:bg-green-700 transition">
                        Contact Support
                    </button>

                    <button className="mt-3 bg-gray-700 w-full text-white py-2 rounded-lg shadow hover:bg-gray-800 transition">
                        FAQs
                    </button>
                </div>

            </div>
        </div>
    );
}
