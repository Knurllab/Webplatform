// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A class for a draggable attractive body in our world

class Attractor {
  float mass;    // Mass, tied to size
  float G;       // Gravitational Constant
  PVector position;   // position
  boolean dragging = false; // Is the object being dragged?
  boolean rollover = false; // Is the mouse over the ellipse?
  PVector dragOffset;  // holds the offset for when object is clicked on
  
  int MODE = 0;

  Attractor(PVector myposition, int mode) {
    MODE = mode;
    
    //position = new PVector(width/2,height/2);
    position = myposition;
    
    switch(mode) {
      case 1:
        mass = 200; 
        G = 2;
        break;
      case 2:
        mass = 300; 
        G = 2;
        break;
      case 3:
        mass = 20; 
        G = .6;
        break;
      case 4:
        mass = 70; 
        G = 1;
        break;
      case 5:
        mass = 100; 
        G = 2;
        break;
      case 6:
        mass = 300; 
        G = 2;
        break;
      case 7:
        mass = 200; 
        G = 4;
        break;
      default:
        mass = 100; 
        G = 4;
        break;
    }
  
    //mass = 300; //related to the velocity
    //G = 3;
    dragOffset = new PVector(0.0,0.0);
  }

  PVector attract(Particle m) {
    // Calculate direction of force
    PVector force = PVector.sub(position,m.position);   
    // Distance between objects
    float d = force.mag();        
    switch(MODE) {
      case 1:
        d = constrain(d,10.0,80.0);        
        break;
      case 3:
        d = constrain(d,5.0,20.0);        
        break;
      case 4:
        d = constrain(d,5.0,40.0);        
        break;
      case 5:
        d = constrain(d,10.0,70.0);        
        break;
      case 7:
        d = constrain(d,10.0,30.0);        
        break;
      default:
        d = constrain(d,10.0,20.0);  
        break;
    }                     
    force.normalize();           
    // Calculate gravitional force magnitude
    float strength = (G * mass * m.mass) / (d * d);     
    force.mult(strength);                                
    return force;
  }

  // Method to display
  void display() {
    ellipseMode(CENTER);
    //strokeWeight(4);
    //stroke(0);
    if (dragging) fill (50);
    else if (rollover) fill(100);
    else fill(175,200);
    ellipse(position.x,position.y,mass*2,mass*2);
  }

  // The methods below are for mouse interaction
  void clicked(int mx, int my) {
    float d = dist(mx,my,position.x,position.y);
    if (d < mass) {
      dragging = true;
      dragOffset.x = position.x-mx;
      dragOffset.y = position.y-my;
    }
  }

  void hover(int mx, int my) {
    float d = dist(mx,my,position.x,position.y);
    if (d < mass) {
      rollover = true;
    } 
    else {
      rollover = false;
    }
  }

  void stopDragging() {
    dragging = false;
  }

  void drag() {
    if (dragging) {
      position.x = mouseX + dragOffset.x;
      position.y = mouseY + dragOffset.y;
    }
  }

}
