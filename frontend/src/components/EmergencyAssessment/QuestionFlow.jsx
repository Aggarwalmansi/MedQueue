import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Activity, Brain, AlertCircle } from 'lucide-react';
import { emergencyTypes } from '../../data/emergencyLogic';

const iconMap = {
    Heart, Wind, Activity, Brain, AlertCircle
};

const QuestionFlow = ({ step, currentType, currentQuestion, onSelectType, onAnswer }) => {

    // Step 0: Select Emergency Type
    if (step === 0) {
        return (
            <div className="type-selection">
                <h3>What type of emergency is this?</h3>
                <div className="emergency-types-grid">
                    {emergencyTypes.map((type) => {
                        const Icon = iconMap[type.icon];
                        return (
                            <motion.div
                                key={type.id}
                                className="type-card"
                                onClick={() => onSelectType(type)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="type-icon" style={{ backgroundColor: type.color }}>
                                    <Icon size={32} />
                                </div>
                                <h4>{type.label}</h4>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Step > 0: Questions
    if (currentQuestion) {
        return (
            <motion.div
                className="question-card"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                key={currentQuestion.id}
            >
                <h3>{currentQuestion.text}</h3>
                <div className="options-grid">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className="option-btn"
                            onClick={() => onAnswer(currentQuestion.id, option)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </motion.div>
        );
    }

    return null;
};

export default QuestionFlow;
