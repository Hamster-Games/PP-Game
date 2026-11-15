window.PPMods.register({
  id: 'schnelle-spitzhacke',
  name: 'Schnelle Spitzhacke',
  description: 'Baut Blöcke doppelt so schnell ab.',
  activate(api) {
    api.setMultiplier('mining', 2);
  }
});
