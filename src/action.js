
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------
// Action 
// ---------------------------------------------------------------------
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


/**
 * @constructor
 * @private
 */
ZICA.Action = function()
{
}

/**
 * @private
 */
ZICA.Action.prototype.execute = function(node)
{
}

/**
 * @private
 */
ZICA.Action.prototype.createClone = function()
{
	return null;
}

/////////ActionHandler//////////

/**
 * @constructor
 * @private
 * @class
 */
ZICA.ActionHandler = function(array) //,scene
{
	if(!array)array = [];
	
	this.Actions = array;
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.execute = function(node)
{
	for (var i=0; i<this.Actions.length; ++i)
	{
		 this.Actions[i].execute(node);
	}
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.addAction = function(a)
{
	if (a == null)
		return;
		
	this.Actions.push(a);
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.findAction = function(type)
{
	for (var i=0; i<this.Actions.length; ++i)
	{
		var a = this.Actions[i];
		if (a.Type == type)
			return a;
	}
	
	return null;
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.createClone = function()
{
	var c = new ZICA.ActionHandler();
	
	for (var i=0; i<this.Actions.length; ++i)
	{
		var a = this.Actions[i];
		if (a.createClone != null)
			c.addAction(a.createClone());
	}
	
	return c;
}


// ---------------------------------------------------------------------
// Action ExecuteJavaScript
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ExecuteJavaScript = function(obj)
{
	this.Type = 'ExecuteJavaScript';	
	this.JScript = obj.JavaScript;
}

/**
 * @private
 */
ZICA.Action.ExecuteJavaScript.prototype.createClone = function()
{
	var a = new ZICA.Action.ExecuteJavaScript();
	a.JScript = this.JScript;
	return a;
}

/**
 * @private
 */
ZICA.Action.ExecuteJavaScript.prototype.execute = function(currentNode)
{
	this.eval.call(currentNode,this.JScript);
	
}

/**
 * @private
 */
ZICA.Action.ExecuteJavaScript.prototype.eval = function(JScript)
{
	eval(JScript);
}

// ---------------------------------------------------------------------
// Action MakeSceneNodeInvisible
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.MakeSceneNodeInvisible = function(obj)
{
	this.InvisibleMakeType = ['Make Invisible' , 'Make Visible' , 'Toggle Visiblilty'].indexOf(obj.InvisibleMakeType);
	this.SceneNodeToMakeInvisible = obj.SceneNodeToMakeInvisible;
	this.ChangeCurrentSceneNode = obj.SceneNodeToMakeInvisible == null;
	this.Type = 'MakeSceneNodeInvisible';	
}

/**
 * @private
 */
ZICA.Action.MakeSceneNodeInvisible.prototype.createClone = function()
{
	var a = new ZICA.Action.MakeSceneNodeInvisible({});
	a.InvisibleMakeType = this.InvisibleMakeType;
	a.SceneNodeToMakeInvisible = this.SceneNodeToMakeInvisible;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.MakeSceneNodeInvisible.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToMakeInvisible != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToMakeInvisible);

	if (nodeToHandle)
	{
		switch(this.InvisibleMakeType)
		{
		case 0: //EIT_MAKE_INVISIBLE:
			nodeToHandle.visible = false;
			break;
		case 1: //EIT_MAKE_VISIBLE:
			nodeToHandle.visible = true;
			break;
		case 2: //EIT_TOGGLE_VISIBILITY:
			{
				nodeToHandle.visible = !nodeToHandle.visible;
			}
			break;
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeScale
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodeScale = function(obj)
{
	this.Type = 'ChangeSceneNodeScale';	
	
	switch(obj.ScaleChangeType)
	{
		case 'Set absoulte scale':
		this.ScaleChangeType = 0;
		break;
		case 'Scale by the vector' :
		this.ScaleChangeType = 1;
		break;
		case 'Set relative scale':
		this.ScaleChangeType = 2;
		break;
	}
	
	this.SceneNodeToChangeScale = obj.SceneNodeToChangeScale;
	if(obj.SceneNodeToChangeScale == null)this.ChangeCurrentSceneNode = true;
	this.Size = obj.Size.clone();
}	

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeScale.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodeScale({});
	a.ScaleChangeType = this.ScaleChangeType;
	a.SceneNodeToChangeScale = this.SceneNodeToChangeScale;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Size = this.Size.clone();
		
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeScale.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeScale != -1)
		nodeToHandle =  Game.getEntityById(this.SceneNodeToChangeScale);

	if (nodeToHandle)
	{
		switch(this.ScaleChangeType)
		{
		case 0: //EIT_ABSOLUTE_SCALE:
			nodeToHandle.width = this.Size.X;
			nodeToHandle.height = this.Size.Y;
			break;
		case 1: //MULTIPLY_SCALE:
			nodeToHandle.width *= this.Size.X;
			nodeToHandle.height *= this.Size.Y;
			break;
		case 2: //EIT_RELATIVE_SCALE:
			nodeToHandle.width += this.Size.X;
			nodeToHandle.height += this.Size.Y;
			break;

		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeRotation
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodeRotation = function(obj)
{
	this.Type = 'ChangeSceneNodeRotation';
	
	this.RotationChangeType = obj.RotationChangeType == 'Set absoulte rotation'? 0: 1; 
	this.SceneNodeToChangeRotation = obj.SceneNodeToChangeRotation;
	if(obj.SceneNodeToChangeRotation == null)this.ChangeCurrentSceneNode = true;
	this.Angle = obj.Angle;
	this.RotateAnimated = obj.RotateAnimated;
	this.TimeNeededForRotationMs = obj.TimeNeededForRotationMs;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeRotation.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodeRotation({});
	a.RotationChangeType = this.RotationChangeType;
	a.SceneNodeToChangeRotation = this.SceneNodeToChangeRotation;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Angle = this.Angle;
	a.RotateAnimated = this.RotateAnimated;
	a.TimeNeededForRotationMs = this.TimeNeededForRotationMs;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeRotation.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeRotation != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChangeRotation);

	if (nodeToHandle)
	{
		var finalRot = null;
		
		switch(this.RotationChangeType)
		{
		case 0://EIT_ABSOLUTE_ROTATION:
			finalRot = this.Angle;
			break;
		case 1://EIT_RELATIVE_ROTATION:
			finalRot = nodeToHandle.angle + this.Angle;
			break;
		}
		
		if (finalRot)
		{
			if (!this.RotateAnimated)
			{
				// not animated, set rotation directly
				nodeToHandle.angle = finalRot;
			}
			else
			{
				// rotate animated to target TO DO!!!
				var anim = new ZICA.AnimatorRotation({});
				anim.setRotateToTargetAndStop(finalRot, nodeToHandle.angle, this.TimeNeededForRotationMs);
										
				nodeToHandle.addAnimator(anim);
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodePosition
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodePosition = function(obj)
{
	this.UseAnimatedMovement = obj.UseAnimatedMovement;//false;
	this.TimeNeededForMovementMs = obj.TimeNeededForMovementMs //false;
	
	this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
	if(obj.SceneNodeToChangePosition == null)this.ChangeCurrentSceneNode = true;
	
	
	if(obj.PositionChangeType == 0){
		this.PositionChangeType = 0;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Position.clone();
	}
	
	if(obj.PositionChangeType == 1){
		this.PositionChangeType = 1;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Vector.clone();
	}
	
	if(obj.PositionChangeType == 2){
		this.PositionChangeType = 2;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Position.clone();
		this.SceneNodeRelativeTo = obj.SceneNodeRelativeTo;
		if(obj.SceneNodeRelativeTo == null)this.RelativeToCurrentSceneNode = true;
	}
	
	if(obj.PositionChangeType == 3){
		this.PositionChangeType = 3;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Percentage.clone();
		this.SceneNodeRelativeTo = obj.SceneNodeRelativeTo;
		if(obj.SceneNodeRelativeTo == null)this.RelativeToCurrentSceneNode = true;
	}
	
	if(obj.PositionChangeType == 4){
		this.PositionChangeType = 4;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.MinPosition.clone();
		this.Area3DEnd = obj.MaxPosition.clone();
	}
	
	if(obj.PositionChangeType == 5){
		this.PositionChangeType = 5;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
	}
	
	if(obj.PositionChangeType == 6){
		this.PositionChangeType = 6;
		this.Vector = obj.Vector;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
	}

	this.Type = 'ChangeSceneNodePosition';	
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePosition.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodePosition({});
	a.PositionChangeType = this.PositionChangeType;
	a.SceneNodeToChangePosition = this.SceneNodeToChangePosition;
	a.SceneNodeRelativeTo = this.SceneNodeRelativeTo;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.RelativeToCurrentSceneNode = this.RelativeToCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	a.Area3DEnd = this.Area3DEnd ? this.Area3DEnd.clone() : null;
	a.UseAnimatedMovement = this.UseAnimatedMovement;
	a.TimeNeededForMovementMs = this.TimeNeededForMovementMs;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePosition.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangePosition != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChangePosition);

	if (nodeToHandle)
	{
		var finalpos = null;
		
		switch(this.PositionChangeType)
		{
		case 0: //EIT_ABSOLUTE_POSITION:
			finalpos = this.Vector.clone();
			break;
		case 1://EIT_RELATIVE_POSITION:
			finalpos = new ZICA.Vect2d(nodeToHandle.x + this.Vector.X,nodeToHandle.y + this.Vector.Y);
			break;
		case 2://EIT_RELATIVE_TO_SCENE_NODE:
			{
				var nodeRelativeTo = null;
				if (this.RelativeToCurrentSceneNode)
					nodeRelativeTo = currentNode;
				else
				if (this.SceneNodeRelativeTo != -1)
					nodeRelativeTo = Game.getEntityById(this.SceneNodeRelativeTo);

				if (nodeRelativeTo)
					finalpos = new ZICA.Vect2d(nodeRelativeTo.x + this.Vector.X,nodeRelativeTo.y + this.Vector.Y);
			}
			break;
		case 3: //EIT_RELATIVE_IN_FACING_DIRECTION:
			{
				var nodeRelativeTo = null;
				if (this.RelativeToCurrentSceneNode)
					nodeRelativeTo = Game;
				else
				if (this.SceneNodeRelativeTo != -1)
					nodeRelativeTo = Game.getEntityById(this.SceneNodeRelativeTo);

				if (nodeRelativeTo)
					finalpos = new ZICA.Vect2d(nodeRelativeTo.x + nodeRelativeTo.width*this.Vector.X/100, nodeRelativeTo.y + nodeRelativeTo.height*this.Vector.Y/100);
			}
			break;
		case 4: //EIT_RANDOM_POSITION:
			{
				
				finalpos = new ZICA.Vect2d();
				finalpos.X = this.Vector.X + (Math.random() * (this.Area3DEnd.X - this.Vector.X));
				finalpos.Y = this.Vector.Y + (Math.random() * (this.Area3DEnd.Y - this.Vector.Y));
				
			}
			break;
		case 5: //EIT_RELATIVE_TO_LAST_BULLET_IMPACT:
			{	
				finalpos = new ZICA.Vect2d(Game.controls.mouse.x,Game.controls.mouse.y);
			}
			break;
		case 6: //EIT_RELATIVE_TO_LAST_BULLET_IMPACT:
			{	
				if(Game.scene.lastBulletImpact)
				finalpos = new ZICA.Vect2d(Game.scene.lastBulletImpact.X + this.Vector.X,Game.scene.lastBulletImpact.Y + this.Vector.Y);
			}
			break;
		}
		
		if (finalpos != null)
		{
			if (this.UseAnimatedMovement && this.TimeNeededForMovementMs > 0)
			{
				// move animated to target TO DO !!!
				var anim = new ZICA.AnimatorFlyStraight({});
				anim.Start = new ZICA.Vect2d(nodeToHandle.x,nodeToHandle.y);
				anim.End = finalpos;
				anim.TimeForWay = this.TimeNeededForMovementMs;
				anim.DeleteMeAfterEndReached = true;
				anim.recalculateImidiateValues();
				
				nodeToHandle.addAnimator(anim);
			}
			else
			{
				// set position directly
				nodeToHandle.x = finalpos.X;
				nodeToHandle.y = finalpos.Y;
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeProperty
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodeProperty = function(obj)
{
	this.Type = 'ChangeSceneNodeProperty';	
	
	this.SceneNodeToChange = obj.SceneNodeToChange;
	if(obj.SceneNodeToChange == null)this.ChangeCurrentSceneNode = true;
	this.Property = obj.Property;
	this.Value = obj.Value;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeProperty.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodeProperty({});
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Property = this.Property;
	a.Value = this.Value;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeProperty.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		nodeToHandle[this.Property] = this.Value;
	}
}


// ---------------------------------------------------------------------
// Action ChangeSceneNodePropertyFromNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodePropertyFromNode = function(obj)
{
	this.Type = 'ChangeSceneNodePropertyFromNode';	
	
	this.SceneNodeToChange = obj.SceneNodeToChange;
	if(obj.SceneNodeToChange == null)this.ChangeCurrentSceneNode = true;
	this.Property = obj.Property;
	this.SceneNodeFrom = obj.SceneNodeFrom;
	if(obj.SceneNodeFrom == null)this.FromCurrentSceneNode = true;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyFromNode.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodePropertyFromNode({});
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.SceneNodeFrom = this.SceneNodeFrom;
	a.FromCurrentSceneNode = this.FromCurrentSceneNode;
	a.Property = this.Property;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyFromNode.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeFrom = null;
	if (this.FromCurrentSceneNode)
		nodeFrom = currentNode;
	else
	if (this.SceneNodeFrom != -1)
		nodeFrom = Game.getEntityById(this.SceneNodeFrom);


	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		nodeToHandle[this.Property] = nodeFrom[this.Property];
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodePropertyVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodePropertyVariable = function(obj)
{
	this.Type = 'ChangeSceneNodePropertyVariable';	
	
	this.SceneNodeToChange = obj.SceneNodeToChange;
	if(obj.SceneNodeToChange == null)this.ChangeCurrentSceneNode = true;
	this.Property = obj.Property;
	this.Variable = obj.Variable;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodePropertyVariable({});
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Property = this.Property;
	a.Variable = this.Variable;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyVariable.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		if(Game.hasVariable(this.Variable))
		nodeToHandle[this.Property] = Game.getVariable(this.Variable);
	}
}

// ---------------------------------------------------------------------
// Action ActionRestartScene
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.SwitchToScene = function(obj)
{
	this.Scene = obj.SceneId;//obj.Scene;
	this.ResetScene = obj.ResetScene;
	this.Type = 'SwitchToScene';	
}

/**
 * @private
 */
ZICA.Action.SwitchToScene.prototype.createClone = function()
{
	var a = new ZICA.Action.SwitchToScene({});
	a.Scene = this.Scene;
	a.ResetScene = this.ResetScene;
	return a;
}

/**
 * @private
 */
ZICA.Action.SwitchToScene.prototype.execute = function(currentNode)
{
	//var scene = Game.getSceneByName(this.Scene);
	var scene = Game.getScene(this.Scene);
	
	if(scene)
	Game.switchToScene(scene,this.ResetScene);
}

// ---------------------------------------------------------------------
// Action ActionRestartScene
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.RestartScene = function()
{
	this.Type = 'RestartScene';	
}

/**
 * @private
 */
ZICA.Action.RestartScene.prototype.createClone = function()
{
	var a = new ZICA.Action.RestartScene();
	return a;
}

/**
 * @private
 */
ZICA.Action.RestartScene.prototype.execute = function(currentNode)
{
	if (Game.scene)
		Game.switchToScene(Game.scene, true);
}

// ---------------------------------------------------------------------
// Action OpenWebpage
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.OpenWebpage = function(obj)
{
	this.Type = 'OpenWebpage';	
	this.Webpage = obj.Webpage;
	this.Target = obj.Target;
}

/**
 * @private
 */
ZICA.Action.OpenWebpage.prototype.createClone = function()
{
	var a = new ZICA.Action.OpenWebpage({});
	a.Webpage = this.Webpage;
	a.Target = this.Target;
	return a;
}

/**
 * @private
 */
ZICA.Action.OpenWebpage.prototype.execute = function(currentNode)
{
	window.open(this.Webpage, this.Target);
}

// ---------------------------------------------------------------------
// Action OpenWebpage
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ExitApplication = function(obj)
{
	this.Type = 'ExitApplication';	
}

/**
 * @private
 */
ZICA.Action.ExitApplication.prototype.createClone = function()
{
	var a = new ZICA.Action.ExitApplication({});
	return a;
}

/**
 * @private
 */
ZICA.Action.ExitApplication.prototype.execute = function(currentNode)
{
	window.close();
}

// ---------------------------------------------------------------------
// Action SetOrChangeAVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.SetOrChangeAVariable = function(obj)
{
	// variables set in loader
	var oper = ['Set(=)','Add(+)','Substract(-)','Divide(/)','Divide INT(/)','Multiply(*)','Multiply INT(*)'];
	
	this.VariableName = obj.VariableName;
	this.Operation = oper.indexOf(obj.Operation);
	this.ValueType = obj.ValueType == 'Value'?0:1;
	this.Value = obj.Value;
	
	this.Type = 'SetOrChangeAVariable';	
}

/**
 * @private
 */
ZICA.Action.SetOrChangeAVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.SetOrChangeAVariable({});
	a.VariableName = this.VariableName;
	a.Operation = this.Operation;
	a.ValueType = this.ValueType;
	a.Value = this.Value;
	return a;
}

/**
 * @private
 */
ZICA.Action.SetOrChangeAVariable.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
				
	if (this.VariableName == null)
		return;
		
	var var1 = Game.hasVariable(this.VariableName);
	if (var1 == true)
		var1 = Game.getVariable(this.VariableName);
	else
		var1 = 0;
		
	var var2 = null;

	if (this.ValueType == 1) //EO_VARIABLE)
	{
		var2 = Game.getVariable(this.Value);	
		if (var2 == null)
			return; // operand variable not existing
	}else
		var2 = this.Value;

	
	switch(this.Operation)
	{
	case 0: //EO_SET:
		var1 = var2;
		break;
	case 1: //EO_ADD:
		var1 += var2;
		break;
	case 2: //EO_SUBSTRACT:
		var1 -= var2;
		break;
	case 3: //EO_DIVIDE:
		var1 /= var2;
		break;
	case 4: //EO_DIVIDE_INT:
		var1 = Math.round(var1 / var2);
		break;
	case 5: //EO_MULTIPLY:
		var1 *= var2;
		break;
	case 6: //EO_MULTIPLY_INT:
		var1 = Math.round(var1 * var2);
		break;
	}		

	Game.setVariable(this.VariableName , var1);
}

// ---------------------------------------------------------------------
// Action IfVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.IfVariable = function(obj)
{
	var comp = ['Is equal to (=)','Is not equal to (<>)','Is bigger than (>)','Is smaller than (<)'];
	
	this.VariableName = obj.VariableName;
	this.ComparisonType = comp.indexOf(obj.ComparisonType);
	this.ValueType = obj.ValueType == 'Value'?0:1;
	this.Value = obj.Value;
	this.TheActionHandler = obj.Action;
	this.TheElseActionHandler = obj.Else;
	
	this.Type = 'IfVariable';	
}

/**
 * @private
 */
ZICA.Action.IfVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.IfVariable({});
	a.VariableName = this.VariableName;
	a.ComparisonType = this.ComparisonType;
	a.ValueType = this.ValueType;
	a.Value = this.Value;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.TheElseActionHandler = this.TheElseActionHandler ? this.TheElseActionHandler.createClone() : null;
	return a;
}

/**
 * @private
 */
ZICA.Action.IfVariable.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
		
	if (this.VariableName == null)
		return;
		
	var var1 = Game.hasVariable(this.VariableName);
	if (var1 == null) // should not happen since the function above creates if not found
		return;
	
	var1 = Game.getVariable(this.VariableName);
	var var2 = null;

	if (this.ValueType == 1) //EO_VARIABLE)
	{
		var2 = Game.hasVariable(this.Value);
		if (var2 == false) // should not happen since the function above creates if not found
		return;
	
		var2 = Game.getVariable(this.Value);
	}else
		var2 = this.Value;
	
	var execute = false;

	switch(this.ComparisonType)
	{
	case 0: //EO_EQUAL:
	case 1: //EO_NOT_EQUAL:
		{
			execute = (var1 == var2)
			if (this.ComparisonType == 1) //EO_NOT_EQUAL)
				execute = !execute;	
			break;
		}
	case 2: //EO_BIGGER_THAN:
		{
			execute = var1 > var2;
		}
		break;
	case 3: //EO_SMALLER_THAN:
		{
			execute = var1 < var2;
		}
		break;
	}			
	
	if (execute)
	{
		if (this.TheActionHandler)
			this.TheActionHandler.execute(currentNode);
	}
	else
	{
		if (this.TheElseActionHandler)
			this.TheElseActionHandler.execute(currentNode);
	}
}

// ---------------------------------------------------------------------
// Action Store Load Variable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionStoreLoadVariable = function(obj)
{
	this.Type = 'StoreLoadVariable';
	this.Load = (obj.Load == 'Load Variable')?true:false;
	this.VariableName = obj.VariableName;
}

/**
 * @private
 */
ZICA.Action.ActionStoreLoadVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionStoreLoadVariable({});
	a.Load = this.Load;
	a.VariableName = this.VariableName;
	return a;
}

ZICA.Action.ActionStoreLoadVariable.prototype.setCookie = function(cookieName, value, expdays)
{
	var expdate = new Date();
	expdate.setDate(expdate.getDate() + expdays);
	var cvalue = escape(value) + ("; expires=" + expdate.toUTCString());
	document.cookie = cookieName + "=" + cvalue;
}

ZICA.Action.ActionStoreLoadVariable.prototype.getCookie = function(cookieName)
{
	var ARRcookies = document.cookie.split(";");
	for (var i=0; i<ARRcookies.length; ++i)
	{
		var cookie = ARRcookies[i];
		var equalspos = cookie.indexOf("=");
		var varname = cookie.substr(0, equalspos);
		
		varname = varname.replace(/^\s+|\s+$/g,"");
		
		if (varname == cookieName)
			return unescape(cookie.substr(equalspos+1));
	}
	
	return null;
}

/**
 * @private
 */
ZICA.Action.ActionStoreLoadVariable.prototype.execute = function(currentNode)
{
	if (this.VariableName == null || this.VariableName == "")
		return;
		
	var var1 = Game.hasVariable(this.VariableName);
	
		try
		{			
			if (this.Load)
			{
				// load
				//Game.setVariable(this.VariableName, this.getCookie(this.VariableName));
				var var2 = window.localStorage.getItem(this.VariableName);
				if(var2)
				Game.setVariable(this.VariableName, var2);
			}
			else
			{
				// save
				if(var1)
				window.localStorage.setItem(this.VariableName, Game.getVariable(this.VariableName)) 
				//this.setCookie(this.VariableName, Game.getVariable(this.VariableName), 99);
			}
		}
		catch(e)
		{
			//Debug.print("error loading/saving data");
		}
	
}

// ---------------------------------------------------------------------
// Action PlaySound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionPlaySound = function(obj)
{
	var mode = ['Play Audio','Stop Audio','Toggle Audio'];
	
	this.SceneNodeToPlay = obj.SceneNodeToPlay;
	if(obj.SceneNodeToPlay == null)this.PlayCurrentSceneNode = true;
	this.Mode = mode.indexOf(obj.Mode);
	this.Type = 'PlaySound';	
}

/**
 * @private
 */
ZICA.Action.ActionPlaySound.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionPlaySound({});
	a.SceneNodeToPlay = this.SceneNodeToPlay;
	a.PlayCurrentSceneNode = this.PlayCurrentSceneNode;;
	a.Mode = this.Mode;
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionPlaySound.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeToHandle = null;
	if (this.PlayCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlay != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToPlay);
	
	if (nodeToHandle)
	{
		if(!nodeToHandle.__audio)return;
		
		nodeToHandle.__audio.currentTime = 0;
		
		if(this.Mode == 0)
			nodeToHandle.playAudio();
		else if(this.Mode == 1)
			nodeToHandle.stopAudio();
		else
			nodeToHandle.__audio.paused?nodeToHandle.playAudio():nodeToHandle.stopAudio();
	}
}

// ---------------------------------------------------------------------
// Action ResumeSound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionResumeSound = function(obj)
{
	var mode = ['Resume Audio','Pause Audio','Toggle Audio'];
	
	this.SceneNodeToPlay = obj.SceneNodeToPlay;
	if(obj.SceneNodeToPlay == null)this.PlayCurrentSceneNode = true;
	this.Mode = mode.indexOf(obj.Mode);
	this.Type = 'PlaySound';	
}

/**
 * @private
 */
ZICA.Action.ActionResumeSound.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionResumeSound({});
	a.SceneNodeToPlay = this.SceneNodeToPlay;
	a.PlayCurrentSceneNode = this.PlayCurrentSceneNode;;
	a.Mode = this.Mode;
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionResumeSound.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeToHandle = null;
	if (this.PlayCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlay != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToPlay);
	
	if (nodeToHandle)
	{
		if(!nodeToHandle.__audio)return;
		
		//nodeToHandle.__audio.currentTime = 0;
		
		if(this.Mode == 0)
			nodeToHandle.playAudio();
		else if(this.Mode == 1)
			nodeToHandle.pauseAudio();
		else
			nodeToHandle.__audio.paused?nodeToHandle.playAudio():nodeToHandle.pauseAudio();
	}
}

// ---------------------------------------------------------------------
// Action StopSound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionStopSound = function()
{
	this.Type = 'StopSound';	
}

/**
 * @private
 */
ZICA.Action.ActionStopSound.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionStopSound();
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionStopSound.prototype.execute = function(currentNode)
{
	Game.stopAllSounds();
}

// ---------------------------------------------------------------------
// Action ActionDeleteSceneNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionDeleteSceneNode = function(obj)
{
	this.Type = 'ActionDeleteSceneNode';	
	
	this.SceneNodeToDelete = obj.SceneNodeToDelete;
	if(this.SceneNodeToDelete == null)this.DeleteCurrentSceneNode = true;
}

/**
 * @private
 */
ZICA.Action.ActionDeleteSceneNode.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionDeleteSceneNode({});
	a.SceneNodeToDelete = this.SceneNodeToDelete;
	a.DeleteCurrentSceneNode = this.DeleteCurrentSceneNode;
	a.TimeAfterDelete = this.TimeAfterDelete;

	return a;
}

/**
 * @private
 */
ZICA.Action.ActionDeleteSceneNode.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.DeleteCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToDelete != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToDelete);

	if (nodeToHandle != null)
		nodeToHandle.__removeFlag = true;
		//sceneManager.addToDeletionQueue(nodeToHandle, this.TimeAfterDelete);
}

// ---------------------------------------------------------------------
// Action RestartBehaviors
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.RestartBehaviors = function(obj)
{
	this.SceneNodeToRestart = obj.SceneNodeToRestart;
	if(this.SceneNodeToRestart == null)this.ChangeCurrentSceneNode = true;
	this.Type = 'RestartBehaviors';	
}

/**
 * @private
 */
ZICA.Action.RestartBehaviors.prototype.createClone = function()
{
	var a = new ZICA.Action.RestartBehaviors({});
	a.SceneNodeToRestart = this.SceneNodeToRestart;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;

	return a;
}

/**
 * @private
 */
ZICA.Action.RestartBehaviors.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToRestart != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToRestart);

	if (nodeToHandle)
	{
		for (var i = 0; i<nodeToHandle.animators.length; ++i)
		{
			var a = nodeToHandle.animators[i];
			if (a != null)
				a.reset();
		}
	}
}

