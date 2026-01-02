import { useState } from 'react';
import AvatarRenderer from './AvatarRenderer';
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS, ASSETS } from '../utils/avatarAssets';

const CharacterBuilder = ({ onSave, onClose }) => {
    const [recipe, setRecipe] = useState({
        head: 'round',
        skin: SKIN_TONES[1].color,
        hair: 'short',
        hairColor: HAIR_COLORS[1].color,
        eyeColor: EYE_COLORS[0].id,
        facialHair: 'none',
        eyes: 'happy',
        mouth: 'smile',
        accessory: 'none'
    });
    const [name, setName] = useState('');

    const update = (key, val) => setRecipe(prev => ({ ...prev, [key]: val }));

    const sections = [
        { label: 'Skin', key: 'skin', options: SKIN_TONES.map(s => ({ id: s.color, color: s.color, label: s.label })) },
        { label: 'Hair Style', key: 'hair', options: Object.keys(ASSETS.hair).map(h => ({ id: h, label: h })) },
        { label: 'Hair Color', key: 'hairColor', options: HAIR_COLORS.map(c => ({ id: c.color, color: c.color })) },
        { label: 'Eye Color', key: 'eyeColor', options: EYE_COLORS.map(c => ({ id: c.id, color: c.id, label: c.label })) },
        { label: 'Head Shape', key: 'head', options: Object.keys(ASSETS.heads).map(h => ({ id: h, label: h })) },
        { label: 'Facial Hair', key: 'facialHair', options: Object.keys(ASSETS.facial_hair).map(h => ({ id: h, label: h })) },
        { label: 'Eyes', key: 'eyes', options: Object.keys(ASSETS.eyes).map(h => ({ id: h, label: h })) },
        { label: 'Accessories', key: 'accessory', options: Object.keys(ASSETS.accessories).map(h => ({ id: h, label: h })) }
    ];

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 11000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: 'white', padding: '30px', borderRadius: '24px',
                width: '95%', maxWidth: '800px', height: '90vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }} onClick={e => e.stopPropagation()}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Create &quot;Circle of Support&quot; Person</h2>
                    <button 
                        onClick={onClose} 
                        aria-label="Close"
                        style={{ 
                            border: 'none', 
                            background: '#f0f0f0', 
                            fontSize: '1.2rem', 
                            cursor: 'pointer',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-pop)'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', gap: '30px', overflow: 'hidden' }}>
                    {/* Preview Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA', borderRadius: '20px' }}>
                        <div style={{ background: 'white', borderRadius: '50%', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
                            <AvatarRenderer recipe={recipe} size={250} />
                        </div>
                        <input 
                            placeholder="Person&apos;s Name (e.g. Dad)" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ marginTop: '30px', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '2px solid #ddd', width: '80%', fontSize: '1.2rem', textAlign: 'center' }}
                        />
                    </div>

                    {/* Controls Area */}
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        {sections.map(sec => (
                            <div key={sec.key} style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sec.label}</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {sec.options.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => update(sec.key, opt.id)}
                                            style={{
                                                width: opt.color ? '48px' : 'auto',
                                                height: '48px',
                                                minWidth: '48px',
                                                padding: opt.color ? '0' : '10px 15px',
                                                borderRadius: opt.color ? '50%' : '12px',
                                                background: opt.color || (recipe[sec.key] === opt.id ? 'var(--primary)' : '#eee'),
                                                color: opt.color ? 'transparent' : (recipe[sec.key] === opt.id ? 'white' : 'var(--text-primary)'),
                                                border: recipe[sec.key] === opt.id ? '3px solid #000' : '2px solid transparent',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                transition: 'var(--transition-pop)',
                                                transform: recipe[sec.key] === opt.id ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: recipe[sec.key] === opt.id ? 'var(--shadow-soft)' : 'none'
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '15px', background: '#eee', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    <button 
                        onClick={() => {
                            if (!name) return alert('Please enter a name');
                            onSave(name, recipe);
                        }}
                        style={{ flex: 2, padding: '15px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        Save to &quot;My People&quot;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterBuilder;
