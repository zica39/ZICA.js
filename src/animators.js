////////////////////////////////////////////////////////
///////ZICA.Animator
//////////////////////////////////////////////////////

ZICA.Animator = function()
{
	this.Type = -1;
}

/** 
 * Returns the type of the animator.
 * Usual values are 'none', 'camerafps', etc. See the concreate animator implementations for type strings.
 * @public
 */
ZICA.Animator.prototype.getType = function()
{
	return '';
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.Animator.prototype.animateNode = function(n, timeMs)
{
	return false;
}		

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseDown = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onClick = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseWheel = function(delta) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseUp = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseMove = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseOut = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseOver = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input.
 * Returns false if the event has not been processed.
 * @public
 */
ZICA.Animator.prototype.onKeyDown = function(event)
{
	return false;
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * Returns false if the event has not been processed.
 * @public
 */
ZICA.Animator.prototype.onKeyUp = function(event)
{
	return false;
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * Returns false if the event has not been processed.
 * @public
 */
ZICA.Animator.prototype.onKeyPress = function(event)
{
	return false;
}
/**
 * Event handler called by the engine so the animator can react when the entity was called by another entity
 * @public
 */
ZICA.Animator.prototype.onCollision = function(event)
{
}
/**
 * Resets the animator, if supported
 * @private
 */
ZICA.Animator.prototype.reset = function(event) 
{
}


/**
 * @private
 */
ZICA.Animator.prototype.findActionByType = function(type)
{
	return null;
}


/**
 * Creates an exact, deep copy of this animator
 * @public
 */
ZICA.Animator.prototype.createClone = function()
{
	return null;
}

/////////////////////////////////////////////////////
//AnimatorFlyCircle
/////////////////////////////////////////////////////

/**
 * Scene node animator making {@link ZICA.Entity}s move in a circle
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class Scene node animator making {@link ZICA.Entity}s move in a circle
 * @param {ZICA.Vect2d} center 2d position of the center of the circle
 * @param {Number} radius radius of the circle
 * @param {Number} speed movement speed, for example 0.1
 */
ZICA.AnimatorFlyCircle = function(obj)//center, radius, direction, speed)
{
	this.Center = obj.Center;
	this.Direction = obj.Direction;
	this.VecU = new ZICA.Vect2d();
	this.VecV = new ZICA.Vect2d();
	this.StartTime = Date.now();//ZICA.CLTimer.getTime();
	this.Speed = obj.Speed;
	this.Radius = obj.Radius;
	
}		
ZICA.AnimatorFlyCircle.prototype = new ZICA.Animator();

/** 
 * Returns the type of the animator.
 * For the AnimatorFlyCircle, this will return 'flycircle'.
 * @public
 */
ZICA.AnimatorFlyCircle.prototype.getType = function()
{
	return 'flycircle';
}

/** 
 * @private
 */
ZICA.AnimatorFlyCircle.prototype.createClone = function()
{
	var a = new ZICA.AnimatorFlyCircle({});
	a.Center = this.Center.clone();
	a.Direction = this.Direction;
	a.VecU = this.VecU.clone();
	a.VecV = this.VecV.clone();
	a.Speed = this.Speed;
	a.Radius = this.Radius;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorFlyCircle.prototype.animateNode = function(n, timeMs)
{
	var timeMs = Date.now();
	var diff = (timeMs-this.StartTime);

	if (diff != 0)
	{
		var t = diff * this.Speed;

		var newX  = this.Radius * Math.cos(t * (Math.PI/180));
		var newY = this.Radius * Math.sin(t * (Math.PI/180));
		
		// to place the square correctly we must add the calculated
		// new x and y values to the circle center
		var x = newX + this.Center.X;
		var y = newY + this.Center.Y;
		n.x = x;
		n.y = y;
	
		return true;
	}
	
	return false;
};

/////////////////////////////////////////////////////////////////////////////////////////
// Animator2DJumpNRun
/////////////////////////////////////////////////////////////////////////////////////////

ZICA.Animator2DJumpNRun = function(obj)
{
	this.ForwardKeyDown = false;
	this.BackKeyDown = false;
	this.PressedJump = false;
	this.LastTime = null;
	this.JumpForce = 0;
	this.JumpLengthMs = 1000;
	
	this.StandAnimation = '';
	this.WalkLeftAnimation = '';
	this.WalkRightAnimation = '';
	//this.JumpAnimation = '';
	
	this.Speed = obj.Speed;
	this.JumpSpeed = obj.JumpSpeed;
	this.JumpLengthMs = obj.JumpLengthMs;
	this.PauseAfterJump = obj.PauseAfterJump;
	
	this.StandAnimation = obj.StandAnimation;
	this.WalkLeftAnimation = obj.WalkLeftAnimation;
	this.WalkRightAnimation = obj.WalkRightAnimation;
	//this.JumpAnimation = obj.JumpAnimation;
	
};

ZICA.Animator2DJumpNRun.prototype = new ZICA.Animator();

/** 
 * Returns the type of the animator.
 * For the Animator2DJumpNRun, this will return '2djumpnrun'.
 * @private
 */
ZICA.Animator2DJumpNRun.prototype.getType = function()
{
	return '2djumpnrun';
};

/** 
 * @private
 */
ZICA.Animator2DJumpNRun.prototype.createClone = function()
{
	var a = new ZICA.Animator2DJumpNRun({});
	a.Speed = this.Speed;
	a.JumpSpeed = this.JumpSpeed;
	a.JumpLengthMs = this.JumpLengthMs;
	a.PauseAfterJump = this.PauseAfterJump;
	
	a.StandAnimation = this.StandAnimation;
	a.WalkLeftAnimation = this.WalkLeftAnimation;
	a.WalkRightAnimation = this.WalkRightAnimation;
	//a.JumpAnimation = this.JumpAnimation;
	
	return a;
};

ZICA.Animator2DJumpNRun.prototype.animateNode = function(node, timeMs)
{
	var timeMs = Date.now();
	var bFalling = false;
	// get the time since the last frame
	
	if (this.LastTime == null)
	{
		this.LastTime = timeMs; // we were never called before, so store the time and cancel
		this.InitPos = new ZICA.Vect2d(node.x,node.y);//ccbGetSceneNodeProperty(node, 'Position');
		this.InitRotation = node.angle;//ccbGetSceneNodeProperty(node, 'Rotation');
		return false;
	}
	
	this.LastNodeUsed = node;
	
	var delta = timeMs - this.LastTime;
	this.LastTime = timeMs;
	if (delta > 200) delta = 200;
	
	// move 
	
	var pos = new ZICA.Vect2d(node.x,node.y);//ccbGetSceneNodeProperty(node, 'Position');
	
	if (this.ForwardKeyDown)
	{
		pos.X += this.Speed * delta;
		node.animation = this.WalkRightAnimation;
		//node.angle = this.InitRotation;//ccbSetSceneNodeProperty(node, 'Rotation', this.InitRotation);
	}
	else
	if (this.BackKeyDown)
	{
		pos.X -= this.Speed * delta;
		node.animation = this.WalkLeftAnimation;
		//node.angle = this.InitRotation - 180;//ccbSetSceneNodeProperty(node, 'Rotation', this.InitRotation.x, this.InitRotation.y - 180, this.InitRotation.z);
	}
	else
	{
		// not walking, stand
		node.animation = this.StandAnimation;
	}
	
	var a = node.getAnimatorOfType('collisionresponse');
	if (a)bFalling = a.isFalling();
	
	var flag = true;
	if(this.PauseAfterJump && bFalling)flag = false
	
	// jump if jump was pressed
	
	if (this.PressedJump && this.JumpForce == 0 && flag)
	{
		this.PressedJump = false;
		this.JumpForce = this.JumpLengthMs;
	}
		
	if (this.JumpForce > 0)
	{
		pos.Y -= this.JumpSpeed * delta;
		this.JumpForce -= delta;
		
		if (this.JumpForce < 0) 
			this.JumpForce = 0;
	}
	
	
	// set position
	node.x = pos.X;
	node.y = pos.Y;
	return true;
};

/**
 * @private
 */
ZICA.Animator2DJumpNRun.prototype.onKeyDown = function(evt)
{
	return this.onKeyEvent(evt.keyCode, true);
};

/**
 * @private
 */
ZICA.Animator2DJumpNRun.prototype.onKeyUp = function(evt)
{
	return this.onKeyEvent(evt.keyCode, false);
};

// parameters: key: key id pressed or left up.  pressed: true if the key was pressed down, false if left up
ZICA.Animator2DJumpNRun.prototype.onKeyEvent = function(key, pressed)
{
	// store which key is down
	// key codes are this: left=37, up=38, right=39, down=40

	if (key == 37 || key == 40)
		this.BackKeyDown = pressed;
	else	
	if (key == 39 || key == 38)
		this.ForwardKeyDown = pressed;
		
	// jump when space pressed
	
	if (key == 32 && pressed)
		this.PressedJump = true;
}


// mouseEvent: 0=mouse moved, 1=mouse wheel moved, 2=left mouse up,  3=left mouse down, 4=right mouse up, 5=right mouse down
ZICA.Animator2DJumpNRun.prototype.onMouseEvent = function(mouseEvent, mouseWheelDelta)
{
	// we currently don't support move event. But for later use maybe.
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorTopDownMovement
/////////////////////////////////////////////////////////////////////////////////////////

ZICA.AnimatorTopDownMovement = function(obj)
{
	this.UpKeyDown = false;
	this.DownKeyDown = false;
	this.LeftKeyDown = false;
	this.RightKeyDown = false;
	
	//this.PressedJump = false;
	this.LastTime = null;
	//this.JumpForce = 0;
	//this.JumpLengthMs = 1000;
	
	this.StandAnimation = '';
	this.WalkLeftAnimation = '';
	this.WalkRightAnimation = '';
	this.WalkUpAnimation = '';
	this.WalkDownAnimation = '';
	//this.JumpAnimation = '';
	
	this.Speed = obj.Speed;
	/* this.JumpSpeed = obj.JumpSpeed;
	this.JumpLengthMs = obj.JumpLengthMs;
	this.PauseAfterJump = obj.PauseAfterJump; */
	
	this.StandAnimation = obj.StandAnimation;
	this.WalkLeftAnimation = obj.WalkLeftAnimation;
	this.WalkRightAnimation = obj.WalkRightAnimation;
	this.WalkUpAnimation = obj.WalkUpAnimation;
	this.WalkDownAnimation = obj.WalkDownAnimation;
	//this.JumpAnimation = obj.JumpAnimation;
	
};

ZICA.AnimatorTopDownMovement.prototype = new ZICA.Animator();

/** 
 * Returns the type of the animator.
 * For the AnimatorTopDownMovement, this will return 'topdownmovement'.
 * @private
 */
ZICA.AnimatorTopDownMovement.prototype.getType = function()
{
	return 'topdownmovement';
};

/** 
 * @private
 */
ZICA.AnimatorTopDownMovement.prototype.createClone = function()
{
	var a = new ZICA.AnimatorTopDownMovement({});
	a.Speed = this.Speed;
	/* a.JumpSpeed = this.JumpSpeed;
	a.JumpLengthMs = this.JumpLengthMs;
	a.PauseAfterJump = this.PauseAfterJump; */
	
	a.StandAnimation = this.StandAnimation;
	a.WalkLeftAnimation = this.WalkLeftAnimation;
	a.WalkRightAnimation = this.WalkRightAnimation;
	a.WalkUpAnimation = this.WalkUpAnimation;
	a.WalkDownAnimation = this.WalkDownAnimation;
	//a.JumpAnimation = this.JumpAnimation;
	
	return a;
};

ZICA.AnimatorTopDownMovement.prototype.animateNode = function(node, timeMs)
{
	var timeMs = Date.now();
	var bFalling = false;
	// get the time since the last frame
	
	if (this.LastTime == null)
	{
		this.LastTime = timeMs; // we were never called before, so store the time and cancel
		this.InitPos = new ZICA.Vect2d(node.x,node.y);
		return false;
	}
	
	this.LastNodeUsed = node;
	
	var delta = timeMs - this.LastTime;
	this.LastTime = timeMs;
	if (delta > 200) delta = 200;
	
	// move 
	
	var pos = new ZICA.Vect2d(node.x,node.y);
	
	if(this.RightKeyDown || this.LeftKeyDown || this.UpKeyDown || this.DownKeyDown)
	{	
		if (this.RightKeyDown)
		{
			pos.X += this.Speed * delta;
			node.animation = this.WalkRightAnimation;
		}
		if (this.LeftKeyDown)
		{
			pos.X -= this.Speed * delta;
			node.animation = this.WalkLeftAnimation;
		}
		if (this.DownKeyDown)
		{
			pos.Y += this.Speed * delta;
			node.animation = this.WalkDownAnimation;
		}
		if (this.UpKeyDown)
		{
			pos.Y -= this.Speed * delta;
			node.animation = this.WalkUpAnimation;
			
		}
	}
	else
	{
		// not walking, stand
		node.animation = this.StandAnimation;
	}
	
	/* var a = node.getAnimatorOfType('collisionresponse');
	if (a)bFalling = a.isFalling();
	
	var flag = true;
	if(this.PauseAfterJump && bFalling)flag = false
	
	// jump if jump was pressed
	
	if (this.PressedJump && this.JumpForce == 0 && flag)
	{
		this.PressedJump = false;
		this.JumpForce = this.JumpLengthMs;
	}
		
	if (this.JumpForce > 0)
	{
		pos.Y -= this.JumpSpeed * delta;
		this.JumpForce -= delta;
		
		if (this.JumpForce < 0) 
			this.JumpForce = 0;
	} */
	
	
	// set position
	node.x = pos.X;
	node.y = pos.Y;
	return true;
};

/**
 * @private
 */
ZICA.AnimatorTopDownMovement.prototype.onKeyDown = function(evt)
{
	return this.onKeyEvent(evt.keyCode, true);
};

/**
 * @private
 */
ZICA.AnimatorTopDownMovement.prototype.onKeyUp = function(evt)
{
	return this.onKeyEvent(evt.keyCode, false);
};

// parameters: key: key id pressed or left up.  pressed: true if the key was pressed down, false if left up
ZICA.AnimatorTopDownMovement.prototype.onKeyEvent = function(key, pressed)
{
	// store which key is down
	// key codes are this: left=37, up=38, right=39, down=40
	
	if (key == 37 || key == 65)
		this.LeftKeyDown = pressed;
	if (key == 38 || key == 87)
		this.UpKeyDown = pressed;
	if (key == 39 || key == 68)
		this.RightKeyDown = pressed;
	if (key == 40 || key == 83)
		this.DownKeyDown = pressed;
	if (key == 37 || key == 40)
		this.BackKeyDown = pressed;
	
	// jump when space pressed
	
	//if (key == 32 && pressed)
	//	this.PressedJump = true;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Keyboard controlled animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorKeyboardControlled = function(obj)
{
	this.lastAnimTime = 0;
	//this.SMGr = scene;
	
	this.MoveSpeed = 0;
	this.RunSpeed = 0;
	this.RotateSpeed = 0;
	this.JumpSpeed = 0;
	this.PauseAfterJump = false;
	
	this.UseAcceleration = false;
	this.AccelerationSpeed = 0;
	this.DecelerationSpeed = 0;
	
	this.FollowSmoothingSpeed = 15;
	this.AdditionalRotationForLooking = 0; //new ZICA.Vect2d();
	
	this.StandAnimation = "";
	this.WalkAnimation = "";
	this.JumpAnimation = "";
	this.RunAnimation = "";

	this.LastAnimationTime = Date.now();//ZICA.CLTimer.getTime();	
	this.LastJumpTime = this.LastAnimationTime;
	this.WasMovingLastFrame = false;		
	this.ShiftIsDown = false;		
	
	this.Registered = false;
	
	this.leftKeyDown = false;
	this.rightKeyDown = false;
	this.upKeyDown = false;
	this.downKeyDown = false;
	this.jumpKeyDown = false;
	
	this.AcceleratedSpeed = 0;
	this.AccelerationIsForward = false;
	
	this.firstUpdate = true;
	this.DisableWithoutActiveCamera = false;
	
	
	this.MoveSpeed = obj.MoveSpeed;
	this.RunSpeed = obj.RunSpeed;
	this.RotateSpeed = obj.RotateSpeed;
	this.JumpSpeed = obj.JumpSpeed;
	
	this.UseAcceleration = obj.UseAcceleration;
	this.AccelerationSpeed = obj.AccelerationSpeed;
	this.DecelerationSpeed = obj.DecelerationSpeed;
	
	this.PauseAfterJump = obj.PauseAfterJump;
	
	this.StandAnimation = obj.StandAnimation;
	this.WalkAnimation = obj.WalkAnimation;
	this.JumpAnimation = obj.JumpAnimation;
	this.RunAnimation = obj.RunAnimation;
	
	this.AdditionalRotationForLooking = obj.AdditionalRotationForLooking;
	//this.Engine = engine;
	//engine.registerAnimatorForKeyUp(this);
	//engine.registerAnimatorForKeyDown(this);
}		
ZICA.AnimatorKeyboardControlled.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorTimer, this will return 'keyboardcontrolled'.
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.getType = function()
{
	return 'keyboardcontrolled';
}

/** 
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.createClone = function()
{
	var a = new ZICA.AnimatorKeyboardControlled({});
	a.MoveSpeed = this.MoveSpeed;
	a.RunSpeed = this.RunSpeed;
	a.RotateSpeed = this.RotateSpeed;
	a.JumpSpeed = this.JumpSpeed;				
	a.FollowSmoothingSpeed = this.FollowSmoothingSpeed;
	a.AdditionalRotationForLooking = this.AdditionalRotationForLooking;		
	a.StandAnimation = this.StandAnimation;
	a.WalkAnimation = this.WalkAnimation;
	a.JumpAnimation = this.JumpAnimation;
	a.RunAnimation = this.RunAnimation;
	a.UseAcceleration = this.UseAcceleration;
	a.AccelerationSpeed = this.AccelerationSpeed;
	a.DecelerationSpeed = this.DecelerationSpeed;
	a.DisableWithoutActiveCamera = this.DisableWithoutActiveCamera;
			
	return a;
}

/** 
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.setKeyBool = function(down, code)
{
	// 37 = left arrow key
	// 38 = up arrow key
	// 39 = right arrow key
	// 40 = down arrow key
	// 65 = a or A
	// 87 = w or W
	// 68 = d or D
	// 83 = s or S
	// 32 = space

	if (code == 37 || code == 65 )
	{
		this.leftKeyDown = down;
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.rightKeyDown = false;
		return true;
	}
		
	if (code == 39 || code == 68 )
	{
		this.rightKeyDown = down;
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.leftKeyDown = false;
		return true;
	}
		
	if (code == 38 || code == 87 )
	{
		this.upKeyDown = down;			
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.downKeyDown = false;
		return true;
	}
		
	if (code == 40 || code == 83 )
	{
		this.downKeyDown = down;
		
		// fix chrome key down problem (key down sometimes doesn't arrive)
		if (down) this.upKeyDown = false;
		return true;
	}
	
	if (code == 32)
	{
		// jump key
		this.jumpKeyDown = down;
		return true;
	}
	
	return false;
}

/**
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.onKeyDown = function(evt)
{
	this.ShiftIsDown = (evt.shiftKey == 1);
	return this.setKeyBool(true, evt.keyCode);
}

/**
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.onKeyUp = function(evt)
{
	this.ShiftIsDown = (evt.shiftKey == 1);
	return this.setKeyBool(false, evt.keyCode);
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorKeyboardControlled.prototype.animateNode = function(node, timeMs)
{
	var timeMs = Date.now();
	var timeDiff = timeMs - this.lastAnimTime;			
	if (timeDiff > 250)
		timeDiff = 250;
	
	this.lastAnimTime = timeMs;
		
	var bChanged = false;
		
	this.LastAnimationTime = timeMs;
	
	// disable if user wants disabled without active camera following the object we are controlling
	
	if (this.DisableWithoutActiveCamera)
	{
		var cam = node.scene.getActiveCamera();
		if (cam != null)
		{
			var an = cam.getAnimatorOfType('3rdpersoncamera');
			if (an != null)
			{
				if (!(an.NodeToFollow === node))
					return false;
			}
			else
				return false;
		}
	}

	// Update rotation

	//var currentRot = node.angle;	

	if (this.leftKeyDown)
	{
		node.angle -= timeDiff * this.RotateSpeed * 0.001;
		bChanged = true;
	}

	if (this.rightKeyDown)
	{
		node.angle += timeDiff * this.RotateSpeed * 0.001;
		bChanged = true;
	}

	// move forward/backward

	//var pos = node.Pos;

	/* var matrot = new ZICA.Matrix4();
	matrot.setRotationDegrees(currentRot);
	var directionForward = new ZICA.Vect3d(0,0,1);

	var matrot2 = new ZICA.Matrix4();
	matrot2.setRotationDegrees(this.AdditionalRotationForLooking);
	matrot = matrot.multiply(matrot2);

	matrot.rotateVect(directionForward); */
	var x = Math.cos((node.angle + this.AdditionalRotationForLooking)*Math.PI/180);
	var y = Math.sin((node.angle + this.AdditionalRotationForLooking)*Math.PI/180);
	
	var directionForward = new ZICA.Vect2d(x,y);

	var bRun = this.ShiftIsDown;
	var speed = (bRun ? this.RunSpeed : this.MoveSpeed) * timeDiff;
	var origSpeed = 0;
			
	var bBackward = this.downKeyDown;
	var bForward = this.upKeyDown;
	
	if (this.UseAcceleration && timeDiff)
	{
		if (bForward || bBackward)
		{
			// accelerate normally 

			if (this.AccelerationIsForward != bForward)
			{
				// user change direction.
				if (this.DecelerationSpeed == 0)
					this.AcceleratedSpeed *= -1.0; //  We need to invert the force so he has to work against it
				else
					this.AcceleratedSpeed = 0.0; // no deceleration, stop immediately
			}

			this.AccelerationIsForward = !bBackward;

			origSpeed = speed / timeDiff;
			this.AcceleratedSpeed += (this.AccelerationSpeed) * origSpeed * (timeDiff / 1000.0);
			if (this.AcceleratedSpeed > origSpeed) this.AcceleratedSpeed = origSpeed;

			speed = this.AcceleratedSpeed * timeDiff;
		}
		else
		{
			// no key pressed, decellerate

			if (this.DecelerationSpeed == 0.0)
				this.AcceleratedSpeed = 0;
			else
			{
				origSpeed = speed / Number(timeDiff);
				this.AcceleratedSpeed -= (this.DecelerationSpeed) * origSpeed * (timeDiff / 1000.0);
				if (this.AcceleratedSpeed < 0) this.AcceleratedSpeed = 0;
				speed = this.AcceleratedSpeed * timeDiff;
			}
		}
	}

	directionForward.setLength(speed);

	if (bForward || bBackward || (this.UseAcceleration && this.AcceleratedSpeed != 0))
	{
		var moveVect = directionForward.clone();

		if (bBackward || (!(bForward || bBackward) && !this.AccelerationIsForward))
			moveVect.multiplyThisWithScal(-1.0);
		
		var pos = new ZICA.Vect2d(node.x,node.y);
		pos.addToThis(moveVect);
		node.x = pos.X;
		node.y = pos.Y
		//node.Pos.addToThis(moveVect);
		
		bChanged = true;
		this.WasMovingLastFrame = true;
	}
	
	if (bForward || bBackward)
	{
		this.setAnimation(node, bRun ? 3 : 1, bBackward);

		this.WasMovingLastFrame = true;
		bChanged = true;
	}
	else
	{
		// no key pressed
		
		// stand animation, only if not falling

		var bFalling = false;

		var a = node.getAnimatorOfType('collisionresponse');
		if (a)
			bFalling = a.isFalling();
		
		if (!bFalling && (this.hasAnimationType(node, 1) || this.hasAnimationType(node, 3) || this.hasAnimationType(node, 2)))
			this.setAnimation(node, 0, false);
	}

	// jump

	// For jumping, we find the collision response animator attached to our camera
	// and if it's not falling, we tell it to jump.
	if (this.jumpKeyDown)
	{
		var b = node.getAnimatorOfType('collisionresponse');
		if (b && !b.isFalling())
		{
			var minJumpTime = 0;
			if (Game.scene.gravity != 0)
				minJumpTime = Math.floor((this.JumpSpeed * (1.0 / Game.scene.gravity)) * 2000);

			if (!this.PauseAfterJump ||
				(this.PauseAfterJump && (timeMs - this.LastJumpTime) > minJumpTime))
			{
				b.jump(this.JumpSpeed);
				this.setAnimation(node, 2, false);

				this.LastJumpTime = timeMs;
				
				bChanged = true;
			}
		}
	}
	
	return bChanged;
}

/**
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.getAnimationNameFromType = function(n)
{
	switch(n)
	{
	case 0: return this.StandAnimation;
	case 1:  return this.WalkAnimation;
	case 2:  return this.JumpAnimation;
	case 3:  return this.RunAnimation;
	}

	return "";
}

/** 
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.hasAnimationType = function(node, animationType)
{
	return this.setAnimation(node, animationType, false, true);
}

/** 
 * @private
 */
ZICA.AnimatorKeyboardControlled.prototype.setAnimation = function(node, animationType, breverse, testIfIsSetOnly)
{
	if(testIfIsSetOnly){
		if(node.animation == this.getAnimationNameFromType(animationType));
		return true;
	}
	
	node.animation = this.getAnimationNameFromType(animationType);
	return true;
	
	if (!node || node.getType() != 'animatedmesh')
		return false;

	// find mesh and node type

	var animatedMesh = node;
			
	var skinnedmesh = animatedMesh.Mesh; // as SkinnedMesh;
	if (!skinnedmesh)
		return false;

	// find range for animation
	
	var range = skinnedmesh.getNamedAnimationRangeByName(this.getAnimationNameFromType(animationType));
		
	if (range)
	{
		var wantedFPS = 1.0 * range.FPS;
		if (breverse)
			wantedFPS *= -1.0;
			
		if (testIfIsSetOnly)
		{
			return animatedMesh.EndFrame == range.End &&
			       animatedMesh.StartFrame == range.Begin;
		}
			
		if (!(animatedMesh.EndFrame == range.End &&
			 animatedMesh.StartFrame == range.Begin &&
			 ZICA.equals(animatedMesh.FramesPerSecond, wantedFPS)))
		{			
			animatedMesh.setFrameLoop(range.Begin, range.End);
			if (wantedFPS)
				animatedMesh.setAnimationSpeed(wantedFPS);
				
			animatedMesh.setLoopMode(animationType == 0 || animationType == 1  || animationType == 3);
		}
			
		return false;
	}
	else
	{
		// note: temporary bug fix. The flash animation player is
		// not able to stop an animation at (0,0), so we stop at (1,1)
		if (!testIfIsSetOnly)
		{
			animatedMesh.setFrameLoop(1, 1);
			animatedMesh.setLoopMode(false);
		}
	}

	return false;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Game AI Animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorGameAI = function(obj)
{
	// constants for the commands (from coppercube editor):
	// private static const EMT_PLAYER:int = 0;
	// private static const EMT_STAND_STILL:int = 1;
	// private static const EMT_RANDOMLY_PATROL:int = 2;
	
	// private static const EMT_DO_NOTHING:int = 0;
	// private static const EMT_REACH_POSITION:int = 1;
	// private static const EMT_ATTACK_ITEM:int = 2;
	// private static const EMT_DIE_AND_STOP:int = 3;
	
	// private static const EAT_STAND:int = 0;
	// private static const EAT_WALK:int = 1;
	// private static const EAT_ATTACK:int = 2;
	// private static const EAT_DIE:int = 3;
		
	this.AIType = 0
	this.MovementSpeed = 0;
	this.ActivationRadius = 0;
	this.CanFly = false;
	this.Health = 100;
	this.PatrolWaitTimeMs = 3000;
	this.PathIdToFollow = -1;
	this.Tags = "";
	this.AttacksAIWithTags = "";
	this.PatrolRadius = 100;
	this.RotationSpeedMs = 0;
	this.AdditionalRotationForLooking = -90;//new ZICA.Vect3d();
	this.RotationForLooking = false;
	this.StandAnimation = "";
	this.WalkAnimation = "";
	this.DieAnimation = "";
	this.AttackAnimation = "";
	
	this.ActionHandlerOnAttack = null;
	this.ActionHandlerOnActivate = null;
	this.ActionHandlerOnHit = null;
	this.ActionHandlerOnDie = null;
	
	// runtime data
	
	this.CurrentCommand = 0;

	this.NextAttackTargetScanTime = 0;
	this.LastPatrolStartTime = 0;

	this.CurrentCommandTargetPos = null;
	this.CurrentCommandStartTime = 0;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 0;
	this.BeginPositionWhenStartingCurrentCommand = 0;	
	this.HandleCurrentCommandTargetNode = null;
	this.AttackCommandExecuted = false;
	this.Activated = false;
	this.CurrentlyShooting = false; // flag to be queried shoot action
	this.CurrentlyShootingLine = new Object();//ZICA.Line3d(); // data to be queried shoot action
	this.NextPathPointToGoTo = 0;
			
	this.TheObject = null;
	this.LastTime = 0;
	this.StartPositionOfActor = new ZICA.Vect2d();
	
	this.NearestSceneNodeFromAIAnimator_NodeOut = null;
	this.NearestSceneNodeFromAIAnimator_maxDistance = 0;
	
	this.AIType = ['This is the Player','Stand Still','Randomly Patrol'].indexOf(obj.Mode);
	
	this.PatrolRadius = obj.PatrolRadius;
	this.PatrolWaitTimeMs = obj.PatrolWaitTimeMs;
	
	this.PathIdToFollow = obj.PathIdToFollow;
	
	this.Health = obj.Health;
	this.MovementSpeed = obj.MovementSpeed;
	this.Tags = obj.Tags;
	this.AttacksAIWithTags = obj.AttacksActorsWithTags;
	this.CanFly = obj.CanFly;
	this.ActivationRadius = obj.ActivationRadius;
	
	this.StandAnimation = obj.StandAnimation;
	this.WalkAnimation = obj.WalkAnimation;
	this.DieAnimation = obj.DieAnimation;
	this.AttackAnimation = obj.AttackAnimation;
	
	this.ActionHandlerOnAttack = obj.ActionOnAttack;
	this.ActionHandlerOnActivate = obj.ActionOnActivate;
	this.ActionHandlerOnHit = obj.ActionOnHit;
	this.ActionHandlerOnDie = obj.ActionOnDie;
	
	this.AdditionalRotationForLooking = obj.AdditionalRotationForLooking;
	this.RotationForLooking = obj.RotationForLooking;

}		
ZICA.AnimatorGameAI.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorGameAI, this will return 'gameai'.
 * @private
 */
ZICA.AnimatorGameAI.prototype.getType = function()
{
	return 'gameai';
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.createClone = function()
{
	var a = new ZICA.AnimatorGameAI({});
	a.AIType = this.AIType;
	a.MovementSpeed = this.MovementSpeed;
	a.ActivationRadius = this.ActivationRadius;
	a.CanFly = this.CanFly;
	a.Health = this.Health;
	a.Tags = this.Tags;
	a.AttacksAIWithTags = this.AttacksAIWithTags;
	a.PatrolRadius = this.PatrolRadius;
	a.RotationSpeedMs = this.RotationSpeedMs;
	a.PathIdToFollow = this.PathIdToFollow;
	a.PatrolWaitTimeMs = this.PatrolWaitTimeMs;
	a.AdditionalRotationForLooking = this.AdditionalRotationForLooking;
	a.RotationForLooking = this.RotationForLooking;
	a.StandAnimation = this.StandAnimation;
	a.WalkAnimation = this.WalkAnimation;
	a.DieAnimation = this.DieAnimation;
	a.AttackAnimation = this.AttackAnimation;
	
	a.ActionHandlerOnAttack = this.ActionHandlerOnAttack ? this.ActionHandlerOnAttack.createClone() : null;
	a.ActionHandlerOnActivate = this.ActionHandlerOnActivate ? this.ActionHandlerOnActivate.createClone() : null;
	a.ActionHandlerOnHit = this.ActionHandlerOnHit ? this.ActionHandlerOnHit.createClone() : null;
	a.ActionHandlerOnDie = this.ActionHandlerOnDie ? this.ActionHandlerOnDie.createClone() : null;
			
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorGameAI.prototype.animateNode = function(node, timeMs)
{
	var timeMs = Date.now();
	
	if (node == null)
		return false;
		
	var diff = timeMs - this.LastTime;
	if (diff > 150) diff = 150;
	this.LastTime = timeMs;
	
	var characterSize = 0;			
	var changedNode = false;
	
	if (!(this.TheObject === node))
	{
		this.TheObject = node;
		this.StartPositionOfActor = new ZICA.Vect2d(node.x,node.y);//node.getAbsolutePosition();
	}
			
	var currentPos = new ZICA.Vect2d(node.x,node.y);// node.getAbsolutePosition();
	
	if (this.CurrentCommand == 3) //EMT_DIE_AND_STOP)
	{
		// do nothing
	}
	else
	if (this.CurrentCommand == 1) //EMT_REACH_POSITION)
	{
		// check if we reached the position

		characterSize = this.getCharacterWidth(node);
		if (this.CurrentCommandTargetPos.substract(currentPos).getLength() < characterSize)
		{
			// target reached.

			this.CurrentCommand = 0; //EMT_DO_NOTHING;
			this.setAnimation(node, 0); //EAT_STAND);
			changedNode = true;
		}
		else
		{
			// not reached position yet
			// check if we possibly hit a wall. This can be done easily by getting the moving speed and 
			// checking the start position and start time

			var cancelled = false;

			if (this.CurrentCommandTicksDone > 2)
			{
				var expectedLengthMoved = this.CurrentCommandTicksDone * (this.MovementSpeed / 1000.0);
				var lengthMoved = this.BeginPositionWhenStartingCurrentCommand.substract(currentPos).getLength();

				if ( lengthMoved * 1.2 < expectedLengthMoved )
				{
					// cancel movement, moved twice as long as we should have already.
					this.CurrentCommand = 0; //EMT_DO_NOTHING;
					this.setAnimation(node, 0); //EAT_STAND);
					cancelled = true;
				}
			}	

			if (!cancelled)
			{
				// move on to the position

				this.CurrentCommandTicksDone += diff;

				var movementVec = this.CurrentCommandTargetPos.substract(currentPos);
				movementVec.setLength((this.MovementSpeed / 1000.0) * diff);
				
				if (!this.CanFly)
					movementVec.Y = 0;

				//node.Pos.addToThis(movementVec); 
				
				node.x += movementVec.X;
				node.y += movementVec.Y;
			}

			// additionally, animate looking direction

			changedNode = this.animateRotation(node, (timeMs - this.CurrentCommandStartTime), 
				this.CurrentCommandTargetPos.substract(currentPos), this.RotationSpeedMs);
		}
	}
	else
	if (this.CurrentCommand == 2) //EMT_ATTACK_ITEM)
	{
		// attack enemy in the middle of the animation

		this.CurrentCommandTicksDone += diff;

		if (!this.AttackCommandExecuted && 
			this.CurrentCommandTicksDone > (this.CurrentCommandExpectedTickCount / 2))
		{
			// execute attack action

			this.CurrentlyShooting = true;
			
			if (this.ActionHandlerOnAttack)
				this.ActionHandlerOnAttack.execute(node);

			this.CurrentlyShooting = false;
			this.AttackCommandExecuted = true;
			changedNode = true;
		}

		if (this.CurrentCommandTicksDone > this.CurrentCommandExpectedTickCount)
		{
			// finished
			this.CurrentCommand = 0; //EMT_DO_NOTHING;
		}
		else
		{
			// rotate to attack target
			changedNode = this.animateRotation(node, (timeMs - this.CurrentCommandStartTime), 
				this.CurrentCommandTargetPos.substract(currentPos), 
				Math.min(this.RotationSpeedMs, this.CurrentCommandExpectedTickCount));
		}
	}
	else
	if (this.CurrentCommand == 0) //EMT_DO_NOTHING)
	{
		// see if we can check for the target

		// now do high level ai calculation here
		
		if (this.AIType == 1 || //EMT_STAND_STILL ||
			this.AIType == 2 ||  //EMT_RANDOMLY_PATROL) 
			this.AIType == 3 )
		{							
			var attackTargetNode = this.scanForAttackTargetIfNeeded(timeMs, currentPos);
			
			
			if (attackTargetNode != null)
			{	
				// found an attack target
				var weaponDistance = this.getAttackDistanceFromWeapon();

				if (!this.Activated && this.ActionHandlerOnActivate)
					this.ActionHandlerOnActivate.execute(node);
				this.Activated = true;
				changedNode = true;
				
				var pos = new ZICA.Vect2d(attackTargetNode.x,attackTargetNode.y);
				if (pos.getDistanceTo(currentPos) < weaponDistance)
				{
					// attack target is in distance to be attacked by our weapon. Attack now, but
					// first check if there is a wall between us.
					if (this.isNodeVisibleFromNode(attackTargetNode, node))
					{
						// attack target is visible, attack now
						this.CurrentlyShootingLine.Start = new ZICA.Vect2d(node.getCenter().x,node.getCenter().y);
						this.CurrentlyShootingLine.End = new ZICA.Vect2d(attackTargetNode.getCenter().x,attackTargetNode.getCenter().y);
						
						this.attackTarget( node, attackTargetNode, new ZICA.Vect2d(attackTargetNode.x,attackTargetNode.y), currentPos, timeMs );
					}
					else
					{
						// attack target is not visible. move to it.
						this.moveToTarget( node, new ZICA.Vect2d(attackTargetNode.x,attackTargetNode.y), currentPos, timeMs );
					}
				}
				else
				{
					// attack target is not in distance to be attacked by the weapon. move to it.
					this.moveToTarget( node, new ZICA.Vect2d(attackTargetNode.x,attackTargetNode.y), currentPos, timeMs );
				}
			}
			else
			{
				// no attack target found. Do something idle, maybe patrol a bit.
				if ( this.AIType == 2 || this.AIType == 3) //EMT_RANDOMLY_PATROL or EMT_FOLLOW_PATH_ROUTE)
				{
					if (!this.LastPatrolStartTime || timeMs > this.LastPatrolStartTime + this.PatrolWaitTimeMs)
					{
						characterSize = this.getCharacterWidth(node);
						var newPos = null;
						
						if (this.AIType == 3)
						{
							// find next path point to go to
							/* var path = null;
							
							if (this.PathIdToFollow != -1 && this.TheSceneManager != null)
								path = this.TheSceneManager.getSceneNodeFromId(this.PathIdToFollow);
								
							if (path != null && path.getType() == 'path')
							{
								if (this.NextPathPointToGoTo >= path.getPathNodeCount())
									this.NextPathPointToGoTo = 0;
								
								newPos = path.getPathNodePosition(this.NextPathPointToGoTo);
							}
							
							++this.NextPathPointToGoTo; */
						}
						else
						{						
							// find random position to patrol to

							var walklen = this.PatrolRadius;
							this.LastPatrolStartTime = timeMs;
							newPos = new ZICA.Vect2d((Math.random() - 0.5) * walklen,(Math.random() - 0.5)* walklen);
							
							newPos.addToThis(this.StartPositionOfActor);

							if (!this.CanFly)
								newPos.Y = this.StartPositionOfActor.Y;
							
						}

						if (!(newPos.substract(currentPos).getLength() < characterSize))
						{
							// move to patrol target
							this.moveToTarget( node, newPos, currentPos, timeMs );
							changedNode = true;
						}
					}
				}
			}
		}
	}
	
	return changedNode;
}



/** 
 * returns if rotation changed, returns true/false
 * @private
 */ 
ZICA.AnimatorGameAI.prototype.animateRotation = function(node, timeSinceStartRotation, 
								 lookvector, rotationSpeedMs)
{
	if(!this.RotationForLooking)return false;
	
	if(node.type == 'entity'){
			
			//var interpol = Math.min(timeSinceStartRotation, rotationSpeedMs) / rotationSpeedMs;
			//interpol = ZICA.clamp(interpol, 0.0, 1.0);
			
			node.angle = (Math.atan2(lookvector.X, -lookvector.Y)*180/Math.PI);
			node.angle += this.AdditionalRotationForLooking;
	}
		
	return false;
	
	if (!node)
		return false;

	var isCamera = (node.getType() == 'camera');
	if (isCamera)
		return false;

	if (!this.CanFly)
		lookvector.Y = 0;
		
	var matrot = new ZICA.Matrix4();
	matrot.setRotationDegrees(lookvector.getHorizontalAngle());
	var matrot2 = new ZICA.Matrix4();
	matrot2.setRotationDegrees(this.AdditionalRotationForLooking);
	matrot = matrot.multiply(matrot2);

	// matrot now is the wanted rotation, now interpolate with the current rotation
	var wantedRot = matrot.getRotationDegrees();
	var currentRot = node.Rot.clone();					

	var interpol = Math.min(timeSinceStartRotation, rotationSpeedMs) / rotationSpeedMs;
	interpol = ZICA.clamp(interpol, 0.0, 1.0);

	//node->setRotation(wantedRot.getInterpolated(currentRot, interpol));

	wantedRot.multiplyThisWithScal( ZICA.DEGTORAD);
	currentRot.multiplyThisWithScal( ZICA.DEGTORAD);
	
	var q1 = new ZICA.Quaternion();
	q1.setFromEuler(wantedRot.X, wantedRot.Y, wantedRot.Z);
	
	var q2 = new ZICA.Quaternion();
	q2.setFromEuler(currentRot.X, currentRot.Y, currentRot.Z);
	
	q2.slerp(q2, q1, interpol);
	q2.toEuler(wantedRot);

	wantedRot.multiplyThisWithScal( ZICA.RADTODEG);
	
	if (node.Rot.equals(wantedRot))
		return false;
		
	node.Rot = wantedRot;
	return true;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.moveToTarget = function(node, target, currentPos, now)
{	
	this.CurrentCommand = 1; //EMT_REACH_POSITION;
	this.CurrentCommandTargetPos = target;
	this.CurrentCommandStartTime = now;
	this.BeginPositionWhenStartingCurrentCommand = currentPos;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 0; // invalid for this command
	this.setAnimation(node, 1); //EAT_WALK);
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.attackTarget = function(node, targetnode, target, currentPos, now)
{
	this.CurrentCommand = 2; //EMT_ATTACK_ITEM;
	this.CurrentCommandTargetPos = target;
	this.CurrentCommandStartTime = now;
	this.HandleCurrentCommandTargetNode = targetnode;
	this.BeginPositionWhenStartingCurrentCommand = currentPos;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 500; // seems to be a nice default value
	this.AttackCommandExecuted = false;

	var animDuration = this.setAnimation(node, 2);//EAT_ATTACK);

	if (animDuration != 0)
	{
		this.CurrentCommandExpectedTickCount = animDuration;
	}
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.aiCommandCancel = function(node)
{
	this.CurrentCommand = 0; //EMT_DO_NOTHING;
	this.setAnimation(node, 0); //EAT_STAND);
}


/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.die = function(node, currentPos, now)
{
	this.CurrentCommand = 3; //EMT_DIE_AND_STOP;
	this.CurrentCommandStartTime = now;
	this.BeginPositionWhenStartingCurrentCommand = currentPos;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 500; // seems to be a nice default value

	var animDuration = this.setAnimation(node, 3); //EAT_DIE);
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.isNodeVisibleFromNode = function(node1, node2)
{
	if (!node1 || !node2)
		return false;

	// instead of checking the positions of the nodes, we use the centers of the boxes of the nodes
	
	var pos1 = node1.getCenter();
	var pos2 = node2.getCenter();
	
	// if this is a node with collision box enabled, move the test start position outside of the collision box (otherwise the test would collide with itself)

	if (this.TheObject == node2)
	{
		if (node2.type == 'entity')
		{
			if (node2.DoesCollision)
			{
				var extendLen = node2.width * 0.5;
				var vect = pos2.substract(pos1);
				vect.normalize();
				vect.multiplyThisWithScal( extendLen + (extendLen * 0.02));
				pos1.addToThis(vect);
			}
		}
	}

	return this.isPositionVisibleFromPosition(pos1, pos2);
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.isPositionVisibleFromPosition = function(pos1, pos2)
{
	//odje traba sudarnu tacku nac!!!
	/* if (this.World.getCollisionPointWithLine(pos1, pos2, true, null, true) != null)
	{
		return false;
	} */

	return true;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.getNearestSceneNodeFromAIAnimatorAndDistance = function(node, 
															  currentpos,
															  tag)
{
	if(node.type == 'scene')node.visible = true;//... 
	
	if (!node || !node.visible)
		return;
	
	// check if the node is in the max distance

	var isMatching = false;
	var dist = currentpos.getDistanceTo(new ZICA.Vect2d(node.x,node.y));	

	if (dist < this.NearestSceneNodeFromAIAnimator_maxDistance && node.type != 'scene')
	{
		// find ai animator in the node
	
		var ainode = node.getAnimatorOfType('gameai');

		if (ainode && tag != "" &&
			!(ainode === this) &&
			ainode.isAlive() )
		{
			// check if animator tags are the ones we need
			isMatching = ainode.Tags.indexOf(tag) != -1;
		}
	}

	if (isMatching)
	{
		this.NearestSceneNodeFromAIAnimator_maxDistance = dist;
		this.NearestSceneNodeFromAIAnimator_NodeOut = node;
	}

	// search children of the node
	if(node.children)
	for (var i = 0; i<node.children.length; ++i)
	{				
		var child = node.children[i];
		this.getNearestSceneNodeFromAIAnimatorAndDistance(child, currentpos, tag);
	}
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.scanForAttackTargetIfNeeded = function(timems, currentpos)
{
	if (this.ActivationRadius <= 0 || !this.TheObject || this.AttacksAIWithTags.length == 0)
		return null;

	if (!this.NextAttackTargetScanTime || timems > this.NextAttackTargetScanTime)
	{	
		
		this.NearestSceneNodeFromAIAnimator_maxDistance = this.ActivationRadius;
		this.NearestSceneNodeFromAIAnimator_NodeOut = null;
		
		this.getNearestSceneNodeFromAIAnimatorAndDistance(Game.scene,
													 currentpos, this.AttacksAIWithTags );

		this.NextAttackTargetScanTime = timems + 500 + (Math.random() * 1000);

		return this.NearestSceneNodeFromAIAnimator_NodeOut;	
	}

	return null;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.getAttackDistanceFromWeapon = function()
{
	var ret = 1000;

	if (this.ActionHandlerOnAttack)
	{
		var action = this.ActionHandlerOnAttack.findAction('Shoot');
		if (action)
			ret = action.WeaponRange;
	}

	return ret;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.getCharacterWidth = function(node)
{
	
	if (node != null)
		return 10;

	return node.width;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.getAnimationNameFromType = function(t)
{
	switch(t)
	{
	case 0: return this.StandAnimation;
	case 1: return this.WalkAnimation;
	case 2: return this.AttackAnimation;
	case 3: return this.DieAnimation;
	}

	return "";
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.setAnimation = function(node, animationType)
{
	if(node.animations)
	node.animation = this.getAnimationNameFromType(animationType);
	
	return true;
	
	if (!node || node.getType() != 'animatedmesh')
		return 0;

	// find mesh and node type

	var animatedMesh = node;
			
	var skinnedmesh = animatedMesh.Mesh; // as SkinnedMesh;
	if (!skinnedmesh)
		return 0;

	// find range for animation
	
	var range = skinnedmesh.getNamedAnimationRangeByName(this.getAnimationNameFromType(animationType));
		
	if (range)
	{
		animatedMesh.setFrameLoop(range.Begin, range.End);
		if (range.FPS != 0)
			animatedMesh.setAnimationSpeed(range.FPS);
		animatedMesh.setLoopMode(animationType == 1 || animationType == 0); //animationType == EAT_WALK || animationType == EAT_STAND);
		
		return (range.End - range.Begin) * range.FPS * 1000;
	}
	else
	{
		// note: temporary bug fix. The flash animation player is
		// not able to stop an animation at (0,0), so we stop at (1,1)
		animatedMesh.setFrameLoop(1, 1);
		animatedMesh.setLoopMode(false);
	}

	return 0;
}
	
/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.isCurrentlyShooting = function()
{
	return this.CurrentlyShooting;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.getCurrentlyShootingLine = function()
{
	return this.CurrentlyShootingLine;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.isAlive = function()
{
	return this.Health > 0;
}

/** 
 * @private
 */
ZICA.AnimatorGameAI.prototype.OnHit = function(damage, node)
{
	if (!node)
		return;

	if (this.Health == 0)
		return; // already dead

	this.Health -= damage;
	if (this.Health < 0)
		this.Health = 0;

	if (this.Health == 0)
	{
		if (this.ActionHandlerOnDie != null) 
			this.ActionHandlerOnDie.execute(node);

		this.die(node, new ZICA.Vect2d(node.x,node.y), 0);
	}
	else
	{
		if (this.ActionHandlerOnHit != null)
			this.ActionHandlerOnHit.execute(node);
	}
}		



/**
 * @private
 */
ZICA.AnimatorGameAI.prototype.findActionByType = function(type)
{
	var ret = null;
	
	if (this.ActionHandlerOnAttack)
	{
		ret = this.ActionHandlerOnAttack.findAction(type);
		if (ret)
			return ret;
	}
	
	if (this.ActionHandlerOnActivate)
	{
		ret = this.ActionHandlerOnActivate.findAction(type);
		if (ret)
			return ret;
	}
	
	if (this.ActionHandlerOnHit)
	{
		ret = this.ActionHandlerOnHit.findAction(type);
		if (ret)
			return ret;
	}
	
	if (this.ActionHandlerOnDie)
	{
		ret = this.ActionHandlerOnDie.findAction(type);
		if (ret)
			return ret;
	}
	
	return null;
}

/////////////////////////////////////////////////////
//AnimatorRotation
/////////////////////////////////////////////////////

/**
 * Scene node animator making {@link ZICA.Entity}s rotate
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class  Scene node animator making {@link ZICA.Entity}s rotate
 * @param speed {ZICA.Vect2d} vector defining the RotationSpeed in each direction
 */
ZICA.AnimatorRotation = function(obj)
{
		this.Rotation = obj.Speed;
		
	this.StartTime = Date.now();//ZICA.CLTimer.getTime();
	
	this.RotateToTargetAndStop = false; // for setRotateToTargetAndStop
	this.RotateToTargetEndTime = 0; // for setRotateToTargetAndStop
	this.BeginRotation = null; // for setRotateToTargetAndStop
}		
ZICA.AnimatorRotation.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorRotation, this will return 'rotation'.
 * @public
 */
ZICA.AnimatorRotation.prototype.getType = function()
{
	return 'rotation';
}

/** 
 * @private
 */
ZICA.AnimatorRotation.prototype.createClone = function()
{
	var a = new ZICA.AnimatorRotation({});
	a.Rotation = this.Rotation;
	a.StartTime = this.StartTime;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param timeMs: The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorRotation.prototype.animateNode = function(n, timeMs)
{
	var timeMs = Date.now();
	var difftime = timeMs - this.StartTime;

	if (!this.RotateToTargetAndStop)
	{
		if (difftime != 0)
		{
			n.angle += this.Rotation*(difftime / 10.0);
			//n.Rot.addToThis( this.Rotation.multiplyWithScal(difftime / 10.0) );
			
			this.StartTime = timeMs;
			return true;
		}
	}
	else
	{
		// rotate to a target rotation and then stop
		
		if (this.RotateToTargetEndTime - this.StartTime == 0)
			return false;

		var interpol = (timeMs - this.StartTime) / (this.RotateToTargetEndTime - this.StartTime);
		if (interpol > 1.0)
		{
			// end reached, destroy this animator
			//n.Rot = this.Rotation.clone();
			n.angle = this.Rotation;
			n.removeAnimator(this);
		}
		else
		{
			// interpolate 
			n.angle = this.BeginRotation + ((this.Rotation - this.BeginRotation) * interpol);	
			
			return true;
		}
	}
	
	return false;
}

/**
 * Makes the animator rotate the scene node to a specific target and then stop there
 * @private
 */
ZICA.AnimatorRotation.prototype.setRotateToTargetAndStop = function(targetRot, beginRot, timeForMovement)
{		
	this.RotateToTargetAndStop = true;
	this.Rotation = targetRot;
	this.BeginRotation = beginRot;
	this.RotateToTargetEndTime = this.StartTime + timeForMovement;
}	
//////////////////////////////////////////////////////
//+ AnimatorFollowPath
//////////////////////////////////////////////////////	
/**
 * Scene node animator making {@link ZICA.Entity}s move along a path.
 * Uses {@link ZICA.Entity} to define the path.
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class  Scene node animator making {@link ZICA.Entity}s move along a path, uses {@link ZICA.PathSceneNode} to define the path.
 * @param scene The scene the animator is in
 */
ZICA.AnimatorFollowPath = function(obj)
{
	this.TimeNeeded = 5000;
	this.LookIntoMovementDirection = false;
	this.OnlyMoveWhenCameraActive = true;
	this.TimeDisplacement = 0;
	this.EndMode = 0; //ZICA.AnimatorFollowPath.EFPFEM_START_AGAIN;
	
	this.StartTime = 0;
	this.LastObject = null;

	this.PathToFollow = null; // string!
	this.AdditionalRotation = null; 	
	
	this.LastPercentageDoneActionFired = 0;
	this.bActionFired = false;
	
	this.PathToFollow = obj.PathToFollow;
	if(this.PathToFollow)
		if(this.PathToFollow.length)
			this.PathToFollow.forEach(function(item, index, arr){
				var array = item.split(',');
				arr[index] = new ZICA.Vect2d(Number(array[0]),Number(array[1]));	
			});
		
	this.TimeNeeded = obj.TimeNeeded;
	this.LookIntoMovementDirection = obj.LookIntoMovementDirection;
	this.AdditionalRotation = obj.AdditionalRotation;
	this.TimeDisplacement = obj.TimeDisplacement;
	this.EndMode = (obj.EndMode == 'Start Again')?0:1;
}		
ZICA.AnimatorFollowPath.prototype = new ZICA.Animator();

/** 
 * Constant for {@link AnimatorFollowPath.EndMode}, specifying to start the movement again when the end of the path has been reached.
 * @const 
 * @public
 */
ZICA.AnimatorFollowPath.EFPFEM_START_AGAIN = 0;

/** 
 * Constant for {@link AnimatorFollowPath.EndMode}, specifying to start the movement again when the end of the path has been reached.
 * @const 
 * @public
 */
ZICA.AnimatorFollowPath.EFPFEM_STOP = 1;

/** 
 * Constant for {@link AnimatorFollowPath.EndMode}, specifying to start the movement again when the end of the path has been reached.
 * @const 
 * @private
 */
ZICA.AnimatorFollowPath.EFPFEM_SWITCH_TO_CAMERA = 2;


/** 
 * Returns the type of the animator.
 * For the AnimatorFollowPath, this will return 'followpath'.
 * @public
 */
ZICA.AnimatorFollowPath.prototype.getType = function()
{
	return 'followpath';
}


/** 
 * @private
 */
ZICA.AnimatorFollowPath.prototype.createClone = function()
{
	var a = new ZICA.AnimatorFollowPath({});
	a.TimeNeeded = this.TimeNeeded;
	a.LookIntoMovementDirection = this.LookIntoMovementDirection;
	a.OnlyMoveWhenCameraActive = this.OnlyMoveWhenCameraActive;
	a.PathToFollow = this.PathToFollow.slice();
	a.TimeDisplacement = this.TimeDisplacement;
	a.AdditionalRotation = this.AdditionalRotation;
	a.EndMode = this.EndMode;
	a.CameraToSwitchTo = this.CameraToSwitchTo;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Sets the options for animating the node along the path
 * @public
 * @param endmode {Number} Mode specifying what should happen when the end of the path has been reached.
 * Can be {@link ZICA.AnimatorFollowPath.EFPFEM_START_AGAIN} or {@link ZICA.AnimatorFollowPath.EFPFEM_STOP} 
 * @param timeNeeded {Number} Time in milliseconds needed for following the whole path, for example 10000 for 10 seconds.
 * @param lookIntoMovementDirection {Boolean} true if the node should look into the movement direction or false 
 * if not.
 * 
 */
ZICA.AnimatorFollowPath.prototype.setOptions = function(endmode, timeNeeded, lookIntoMovementDirection)
{
	this.EndMode = endmode;
	this.LookIntoMovementDirection = lookIntoMovementDirection;
	this.TimeNeeded = timeNeeded;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.SceneNode} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorFollowPath.prototype.animateNode = function(n, timeMs)
{
	var timeMs = Date.now();
	
	if (n == null || !this.TimeNeeded)
		return false;

	if (!(n === this.LastObject))
	{
		this.setNode(n);
		return false;
	}

	//this.linkWithPath();
		
	var changed = false;
	var cam = null;

	if (!this.StartTime)
	{
		// use start time of scene
		this.StartTime = Date.now();//this.Manager.getStartTime();
	}	

	var percentageDone = (timeMs - this.StartTime + this.TimeDisplacement) / this.TimeNeeded;

	// when path finished, do what set in settings
	if (percentageDone > 1.0)
	{
		switch(this.EndMode)
		{
		case ZICA.AnimatorFollowPath.EFPFEM_START_AGAIN:
			percentageDone = percentageDone % 1.0;
			break;
		case ZICA.AnimatorFollowPath.EFPFEM_STOP:
			percentageDone = 1.0;
			break;
		case ZICA.AnimatorFollowPath.EFPFEM_SWITCH_TO_CAMERA:
			percentageDone = 1.0;
			if (!this.SwitchedToNextCamera)
			{
				this.switchToNextCamera();
				this.SwitchedToNextCamera = true;
			}
			break;
		case 3: // EFPFEM_START_AGAIN_AND_DO_ACTION
			if (percentageDone > this.LastPercentageDoneActionFired + 1.0 && this.TheActionHandler != null)
			{
				this.TheActionHandler.execute(n);
				this.LastPercentageDoneActionFired = percentageDone;
			}
			percentageDone = percentageDone % 1.0;
			break;
		case 4: // EFPFEM_STOP_AND_DO_ACTION
			percentageDone = 1.0;
			if (!this.bActionFired && this.TheActionHandler != null)
			{
				this.TheActionHandler.execute(n);
				this.bActionFired = true;
			}
			break;
		}
	}
	else
		this.SwitchedToNextCamera = false;
	
	// advance node on path
	var q = percentageDone*(this.PathToFollow.length-1);
	
	var a = Math.floor(q);
	var b = Math.ceil(q);
	var percentage = q-a;
	
	var posA = this.PathToFollow[a];
	var posB = this.PathToFollow[b];
	
	var dir = posB.substract(posA);
	dir.multiplyThisWithScal(percentage);
	
	var pos = posA.add(dir);
	changed = !pos.equals(new ZICA.Vect2d(n.x,n.y));
	
	n.x = pos.X;
	n.y = pos.Y;
	
	if (this.LookIntoMovementDirection && this.PathToFollow.length)
	{
		// set lookat target of moving object
		dir.normalize();
		
		if(n.type == 'entity'){
			n.angle = Math.atan2(dir.X, -dir.Y)*180/Math.PI;
			n.angle += this.AdditionalRotation;
		}
				
	}			
	
	return changed;
}		

/**
* @private
*/
ZICA.AnimatorFollowPath.prototype.setNode = function(n)
{
	this.LastObject = n;

}

/**
 * @private
 */
ZICA.AnimatorFollowPath.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}
//////////////////////////////////////////////////////
//+ AnimatorFlyStraight
//////////////////////////////////////////////////////

/**
 * Scene node animator making {@link ZICA.Entity}s move along straight line between two points.
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class Scene node animator making {@link ZICA.Entity}s move along straight line between two points.
 * @param {ZICA.Vect2d} start Start 2d position of the line
 * @param {ZICA.Vect2d} end End 2d position of the line
 * @param {Number} timeForWay Time for moving along the whole line in milliseconds. For example 2000 for 2 seconds.
 * @param {Boolean} loop set to true for looping along the line, false for stopping movement when the end has been reached.
 * @param {Boolean} deleteMeAfterEndReached set to true if the animator should delete itself after the end has been reached.
 * @param {Boolean} animateCameraTargetInsteadOfPosition if the animated node is a camera, set to true to animate the camera target instead of the position of the camera.
 */
ZICA.AnimatorFlyStraight = function(obj)
{
	//start, end, timeforway, loop, deleteMeAfterEndReached, animateCameraTargetInsteadOfPosition
	
	this.Start = new ZICA.Vect2d(0,0);	
	this.End = new ZICA.Vect2d(40,40);
	this.StartTime = Date.now();//ZICA.CLTimer.getTime();
	this.TimeForWay = 3000;
	this.Loop = false;
	this.DeleteMeAfterEndReached = false;
	this.AnimateCameraTargetInsteadOfPosition = false;
	
	this.TestShootCollisionWithBullet = false;
	this.ShootCollisionNodeToIgnore = null;
	this.ShootCollisionDamage = 0;
	this.DeleteSceneNodeAfterEndReached = false;
	this.ActionToExecuteOnEnd = false;
	this.ExecuteActionOnEndOnlyIfTimeSmallerThen = 0;
	
	
	
		if(obj.Start)
		this.Start = obj.Start.clone();
		
		if(obj.End)
		this.End = obj.End.clone();
		
		if(obj.TimeForWay)
		this.TimeForWay = obj.TimeForWay;

		if(obj.Loop)
		this.Loop = obj.Loop;	
	
	
	this.recalculateImidiateValues();
	
	if (obj.deleteMeAfterEndReached)
		this.DeleteMeAfterEndReached = obj.deleteMeAfterEndReached;
	if (obj.animateCameraTargetInsteadOfPosition)
		this.AnimateCameraTargetInsteadOfPosition = obj.animateCameraTargetInsteadOfPosition;	
}		
ZICA.AnimatorFlyStraight.prototype = new ZICA.Animator();



/** 
 * Returns the type of the animator.
 * For the AnimatorFlyStraight, this will return 'flystraight'.
 * @public
 */
ZICA.AnimatorFlyStraight.prototype.getType = function()
{
	return 'flystraight';
}

/** 
 * @private
 */
ZICA.AnimatorFlyStraight.prototype.createClone = function()
{
	var a = new ZICA.AnimatorFlyStraight({});
	a.Start = this.Start.clone();
	a.End = this.End.clone();
	a.Vector = this.Vector.clone();
	a.WayLength = this.WayLength;
	a.TimeFactor = this.TimeFactor;
	a.TimeForWay = this.TimeForWay;
	a.Loop = this.Loop;
	a.AnimateCameraTargetInsteadOfPosition = this.AnimateCameraTargetInsteadOfPosition;
	a.DeleteSceneNodeAfterEndReached = this.DeleteSceneNodeAfterEndReached;
	a.ActionToExecuteOnEnd = this.ActionToExecuteOnEnd ? this.ActionToExecuteOnEnd.createClone() : null;
	a.ExecuteActionOnEndOnlyIfTimeSmallerThen = this.ExecuteActionOnEndOnlyIfTimeSmallerThen;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorFlyStraight.prototype.animateNode = function(n, event)
{
	var timeMs = Date.now();
	
	var t = (timeMs-this.StartTime);
	var endReached = false;

	if (t != 0)
	{
		var pos = this.Start.clone();

		if (!this.Loop && t >= this.TimeForWay)
		{
			pos = this.End.clone();
			endReached = true;
		}
		else
		{
			pos.addToThis(this.Vector.multiplyWithScal( (t % this.TimeForWay) * this.TimeFactor));
		}
			
		if (this.AnimateCameraTargetInsteadOfPosition)
		{
			/* if (n.getType() == 'camera')
			{
				n.setTarget(pos);
				
				var animfps = n.getAnimatorOfType('camerafps');
				if (animfps != null)
					animfps.lookAt(pos);
			} */
		}
		else
		{
			//n.Pos = pos;
			n.x = pos.X;
			n.y = pos.Y;
		}
		
		if (this.TestShootCollisionWithBullet && this.StartTime != timeMs)  // the node must not be in the exact same frame it was created in,
																			// otherwise, we risk an endless loop if the bullet is shot in the onHit handler
		{
			endReached = this.doShootCollisionTest(n) || endReached;
		}
		
		if (endReached)
		{
			/* if (n.scene)
				n.scene.LastBulletImpactPosition = n.Pos.clone();
						
			if (this.ActionToExecuteOnEnd)
			{
				var runAction = true;
				if (this.ExecuteActionOnEndOnlyIfTimeSmallerThen > 0 && t > this.ExecuteActionOnEndOnlyIfTimeSmallerThen)
					runAction = false;
				
				if (runAction)
					this.ActionToExecuteOnEnd.execute(n);
			} */
				
			if (this.DeleteMeAfterEndReached)
				n.removeAnimator(this);
				
			/* if (this.DeleteSceneNodeAfterEndReached && n.scene)
				n.scene.addToDeletionQueue(n, 0); */
		}
		
		return true;
	}
	
	return false;
}	

/**
 * @private
 */
ZICA.AnimatorFlyStraight.prototype.doShootCollisionTest = function(bulletNode)	
{
	if (!bulletNode)
		return false;

	bulletNode.updateAbsolutePosition();
	var box = bulletNode.getTransformedBoundingBox();

	var hit = false;

	var nodes = bulletNode.scene.getAllSceneNodesWithAnimator('gameai');

	for (var i=0; i<nodes.length; ++i)
	{				
		if (nodes[i] === this.ShootCollisionNodeToIgnore)
			continue;
			
		var enemyAI = nodes[i].getAnimatorOfType('gameai');

		if (enemyAI && !enemyAI.isAlive()) // don't test collision against dead items
			continue;

		if (box.intersectsWithBox(nodes[i].getTransformedBoundingBox()))
		{
			// hit found
			enemyAI.OnHit(this.ShootCollisionDamage, nodes[i]);
			hit = true;
			break;
		}
	}

	return hit;
}

/**
 * @private
 */
ZICA.AnimatorFlyStraight.prototype.recalculateImidiateValues = function()
{
	this.Vector = this.End.substract(this.Start);
	this.WayLength = this.Vector.getLength();
	this.Vector.normalize();
	this.TimeFactor = this.WayLength / this.TimeForWay;
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorCameraFollow
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorCameraFollow = function(obj)
{
	//this.delay  = obj.Delay;
	this.StartTime = Date.now();
	
}		
ZICA.AnimatorCameraFollow.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorCameraFollow, this will return 'camerafollow'.
 * @private
 */
ZICA.AnimatorCameraFollow.prototype.getType = function()
{
	return 'camerafollow';
}

/** 
 * @private
 */
ZICA.AnimatorCameraFollow.prototype.createClone = function()
{
	var a = new ZICA.AnimatorCameraFollow({});
	//a.delay = this.delay;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorCameraFollow.prototype.animateNode = function(n, event)
{
	var timeMs = Date.now();
	var t = (timeMs-this.StartTime);

	//if(this.et >= this.delay)
		
		Game.scene.x = n.x + n.width/2;
		Game.scene.y = n.y + n.height/2;	
	
}

//////////AnimatorOnClick////////////////////////
/**
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class  Scene node animator which invokes actons when the scene node has been clicked.
 * @param scene {ZICA.Scene} The scene of the animator.
 * @param engine {ZICA} an instance of the 2d engine
 * @param register {Boolean} (optional) set to true to prevent registering at the scene using registerSceneNodeAnimatorForEvents
 */
ZICA.AnimatorOnClick = function(obj)
{
	this.Registered = false;
	this.Occluded = obj.NoClickWhenOccluded; 
	this.TheActionHandler = obj.Action;

}		
ZICA.AnimatorOnClick.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnClick, this will return 'onclick'.
 * @public
 */
ZICA.AnimatorOnClick.prototype.getType = function()
{
	return 'onclick';
}


/** 
 * @private
 */
ZICA.AnimatorOnClick.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnClick();
	a.BoundingBoxTestOnly = this.BoundingBoxTestOnly;
	a.CollidesWithWorld = this.CollidesWithWorld;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnClick.prototype.animateNode = function(n, timeMs)
{
	var done = this.Registered;
	this.Registered = false;
	return done;
}

/**
 * @private
 */
ZICA.AnimatorOnClick.prototype.onClick = function(event , n) 
{	
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnClick.prototype.checkOccluded = function(n,event){
	
	if(!this.Occluded)return false;
	
	var i;
	if(n.isScene)i = 0;
	else i = Game.entityList.indexOf(n) + 1;
	
	for (var _i = i, _a = Game.entityList; _i < _a.length; _i++) {
	 
			var ent_1 = _a[_i];
			var flag = Game.pointInBox(event,ent_1);
			
			if(flag && (ent_1.priority >= n.priority || n.isScene))
				return true;
	}
	
	return false;
}

/**
 * @private
 */
ZICA.AnimatorOnClick.prototype.invokeAction = function(node)
{
	if (this.TheActionHandler)
		this.TheActionHandler.execute(node);
}

/**
 * @private
 */
ZICA.AnimatorOnClick.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnFirstFrame
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnFirstFrame = function(obj)
{
	this.TheActionHandler = obj.Action;
	
}		
ZICA.AnimatorOnFirstFrame.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnFirstFrame, this will return 'onfirstframe'.
 * @private
 */
ZICA.AnimatorOnFirstFrame.prototype.getType = function()
{
	return 'onfirstframe';
}

/** 
 * @private
 */
ZICA.AnimatorOnFirstFrame.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnFirstFrame({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnFirstFrame.prototype.animateNode = function(n, event)
{	
	if(Game.scene.firstFrame)
		if (this.TheActionHandler)
			this.TheActionHandler.execute(n);
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnEveryFrame
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnEveryFrame = function(obj)
{
	this.TheActionHandler = obj.Action;
	
}		
ZICA.AnimatorOnEveryFrame.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnEveryFrame, this will return 'oneveryframe'.
 * @private
 */
ZICA.AnimatorOnEveryFrame.prototype.getType = function()
{
	return 'oneveryframe';
}

/** 
 * @private
 */
ZICA.AnimatorOnEveryFrame.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnEveryFrame({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnEveryFrame.prototype.animateNode = function(n, event)
{
	if (this.TheActionHandler)
	this.TheActionHandler.execute(n);
}


//////////AnimatorOnMouse////////////////////////
/**
 * @constructor
 * @public
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnMouse = function(obj)
{
	this.Registered = false;
	this.Occluded = obj.NoClickWhenOccluded;
	this.type = obj.MouseEvent;
	this.TheActionHandler = obj.Action;

}		
ZICA.AnimatorOnMouse.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnMouseAnimatorOnMouse, this will return 'onmouse'.
 * @public
 */
ZICA.AnimatorOnMouse.prototype.getType = function()
{
	return 'onmouse';
}


/** 
 * @private
 */
ZICA.AnimatorOnMouse.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnMouse({});
	a.type = this.type;
	a.CollidesWithWorld = this.CollidesWithWorld;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnMouse.prototype.animateNode = function(n, timeMs)
{
	var done = this.Registered;
	this.Registered = false;
	return done;
}

/**
 * @private
 */
ZICA.AnimatorOnMouse.prototype.onClick = function(event , n) 
{	
	if(this.type != 'Mouse Click')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseDown = function(event , n) 
{	
	if(this.type != 'Mouse Down')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseUp = function(event , n) 
{	
	if(this.type != 'Mouse Up')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseOver = function(event , n) 
{	
	if(this.type != 'Mouse Over')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseOut = function(event , n) 
{	
	if(this.type != 'Mouse Out')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.checkOccluded = function(n,event){
	
	if(!this.Occluded)return false;
	
	var i;
	if(n.isScene)i = 0;
	else i = Game.entityList.indexOf(n) + 1;
	
	for (var _i = i, _a = Game.entityList; _i < _a.length; _i++) {
	 
			var ent_1 = _a[_i];
			var flag = Game.pointInBox(event,ent_1);
			
			if(flag && (ent_1.priority >= n.priority || n.isScene))
				return true;
	}
	
	return false;
}

/**
 * @private
 */
ZICA.AnimatorOnMouse.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

//////////AnimatorOnKey////////////////////////
/**
 * @public
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnKey = function(obj)
{
	this.Registered = false; 
	//this.KeyCode = Number('0x' + (ZICA.Keys.indexOf(obj.Key) + 1));
	this.Key = obj.Key;
	this.KeyEvent = obj.KeyEvent;
	this.TheActionHandler = obj.Action;

}		
ZICA.AnimatorOnKey.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnKey, this will return 'onkey'.
 * @public
 */
ZICA.AnimatorOnKey.prototype.getType = function()
{
	return 'onkey';
}


/** 
 * @private
 */
ZICA.AnimatorOnKey.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnKey({});
	a.Key = this.Key;
	a.KeyEvent = this.KeyEvent;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnKey.prototype.animateNode = function(n, event)
{
	var done = this.Registered;
	this.Registered = false;
	return done;
}

/**
 * @private
 */
ZICA.AnimatorOnKey.prototype.onKeyUp = function(event , n) 
{	
	this.Registered = true;
	
	if(this.KeyEvent != 'Key Pressed Up')return;
	if(Game.Keys[this.Key.toLowerCase()] != event.which)return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnKey.prototype.onKeyDown = function(event , n) 
{	
	this.Registered = true;
	
	if(this.KeyEvent != 'Key Pressed Down')return;
	if(Game.Keys[this.Key.toLowerCase()] != event.which)return;
	
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnKey.prototype.onKeyPress = function(event , n) 
{	
	this.Registered = true;
	
	if(this.KeyEvent != 'Key Pressed')return;
	if(Game.Keys[this.Key.toLowerCase()] != event.which)return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

/**
 * @private
 */
ZICA.AnimatorOnKey.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Timer animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorTimer = function(obj)
{
	this.TimeLastTimed = 0;
	this.TheActionHandler = obj.Action;
	this.TickEverySeconds = obj.IntervalMS;
	this.TimeLastTimed = Date.now();//ZICA.CLTimer.getTime();
}		
ZICA.AnimatorTimer.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorTimer, this will return 'timer'.
 * @private
 */
ZICA.AnimatorTimer.prototype.getType = function()
{
	return 'timer';
}

/** 
 * @private
 */
ZICA.AnimatorTimer.prototype.createClone = function()
{
	var a = new ZICA.AnimatorTimer({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.TimeLastTimed = this.TimeLastTimed;
	a.TickEverySeconds = this.TickEverySeconds;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorTimer.prototype.animateNode = function(n, event)
{
	var timeMs = event.timeElapsed;
	
	if (n == null)
		return false;

	if (this.TickEverySeconds > 0)
	{
		var now = Date.now();//ZICA.CLTimer.getTime();

		if (now - this.TimeLastTimed > this.TickEverySeconds)
		{
			this.TimeLastTimed = now;
			
			if (this.TheActionHandler)
				this.TheActionHandler.execute(n);					
			return true;
		}
	}	
	return false;
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnProximity
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnProximity = function(obj)
{
	this.NodeInside = false;
	this.NodesInside = [];
	
	this.TheActionHandler = obj.Action;
	this.NearToNodes = obj.NearToNodes;
	this.TriggeredWhen = obj.TriggeredWhen;
	
	//'Leaves Radius','Enters Radius'
}		
ZICA.AnimatorOnProximity.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnProximity, this will return 'onproximity'.
 * @private
 */
ZICA.AnimatorOnProximity.prototype.getType = function()
{
	return 'onproximity';
}

/** 
 * @private
 */
ZICA.AnimatorOnProximity.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnProximity({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.NearToNodes = this.NearToNodes;
	a.TriggeredWhen = this.TriggeredWhen;
	a.NodeInside = this.NodeInside;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnProximity.prototype.animateNode = function(n, event)
{
	
	if(this.TriggeredWhen != 'Leaves Radius')return;
	
	if(this.NodeInside){
		
		for (var _i = 0, _a = Game.entityList; _i < _a.length; _i++) {
			var ent = _a[_i];
			
			if(ent != n)
				if(ZICA.boxIntersection(n,ent))return;	
		}
		
		
		if (this.TheActionHandler)
			this.TheActionHandler.execute(n);
		
		this.NodeInside = false;
		
	}
}

ZICA.AnimatorOnProximity.prototype.onCollision = function(event , n)
{
	
	this.NodeInside = true;
	
	if(this.TriggeredWhen != 'Enters Radius')return;
	
	if(this.NearToNodes != null)
	if(event.other.name != this.NearToNodes) return;
	
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);	
		
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnProximity
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnProximity = function(obj)
{
	this.NodeInside = false;
	this.NodesInside = [];
	
	this.TheActionHandler = obj.Action;
	this.NearToNodes = obj.NearToNodes;
	
	this.TriggeredWhen = obj.TriggeredWhen;
	
	//'Leaves Radius','Enters Radius'
}		
ZICA.AnimatorOnProximity.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnProximity, this will return 'onproximity'.
 * @private
 */
ZICA.AnimatorOnProximity.prototype.getType = function()
{
	return 'onproximity';
}

/** 
 * @private
 */
ZICA.AnimatorOnProximity.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnProximity({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.NearToNodes = this.NearToNodes;
	a.TriggeredWhen = this.TriggeredWhen;
	a.NodeInside = this.NodeInside;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnProximity.prototype.animateNode = function(n, event)
{
	
	if(this.TriggeredWhen != 'Leaves Radius')return;
	
	if(this.NodeInside){
		
		var ent = Game.getEntityById(this.NearToNodes);
		if(!ent)return;
		
		if(ZICA.boxIntersection(n,ent))return;
		
		if (this.TheActionHandler)
			this.TheActionHandler.execute(n);
		
		this.NodeInside = false;
		
	}
}

ZICA.AnimatorOnProximity.prototype.onCollision = function(event , n)
{
	
	this.NodeInside = true;
	
	if(this.TriggeredWhen != 'Enters Radius')return;
	
	//if(this.NearToNodes != null)
	//if(event.other.name != this.NearToNodes) return;
	if(event.other.__guid != this.NearToNodes) return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);	
		
}
/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorCollisionResponse
/////////////////////////////////////////////////////////////////////////////////////////

ZICA.AnimatorCollisionResponse = function(obj)
{
	this.AffectedByGravity = obj.AffectedByGravity;
	this.Node = null;
	this.LastAnimationTime = null;
	this.LastPosition = new ZICA.Vect2d(0,0);
	this.Falling = false;
	this.FallStartTime = 0;
	this.JumpForce = 0;
		
	this.reset();
}		
ZICA.AnimatorCollisionResponse.prototype = new ZICA.Animator();

/** 
 * Returns the type of the animator.
 * For the AnimatorCollisionResponse, this will return 'collisionresponse'.
 * @public
 */
ZICA.AnimatorCollisionResponse.prototype.getType = function()
{
	return 'collisionresponse';
}

/** 
 * @private
 */
ZICA.AnimatorCollisionResponse.prototype.createClone = function()
{
	var a = new ZICA.AnimatorCollisionResponse({});
	//a.Radius = this.Radius.clone();
	a.AffectedByGravity = this.AffectedByGravity;
	return a;
}


/**
 * Resets the collision system. Use this for example to make it possible to set a scene node postition
 * while moving through walls: Simply change the position of the scene node and call reset() to this
 * animator afterwards.
 * @public
 */
ZICA.AnimatorCollisionResponse.prototype.reset = function()
{
	this.Node = null;
	this.LastAnimationTime = Date.now();//ZICA.CLTimer.getTime();
}	

/**
 * Returns if the scene node attached to this animator is currently falling
 * @public
 */
ZICA.AnimatorCollisionResponse.prototype.isFalling = function()
{
	return this.Falling;
}	

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorCollisionResponse.prototype.animateNode = function(n, timeMs)
{
	var timeMs = Date.now();
	var difftime = (timeMs-this.LastAnimationTime);
		
	if (difftime > 150) difftime = 150;
	if (difftime == 0)
		return false;	
		
	this.LastAnimationTime = timeMs;
	
	if (!(this.Node === n))
	{
		this.Node = n;
		this.LastPosition = new ZICA.Vect2d(n.x,n.y);//n.Pos.clone();
		return false;
	}
	
	//var velY = -Game.scene.gravity;
	
	var changed = Math.abs(this.LastPosition.Y - n.y)>0.5;
	
	if (this.JumpForce > 0)
	{
		n.y -= (this.JumpForce * 0.001 * difftime);
			
		this.JumpForce -= difftime;
		if (this.JumpForce < 0) this.JumpForce = 0;		
	}
	
	if(this.AffectedByGravity)
		n.physicType = 'dynamic';
	else
		n.physicType = 'kinematic';
	
	//n.velY = -velY;
	
	if(changed){
		if (!this.Falling)
				this.FallStartTime = timeMs;
		this.Falling = true;
	}
	else {
		
		this.Falling = false;
	}
	
	this.LastPosition = new ZICA.Vect2d(n.x,n.y);
	
	return false;
}		
/** 
 * @private
 */
ZICA.AnimatorCollisionResponse.prototype.jump = function(jumpspeed)
{
	if (this.JumpForce == 0)
		this.JumpForce = jumpspeed * 100;
}
ZICA.AnimatorCollisionResponse.prototype.onCollision = function(event , n)
{
	//0up 1down 2left 3right
	
	Game.resolveElastic(n,event.other);
	
}
/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorCollide
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorCollide = function(obj)
{
	//this.NodeInside = false;
	
}		
ZICA.AnimatorCollide.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorCollide, this will return 'collide'.
 * @private
 */
ZICA.AnimatorCollide.prototype.getType = function()
{
	return 'collide';
}

/** 
 * @private
 */
ZICA.AnimatorCollide.prototype.createClone = function()
{
	var a = new ZICA.AnimatorCollide({});
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorCollide.prototype.animateNode = function(n, event)
{
	
}

ZICA.AnimatorCollide.prototype.onCollision = function(event , n)
{
	n.x = n.prevX;
	n.y = n.prevY;		
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorPhysicsEngine
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorPhysicsEngine = function(obj)
{
	this.shape = obj.Shape;
	this.mass = obj.Mass;
	this.position = obj.Position;
	this.size = obj.Size;
	this.autoSize = obj.autoSize;
	this.radius = obj.Radius;
	this.length = obj.length;
	
}		
ZICA.AnimatorPhysicsEngine.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorPhysicsEngine, this will return 'physicsengine'.
 * @private
 */
ZICA.AnimatorPhysicsEngine.prototype.getType = function()
{
	return 'physicsengine';
}

/** 
 * @private
 */
ZICA.AnimatorPhysicsEngine.prototype.createClone = function()
{
	var a = new ZICA.AnimatorPhysicsEngine({});
	a.shape = this.shape;
	a.mass = this.mass;
	a.position = this.position;
	a.size = this.size;
	a.autoSize = this.autoSize;
	a.radius = this.radius;
	a.length = this.length;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorPhysicsEngine.prototype.animateNode = function(n, event)
{
	if(!n.body){
		
		if(this.autoSize){
			this.size = new ZICA.Vect2d(n.width,n.height);
			this.radius = Math.min(n.width,n.height);
			this.length = Math.max(n.width,n.height);	
		}
		
		n.body = new p2.Body({
		mass: this.mass,
		position: [n.x + this.position.X  , n.y + this.position.Y],
		angle: n.angle*Math.PI/180
		});	
		
		var shape;
		
		if(this.shape ==  "Circle")
			shape = new p2.Circle({ radius: this.radius });
		if(this.shape ==  "Box")
			shape = new p2.Box({ width: this.size.X, height: this.size.Y });
		if(this.shape ==  "Capsule")
			shape = new p2.Capsule({ radius: this.radius, length: this.length });

		if(shape)n.body.addShape(shape);
		
		Game.scene.world.addBody(n.body);
		
		
	}else{
		
		n.x = n.body.position[0];
		n.y = n.body.position[1];
		
		n.angle = n.body.angle*180/Math.PI;
	}
	
}

///////////////////////////////////////////////////////
// AnimatorAnimateTexture
///////////////////////////////////////////////////////

ZICA.AnimatorAnimateTexture = function(obj)//textures, timeperframe, donotloop)
{
	this.MyStartTime = Date.now();//0;
	
	this.Textures = obj.Textures;
	this.TimePerFrame = obj.TimePerFrame;
	this.Loop = obj.Loop;

}
	
ZICA.AnimatorAnimateTexture.prototype = new ZICA.Animator();

/** 
 * Returns the type of the animator.
 * For the AnimatorAnimateTexture, this will return 'animatetexture'.
 * @public
 */
ZICA.AnimatorAnimateTexture.prototype.getType = function()
{
	return 'animatetexture';
}

/** 
 * @private
 */
ZICA.AnimatorAnimateTexture.prototype.createClone = function()
{
	var a = new ZICA.AnimatorAnimateTexture({});
	a.Textures = this.Textures;
	a.Loop = this.Loop;
	a.TimePerFrame = this.TimePerFrame;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorAnimateTexture.prototype.animateNode = function(n, event)
{
	if (n == null || this.Textures == null)
		return false;
		
	var changedSomething = false;
	var timeMs = Date.now();//event.timeElapsed;
	
	if (this.Textures.length)
	{
		var startTime = (this.MyStartTime == 0) ? 0 : this.MyStartTime;
		
		var t = (timeMs - startTime);
		var endTime = startTime + (this.TimePerFrame * this.Textures.length);

		var idx = 0;
		if (!this.Loop && timeMs >= endTime)
			idx = this.Textures.length - 1;
		else
		{
			if (this.TimePerFrame > 0)
				idx = Math.floor((t/this.TimePerFrame) % this.Textures.length);
			else
				idx = 0;
		}

		if (idx < this.Textures.length)
		{
			n.image = this.Textures[idx];
			changedSomething = true;
		}
	}
	
	return changedSomething;
}

/** 
 * @private
 */
ZICA.AnimatorAnimateTexture.prototype.reset = function()
{
	this.MyStartTime = Date.now();
}

