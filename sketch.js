
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var tree_x;
var clouds;
var mountains;
var canyons;
var collectable;

var game_score;
var flagpole;
var lives;

var platforms;

var enemies;


var jumpSound;
var hurtSound;
var lostSound;
var coinSound;
var victorySound;
var backgroundSound;
var img;
var myFont;











function preload()
{	
    soundFormats('mp3','wav');
	
	//jump 
    jumpSound = loadSound("assets/mixkit-player-jumping-in-a-video-game-2043.wav");
    jumpSound.setVolume(0.1);
	
	//hurt 
	hurtSound =loadSound("assets/ES_Human Grunt 1 - SFX Producer.mp3")
	hurtSound.setVolume(0.2);
	
	//GameOver 
	lostSound =loadSound("assets/ES_Video Game Descend 8 - SFX Producer.mp3");
	lostSound.setVolume(0.4);
	
	//collectable 
	coinSound=loadSound("assets/Mario Coin Sound - Sound Effect (HD).mp3")
	coinSound.setVolume(0.1);

	//victory
	victorySound=loadSound("assets/ES_PE-Music 22 - SFX Producer.mp3")
	victorySound.setVolume(0.2);

	//background
	backgroundSound=loadSound("assets/mellow-lo-fi-keys-soft-loop_137bpm_C_minor.wav");
	backgroundSound.setVolume(0.2);

	//enemy image
	img=loadImage("assets/ghost_PNG36.png");

	//title font
	myFont=loadFont("assets/Olondon_.otf");
	
}




function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives =3;
	startGame();

}

//toggle background music
function togglePlaying()
{	
	if(!backgroundSound.loop())
	{
		backgroundSound.loop();
	}
	backgroundSound.pause();
	
}

function startGame()
{

	gameChar_x = width/2;
	gameChar_y = floorPos_y;


	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	canyons_width=90;

	// Initialise arrays of scenery objects.
	trees_x =[-1000,-500,-200,100,500,1000,1200,2000];
	clouds =[{pos_x:100,pos_y:50},{pos_x:570,pos_y:150},{pos_x:800,pos_y:200}];
	mountains=[ 
        {x_pos: 100, y_pos: floorPos_y},
        {x_pos: 300, y_pos: floorPos_y},
        {x_pos: 800,y_pos: floorPos_y},
        {x_pos: 1000, y_pos: floorPos_y},
        {x_pos: 2000, y_pos: floorPos_y},
        {x_pos: -200, y_pos: floorPos_y},
         ];
	collectable = [{x_pos: 150, y_pos: floorPos_y, size: 25,isFound:false},{x_pos: 440, y_pos:floorPos_y, size: 25,isFound:false},
			{x_pos: 1000, y_pos:floorPos_y, size:25,isFound:false},{x_pos: 1300, y_pos:floorPos_y, size:25,isFound:false},{x_pos:120, y_pos:floorPos_y-113, size:25,isFound:false},
			{x_pos: 600, y_pos:floorPos_y-113, size:25,isFound:false},{x_pos: 950, y_pos:floorPos_y-260, size:25,isFound:false},{x_pos: 1250, y_pos:floorPos_y-300, size:25,isFound:false},{x_pos: 1220, y_pos:floorPos_y-175, size:25,isFound:false}]

	canyons = [{x_pos:300,y_pos: floorPos_y,width: canyons_width},
				{x_pos:800,y_pos: floorPos_y,width: canyons_width},
			  	{x_pos:1600,y_pos: floorPos_y,width: canyons_width},];

	game_score =0;
	flagpole = {isReached: false,x_pos:2000};



	platforms = [];
	platforms.push(new Platform(100,floorPos_y-100,100));
	platforms.push(new MovingPlatform(800,floorPos_y-100,100,200));
	platforms.push(new Platform(1200,floorPos_y-160,200));
	platforms.push(new Platform(500,floorPos_y-100,200));
	
	

	//platform class
	for(var i=0;i<5;i++)
	{
		
		platforms.push(new Platform(platforms.at(-2).x+150,platforms.at(-2).y-60,100))
	}


	//enemy class
	enemies =[];
	enemies.push(new Enemy(100,floorPos_y-10,100));
	enemies.push(new Enemy(650,floorPos_y-10,100));
	enemies.push(new Enemy(1000,floorPos_y-10,100));
	enemies.push(new Enemy(1400,floorPos_y-10,100));
	enemies.push(new Enemy(1800,floorPos_y-10,100));


	
    

}