// ---------------------------------------------------------------------
// Action ActionCloneSceneNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionCloneSceneNode = function(obj)
{
	this.SceneNodeToClone = obj.SceneNodeToClone;
	if(this.SceneNodeToClone == null)this.CloneCurrentSceneNode = true;
	this.TheActionHandler = obj.ActionToDoWhitClone;
	
	this.Type = 'ActionCloneSceneNode';	
}

/**
 * @private
 */
ZICA.Action.ActionCloneSceneNode.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionCloneSceneNode({});
	a.SceneNodeToClone = this.SceneNodeToClone;
	a.CloneCurrentSceneNode = this.CloneCurrentSceneNode;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;

	return a;
}

/**
 * @private
 */
ZICA.Action.ActionCloneSceneNode.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.CloneCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToClone != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToClone);

	if (nodeToHandle)
	{
		// clone
		var cloned = Game.cloneEntity(nodeToHandle);
		
		if (cloned != null)
		{
			// run action on clone
	
			if (this.TheActionHandler)
				this.TheActionHandler.execute(cloned);
		}
	}
}

// ---------------------------------------------------------------------
// Action SetSceneNodeAnimation
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.SetSceneNodeAnimation = function(obj)
{
	this.SceneNodeToChangeAnim = obj.SceneNodeToChangeAnim;
	if(this.SceneNodeToChangeAnim == null)this.ChangeCurrentSceneNode = true;
	this.Loop = obj.Loop;
	this.AnimName = obj.AnimName;
	
	this.Type = 'SetSceneNodeAnimation';
}

