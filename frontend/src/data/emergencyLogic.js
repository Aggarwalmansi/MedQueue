export const emergencyTypes = [
    {
        id: 'cardiac',
        label: 'Chest Pain / Heart',
        icon: 'Heart',
        color: '#ef4444',
        questions: [
            {
                id: 'q1',
                text: 'Are you experiencing chest pain, pressure, or squeezing?',
                options: [
                    { label: 'Yes', next: 'q2' },
                    { label: 'No', next: 'q_other' }
                ]
            },
            {
                id: 'q2',
                text: 'Does the pain spread to your arm, jaw, neck, or back?',
                options: [
                    { label: 'Yes', next: 'q3' },
                    { label: 'No', next: 'q3' }
                ]
            },
            {
                id: 'q3',
                text: 'Do you have any of these other symptoms?',
                multiSelect: true,
                options: [
                    { label: 'Shortness of breath', value: 'sob' },
                    { label: 'Sweating / Cold sweat', value: 'sweat' },
                    { label: 'Nausea / Vomiting', value: 'nausea' },
                    { label: 'Lightheadedness', value: 'dizzy' },
                    { label: 'None of the above', value: 'none' }
                ],
                next: 'evaluate_cardiac'
            }
        ]
    },
    {
        id: 'respiratory',
        label: 'Breathing Difficulty',
        icon: 'Wind',
        color: '#3b82f6',
        questions: [
            {
                id: 'q1',
                text: 'Are you struggling to breathe or speak in full sentences?',
                options: [
                    { label: 'Yes, severe struggle', next: 'result_critical' },
                    { label: 'Moderate difficulty', next: 'q2' },
                    { label: 'Mild / Only with exertion', next: 'q2' }
                ]
            },
            {
                id: 'q2',
                text: 'Do you have a history of asthma or COPD?',
                options: [
                    { label: 'Yes', next: 'q3' },
                    { label: 'No', next: 'q3' }
                ]
            },
            {
                id: 'q3',
                text: 'Are your lips or fingertips turning blue?',
                options: [
                    { label: 'Yes', next: 'result_critical' },
                    { label: 'No', next: 'evaluate_respiratory' }
                ]
            }
        ]
    },
    {
        id: 'trauma',
        label: 'Injury / Accident',
        icon: 'Activity',
        color: '#f97316',
        questions: [
            {
                id: 'q1',
                text: 'Is there severe bleeding that won\'t stop?',
                options: [
                    { label: 'Yes', next: 'result_critical_trauma' },
                    { label: 'No', next: 'q2' }
                ]
            },
            {
                id: 'q2',
                text: 'Was there a loss of consciousness or head injury?',
                options: [
                    { label: 'Yes', next: 'result_critical_head' },
                    { label: 'No', next: 'q3' }
                ]
            },
            {
                id: 'q3',
                text: 'Is there a visible bone deformity or inability to move a limb?',
                options: [
                    { label: 'Yes', next: 'result_high_ortho' },
                    { label: 'No', next: 'result_moderate_trauma' }
                ]
            }
        ]
    },
    {
        id: 'stroke',
        label: 'Stroke Symptoms',
        icon: 'Brain',
        color: '#8b5cf6',
        questions: [
            {
                id: 'q1',
                text: 'Check F.A.S.T. Do you have:',
                multiSelect: true,
                options: [
                    { label: 'Face drooping', value: 'face' },
                    { label: 'Arm weakness', value: 'arm' },
                    { label: 'Speech difficulty', value: 'speech' },
                    { label: 'None of these', value: 'none' }
                ],
                next: 'evaluate_stroke'
            }
        ]
    },
    {
        id: 'other',
        label: 'Other Emergency',
        icon: 'AlertCircle',
        color: '#64748b',
        questions: [
            {
                id: 'q1',
                text: 'How would you rate your pain level (1-10)?',
                options: [
                    { label: 'Severe (8-10)', next: 'result_high_general' },
                    { label: 'Moderate (4-7)', next: 'result_moderate_general' },
                    { label: 'Mild (1-3)', next: 'result_low_general' }
                ]
            }
        ]
    }
];

