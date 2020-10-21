/**
 * 2d vector class, used for example for texture coordinates.
 * @class 2d vector class, used for example for texture coordinates.
 * @constructor
 * @param {Number} x x coordinate. Can be null.
 * @param {Number} y y coordinate.
 */
ZICA.Vect2d = function(x, y)
{
	if (x == null)
	{
		this.X = 0;
		this.Y = 0;
	}
	else
	{
		this.X = x;
		this.Y = y;
	}
}

/**
 * X coordinate of the vector
 * @public
 * @type Number
 */
ZICA.Vect2d.prototype.X = 0;

/**
 * Y coordinate of the vector
 * @public
 * @type Number 
 */
ZICA.Vect2d.prototype.Y = 0;

/**
 * Sets all 2 coordinates to new values
 * @private
 */
ZICA.Vect2d.prototype.set = function(x,y)
{
	this.X = x;
	this.Y = y;
}

/**
 * Creates a copy of this vector and returns it
 * @public
 * @type Vect2d
 */
ZICA.Vect2d.prototype.clone = function()
{
	return new ZICA.Vect2d(this.X,this.Y);
}
ZICA.Vect2d.prototype.add = function(other)
{
	return new ZICA.Vect2d(this.X+other.X, this.Y+other.Y);
}

ZICA.Vect2d.prototype.multiplyWithVect = function(v)
{
	return new ZICA.Vect2d(this.X * v.X, this.Y * v.Y);
}
ZICA.Vect2d.prototype.multiplyWithScal = function(v)
{
	return new ZICA.Vect2d(this.X*v, this.Y*v);
}
ZICA.Vect2d.prototype.multiplyThisWithScal = function(v)
{
	this.X *= v;
	this.Y *= v;
}
ZICA.Vect2d.prototype.getLength = function()
{
	return Math.sqrt(this.X*this.X + this.Y*this.Y );
}
ZICA.Vect2d.prototype.setLength = function(n)
{
	var l = this.X*this.X + this.Y*this.Y;
	if (l > -0.0000001 && l < 0.0000001)
		return;
		
	l = n / Math.sqrt(l);
	this.X *= l;
	this.Y *= l;
}
ZICA.Vect2d.prototype.substract = function(other)
{
	return new ZICA.Vect2d(this.X-other.X, this.Y-other.Y);
}

ZICA.Vect2d.prototype.normalize = function()
{
	var l = this.X*this.X + this.Y*this.Y;
	if (l > -0.0000001 && l < 0.0000001)
		return;
		
	l = 1.0 / Math.sqrt(l);
	this.X *= l;
	this.Y *= l;
}
ZICA.Vect2d.prototype.addToThis = function(other)
{
	this.X += other.X;
	this.Y += other.Y;
}

ZICA.Vect2d.prototype.equals = function(other)
{
	return (this.X == other.X) && (this.Y == other.Y);
}

ZICA.Vect2d.prototype.equalsZero = function()
{
	return (this.X == 0) && (this.Y == 0);
}
ZICA.Vect2d.prototype.getDistanceTo = function(v)
{
	var x = v.X - this.X;
	var y = v.Y - this.Y;
	
	return Math.sqrt(x*x + y*y);
}