/**
 * @private
 */
ZICA.Action.SetSceneNodeAnimation.prototype.createClone = function()
{
	var a = new ZICA.Action.SetSceneNodeAnimation({});
	a.SceneNodeToChangeAnim = this.SceneNodeToChangeAnim;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Loop = this.Loop;
	a.AnimName = this.AnimName;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.SetSceneNodeAnimation.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeAnim != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChangeAnim);

	if (nodeToHandle)
	{
		// set animation
		
		var animatedMesh = nodeToHandle;
		animatedMesh.animation = this.AnimName;
		animatedMesh.animLoop = this.Loop;

	}
}

// ---------------------------------------------------------------------
// Action ActionPlayMovie
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionPlayMovie = function(obj)
{
	this.Type = 'ActionPlayMovie';	
	this.PlayLooped = obj.PlayLooped;
	this.VideoFileName = obj.VideoFileName;
	this.AutoPlay = obj.AutoPlay;
	this.SceneNodeToPlayAt = obj.SceneNodeToPlayAt;
	if(this.SceneNodeToPlayAt == null)this.PlayAtCurrentSceneNode = true;
	
	this.ActionHandlerFinished = obj.ActionOnFinished;
	this.ActionHandlerFailed = obj.ActionOnFailed;
}

/**
 * @private
 */
