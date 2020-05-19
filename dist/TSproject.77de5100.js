// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/point-in-polygon/index.js":[function(require,module,exports) {
module.exports = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

},{}],"drawSpaceShip.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function drawSpaceShip(context, deltaTime, shipPosX, shipPosY, rotation) {
  var size = 60;
  var posX = shipPosX;
  var posY = shipPosY;
  context.save();
  context.translate(posX, posY);
  context.rotate(rotation);
  context.beginPath();
  context.moveTo(size / 2, 0);
  context.lineTo(-size / 2, -size / 4);
  context.lineTo(-size / 5, 0);
  context.lineTo(-size / 2, size / 4);
  context.closePath();
  context.strokeStyle = "white";
  context.lineWidth = 1;
  context.stroke();
  context.restore();
}

exports.drawSpaceShip = drawSpaceShip;
},{}],"effects.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.effect = [];
var redSmoke = createSmokeParticle("red", 80, 80);
var orangeSmoke = createSmokeParticle("darkorange", 80, 80);
var whiteExplosion = createSmokeParticle("white", 80, 80); //const whiteSmoke = createSmokeParticle("whiteSmoke", 256, 60);

function createSmokeParticle(color, canvasSize, particleSize) {
  // izveido attēlu vienai dūmu daļiņai, jo .drawImage() ir daudz ātrāka funkcija
  // nekā beginPath/arc/shadow/fill.
  var canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  var context = canvas.getContext("2d");
  context.beginPath();
  context.arc(-10000, 0, particleSize / 5, 0, Math.PI * 2);
  context.fillStyle = "gray";
  context.shadowBlur = particleSize;
  context.shadowOffsetX = 10000 + canvas.width / 2;
  context.shadowOffsetY = canvas.height / 2;
  context.shadowColor = color;
  context.fill();
  return canvas;
}

exports.createSmokeParticle = createSmokeParticle;

function createExplosion(x, y) {
  for (var i = 0; i < 50; i++) {
    var speed = 10;
    exports.effect.push({
      x: x,
      y: y,
      velocityX: Math.random() * 0.03 * speed - 0.015 * speed,
      velocityY: Math.random() * 0.03 * speed - 0.015 * speed,
      opacity: 1,
      speed: speed,
      img: redSmoke
    });
  }

  for (var i = 0; i < 50; i++) {
    var speed = 8;
    exports.effect.push({
      x: x,
      y: y,
      velocityX: Math.random() * 0.03 * speed - 0.015 * speed,
      velocityY: Math.random() * 0.03 * speed - 0.015 * speed,
      opacity: 1,
      speed: speed,
      img: orangeSmoke
    });
  }
}

exports.createExplosion = createExplosion;

function createAsteroidExplosion(x, y) {
  for (var i = 0; i < 15; i++) {
    var speed = 15;
    exports.effect.push({
      x: x,
      y: y,
      velocityX: Math.random() * 0.03 * speed - 0.015 * speed,
      velocityY: Math.random() * 0.03 * speed - 0.015 * speed,
      opacity: 1,
      speed: speed,
      img: whiteExplosion
    });
  }
}

exports.createAsteroidExplosion = createAsteroidExplosion; //awinbabwe

function drawEffects(context, deltaTime) {
  for (var i = 0; i < exports.effect.length; i++) {
    var e = exports.effect[i];
    e.x += e.velocityX * deltaTime;
    e.y += e.velocityY * deltaTime;
    e.opacity -= deltaTime * 0.0001 * e.speed;

    if (e.opacity > 0) {
      context.globalAlpha = e.opacity;
      context.drawImage(e.img, e.x - e.img.width / 2, e.y - e.img.width / 2);
    } else {
      exports.effect.splice(i, 1);
      i = i - 1;
    }
  }

  context.globalAlpha = 1;
}

exports.drawEffects = drawEffects;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var point_in_polygon_1 = __importDefault(require("point-in-polygon"));

var drawSpaceShip_1 = require("./drawSpaceShip");

var effects_1 = require("./effects"); //        isPointInside([129, 100], polygon.map(function(relativeCoords) { return [ relativeCoords[0] + asX, relativeCoords[1] + asY ] })),
//        );


var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.backgroundColor = "black";
canvas.style.outline = "1px solid red";
canvas.width = 1000;
canvas.height = 580;
var onfocus = true;

