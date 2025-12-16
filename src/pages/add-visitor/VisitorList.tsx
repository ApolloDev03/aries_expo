// import EditIcon from "@mui/icons-material/Edit";
// import { useState } from "react";

// const visitors = [
//   {
//     id: 1,
//     mobile: "9876543210",
//     company: "ABC Pvt Ltd",
//     name: "Rahul Sharma",
//     email: "rahul@abc.com",
//     state: "Gujarat",
//     city: "Ahmedabad",
//   },
//   {
//     id: 2,
//     mobile: "9123456780",
//     company: "XYZ Solutions",
//     name: "Neha Patel",
//     email: "neha@xyz.com",
//     state: "Maharashtra",
//     city: "Mumbai",
//   },
// ];

// export default function VisitorList() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedVisitor, setSelectedVisitor] = useState<any>(null);

//   const stateCityMap: Record<string, string[]> = {
//     Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//     Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//     Rajasthan: ["Jaipur", "Udaipur"],
//   };


//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Visitor List</h1>

//       <div className="overflow-x-auto border rounded-lg">
//         <table className="w-full border-collapse text-md">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-1 border w-16 text-center">Sr. No.</th>
//               <th className="p-1 border">Mobile</th>
//               <th className="p-1 border">Company Name</th>
//               <th className="p-1 border">Name</th>
//               <th className="p-1 border">Email</th>
//               <th className="p-1 border">State</th>
//               <th className="p-1 border">City</th>
//               <th className="p-1 border text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {visitors.map((v, index) => (
//               <tr key={v.id} className="hover:bg-gray-50">
//                 <td className="p-1 border text-center font-medium">
//                   {index + 1}
//                 </td>
//                 <td className="p-1 border">{v.mobile}</td>
//                 <td className="p-1 border">{v.company}</td>
//                 <td className="p-1 border">{v.name}</td>
//                 <td className="p-1 border">{v.email}</td>
//                 <td className="p-1 border">{v.state}</td>
//                 <td className="p-1 border">{v.city}</td>
//                 <td className="p-1 border text-center">
//                   <button
//                     className="text-blue-600 hover:text-blue-800"
//                     title="Edit"
//                     onClick={() => {
//                       setSelectedVisitor(v);
//                       setIsOpen(true);
//                     }}
//                   >
//                     <EditIcon fontSize="small" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {isOpen && selectedVisitor && (
//           <div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             onClick={() => setIsOpen(false)} // ✅ close on outside click
//           >
//             <div
//               className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
//               onClick={(e) => e.stopPropagation()} // ❌ prevent close inside
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Edit Visitor</h2>

//                 {/* ❌ Close icon */}
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-500  hover:text-gray-700 text-2xl font-bold"
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-4 text-md">
//                 {/* Mobile */}
//                 <div>
//                   <label className="font-medium">Mobile Number</label>
//                   <input
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.mobile}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         mobile: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Company */}
//                 <div>
//                   <label className="font-medium">Company Name</label>
//                   <input
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.company}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         company: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Name */}
//                 <div>
//                   <label className="font-medium">Name</label>
//                   <input
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.name}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         name: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="font-medium">Email</label>
//                   <input
//                     type="email"
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.email}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         email: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {/* State */}
//                 <div>
//                   <label className="font-medium">State</label>
//                   <select
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.state}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         state: e.target.value,
//                         city: "",
//                       })
//                     }
//                   >
//                     <option value="">Select State</option>
//                     {Object.keys(stateCityMap).map((state) => (
//                       <option key={state} value={state}>
//                         {state}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* City */}
//                 <div>
//                   <label className="font-medium">City</label>
//                   <select
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.city}
//                     disabled={!selectedVisitor.state}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         city: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="">Select City</option>
//                     {selectedVisitor.state &&
//                       stateCityMap[selectedVisitor.state]?.map((city) => (
//                         <option key={city} value={city}>
//                           {city}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 border rounded hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={() => {
//                     console.log("Updated Data:", selectedVisitor);
//                     setIsOpen(false);
//                   }}
//                   className="px-4 py-2 bg-[#2e56a6] text-white rounded"
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}


//       </div>
//     </div>
//   );
// }


// import EditIcon from "@mui/icons-material/Edit";
// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// type ApiVisitor = {
//   visitorid: number;
//   mobileno: string;
//   companyname: string;
//   name: string;
//   email: string;
//   stateid: number;
//   cityid: number;
//   stateName: string;
//   cityName: string;
// };

// type VisitorRow = {
//   id: number;
//   mobile: string;
//   company: string;
//   name: string;
//   email: string;
//   state: string;
//   city: string;
//   stateid?: number;
//   cityid?: number;
// };


// export default function VisitorList() {
//   // ✅ label comes from path: /users/visitors-list/:label
//   const { label } = useParams<{ label: string }>();

//   const [loading, setLoading] = useState(false);
//   const [rows, setRows] = useState<VisitorRow[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);

