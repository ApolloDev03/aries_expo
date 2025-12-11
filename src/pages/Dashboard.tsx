export default function Dashboard() {
    return (
        <div className="space-y-6">

            {/* TITLE */}
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>


            {/* TOP CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1 */}
                <div className="bg-white rounded-xl p-6 shadow border-l-4 border-orange-500">
                    <h2 className="text-sm text-gray-500">Total Cities</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">18</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl p-6 shadow border-l-4 border-blue-500">
                    <h2 className="text-sm text-gray-500">Industries Added</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">42</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-xl p-6 shadow border-l-4 border-green-500">
                    <h2 className="text-sm text-gray-500">Upcoming Expo</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">1</p>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-xl p-6 shadow border-l-4 border-purple-500">
                    <h2 className="text-sm text-gray-500">Registered Users</h2>
                    <p className="text-3xl font-bold text-gray-800 mt-2">659</p>
                </div>
            </div>


            {/* GRAPH + DATA SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* GRAPH PLACEHOLDER */}
                <div className="col-span-2 bg-white shadow rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Visitor Registration Trend</h2>

                    {/* YOU WILL PLACE REAL CHART HERE LATER */}
                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                        Chart Placeholder
                    </div>
                </div>

                {/* STATS LIST */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Expo Stats</h2>

                    <ul className="space-y-4">
                        <li className="flex justify-between text-gray-700">
                            <span>Total Exhibitors</span>
                            <span className="font-semibold">120</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span>Booths Booked</span>
                            <span className="font-semibold">98</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span>Speakers Confirmed</span>
                            <span className="font-semibold">12</span>
                        </li>
                        <li className="flex justify-between text-gray-700">
                            <span>Volunteers</span>
                            <span className="font-semibold">34</span>
                        </li>
                    </ul>
                </div>
            </div>



            {/* TABLE SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today Visitor Registration */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Today Visitor Registration
                    </h2>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-right">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="p-3">Ramesh Patel</td>
                                <td className="p-3 text-right font-semibold text-blue-600">12</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="p-3">Mehul Shah</td>
                                <td className="p-3 text-right font-semibold text-blue-600">7</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-3">Komal Desai</td>
                                <td className="p-3 text-right font-semibold text-blue-600">9</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Today Exhibitor Registration */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Today Exhibitor Registration
                    </h2>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-right">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="p-3">Jatin Kumar</td>
                                <td className="p-3 text-right font-semibold text-blue-600">5</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="p-3">Naresh Modi</td>
                                <td className="p-3 text-right font-semibold text-blue-600">3</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-3">Bhavika Shah</td>
                                <td className="p-3 text-right font-semibold text-blue-600">11</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
}
