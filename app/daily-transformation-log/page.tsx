'use client';
import { useState, useEffect } from 'react';
import Nav from "../components/Nav";

export default function DailyTransformationLog() {
  const [formData, setFormData] = useState({
    participantId: '',
    fullName: '',
    telegram: '',
    dayOfProgram: '',
    date: new Date().toISOString().split('T')[0],
    physicalCondition: '',
    skinDescription: '',
    skinClarity: 3,
    skinDryness: 3,
    inflammation: 3,
    energyLevel: 3,
    mentalClarity: 3,
    mood: 3,
    compliance: 'Yes',
    nonComplianceReason: '',
    photos: [] as File[],
    positiveThings: Array(11).fill(''),
    noticeToday: '',
    changesYesterday: '',
    consent: false,
  });

  // Auto-save progress
  useEffect(() => {
    const saved = localStorage.getItem('rejuDailyLog');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData({
        participantId: '',
        fullName: '',
        telegram: '',
        dayOfProgram: '',
        date: new Date().toISOString().split('T')[0],
        physicalCondition: '',
        skinDescription: '',
        skinClarity: 3,
        skinDryness: 3,
        inflammation: 3,
        energyLevel: 3,
        mentalClarity: 3,
        mood: 3,
        compliance: 'Yes',
        nonComplianceReason: '',
        photos: [] as File[],
        positiveThings: Array(11).fill(''),
        noticeToday: '',
        changesYesterday: '',
        consent: false,
        ...parsed,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rejuDailyLog', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.participantId.trim()) {
      alert("Please enter your Participant ID (from registration) — this is required for reliable book generation.");
      return;
    }
   
    const submitData = new FormData();
    submitData.append("type", "dailyjournal");
    submitData.append("name", formData.fullName || "Client");
    submitData.append("notes", JSON.stringify(formData, null, 2));
    
    formData.photos.forEach((photo) => {
      submitData.append("file", photo);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        alert("🌟 Successfully Submitted. You're Authoring Your Personalized REJU Transformation Book With Each Entry");
       
        if (parseInt(formData.dayOfProgram || '0') === 42) {
          alert("🎉 Program Complete! Contact REJU personnel to generate your final compiled Personalized REJU Transformation Book.");
        }
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please check console.");
    }

    localStorage.removeItem('rejuDailyLog');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,#2b1a12_0%,#0b0b0c_70%)] text-white py-16" id="main-content">
      <Nav />
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <img src="/logo.png" alt="REJU" className="mx-auto mb-6 w-28" />
          <h1 className="text-5xl font-bold tracking-tight text-[#f5c26b]">Author Your Personalized REJU Transformation Book</h1>
          <p className="mt-4 text-xl text-gray-300">Enter your Participant ID (from registration) above — it will be used for all book chapters. One chapter at a time — you are the Author.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href="/program" className="text-sm text-[#f5c26b] hover:underline">← Back to Program</a>
            <a href="/rejunomics" className="text-sm text-[#f5c26b] hover:underline">Learn Rejunomics</a>
            <a href="/onboarding" className="text-sm text-[#f5c26b] hover:underline">Onboarding</a>
            <a href="/buy" className="text-sm text-[#f5c26b] hover:underline">Buy / Lock REJU</a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-12 shadow-xl space-y-12">
          {/* Identity */}
          <div>
            <h2 className="text-3xl font-bold text-[#f5c26b] mb-6">Identity</h2>
            <input 
              type="text" 
              placeholder="Participant ID (REJU-XXXX-XXXX) *" 
              className="w-full p-5 bg-black/60 border border-[#f5c26b]/30 rounded-2xl mb-4 font-mono"
              onChange={(e) => setFormData({...formData, participantId: e.target.value})} 
              required 
            />
            <p className="text-xs text-gray-400 -mt-3 mb-3">This ID from registration is used for all book chapter filenames. Always use the same ID for consistency.</p>
            <input 
              type="text" 
              placeholder="Full Name *" 
              className="w-full p-5 bg-black/60 border border-[#f5c26b]/30 rounded-2xl mb-4" 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              required 
            />
            <input 
              type="text" 
              placeholder="Telegram Username *" 
              className="w-full p-5 bg-black/60 border border-[#f5c26b]/30 rounded-2xl" 
              onChange={(e) => setFormData({...formData, telegram: e.target.value})} 
              required 
            />
          </div>

          {/* Day & Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Day of Program (1-42)</label>
              <input 
                type="number" 
                min="1" 
                max="42" 
                className="w-full p-5 bg-black/60 border border-[#f5c26b]/30 rounded-2xl" 
                onChange={(e) => setFormData({...formData, dayOfProgram: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date</label>
              <input 
                type="date" 
                value={formData.date} 
                className="w-full p-5 bg-black/60 border border-[#f5c26b]/30 rounded-2xl" 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
              />
            </div>
          </div>

          {/* Physical Condition */}
          <div>
            <h2 className="text-3xl font-bold text-[#f5c26b] mb-4">Physical Condition</h2>
            <textarea 
              placeholder="Describe everything you feel..." 
              className="w-full p-6 bg-black/60 border border-[#f5c26b]/30 rounded-3xl h-40" 
              onChange={(e) => setFormData({...formData, physicalCondition: e.target.value})} 
            />
          </div>

          {/* Skin Condition */}
          <div>
            <h2 className="text-3xl font-bold text-[#f5c26b] mb-6">External / Skin Condition</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label>Skin Clarity (1=Poor, 5=Very Clear)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.skinClarity} 
                  onChange={(e) => setFormData({...formData, skinClarity: parseInt(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-center text-[#f5c26b] font-bold">{formData.skinClarity}</div>
              </div>
              <div>
                <label>Skin Dryness (1=Very Dry, 5=Well Hydrated)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.skinDryness} 
                  onChange={(e) => setFormData({...formData, skinDryness: parseInt(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-center text-[#f5c26b] font-bold">{formData.skinDryness}</div>
              </div>
              <div>
                <label>Inflammation (1=High, 5=None)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.inflammation} 
                  onChange={(e) => setFormData({...formData, inflammation: parseInt(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-center text-[#f5c26b] font-bold">{formData.inflammation}</div>
              </div>
            </div>
            <textarea 
              placeholder="Describe visible aspects of your skin..." 
              className="w-full mt-6 p-6 bg-black/60 border border-[#f5c26b]/30 rounded-3xl h-32" 
              onChange={(e) => setFormData({...formData, skinDescription: e.target.value})} 
            />
          </div>

          {/* Energy & Mental */}
          <div>
            <h2 className="text-3xl font-bold text-[#f5c26b] mb-6">Energy & Mental State</h2>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <label>Energy Level (1=Low, 5=High)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.energyLevel} 
                  onChange={(e) => setFormData({...formData, energyLevel: parseInt(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-center text-[#f5c26b] font-bold">{formData.energyLevel}</div>
              </div>
              <div>
                <label>Mental Clarity (1=Cloudy, 5=Clear)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.mentalClarity} 
                  onChange={(e) => setFormData({...formData, mentalClarity: parseInt(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-center text-[#f5c26b] font-bold">{formData.mentalClarity}</div>
              </div>
              <div>
                <label>Mood (1=Low, 5=High Vibrant)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.mood} 
                  onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})} 
                  className="w-full" 
                />
                <div className="text-center text-[#f5c26b] font-bold">{formData.mood}</div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <h2 className="text-3xl font-bold text-[#f5c26b] mb-4">Visual Tracking</h2>
            <p className="text-gray-400 mb-6">Front and side views. Consistent lighting recommended.</p>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="w-full p-8 border-2 border-dashed border-[#f5c26b]/40 rounded-3xl text-center text-[#f5c26b]" 
              onChange={(e) => e.target.files && setFormData({...formData, photos: Array.from(e.target.files)})} 
            />
          </div>

          {/* 11 Positive Events Today */}
          <div>
            <h2 className="text-3xl font-bold text-[#f5c26b] mb-6">11 Positive Events Today — Chapters of the Book You Author</h2>
            <p className="text-gray-400 mb-8">These are the chapters you Author. Your Participant ID (above) ensures consistent naming for the final book.</p>
            {formData.positiveThings.map((_, i) => (
              <textarea
                key={i}
                placeholder={`Positive Event #${i+1}`}
                className="w-full p-5 bg-black/60 border border-[#f5c26b]/30 rounded-2xl mb-4 h-20 resize-y min-h-[60px]"
                onChange={(e) => {
                  const updated = [...formData.positiveThings];
                  updated[i] = e.target.value;
                  setFormData({...formData, positiveThings: updated});
                }}
              />
            ))}
          </div>

          {/* Reflection */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#f5c26b] mb-4">What did you notice today?</h3>
              <textarea 
                className="w-full p-6 bg-black/60 border border-[#f5c26b]/30 rounded-3xl h-40" 
                onChange={(e) => setFormData({...formData, noticeToday: e.target.value})} 
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f5c26b] mb-4">Changes since yesterday?</h3>
              <textarea 
                className="w-full p-6 bg-black/60 border border-[#f5c26b]/30 rounded-3xl h-40" 
                onChange={(e) => setFormData({...formData, changesYesterday: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-6 border border-[#f5c26b] text-[#f5c26b] font-semibold text-xl rounded-2xl hover:bg-[#f5c26b] hover:text-black transition duration-300"
          >
            <p>Submit:</p> You're Authoring Your Own Personalized Transformation Book
          </button>
        </form>
      </div>
    </div>
  );
}