//   // ⚠️ demo mapping (your real project may fetch state/city master from API)
//   const stateCityMap: Record<string, string[]> = {
//     Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//     Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//     Rajasthan: ["Jaipur", "Udaipur"],
//     Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Alappuzha"],
//   };

//   // ✅ userid from localStorage or set fixed if you want
//   const userId = useMemo(() => {
//     return localStorage.getItem("userid") || "3";
//   }, []);

//   const fetchVisitors = async (lbl?: string) => {
//     setLoading(true);
//     setErrorMsg("");
//     try {
//       const res = await axios.post(`${apiUrl}/Visitor/list`, {
//         userid: userId,
//         label: lbl || label || "TotalVisitors",
//       });

//       if (res.data?.success) {
//         const data: ApiVisitor[] = res.data?.data || [];
//         const mapped: VisitorRow[] = data.map((v) => ({
//           id: v.visitorid,
//           mobile: v.mobileno,
//           company: v.companyname,
//           name: v.name,
//           email: v.email,
//           state: v.stateName,
//           city: v.cityName,
//           stateid: v.stateid,
//           cityid: v.cityid,
//         }));
//         setRows(mapped);
//       } else {
//         setRows([]);
//         setErrorMsg(res.data?.message || "Visitor not found");
//       }
//     } catch (err: any) {
//       setRows([]);
//       setErrorMsg(err?.response?.data?.message || "API error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ whenever label changes in URL, refetch
//   useEffect(() => {
//     fetchVisitors(label);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [label, userId]);

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-2xl font-semibold">Visitor List</h1>
//           <p className="text-sm text-gray-600 mt-1">
//             Label: <span className="font-medium">{label || "TotalVisitors"}</span>
//           </p>
//         </div>

//         <button
//           onClick={() => fetchVisitors(label)}
//           className="px-4 py-2 bg-[#2e56a6] text-white rounded"
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="overflow-x-auto border rounded-lg bg-white">
//         {loading && (
//           <div className="p-4 text-gray-600 flex items-center gap-2">
//             <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
//             Loading visitors...
//           </div>
//         )}

//         {!loading && errorMsg && (
//           <div className="p-4 text-red-600 font-medium">{errorMsg}</div>
//         )}

//         {!loading && !errorMsg && (
//           <table className="w-full border-collapse text-md">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border w-16 text-center">Sr. No.</th>
//                 <th className="p-2 border">Mobile</th>
//                 <th className="p-2 border">Company Name</th>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">State</th>
//                 <th className="p-2 border">City</th>
//                 <th className="p-2 border text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((v, index) => (
//                 <tr key={v.id} className="hover:bg-gray-50">
//                   <td className="p-2 border text-center font-medium">{index + 1}</td>
//                   <td className="p-2 border">{v.mobile}</td>
//                   <td className="p-2 border">{v.company}</td>
//                   <td className="p-2 border">{v.name}</td>
//                   <td className="p-2 border">{v.email}</td>
//                   <td className="p-2 border">{v.state}</td>
//                   <td className="p-2 border">{v.city}</td>
//                   <td className="p-2 border text-center">
//                     <button
//                       className="text-blue-600 hover:text-blue-800"
//                       title="Edit"
//                       onClick={() => {
//                         setSelectedVisitor(v);
//                         setIsOpen(true);
//                       }}
//                     >
//                       <EditIcon fontSize="small" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {rows.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="p-4 text-center text-gray-600">
//                     No visitors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}

//         {/* ✅ Edit Modal */}
//         {isOpen && selectedVisitor && (
//           <div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             onClick={() => setIsOpen(false)}
//           >
//             <div
//               className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Edit Visitor</h2>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-4 text-md">
//                 <div>
//                   <label className="font-medium">Mobile Number</label>
//                   <input
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.mobile}
//                     onChange={(e) =>
//                       setSelectedVisitor({ ...selectedVisitor, mobile: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="font-medium">Company Name</label>
//                   <input
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.company}
//                     onChange={(e) =>
//                       setSelectedVisitor({ ...selectedVisitor, company: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="font-medium">Name</label>
//                   <input
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.name}
//                     onChange={(e) =>
//                       setSelectedVisitor({ ...selectedVisitor, name: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="font-medium">Email</label>
//                   <input
//                     type="email"
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.email}
//                     onChange={(e) =>
//                       setSelectedVisitor({ ...selectedVisitor, email: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="font-medium">State</label>
//                   <select
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.state}
//                     onChange={(e) =>
//                       setSelectedVisitor({
//                         ...selectedVisitor,
//                         state: e.target.value,
//                         city: "",
//                       })
//                     }
//                   >
//                     <option value="">Select State</option>
//                     {Object.keys(stateCityMap).map((st) => (
//                       <option key={st} value={st}>
//                         {st}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="font-medium">City</label>
//                   <select
//                     className="border p-2 rounded w-full"
//                     value={selectedVisitor.city}
//                     disabled={!selectedVisitor.state}
//                     onChange={(e) =>
//                       setSelectedVisitor({ ...selectedVisitor, city: e.target.value })
//                     }
//                   >
//                     <option value="">Select City</option>
//                     {selectedVisitor.state &&
//                       stateCityMap[selectedVisitor.state]?.map((ct) => (
//                         <option key={ct} value={ct}>
//                           {ct}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 border rounded hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={() => {
//                     console.log("Updated Data:", selectedVisitor);
//                     // ✅ if you have update api, call it here
//                     setIsOpen(false);
//                   }}
//                   className="px-4 py-2 bg-[#2e56a6] text-white rounded"
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import EditIcon from "@mui/icons-material/Edit";
// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// type ApiVisitor = {
//   visitorid: number;
//   mobileno: string;
//   companyname: string;
//   name: string;
//   email: string;
//   stateid: number;
//   cityid: number;
//   stateName: string;
//   cityName: string;
// };