window.onblur = function () {
  onfocus = false;
};

window.onfocus = function () {
  onfocus = true;
};

var shipThurst = effects_1.createSmokeParticle("lime", 20, 20);
var context = canvas.getContext("2d");
var keysPressed = [];
var previousTime = 0;
var shipRotation = 0;
var velocity = 0;
var velocityX = 0;
var velocityY = 0;
var shipPosX = 500;
var shipPosY = 300;
var shipDead = 0;
var aSize = 40;
var score = 0;
var highscore = 0;
var bullets = [];
var asteroids = [];
document.addEventListener("mousedown", function () {
  var bgmusic = document.getElementById("backgroundMusic");
  bgmusic.volume = 0.05;
  bgmusic.play();
});

document.onkeydown = function (event) {
  if (keysPressed.indexOf(event.key) === -1) {
    keysPressed.push(event.key);
  }
};

document.onkeyup = function (event) {
  var idx = keysPressed.indexOf(event.key);

  if (idx > -1) {
    keysPressed.splice(idx, 1);
  }
};

canvas.onmousedown = function (event) {
  if (shipDead === 0) {
    bullets.push({
      bulletPosX: shipPosX + Math.cos(shipRotation) * 30,
      bulletPosY: shipPosY + Math.sin(shipRotation) * 30,
      bulletAngle: shipRotation,
      bulletVelocity: velocity,
      size: 3
    });
  }
};

document.getElementById("play-btn").addEventListener("click", function () {
  document.getElementById("splash").style.display = "none";
  window.setInterval(function () {
    if (onfocus === false) {
      return;
    }

    asteroids.push({
      asteroidPosX: -20,
      asteroidPosY: Math.random() * 500,
      aVelocityX: 2 * Math.random() * 9 + 10,
      aVelocityY: Math.random() * 5 - 2.5,
      asteroidSize: aSize,
      points: [[0, -aSize], [aSize / 3 + Math.round(Math.random() * 10 - 5), -aSize / 1.2 + Math.round(Math.random() * 10 - 5)], [aSize / 2 + Math.round(Math.random() * 10 - 5), -aSize / 2 + Math.round(Math.random() * 10 - 5)], [aSize / 1.2 + Math.round(Math.random() * 10 - 5), -aSize / 3 + Math.round(Math.random() * 10 - 5)], [aSize, 0], [aSize / 1.2 + Math.round(Math.random() * 10 - 5), aSize / 3 + Math.round(Math.random() * 10 - 5)], [aSize / 2 + Math.round(Math.random() * 10 - 5), aSize / 2 + Math.round(Math.random() * 10 - 5)], [aSize / 3 + Math.round(Math.random() * 10 - 5), aSize / 1.2 + Math.round(Math.random() * 10 - 5)], [0, aSize], [-aSize / 3 + Math.round(Math.random() * 10 - 5), aSize / 1.2 + Math.round(Math.random() * 10 - 5)], [-aSize / 2 + Math.round(Math.random() * 10 - 5), aSize / 2 + Math.round(Math.random() * 10 - 5)], [-aSize / 1.2 + Math.round(Math.random() * 10 - 5), aSize / 3 + Math.round(Math.random() * 10 - 5)], [-aSize, 0], [-aSize / 1.2 + Math.round(Math.random() * 10 - 5), -aSize / 3 + Math.round(Math.random() * 10 - 5)], [-aSize / 2 + Math.round(Math.random() * 10 - 5), -aSize / 2 + Math.round(Math.random() * 10 - 5)], [-aSize / 3 + Math.round(Math.random() * 10 - 5), -aSize / 1.2 + Math.round(Math.random() * 10 - 5)]]
    });

    if (shipDead === 0) {
      score += 5;
    }
  }, 1000);
  window.requestAnimationFrame(renderLoop);
});