ZICA.Action.ActionPlayMovie.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionPlayMovie();
	a.PlayLooped = this.PlayLooped;
	a.AutoPlay = this.AutoPlay;
	a.VideoFileName = this.VideoFileName;
	a.SceneNodeToPlayAt = this.SceneNodeToPlayAt;
	a.PlayAtCurrentSceneNode = this.PlayAtCurrentSceneNode;
	
	a.ActionHandlerFinished = this.ActionHandlerFinished ? this.ActionHandlerFinished.createClone() : null;
	a.ActionHandlerFailed = this.ActionHandlerFailed ? this.ActionHandlerFailed.createClone() : null;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionPlayMovie.prototype.execute = function(currentNode, sceneManager)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.PlayAtCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlayAt != -1)
		nodeToHandle = Game.scene.getEntityById(this.SceneNodeToPlayAt);
	
	// create video stream
	
	 nodeToHandle.stream = new ZICA.VideoStream(this.VideoFileName)
	
	if (nodeToHandle.stream != null && this.AutoPlay)
	{
		nodeToHandle.stream.play(this.PlayLooped);
	}
}

// ---------------------------------------------------------------------
// Action ActionVideoCommand
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionVideoCommand = function(obj)
{
	this.Type = 'ActionVideoCommand';	
	
	this.SceneNodeToPlayAt = obj.SceneNodeToChange;
	if(this.SceneNodeToPlayAt == null)this.PlayAtCurrentSceneNode = true;
	this.Command = ['Play','Pause','Stop','Resume'].indexOf(obj.Command);
	
}

