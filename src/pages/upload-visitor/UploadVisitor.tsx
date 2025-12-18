import { useState } from "react";

// Types
 type VisitorType = "pre_register" | "industry" | "visited_visitor" | "";

export default function UploadVisitor() {
  const [type, setType] = useState<VisitorType>("");
  const [industry, setIndustry] = useState<string>("");
  const [exhibitor, setExhibitor] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const industries = ["IT", "Manufacturing", "Healthcare", "Education"];
  const exhibitors = ["Exhibitor A", "Exhibitor B", "Exhibitor C"];

  const showExhibitor = type === "pre_register" || type === "visited_visitor";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setFileError("Only Excel files (.xls, .xlsx) are allowed");
      return;
    }

    setFileError("");
    setFile(selectedFile);
  };

  return (
    <div className="  flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Upload Visitor Data
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select visitor details and upload Excel file
          </p>
        </div>

        {/* Form */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as VisitorType);
                setExhibitor("");
              }}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="pre_register">Pre Register</option>
              <option value="industry">Industry</option>
              <option value="visited_visitor">Visited Visitor</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm font-medium text-gray-700">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Industry</option>
              {industries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Exhibitor */}
          {showExhibitor && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Exhibitor
              </label>
              <select
                value={exhibitor}
                onChange={(e) => setExhibitor(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Exhibitor</option>
                {exhibitors.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Excel File
            </label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500">
                <span className="text-sm text-gray-600">
                  {file ? file.name : "Click to upload (.xls, .xlsx)"}
                </span>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            disabled={!file}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Upload Excel
          </button>
        </div>
      </div>
    </div>
  );
}
