import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LeadManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Mock data for the "Upper Record Information"
  const records = [
    { id: "001", name: "John Doe", company: "Alpha Tech", phone: "+91 9876543210" },
    { id: "002", name: "Sarah Smith", company: "Beta Solutions", phone: "+91 8888877777" },
    { id: "003", name: "Michael Ross", company: "Pearson Hardman", phone: "+91 9990001112" },
  ];

  const currentInfo = records[currentRecordIndex] || {};

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (showForm) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showForm, currentRecordIndex]);

  const handleNext = () => {
    console.log(`Submitted Record #${currentInfo.id}. Time taken: ${Math.floor(seconds / 60)}m ${seconds % 60}s`);
    setCurrentRecordIndex(prev => prev + 1);
    setSeconds(0);
  };

  return (
    <div className="min-h-screen  flex flex-col items-center p-10 text-black font-sans">

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#d47d4c] px-10 py-3 rounded-lg font-bold shadow-xl active:scale-95 transition-transform"
        >
          New Record
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white/20 backdrop-blur-lg border border-white/30 rounded-[2rem] p-8 shadow-2xl"
        >
          {/* Header with Title and Timer */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold italic">Record {currentInfo.id}</h2>
            <div className="bg-white/30 px-4 py-1 rounded-full text-sm">
              Timer: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* NEW: Upper Record Information Display */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-black/10 p-5 rounded-2xl border border-white/10">
            <div>
              <p className="text-xs text-slate-700 uppercase tracking-wider">Client Name</p>
              <p className="text-lg font-semibold">{currentInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-700 uppercase tracking-wider">Company</p>
              <p className="text-lg font-semibold">{currentInfo.company}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-700 uppercase tracking-wider">Phone Number</p>
              <p className="text-lg font-semibold tracking-widest">{currentInfo.phone}</p>
            </div>
          </div>

          <hr className="border-white/20 mb-8" />

          {/* Input Form Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 ml-1">Status</label>
              <select className="w-full bg-white/30 border border-white/20 rounded-xl p-4 outline-none appearance-none cursor-pointer focus:bg-white/40">
                <option value="">Select Status</option>
                <option value="interested" className="text-black">Interested</option>
                <option value="not-interested" className="text-black">Not Interested</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 ml-1">Remarks</label>
              <textarea
                className="w-full bg-white/30 border border-white/20 rounded-xl p-4 outline-none h-32 placeholder:text-slate-700 focus:bg-white/40"
                placeholder="Enter remarks..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm mb-2 ml-1">Next Follow Up</label>
              <input
                type="datetime-local"
                className="w-full bg-white/30 border border-white/20 rounded-xl p-4 outline-none focus:bg-white/40"
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#d47d4c] py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all mt-4"
            >
              Submit & Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LeadManagement;