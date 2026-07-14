import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onDeploy: () => void;
  isDeploying: boolean;
  address: string;
}

export const InitializationView: React.FC<Props> = ({ onDeploy, isDeploying, address }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        className="max-w-2xl"
      >
        <h2 className="font-luxury text-6xl md:text-8xl italic mb-12 font-bold tracking-tighter">
          Initialize.
        </h2>
        
        <p className="font-sans text-sm md:text-base opacity-50 tracking-[0.2em] leading-loose uppercase max-w-lg mx-auto mb-20">
          The lending protocol is waiting to be deployed to the GenLayer network. Connect your wallet to begin.
        </p>

        {!address ? (
          <div className="inline-block border border-white/20 px-8 py-4 font-sans text-xs tracking-widest uppercase opacity-50">
            Awaiting Authentication
          </div>
        ) : (
          <button
            onClick={onDeploy}
            disabled={isDeploying}
            className="floema-btn w-48 h-48 mx-auto interactive group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-sans text-xs tracking-[0.3em] uppercase group-hover:text-black transition-colors">
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </span>
          </button>
        )}
      </motion.div>
    </div>
  );
};
