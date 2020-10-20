# ZICA.js

ZICA.js - is an Open source Javascript framework for creating 2D games and apps.


## Main features

* Scene Management
* Resource Management
* Sprites, Tilemaps, Sprite Animations
* Sound / Music handling
* Input handling
* Collision detection / Physics
* Rendering Text
* Rendering Video 
* Behavior (Animators) Management

## Minimal Example

```html
<html>
<head>
<script src = 'ZICA.js'></script>
</head>
<body>

<canvas id="myCanvas" width="400" height="400" style="border:1px solid #d3d3d3;"></canvas>
<script>
var canvas = document.getElementById("myCanvas");
const Game = new ZICA.GameRunner(canvas);

var p2 = null;
var scene = new ZICA.Scene();

var box  = new ZICA.Entity();
box.text = 'Box';
box.textColor = 'rgba(0,255,0,1)';
box.color = 'rgba(255,0,0,1)';
box.addAnimator(new ZICA.AnimatorTopDownMovement({Speed:0.2}));
box.addAnimator(new ZICA.AnimatorRotation({Speed:0.2}));

scene.addEntity(box);
Game.addScene(scene);
Game.setActiveScene(scene);
Game.startApp();

</script>

</body>
</html>
```
Tests are found on the [Github Page](/examples/tests.html)

## Documentation
  * [Getting started](../../wiki/getting-started)
  * [Entity](../../wiki/Entity)
  * [Scene](../../wiki/Scene)
  * [GameRunner](../../wiki/GameRunner)
  * [Animator](../../wiki/Animator)
  * [Action](../../wiki/Action)
  * [Vect2d](../../wiki/Vect2d)
  * [Camera](../../wiki/Camera)
  * [Box2d](../../wiki/Box2d)

## API Reference
See the [API Reference for ZICA.js](docs/api/zicajs.md) for details.

### Demos

# License
ZICA.js is licensed under the terms of the MIT License.
