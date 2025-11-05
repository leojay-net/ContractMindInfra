/**
 * Create Agent Page
 * Form to deploy a new AI agent with ABI upload
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Upload,
    FileText,
    Bot,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Code,
    Settings,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { parseEther } from 'viem';

type Step = 1 | 2 | 3;

export default function CreateAgentPage() {
    const router = useRouter();
    const { address } = useAccount();
    const toast = useToast();
    const { sendTransaction, data: txHash, isPending: isSending } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingTxData, setPendingTxData] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        targetContract: '',
        abi: '',
        personality: '',
        domainKnowledge: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            setErrors({ ...errors, abi: 'Please upload a valid JSON file' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                JSON.parse(content); // Validate JSON
                setFormData({ ...formData, abi: content });
                setErrors({ ...errors, abi: '' });
            } catch (error) {
                setErrors({ ...errors, abi: 'Invalid JSON format' });
            }
        };
        reader.readAsText(file);
    };

    const validateStep = (step: Step): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Agent name is required';
            if (!formData.targetContract.trim()) {
                newErrors.targetContract = 'Contract address is required';
            } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.targetContract)) {
                newErrors.targetContract = 'Invalid Ethereum address';
            }
            if (!formData.abi.trim()) newErrors.abi = 'ABI is required';
        }

        if (step === 2) {
            if (!formData.personality.trim()) {
                newErrors.personality = 'Personality description is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(3, prev + 1) as Step);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsSubmitting(true);
        try {
            const abiJson = JSON.parse(formData.abi);

            // TODO: Upload ABI to IPFS and get hash
            // For now, use a placeholder IPFS hash
            const configIPFS = `ipfs://placeholder-${Date.now()}`;

            // Parse ABI JSON
            let parsedAbi = null;
            try {
                parsedAbi = JSON.parse(formData.abi);
            } catch (error) {
                throw new Error('Invalid ABI JSON format');
            }

            toast.info('Preparing transaction...');

            // Step 1: Prepare the registration transaction
            const prepareResult = await apiClient.prepareAgentRegistration({
                ownerAddress: address,
                targetContract: formData.targetContract,
                name: formData.name,
                configIPFS,
                abi: parsedAbi, // Include ABI for agent functionality
            });

            if (!prepareResult.success || !prepareResult.requiresTransaction) {
                throw new Error('Failed to prepare transaction');
            }

            const tx = prepareResult.transaction;
            setPendingTxData({ tx, configIPFS, abi: parsedAbi });

            toast.info('Please sign the transaction in your wallet...');

            // Step 2: Send transaction via wallet
            sendTransaction({
                to: tx.to as `0x${string}`,
                data: tx.data as `0x${string}`,
                value: BigInt(tx.value || '0'),
                gas: BigInt(tx.gasEstimate),
            });

        } catch (error: any) {
            console.error('Error creating agent:', error);
            toast.error(error.message || 'Failed to create agent. Please try again.');
            setErrors({ submit: error.message || 'Failed to create agent. Please try again.' });
            setIsSubmitting(false);
        }
    };

    // Watch for transaction confirmation
    useEffect(() => {
        if (isConfirmed && txHash && pendingTxData) {
            confirmRegistration(txHash);
        }
    }, [isConfirmed, txHash, pendingTxData]);

    const confirmRegistration = async (hash: `0x${string}`) => {
        try {
            toast.info('Confirming registration on backend...');

            // Step 3: Confirm with backend, passing the ABI
            const confirmResult = await apiClient.confirmAgentRegistration(
                hash,
                pendingTxData?.abi
            );

            if (!confirmResult.success) {
                throw new Error(confirmResult.error || 'Failed to confirm registration');
            }

            toast.success('Agent registered successfully!');
            router.push('/dashboard/agents');
        } catch (error: any) {
            console.error('Error confirming agent:', error);
            toast.error(error.message || 'Failed to confirm agent registration.');
        } finally {
            setIsSubmitting(false);
            setPendingTxData(null);
        }
    };

    const steps = [
        { number: 1, title: 'Contract Details', icon: Code },
        { number: 2, title: 'AI Configuration', icon: Sparkles },
        { number: 3, title: 'Review & Deploy', icon: CheckCircle },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create New Agent</h1>
                <p className="text-gray-400">Deploy an AI agent for your smart contract in minutes</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep === step.number
                                        ? 'bg-white text-black'
                                        : currentStep > step.number
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/10 text-gray-500'
                                        }`}
                                >
                                    {currentStep > step.number ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p
                                        className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-px bg-white/10 mx-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                {/* Step 1: Contract Details */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Agent Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., DeFi Staking Agent"
                                className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'
                                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all`}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of what this agent does..."
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Target Contract Address *
                            </label>
                            <input
                                type="text"
                                value={formData.targetContract}
                                onChange={(e) => setFormData({ ...formData, targetContract: e.target.value })}
                                placeholder="0x..."
                                className={`w-full px-4 py-3 bg-white/5 border ${errors.targetContract ? 'border-red-500' : 'border-white/10'
                                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-mono text-sm`}
                            />
                            {errors.targetContract && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.targetContract}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Contract ABI *
                            </label>
                            <div className="space-y-3">
                                <div
                                    className={`relative border-2 border-dashed ${errors.abi ? 'border-red-500' : 'border-white/20'
                                        } rounded-lg p-8 text-center hover:border-white/40 transition-all`}
                                >
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                    <p className="text-sm text-white font-medium mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">JSON file (ABI)</p>
                                    {formData.abi && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">ABI loaded successfully</span>
                                        </div>
                                    )}
                                </div>
                                {errors.abi && (
                                    <p className="text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.abi}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: AI Configuration */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Personality & Tone *
                            </label>
                            <textarea
                                value={formData.personality}
                                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                                placeholder="e.g., Professional and helpful DeFi assistant. Explains complex concepts clearly and provides actionable insights."
                                rows={4}
                                className={`w-full px-4 py-3 bg-white/5 border ${errors.personality ? 'border-red-500' : 'border-white/10'
                                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none`}
                            />
                            {errors.personality && (
                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.personality}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                Define how your agent should communicate with users
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Domain Knowledge (Optional)
                            </label>
                            <textarea
                                value={formData.domainKnowledge}
                                onChange={(e) => setFormData({ ...formData, domainKnowledge: e.target.value })}
                                placeholder="e.g., This is a liquid staking protocol where users can stake SOMI tokens to earn rewards. APY is calculated based on..."
                                rows={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Provide context about your protocol to help the agent give better responses
                            </p>
                        </div>

                        {/* Example Responses */}
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Example Responses
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-gray-400 mb-1">User: "What's my balance?"</p>
                                    <p className="text-white">
                                        Agent: "You have 500 SOMI staked with 12.5 SOMI in pending rewards..."
                                    </p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-gray-400 mb-1">User: "Stake 100 tokens"</p>
                                    <p className="text-white">
                                        Agent: "I'll help you stake 100 SOMI. Here's what will happen..."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-sm font-semibold text-white mb-3">Agent Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Contract:</span>
                                        <span className="text-white font-mono text-xs">{formData.targetContract}</span>
                                    </div>
                                    {formData.description && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Description:</span>
                                            <span className="text-white text-right max-w-xs">{formData.description}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-sm font-semibold text-white mb-3">AI Configuration</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Personality:</span>
                                        <p className="text-white mt-1">{formData.personality}</p>
                                    </div>
                                    {formData.domainKnowledge && (
                                        <div>
                                            <span className="text-gray-400">Domain Knowledge:</span>
                                            <p className="text-white mt-1">{formData.domainKnowledge}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-400 mb-1">
                                            Before Deploying
                                        </p>
                                        <ul className="text-xs text-yellow-400/80 space-y-1">
                                            <li>• Ensure your contract address is correct</li>
                                            <li>• Verify the ABI matches your deployed contract</li>
                                            <li>• You'll need to authorize specific functions after deployment</li>
                                            <li>• Deployment will require a small gas fee</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-sm text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.submit}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isSending || isConfirming}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Waiting for signature...
                                </>
                            ) : isConfirming ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Confirming transaction...
                                </>
                            ) : isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Preparing...
                                </>
                            ) : (
                                <>
                                    <Bot className="w-5 h-5" />
                                    Deploy Agent
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