// type VisitorRow = {
//   id: number;
//   mobile: string;
//   company: string;
//   name: string;
//   email: string;
//   state: string; // stateName
//   city: string;  // cityName
//   stateid?: number;
//   cityid?: number;
// };

// export default function VisitorList() {
//   // ✅ label comes from path: /users/visitors-list/:label
//   const { label } = useParams<{ label: string }>();

//   const [loading, setLoading] = useState(false);
//   const [rows, setRows] = useState<VisitorRow[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);

//   // ✅ modal fetch loading + error
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState("");

//   // ⚠️ demo mapping (your real project may fetch state/city master from API)
//   const stateCityMap: Record<string, string[]> = {
//     Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//     Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//     Rajasthan: ["Jaipur", "Udaipur"],
//     Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Alappuzha"],
//   };

//   // ✅ userid from localStorage or set fixed if you want
//   const userId = useMemo(() => {
//     return localStorage.getItem("userid") || "3";
//   }, []);

//   const mapApiToRow = (v: ApiVisitor): VisitorRow => ({
//     id: v.visitorid,
//     mobile: v.mobileno,
//     company: v.companyname,
//     name: v.name,
//     email: v.email,
//     state: v.stateName,
//     city: v.cityName,
//     stateid: v.stateid,
//     cityid: v.cityid,
//   });

//   const fetchVisitors = async (lbl?: string) => {
//     setLoading(true);
//     setErrorMsg("");
//     try {
//       const res = await axios.post(`${apiUrl}/Visitor/list`, {
//         userid: userId,
//         label: lbl || label || "TotalVisitors",
//       });

//       if (res.data?.success) {
//         const data: ApiVisitor[] = res.data?.data || [];
//         setRows(data.map(mapApiToRow));
//       } else {
//         setRows([]);
//         setErrorMsg(res.data?.message || "Visitor not found");
//       }
//     } catch (err: any) {
//       setRows([]);
//       setErrorMsg(err?.response?.data?.message || "API error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ show api call when edit clicked
//   const fetchVisitorDetail = async (visitorId: number) => {
//     setModalLoading(true);
//     setModalError("");
//     try {
//       const res = await axios.post(`${apiUrl}/Visitor/show`, {
//         visitorid: String(visitorId),
//       });

//       if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length) {
//         const v: ApiVisitor = res.data.data[0];
//         setSelectedVisitor(mapApiToRow(v));
//       } else {
//         setModalError(res.data?.message || "Visitor detail not found");
//       }
//     } catch (err: any) {
//       setModalError(err?.response?.data?.message || "Visitor show API error");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // ✅ whenever label changes in URL, refetch
//   useEffect(() => {
//     fetchVisitors(label);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [label, userId]);

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-2xl font-semibold">Visitor List</h1>
//           <p className="text-sm text-gray-600 mt-1">
//             Label: <span className="font-medium">{label || "TotalVisitors"}</span>
//           </p>
//         </div>

//         <button
//           onClick={() => fetchVisitors(label)}
//           className="px-4 py-2 bg-[#2e56a6] text-white rounded"
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="overflow-x-auto border rounded-lg bg-white">
//         {loading && (
//           <div className="p-4 text-gray-600 flex items-center gap-2">
//             <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
//             Loading visitors...
//           </div>
//         )}

//         {!loading && errorMsg && (
//           <div className="p-4 text-red-600 font-medium">{errorMsg}</div>
//         )}

