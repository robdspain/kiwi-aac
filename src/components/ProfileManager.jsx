import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

const AVATARS = ['👤', '👦', '👧', '🧒', '👶', '🐶', '🐱', '🦁', '🐻', '🐰', '🦊', '🐸', '🌟', '🌈', '🎈', '🚀'];

const ProfileManager = ({ isOpen, onClose }) => {
    const { profiles, currentProfile, addProfile, updateProfile, deleteProfile, switchProfile } = useProfile();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState('');
    const [newAvatar, setNewAvatar] = useState('👤');

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newName.trim()) {
            const profile = addProfile(newName.trim(), newAvatar);
            switchProfile(profile.id);
            setIsAdding(false);
            setNewName('');
            setNewAvatar('👤');
        }
    };

    const handleUpdate = (id) => {
        if (newName.trim()) {
            updateProfile(id, { name: newName.trim(), avatar: newAvatar });
            setEditingId(null);
            setNewName('');
            setNewAvatar('👤');
        }
    };

    const startEdit = (profile) => {
        setEditingId(profile.id);
        setNewName(profile.name);
        setNewAvatar(profile.avatar);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '20px', padding: '20px',
                width: '90%', maxWidth: '400px', maxHeight: '80vh', overflow: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Learner Profiles</h2>
                    <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {profiles.map(profile => (
                        <div key={profile.id} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px', borderRadius: '12px',
                            background: currentProfile.id === profile.id ? '#E3F2FD' : '#f5f5f5',
                            border: currentProfile.id === profile.id ? '2px solid #007AFF' : '2px solid transparent'
                        }}>
                            {editingId === profile.id ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {AVATARS.map(a => (
                                            <button key={a} onClick={() => setNewAvatar(a)} style={{
                                                fontSize: '1.5rem', padding: '4px', border: newAvatar === a ? '2px solid #007AFF' : '1px solid #ddd',
                                                borderRadius: '8px', background: 'white', cursor: 'pointer'
                                            }}>{a}</button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                                        autoFocus
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleUpdate(profile.id)} style={{ flex: 1, padding: '8px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                                        <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '8px', background: '#E5E5EA', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span style={{ fontSize: '2rem' }}>{profile.avatar}</span>
                                    <span style={{ flex: 1, fontWeight: currentProfile.id === profile.id ? 'bold' : 'normal' }}>{profile.name}</span>
                                    {currentProfile.id !== profile.id && (
                                        <button onClick={() => switchProfile(profile.id)} style={{ padding: '6px 12px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Switch</button>
                                    )}
                                    <button onClick={() => startEdit(profile)} style={{ padding: '6px 10px', background: '#E5E5EA', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✏️</button>
                                    {profile.id !== 'default' && (
                                        <button onClick={() => { if (confirm(`Delete ${profile.name}?`)) deleteProfile(profile.id); }} style={{ padding: '6px 10px', background: '#FF3B30', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🗑️</button>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {isAdding ? (
                    <div style={{ marginTop: '15px', padding: '12px', background: '#f5f5f5', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {AVATARS.map(a => (
                                <button key={a} onClick={() => setNewAvatar(a)} style={{
                                    fontSize: '1.5rem', padding: '4px', border: newAvatar === a ? '2px solid #007AFF' : '1px solid #ddd',
                                    borderRadius: '8px', background: 'white', cursor: 'pointer'
                                }}>{a}</button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Learner's name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '8px' }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleAdd} style={{ flex: 1, padding: '10px', background: '#34C759', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add Profile</button>
                            <button onClick={() => { setIsAdding(false); setNewName(''); }} style={{ flex: 1, padding: '10px', background: '#E5E5EA', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)} style={{
                        width: '100%', marginTop: '15px', padding: '12px',
                        background: '#34C759', color: 'white', border: 'none',
                        borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                        + Add New Learner
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileManager;
