import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Database, Cpu, Activity, ArrowRight } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';

const ArchitectureAnimation = () => {
  const steps = [
    {
      id: 'edge',
      title: 'Edge Intelligence',
      icon: <Cpu className="w-8 h-8 text-cyan-400" />,
      desc: 'High-frequency vital signs acquisition at the network edge.',
      tech: 'Python Edge Gateway',
      color: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      id: 'ssi',
      title: 'DID/VC Identity',
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      desc: 'Decentralized identity verification using RSA-2048 signing.',
      tech: 'W3C Verifiable Credentials',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'ai',
      title: 'Neural Detection',
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      desc: 'MMAE-ECG Transformers & One-Class SVM anomaly detection.',
      tech: 'Scikit-Learn & AI Mocks',
      color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      id: 'blockchain',
      title: 'Immutable Audit',
      icon: <Database className="w-8 h-8 text-amber-400" />,
      desc: 'Merkle root anchoring on Ethereum with IPFS persistence.',
      tech: 'Solidity & IPFS',
      color: 'from-amber-500/20 to-orange-500/20'
    },
    {
      id: 'frontend',
      title: 'Cinematic Monitor',
      icon: <Activity className="w-8 h-8 text-red-400" />,
      desc: 'Real-time oscilloscope rendering with canvas optimization.',
      tech: 'React & Socket.io',
      color: 'from-red-500/20 to-rose-500/20'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
            System Architecture
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A decentralized, AI-driven medical monitoring ecosystem. Follow the data flow from edge to blockchain.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 opacity-20 hidden lg:block -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10"
              >
                <GlassCard className={`h-full border-t-2 border-opacity-50 flex flex-col items-center text-center p-8 hover:scale-105 transition-transform duration-300`}>
                  <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${step.color} border border-white/10`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex-grow">{step.desc}</p>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-gray-500 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    {step.tech}
                  </div>
                </GlassCard>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <ArrowRight className="text-white/20 w-8 h-8" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Data Flow Animation Section */}
        <div className="mt-24">
          <GlassCard className="p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Real-time Orchestration</h2>
                <div className="space-y-6">
                  {[
                    "MQTT messages are ingested by processing workers.",
                    "RSA-2048 signatures verify device authenticity.",
                    "MMAE-ECG Transformers detect hidden arrhythmia patterns.",
                    "Batches are IPFS-anchored and Ethereum-notarized."
                  ].map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.5 + (i * 0.3) }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                      <p className="text-gray-300 text-sm">{text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="relative h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-2 border-white/20 rounded-full flex items-center justify-center"
                  >
                    <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
                  </motion.div>
                </motion.div>
                
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      x: [0, (i % 2 === 0 ? 100 : -100) * Math.random()],
                      y: [0, (i % 2 === 0 ? 100 : -100) * Math.random()],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

export default ArchitectureAnimation;