//         {!loading && !errorMsg && (
//           <table className="w-full border-collapse text-md">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border w-16 text-center">Sr. No.</th>
//                 <th className="p-2 border">Mobile</th>
//                 <th className="p-2 border">Company Name</th>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">State</th>
//                 <th className="p-2 border">City</th>
//                 <th className="p-2 border text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((v, index) => (
//                 <tr key={v.id} className="hover:bg-gray-50">
//                   <td className="p-2 border text-center font-medium">{index + 1}</td>
//                   <td className="p-2 border">{v.mobile}</td>
//                   <td className="p-2 border">{v.company}</td>
//                   <td className="p-2 border">{v.name}</td>
//                   <td className="p-2 border">{v.email}</td>
//                   <td className="p-2 border">{v.state}</td>
//                   <td className="p-2 border">{v.city}</td>
//                   <td className="p-2 border text-center">
//                     <button
//                       className="text-blue-600 hover:text-blue-800"
//                       title="Edit"
//                       onClick={() => {
//                         // ✅ open modal first (so loader shows)
//                         setIsOpen(true);
//                         setSelectedVisitor(v); // quick fill from list
//                         // ✅ then fetch latest detail by ID
//                         fetchVisitorDetail(v.id);
//                       }}
//                     >
//                       <EditIcon fontSize="small" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {rows.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="p-4 text-center text-gray-600">
//                     No visitors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}

//         {/* ✅ Edit Modal */}
//         {isOpen && (
//           <div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             onClick={() => setIsOpen(false)}
//           >
//             <div
//               className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Edit Visitor</h2>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>


//               {/* ✅ modal error */}
//               {!modalLoading && modalError && (
//                 <div className="p-3 mb-3 rounded bg-red-50 text-red-700">
//                   {modalError}
//                 </div>
//               )}

//               {/* ✅ form */}
//               {!modalError && selectedVisitor && (
//                 <>
//                   <div className="grid grid-cols-2 gap-4 text-md">
//                     <div>
//                       <label className="font-medium">Mobile Number</label>
//                       <input
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.mobile}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, mobile: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">Company Name</label>
//                       <input
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.company}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, company: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">Name</label>
//                       <input
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.name}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, name: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">Email</label>
//                       <input
//                         type="email"
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.email}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, email: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">State</label>
//                       <select
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.state}
//                         onChange={(e) =>
//                           setSelectedVisitor({
//                             ...selectedVisitor,
//                             state: e.target.value,
//                             city: "",
//                             // ⚠️ if you have state master with IDs, set stateid here
//                           })
//                         }
//                       >
//                         <option value="">Select State</option>
//                         {Object.keys(stateCityMap).map((st) => (
//                           <option key={st} value={st}>
//                             {st}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="font-medium">City</label>
//                       <select
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.city}
//                         disabled={!selectedVisitor.state}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, city: e.target.value })
//                         }
//                       >
//                         <option value="">Select City</option>
//                         {selectedVisitor.state &&
//                           stateCityMap[selectedVisitor.state]?.map((ct) => (
//                             <option key={ct} value={ct}>
//                               {ct}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-3 mt-6">
//                     <button
//                       onClick={() => setIsOpen(false)}
//                       className="px-4 py-2 border rounded hover:bg-gray-100"
//                       disabled={modalLoading}
//                     >
//                       Cancel
//                     </button>

//                     <button
//                       onClick={() => {
//                         console.log("Updated Data:", selectedVisitor);
//                         // ✅ if you have update api, call it here
//                         setIsOpen(false);
//                       }}
//                       className="px-4 py-2 bg-[#2e56a6] text-white rounded disabled:opacity-60"
//                       disabled={modalLoading}
//                     >
//                       Update
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import EditIcon from "@mui/icons-material/Edit";
// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiUrl } from "../../config";

// type ApiVisitor = {
//   visitorid: number;
//   mobileno: string;
//   companyname: string;
//   name: string;
//   email: string;
//   stateid: number;
//   cityid: number;
//   stateName: string;
//   cityName: string;
// };

// type VisitorRow = {
//   id: number;
//   mobile: string;
//   company: string;
//   name: string;
//   email: string;
//   state: string; // stateName
//   city: string;  // cityName
//   stateid?: number; // IMPORTANT (for update)
//   cityid?: number;  // IMPORTANT (for update)
// };

// export default function VisitorList() {
//   const { label } = useParams<{ label: string }>();

//   const [loading, setLoading] = useState(false);
//   const [rows, setRows] = useState<VisitorRow[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);

//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [updateError, setUpdateError] = useState("");

//   // ⚠️ Demo map (ONLY name list). IDs are coming from API (stateid/cityid).
//   const stateCityMap: Record<string, string[]> = {
//     Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//     Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//     Rajasthan: ["Jaipur", "Udaipur"],
//     Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Alappuzha"],
//   };

//   // ✅ userid
//   const userId = useMemo(() => localStorage.getItem("userid") || "3", []);

//   const mapApiToRow = (v: ApiVisitor): VisitorRow => ({
//     id: v.visitorid,
//     mobile: v.mobileno,
//     company: v.companyname,
//     name: v.name,
//     email: v.email,
//     state: v.stateName,
//     city: v.cityName,
//     stateid: v.stateid,
//     cityid: v.cityid,
//   });

//   const fetchVisitors = async (lbl?: string) => {
//     setLoading(true);
//     setErrorMsg("");
//     try {
//       const res = await axios.post(`${apiUrl}/Visitor/list`, {
//         user_id: userId,
//         label: lbl || label || "TotalVisitors",
//       });

