
const PARAMS = Object.freeze({
  MAP_ROWS: 3,
  MAP_COLS: 5,
  OFFSET_X: 300,
  OFFSET_Y: 50,
  TILE_WIDTH: 150,
  ASPECT: 150/108,
  GRID_COLOR: 0xcccccc,
  HOVER_COLOR: 0xcccc00,
  SELECT_COLOR: 0xdd3333
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
const gridlines = new PIXI.Graphics();
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
  gridlines.lineStyle(1.5, PARAMS.GRID_COLOR);
  const x0 = PARAMS.OFFSET_X;
  const y0 = PARAMS.OFFSET_Y;
  const tileW = PARAMS.TILE_WIDTH;
  const tileH = PARAMS.TILE_WIDTH/PARAMS.ASPECT;
  for (let i = 0;i<PARAMS.MAP_ROWS+1; i++) {
    gridlines.moveTo(
      x0 + 0.5*tileW - i*tileW/2,
      y0 + i*tileH/2
    );
    gridlines.lineTo(
      x0 + 0.5*tileW + PARAMS.MAP_COLS * tileW/2  - i*tileW/2,
      y0 + PARAMS.MAP_COLS * tileH/2 + i*tileH/2
    );
  }
  for (let j = 0;j<PARAMS.MAP_COLS+1; j++) {
    gridlines.moveTo(
      x0 + 0.5*tileW + j*tileW/2,
      y0 + j*tileH/2
    );
    gridlines.lineTo(
      x0 + 0.5*tileW - PARAMS.MAP_ROWS * tileW/2 + j*tileW/2,
      y0 + PARAMS.MAP_ROWS * tileH/2 + j*tileH/2
    );
  }
})();

let mouseX = 0;
let mouseY = 0;

loader.load((loader, resources) => {
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

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

  const x0 = PARAMS.OFFSET_X;
  const y0 = PARAMS.OFFSET_Y;
  const tileW = PARAMS.TILE_WIDTH;
  const tileH = PARAMS.TILE_WIDTH/PARAMS.ASPECT;

  const hoverMarker = new PIXI.Graphics();
  hoverMarker.moveTo(x0+tileW/2, y0);
  hoverMarker.lineStyle(4, PARAMS.HOVER_COLOR);
  hoverMarker.lineTo(x0+tileW, y0+tileH/2);
  hoverMarker.lineTo(x0+tileW/2, y0+tileH);
  hoverMarker.lineTo(x0, y0+tileH/2);
  hoverMarker.lineTo(x0+tileW/2, y0);

  const selectionMarker = new PIXI.Graphics();
  selectionMarker.moveTo(x0+tileW/2, y0);
  selectionMarker.lineStyle(4, PARAMS.SELECT_COLOR);
  selectionMarker.lineTo(x0+tileW, y0+tileH/2);
  selectionMarker.lineTo(x0+tileW/2, y0+tileH);
  selectionMarker.lineTo(x0, y0+tileH/2);
  selectionMarker.lineTo(x0+tileW/2, y0);

  app.stage.addChild(gridlines);
  app.stage.addChild(hoverMarker);
  app.stage.addChild(selectionMarker);

  app.ticker.add(() => {
    const hoveredTile = getTileFromCoords(mouseX, mouseY);
    if (hoveredTile) {
      const tileX = - hoveredTile.row*tileW/2 + hoveredTile.col*tileW/2;
      const tileY = hoveredTile.row*tileH/2 + hoveredTile.col*tileH/2;
      hoverMarker.x = tileX;
      hoverMarker.y = tileY;
    }
  });

  document.addEventListener('click', function(e) {
    const clickedTile = getTileFromCoords(e.clientX, e.clientY);
    if (clickedTile) {
      const tileX = - clickedTile.row*tileW/2 + clickedTile.col*tileW/2;
      const tileY = clickedTile.row*tileH/2 + clickedTile.col*tileH/2;
      selectionMarker.x = tileX;
      selectionMarker.y = tileY;
      selectionMarker.visible = true;
    } else {
      selectionMarker.visible = false;
    }
  });
});

function getTileFromCoords(clientX, clientY) {
  // We calculate the hit tile directly from the coordinates, returning undefined if no tile is hit.
  // This is done by translating (x,y) into the isometric coordinate system (projecting to the axes),
  // then using simple division by the known tile sizes to get the row and column values directly.

  // To follow the logic of this function, consider the triangle ABC where A is (offsetX, offsetY), B is (x, y),
  // and C is the sought projection of B onto the isometric axis (for simplicity, in the clientX < offsetX case):
  // - The isometric axis tilt alpha is known from the tile sizing params
  // - AB distance is known
  // - Angle CAB can be calculated by projecting B onto the horizontal line of A and forming the right triangle ABB'
  // - Note that angle BCA is 2*alpha (bisect with a horizontal line to see)
  // - With CAB, BCA and AB known, the law of sines yields the missing sides of the ABC triangle.
  // (Where AC is the sought projection to the left axis and CB is the projection to the right axis.)
  const x = clientX - PARAMS.OFFSET_X - PARAMS.TILE_WIDTH/2;
  const y = clientY - PARAMS.OFFSET_Y;
  const tileW = PARAMS.TILE_WIDTH;
  const tileH = PARAMS.TILE_WIDTH/PARAMS.ASPECT;
  const tileEdge = Math.sqrt((tileW/2)*(tileW/2)+(tileH/2)*(tileH/2));
  const axisTilt = Math.asin((tileH/2)/tileEdge);
  const AB = Math.sqrt(x*x+y*y);
  const ABangleFromHorizontal = Math.asin(y/AB);

  if (ABangleFromHorizontal < axisTilt) return; // surely no hovered tile

  const CAB = ABangleFromHorizontal - axisTilt;
  const BCA = 2*axisTilt;
  const ABC = Math.PI - CAB - BCA;

  // applying the law of sines to ABC:
  let projectionY = AB / Math.sin(BCA) * Math.sin(ABC);
  let projectionX = AB / Math.sin(BCA) * Math.sin(CAB);

  // Until this point, we assumed that clientX < offsetX, but if it was not the case, the math results in switched numbers
  if (x >= 0) [projectionY, projectionX] = [projectionX, projectionY];

  const hoveredRow = Math.floor(projectionY/tileEdge);
  const hoveredCol = Math.floor(projectionX/tileEdge);

  // clamp to actual grid size:
  if (hoveredRow >= PARAMS.MAP_ROWS) return;
  if (hoveredCol >= PARAMS.MAP_COLS) return;

  return {
    row: hoveredRow,
    col: hoveredCol
  };
}
