
const PARAMS = Object.freeze({
  MAP_ROWS: 3,
  MAP_COLS: 5,
  OFFSET_X: 300,
  OFFSET_Y: 50,
  TILE_WIDTH: 150,
  TILE_HEIGHT: 108,
  GRID_COLOR: 0xcccccc
});

const objects = {
  ground:     { assetURL: 'assets/tiles/groundTile_NE.png' },
  thing:      { assetURL: 'assets/tiles/metalStructureBottom_NE.png' },
  rock:       { assetURL: 'assets/tiles/rocks_NE.png' },
  spaceship:  { assetURL: 'assets/tiles/spaceCraft4_NE.png' }
}

const app = new PIXI.Application({
  antialias: true
});
document.body.appendChild(app.view);
const graphics = new PIXI.Graphics();
const loader = PIXI.loader;

for (let key in objects) {
  const obj = objects[key];
  loader.add(key, obj.assetURL);
}

const map = {};
(function initMap() {
  for (let i=0; i<PARAMS.MAP_ROWS; i++) {
    const row = {};
    for (let j=0; j<PARAMS.MAP_COLS; j++) {
      row[j] = 'ground';
    }
    map[i] = row;
  }
  console.log('map initialized:', map);
})();

(function drawGrid() {
  graphics.lineStyle(2, PARAMS.GRID_COLOR);
  const x0 = PARAMS.OFFSET_X;
  const y0 = PARAMS.OFFSET_Y;
  const tileW = PARAMS.TILE_WIDTH;
  const tileH = PARAMS.TILE_HEIGHT;
  for (let i = 0;i<PARAMS.MAP_ROWS+1; i++) {
    graphics.moveTo(
      x0 + 0.5*tileW - i*tileW/2,
      y0 + i*tileH/2
    );
    graphics.lineTo(
      x0 + 0.5*tileW + PARAMS.MAP_COLS * tileW/2  - i*tileW/2,
      y0 + PARAMS.MAP_COLS * tileH/2 + i*tileH/2
    );
  }
  for (let j = 0;j<PARAMS.MAP_COLS+1; j++) {
    graphics.moveTo(
      x0 + 0.5*tileW + j*tileW/2,
      y0 + j*tileH/2
    );
    graphics.lineTo(
      x0 + 0.5*tileW - PARAMS.MAP_ROWS * tileW/2 + j*tileW/2,
      y0 + PARAMS.MAP_ROWS * tileH/2 + j*tileH/2
    );
  }
})();

loader.load((loader, resources) => {
  const thing = new PIXI.Sprite(resources.thing.texture);
  const thing2 = new PIXI.Sprite(resources.thing.texture);

  for (let i=0; i<PARAMS.MAP_ROWS; i++) {
    for (let j=0; j<PARAMS.MAP_COLS; j++) {
      let ground = new PIXI.Sprite(resources.ground.texture);
      ground.x = PARAMS.OFFSET_X - i*PARAMS.TILE_WIDTH/2 + j*PARAMS.TILE_WIDTH/2;
      ground.y = PARAMS.OFFSET_Y + i*PARAMS.TILE_HEIGHT/2 + j*PARAMS.TILE_HEIGHT/2;
      app.stage.addChild(ground);
    }
  }

  thing.x = 300;
  thing.y = 85;
  thing2.x = 395;
  thing2.y = 135;

  app.stage.addChild(graphics);

  app.stage.addChild(thing);
  app.stage.addChild(thing2);

  // Listen for frame updates
  app.ticker.add(() => {
    // dummy
  });
});