//       if (res.data?.success) {
//         const data: ApiVisitor[] = res.data?.data || [];
//         setRows(data.map(mapApiToRow));
//       } else {
//         setRows([]);
//         setErrorMsg(res.data?.message || "Visitor not found");
//       }
//     } catch (err: any) {
//       setRows([]);
//       setErrorMsg(err?.response?.data?.message || "API error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVisitorDetail = async (visitorId: number) => {
//     setModalLoading(true);
//     setModalError("");
//     try {
//       const res = await axios.post(`${apiUrl}/Visitor/show`, {
//         visitorid: String(visitorId),
//       });

//       if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length) {
//         const v: ApiVisitor = res.data.data[0];
//         setSelectedVisitor(mapApiToRow(v));
//       } else {
//         setModalError(res.data?.message || "Visitor detail not found");
//       }
//     } catch (err: any) {
//       setModalError(err?.response?.data?.message || "Visitor show API error");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // ✅ UPDATE API CALL
//   const updateVisitor = async () => {
//     if (!selectedVisitor) return;

//     setUpdating(true);
//     setUpdateError("");

//     try {
//       // Validate required fields quickly
//       if (!selectedVisitor.name?.trim()) return setUpdateError("Name is required"), setUpdating(false);
//       if (!selectedVisitor.mobile?.trim()) return setUpdateError("Mobile is required"), setUpdating(false);
//       if (!selectedVisitor.email?.trim()) return setUpdateError("Email is required"), setUpdating(false);
//       if (!selectedVisitor.company?.trim()) return setUpdateError("Company is required"), setUpdating(false);

//       // IMPORTANT: state_id & city_id should be IDs (numbers)
//       if (!selectedVisitor.stateid) return setUpdateError("State ID missing (stateid)"), setUpdating(false);
//       if (!selectedVisitor.cityid) return setUpdateError("City ID missing (cityid)"), setUpdating(false);

//       const payload = {
//         name: selectedVisitor.name,
//         mobile: selectedVisitor.mobile,
//         email: selectedVisitor.email,
//         companyname: selectedVisitor.company,
//         state_id: String(selectedVisitor.stateid),
//         city_id: String(selectedVisitor.cityid),
//         visitorid: String(selectedVisitor.id),
//       };

//       const res = await axios.post(`${apiUrl}/Visitor/Update`, payload);

//       if (res.data?.success) {
//         // ✅ refresh list and close modal
//         await fetchVisitors(label);
//         setIsOpen(false);
//         setSelectedVisitor(null);
//       } else {
//         setUpdateError(res.data?.message || "Update failed");
//       }
//     } catch (err: any) {
//       setUpdateError(err?.response?.data?.message || "Update API error");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   useEffect(() => {
//     fetchVisitors(label);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [label, userId]);

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-2xl font-semibold">Visitor List</h1>
//           <p className="text-sm text-gray-600 mt-1">
//             Label: <span className="font-medium">{label || "TotalVisitors"}</span>
//           </p>
//         </div>

//         <button
//           onClick={() => fetchVisitors(label)}
//           className="px-4 py-2 bg-[#2e56a6] text-white rounded"
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="overflow-x-auto border rounded-lg bg-white">
//         {loading && (
//           <div className="p-4 text-gray-600 flex items-center gap-2">
//             <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
//             Loading visitors...
//           </div>
//         )}

//         {!loading && errorMsg && (
//           <div className="p-4 text-red-600 font-medium">{errorMsg}</div>
//         )}

//         {!loading && !errorMsg && (
//           <table className="w-full border-collapse text-md">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border w-16 text-center">Sr. No.</th>
//                 <th className="p-2 border">Mobile</th>
//                 <th className="p-2 border">Company Name</th>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">State</th>
//                 <th className="p-2 border">City</th>
//                 <th className="p-2 border text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((v, index) => (
//                 <tr key={v.id} className="hover:bg-gray-50">
//                   <td className="p-2 border text-center font-medium">{index + 1}</td>
//                   <td className="p-2 border">{v.mobile}</td>
//                   <td className="p-2 border">{v.company}</td>
//                   <td className="p-2 border">{v.name}</td>
//                   <td className="p-2 border">{v.email}</td>
//                   <td className="p-2 border">{v.state}</td>
//                   <td className="p-2 border">{v.city}</td>
//                   <td className="p-2 border text-center">
//                     <button
//                       className="text-blue-600 hover:text-blue-800"
//                       title="Edit"
//                       onClick={() => {
//                         setIsOpen(true);
//                         setSelectedVisitor(v); // quick fill
//                         fetchVisitorDetail(v.id); // latest detail
//                       }}
//                     >
//                       <EditIcon fontSize="small" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {rows.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="p-4 text-center text-gray-600">
//                     No visitors found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}

