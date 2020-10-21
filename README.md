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

## Example

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

var scene = new ZICA.Scene();

var box  = new ZICA.Entity();
box.text = 'Box';
box.textColor = 'yellow';
box.color = 'white';
box.drawBorder = true;
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
Tests are found on the [Github Page](https://zica39.github.io/zicaengine/docs/examples/test/)

## Documentation
  * [Getting started](../../wiki/Home)
  * [Entity](../../wiki/Home#Entity)
  * [Scene](../../wiki/Home#Scene)
  * [GameRunner](../../wiki/Home#GameRunner)
  * [Animator](../../wiki/Home#Animator)
  * [Action](../../wiki/Home#Action)
  * [Vect2d](../../wiki/Home#Vector2d)
  * [Camera](../../wiki/Home#Camera)
  * [Box2d](../../wiki/Home#Box2d)


## Demos
  * [Kill Coronavirus](https://zica39.github.io/zicaengine/docs/examples/game/)


# License
ZICA.js is licensed under the terms of the MIT License.