/**
 * @private
 */
ZICA.Action.ActionVideoCommand.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionPlayMovie({});
	a.Command = this.Command;
	a.SceneNodeToPlayAt = this.SceneNodeToPlayAt;
	a.PlayAtCurrentSceneNode = this.PlayAtCurrentSceneNode;
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionVideoCommand.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeToHandle = null;
	if (this.PlayAtCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlayAt != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToPlayAt);
	
		
	if (nodeToHandle.stream != null)
	{
		switch(this.Command)
		{
		case 0: // play
			{
				nodeToHandle.stream.play(this.PlayLooped);
			}
			break;
		case 1: // pause
			nodeToHandle.stream.pause();
			break;
		case 2: // stop
			nodeToHandle.stream.stop();
			break;
		}	
	}
}

// ---------------------------------------------------------------------
// Playing video stream
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.VideoStream = function(filename)
{
	this.filename = filename;
	this.videoElement = null;
	this.handlerOnVideoEnded = null;
	this.handlerOnVideoFailed = null;
	this.readyToShow = false;
	this.playBackEnded = false;
	this.stopped = false;
	this.state = 0; // 0=stopped, 1=loading, 2=playing, 3=paused
	this.playLooped = false;
	this.isError = false;
	
	this.videoBufferReady = function()
	{
		this.state = 2; // playing
		
		// start video
		this.videoElement.play();
		this.readyToShow = true;
			
	}
	
	this.videoPlaybackDone = function()
	{
		this.state = 0; // 0=stopped, 1=loading, 2=playing, 3=paused
		this.playBackEnded = true;
	}
	
	this.errorHappened = function()
	{
		this.state = 0;
		this.playBackEnded = true;
		this.isError = true;
	}
		
	this.play = function(playLooped)
	{
		if (this.state == 2 || this.state == 1) // playing or loading
			return;
			
		if (this.videoElement)
		{
			if (this.state == 3) // paused
			{
				// unpause
				this.videoElement.play();
				this.state = 2;
				this.playBackEnded = false;
				return;
			}
			else
			if (this.state == 0) // stopped
			{
				this.videoElement.currentTime = 0;
				this.videoElement.play();
				this.state = 2;
				this.playBackEnded = false;
				return;
			}
		}
		
		var v = document.createElement('video');
		
		var me = this;
		
		this.videoElement = v;
		this.playLooped = playLooped;
		
		v.addEventListener("canplaythrough", function() { me.videoBufferReady(); }, true);
		v.addEventListener("ended", function() { me.videoPlaybackDone(); }, true);
		v.addEventListener("error", function() { me.errorHappened(); }, true);
		
		v['preload'] = "auto";
		v.src = Game.assets[filename]; // works with .ogv and .mp4
		v.style.display = 'none';
		
		if (this.playLooped)			
			v.loop = true;
			
		this.state = 1; // loading
		
		// create placeholder texture
	}
	
	this.pause = function()
	{
		if (this.state != 2)
			return;
			
		this.videoElement.pause();
		this.state = 3;
	}
	
	this.stop = function()
	{
		if (this.state != 2)
			return;
			
		this.videoElement.pause();
		this.state = 0;	
	}
	
	this.updateVideoTexture = function()
	{
		if (!this.readyToShow)
			return;
			
		if (this.state != 2) // playing
			return;			
		
	}
	
	this.hasPlayBackEnded = function()
	{
		if (this.state == 0) // 0=stopped, 1=loading, 2=playing, 3=paused
			return true;
			
		return this.playBackEnded;
	}
}

