
        ZICA.Entity = function() {
            //user-defined entity name
            this.name = "";
			//type
			this.type = 'entity';
			// Type represents the collision detector's handling
			this.physicType = 'kinematic'; //'kinematic','dynamic'
			this.isEntity = true;
			//attachmen;
			this.attachTo = null;
            //position
			this.position = 'absolute';
			//relative 
			this.X = 0;
			this.Y = 0;
			//absolute
            this.x = 0;
            this.y = 0;
            //size
            this.width = 50;
            this.height = 50;
			// Store a half size for quicker calculations
			this.halfWidth = this.width * .5;
			this.halfHeight = this.height * .5;
			//rotate
			this.angle = 0;
			//visible
			this.visible = true;
			//locked for editor
			this.locked = false;
			//image
			this.drawImage = true;
			this.aspectRatio = false;
			this.image = '';
			
			//audio 
			this.loop = false;
			this.muted = false;
			this.autoplay = true;
			this.volume = 1;
			this.audio = '';
			
			//animators 
			this.animators = '[]';
			
			//animation
			this.animLoop = true;
			this.animations = {};
			this.animation = '';
			this.fps = 12;
			this.elapsed = 0;
			this.__then = Date.now();
			
			/* this.animation = '';
			this.animAutoplay = false;
			this.animLoop = true; */
			
			//ui element 
			//this.element = null;
			//draw text 
			this.text = "";
            this.font = "Arial";
			this.fontSize =  15; //"12pt";
			this.fontBold = false;
			this.fontItalic = false;
			//this.fontUnderline = false;
			this.fontColor = "rgba(255,0,0,1)";
			this.textAlign = 'center';
			this.verticalAlign = 'top';
			this.lineHeight = 15;
            //velocity
            this.velX = 0;
            this.velY = 0;
			// Acceleration
			this.ax = 0;
			this.ay = 0;
			//Restitution
			this.restitution = .2;
			//opacity
			this.opacity = 1;
			//draw color 
			this.drawColor = true;
            //color the entity will be drawn
            this.color = "rgba(0,0,0,1)";
            //border
			this.drawBorder = false;
			this.borderWidth = 2.5;
			this.borderColor = "rgba(255,0,0,1)";
			this.borderStyle = 'solid';
			//higher means it will be drawn on top of other objects
            this.priority = 1;
            //whether or not the entity is being blocked by another (should be set manually through collision)
            this.blockedUp = false;
            this.blockedDown = false;
            this.blockedLeft = false;
            this.blockedRight = false;
            //stores the previous position (note: in __onUpdate(), these will be the same as x and y)
            this.prevX = 0;
            this.prevY = 0;
            //whether or not to check collisions for this entity
            this.collides = true;
			this.collision = true;
            //internal flag for removing this entity at/after the next __onUpdate()
            this.__image = new Image();
			//audio buffer
			this.__audio = new Audio();
			//video buffer
			this.stream = null;
			//element
			//this.__element = null;
			//this.tagPrefix = 'ons-';
			
			this.__removeFlag = false;
            this.__guid = this.__generateGUID();
            //this.__collisionBounds = { type: enums_1.CollisionType.rectangle };
			
			// Update the bounds of the object to recalculate
			// the half sizes and any other pieces
			this.updateBounds();
		}
        /**
         * Sets an entity's remove flag. Will be removed before or after the entity updates next
         **/
        ZICA.Entity.prototype.remove = function () {
            this.__removeFlag = true;
        };
        /**
         * Returns whether or not an entity is removed from the game world
         **/
        ZICA.Entity.prototype.isRemoved = function () {
            return this.__removeFlag;
        };
        /**
         * Creates a copy of the entity.
         * Object members are attempted to be copied by JSON.parse(JSON.stringify(obj)).
         **/
        ZICA.Entity.prototype.clone = function () {
            var ent = this;
			var clonedAnimators = ent.cloneAnimators();
			var cloned = ent.constructor.constructEntity(ent);
			cloned.__guid = cloned.__generateGUID();
			cloned.animators = clonedAnimators;
			//Game.entityList.push(cloned);
			return cloned;
        };
		//Kontraverzan je nemoj ga kroisiti
        ZICA.Entity.prototype.duplicate = function () {
            var result = new ZICA.Entity();
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
        ZICA.Entity.prototype.__onGameStart = function (event) { };
        ZICA.Entity.prototype.__onUpdate = function (event) { };
        ZICA.Entity.prototype.__onCollision = function (event) { };
        ZICA.Entity.prototype.__draw = function (drawContext) {
            
			if(!this.visible)return; 
			
			if(this.beforeDraw)this.beforeDraw.call(this,drawContext);
				
			if(this.position == 'absolute')
				this.__updateFromAbsolute();
				
			if(this.position == 'fixed')
				this.__updateFromFixed();
			
			/* if(this.attachTo){
				var obj = Editor.scene.getEntityByUID(this.attachTo);
				this.x = obj.x + (obj.x  - this.aX);
				this.y = obj.y + (obj.y  - this.aY);	
			} */
			
			drawContext.save();
			drawContext.translate(this.x + (this.width/2), this.y+ (this.height/2));        
			drawContext.rotate( this.angle * Math.PI / 180 );
			drawContext.translate(-this.x + (-this.width/2), -this.y+ (-this.height/2));
			
			drawContext.globalAlpha = this.opacity;
			
			
			
			if(this.drawColor){	
			drawContext.fillStyle = this.color;
            drawContext.fillRect(this.x, this.y, this.width, this.height);
			}
			
			if(this.drawBorder){
			drawContext.lineWidth = this.borderWidth;
			drawContext.strokeStyle = this.borderColor;
			if(this.borderStyle == 'dashed'){
				var max = Math.max(this.width,this.height);
				var min = Math.min(this.width,this.height);
				drawContext.setLineDash([max/10,min/10]);
			}
			drawContext.strokeRect(this.x+this.borderWidth/2, this.y + this.borderWidth/2, this.width - this.borderWidth, this.height - this.borderWidth);
			}
			
			
			if(this.__audio instanceof Audio == false) this.__audio = new Audio();
			
			if(Game.state == 2){
				
				this.__audio.muted = this.muted;
				this.__audio.loop = this.loop;
				this.__audio.autoplay = this.autoplay;
				this.__audio.volume = this.volume;
				
				if(this.__audio.name != this.audio){	
						this.__audio.name = this.audio;
						
						if(this.audio)
						this.__audio.src = (this.audio in Game.assets)?Game.assets[this.audio]:'';
						else 
						this.__audio.src = '';	
				}
			
			}
			
			
			/* if(this.element){	
				
				if(this.__element)
				{
					if(this.__element.tagName == this.element.toUpperCase()){
						
						this.__element.style.left = this.x + 'px';
						this.__element.style.top = this.y  + 'px';
						this.__element.innerHTML = 'test button';
						
					}
					else{
						this.__element.parentElement.remove(this.__element);
						this.__element  = document.createElement( this.element);
						this.__element.style.position = 'absolute';
						drawContext.canvas.parentElement.appendChild(this.__element);
					}
						
				}else{
					
					this.__element  = document.createElement( this.element);
					this.__element.style.position = 'absolute';
					drawContext.canvas.parentElement.appendChild(this.__element);
							
				}
						
			} */
			
			//if(this.drawImage){
				
				/* if(Game)
				if(!(this.image in Game.assets)){
					obj.image = ''; 
				} */
				
				if(this.__image instanceof Image == false) this.__image = new Image();
				
				if(this.__image.name != this.image){	
					this.__image.name = this.image;
					
					if(this.image)
					this.__image.src = (this.image in Game.assets)?Game.assets[this.image]:'';
					else 
					this.__image.src = '';	
				}
				
				if(this.aspectRatio){
					
					if(this.drawImage){
						
						var w = this.__image.naturalWidth;
						var h = this.__image.naturalHeight;
						var scale = Math.min(this.width / w, this.height / h);
						
						var cx = Game.camera.viewport.left;
						var cy = Game.camera.viewport.top;
						
						drawContext.save();
						
						drawContext.setTransform(scale, 0, 0, scale, this.x-cx + (this.width/2),this.y-cy + (this.height/2));
						drawContext.rotate( this.angle * Math.PI / 180 );
						drawContext.drawImage(this.__image, -w / 2, -h / 2, w, h);
						drawContext.restore();
					}
					//var aspect = this.calculateAspectRatio();
					//drawContext.drawImage(this.__image, this.x, this.y, aspect.width, aspect.height);
					
				}else
					//drawContext.filter = 'blur(4px)'; 
					if(this.drawImage)
					drawContext.drawImage(this.__image, this.x, this.y, this.width, this.height);
				
			//}
			
			if(this.__video instanceof Image == false) this.__video = new Image();
				
				
				if(this.aspectRatio){
					
					if(this.stream){
						
						var w = this.__video.naturalWidth;
						var h = this.__video.naturalHeight;
						var scale = Math.min(this.width / w, this.height / h);
						
						var cx = Game.camera.viewport.left;
						var cy = Game.camera.viewport.top;
						
						drawContext.save();
						
						drawContext.setTransform(scale, 0, 0, scale, this.x-cx + (this.width/2),this.y-cy + (this.height/2));
						drawContext.rotate( this.angle * Math.PI / 180 );
						drawContext.drawImage(this.stream.videoElement, -w / 2, -h / 2, w, h);
						drawContext.restore();
					}
					//var aspect = this.calculateAspectRatio();
					//drawContext.drawImage(this.__image, this.x, this.y, aspect.width, aspect.height);
					
				}else
					//drawContext.filter = 'blur(4px)'; 
					if(this.stream)
						if(this.stream.videoElement)
							drawContext.drawImage(this.stream.videoElement, this.x, this.y, this.width, this.height);
				
			
			var now = Date.now();
		    this.elapsed = Math.abs(now - this.__then);
			var interval = 1000/this.fps;
			
		   if((this.elapsed > interval) && Game.isRunning())
		   {
			this.updateAnimation();
			this.__then = now - (this.elapsed % interval);
		   }
		   
		   this.drawAnimation(drawContext);
		   
			//drawContext.stroke();
			drawContext.fillStyle = this.fontColor;
			var font = (this.fontItalic?'italic ':'') + (this.fontBold?' bold ':'') + this.fontSize +'px '+ this.font;
			font = font.trim();
			font = font.replace('  ',' ');
			drawContext.font = font;
			drawContext.mlFillText(this.text, this.x, this.y, this.width, this.height, this.verticalAlign, this.textAlign, this.lineHeight);
			//drawContext.textAlign = 'center';
			//drawContext.textBaseline = 'middle'; 
            //drawContext.fillText(this.text, this.x + (this.width/2), this.y+ (this.height/2));
			
			drawContext.restore();
			
			if(this.afterDraw)this.afterDraw.call(this,drawContext);			
		
		};
		
/* 		//Round rect func
		ZICA.Entity.prototype.drawBorderRect =
		function (xx, yy, ww, hh, rad, fill, stroke) {
			correctRadius(rad, ww, hh);
			if (typeof(rad) === "undefined") rad = 0;
			if (typeof(rad) === "number") rad = {tr:rad,tl:rad,bl:rad,br:rad};
			this.beginPath();
			this.moveTo(xx, yy);
			this.arcTo(xx + ww, yy, xx + ww, yy + hh, rad.tr);
			this.arcTo(xx + ww, yy + hh, xx, yy + hh, rad.br);
			this.arcTo(xx, yy + hh, xx, yy, rad.bl);
			this.arcTo(xx, yy, xx + ww, yy, rad.tl);
			if (stroke) this.stroke();  // Default to no stroke
			if (fill || typeof(fill) === "undefined") this.fill();  // Default to fill
		};
		ZICA.Entity.prototype.correctRadius = function(r, w, h) {
		  if (r.tl + r.tr > w) {
			r.tl -= (r.tl + r.tr - w) / 2;
			r.tr = w - r.tl;
		  }
		  if (r.bl + r.br > w) {
			r.br -= (r.br + r.bl - w) / 2;
			r.bl = w - r.br;
		  }
		  if (r.tl + r.bl > h) {
			r.tl -= (r.tl + r.bl - h) / 2;
			r.bl = h - r.tl;
		  }
		  if (r.tr + r.br > h) {
			r.tr -= (r.tr + r.br - h) / 2;
			r.br = h - r.tr;
		  }
		 } */
		 
        /**
         * Recalculates the bounds that an entity will use for collision detection.
         * Ran during collision checks as well as right after a collision is made
         **/
      /*   ZICA.Entity.prototype.__recalculateCollisionBounds = function (compVars) {
            if (!this.collides)
                return null;
            var rectBounds = this.__collisionBounds;
            var comp = compVars.comp;
            var prevComp = compVars.prevComp;
            var velComp = compVars.velComp;
            var sizeComp = compVars.sizeComp;
            var dirs = compVars.dirs;
            //set up custom bounding boxes using previous and current positions to account for high entity speeds
            var bbox = {
                type: enums_1.CollisionType.rectangle,
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };
            rectBounds.x = this.x;
            rectBounds.y = this.y;
            rectBounds.width = this.width;
            rectBounds.height = this.height;
            rectBounds[comp] = Math.min(this[comp], this[prevComp]);
            rectBounds[sizeComp] = Math.abs(this[prevComp] - this[comp]) + this[sizeComp];
        }; */
		
		ZICA.Entity.prototype.playAudio = function(){
			if(this.__audio.duration == this.__audio.currentTime)this.__audio.currentTime = 0;
			this.__audio.play();
		};
		
		ZICA.Entity.prototype.pauseAudio = function(){
		
			this.__audio.pause();
		};
		
		ZICA.Entity.prototype.stopAudio = function(){
			
			this.__audio.pause();
			this.__audio.currentTime = 0;
			
		};
		
		ZICA.Entity.prototype.__updateFromFixed = function(){
			var camera = Game.camera;
			this.x = camera.viewport.left + this.X;
			this.y = camera.viewport.top + this.Y;
		};
		
		ZICA.Entity.prototype.__updateFromAbsolute = function(){
			var camera = Game.camera;
			this.X = -camera.viewport.left + this.x;
			this.Y = -camera.viewport.top + this.y;
		};
		
		ZICA.Entity.prototype.calculateAspectRatio = function(){
			
			 var ratio = Math.min(this.width / this.__image.width, this.height / this.__image.height);
			 return { width: this.__image.width*ratio, height: this.__image.height*ratio }; 
			
		};
		ZICA.Entity.prototype.getCenter = function(){
			var x = this.x + this.width/2;
			var y = this.y + this.height/2
			return {x:x ,y:y};
		};
		
		// Update bounds includes the rect's
		// boundary updates
		ZICA.Entity.prototype.updateBounds = function(){
			this.halfWidth = this.width * .5;
			this.halfHeight = this.height * .5;
		};

		// Getters for the mid point of the rect
		ZICA.Entity.prototype.getMidX = function(){
			return this.halfWidth + this.x;
		};

		ZICA.Entity.prototype.getMidY = function(){
			return this.halfHeight + this.y;
		};

		// Getters for the top, left, right, and bottom
		// of the rectangle
		ZICA.Entity.prototype.getTop = function(){
			return this.y;
		};
		ZICA.Entity.prototype.getLeft = function(){
			return this.x;
		};
		ZICA.Entity.prototype.getRight = function(){
			return this.x + this.width;
		};
		ZICA.Entity.prototype.getBottom = function(){
			return this.y + this.height;
		};
	
        ZICA.Entity.prototype.__getCollisionBounds = function () { return this.__collisionBounds; };
        /**
         * Generate a pseudo GUID randomly (not guaranteed to be unique). Thanks guid.us!
         **/
        ZICA.Entity.prototype.__generateGUID = function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        };
		
		ZICA.Entity.prototype.removeAnimator = function(anim){
			
			var index = this.animators.indexOf(anim);
			
			if(index)
				this.animators.splice(index,1);
			
		};
		
		ZICA.Entity.prototype.addAnimator = function(anim){
			
			if(anim)
			this.animators.push(anim);
		};
		
		// get animator by type
		ZICA.Entity.prototype.getAnimatorOfType = function(type)
		{
		  if(!this.animators.length)return;
		  
		  for(var anim in  this.animators)
			  if(this.animators[anim].getType() == type)
				  return this.animators[anim];
		};
		
		ZICA.Entity.prototype.cloneAnimators = function(){
			
			if(!Array.isArray(this.animators))return [];
			
			var animators = [];
			
			for (var i = 0; i<this.animators.length; ++i)
			{
				var a = this.animators[i];
				if (a != null)
					animators.push(a.createClone());
			}
			
			return animators;
		}
		/////////////////////////////////////////////////
		// add animation
		ZICA.Entity.prototype.addAnimation = function(animation)
	   {
		  this.animations[animation.id] = animation;
	   };
	   ZICA.Entity.prototype.createAnimation = function(sy, width, height, frameCount, id)
	   {
		  var obj = {};
		  obj.sy = sy;
		  obj.width = width;
		  obj.height = height;
		  obj.frameCount = frameCount;
		  obj.frame = 0;
		  obj.id = id;
		  
		  return obj;
	   };
	   ZICA.Entity.prototype.removeAnimation = function(id)
	   {
		  return delete this.animations[id];
	   };
		// get animation by id
	   ZICA.Entity.prototype.getAnimationbyId = function(id)
	   {
		  return this.animations[id]?this.animations[id]:null;
	   };
	   // get all ids of animations
	   ZICA.Entity.prototype.getAnimations = function(){
		   var arr = [];
		   arr.push('');
		   
		   for(var i in this.animations){
				if(i)arr.push(i);
		   }
		   return arr;
	   };
	   // set animation
	    ZICA.Entity.prototype.setAnimation = function(id)
	   {
		   this.animation =  id;
		   
		   if(id)
		   this.animations[id].frame = 0;
		  //this.currentAnimation = this.getAnimationbyId(id);
	   };
	   // update animation
	    ZICA.Entity.prototype.updateAnimation = function()
	   {
		   var self = this.animations[this.animation];
		   if(!self)return;
		 
		   if((self.frame >= self.frameCount-1) && this.animLoop == false) return;
			
		   self.frame = (self.frame + 1) % self.frameCount;
		  
	   };
		// draw animtion
	   ZICA.Entity.prototype.drawAnimation = function(context)
	   {
			var self = this.animations[this.animation];
		    if(!self)return;
			
			  context.drawImage(this.__image, self.frame*self.width, self.sy, self.width, self.height, this.x, this.y, this.width, this.height);
			  
		  //this.currentAnimation.drawFrame(context, this.__image, this.x, this.y);
	   }
        /**
         * Take an object that looks like an entity and make a new BaseEntity with all of its properties
         *   properly applied and copied.
         * Can be used to duplicate any entity, though not "deep" if any members are reference types.
         **/
        ZICA.Entity.constructEntity = function (ent) {
            var result = new ZICA.Entity();
            for (var key in ent) {
                if (key === '__image')
                    continue;
                if (key.substring(0, 4) == "__on" && key.substring(key.length - 6) == "String") {
                    //all function strings will be of the form __<FuncName>String
                    var memName = key.substring(0, key.lastIndexOf("String"));
                    var func = new Function("event", ent[key]);
                    result[memName] = func;
                }
                result[key] = ent[key];
            }
            return result;
        };
    
   