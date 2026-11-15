window.PPMods.register({
  id: 'erz-alarm',
  name: 'Erz-Alarm',
  description: 'Zeigt eine Nachricht, wenn du Gold- oder Diamanterz abbaust.',
  activate(api) {
    api.on('blockMined', ({ type }) => {
      if (type === 'GOLD_ORE') api.notify('Gold gefunden!');
      if (type === 'DIAMOND_ORE') api.notify('Diamant gefunden!');
    });
  }
});