// ---------------------------------------------------------------------
// Action Shoot
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.Shoot = function(obj)
{
	this.ShootType = 0;
	this.Damage = 0;
	this.BulletSpeed = 0.0;
	this.SceneNodeToUseAsBullet = -1;
	this.WeaponRange = 100.0;
	this.Type = 'Shoot';	
	this.SceneNodeToShootFrom = -1;
	this.SceneNodeToShootTo = -1; 
	this.ShootToCameraTarget = false;
	this.AdditionalDirectionRotation = null;
	this.ActionHandlerOnImpact = null;
	this.ShootDisplacement = new ZICA.Vect2d();
	
	this.ShootType = (obj.ShootType == 'Direcly hit, no bullet')?0:1;
	this.Damage = obj.Damage;
	this.SceneNodeToUseAsBullet = obj.SceneNodeToUseAsBullet;
	this.BulletSpeed = obj.BulletSpeed;
	this.WeaponRange = obj.WeaponRange;
	this.ActionHandlerOnImpact = obj.ActionOnImpact;
	this.SceneNodeToShootFrom = obj.SceneNodeToShootFrom;
	this.AdditionalDirectionRotation = obj.AdditionalDirectionRotation;
	this.ShootDisplacement = obj.ShootDisplacement;
	
	this.ShootTo = ['DirectionRotation','CameraTarget','SceneNode'].indexOf(obj.ShootTo);
	
	if(this.ShootTo == 1)
		this.ShootToCameraTarget = true;
	if(this.ShootTo == 2)
		this.SceneNodeToShootTo = obj.SceneNodeToShootTo;
		
}