export const evaluateAssessment = (typeId, answers) => {
    // Default fallback
    let result = {
        urgency: 'MODERATE',
        color: 'yellow',
        facility: 'General Emergency Room',
        actions: ['Go to the nearest hospital', 'Monitor symptoms'],
        specialization: 'General Medicine'
    };

    if (typeId === 'cardiac') {
        const symptoms = answers['q3'] || [];
        const hasSevereSymptoms = symptoms.includes('sob') || symptoms.includes('sweat') || symptoms.includes('nausea');

        if (hasSevereSymptoms) {
            result = {
                urgency: 'CRITICAL',
                color: 'red',
                facility: 'Cardiac ICU with Cath Lab',
                actions: ['Call 108 IMMEDIATELY', 'Do not drive yourself', 'Chew an aspirin if not allergic'],
                specialization: 'Cardiology'
            };
        } else {
            result = {
                urgency: 'HIGH',
                color: 'orange',
                facility: 'Emergency Room with Cardiology',
                actions: ['Seek immediate medical attention', 'Have someone drive you'],
                specialization: 'Cardiology'
            };
        }
    }

    if (typeId === 'respiratory') {
        if (answers['q1'] === 'Yes, severe struggle' || answers['q3'] === 'Yes') {
            result = {
                urgency: 'CRITICAL',
                color: 'red',
                facility: 'ER with ICU & Ventilator Support',
                actions: ['Call 108 IMMEDIATELY', 'Sit upright', 'Loosen tight clothing'],
                specialization: 'Pulmonology'
            };
        } else {
            result = {
                urgency: 'HIGH',
                color: 'orange',
                facility: 'Emergency Room',
                actions: ['Go to nearest hospital', 'Use inhaler if prescribed'],
                specialization: 'Pulmonology'
            };
        }
    }

    if (typeId === 'trauma') {
        if (answers['q1'] === 'Yes') { // Severe bleeding
            result = {
                urgency: 'CRITICAL',
                color: 'red',
                facility: 'Level 1 Trauma Center',
                actions: ['Call 108', 'Apply firm pressure to wound', 'Keep patient warm'],
                specialization: 'Trauma Surgery'
            };
        } else if (answers['q2'] === 'Yes') { // Head injury
            result = {
                urgency: 'CRITICAL',
                color: 'red',
                facility: 'Trauma Center with Neurosurgery',
                actions: ['Call 108', 'Do not move neck if spinal injury suspected'],
                specialization: 'Neurology'
            };
        } else if (answers['q3'] === 'Yes') { // Bone deformity
            result = {
                urgency: 'HIGH',
                color: 'orange',
                facility: 'Hospital with Orthopedics',
                actions: ['Go to ER', 'Immobilize the limb', 'Apply ice'],
                specialization: 'Orthopedics'
            };
        } else {
            result = {
                urgency: 'MODERATE',
                color: 'yellow',
                facility: 'General Emergency Room',
                actions: ['Visit ER or Urgent Care', 'Clean wound if possible'],
                specialization: 'General Surgery'
            };
        }
    }

    if (typeId === 'stroke') {
        const symptoms = answers['q1'] || [];
        if (symptoms.length > 0 && !symptoms.includes('none')) {
            result = {
                urgency: 'CRITICAL',
                color: 'red',
                facility: 'Comprehensive Stroke Center',
                actions: ['Call 108 IMMEDIATELY', 'Note time symptoms started', 'Do not give food or drink'],
                specialization: 'Neurology'
            };
        } else {
            result = {
                urgency: 'HIGH',
                color: 'orange',
                facility: 'Emergency Room',
                actions: ['Seek medical evaluation immediately to rule out TIA'],
                specialization: 'Neurology'
            };
        }
    }

    if (typeId === 'other') {
        if (answers['q1'] === 'Severe (8-10)') {
            result = {
                urgency: 'HIGH',
                color: 'orange',
                facility: 'Emergency Room',
                actions: ['Go to nearest ER'],
                specialization: 'General Medicine'
            };
        } else if (answers['q1'] === 'Moderate (4-7)') {
            result = {
                urgency: 'MODERATE',
                color: 'yellow',
                facility: 'Urgent Care or ER',
                actions: ['Visit doctor or urgent care'],
                specialization: 'General Medicine'
            };
        } else {
            result = {
                urgency: 'LOW',
                color: 'green',
                facility: 'General Clinic / OPD',
                actions: ['Schedule appointment with doctor'],
                specialization: 'General Medicine'
            };
        }
    }

    return result;
};
