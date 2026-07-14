import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  genLayer: any;
}

export const LoanDashboard: React.FC<Props> = ({ genLayer }) => {
  const [viewMode, setViewMode] = useState<'submit' | 'evaluate'>('submit');
  
  const [proposalId, setProposalId] = useState('');
  const [borrower, setBorrower] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [textProposal, setTextProposal] = useState('');
  
  const [selectedProposalId, setSelectedProposalId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalId || !borrower || !requestedAmount || !textProposal) return;
    await genLayer.submitProposal(proposalId, borrower, parseInt(requestedAmount, 10), textProposal);
    setProposalId('');
    setBorrower('');
    setRequestedAmount('');
    setTextProposal('');
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposalId) return;
    await genLayer.evaluateProposal(selectedProposalId);
    setSelectedProposalId('');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-32">
      
      {/* Massive Tab Navigation */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-32 items-baseline border-b border-white/20 pb-12">
        <button 
          onClick={() => setViewMode('submit')}
          className={`font-luxury text-6xl md:text-8xl transition-all duration-700 ease-out interactive ${viewMode === 'submit' ? 'italic opacity-100' : 'opacity-20 hover:opacity-50'}`}
        >
          Create.
        </button>
        <button 
          onClick={() => setViewMode('evaluate')}
          className={`font-luxury text-6xl md:text-8xl transition-all duration-700 ease-out interactive ${viewMode === 'evaluate' ? 'italic opacity-100' : 'opacity-20 hover:opacity-50'}`}
        >
          Evaluate.
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
        
        {/* Forms Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {viewMode === 'submit' ? (
              <motion.form 
                key="submit"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                onSubmit={handleSubmit} 
                className="space-y-12"
              >
                <div className="flex flex-col gap-4">
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50">Proposal Identifier</label>
                  <input type="text" value={proposalId} onChange={e => setProposalId(e.target.value)} className="luxury-input" placeholder="e.g. LOAN-001" required />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50">Borrower Address</label>
                  <input type="text" value={borrower} onChange={e => setBorrower(e.target.value)} className="luxury-input" placeholder="0x..." required />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50">Requested Amount</label>
                  <input type="number" value={requestedAmount} onChange={e => setRequestedAmount(e.target.value)} className="luxury-input" placeholder="$1000" required />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50">Rationale</label>
                  <textarea value={textProposal} onChange={e => setTextProposal(e.target.value)} className="luxury-input resize-none min-h-[200px]" placeholder="Explain the purpose of this loan..." required />
                </div>
                <div className="pt-12">
                  <button type="submit" className="floema-btn w-40 h-40 interactive group">
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase transition-colors">Submit</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="evaluate"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                onSubmit={handleEvaluate} 
                className="space-y-12"
              >
                <div className="flex flex-col gap-4">
                  <label className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50">Select Pending Proposal</label>
                  <select
                    className="luxury-input appearance-none bg-transparent cursor-pointer"
                    value={selectedProposalId}
                    onChange={(e) => setSelectedProposalId(e.target.value)}
                  >
                    <option value="" disabled className="bg-black text-white/30">Choose...</option>
                    {genLayer.proposals.filter((p: any) => p.status === 'PENDING').map((p: any) => (
                      <option key={p.proposal_id} value={p.proposal_id} className="bg-black">{p.proposal_id}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-12">
                  <button type="submit" disabled={genLayer.isEvaluating} className="floema-btn w-40 h-40 interactive group disabled:opacity-50">
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase transition-colors">
                      {genLayer.isEvaluating ? 'Running...' : 'Execute'}
                    </span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Ledger View - Flowing List */}
        <div className="w-full flex flex-col gap-12">
          <div className="flex justify-between items-center border-b border-white/20 pb-12">
            <h3 className="font-luxury text-4xl italic">Ledger.</h3>
            <button onClick={genLayer.fetchProposals} disabled={genLayer.isFetching} className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity interactive">
              {genLayer.isFetching ? 'Syncing...' : 'Refresh'}
            </button>
          </div>

          <div className="flex flex-col gap-16">
            <AnimatePresence>
              {genLayer.proposals.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="py-12 opacity-30 text-center font-luxury italic text-2xl"
                >
                  Empty
                </motion.div>
              ) : (
                genLayer.proposals.map((prop: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, ease: [0.77, 0, 0.175, 1], delay: idx * 0.1 }}
                    key={prop.proposal_id} 
                    className="flex flex-col gap-6"
                  >
                    <div className="flex items-end justify-between border-b border-white/20 pb-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-50">ID / {prop.borrower.slice(0, 6)}</span>
                        <h4 className="font-luxury text-3xl md:text-5xl">{prop.proposal_id}</h4>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-luxury text-2xl italic opacity-70">${prop.requested_amount}</span>
                        <span className={`font-sans text-[9px] tracking-[0.3em] uppercase px-4 py-2 rounded-full border ${
                          prop.status === 'PENDING' ? 'border-white/30 text-white/50' : 
                          prop.status === 'APPROVED' ? 'border-white text-black bg-white' : 
                          'border-white/10 text-white/30 line-through'
                        }`}>
                          {prop.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="font-sans text-sm md:text-base leading-relaxed opacity-70 max-w-2xl">
                      {prop.text_proposal}
                    </p>

                    {prop.status !== 'PENDING' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-6 p-8 bg-white/5 backdrop-blur-sm"
                      >
                        <h5 className="font-luxury italic text-xl mb-4">Neural Consensus</h5>
                        <p className="font-sans text-xs leading-loose opacity-60">
                          {prop.ai_reasoning}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