//         {/* ✅ Edit Modal */}
//         {isOpen && (
//           <div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             onClick={() => {
//               if (!updating) {
//                 setIsOpen(false);
//                 setSelectedVisitor(null);
//                 setModalError("");
//                 setUpdateError("");
//               }
//             }}
//           >
//             <div
//               className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <h2 className="text-lg font-semibold">Edit Visitor</h2>
//                 <button
//                   onClick={() => {
//                     if (!updating) {
//                       setIsOpen(false);
//                       setSelectedVisitor(null);
//                       setModalError("");
//                       setUpdateError("");
//                     }
//                   }}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Loader */}
//               {modalLoading && (
//                 <div className="p-3 mb-3 rounded bg-gray-50 text-gray-700 flex items-center gap-2">
//                   <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
//                   Loading visitor detail...
//                 </div>
//               )}

//               {/* Show error */}
//               {!modalLoading && modalError && (
//                 <div className="p-3 mb-3 rounded bg-red-50 text-red-700">
//                   {modalError}
//                 </div>
//               )}

//               {/* Update error */}
//               {!!updateError && (
//                 <div className="p-3 mb-3 rounded bg-red-50 text-red-700">
//                   {updateError}
//                 </div>
//               )}

//               {/* Form */}
//               {!modalError && selectedVisitor && (
//                 <>
//                   <div className="grid grid-cols-2 gap-4 text-md mt-3">
//                     <div>
//                       <label className="font-medium">Mobile Number</label>
//                       <input
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.mobile}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, mobile: e.target.value })
//                         }
//                         disabled={updating}
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">Company Name</label>
//                       <input
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.company}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, company: e.target.value })
//                         }
//                         disabled={updating}
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">Name</label>
//                       <input
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.name}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, name: e.target.value })
//                         }
//                         disabled={updating}
//                       />
//                     </div>

//                     <div>
//                       <label className="font-medium">Email</label>
//                       <input
//                         type="email"
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.email}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, email: e.target.value })
//                         }
//                         disabled={updating}
//                       />
//                     </div>

//                     {/* ⚠️ State/City Name dropdown is demo only.
//                         Your Update API needs IDs (stateid/cityid).
//                         If you have state/city master list with IDs, replace these dropdowns with ID-based selects.
//                     */}
//                     <div>
//                       <label className="font-medium">State (Name)</label>
//                       <select
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.state}
//                         onChange={(e) =>
//                           setSelectedVisitor({
//                             ...selectedVisitor,
//                             state: e.target.value,
//                             city: "",
//                             // keep old IDs unless you map name->id from a master list
//                           })
//                         }
//                         disabled={updating}
//                       >
//                         <option value="">Select State</option>
//                         {Object.keys(stateCityMap).map((st) => (
//                           <option key={st} value={st}>
//                             {st}
//                           </option>
//                         ))}
//                       </select>

//                       {/* Debug IDs (optional) */}
//                       <p className="text-xs text-gray-500 mt-1">
//                         stateid: {selectedVisitor.stateid ?? "N/A"}
//                       </p>
//                     </div>

//                     <div>
//                       <label className="font-medium">City (Name)</label>
//                       <select
//                         className="border p-2 rounded w-full"
//                         value={selectedVisitor.city}
//                         disabled={!selectedVisitor.state || updating}
//                         onChange={(e) =>
//                           setSelectedVisitor({ ...selectedVisitor, city: e.target.value })
//                         }
//                       >
//                         <option value="">Select City</option>
//                         {selectedVisitor.state &&
//                           stateCityMap[selectedVisitor.state]?.map((ct) => (
//                             <option key={ct} value={ct}>
//                               {ct}
//                             </option>
//                           ))}
//                       </select>

//                       <p className="text-xs text-gray-500 mt-1">
//                         cityid: {selectedVisitor.cityid ?? "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-3 mt-6">
//                     <button
//                       onClick={() => {
//                         if (!updating) {
//                           setIsOpen(false);
//                           setSelectedVisitor(null);
//                           setModalError("");
//                           setUpdateError("");
//                         }
//                       }}
//                       className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-60"
//                       disabled={updating}
//                     >
//                       Cancel
//                     </button>

//                     <button
//                       onClick={updateVisitor}
//                       className="px-4 py-2 bg-[#2e56a6] text-white rounded disabled:opacity-60"
//                       disabled={modalLoading || updating || !!modalError || !selectedVisitor}
//                     >
//                       {updating ? "Updating..." : "Update"}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config";

type ApiVisitor = {
  visitorid: number;
  mobileno: string;
  companyname: string;
  name: string;
  email: string;
  stateid: number;
  cityid: number;
  stateName: string;
  cityName: string;
};

type VisitorRow = {
  id: number;
  mobile: string;
  company: string;
  name: string;
  email: string;

  stateid?: number; // ✅ use id for dropdown + update
  cityid?: number;  // ✅ use id for dropdown + update

  stateName?: string;
  cityName?: string;
};

type CityItem = { id: number; name: string; stateid: number };

