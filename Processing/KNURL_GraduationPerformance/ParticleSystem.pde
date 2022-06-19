class ParticleSystem {

  ArrayList<Particle> particles;   
  PVector origin;        
  
  ArrayList<PVector> startPos;
  
  int MODE = 0;

  ParticleSystem(int num, int mode, PVector midpoint) {
    particles = new ArrayList<Particle>();   
    startPos = new ArrayList<PVector>();
    
    origin = midpoint.copy();     
    
    MODE = mode;
    
    //MODE 0
    //random start positions
    //MODE 1
    //circle start position
    //MODE 2
    //...
     
    for (int i = 0; i < num; i++) {
      //particles.add(new Particle(origin));    
      
      //the starting positions of each particle
      
      switch(mode) {
        case 0:
          startPos.add(new PVector(random(width), random(height))); //random
          break;
        case 1:
          startPos.add(new PVector(width/4 * cos(i) + width/2, width/4 * sin(i) + height/2)); //circle
          break;
        default: 
          startPos.add(new PVector(width/4 * cos(i) + width/2, width/4 * sin(i) + height/2)); //circle
          break;
      }
      
      //set the cool colors
      float adj = map(startPos.get(i).y, 0, height, 255, 0);
      color c = color(100, adj, i);
      particles.add(new Particle(startPos.get(i), c, i, mode));    
    }
    
    
  }

  void run() {
    for (int i = particles.size()-1; i >= 0; i--) {
      Particle p = particles.get(i);
      p.run();
      if (p.isDead()) {
        particles.remove(i);
      }
    }
  }

  void addParticle() {
    int thepos = floor(random(startPos.size()));
    float adj = map(startPos.get(thepos).y, 0, height, 255, 0);
    color c = color(100, adj, thepos);

    particles.add(new Particle(startPos.get(thepos), c, thepos, MODE));
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
