import React, { useState } from 'react';
import AvatarRenderer from './AvatarRenderer';
import { SKIN_TONES, HAIR_COLORS, ASSETS } from '../utils/avatarAssets';

const CharacterBuilder = ({ onSave, onClose }) => {
    const [recipe, setRecipe] = useState({
        head: 'round',
        skin: SKIN_TONES[1].color,
        hair: 'short',
        hairColor: HAIR_COLORS[1].color,
        facialHair: 'none',
        eyes: 'happy',
        mouth: 'smile',
        accessory: 'none'
    });
    const [name, setName] = useState('');
    const [currentStep, setCurrentStep] = useState(0);

    const update = (key, val) => setRecipe(prev => ({ ...prev, [key]: val }));

    const sections = [
        { label: 'Name', key: 'name', icon: '✏️', type: 'text' },
        { label: 'Skin Tone', key: 'skin', icon: '🎨', type: 'color', options: SKIN_TONES.map(s => ({ id: s.color, color: s.color, label: s.label })) },
        { label: 'Hair Style', key: 'hair', icon: '💇', type: 'choice', options: Object.keys(ASSETS.hair).map(h => ({ id: h, label: h })) },
        { label: 'Hair Color', key: 'hairColor', icon: '🌈', type: 'color', options: HAIR_COLORS.map(c => ({ id: c.color, color: c.color, label: c.label })) },
        { label: 'Eyes', key: 'eyes', icon: '👀', type: 'choice', options: Object.keys(ASSETS.eyes).map(h => ({ id: h, label: h })) },
        { label: 'Facial Hair', key: 'facialHair', icon: '🧔', type: 'choice', options: Object.keys(ASSETS.facial_hair).map(h => ({ id: h, label: h })) },
        { label: 'Accessories', key: 'accessory', icon: '👓', type: 'choice', options: Object.keys(ASSETS.accessories).map(h => ({ id: h, label: h })) }
    ];

    const currentSection = sections[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === sections.length - 1;

    const handleNext = () => {
        if (isFirstStep && !name) {
            alert('Please enter a name');
            return;
        }
        if (isLastStep) {
            onSave(name, recipe);
        } else {
            setCurrentStep(prev => Math.min(prev + 1, sections.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const renderStepContent = () => {
        if (currentSection.type === 'text') {
            return (
                <div style={{ width: '100%', maxWidth: '24rem' }}>
                    <input
                        placeholder="Person's Name (e.g. Dad, Mom, Teacher)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            borderRadius: '1rem',
                            border: '2px solid #E5E5EA',
                            fontSize: '1.25rem',
                            textAlign: 'center',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E5EA'}
                    />
                </div>
            );
        }

        if (currentSection.type === 'color') {
            return (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(4.5rem, 1fr))',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '28rem'
                }}>
                    {currentSection.options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => update(currentSection.key, opt.id)}
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '1rem',
                                background: opt.color,
                                border: recipe[currentSection.key] === opt.id ? '4px solid #007AFF' : '2px solid #E5E5EA',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: recipe[currentSection.key] === opt.id ? '0 4px 12px rgba(0,122,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                                transform: recipe[currentSection.key] === opt.id ? 'scale(1.05)' : 'scale(1)'
                            }}
                            title={opt.label}
                        />
                    ))}
                </div>
            );
        }

        if (currentSection.type === 'choice') {
            return (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(7rem, 1fr))',
                    gap: '0.75rem',
                    width: '100%',
                    maxWidth: '32rem'
                }}>
                    {currentSection.options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => update(currentSection.key, opt.id)}
                            style={{
                                padding: '1rem 1.25rem',
                                borderRadius: '0.75rem',
                                background: recipe[currentSection.key] === opt.id ? '#007AFF' : 'white',
                                color: recipe[currentSection.key] === opt.id ? 'white' : '#2D3436',
                                border: recipe[currentSection.key] === opt.id ? 'none' : '2px solid #E5E5EA',
                                cursor: 'pointer',
                                fontSize: '0.9375rem',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                textTransform: 'capitalize',
                                boxShadow: recipe[currentSection.key] === opt.id ? '0 4px 12px rgba(0,122,255,0.3)' : 'none'
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            );
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 11000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                borderRadius: '1.5rem',
                width: '95%',
                maxWidth: '42rem',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #E5E5EA',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700 }}>
                            Create Person
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6C757D' }}>
                            Step {currentStep + 1} of {sections.length}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#007AFF',
                            fontSize: '1.0625rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '0.5rem 0.75rem'
                        }}
                    >
                        Cancel
                    </button>
                </div>

                {/* Progress Bar */}
                <div style={{
                    height: '4px',
                    background: '#F2F2F7'
                }}>
                    <div style={{
                        height: '100%',
                        background: '#007AFF',
                        width: `${((currentStep + 1) / sections.length) * 100}%`,
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    overflowY: 'auto'
                }}>
                    {/* Avatar Preview */}
                    <div style={{
                        background: '#F8F9FA',
                        borderRadius: '50%',
                        padding: '1.5rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }}>
                        <AvatarRenderer recipe={recipe} size={200} />
                    </div>

                    {/* Step Title */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            {currentSection.icon}
                        </div>
                        <h3 style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#2D3436'
                        }}>
                            {currentSection.label}
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: '0.9375rem',
                            color: '#6C757D'
                        }}>
                            {currentSection.type === 'text' ? 'Enter the person\'s name' : 'Choose an option below'}
                        </p>
                    </div>

                    {/* Options */}
                    {renderStepContent()}
                </div>

                {/* Navigation */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid #E5E5EA',
                    display: 'flex',
                    gap: '0.75rem'
                }}>
                    {!isFirstStep && (
                        <button
                            onClick={handleBack}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: '#F2F2F7',
                                border: 'none',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: '#2D3436'
                            }}
                        >
                            ← Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        style={{
                            flex: 2,
                            padding: '1rem',
                            background: '#007AFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(0,122,255,0.3)'
                        }}
                    >
                        {isLastStep ? 'Save Person →' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterBuilder;
