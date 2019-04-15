
const PARAMS = Object.freeze({
  MAP_ROWS: 3,
  MAP_COLS: 5,
  OFFSET_X: 300,
  OFFSET_Y: 50,
  TILE_WIDTH: 150,
  ASPECT: 150/108,
  GRID_COLOR: 0xcccccc
});

// NB: when adding size adjustment values, derive from TILE_WIDTH
const objects = {
  ground:      { assetURL: 'assets/tiles/groundTile_NE.png' },
  metalTile:   { assetURL: 'assets/tiles/metalTile_NE.png' },
  metalCenter: { assetURL: 'assets/tiles/metalTileConnectCenter_NE.png' },
  metalCornerT:{ assetURL: 'assets/tiles/metalTileConnectCorner_SW.png' },
  metalCornerR:{ assetURL: 'assets/tiles/metalTileConnectCorner_NE.png' },
  metalCornerB:{ assetURL: 'assets/tiles/metalTileConnectCorner_NW.png' },
  metalCornerL:{ assetURL: 'assets/tiles/metalTileConnectCorner_SE.png' },
  ground:      { assetURL: 'assets/tiles/groundTile_NE.png' },
  thing:       { assetURL: 'assets/tiles/metalStructureBottom_NE.png' },
  rock:        { assetURL: 'assets/tiles/rocks_NE.png' },
  spaceship:   { assetURL: 'assets/tiles/spaceCraft4_NE.png' }
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
      row[j] = ['ground', 'metalCenter'][(i+j)%2];
    }
    map[i] = row;
  }
  console.log('map initialized:', map);
})();

(function drawGrid() {
  graphics.lineStyle(1.5, PARAMS.GRID_COLOR);
  const x0 = PARAMS.OFFSET_X;
  const y0 = PARAMS.OFFSET_Y;
  const tileW = PARAMS.TILE_WIDTH;
  const tileH = PARAMS.TILE_WIDTH/PARAMS.ASPECT;
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

  for (let i=0; i<PARAMS.MAP_ROWS; i++) {
    for (let j=0; j<PARAMS.MAP_COLS; j++) {
      const currentTileKey = map[i][j];
      const currentTile = objects[currentTileKey];
      const ground = new PIXI.Sprite(resources[currentTileKey].texture);
      const tileW = PARAMS.TILE_WIDTH;
      const tileH = PARAMS.TILE_WIDTH/PARAMS.ASPECT;
      ground.width = tileW + (currentTile.dW | 0);
      ground.height = tileH + (currentTile.dH | 0);
      ground.x = PARAMS.OFFSET_X - i*tileW/2 + j*tileW/2 + (currentTile.dX | 0);
      ground.y = PARAMS.OFFSET_Y + i*tileH/2 + j*tileH/2 + (currentTile.dY | 0);
      app.stage.addChild(ground);
    }
  }

  thing.width = PARAMS.TILE_WIDTH;
  thing.x = 300;
  thing.y = 85;

  app.stage.addChild(graphics);

  app.stage.addChild(thing);

  // Listen for frame updates
  app.ticker.add(() => {
    // dummy
  });
});
