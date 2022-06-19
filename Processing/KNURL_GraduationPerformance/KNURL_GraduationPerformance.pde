import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.driangle.starfish.client.StarfishClient;

//GRADUATION PERFORMANCE FOR KNURL: RAFAELE ANDRADE
//LARGE FLOOR PROJECTION
//BY @SABRINAVERHAGE

int STATE = 1;
float BG_refresh = 0;

//STARFISH STUFF
//===> GO INTO THE TAB TO SET THE RIGHT IP ADDRESS!
starfishConnector connect;

int[] isconnected = new int[4];

//PARTICLE STUFF
ArrayList<ParticleSystem> systems;

//OTHER GRAPHIC STUFF
boolean showCircles = true;


void setup() {
  background(0);
  //1920 1200
  size(1280, 800);
  //fullScreen(0);
  
  //colorMode(HSB, 100);
  
  surface.setTitle("KNURL");
  surface.setResizable(false);
  //surface.setLocation(100, 100);
  
  connect = new starfishConnector();
  
  systems = new ArrayList<ParticleSystem>();
  setupSystem();
  
  changeState(0);
}

//////////////////////////////////////////////////////// MAIN DRAW
void draw() {
  //background(0);
  
  //frameRate(15);
  fill(0, BG_refresh);
  noStroke();
  rect(0, 0, width, height);
  
  connect.update(); //starfish update
  
  switch(STATE) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    default:
      break;
  }

  for(int i = 0; i < systems.size(); i++) {
    systems.get(i).run();

    if (systems.get(i).isDead()) {
      println("removing the particle system");
      systems.remove(i);
    }
  }
  
  if(showCircles) {
    for(int i = 0; i < 8; i++) {
      float x = (height/2-130) * cos(TWO_PI/8*i+TWO_PI/16) + width/2;
      float y = (height/2-130) * sin(TWO_PI/8*i+TWO_PI/16) + height/2;
      int size = 150;
      
      noFill();
      stroke(255);
      ellipse(x, y, size, size);
      
      //check if connected
      stroke(50);
      int j = floor(i/2);
      if(isconnected[j] > 0) ellipse(x, y, size-10, size-10);
      if(isconnected[j] > 1) ellipse(x, y, size-20, size-20);
      
    }
  }

}

void setupSystem() {
  //systems.add(new ParticleSystem(400, new PVector(random(width),random(height))));
  
  systems.add(new ParticleSystem(400, 1, new PVector(width/2, height/2)));
  
}

void updateSystem() {
  //systems. 
  
}


//////////////////////////////////////////////////////// STATE CONTROL
void changeState(int newState) {
  background(0); //refresh background
  if(STATE != newState) {
    
    //remove all running particle systems
    for(int i = 0; i < systems.size(); i++) {
      systems.remove(i);
    }
    
    //to get ready for new setup
    
    switch(newState) {
      case 0:
        showCircles = true;
        BG_refresh = 5;
        systems.add(new ParticleSystem(1000, 0, new PVector(width/2, height/2)));
        break;
      case 1:
        showCircles = true;
        systems.add(new ParticleSystem(500, 1, new PVector(width/2, height/2)));
        break;
      case 2:
        showCircles = true;
        systems.add(new ParticleSystem(500, 2, new PVector(width/2, height/2)));
        break;
      default:
        showCircles = false;
        break;
    }
    
    STATE = newState; 
    println("new state = " + STATE);
  }
}

//////////////////////////////////////////////////////// INTERACTIONS
void mousePressed() {

}

void keyPressed() {
  if(key == 'c') {
    showCircles = !showCircles;
  }
  
  //test particle system
  if(key == 't') {
    setupSystem(); 
  }
}