export default function VisitorList() {
  const { label } = useParams<{ label: string }>();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<VisitorRow[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // ✅ Cities dropdown data (based on selected stateid)
  const [cities, setCities] = useState<CityItem[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState("");

  // ✅ userid
  const userId = useMemo(() => localStorage.getItem("userid") || "3", []);

  // ✅ TEMP state master (replace with your State API if you have)
  const states = useMemo(
    () => [
      { id: 1, name: "Gujarat" },
      { id: 2, name: "Kerala" },
      { id: 3, name: "Maharashtra" },
      { id: 4, name: "Rajasthan" },
    ],
    []
  );

  const mapApiToRow = (v: ApiVisitor): VisitorRow => ({
    id: v.visitorid,
    mobile: v.mobileno,
    company: v.companyname,
    name: v.name,
    email: v.email,
    stateid: v.stateid,
    cityid: v.cityid,
    stateName: v.stateName,
    cityName: v.cityName,
  });

  // ✅ Visitor list (label from URL)
  const fetchVisitors = async (lbl?: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post(`${apiUrl}/Visitor/list`, {
        user_id: userId, // ✅ your API uses "userid"
        label: lbl || label || "TotalVisitors",
      });

      if (res.data?.success) {
        const data: ApiVisitor[] = res.data?.data || [];
        setRows(data.map(mapApiToRow));
      } else {
        setRows([]);
        setErrorMsg(res.data?.message || "Visitor not found");
      }
    } catch (err: any) {
      setRows([]);
      setErrorMsg(err?.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ City list by stateid
  const fetchCitiesByState = async (stateid: number) => {
    setCityLoading(true);
    setCityError("");
    try {
      const res = await axios.post(`${apiUrl}/CityByState`, {
        stateid: String(stateid),
      });

      if (res.data?.success) {
        setCities(res.data?.data || []);
      } else {
        setCities([]);
        setCityError(res.data?.message || "City not found");
      }
    } catch (err: any) {
      setCities([]);
      setCityError(err?.response?.data?.message || "City API error");
    } finally {
      setCityLoading(false);
    }
  };

  // ✅ Visitor detail show (for edit)
  const fetchVisitorDetail = async (visitorId: number) => {
    setModalLoading(true);
    setModalError("");
    setUpdateError("");
    setCityError("");
    setCities([]);

    try {
      const res = await axios.post(`${apiUrl}/Visitor/show`, {
        visitorid: String(visitorId),
      });

      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length) {
        const v: ApiVisitor = res.data.data[0];
        const mapped = mapApiToRow(v);
        setSelectedVisitor(mapped);

        // ✅ load cities based on visitor stateid so city dropdown shows & selects
        if (mapped.stateid) {
          await fetchCitiesByState(mapped.stateid);
        }
      } else {
        setModalError(res.data?.message || "Visitor detail not found");
      }
    } catch (err: any) {
      setModalError(err?.response?.data?.message || "Visitor show API error");
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ UPDATE API CALL
  const updateVisitor = async () => {
    if (!selectedVisitor) return;

    setUpdating(true);
    setUpdateError("");

    try {
      if (!selectedVisitor.name?.trim()) return setUpdateError("Name is required"), setUpdating(false);
      if (!selectedVisitor.mobile?.trim()) return setUpdateError("Mobile is required"), setUpdating(false);
      if (!selectedVisitor.email?.trim()) return setUpdateError("Email is required"), setUpdating(false);
      if (!selectedVisitor.company?.trim()) return setUpdateError("Company is required"), setUpdating(false);

      if (!selectedVisitor.stateid) return setUpdateError("Please select State"), setUpdating(false);
      if (!selectedVisitor.cityid) return setUpdateError("Please select City"), setUpdating(false);

      const payload = {
        name: selectedVisitor.name,
        mobile: selectedVisitor.mobile,
        email: selectedVisitor.email,
        companyname: selectedVisitor.company,
        state_id: String(selectedVisitor.stateid),
        city_id: String(selectedVisitor.cityid),
        visitorid: String(selectedVisitor.id),
      };

      const res = await axios.post(`${apiUrl}/Visitor/Update`, payload);

      if (res.data?.success) {
        await fetchVisitors(label);
        setIsOpen(false);
        setSelectedVisitor(null);
      } else {
        setUpdateError(res.data?.message || "Update failed");
      }
    } catch (err: any) {
      setUpdateError(err?.response?.data?.message || "Update API error");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchVisitors(label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, userId]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Visitor List</h1>
          <p className="text-sm text-gray-600 mt-1">
            Label: <span className="font-medium">{label || "TotalVisitors"}</span>
          </p>
        </div>


      </div>

      <div className="overflow-x-auto border rounded-lg bg-white">
        {loading && (
          <div className="p-4 text-gray-600 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            Loading visitors...
          </div>
        )}

        {!loading && errorMsg && <div className="p-4 text-red-600 font-medium">{errorMsg}</div>}

        {!loading && !errorMsg && (
          <table className="w-full border-collapse text-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border w-16 text-center">Sr. No.</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Company Name</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">State</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((v, index) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center font-medium">{index + 1}</td>
                  <td className="p-2 border">{v.mobile}</td>
                  <td className="p-2 border">{v.company}</td>
                  <td className="p-2 border">{v.name}</td>
                  <td className="p-2 border">{v.email}</td>
                  <td className="p-2 border">{v.stateName || "-"}</td>
                  <td className="p-2 border">{v.cityName || "-"}</td>
                  <td className="p-2 border text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      onClick={() => {
                        setIsOpen(true);
                        setSelectedVisitor(v); // quick fill from list
                        fetchVisitorDetail(v.id); // latest detail (and city list)
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-600">
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ✅ Edit Modal */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => {
              if (!updating) {
                setIsOpen(false);
                setSelectedVisitor(null);
                setModalError("");
                setUpdateError("");
                setCities([]);
              }
            }}
          >
            <div
              className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Edit Visitor</h2>
                <button
                  onClick={() => {
                    if (!updating) {
                      setIsOpen(false);
                      setSelectedVisitor(null);
                      setModalError("");
                      setUpdateError("");
                      setCities([]);
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {modalLoading && (
                <div className="p-3 mb-3 rounded bg-gray-50 text-gray-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                  Loading visitor detail...
                </div>
              )}

              {!modalLoading && modalError && (
                <div className="p-3 mb-3 rounded bg-red-50 text-red-700">{modalError}</div>
              )}

              {!!updateError && (
                <div className="p-3 mb-3 rounded bg-red-50 text-red-700">{updateError}</div>
              )}

              {!!cityError && (
                <div className="p-3 mb-3 rounded bg-red-50 text-red-700">{cityError}</div>
              )}

              {!modalError && selectedVisitor && (
                <>
                  <div className="grid grid-cols-2 gap-4 text-md mt-3">
                    <div>
                      <label className="font-medium">Mobile Number</label>
                      <input
                        className="border p-2 rounded w-full"
                        value={selectedVisitor.mobile || ""}
                        onChange={(e) =>
                          setSelectedVisitor({ ...selectedVisitor, mobile: e.target.value })
                        }
                        disabled={updating}
                      />
                    </div>

                    <div>
                      <label className="font-medium">Company Name</label>
                      <input
                        className="border p-2 rounded w-full"
                        value={selectedVisitor.company || ""}
                        onChange={(e) =>
                          setSelectedVisitor({ ...selectedVisitor, company: e.target.value })
                        }
                        disabled={updating}
                      />
                    </div>

                    <div>
                      <label className="font-medium">Name</label>
                      <input
                        className="border p-2 rounded w-full"
                        value={selectedVisitor.name || ""}
                        onChange={(e) =>
                          setSelectedVisitor({ ...selectedVisitor, name: e.target.value })
                        }
                        disabled={updating}
                      />
                    </div>

                    <div>
                      <label className="font-medium">Email</label>
                      <input
                        type="email"
                        className="border p-2 rounded w-full"
                        value={selectedVisitor.email || ""}
                        onChange={(e) =>
                          setSelectedVisitor({ ...selectedVisitor, email: e.target.value })
                        }
                        disabled={updating}
                      />
                    </div>

                    {/* ✅ State (ID) */}
                    <div>
                      <label className="font-medium">State</label>
                      <select
                        className="border p-2 rounded w-full"
                        value={selectedVisitor.stateid ?? ""}
                        onChange={async (e) => {
                          const newStateId = Number(e.target.value) || 0;

                          // reset city when state changes
                          const next = {
                            ...selectedVisitor,
                            stateid: newStateId || undefined,
                            cityid: undefined,
                          };
                          setSelectedVisitor(next);

                          if (newStateId) {
                            await fetchCitiesByState(newStateId);
                          } else {
                            setCities([]);
                          }
                        }}
                        disabled={updating || modalLoading}
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ✅ City (ID) */}
                    <div>
                      <label className="font-medium">City</label>
                      <select
                        className="border p-2 rounded w-full"
                        value={selectedVisitor.cityid ?? ""}
                        onChange={(e) => {
                          const newCityId = Number(e.target.value) || 0;
                          setSelectedVisitor({
                            ...selectedVisitor,
                            cityid: newCityId || undefined,
                          });
                        }}
                        disabled={!selectedVisitor.stateid || updating || modalLoading || cityLoading}
                      >
                        <option value="">
                          {cityLoading ? "Loading cities..." : "Select City"}
                        </option>

                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        if (!updating) {
                          setIsOpen(false);
                          setSelectedVisitor(null);
                          setModalError("");
                          setUpdateError("");
                          setCities([]);
                        }
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-60"
                      disabled={updating}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={updateVisitor}
                      className="px-4 py-2 bg-[#2e56a6] text-white rounded disabled:opacity-60"
                      disabled={modalLoading || updating || !!modalError || !selectedVisitor}
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
