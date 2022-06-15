// Pixel-sized particles version, of 'surfs_up'.
// Particles are now directly noise driven omitting the flow field.
// Array[], particle, pixel, noise()
// Mouse click to reset, mouseX adjusts background clear.

Particle[] particles;
float alpha = 0;

int numparticles = 6000;

int direction = 1;

int speed = 5;

boolean wiggle = false;



void setup() {
  //1920 1200
  //size(960, 600);
  fullScreen(0);
  
  surface.setTitle("KNURL");
  surface.setResizable(false);
  //surface.setLocation(100, 100);
  
  background(0);
  noStroke();
  setParticles(1);
}

void draw() {

  frameRate(15);
  noStroke();
  //background(255);
  //alpha = map(mouseX, 0, width, 0,255);
  fill(0, alpha);
  rect(0, 0, width, height);

  
  for(int i = 0; i < particles.length; i++) {
    particles[i].move(); 
  }
  
  noFill();
  stroke(255);
  strokeWeight(5);
  //ellipse(width/2, height/2, height-100, height-100);
  fill(255);
  //ellipse(width/2, height/2, 100, 100);
  
  for(int i = 0; i < 8; i++) {
    float x = (height/2-100) * cos(TWO_PI/8*i) + width/2;
    float y = (height/2-100) * sin(TWO_PI/8*i) + height/2;
    int size = 150;
    noFill();
    stroke(255);
    //if(i == 0 || i == 3) {
    //  size = 200;
    //  if(frameCount%2==0) {
    //    fill(255);
    //  } else {
    //    fill(0);
    //  }
    //  noStroke();
    //}
    ellipse(x, y, size, size);
  }
  
  //ellipse(mouseX, mouseY, 50, 50);
  //println(mouseX, mouseY);
  
  fill(255);
  //ellipse(width/2+350,350, 300, 300);
}

void setParticles(int mode) {
  numparticles = floor(random(100, 3000));
  particles = new Particle[numparticles];
  
  int themodulo = floor(random(10, 100));
  //println(themodulo);
  
  for (int i = 0; i < particles.length; i++) { 
    float x = 0;
    float y = 0;
    switch(mode) {
      case 0:
        x = random(width);
        y = random(height);
        break;
      case 1:

        //x = (width/4-i%themodulo) * cos(TWO_PI/8*i) + width/2;
        //y = (width/4-i%themodulo) * sin(TWO_PI/8*i) + height/2;
        x = (width/4-i%themodulo) * cos(i) + width/2;
        y = (width/4-i%themodulo) * sin(i) + height/2;
        break;
    }

    float adj = map(y, 0, height, 255, 0);
    color c = color(100, adj, i);
    particles[i]= new Particle(x, y, c, mode, i);
  }
}

void mousePressed() {
  //background(0);

}

void keyPressed() {
  if(key == '1') {
    background(0);
    setParticles(0);
  } else if(key == '2') {
    background(0);
    setParticles(1);
  }
  
  //change direction
  if(key == 'u') {
    direction *= -1;
  }
  
  //control alpha
  if(key == 'n') {
    alpha--;
    if(alpha < 0) alpha = 0;
    println("alpha " + alpha);
  }
  if(key == 'm') {
    alpha++;
    if(alpha > 255) alpha = 255;
    println("alpha " +  alpha);
  }
  
    //control alpha
  if(key == 'k') {
    speed--;
    if(speed < 0) speed = 0;
    println("speed " + speed);
  }
  if(key == 'l') {
    speed++;
    if(speed > 255) speed = 255;
    println("speed " + speed);
  }
  
  //WIGGLE
  if(key == 'o') {
    wiggle = !wiggle; 
  }
  
  //BACKGROUND
  if(key == 'p') {
    background(0); 
  }
}
