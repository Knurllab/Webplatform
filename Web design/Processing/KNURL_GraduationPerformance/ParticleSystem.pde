class ParticleSystem {

  ArrayList<Particle> particles;   
  PVector origin;        
  ArrayList<PVector> startPos;
  
  int MODE = 0;
  
  Attractor a;
  
  boolean controlled = false;
  boolean pushpop = false;
  boolean theforce = false;
  boolean adding = false;
  
  int myID = 0;
  int myIndex = 0; //not the ID but the index :) 
  int addFrequency = 10;
  
  int drawNum;
  
  ParticleSystem(int num, int mode, PVector midpoint, boolean control, int theid) {
    controlled = control;
    myID = theid;
    myIndex = floor(myID/2);
    
    drawNum = num;
    
    particles = new ArrayList<Particle>();   
    startPos = new ArrayList<PVector>();
    
    origin = midpoint.copy();     
    
    MODE = mode;
      
    float thesection = (TWO_PI/num);
    for (int i = 0; i < num; i++) {
      //println(thesection);
      
      //the starting positions of each particle 
      switch(MODE) {
        /////////////////MODE 0
        //random start positions => moving right with noise
        case 0:
          startPos.add(new PVector(random(width), random(height))); //random
          theforce = false;
          break;
        /////////////////MODE 1
        //random start position => rotating in circles (big circle)
        case 1:
          pushpop = true;
          //startPos.add(new PVector(width/4 * cos(i*thesection), width/4 * sin(i*thesection))); //circle
          //if(i < num/2) startPos.add(new PVector(random(-width/2, -width/4), random(-height/2, height/2))); 
          //else startPos.add(new PVector(random(width/4, width/2), random(-height/2, height/2))); 
          
          if(i < num/4) startPos.add(new PVector(random(-width/2, -width/4), random(-height/2, height/2))); 
          else if(i >= num/4 && i < num/2) startPos.add(new PVector(random(-width/4, width/4), random(-height/2, -height/4))); 
          else if(i >= num/2 && i < (num/4)*3) startPos.add(new PVector(random(-width/4, width/4), random(height/4, height/2))); 
          else startPos.add(new PVector(random(width/4, width/2), random(-height/2, height/2))); 
          
          theforce = true;

          break;
        /////////////////MODE 2
        //circle start position => moving inwards with noise --new particles coming
        case 2:
          addFrequency = 3;
          pushpop = true;
          theforce = true;
          startPos.add(new PVector(height/2 * cos(i*thesection), height/2 * sin(i*thesection))); //circle
          adding = true;
          break;
        /////////////////MODE 3
        //small system controlled => moving with forces [petri dish]
        case 3:
          startPos.add(new PVector(origin.x+random(-20, 20), origin.y+random(-20, 20)));
          theforce = true;
          break;
        /////////////////MODE 4
        //small system controlled => moving with forces [circle]
        case 4:
          pushpop = true;
          startPos.add(new PVector(random(100,120) * cos(i*thesection),random(100,120) * sin(i*thesection)));
          //if(i < num/2) startPos.add(new PVector(random(-100, -70),random(-100, -70)));
          //else startPos.add(new PVector(random(70, 100),random(70, 100)));
          theforce = true;

          break;
        /////////////////MODE 5
        //circle start position => rotating in circles
        case 5:
          pushpop = true;
          theforce = true;
          startPos.add(new PVector(width/15 * cos(i*thesection), width/15 * sin(i*thesection))); //circle
          break;
        /////////////////MODE 6
        //circle start position => moving inwards with noise --NO NEW PARTICLES
        case 6:
          addFrequency = 1;
          pushpop = true;
          theforce = true;
          startPos.add(new PVector(height/2 * cos(i*thesection), height/2 * sin(i*thesection))); //circle
          
          break;
        /////////////////MODE 7
        //Particles from side to center
        case 7:
          pushpop = true;
          startPos.add(new PVector(random(-75, 75),random(-75, 75)));
          theforce = true;
          adding = true;
          break;
        /////////////////MODE 8
        //Curl noise particles yaay
        case 8:
        
          //startPos.add(new PVector(random(width/4-100, width/4*3+100), random(height))); //random
          startPos.add(new PVector(width/2 + random(height/2) * cos(i), height/2 + random(height/2) * sin(i))); //circle
          theforce = false;
          adding = true;
          addFrequency = 1;
          break;
        default: 
          theforce = false;
          startPos.add(new PVector(width/4 * cos(i*thesection) + width/2, width/4 * sin(i*thesection) + height/2)); //circle
          break;
      }
      
      //if(controlled) startPos.add(origin);  //not sure; this is double?
      
      //set the cool colors
      //float adj = map(startPos.get(i).y, 0, height, 0, 150);
      float adj;
      if(MODE == 2) adj = map(startPos.get(i).y, 0, height, 150, 0);
      else adj = map(startPos.get(i).y, 0, height, 100, 0);
      
      color c = color(120, adj, i*(255/150));
      //color c = color(120, adj, i);
      if(controlled) c = thecolors[myIndex];
      if(MODE == 6) c = color(255); //THE ENDING
      
      //custom particle add for STATE 7
      if(MODE == 2) {
        //if state 7 don't start with loads of particles
        if(i == 0) particles.add(new Particle(startPos.get(i), c, i, MODE)); 
      } else {
        particles.add(new Particle(startPos.get(i), c, i, MODE));    
      }
    }
    
    switch(MODE) {
      case 1:
        a = new Attractor(new PVector(0, 0), MODE);
        break;
      case 2:
        a = new Attractor(new PVector(0, 0), MODE);
        break;
      case 3:
        a = new Attractor(origin, MODE);
        break;
      case 4:
        a = new Attractor(new PVector(0, 0), MODE);
        break;
      case 5:
        a = new Attractor(new PVector(0, 0), MODE);
        break;
      case 6:
        a = new Attractor(new PVector(0, 0), MODE);
        break;
      case 7:
        a = new Attractor(new PVector(width/2-origin.x, height/2-origin.y), MODE);
        break;
      default:
        break;
    }
    
  }

  void run() {
     
    if(pushpop)  {
      pushMatrix();
      
      if(MODE == 4 || MODE == 7) translate(origin.x, origin.y);
      else translate(width/2, height/2);
    }
    
    if(controlled && isconnected[myIndex] > 0) {
      //println("try this " + avgsliders[myIndex][2]);
      
      if(adding) drawNum = particles.size();
      for (int i = drawNum-1; i >= 0; i--) {
        //println(selcolor[myIndex]);
             
        //volume
        if(MODE == 8) particles.get(i).mass = avgsliders[myIndex][1]*10+2;
        else particles.get(i).mass = avgsliders[myIndex][1]*30+3;
        
        //filter
        particles.get(i).c = color(red(thecolors[myIndex])+(avgsliders[myIndex][2]*100), green(thecolors[myIndex]), blue(thecolors[myIndex])-(avgsliders[myIndex][2]*100));

        //movement
        //particles.get(i).setFlicker(avgsliders[myIndex][3]*60+2); //ugh don't like this either
        particles.get(i).setShake(avgsliders[myIndex][3]*2);
      }
      
      //but only useful when particles are added!
      if(adding) {
        float revmap = map(avgsliders[myIndex][0], 0, 1, 20, 0);
        addFrequency = floor(revmap)+1;
        //println(addFrequency);
      } else {
        float maxParticles = particles.size();
        drawNum = floor(map(avgsliders[myIndex][0], 0, 1, 5, maxParticles));
        //println(drawNum);
      }

    }
    
    //pitch
    if(adding) {
      if(frameCount % addFrequency == 0) {
        addParticle();
        //println(frameCount);
      }
    } 
    
    //////////////////////////////////////////////////DRAW THE PARTICLES
    //if(DEBUG && (theforce)) a.display();
    
    if(!controlled || isactive[myIndex] > 0) {
      if(drawNum > particles.size()) drawNum = particles.size();
      if(adding) drawNum = particles.size();
      for (int i = drawNum-1; i >= 0; i--) {
        Particle p = particles.get(i);
        
        if(theforce) {
          PVector force = a.attract(particles.get(i));
          particles.get(i).applyForce(force);
        }
        
        p.run();
        
        if (p.isDead()) {
          //don't remove particles in controller situation
          particles.remove(i);
        }
      }
    }
    
    if(pushpop) popMatrix();
  }
 

  void addParticle() {
    //println("adding particle");
    int thepos = floor(random(startPos.size()));
    //float adj = map(startPos.get(thepos).y, 0, height, 255, 0);
    float adj = map(startPos.get(thepos).y, 0, height, 150, 0);
    //color c = color(120, adj, thepos);
    color c = color(120, adj, thepos*(255/150));

    if(controlled) c = thecolors[myIndex];
    
    
    if(MODE == 7) particles.add(new Particle(new PVector(random(-75, 75),random(-75, 75)), c, thepos, MODE));
    else particles.add(new Particle(startPos.get(thepos), c, thepos, MODE));
    
   
  }

  // A method to test if the particle system still has particles
  boolean isDead() {
    if (particles.isEmpty()) {
      return true;
    } 
    else {
      return false;
    }
  }
}
