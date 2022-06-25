import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.driangle.starfish.client.StarfishClient;

//GRADUATION PERFORMANCE FOR KNURL: RAFAELE ANDRADE
//LARGE FLOOR PROJECTION
//BY @SABRINAVERHAGE

boolean DEBUG = true;
int STATE = 1;
float BG_refresh = 0;

PVector masterTranslate = new PVector(0, 0);

//STARFISH STUFF
//===> GO INTO THE TAB TO SET THE RIGHT IP ADDRESS!
starfishConnector connect;

class AudienceData {
  float[] kleur = new float[3]; 
  int groupnum;
  float[] thesliders = new float[4];
  int connect;
}

Map<String, AudienceData> audience = new HashMap<String, AudienceData>();

class CoreData {
  int state;
  int[] active = new int[4];
}

Map<String, CoreData> core = new HashMap<String, CoreData>();

int[] isconnected = new int[4];
int[] clickconnect = new int[4];
int[] isactive = new int[4];
float[][] avgsliders = new float[4][4];
color[] thecolors = new color[4];

//PARTICLE STUFF
ArrayList<ParticleSystem> systems;

//OTHER GRAPHIC STUFF
boolean showCircles = false;


void setup() {
  background(0);
  //PROJECTOR 1920 1200
  size(1920, 1200);
  //size(1280, 800);
  //fullScreen(2);
  
  //smooth();
  
  surface.setTitle("KNURL");
  surface.setResizable(true);
  //surface.setLocation(100, 100);
  
  connect = new starfishConnector();
  
  systems = new ArrayList<ParticleSystem>();
  setupSystem();
  
  for(int i = 0; i < 4; i++) {
    for(int j = 0; j < 4; j++) {
      avgsliders[i][j] = 0; 
    }
  }
  
  thecolors[0] = color(147, 235, 228);
  thecolors[1] = color(167, 196, 255);
  thecolors[2] = color(255);
  thecolors[3] = color(205, 180, 247);
  
  changeState(0);
}

//////////////////////////////////////////////////////// MAIN DRAW
void draw() {
  

  
  //background(0);
  
  //for(int i = 0; i < 4; i++) {
  //  for(int j = 0; j < 4; j++) {
  //    println(avgsliders[i][j]);
  //  }
  //}
  
  //println(isconnected);
  
  frameRate(15);
  fill(0, BG_refresh);
  noStroke();
  rect(0, 0, width, height);
  
  connect.update(); //starfish update
  
  translate(masterTranslate.x, masterTranslate.y);
  
  ////////////draw the particle systems last?
  for(int i = 0; i < systems.size(); i++) {
    systems.get(i).run();

    if (systems.get(i).isDead()) {
      println("removing the particle system");
      systems.remove(i);
    }
  }
  
  ///////////draw the circles
  if(showCircles) {
    strokeWeight(4);
    //draw the circles
    for(int i = 0; i < 8; i++) {
      float x = (height/2-80) * cos(TWO_PI/10*i-TWO_PI/10) + width/2;
      float y = (height/2-80) * sin(TWO_PI/10*i-TWO_PI/10) + height/2;
      int size = 150;
      
      noFill();
      //stroke(100);
      //ellipse(x, y, size, size);
      
      //check if connected
      int j = floor(i/2); //////////creat a j from i
      if(j >= 4) j = 3;
      if(isconnected[j] > 0) {
        if(clickconnect[j] > 0) {
          //stroke(thecolors[j]);
          stroke(red(thecolors[j])+(avgsliders[j][2]*100), green(thecolors[j]), blue(thecolors[j])-(avgsliders[j][2]*100));
        } else {
          stroke(0);
        }
        ellipse(x, y, size, size);
        
        if(clickconnect[j] > 0) fill(thecolors[j]);
        else fill(100);
        textAlign(CENTER);
        textSize(25);
        if(STATE == 0) {
          switch(j) {
            case 0:
              //text("PERCUSSION", x, y+8);
              drawtextcircle("PERCUSSION", new PVector(x, y), 0);
              break;
            case 1:
              //text("NOISE", x, y+8);
              drawtextcircle("NOISE", new PVector(x, y), 1);
              break;
            case 2:
              //text("TEST", x, y+8);
              drawtextcircle("TEST", new PVector(x, y), 2);
              break;
            case 3:
              //text("AMBIENT", x, y+8);
              drawtextcircle("AMBIENT", new PVector(x, y), 3);
              break;
          }
        }
      }
      
      if(DEBUG) {
        //no red circles during STATE 0
        if(isactive[j] > 0 && STATE > 0) {
          stroke(255, 50);
        } else {
          stroke(0); 
        }
        noFill();
        if(STATE != 8 && STATE != 0) ellipse(x, y, size+30, size+30);
        

      }
      
    }
  }
  
  if(DEBUG) {
    textSize(12);
    textAlign(LEFT);
    fill(255);
    text("PHASE: " + STATE, 30, height-20); 
    //println(isconnected);
  }
  


}

void setupSystem() {
  systems.add(new ParticleSystem(100, 3, new PVector(width/2, height/2), false, 0));
  
}

void updateSystem() {
  //systems. 
  
}