function draw()
{	

	
	background(25 , 25 ,112); // filal the sky blue

	noStroke();
	fill(128, 128  , 0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
	push();
  	translate(scrollPos,0);

	// Draw clouds.
	drawClouds();

	// Draw mountains.
	drawMountains();
	// Draw trees.
	drawTrees();
	// Draw canyons.
	for( var i=0; i<canyons.length; i++){
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}



	//Draw Platform
	for(var i=0;i<platforms.length;i++)
	{
		platforms[i].draw();
		platforms[i].update();
	}
	

	// Draw collectable items.
	for (var i=0; i < collectable.length; i++){



		if(collectable[i].isFound == false){
		drawCollectable(collectable[i]);
        checkCollectable(collectable[i]);}
		
	}

	//draw enemy
	for(var i=0;i<enemies.length;i++)
	{
		enemies[i].draw();
	}

	renderFlagpole();
	
	pop();

	
	
	// Draw lifetoken
	for(var i = 0; i < lives; i ++)
    {
        hearts(880 + i * 60, 40);
    }




	// Draw game character.
	drawGameChar();


	//scoreboard titles
	fill(255);
	noStroke(0);
	textSize(15);
	text("score : " +  game_score,30,20);
    text("life : " +  lives,30,30);
	
	//game title
	textFont(myFont);
	textSize(60);
	text("Selenium Forest", width/2 ,height/10);
	textAlign(CENTER,TOP);
	
	//game progress indicator

	if(lives<1)
	
            {
                
				text("Game Over. Press refresh to continue", width * 1/2, height * 2/5);
				lostSound.play();
				releaseTime();
			
			
				
				
				return;
			
            }
    if(flagpole.isReached == true)
            {
                text("Level Complete !", width * 1/2, height * 2/5);
				victorySound.play();
				releaseTime();
				
                return;
				
            }



	//Character Plummeting
	if(isPlummeting==true){
		gameChar_y +=11;
		hurtSound.play();
	}

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if(gameChar_y <floorPos_y)
	{	
		var isContact =false;
		for(var i=0;i<platforms.length;i++)
		{	
			if(platforms[i].checkContact(gameChar_world_x,gameChar_y))
			{gameChar_y=platforms[i].y;
				isContact = true;
				isFalling=false;
				if(platforms instanceof MovingPlatform)
				{
					gameChar_world_x=platforms.x;
				}
				
				break;
			}
		}

		if(!isContact)
		{
		gameChar_y +=2;
		isFalling =true;
		
		}
	}
	else
	{
		isFalling = false;
	}


    //checkflagpole
	if(flagpole.isReached == false)
	{
	    checkFlagpole();
	}

	//check enemy in contact with character
	for(var i=0;i<enemies.length;i++)
	{
		
		var isContactEnemies=enemies[i].checkContact(gameChar_world_x,gameChar_y);

		if(isContactEnemies)
		{	hurtSound.play();
		
			lives -=1;
			if(lives>0)
			{
				startGame();
				break;
			}
		}

	}

    //checkplayerdies
    checkPlayerDie();

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}



// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	if(key == "A" || keyCode == 37)
	{
		isLeft =true;
	}

	if(key == "D" || keyCode ==39)
	{
		isRight =true;
	} 

	if(key == "" || key == "W")
	{
		if(!isFalling)
		{
			gameChar_y -= 100;
			jumpSound.play();
		}

	}
	
	//music play when player moves and prevent sound overlaps
	if(keyCode=77 && togglePlaying())
	{
		togglePlaying();
	}
	else togglePlaying=false;

	


}

