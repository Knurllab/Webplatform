class Particle {
  int numid;
  
  PVector position;
  PVector velocity;
  PVector acceleration;
  PVector direction;

  float incr = 0;
  float theta;
  float c_noise;
  
  float mass = 10;
  float amagvar;
  int adirvar = 1;
  boolean flicker = false;
  int flickerspeed = 10;
  float shakeval = 0;
  
  boolean limitlife = false;
  float lifespan;
  
  color c;
  
  int MODE = 0;
  boolean towrap = true;

  Particle(PVector l, color cIn, int mynum, int themode) {
    mass = random(10, 15);
    numid = mynum;
    
    adirvar = floor(random(2));
    if(adirvar == 0) adirvar = -1;
    
    position = l.copy();
    lifespan = random(500, 1000);
    
    acceleration = new PVector(0,0);
    velocity = new PVector(random(-1,1),random(-1,1)); //random directions
    //velocity = new PVector(1 * cos(mynum+PI), 1 * sin(mynum+PI)); //circle direction   
    direction = new PVector(-.3, .3);
    
    float section = TWO_PI/500; //how to get the particle nums
    
    MODE = themode;
    switch(MODE) {
      case 0:
        direction = new PVector(-1.5, 1.5);
        limitlife = false;
        break;
      case 1:
        towrap = false;
        velocity = l.copy(); //copyo the start position?
        amagvar = random(4, 6);
        velocity.setMag(amagvar); //speed?
        //position.setMag(height/2-200); //size of circle?
        velocity.rotate(HALF_PI);
        
        limitlife = false;
        break;
      case 2:
        towrap = false;
        lifespan = random(150);
        
        //println(mynum);
        direction = new PVector(3 * cos(section*mynum+PI), 3 * sin(section*mynum+PI)); //circle direction
        limitlife = true;
        
        break;
      case 3:
        towrap = false;
        //velocity = l.copy();
        amagvar = 1;
        velocity.setMag(amagvar); //speed?
        //position.setMag(20); //size of circle?
        
        limitlife = false;
        break;
      case 4:
        towrap = false;
        velocity = l.copy();
        amagvar = random(1, 2.5);
        velocity.setMag(amagvar); //speed?
        velocity.rotate(HALF_PI*adirvar);
        
        limitlife = false;
        break;
      case 5:
        towrap = false;
        velocity = l.copy(); //copyo the start position?
        amagvar = random(2, 4);
        velocity.setMag(amagvar); //speed?
        //position.setMag(height/2-200); //size of circle?
        velocity.rotate(HALF_PI);
        
        limitlife = false;
        break;
      case 6:
        towrap = false;
        lifespan = random(150);
        section = TWO_PI/100;
        direction = new PVector(3 * cos(section*mynum+PI), 3 * sin(section*mynum+PI)); //circle direction
        limitlife = true;
        
        break;
      case 7:
        towrap = false;
        lifespan = random(180, 200);
        
        amagvar = random(5, 15);
        velocity.setMag(amagvar);

        limitlife = true;        
        break;
      case 8:
        mass = random(3, 6);
        towrap = false;
        lifespan = random(180, 200);
        direction = new PVector(0, 0);
        
        amagvar = 3;
        velocity.setMag(amagvar);

        limitlife = true;        
        break;
      default:
        towrap = true;
        limitlife = true;
        break;
    }
    
    c = cIn;
    
    
  }
  
  void applyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acceleration.add(f);
  }

  void run() {
    update();
    display();
  }

  // Method to update position
  void update() {

    incr +=  .008 * direction.x;
    theta = noise(position.x * .008, position.y * .008, incr) * TWO_PI;
    
    switch(MODE) {
      case 0:
        //moving with noise
        velocity.set(1 * cos(theta) * direction.x, 1 * sin(theta) * direction.y); 
        break;
      case 1:

        break;
      case 2:
        velocity.set(-.5 * cos(theta) * direction.x, .5 * sin(theta) * direction.y); 
        break;
      case 4:
      
        break;
      case 6:
        velocity.set(-.5 * cos(theta) * direction.x, .5 * sin(theta) * direction.y); 
        break;
      case 7:
        velocity.set(1 * cos(theta) * direction.x, 1 * sin(theta) * direction.y); 
        break;
      case 8:
        int c_scale = 600;
        c_noise = noise(position.x/c_scale, position.y/c_scale);
        direction.x = map(c_noise, 0, 1, 0.5, 1) * TAU * c_scale;
        direction.y = map(c_noise, 0, 1, 0.5, 1) * TAU * c_scale;
        velocity.set(cos(direction.x)/0.9, sin(direction.y)/0.9);
        break;
      default:
        break;
    }
      
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0);

    if(limitlife) lifespan -= 1.0;
    
  }

  // Method to display
  void display() {
    //stroke(0,lifespan);
    //strokeWeight(2);

    noStroke();
    //fill(255);
    if(flicker && frameCount%flickerspeed == 0) fill(255);
    else fill(c);
    ellipse(position.x+random(-shakeval, shakeval), position.y+random(-shakeval, shakeval), mass, mass);
    
    if(towrap) wrap();
  }
  
  void setFlicker(float thevalue) {
    flicker = true;
    flickerspeed = floor(thevalue);
  }
  
  void setMagnitude(float thevalue) {
    velocity.setMag(amagvar - thevalue); 
    println(amagvar);
    println(thevalue);
    
  }
  
  void setShake(float thevalue) {
    shakeval = thevalue;
  }
  
  void wrap() {
    if(position.x < 0) position.x = width;
    if(position.x > width) position.x = 1;
    if(position.y < 0) position.y = height;
    if(position.y > height) position.y = 1;
  }
  
  // Is the particle still useful?
  boolean isDead() {
    if (lifespan < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}
