class Particle {
  float posX, posY, incr, theta;
  color  c;
  int mymode = 0;
  int myid = 0;

  Particle(float xIn, float yIn, color cIn, int mIn, int idIn) {
    posX = xIn;
    posY = yIn;
    c = cIn;
    mymode = mIn;
    myid = idIn;
  }

  public void move() {
    update();
    wrap();
    display();
  }

  void update() {
    incr +=  .008 * direction;
    theta = noise(posX * .006, posY * .004, incr) * TWO_PI;
    
    posX += speed * cos(theta) * direction; //cos
    posY += speed * sin(theta) * direction; //sin
    
    //posX += speed * cos(theta) * .2; //cos
    //posY += speed * sin(theta) * .2; //sin
  }

  void display() {
    //if (posX > 0 && posX < width && posY > 0  && posY < height) {
    //  pixels[(int)posX + (int)posY * width] =  c;
    //}
    
    fill(c);
    ellipse(posX, posY, 6, 6);
  }

  void wrap() {
    switch(mymode) {
      case 0:
        if (posX < 0) posX = width;
        if (posX > width ) posX =  0;
        if (posY < 0 ) posY = height;
        if (posY > height) posY =  0;
        break;
      case 1:
      
        if(wiggle) {
          float thedist = dist(width/2, height/2, posX, posY);
          //println(thedist);
          if(thedist > 300) {
            direction *= -1; 
          }
        }
        break;
    }

    
    
  }
}
