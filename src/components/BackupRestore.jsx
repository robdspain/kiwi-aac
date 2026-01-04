import { useRef, useState } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import cloudSyncService from '../services/CloudSyncService';
import { checkCloudSync, checkTeamSharing } from '../utils/paywall';
import { importAllMedia } from '../utils/db';

const BackupRestore = ({ isOpen, onClose }) => {
    const fileInputRef = useRef(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncCode, setSyncCode] = useState(cloudSyncService.getActiveSyncCode() || '');
    const [activeTab, setActiveTab] = useState('local'); // 'local' or 'cloud'

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsSyncing(true);
        try {
            // Get full data including media from IndexedDB
            const fullData = await cloudSyncService.getFullLocalData();
            
            const backup = {
                version: '2.0',
                timestamp: new Date().toISOString(),
                ...fullData
            };

            const fileName = `kiwi-full-backup-${new Date().toISOString().split('T')[0]}.json`;
            const jsonString = JSON.stringify(backup);

            if (Capacitor.isNativePlatform()) {
                // Write file to cache directory
                await Filesystem.writeFile({
                    path: fileName,
                    data: jsonString,
                    directory: Directory.Cache,
                    encoding: Encoding.UTF8
                });

                // Get the URI
                const result = await Filesystem.getUri({
                    directory: Directory.Cache,
                    path: fileName
                });

                // Share the file
                await Share.share({
                    title: 'Kiwi Voice Backup',
                    text: 'Here is my Kiwi Voice full backup (including photos and voice).',
                    url: result.uri,
                    dialogTitle: 'Save Backup'
                });
            } else {
                // Web Download
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const backup = JSON.parse(event.target.result);

                if (!backup.version) {
                    alert('Invalid backup file format.');
                    return;
                }

                if (window.confirm('This will replace all current data including photos and voice recordings. Continue?')) {
                    // 1. Restore localStorage
                    const localData = backup.localStorage || backup.data; // v2.0 or v1.0
                    if (localData) {
                        // Clear existing kiwi data
                        const keysToRemove = [];
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key.startsWith('kiwi') || key.startsWith('kians')) {
                                keysToRemove.push(key);
                            }
                        }
                        keysToRemove.forEach(key => localStorage.removeItem(key));

                        Object.entries(localData).forEach(([key, value]) => {
                            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                        });
                    }

                    // 2. Restore Media
                    if (backup.media) {
                        await importAllMedia(backup.media);
                    }

                    alert('Backup restored! The app will reload.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('Failed to import backup. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    const handleCloudBackup = async () => {
        if (!cloudSyncService.isConfigured()) {
            alert('Cloud Sync is not configured. Please add VITE_NEON_DATABASE_URL to your environment.');
            return;
        }

        const hasAccess = await checkCloudSync();
        if (!hasAccess) return;

        setIsSyncing(true);
        try {
            const code = await cloudSyncService.uploadData(syncCode);
            setSyncCode(code);
            localStorage.setItem('kiwi_active_sync_code', code);
            alert(`Cloud backup successful!\n\nYour Sync Code is: ${code}\n\nThis includes all your boards, custom photos, and voice recordings.`);
        } catch (error) {
            console.error('Cloud backup failed:', error);
            alert('Cloud backup failed. Check your connection or database configuration.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleJoinTeam = async () => {
        if (!cloudSyncService.isConfigured()) {
            alert('Cloud Sync is not configured.');
            return;
        }

        const hasAccess = await checkTeamSharing();
        if (!hasAccess) return;

        const code = prompt('Enter the Sync Code from your other device:');
        if (!code || code.length < 4) return;

        setIsSyncing(true);
        try {
            if (window.confirm('This will replace all current data with the cloud version (including photos/voice). Continue?')) {
                await cloudSyncService.joinTeam(code);
                alert('Success! Your device is now linked. The app will reload.');
                window.location.reload();
            }
        } catch (error) {
            console.error('Join team failed:', error);
            alert('Failed to link device. Please check the code and try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '20px', padding: '25px',
                width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>💾 Backup & Sync</h2>
                    <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', background: '#F2F2F7', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
                    <button 
                        onClick={() => setActiveTab('local')}
                        style={{ 
                            flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                            background: activeTab === 'local' ? 'white' : 'transparent',
                            fontWeight: activeTab === 'local' ? 'bold' : 'normal',
                            boxShadow: activeTab === 'local' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        📁 File
                    </button>
                    <button 
                        onClick={() => setActiveTab('cloud')}
                        style={{ 
                            flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                            background: activeTab === 'cloud' ? 'white' : 'transparent',
                            fontWeight: activeTab === 'cloud' ? 'bold' : 'normal',
                            boxShadow: activeTab === 'cloud' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        ☁️ Cloud
                    </button>
                </div>

                {activeTab === 'local' ? (
                    <>
                        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5', fontSize: '0.9rem' }}>
                            Save a full backup file to your device. <b>Includes all photos and voice recordings.</b>
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={handleExport}
                                disabled={isSyncing}
                                style={{
                                    padding: '16px', background: '#34C759', color: 'white',
                                    border: 'none', borderRadius: '12px', fontSize: '1rem',
                                    fontWeight: 'bold', cursor: 'pointer', opacity: isSyncing ? 0.7 : 1,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {isSyncing ? '⌛ Preparing...' : '📥 Export Full Backup'}
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: '16px', background: '#007AFF', color: 'white',
                                    border: 'none', borderRadius: '12px', fontSize: '1rem',
                                    fontWeight: 'bold', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                📤 Import Backup File
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".json"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {!cloudSyncService.isConfigured() && (
                            <div style={{ background: '#FFF9E6', padding: '12px', borderRadius: '10px', border: '1px solid #FFE4B5', marginBottom: '15px', fontSize: '0.8rem', color: '#856404' }}>
                                ⚠️ <b>Cloud Not Configured:</b> Database URL missing from environment.
                            </div>
                        )}
                        
                        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5', fontSize: '0.9rem' }}>
                            Sync your boards across devices using a code. <b>Includes all photos and voice.</b>
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {syncCode && (
                                <div style={{ 
                                    background: '#F0F9FF', border: '2px dashed #007AFF', borderRadius: '12px',
                                    padding: '15px', textAlign: 'center', marginBottom: '10px'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: '#007AFF', marginBottom: '5px', fontWeight: 'bold' }}>ACTIVE SYNC CODE</div>
                                    <div style={{ fontSize: '2rem', letterSpacing: '4px', fontWeight: '900', color: '#1E40AF' }}>{syncCode}</div>
                                </div>
                            )}

                            <button
                                onClick={handleCloudBackup}
                                disabled={isSyncing}
                                style={{
                                    padding: '16px', background: '#5856D6', color: 'white',
                                    border: 'none', borderRadius: '12px', fontSize: '1rem',
                                    fontWeight: 'bold', cursor: 'pointer', opacity: isSyncing ? 0.7 : 1,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {isSyncing ? '🔄 Syncing...' : (syncCode ? '⬆️ Update Cloud' : '☁️ Enable Cloud Sync')}
                            </button>

                            <button
                                onClick={handleJoinTeam}
                                disabled={isSyncing}
                                style={{
                                    padding: '16px', background: 'white', color: '#5856D6',
                                    border: '2px solid #5856D6', borderRadius: '12px', fontSize: '1rem',
                                    fontWeight: 'bold', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                👥 Link with Code
                            </button>
                        </div>
                    </>
                )}

                <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '20px', textAlign: 'center', lineHeight: '1.4' }}>
                    Note: High-quality photos and long recordings may take a few moments to sync.
                </p>
            </div>
        </div>
    );
};

export default BackupRestore;
