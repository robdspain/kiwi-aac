import React, { useRef } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

const BackupRestore = ({ isOpen, onClose, onRestore }) => {
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleExport = async () => {
        // Collect all kiwi-related localStorage data
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: {}
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('kiwi') || key.startsWith('kians')) {
                try {
                    backup.data[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    backup.data[key] = localStorage.getItem(key);
                }
            }
        }

        const fileName = `kiwi-backup-${new Date().toISOString().split('T')[0]}.json`;
        const jsonString = JSON.stringify(backup, null, 2);

        if (Capacitor.isNativePlatform()) {
            try {
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
                    title: 'Kiwi Talk Backup',
                    text: 'Here is my Kiwi Talk backup file.',
                    url: result.uri,
                    dialogTitle: 'Save Backup'
                });
            } catch (error) {
                console.error('Native share failed:', error);
                alert('Sharing failed. Falling back to simple download.');
                // Fallback to web download
                downloadWeb(jsonString, fileName);
            }
        } else {
            // Web Download
            downloadWeb(jsonString, fileName);
        }
    };

    const downloadWeb = (content, fileName) => {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target.result);

                if (!backup.version || !backup.data) {
                    alert('Invalid backup file format.');
                    return;
                }

                if (window.confirm('This will replace all current data. Continue?')) {
                    // Clear existing kiwi data
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('kiwi') || key.startsWith('kians')) {
                            keysToRemove.push(key);
                        }
                    }
                    keysToRemove.forEach(key => localStorage.removeItem(key));

                    // Restore from backup
                    Object.entries(backup.data).forEach(([key, value]) => {
                        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                    });

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

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '20px', padding: '25px',
                width: '90%', maxWidth: '400px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>💾 Backup & Restore</h2>
                    <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>

                <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
                    Export all your data (boards, settings, progress) to a file, or restore from a previous backup.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={handleExport}
                        style={{
                            padding: '16px', background: '#34C759', color: 'white',
                            border: 'none', borderRadius: '12px', fontSize: '1rem',
                            fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        📥 Export Backup
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
                        📤 Import Backup
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImport}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>

                <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '20px', textAlign: 'center' }}>
                    Backup includes all boards, custom icons, voice recordings, and settings.
                </p>
            </div>
        </div>
    );
};

export default BackupRestore;
