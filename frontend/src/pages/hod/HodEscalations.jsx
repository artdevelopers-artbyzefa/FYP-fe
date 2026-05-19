import React, { useEffect, useState } from 'react';
import { getEscalations } from '../../services/hod.service';
import { showAlert, showToast } from '../../components/AppToast';

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
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Escalated Grievances & Binding Decisions</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Review severe student disputes escalated by the FYP Office In-charge and issue final, binding administrative rulings</p>
      </div>

      {escalations.map((esc) => (
        <div key={esc.id} className="bg-white rounded-[2rem] border border-amber-200 shadow-sm p-6 sm:p-8 relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 gap-4 pl-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-gray-900 text-lg">{esc.student} ({esc.regNo})</span>
                <span className="bg-amber-50 text-amber-700 font-bold text-xs px-3 py-1 rounded-xl border border-amber-200 shadow-sm"><i className="fas fa-exclamation-triangle mr-1"></i> Escalated by In-charge</span>
              </div>
              <p className="text-xs text-gray-500 font-bold">Category: {esc.category} · Escalated: {esc.date}</p>
            </div>
            <span className="bg-red-50 text-red-600 font-bold text-xs px-4 py-2 rounded-2xl border border-red-200 shadow-sm">HOD Ruling Required</span>
          </div>

          <div className="pl-4 space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                <h4 className="font-black text-gray-800 text-sm pb-2 border-b border-gray-200"><i className="fas fa-file-alt text-amber-600 mr-2"></i>Grievance Details & Evidence</h4>
                <p className="text-gray-600 leading-relaxed italic">"{esc.details}"</p>
                <div className="pt-2 flex items-center gap-2">
                  <i className="fas fa-paperclip text-secondary"></i>
                  <span className="font-bold text-gray-700">Attached Evidence:</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast.success('Downloading evidence document...'); }} className="text-secondary hover:underline font-bold">rubric_scorecard_error.pdf (1.2 MB)</a>
                </div>
              </div>
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-3">
                <h4 className="font-black text-gray-900 text-sm pb-2 border-b border-blue-200"><i className="fas fa-user-shield text-secondary mr-2"></i>FYP Office In-charge Escalation Note</h4>
                <p className="text-gray-700 leading-relaxed">"{esc.inchargeNote}"</p>
                <div className="pt-2"><span className="font-bold text-gray-500">Escalated By:</span> <span className="font-bold text-gray-900">{esc.escalatedBy}</span></div>
              </div>
            </div>

            {/* HOD Binding Actions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-3"><i className="fas fa-gavel text-primary mr-2"></i>Issue Binding HOD Ruling</h4>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={handleMandate} className="px-6 py-3 bg-success hover:bg-emerald-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-sm"><i className="fas fa-check-circle"></i> Mandate Re-evaluation</button>
                <button onClick={handleReassign} className="px-6 py-3 bg-secondary hover:bg-blue-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center gap-2 text-sm"><i className="fas fa-user-edit"></i> Re-assign Supervisor</button>
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 text-sm"><i className="fas fa-times-circle"></i> Dismiss Grievance</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dismiss Grievance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Dismiss Escalated Grievance</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsModalOpen(false)}></i>
            </div>
            <form onSubmit={handleDismissSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Mandatory HOD Dismissal Reason</label>
                <textarea 
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Provide official HOD binding justification for dismissing this escalated grievance..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-secondary focus:bg-white transition-all h-32" 
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-danger hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 transition-all cursor-pointer">Confirm Binding Dismissal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HodEscalations;
