import React, { useEffect, useRef } from 'react';
import { Activity, XCircle, CheckCircle2, ArrowUpRight, Wallet } from 'lucide-react';
import { useGenLayer } from './hooks/useGenLayer';
import { InitializationView } from './components/InitializationView';
import { LoanDashboard } from './components/LoanDashboard';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function App() {
  const genLayer = useGenLayer();
  const {
    address,
    isConnected,
    connect,
    disconnect,
    contractAddress,
    setContractAddress,
    deployContract,
    isDeploying,
    recentTransactions,
    error,
    setError
  } = genLayer;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (contractAddress && contractAddress !== "") {
      genLayer.fetchProposals();
    }
  }, [contractAddress, genLayer.fetchProposals]);

  const getExplorerUrl = (txHash: string) => {
    return `https://explorer-studio.genlayer.com/tx/${txHash}`;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black font-sans relative text-white selection:bg-white selection:text-black w-full overflow-hidden">
      
      {/* Massive Abstract Fluid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] fluid-bg opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] fluid-bg opacity-20" />
      </div>

      {/* Elegant Nav */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference"
      >
        <div className="font-luxury text-2xl tracking-widest font-bold">
          G.
        </div>
        
        <div className="flex gap-8 items-center font-sans text-xs tracking-[0.2em] uppercase">
          {isConnected && (
            <button
              disabled={isDeploying}
              onClick={async () => {
                localStorage.removeItem('GENLEND_CONTRACT_ADDRESS_V2');
                setContractAddress('');
                await deployContract();
              }}
              className="opacity-70 hover:opacity-100 transition-opacity disabled:opacity-30"
            >
              {isDeploying ? 'DEPLOYING...' : 'DEPLOY CONTRACT'}
            </button>
          )}
          
          <button
            onClick={isConnected ? disconnect : connect}
            className="flex items-center gap-3 interactive hover:opacity-70 transition-opacity"
          >
            {isConnected ? (
              <span>AUTH: {address.slice(0, 6)}</span>
            ) : (
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" /> INIT LINK
              </span>
            )}
          </button>
        </div>
      </motion.header>

      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* Massive Hero Section */}
        <section className="h-screen w-full flex items-center justify-center relative">
          <motion.h1 
            style={{ y: titleY, opacity: titleOpacity }}
            className="text-massive font-luxury font-bold text-center z-10 pointer-events-none mix-blend-difference"
          >
            <motion.span 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
              className="block"
            >
              LEND.
            </motion.span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 font-sans text-xs tracking-[0.3em] uppercase opacity-50 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-12 bg-white/30" />
            <span>Scroll to explore</span>
          </motion.div>
        </section>

        {/* Dynamic Interface */}
        <section className="w-full max-w-[1600px] px-8 md:px-16 py-24 min-h-screen">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-16 border-b border-white pb-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <span className="font-luxury italic text-2xl">Error.</span>
                  <p className="text-sm font-sans tracking-widest uppercase opacity-70">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="p-4 hover:opacity-50 transition-opacity">
                  <XCircle className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!contractAddress || contractAddress === "" ? (
              <motion.div 
                key="init"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
                className="w-full flex justify-center py-24"
              >
                <InitializationView 
                  onDeploy={deployContract} 
                  isDeploying={isDeploying} 
                  address={address} 
                />
              </motion.div>
            ) : (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
                className="w-full"
              >
                <LoanDashboard genLayer={genLayer} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant Transactions List */}
          <AnimatePresence>
            {recentTransactions.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
                className="mt-32 w-full max-w-4xl mx-auto"
              >
                <h3 className="font-luxury text-4xl mb-12 italic border-b border-white/20 pb-8">
                  Recent Activity.
                </h3>
                
                <div className="flex flex-col">
                  {recentTransactions.map((tx, idx) => (
                    <motion.a 
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noreferrer"
                      key={tx.hash}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.8 }}
                      className="group py-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between hover:border-white transition-colors interactive"
                    >
                      <div className="flex items-center gap-8 mb-4 md:mb-0">
                        <div className={`w-2 h-2 rounded-full ${
                          tx.status === 'pending' ? 'bg-white animate-pulse' :
                          tx.status === 'success' ? 'bg-white/50' :
                          'bg-white/20'
                        }`} />
                        <span className="font-sans text-xs uppercase tracking-[0.3em] opacity-50 group-hover:opacity-100 transition-opacity">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-12">
                        {tx.proposal_id && (
                          <span className="font-luxury text-xl italic opacity-70 group-hover:opacity-100 transition-opacity">
                            {tx.proposal_id}
                          </span>
                        )}
                        <span className="font-sans text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                          {tx.hash.slice(0, 8)}...
                        </span>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </section>
      </main>
    </div>
  );
}
