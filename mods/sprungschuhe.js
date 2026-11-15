window.PPMods.register({
  id: 'sprungschuhe',
  name: 'Sprungschuhe',
  description: 'Lässt dich 45 % höher springen.',
  activate(api) {
    api.setMultiplier('jump', 1.45);
  }
});
