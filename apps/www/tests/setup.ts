// JSDOM has no AnimationEvent constructor; expose it before React detects event support.
if (!window.AnimationEvent) {
  Object.defineProperty(window, "AnimationEvent", { value: Event, configurable: true })
}