/**
 * @private
 */
ZICA.Action.Shoot.prototype.createClone = function()
{
	var a = new ZICA.Action.Shoot({});
	a.ShootType = this.ShootType;
	a.Damage = this.Damage;
	a.BulletSpeed = this.BulletSpeed;
	a.SceneNodeToUseAsBullet = this.SceneNodeToUseAsBullet;
	a.WeaponRange = this.WeaponRange;
	a.SceneNodeToShootFrom = this.SceneNodeToShootFrom;
	a.SceneNodeToShootTo = this.SceneNodeToShootTo;
	a.ShootToCameraTarget = this.ShootToCameraTarget;
	a.ShootTo = this.ShootTo;
	a.AdditionalDirectionRotation = this.AdditionalDirectionRotation;
	a.ActionHandlerOnImpact = this.ActionHandlerOnImpact ? this.ActionHandlerOnImpact.createClone(): null;
	a.ShootDisplacement = this.ShootDisplacement.clone();
		
	return a;
}

/**
 * @private
 */
ZICA.Action.Shoot.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	// calculate ray, depending on how we were shot: If shot by an AI, use its target.
	// it not, use the active camera and shoot into the center of the screen.

	var ray = new Object();
	var rayFound = false;
	var shooterNode = null;
	var cam = null; // temp variable, used multiple times below
	
	if (this.SceneNodeToShootFrom != null)
	{
		var userSpecifiedNode = Game.getEntityById(this.SceneNodeToShootFrom);
		
		if (userSpecifiedNode != null)
		{
			rayFound = true;
			shooterNode = userSpecifiedNode;
			
			// ray.Start = userSpecifiedNode.getTransformedBoundingBox().getCenter();
			
			ray.Start = new ZICA.Vect2d(userSpecifiedNode.x,userSpecifiedNode.y);
			ray.Start.addToThis(this.ShootDisplacement);
		}
	}
	else{
		shooterNode = currentNode;
		
		ray.Start = new ZICA.Vect2d(shooterNode.x,shooterNode.y);
		ray.Start.addToThis(this.ShootDisplacement);
	}
	
	if (this.ShootTo == 1)
	{
		// in order to shoot to the camera target, we need to collide the camera with the world and
		// all AIs to test were to shoot at
		var camVect = new ZICA.Vect2d(Game.scene.x,Game.scene.y);
		camVect = camVect.substract(ray.Start);
		camVect.normalize();
		ray.End = camVect;
	}
	if(this.ShootTo == 0)
	{
		if (typeof this.AdditionalDirectionRotation == 'number')
		{
			ray.End = new ZICA.Vect2d(Math.cos(this.AdditionalDirectionRotation*Math.PI/180),Math.sin(this.AdditionalDirectionRotation*Math.PI/180));
		}

	}
	if(this.ShootTo == 2)
	{
		var nodeTo = null;
		if(this.SceneNodeToShootTo != -1)
			nodeTo = Game.getEntityById(this.SceneNodeToShootTo);
		
		if(nodeTo){
			var dirVect = new ZICA.Vect2d(nodeTo.getCenter().x,nodeTo.getCenter().y);
			dirVect = dirVect.substract(ray.Start);
			dirVect.normalize();
			ray.End = dirVect;
		}
	}

	//console.log(ray);
	// decide if we do a bullet or direct shot

	if (this.ShootType == 1) //ESIT_BULLET)
	{
		var bulletTemplate = null;

		if (this.SceneNodeToUseAsBullet != -1)
			bulletTemplate = Game.getEntityById(this.SceneNodeToUseAsBullet);
		else 
			bulletTemplate = currentNode;
		
		if (bulletTemplate)
		{
			// create bullet now

			var cloned = bulletTemplate.clone();
		
			if (cloned != null)
			{
				cloned.x = ray.Start.X;
				cloned.y = ray.Start.Y;
				cloned.position = 'absoulte';
				cloned.visible = true;
				cloned.isBullet = true;
				cloned.name = "";
				
				cloned.ray = ray;
				cloned.WeaponRange = this.WeaponRange;
				cloned.Damage = this.Damage;
				cloned.shooterNode = shooterNode;
				cloned.bulletTemplate = bulletTemplate;
				cloned.ActionHandlerOnImpact = this.ActionHandlerOnImpact;
				// rotate to target
				//cloned.angle = this.AdditionalDirectionRotation;

				// move to target

				var speed = this.BulletSpeed;
				if (speed == 0) speed = 1.0;
				
				cloned.velX = ray.End.X * speed;
				cloned.velY = ray.End.Y * speed;
				
				Game.scene.addEntity(cloned);
				
				cloned.__onUpdate = function(event){
					
					var a = new ZICA.Vect2d(this.x,this.y);
					var b = this.ray.Start.clone();
					var vect = a.substract(b);
					var length = vect.getLength();
					
					if(length >= this.WeaponRange)
						this.__removeFlag = true;
					
				}
				
				
				cloned.__onCollision = function(event){
					var other = event.other;
					
					if((!other.isBullet) && (other != this.shooterNode) && (other != this.bulletTemplate)){
						
						Game.scene.lastBulletImpact = new ZICA.Vect2d(this.x,this.y);
						this.__removeFlag = true;
						
						if (this.ActionHandlerOnImpact)
							this.ActionHandlerOnImpact.execute(other);	
						
						var targetanimAi = other.getAnimatorOfType('gameai');
						if (targetanimAi)
						targetanimAi.OnHit(this.Damage, other);
					}
				}
				
			}
		}
	}
	else
	if (this.ShootType == 0) //EST_DIRECT)
	{
		for(var i = 0; i<= this.WeaponRange; i++){
			
			var end = ray.End.clone();
			end.multiplyThisWithScal(i)
			var point = ray.Start.add(end);
			point.x = point.X;
			point.y = point.Y;
			
			for(var ii = 0; ii<= Game.scene.children.length-1;ii++){
				var node = Game.scene.children[ii];
			
				if(Game.pointInBox(point,node)){
					
					if((!node.isBullet) && (node != shooterNode)){
						
						Game.scene.lastBulletImpact = new ZICA.Vect2d(point.X,point.Y);
						
						if (this.ActionHandlerOnImpact)
							this.ActionHandlerOnImpact.execute(node);
						
						var targetanimAi = other.getAnimatorOfType('gameai');
						if (targetanimAi)
						targetanimAi.OnHit(this.Damage, node);
						
						i = Infinity;
						break;
					}
				}
					
			}
				
		}

	} // end direct shot
}