function keyReleased()
{

	if(key == "A" || keyCode == 37)
	{
		isLeft =false;
	}

	if(key == "D" || keyCode ==39)
	{
		isRight =false;
	} 


}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		fill(0);
    
		fill(255 ,239 ,213);
		ellipse(gameChar_x,gameChar_y-50,35,30);
		
		fill(250,0,0);
		rect(gameChar_x-13,gameChar_y-40,24,35);
		
		
		fill(255 ,239 ,213);
		rect(gameChar_x,gameChar_y-10,10,8);
		 rect(gameChar_x-12,gameChar_y-5,10,8);
		
		fill(255 ,239 ,213);
		rect(gameChar_x-5,gameChar_y-35,8,20);
	  
	   
		fill(178  ,34 , 34);
		rect(gameChar_x-7,gameChar_y-39,12,5);

		fill(0)
   	 	ellipse(gameChar_x-10,gameChar_y-50,5,5);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		fill(0);
   
    
   	 	fill(255 ,239 ,213);
    	ellipse(gameChar_x,gameChar_y-50,35,30);
    
    	fill(250,0,0);
    	rect(gameChar_x-13,gameChar_y-40,24,35);
    
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x,gameChar_y-10,10,8);
     	rect(gameChar_x-12,gameChar_y-5,10,8);
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x-5,gameChar_y-35,8,20);
  
   
    	fill(178  ,34 , 34);
    	rect(gameChar_x-7,gameChar_y-39,12,5);
    
 
    
    	fill(0)
    	ellipse(gameChar_x+10,gameChar_y-50,5,5);

	}
	else if(isLeft)
	{
		// add your walking left code
		fill(0);
 
    
    	fill(255 ,239 ,213);
    	ellipse(gameChar_x,gameChar_y-50,35,30);
    
    	fill(250,0,0);
    	rect(gameChar_x-13,gameChar_y-40,24,35);
    
    
    	fill(255 ,239 ,213);
   	 	rect(gameChar_x,gameChar_y-5,10,8);
     	rect(gameChar_x-12,gameChar_y-5,10,8);
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x-5,gameChar_y-35,8,20);
   
    
    	fill(178  ,34 , 34);
    
    	rect(gameChar_x-7,gameChar_y-39,12,5);
   
    	fill(0)
    	ellipse(gameChar_x-10,gameChar_y-50,5,5);

	}
	else if(isRight)
	{
		// add your walking right code
		fill(0);
 
    
		fill(255 ,239 ,213);
		ellipse(gameChar_x,gameChar_y-50,35,30);
		
		fill(250,0,0);
		rect(gameChar_x-13,gameChar_y-40,24,35);
		
		
		fill(255 ,239 ,213);
		rect(gameChar_x,gameChar_y-5,10,8);
		rect(gameChar_x-12,gameChar_y-5,10,8);
		
		fill(255 ,239 ,213);
		rect(gameChar_x-5,gameChar_y-35,8,20);
	   
		
		fill(178  ,34 , 34);
		
		rect(gameChar_x-7,gameChar_y-39,12,5);
	   
		
		fill(0)
		ellipse(gameChar_x+10,gameChar_y-50,5,5);
    
		

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		fill(0);
    
    
    	fill(255 ,239 ,213);
    	ellipse(gameChar_x,gameChar_y-50,35,30);
    
    	fill(250,0,0);
    	rect(gameChar_x-13,gameChar_y-40,24,35);
    
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x,gameChar_y-10,10,8);
     	rect(gameChar_x-12,gameChar_y-5,10,8);
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x-23,gameChar_y-55,8,20);
    	rect(gameChar_x+15,gameChar_y-55,8,20);
    
    	fill(178  ,34 , 34);
    
    	rect(gameChar_x-23,gameChar_y-39,10,5);
    	rect(gameChar_x+10,gameChar_y-39,10,5);
    
    	fill(0)
    	ellipse(gameChar_x+10,gameChar_y-50,5,5);
    	ellipse(gameChar_x-10,gameChar_y-50,5,5);
    
	}
	else
	{
		// add your standing front facing code
		fill(0);
   
    
    	fill(255 ,239 ,213);
   	 	ellipse(gameChar_x,gameChar_y-50,35,30);
    
    	fill(250,0,0);
    	rect(gameChar_x-13,gameChar_y-40,24,35);
    
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x,gameChar_y-5,10,8);
     	rect(gameChar_x-12,gameChar_y-5,10,8);
    
    	fill(255 ,239 ,213);
    	rect(gameChar_x-20,gameChar_y-39,8,20);
    	rect(gameChar_x+10,gameChar_y-39,8,20);
    
    	fill(178  ,34 , 34);
   
    	rect(gameChar_x-22,gameChar_y-39,10 ,5);
    	rect(gameChar_x+10,gameChar_y-39,10,5);
    
    	fill(0)
    	ellipse(gameChar_x+10,gameChar_y-50,5,5);
    	ellipse(gameChar_x-10,gameChar_y-50,5,5);

	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
	for(var i=0; i < clouds.length; i++)
	{
		fill(255);
		ellipse(clouds[i].pos_x,clouds[i].pos_y,55,55);
		ellipse(clouds[i].pos_x+25,clouds[i].pos_y,35,35);
		ellipse(clouds[i].pos_x+45,clouds[i].pos_y,25,25);
	}

}

// Function to draw mountains objects.
function drawMountains()
{
	for (var i = 0; i < mountains.length; i++) 
    {
        
        fill(75,0 ,130);
        
        triangle(mountains[i].x_pos, 
            	mountains[i].y_pos, 
            	mountains[i].x_pos + 150, 
            	mountains[i].y_pos - 415,
            	mountains[i].x_pos + 350, mountains[i].y_pos); 
	}

}

