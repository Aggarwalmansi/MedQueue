import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, ChevronLeft } from 'lucide-react';
import QuestionFlow from './QuestionFlow';
import ResultScreen from './ResultScreen';
import { evaluateAssessment } from '../../data/emergencyLogic';
import '../../styles/EmergencyAssessment.css';

const EmergencyModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [selectedType, setSelectedType] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleSelectType = (type) => {
        setSelectedType(type);
        setStep(1);
        setCurrentQuestionIndex(0);
    };

    const handleAnswer = (questionId, option) => {
        const newAnswers = { ...answers, [questionId]: option.label }; // Store label or value
        setAnswers(newAnswers);

        // Check logic
        if (option.next && option.next.startsWith('result_')) {
            // Immediate result trigger (simplified for MVP)
            // In a real app, we might parse the string "result_critical"
            const urgency = option.next.split('_')[1].toUpperCase();
            const evalResult = evaluateAssessment(selectedType.id, newAnswers);
            // Override urgency if needed or just use eval logic
            setResult(evalResult);
        } else if (option.next && option.next.startsWith('evaluate_')) {
            const evalResult = evaluateAssessment(selectedType.id, newAnswers);
            setResult(evalResult);
        } else {
            // Go to next question
            const nextQIndex = selectedType.questions.findIndex(q => q.id === option.next);
            if (nextQIndex !== -1) {
                setCurrentQuestionIndex(nextQIndex);
            } else {
                // Fallback if next question not found (shouldn't happen with correct data)
                const evalResult = evaluateAssessment(selectedType.id, newAnswers);
                setResult(evalResult);
            }
        }
    };

    const resetAssessment = () => {
        setStep(0);
        setSelectedType(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResult(null);
    };

    const handleClose = () => {
        resetAssessment();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="emergency-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="emergency-modal"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                >
                    <div className="emergency-header">
                        <div className="header-title">
                            <AlertCircle size={24} />
                            <h2>Emergency Assessment</h2>
                        </div>
                        <button className="close-modal-btn" onClick={handleClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="emergency-content">
                        {!result ? (
                            <QuestionFlow
                                step={step}
                                currentType={selectedType}
                                currentQuestion={selectedType?.questions[currentQuestionIndex]}
                                onSelectType={handleSelectType}
                                onAnswer={handleAnswer}
                            />
                        ) : (
                            <ResultScreen result={result} />
                        )}
                    </div>

                    {step > 0 && !result && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button
                                onClick={resetAssessment}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <ChevronLeft size={16} /> Start Over
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmergencyModal;
