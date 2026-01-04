# Event & State Machines (User Flows)
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Customization Modal Flow
`open` → `populate fields` → `user edit` → `save` → `persist to state` → `restore grid focus`

### 2. Skin Tone Picker Flow
`long-press` → `invoke picker` → `select variant` → `commit selection` → `close modal` → `haptic feedback`

### 3. Sentence Strip Flow
`tap grid icon` → `append to strip array` → `visual spring transition` → `speak word` → `user tap 'play'` → `speak full sentence` → `clear`

### 4. FCR Mode (Essential Skills)
`request` → `roll for denial (based on sensitivity)`
- IF YES: `show denial screen` → `user tap 'okay'` → `tolerance success` → `reward`
- IF NO: `skip to reward`

### 5. Auto-Scan Loop
`start` → `highlight index 0` → `tick (based on scanSpeed)` → `highlight index + 1` → `user input` → `select current` → `stop/reset`