// ---------------------------------------------------------------------
// Action ChangeCameraPosition
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeCameraPosition = function(obj)
{
	this.UseAnimatedMovement = obj.UseAnimatedMovement;//false;
	this.TimeNeededForMovementMs = obj.TimeNeededForMovementMs //false;
	this.center = obj.Center;
	//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
	this.Vector = obj.Position.clone();
	this.SceneNodeRelativeTo = obj.SceneNodeRelativeTo;
	if(obj.SceneNodeRelativeTo == null)this.RelativeToCurrentSceneNode = true;
	

	this.Type = 'ChangeCameraPosition';	
}

/**
 * @private
 */
ZICA.Action.ChangeCameraPosition.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeCameraPosition({});

	a.SceneNodeRelativeTo = this.SceneNodeRelativeTo;
	a.RelativeToCurrentSceneNode = this.RelativeToCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	a.center = this.center;
	a.UseAnimatedMovement = this.UseAnimatedMovement;
	a.TimeNeededForMovementMs = this.TimeNeededForMovementMs;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeCameraPosition.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = Game.scene;
	
	if (nodeToHandle)
	{
		var finalpos = null;
	
		var nodeRelativeTo = null;
		if (this.RelativeToCurrentSceneNode)
			nodeRelativeTo = currentNode;
		else
		if (this.SceneNodeRelativeTo != -1)
			nodeRelativeTo = Game.getEntityById(this.SceneNodeRelativeTo);

		if (nodeRelativeTo){
			
			var x = nodeRelativeTo.x;
			var y = nodeRelativeTo.y;
			
			if(this.center){
				x += nodeRelativeTo.width/2;
				y += nodeRelativeTo.height/2;
			}
			
			finalpos = new ZICA.Vect2d(x + this.Vector.X,y + this.Vector.Y);
		}
		
		if (finalpos != null)
		{
			if (this.UseAnimatedMovement && this.TimeNeededForMovementMs > 0)
			{

				var anim = new ZICA.AnimatorFlyStraight({});
				anim.Start = new ZICA.Vect2d(nodeToHandle.x,nodeToHandle.y);
				anim.End = finalpos;
				anim.TimeForWay = this.TimeNeededForMovementMs;
				anim.DeleteMeAfterEndReached = true;
				anim.recalculateImidiateValues();
				
				nodeToHandle.addAnimator(anim);
			}
			else
			{
				// set position directly
				nodeToHandle.x = finalpos.X;
				nodeToHandle.y = finalpos.Y;
			}
		}
	}
}
