
       ZICA.Scene =  function() {
            //id 
			this.id = 0;
			//type
			this.type = 'scene';
			//
			this.isScene = true;
			//uid 
			this.uId = this.__generateGUID();
            //user-defined entity name
            this.name = "";
			//IS active 
			this.active = false;
			//gravity
			this.gravity = 10;
			//camera positon
			this.x = 0;
			this.y = 0;
			//camera Mode
			this.useCamera = false;
            //world size 
            this.width = 400;
            this.height = 400;
			//drawMap
			this.drawMap = true;
			//map
			this.map = '';
			//opacity
			this.opacity = 1;
			//draw color 
			this.drawColor = true;
			//backgroundColor
			this.color = 'rgba(0,0,0,1)';
			//backgroundImage
			this.drawImage = true;
			this.aspectRatio = false;
			this.image = "";
			this.__image = new Image();
			this.__map = new Image();
			//children
			this.children = [];
			//first-frame;
			this.firstFrame = true;
			
			//Animators
			this.animators = '[]'
			
			this.animations = {};
			
			this.__onGameStartString = '';
			this.__onUpdateString = '';
			this.__onCollisionString = '';
        }
		
	ZICA.Scene.prototype.__generateGUID = function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        };
		
	ZICA.Scene.prototype.addEntity = function(n)
		{
			if (n)
			{
				/* n.scene = this.scene;
					
				if (n.Parent)
					n.Parent.removeChild(n);
				n.Parent = this; */
				//n.parent = this;
				this.children.push(n);
			}
		}
		
		ZICA.Scene.prototype.removeEntity = function(n)
		{
			for (var i = 0; i<this.children.length; ++i)
			{
				if (this.children[i] === n)
				{
					//n.Parent = null;
					this.children.splice(i, 1);
					return;
				}
			}
		}
        ZICA.Scene.prototype.getEntityByName = function (name) {
			
			for (var i = 0; i<this.children.length; ++i)
			{
				if (this.children[i].name === name)
				{
					return this.children[i];
				}
			}
            
        };
		
		 ZICA.Scene.prototype.getEntityByUID = function (uid) {
			
			for (var i = 0; i<this.children.length; ++i)
			{
				if (this.children[i].__guid === uid)
				{
					return this.children[i];
				}
			}
            
        };
		
		ZICA.Scene.prototype.getEntity = function (index) {
			
			for (var i = 0; i<this.children.length; ++i)
			{
				if (i === index)
				{
					return this.children[i];
				}
			}
            
        };
		
		ZICA.Scene.prototype.getEntitiesByName = function (name) {
			var entities = [];
			for (var i = 0; i<this.children.length; ++i)
			{
				if (this.children[i].name === name)
				{
					entities.push(this.children[i]);
					
				}
			}
			
			return entities;
            
        };
		ZICA.Scene.prototype.duplicate = function () {
            var result = new ZICA.Scene();
            for (var key in this) {
                if (typeof this[key] == "object") {
                    var objCopy = JSON.parse(JSON.stringify(this[key]));
                    result[key] = objCopy;
                }
                else
                    result[key] = this[key];
            }
            return result;
        };
		
		ZICA.Scene.prototype.removeAnimator = function(anim){
			
			var index = this.animators.indexOf(anim);
			
			if(index)
				this.animators.splice(index,1);
			
		};
		
		ZICA.Scene.prototype.addAnimator = function(anim){
			
			if(anim)
			this.animators.push(anim);
		};
		
		// get animator by type
		ZICA.Scene.prototype.getAnimatorOfType = function(type)
		{
		  if(!this.animators.length)return;
		  
		  for(var anim in  this.animators)
			  if(this.animators[anim].getType() == type)
				  return this.animators[anim];
		};
		
		ZICA.Scene.prototype.moveCameraAt = function(obj){
			
			if(obj.isEntity) var pos = obj.getCenter();
			else pos = {x:obj.x,y:obj.y};
			 
			 this.x = pos.x;
			 this.y = pos.y;
		};
		
		ZICA.Scene.prototype.getCameraPostion = function(){
			return {x:this.x,y:this.y};
		};
		
		ZICA.Scene.prototype.__onGameStart = function (event) { };
        ZICA.Scene.prototype.__onUpdate = function (event) { };
        ZICA.Scene.prototype.__onCollision = function (event) { };
		ZICA.Scene.prototype.__draw = function (drawContext) {
            
			var camera = Game.camera;
			
		   drawContext.clearRect(0, 0, drawContext.canvas.width, drawContext.canvas.height);
           
		   if(this.beforeDraw)this.beforeDraw.call(this,drawContext);
		   
		   if(this.drawMap){
				
				if(this.__map instanceof Image == false) this.__map = new Image();
				
				if(this.__map.name != this.map){	
					this.__map.name = this.map;
					
					if(this.map)
					this.__map.src = (this.map in Game.assets)?Game.assets[this.map]:'';
					else 
					this.__map.src = '';	
				}
				
				
				drawContext.drawImage(this.__map, 0,0 ,this.width, this.height);
		   }
		   camera.end();
		   drawContext.globalAlpha = this.opacity;
		   
		   //scene background
		   if(this.drawColor){
			   
			drawContext.fillStyle = this.color;
            drawContext.fillRect(0, 0, drawContext.canvas.width, drawContext.canvas.height);
			
		   }
			/* if(this.drawBorder){
			
			drawContext.lineWidth = this.borderWidth;
			drawContext.strokeStyle = this.borderColor;
			drawContext.strokeRect(this.x, this.y, this.width, this.height);
			
			} */
			
			//drawContext.fillStyle = this.color;
            //drawContext.fillRect(this.x, this.y, this.width, this.height);
			
			
			
			if(this.drawImage){
				
				if(this.__image instanceof Image == false) this.__image = new Image();
				
				if(this.__image.name != this.image){	
					this.__image.name = this.image;
					
					if(this.image)
					this.__image.src = (this.image in Game.assets)?Game.assets[this.image]:'';
					else 
					this.__image.src = '';	
				}
				
				if(!this.aspectRatio)
				drawContext.drawImage(this.__image, 0,0 ,drawContext.canvas.width, drawContext.canvas.height);
				else{
					var w = this.__image.naturalWidth;
					var h = this.__image.naturalHeight;
					var canvas = drawContext.canvas;
					// Get the min scale to fit the image to the canvas
					var scale = Math.min(canvas.width / w, canvas.height / h);

					// Set the transform to scale the image, and center to the canvas
					drawContext.save();
					drawContext.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);

					// draw the image offset by half its width and height to center and fit
					drawContext.drawImage(this.__image, -w / 2, -h / 2, w, h);
					drawContext.restore();
				}
			}	
				
				/* if(this.aspectRatio){
					
					var aspect = this.calculateAspectRatio();
					drawContext.drawImage(this.__image, this.x, this.y, aspect.width, aspect.height);
					
				}else
					//drawContext.filter = 'blur(4px)'; 
					drawContext.drawImage(this.__image, this.x, this.y, this.width, this.height);
				
			} */
			
			drawContext.globalAlpha = 1;
			camera.begin();
			
			if(this.afterDraw)this.afterDraw.call(this,drawContext);
		};
		/* ZICA.Scene.prototype.constructScene = function () {
            var result = new ZICA.Scene();
            for (var key in this) {
				
				if(key == 'children'){
				result.children = [];
					for (var i = 0; i < this.children.length; i++) {
					var copied = this.children[i].constructor.constructEntity(this.children[i]);
					delete copied.__guid;
					result.children.push(copied);
					}
				}
				
                if (typeof this[key] == "object") {
					if(key == 'children') continue;
                    var objCopy = JSON.parse(JSON.stringify(this[key]));
                    result[key] = objCopy;
                }
                else
                    result[key] = this[key];
            }
            return result;
        };
		
		ZICA.Scene.prototype.constructScene1 = function () {
            
			var result = {};
			
				for (var key in this) {
					
				if(key == 'children'){
				result.children = [];
					for (var i = 0; i < this.children.length; i++) {
					var copied = this.children[i].constructor.constructEntity(this.children[i]);
					delete copied.__guid;
					result.children.push(copied);
					}
				}
				if (typeof this[key] == "function") continue;
                if (typeof this[key] == "object") continue;
				else
                    result[key] = this[key];
			
                
            }
            return result;
        }; */
		
		
		    ZICA.Scene.constructScene = function (ent) {
				
				var ko = require("./entity");
				var entity_1 = ko.Entity;
				
            var result = new ZICA.Scene();
            for (var key in ent) {
                
				if(key == 'children'){
				    result.children = [];
					for (var i = 0; i < ent.children.length; i++) {
					var copied = entity_1.constructEntity(ent.children[i]);
					result.children.push(copied);
					}
				}else{
				
					result[key] = ent[key];
					if (key.substring(0, 4) == "__on" && key.substring(key.length - 6) == "String") {
                    //all function strings will be of the form __<FuncName>String
                    var memName = key.substring(0, key.lastIndexOf("String"));
                    var func = new Function("event", ent[key]);
                    result[memName] = func;
                }
				
				}
            }
            return result;
        };
		
		
       
   
