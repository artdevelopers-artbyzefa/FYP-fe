import React, { useEffect, useState } from 'react';
import { getEscalations } from '../../services/hod.service';
import { showAlert, showToast } from '../../components/AppToast';
import { AlertTriangle, CheckCircle, FileText, Gavel, Paperclip, Shield, UserPen, XCircle } from 'lucide-react';

const HodEscalations = () => {
  const [escalations, setEscalations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState('');

  useEffect(() => {
    getEscalations().then((res) => setEscalations(res.data)).catch(console.error);
  }, []);

  const handleMandate = () => {
    showAlert.confirm(
      'Mandate Re-evaluation',
      'Are you sure you want to mandate formal committee re-evaluation? This is a binding HOD ruling and cannot be undone.',
      'Yes, Mandate',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) {
        showToast.success('Binding ruling issued: Re-evaluation mandated for PEC-1!');
      }
    });
  };

  const handleReassign = () => {
    showAlert.confirm(
      'Re-assign Supervisor',
      'Are you sure you want to reassign student group supervisor? This is a binding HOD ruling and cannot be undone.',
      'Yes, Re-assign',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) {
        showToast.success('Binding ruling issued: Supervisor reassignment workflow initiated!');
      }
    });
  };

  const handleDismissSubmit = (e) => {
    e.preventDefault();
    if(dismissReason.trim()) {
      setIsModalOpen(false);
      showToast.warning('Binding HOD ruling issued: Grievance dismissed with official justification.');
      setDismissReason('');
    }
  };

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Escalated Grievances & Binding Decisions</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Review severe student disputes escalated by the FYP Office In-charge and issue final, binding administrative rulings</p>
      </div>

      {escalations.map((esc) => (
        <div key={esc.id} className="bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8 relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-2 h-full bg-white"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-black gap-4 pl-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-black text-lg">{esc.student} ({esc.regNo})</span>
                <span className="bg-white text-black font-bold text-xs px-3 py-1 rounded-xl border border-black shadow-sm"><AlertTriangle className="w-4 h-4 mr-1" /> Escalated by In-charge</span>
              </div>
              <p className="text-xs text-black font-bold">Category: {esc.category} · Escalated: {esc.date}</p>
            </div>
            <span className="bg-white text-black font-bold text-xs px-4 py-2 rounded-2xl border border-black shadow-sm">HOD Ruling Required</span>
          </div>

          <div className="pl-4 space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-black space-y-3">
                <h4 className="font-black text-black text-sm pb-2 border-b border-black"><FileText className="text-black mr-2" />Grievance Details & Evidence</h4>
                <p className="text-black leading-relaxed italic">"{esc.details}"</p>
                <div className="pt-2 flex items-center gap-2">
                  <Paperclip className="text-black" />
                  <span className="font-bold text-black">Attached Evidence:</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast.success('Downloading evidence document...'); }} className="text-black hover:underline font-bold">rubric_scorecard_error.pdf (1.2 MB)</a>
                </div>
              </div>
              <div className="bg-white/50 p-5 rounded-2xl border border-black space-y-3">
                <h4 className="font-black text-black text-sm pb-2 border-b border-black"><Shield className="text-black mr-2" />FYP Office In-charge Escalation Note</h4>
                <p className="text-black leading-relaxed">"{esc.inchargeNote}"</p>
                <div className="pt-2"><span className="font-bold text-black">Escalated By:</span> <span className="font-bold text-black">{esc.escalatedBy}</span></div>
              </div>
            </div>

            {/* HOD Binding Actions */}
            <div className="bg-white p-6 rounded-2xl border border-black shadow-sm space-y-5">
              <h4 className="font-black text-black text-sm border-b border-black pb-3"><Gavel className="text-black mr-2" />Issue Binding HOD Ruling</h4>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={handleMandate} className="px-6 py-3 bg-white hover:bg-white text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4" /> Mandate Re-evaluation</button>
                <button onClick={handleReassign} className="px-6 py-3 bg-white hover:bg-blue-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg flex items-center gap-2 text-sm"><UserPen className="w-4 h-4" /> Re-assign Supervisor</button>
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-white hover:bg-white text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 text-sm"><XCircle className="w-4 h-4" /> Dismiss Grievance</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dismiss Grievance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-black">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Dismiss Escalated Grievance</h3>
              <i className="fas fa-times text-black hover:text-blue-600 cursor-pointer text-lg" onClick={() => setIsModalOpen(false)}></i>
            </div>
            <form onSubmit={handleDismissSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Mandatory HOD Dismissal Reason</label>
                <textarea 
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Provide official HOD binding justification for dismissing this escalated grievance..." 
                  className="w-full bg-white border border-black rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:bg-white transition-all h-32" 
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-black">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-black hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-white hover:bg-white text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer">Confirm Binding Dismissal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HodEscalations;