//////////////////////////////////////////////////////// STATE CONTROL
void changeState(int newState) {

  if(STATE != newState) {
    
    int theseed = floor(random(100));
    noiseSeed(theseed);
    println("the noise seed: " + theseed);
    
    background(0);
    //remove all running particle systems
    //for(int i = 0; i < systems.size(); i++) {
    //  systems.remove(i);
    //}
    while (systems.size() > 0) {
      for(int i = 0; i < systems.size(); i++) {
        systems.remove(i);
      }
    }
    
    //to get ready for new setup
    
    switch(newState) {
      case 0:
        ///////////////////NOISE LINES PHASE 0
        showCircles = true;
        BG_refresh = 10;
        systems.add(new ParticleSystem(400, 0, new PVector(width/2, height/2), false, 0));
        break;
      case 1:
        ///////////////////PARTICLES GOING INWARDS: CIRCLING THE CENTER
        showCircles = true;
        BG_refresh = 20;
        
        for(int i = 0; i < 8; i++) {
          systems.add(new ParticleSystem(20, 1, new PVector(width/2, height/2), true, i));
        }
        
        systems.add(new ParticleSystem(50, 1, new PVector(width/2, height/2), false, 0));
        
        break;
      case 2:
        ///////////////////PARTICLES AROUND THEIR OWN UNIVERSE
        BG_refresh = 40;
        showCircles = true;
        
        for(int i = 0; i < 8; i++) {
          //the starting points
          float x = (height/2-80) * cos(TWO_PI/10*i-TWO_PI/10) + width/2;
          float y = (height/2-80) * sin(TWO_PI/10*i-TWO_PI/10) + height/2;
          systems.add(new ParticleSystem(30, 4, new PVector(x, y), true, i));
        }
        break;
      case 3:
        ///////////////////PARTICLES IN A PETRI DISH
        BG_refresh = 30;
        showCircles = true;
        //systems.add(new ParticleSystem(500, 2, new PVector(width/2, height/2), false, 0));
        
        
        for(int i = 0; i < 8; i++) {
          //the starting points
          float x = (height/2-80) * cos(TWO_PI/10*i-TWO_PI/10) + width/2;
          float y = (height/2-80) * sin(TWO_PI/10*i-TWO_PI/10) + height/2;
          systems.add(new ParticleSystem(30, 3, new PVector(x, y), true, i));
        }
        break;
      case 4:
        ///////////////////BIRDS NEST
        BG_refresh = 255;
        showCircles = true;
        systems.add(new ParticleSystem(20, 5, new PVector(width/2, height/2), false, 0));
        
        for(int i = 0; i < 8; i++) {
          systems.add(new ParticleSystem(30, 5, new PVector(width/2, height/2), true, i));
        }
        break;
      case 5:
        ///////////////////CURL PARTICLES!!!
        noiseSeed(86); //47 //86 //6 //94
        showCircles = true;
        BG_refresh = 5;
        systems.add(new ParticleSystem(500, 8, new PVector(width/2, height/2), false, 0));
        
        for(int i = 0; i < 8; i++) {
          //the starting points
          systems.add(new ParticleSystem(100, 8, new PVector(width/2, height/2), true, i));
        }

        break;
      case 6:
        ///////////////////PARTICLES SHOOTING FROM SIDE TO CENTER
        showCircles = true;
        BG_refresh = 10;
        
        for(int i = 0; i < 8; i++) {
          //the starting points
          float x = (height/2-80) * cos(TWO_PI/10*i-TWO_PI/10) + width/2;
          float y = (height/2-80) * sin(TWO_PI/10*i-TWO_PI/10) + height/2;
          systems.add(new ParticleSystem(10, 7, new PVector(x, y), true, i));
        }
        break;
      case 7:
        ///////////////////COMING TOGETHER
        BG_refresh = 10;
        showCircles = true;
        systems.add(new ParticleSystem(500, 2, new PVector(width/2, height/2), false, 0));
        
        for(int i = 0; i < 8; i++) {
          //the starting points
          float x = (height/2-80) * cos(TWO_PI/10*i-TWO_PI/10) + width/2;
          float y = (height/2-80) * sin(TWO_PI/10*i-TWO_PI/10) + height/2;
          systems.add(new ParticleSystem(500, 2, new PVector(width/2, height/2), true, i));
        }
        break;
      case 8:
        ///////////////////THE END
        BG_refresh = 7;
        showCircles = true;
        systems.add(new ParticleSystem(100, 6, new PVector(width/2, height/2), false, 0));
        break;
      default:
        showCircles = true;
        BG_refresh = 0;
        systems.add(new ParticleSystem(200, 1, new PVector(width/2, height/2), false, 0));
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
    background(0);
    setupSystem(); 
  }
  
  if(key == 's') {
    int theseed = floor(random(100));
    noiseSeed(theseed);
    println("the noise seed: " + theseed);
  }
  
  if(key == 'j') {
    masterTranslate.x--;
    background(0);
  }
  
  if(key == 'l') {
    masterTranslate.x++;
    background(0);
  }
  
  if(key == 'k') {
    masterTranslate.y++;
    background(0);
  }
  
  if(key == 'i') {
    masterTranslate.y--;
    background(0);
  }
}

void drawtextcircle(String message, PVector position, int id) {
  pushMatrix();
  translate(position.x, position.y);
  // We must keep track of our position along the curve
  float arclength = 0;
  float r = 50;
  
  // For every box
  for (int i = 0; i < message.length(); i++) {
    // Instead of a constant width, we check the width of each character.
    char currentChar = message.charAt(i);
    float w = textWidth(currentChar);
    
    // Each box is centered so we move half the width
    arclength += w/2;
    // Angle in radians is the arclength divided by the radius
    // Starting on the left side of the circle by adding PI
    float theta = HALF_PI*id + arclength / r;
    
    pushMatrix();
    // Polar to cartesian coordinate conversion
    translate(r*cos(theta), r*sin(theta));
    // Rotate the box
    rotate(theta+PI/2); // rotation is offset by 90 degrees
    // Display the character
    //fill(0);
    text(currentChar,0,0);
    popMatrix();
    // Move halfway again
    arclength += w/2;
  }
  popMatrix();
}
