import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({ currentAudio, onSave, onRemove }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(currentAudio || null);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        setAudioUrl(currentAudio || null);
    }, [currentAudio]);

    // Detect supported MIME type for cross-platform compatibility
    const getSupportedMimeType = () => {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus',
            'audio/wav'
        ];
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return ''; // Let browser choose default
    };

    const startRecording = async () => {
        try {
            // Check if MediaRecorder is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Voice recording is not supported in this browser.');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mimeType = getSupportedMimeType();
            const options = mimeType ? { mimeType } : {};

            try {
                mediaRecorderRef.current = new MediaRecorder(stream, options);
            } catch (e) {
                // Fallback: try without options
                console.warn('MediaRecorder with options failed, using default:', e);
                mediaRecorderRef.current = new MediaRecorder(stream);
            }

            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                // Use the actual mimeType from the recorder for cross-platform compatibility
                const actualMimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: actualMimeType });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAudioUrl(reader.result);
                    onSave(reader.result);
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(t => t + 1);
            }, 1000);
        } catch (error) {
            console.error('Microphone access denied:', error);
            alert('Please allow microphone access to record voice.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    const handleRemove = () => {
        setAudioUrl(null);
        onRemove();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            background: '#f8f8f8',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Custom Voice</label>

            {isRecording ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: '#FF3B30', animation: 'pulse 1s infinite'
                    }} />
                    <span style={{ flex: 1, fontWeight: 'bold', color: '#FF3B30' }}>
                        Recording... {formatTime(recordingTime)}
                    </span>
                    <button
                        onClick={stopRecording}
                        style={{
                            padding: '8px 16px', background: '#FF3B30', color: 'white',
                            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        ⏹ Stop
                    </button>
                </div>
            ) : audioUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={playAudio}
                        style={{
                            flex: 1, padding: '8px', background: '#007AFF', color: 'white',
                            border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}
                    >
                        ▶️ Play
                    </button>
                    <button
                        onClick={startRecording}
                        style={{
                            flex: 1, padding: '8px', background: '#34C759', color: 'white',
                            border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}
                    >
                        🔄 Re-record
                    </button>
                    <button
                        onClick={handleRemove}
                        style={{
                            padding: '8px 12px', background: '#FF3B30', color: 'white',
                            border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}
                    >
                        🗑️
                    </button>
                </div>
            ) : (
                <button
                    onClick={startRecording}
                    style={{
                        padding: '10px', background: '#FF3B30', color: 'white',
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    🎤 Record Voice
                </button>
            )}

            {!audioUrl && !isRecording && (
                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textAlign: 'center' }}>
                    Record a custom voice instead of text-to-speech
                </p>
            )}
        </div>
    );
};

export default VoiceRecorder;
