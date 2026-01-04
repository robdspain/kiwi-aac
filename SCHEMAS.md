# Canonical Data Schemas
## Project: Kiwi Voice
## Last Updated: January 2, 2026

This document defines the source-of-truth JSON structures used for storage, export, and synchronization.

### 1. `iconsData.json` (Export Format)
Standardized format for sharing vocabulary libraries.

```json
{
  "pronunciations": {
    "word": "phonetic_override"
  },
  "icons": {
    "Category Name": [
      {
        "w": "Display Label",
        "i": "Emoji or data:image/...",
        "wc": "noun | verb | adj | social | question | misc | none",
        "bg": "#HEXCODE",
        "skill": "none",
        "isCustom": true,
        "type": "button | custom_avatar",
        "recipe": {}
      }
    ]
  }
}
```

### 2. Board Model (Local Storage)
Structure for `kiwi-words-{contextId}` keys.

```json
[
  {
    "name": "Page 1",
    "items": [
      {
        "id": "item-unique-id",
        "type": "button | folder",
        "word": "Label (Primary)",
        "labels": {
          "en": "English Label",
          "es": "Spanish Label"
        },
        "icon": "Emoji | db:uuid | url",
        "pos": { "r": 0, "c": 0 },
        "wc": "word_class",
        "category": "core | pronoun | etc",
        "contents": [],
        "isPhrase": false,
        "phraseIcons": []
      }
    ]
  }
]
```

### 3. Profile & Access Profile
Stored in `kiwi-profiles`.

```json
{
  "id": "profile-uuid",
  "name": "Learner Name",
  "avatar": "Emoji | data:...",
  "pecs_phase": 1,
  "accessProfile": {
    "targetSize": 10,
    "spacing": 1.5,
    "selectionType": "touch | scan | eye",
    "visualContrast": "standard | high",
    "fieldSize": "4 | 8 | 12 | unlimited"
  }
}
```

### 4. Analytics Event Records
Stored in `kiwi-analytics`.

```json
{
  "sessions": [
    {
      "id": 123456789,
      "start": "ISO-Timestamp",
      "end": "ISO-Timestamp",
      "duration": 5.5
    }
  ],
  "itemClicks": {
    "item-id": {
      "word": "Label",
      "count": 10,
      "dates": {
        "2026-01-02": 5
      }
    }
  },
  "dailyUsage": {
    "2026-01-02": { "clicks": 10 }
  },
  "sentences": [
    {
      "text": "I want cookie",
      "timestamp": "ISO-Timestamp"
    }
  ]
}
```

### 5. Backup/Restore Format
Compressed payload used for `.json` file and cloud sync.

```json
{
  "version": "2.1",
  "timestamp": "ISO-Timestamp",
  "localStorage": {
    "key": "value"
  },
  "media": {
    "media-id": "data:..."
  }
}
```
