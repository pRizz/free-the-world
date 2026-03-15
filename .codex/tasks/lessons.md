# Lessons

## 2026-03-15
- What went wrong: I interpreted "reduce the table blur on the edges" as lowering blur strength, when the user meant reducing the blur region width on narrow devices.
- Preventive rule: For visual tuning requests that mention blur, confirm whether the user means blur intensity, blur area/width, or both before changing multiple dimensions of the effect.
- Trigger signal to catch it earlier: The request referenced "on narrow devices" and "on the edges", which points more strongly to overlay geometry than blur radius.
