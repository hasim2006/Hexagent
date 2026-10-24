# AI CEO Voice Briefing — Audio Configuration

## How to add your CEO voice recording

1. Place your MP3 audio file in this `public/` folder
2. Name it exactly: `ceo-voice.mp3`
3. Refresh the page — the briefing will automatically use your audio

## Audio file tips

- Format: MP3 (best browser compatibility)
- Recommended length: 30-60 seconds
- The transcript timing auto-syncs to the audio duration
- If no audio file is found, the briefing runs in "demo mode" with estimated timing

## Changing the audio file path

If you want to use a different filename or path, edit the `AUDIO_SRC` constant at the top of:
`src/components/CEOBriefing.tsx`

```typescript
const AUDIO_SRC = '/ceo-voice.mp3'; // ← change this
```

## The briefing script

The transcript is defined in `BRIEFING_SENTENCES` in `src/components/CEOBriefing.tsx`.
Each sentence gets highlighted as the audio plays, with a live typing effect.