// Function to draw trees objects.
function drawTrees()
{
	for(var i = 0; i< trees_x.length; i++)
	{
		fill(100,50,0);
		rect(75 + trees_x[i],-100+floorPos_y,50,100)
		fill(107, 142 , 35);

		triangle(trees_x[i],-200/4 +floorPos_y,trees_x[i]+100,-200*3/4 +floorPos_y,trees_x[i]+200,-200/4+floorPos_y);
		triangle(trees_x[i],-200/7 +floorPos_y,trees_x[i]+100,-200*3/7 +floorPos_y,trees_x[i]+200,-200/7+floorPos_y);
		triangle(trees_x[i] +25,-200/2 + floorPos_y,trees_x[i]+100,-200 +floorPos_y,trees_x[i]+175,-200/2 +floorPos_y);

	}

}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	fill(75   ,0 ,130);
	rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, t_canyon.width + 150)
	
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{	

	
	if(gameChar_world_x>t_canyon.x_pos && gameChar_world_x<t_canyon.x_pos+t_canyon.width && gameChar_y>= floorPos_y)
	{
		isPlummeting =true;
		
	}

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{	noStroke();
	fill(255, 255 ,255);

	rect(t_collectable.x_pos , t_collectable.y_pos-5,t_collectable.size+10,20)

	fill(255,0,0)
	rect(t_collectable.x_pos+14 , t_collectable.y_pos-2,t_collectable.size-20,10)

	fill(255,0,0)
	rect(t_collectable.x_pos+24 , t_collectable.y_pos,t_collectable.size-40,5)

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<20)
     {

		t_collectable.isFound = true;
		game_score += 1 ;
		coinSound.play();
		
	}
}

function renderFlagpole()
{
	push()
	strokeWeight(5);
	stroke(100);
	line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y-250);
	
	fill(255,0,255);
	noStroke();



	if(flagpole.isReached)
	{
		rect(flagpole.x_pos,floorPos_y-250,50,50)
	}
	else
	{
		rect(flagpole.x_pos,floorPos_y-50,50,50)
	}


	pop();

}



function checkFlagpole()
{
	var d= abs(gameChar_world_x -flagpole.x_pos);
	

	if(d <15)
	{
		flagpole.isReached = true;
	}

}

function checkPlayerDie()
{   
	if(gameChar_y>height)
	{
		lives -= 1;
		if(lives>0)
		{
			startGame();
		}
	}

}


function hearts(x, y)
{
    fill(255, 0, 0);
    beginShape()
    vertex(x , y);
    vertex(x - 15, y - 15);
    vertex(x + 15, y - 15);
    endShape();
    ellipse(x - 7.5, y - 22.5, 21, 21);
    ellipse(x + 7.5, y - 22.5 ,21, 21)
    
}

function Enemy(x,y,range)
{
	this.x =x;
	this.y =y;
	this.range =range;
	this.currentX  =x  ;
	this.inc =1;

	this.update = function()
	{
		this.currentX += this.inc;
		if(this.currentX>= this.x + this.range)
		{
			this.inc = -1;
		}

		else if(this.currentX <this.x)
		{
			this.inc =1;
		}
	}

	this.draw =function()
	{	this.update();
		noStroke();
		
		image(img,this.currentX,this.y-30,60,70);
	
	}


	this.checkContact =function(gc_x,gc_y)
	{	
		var d=dist(gc_x,gc_y,this.currentX,this.y)
		if(d<20)
		{
			return true;
		}
		return false;

	}
}



class Platform
{
	constructor(x,y,length)
	{
		this.x=x;
		this.y=y;
		this.length=length;
	}




		draw()
		{
			stroke(0,0,0);
			fill(47 , 79 , 79);
			
			rect(this.x,this.y,this.length,20);
		}

		update(){}

		checkContact(gc_x,gc_y)
		{

			if(gc_x > this.x && gc_x<this.x + this.length)
			{	var d=this.y -gc_y;
				if(d>=0 &&d<5)
				{
					return true;
				}
				
			}
			return false;
		}
}

class MovingPlatform extends Platform
{	constructor(x,y,length,range)
	{
	super(x,y,length);
	this.range =range;
	this.direction =1;
	this.anchor =x;}

	update()
	{
		if(abs(this.anchor -this.x>this.range))
		{this.direction *=-1;}
		this.x += this.direction;

	}

}