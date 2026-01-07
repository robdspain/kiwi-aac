# Switch Access - Quick Start Guide

## What is Switch Access?

Switch Access allows users with motor impairments to navigate the AAC grid using sequential scanning. Icons highlight one-by-one, and the user presses a single switch (spacebar or external switch) to select the highlighted icon.

---

## How to Enable

1. Open **Adult Settings** (gear icon)
2. Navigate to **Accessibility** section
3. Toggle **"Enable Switch Access Mode"**
4. Adjust settings as needed:
   - **Scan Speed:** 1-3 seconds per icon
   - **Audio Feedback:** Optional beep on each highlight
5. Close settings - scanning starts automatically

---

## How to Use

### Basic Operation

1. **Wait** for desired icon to highlight (teal pulsing border)
2. **Press Spacebar** (or configured switch key) to select
3. Icon speaks and is added to sentence strip
4. Scanning continues automatically

### Keyboard Controls

| Key | Action |
|-----|--------|
| **Spacebar** | Select highlighted icon |
| **S** | Start/Resume scanning |
| **Escape** | Pause scanning |

### External Switches

Any external switch that emulates keyboard input will work:
- AbleNet Blue2 Bluetooth Switch
- Enabling Devices switches
- USB-connected switches
- Keyboard-mapped switches

Configure the switch to send **Spacebar** key presses.

---

## Settings

### Scan Speed

- **Fast (1s):** For experienced users
- **Medium (1.5s):** Default, good balance
- **Slow (3s):** For users who need more time

### Audio Feedback

- **Enabled:** Plays a short beep on each highlight
- **Disabled:** Silent scanning (visual only)

### Switch Key

- **Default:** Spacebar
- **Custom:** Configure any keyboard key

---

## Tips for Success

### For Parents/Caregivers

- Start with **slow scan speed** (2-3 seconds)
- Enable **audio feedback** for additional cues
- Practice with child during calm, focused time
- Gradually increase speed as child improves

### For Therapists

- Document baseline scan speed in IEP
- Track accuracy at different speeds
- Use scan speed reduction as measurable goal
- Combine with motor planning (fixed grid positions)

### For Users

- Watch the highlight move around the grid
- Wait for your icon to light up
- Press the switch when ready
- Don't rush - scanning will loop back

---

## Troubleshooting

### Scanning doesn't start

- Check that Switch Access is enabled in settings
- Ensure there are icons on the grid
- Try pressing 'S' key to start manually

### Spacebar doesn't select

- Make sure Switch Access is enabled
- Check that another app isn't capturing keyboard input
- Try clicking on the Kiwi window first (focus)

### Scan is too fast/slow

- Adjust scan speed in Adult Settings → Accessibility
- Range: 1-3 seconds per icon
- Default: 1.5 seconds

### Audio beep doesn't play

- Enable Audio Feedback in settings
- Check device volume
- Some browsers block audio until user interaction

---

## Technical Details

### Components

- **useSwitchScan.js:** Core scanning logic hook
- **ScanIndicator.jsx:** Visual highlight component
- **SwitchAccessMode.jsx:** Integration wrapper
- **scanPatterns.js:** Scan algorithms

### Accessibility

- **WCAG 2.1 Level AA** compliant
- Screen reader announces current icon
- High contrast visual indicator
- Keyboard-only operation
- No keyboard traps

### Performance

- Optimized for low-end devices
- GPU-accelerated animations
- Minimal CPU usage during scan
- Works smoothly on tablets and phones

---

## Future Enhancements

- [ ] Row-column scanning (scan rows, then columns)
- [ ] Two-switch mode (advance + select)
- [ ] Dwell time selection (hover to select)
- [ ] External Bluetooth switch support
- [ ] Customizable scan patterns
- [ ] Group scanning (scan Context first)

---

## Support

For questions or issues with Switch Access:
- Check the main Kiwi AAC documentation
- Contact your therapist or AAC specialist
- Report bugs via the app feedback form

---

**Remember:** Switch access takes practice! Be patient and celebrate progress.