function renderLoop(time) {
  window.requestAnimationFrame(renderLoop);

  if (previousTime === 0) {
    previousTime = time;
  }

  if (shipDead != 0) {
    document.getElementById("gameover").style.display = "block";
  }

  var shipWasDead = shipDead !== 0;
  var deltaTime = time - previousTime;
  previousTime = time;

  if (onfocus === false) {
    return;
  }

  if (shipDead === 0) {
    if (keysPressed.includes("a")) {
      shipRotation -= 0.07 * deltaTime / 16;
    }

    if (keysPressed.includes("d")) {
      shipRotation += 0.07 * deltaTime / 16;
    }

    if (keysPressed.includes("w")) {
      velocityX += 3 * Math.cos(shipRotation) * deltaTime / 16;
      velocityY += 3 * Math.sin(shipRotation) * deltaTime / 16;
      createShipThrust(shipPosX + Math.cos(shipRotation) * -20, shipPosY + Math.sin(shipRotation) * -20);
    } // if (keysPressed.includes("s")) {
    //        velocityX -= 2 * Math.cos(shipRotation) * deltaTime / 16;
    //        velocityY -= 2 * Math.sin(shipRotation) * deltaTime / 16;
    // }

  }

  velocity = Math.sqrt(Math.pow(velocityX, 2) + Math.pow(velocityY, 2));
  velocityX = Math.min(250, Math.max(-250, velocityX));
  velocityY = Math.min(250, Math.max(-250, velocityY));

  if (shipPosX >= 1031) {
    shipPosX = -25;
  }

  if (shipPosX <= -26) {
    shipPosX = 1030;
  }

  if (shipPosY >= 611) {
    shipPosY = -27;
  }

  if (shipPosY <= -28) {
    shipPosY = 610;
  }

  if (shipDead === 0) {
    shipPosX += velocityX / 50 * deltaTime / 16;
    shipPosY += velocityY / 50 * deltaTime / 16;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (shipDead === 0) {
    for (var i = 0; i < asteroids.length; i++) {
      var collisionPointX1 = shipPosX + Math.cos(shipRotation) * 30;
      var collisionPointY1 = shipPosY + Math.sin(shipRotation) * 30;
      var collisionPointX2 = shipPosX + Math.cos(shipRotation + Math.PI + 0.5) * 33;
      var collisionPointY2 = shipPosY + Math.sin(shipRotation + Math.PI + 0.5) * 33;
      var collisionPointX3 = shipPosX + Math.cos(shipRotation + Math.PI - 0.5) * 33;
      var collisionPointY3 = shipPosY + Math.sin(shipRotation + Math.PI - 0.5) * 33;
      var collisionPointX4 = (collisionPointX1 + collisionPointX3) / 2;
      var collisionPointY4 = (collisionPointY1 + collisionPointY3) / 2;
      var collisionPointX5 = (collisionPointX1 + collisionPointX2) / 2;
      var collisionPointY5 = (collisionPointY1 + collisionPointY2) / 2;
      var a = asteroids[i];

      if (point_in_polygon_1.default([collisionPointX1 - a.asteroidPosX, collisionPointY1 - a.asteroidPosY], a.points) === true) {
        shipDead = time;
        effects_1.createAsteroidExplosion(asteroids[i].asteroidPosX, asteroids[i].asteroidPosY);
        asteroids.splice(i, 1);
        i = i - 1;
      }

      if (point_in_polygon_1.default([collisionPointX2 - a.asteroidPosX, collisionPointY2 - a.asteroidPosY], a.points) === true) {
        shipDead = time;
        effects_1.createAsteroidExplosion(asteroids[i].asteroidPosX, asteroids[i].asteroidPosY);
        asteroids.splice(i, 1);
        i = i - 1;
      }

      if (point_in_polygon_1.default([collisionPointX3 - a.asteroidPosX, collisionPointY3 - a.asteroidPosY], a.points) === true) {
        shipDead = time;
        effects_1.createAsteroidExplosion(asteroids[i].asteroidPosX, asteroids[i].asteroidPosY);
        asteroids.splice(i, 1);
        i = i - 1;
      }

      if (point_in_polygon_1.default([collisionPointX4 - a.asteroidPosX, collisionPointY4 - a.asteroidPosY], a.points) === true) {
        shipDead = time;
        effects_1.createAsteroidExplosion(asteroids[i].asteroidPosX, asteroids[i].asteroidPosY);
        asteroids.splice(i, 1);
        i = i - 1;
      }

      if (point_in_polygon_1.default([collisionPointX5 - a.asteroidPosX, collisionPointY5 - a.asteroidPosY], a.points) === true) {
        shipDead = time;
        effects_1.createAsteroidExplosion(asteroids[i].asteroidPosX, asteroids[i].asteroidPosY);
        asteroids.splice(i, 1);
        i = i - 1;
      }
    }
  }

  drawBullets(time, deltaTime);

  for (var i = 0; i < asteroids.length; i++) {
    if (asteroids[i].asteroidPosX <= canvas.width + 30) {
      drawAsteroid(asteroids[i], time, deltaTime);
    } else {
      asteroids.splice(i, 1);
      i = i - 1;
    }
  }

  for (var a = 0; a < asteroids.length; a++) {
    for (var b = 0; b < bullets.length; b++) {
      if (point_in_polygon_1.default([bullets[b].bulletPosX - asteroids[a].asteroidPosX, bullets[b].bulletPosY - asteroids[a].asteroidPosY], asteroids[a].points) === true) {
        effects_1.createAsteroidExplosion(asteroids[a].asteroidPosX, asteroids[a].asteroidPosY);
        asteroids.splice(a, 1);
        bullets.splice(b, 1);
        a = a - 1;
        score += 10;
        break;
      }
    }
  }

  if (shipDead === 0) {
    drawSpaceShip_1.drawSpaceShip(context, deltaTime, shipPosX, shipPosY, shipRotation);
  } else if (!shipWasDead) {
    effects_1.createExplosion(shipPosX, shipPosY);
  }

  effects_1.drawEffects(context, deltaTime);
  context.fillStyle = "white";
  context.font = "16px Arial";
  context.fillText("Score: " + score.toString(), 20, 25);
}

function drawBullets(time, deltaTime) {
  for (var i = 0; i < bullets.length; i++) {
    var b = bullets[i];
    drawSingleBullet(b, time, deltaTime);

    if (b.bulletPosX >= canvas.width + 20 || b.bulletPosX <= -20 || b.bulletPosY >= canvas.height + 20 || b.bulletPosY <= -20) {
      bullets.splice(i, 1);
      i = i - 1;
    }
  }
}

function drawSingleBullet(bullet, time, deltaTime) {
  var size = bullet.size;
  var bulletPosX = bullet.bulletPosX;
  var bulletPosY = bullet.bulletPosY;
  var bulletAngle = bullet.bulletAngle;
  bullet.bulletPosX += Math.cos(bulletAngle) * deltaTime / 16 * 10; //velocityX/50;

  bullet.bulletPosY += Math.sin(bulletAngle) * deltaTime / 16 * 10; //velocityY/50;

  context.beginPath();
  context.moveTo(bulletPosX - 1, bulletPosY - 1);
  context.lineTo(bulletPosX + 1, bulletPosY - 1);
  context.lineTo(bulletPosX + 1, bulletPosY + 1);
  context.lineTo(bulletPosX - 1, bulletPosY + 1);
  context.closePath();
  context.strokeStyle = "red";
  context.lineWidth = 2;
  context.stroke();
}

function drawAsteroid(asteroid, time, deltaTime) {
  var size = asteroid.asteroidSize;
  var asteroidPosX = asteroid.asteroidPosX;
  var asteroidPosY = asteroid.asteroidPosY;
  var aVelocityX = asteroid.aVelocityX * deltaTime / 10;
  var aVelocityY = asteroid.aVelocityY * deltaTime / 10;
  asteroid.asteroidPosX += aVelocityX / 6;
  asteroid.asteroidPosY += aVelocityY / 2;
  var points = asteroid.points;
  context.beginPath();
  context.moveTo(asteroidPosX + points[0][0], asteroidPosY + points[0][1]);

  for (var i = 0; i < points.length; i++) {
    context.lineTo(asteroidPosX + points[i][0], asteroidPosY + points[i][1]);
  }

  context.closePath();
  context.strokeStyle = "white";
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = "#111";
  context.fill();
}

function createShipThrust(x, y) {
  for (var i = 0; i < 10; i++) {
    var speed = 1;
    effects_1.effect.push({
      x: x,
      y: y,
      velocityX: Math.cos(shipRotation + Math.random() * 0.4 - 0.2) * -1 / 3 * speed,
      velocityY: Math.sin(shipRotation + Math.random() * 0.4 - 0.2) * -1 / 3 * speed,
      opacity: 0.5,
      speed: speed,
      img: shipThurst
    });
  }
}
},{"point-in-polygon":"node_modules/point-in-polygon/index.js","./drawSpaceShip":"drawSpaceShip.ts","./effects":"effects.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59620" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/TSproject.77de5100.js.map