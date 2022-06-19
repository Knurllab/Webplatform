class Particle {
  int numid;
  PVector position;
  PVector velocity;
  PVector acceleration;
  PVector direction;
  
  float incr, theta;
  
  float degree;
  
  boolean limitlife = false;
  float lifespan;
  
  color c;
  
  int MODE = 0;

  Particle(PVector l, color cIn, int mynum, int themode) {
    numid = mynum;
    acceleration = new PVector(0,0);
    
    //set the direction of movement
    velocity = new PVector(random(-1,1),random(-1,1)); //random directions
    //velocity = new PVector(1 * cos(mynum+PI), 1 * sin(mynum+PI)); //circle direction
    
    position = l.copy();
    lifespan = random(500, 1000);
    //lifespan = 3000;
    
    MODE = themode;
    switch(MODE) {
      case 0:
        direction = new PVector(-.3, .3);
        limitlife = false;
        break;
      case 1:
        direction = new PVector(1 * cos(mynum+PI), 1 * sin(mynum+PI)); //circle direction
        limitlife = true;
        break;
      case 2:
        direction = new PVector(1 * cos(mynum+PI), 1 * sin(mynum+PI)); //circle direction
        limitlife = false;
        break;
      default:
        break;
    }
    
    c = cIn;
    
    
  }

  void run() {
    update();
    display();
  }

  // Method to update position
  void update() {
    
    
    incr +=  .008 * direction.x;
    theta = noise(position.x * .006, position.y * .004, incr) * TWO_PI;
    
    switch(MODE) {
      case 0:
        velocity.set(1 * cos(theta) * direction.x, 1 * sin(theta) * direction.y); 
        break;
      case 1:
        velocity.set(1 * cos(theta) * direction.x, 1 * sin(theta) * direction.y); 
        //posX += speed * cos(theta) * direction; //cos
        //posY += speed * sin(theta) * direction; //sin
        break;
      case 2:
        //degree+=0.001*numid*HALF_PI;
        degree+=0.001*TWO_PI+numid;
        velocity.set(cos(degree), sin(degree));
        break;
      default:
        break;
    }
      
    
    velocity.add(acceleration);
    position.add(velocity);
    

    if(limitlife) lifespan -= 1.0;
    
  }

  // Method to display
  void display() {
    //stroke(0,lifespan);
    //strokeWeight(2);

    noStroke();
    //fill(255);
    fill(c);
    ellipse(position.x, position.y, 5, 5);
    
    wrap();
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
