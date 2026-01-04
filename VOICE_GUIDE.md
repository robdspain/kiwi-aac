# High-Quality Voice Integration Guide
## Project: Kiwi Voice
## Last Updated: January 2, 2026

To provide the best possible communication experience, Kiwi Voice prioritizes "Enhanced" and "Neural" voices. Robotic or low-quality voices can hinder engagement and learning.

### 1. The Best Practical Path
The highest-quality voices are provided by the operating system but often require a one-time download over Wi-Fi.

#### **iOS / iPadOS (Primary Platform)**
Apple's "Enhanced Quality" voices are significant improvements over the defaults.
1. Open **Settings** → **Accessibility** → **Spoken Content** → **Voices**.
2. Select your preferred language (e.g., English).
3. Choose a voice (e.g., "Samantha" or "Siri").
4. Tap **Download Enhanced** (usually 100MB+).
5. In Kiwi Voice, tap "Refresh voices" in Adult Settings to see the new option.

#### **Android**
Install high-quality voice data for the Google TTS engine.
1. Open **Settings** → **System** → **Languages & input** → **Text-to-speech output**.
2. Tap the settings gear next to "Preferred engine" (usually Google Speech Services).
3. Select **Install voice data**.
4. Download the high-quality pack for your language.

### 2. Automated Selection Logic
Kiwi Voice automatically attempts to select the best available voice using the following heuristics:
- **Locale Match (100 pts):** Exact match for the app language (e.g., `en-US` or `es-ES`).
- **Enhanced/Premium (30 pts):** Voice names containing "Enhanced", "Premium", "Neural", or "Siri".
- **Local Service (10 pts):** Prioritizes voices that work offline without network latency.

### 3. Developer Implementation
All voice selection logic is centralized in `src/utils/voiceUtils.js`. 

- **Reliable Loading:** `getVoicesReady()` handles the asynchronous nature of the Web Speech API and different browser behavior for the `voiceschanged` event.
- **Persistence:** The `voiceURI` is stored in the learner's profile and resolved to a `SpeechSynthesisVoice` object at the moment of speech to handle OS-level voice updates.

### 4. Common Issues
- **Empty Voice List:** Occurs if `getVoices()` is called before the browser has finished indexing system voices. Always use `getVoicesReady()`.
- **Robotic Output:** Usually means no "Enhanced" voices are installed on the device. The app will show a yellow warning card in settings to guide the user.
- **No Audio on iOS:** iOS requires a user gesture (tap) before any speech can trigger. The app handles this by ensuring the first interaction unlocks the audio context.
