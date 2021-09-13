
window.addEventListener('DOMContentLoaded', () => {

    const core = {};

    const starfish = StarfishClient.build({
        //url: "ws://192.168.66.252:9000", // replace IP with the IP of the computer running the server
        url: "ws://starfish.driangle.org:9000"
    });

    // Connect
    starfish.connect().then(clientId => {
        console.log('Connected to starfish server. ClientId: [' + clientId + ']');
        //document.getElementById("connection-status").innerText = "Connected";

        starfish.topic$('example:1:core:state').subscribe(message => {
            core[message.headers.clientId] = message.body;
        });

    }).catch(e => {
        //document.getElementById("connection-status").innerText = "Unable to Connect";
    });

    const sketch = new p5((p) => {

        let state = 0;

        let groupnum;
        let groupalone;

        //send / click interaction
        let downready = true;
        let isdown = false;
        let shapeActivated = false;
        //button
        let buttonPressed = false;

        //knob
        let dragging = false
        let rollover = false;
        let knobangle = 0;
        let offsetAngle = 0;

        //slider
        let slidePos;
        let sliding = false;
        let offsetY = 0;

        //interact polygon
        let interactiveRad = [];
        let avg_shapeSize = 0;
        
        //timer for shape reset
        let startTimer = 50;
        let timerready = startTimer;

        //shape variables
        let shapes = [];
        let g_shapenum = 3;
        let g_shapesize = p.floor(p.random(40, 100));
        //let g_rotate = p.floor(p.random(180)); //using angle instead
        let g_shapeedge = 0;

        let c = []; //color array

        let buttonSize = 100;
        let buttonPos = 200;


        let points = [];
        // Choose color
        let color = { r: 0, g: 0, b: 0 }
        const start = { status: false };
        const connect =  { status: false };
        const shapenum = { num: 3 };
        const finalgroupnum = { num: 0 };
        const shapesize = { diam: 10 };
        const shaperot = { degree: 0 };
        const shapepos = { pos: 0 };
        const shapeedge = { max: 0 };


        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight);
            

            p.rectMode(p.CENTER);
            p.textAlign(p.CENTER);
            p.textSize(18);

            groupnum = p.floor(p.random(4));
            //console.log(groupnum);

            shapes[0] = 3;
            shapes[1] = 4;
            shapes[2] = 6;
            shapes[3] = 10;

            g_shapenum = shapes[groupnum];
            shapenum.num = g_shapenum;
            finalgroupnum.num = groupnum;


            for (let i = 0; i < shapenum.num; i++) {
                points.push({ x: 0, y: 0 });
                interactiveRad.push(g_shapesize);
            }

            
            // c[0] = p.createVector(178, 31, 53);
            // c[1] = p.createVector(255, 203, 53);
            // c[2] = p.createVector(0, 117, 58);
            // c[3] = p.createVector(0, 82, 165);
            //old RGB colors

            p.colorMode(p.HSB, 100);
            c[0] = p.createVector(100, p.random(50, 100), p.random(50, 100));
            c[1] = p.createVector(14, p.random(50, 100), p.random(50, 100));
            c[2] = p.createVector(65, p.random(50, 100), p.random(50, 100));
            c[3] = p.createVector(27, p.random(50, 100), p.random(20, 80));


            let select = groupnum;
            // console.log(select);
            // console.log(c[select].x);

            color = { r: c[select].x, g: c[select].y, b: c[select].z };

            buttonPos = p.height/8;

            slidePos = p.height/2;


        }

        p.draw = () => {
            p.background(255);

            Object.values(core).forEach(member => {
                const recState = member.state;
                const recAlone = member.alone;
                groupalone = recAlone;

                if(state != recState) {
                    state = recState;
                    p.background(255);
                }

                //console.log(recState);
            })


            switch(state) {
                case 0:
                    if(connect.status) p.background(255);
                    else p.background(color.r, color.g, color.b);

                    p.fill(255);
                    p.textSize(36);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                    p.textStyle(p.NORMAL);
                    p.textSize(15);
                    p.text("a live performance between the audience and an intrument", p.width/2, p.height/2-62, p.width-80, 60);
                    // p.textSize(15);
                    // p.text("Rafaele Andrade", p.width/2, p.height/2-20);
                    // p.text("German Greiner", p.width/2, p.height/2);
                    // p.text("Sabrina Verhage", p.width/2, p.height/2+20);
                    p.textSize(15);
                    p.text("touch the screen to participate", p.width/2, p.height/2+100);

                break;
                case 1:

                    if(groupalone == 0 || (groupalone-1) == groupnum) {

                        //reload after send
                        var mapFill = p.map(timerready, 0, startTimer-1, 255, 0);
                        //console.log(mapFill);

                        let buttondist = p.dist(p.mouseX, p.mouseY, p.width/2, p.height-buttonPos);
                        if((buttondist < buttonSize/2) && !downready) {
                            buttonPressed = true;
                            p.background(0, 255-mapFill);
                        } else {
                            buttonPressed = false;
                        }
                        //console.log(shapeActivated);

                        //DRAW BACKGROUND CIRCLE KNOB
                        if(dragging) {
                            var dx = p.mouseX - p.width/2;
                            var dy = p.mouseY - slidePos;
                            var mouseAngle = p.atan2(dy, dx);
                            knobangle = mouseAngle - offsetAngle;
                        }

                        if(shapeActivated) {
                            p.stroke(240);
                            //p.fill(100);
                            p.fill(0, 0, 40);
                        } else {
                            //p.fill(220);
                            p.fill(0, 0, 86);
                            p.noStroke();  
                        }
                        p.push();
                        p.translate(p.width/2, slidePos);
                        p.rotate(knobangle);
                        p.ellipse(0, 0, p.width-20, p.width-20);
                        //p.strokeWeight(2);
                        p.stroke(0);
                        //p.line(0, 0, p.height, 0);
                        p.pop();

                        p.noStroke();
                        p.strokeWeight(2);

                        //SLIDER BAR & STRINGS
                        if(sliding) {
                            slidePos = p.mouseY + offsetY;
                            if(slidePos < (p.width-20)/2) slidePos = (p.width-20)/2;
                            if(slidePos > p.height-(p.width-20)/2) slidePos = p.height-(p.width-20)/2;
                            //console.log(slidePos);
                        }

                        for(var i = 0; i < 4; i++) {
                            p.stroke(0);
                            p.line(p.width/2-15+i*10, 0, p.width/2-15+i*10, p.height);
                        }


                        //DRAW SHAPE
                        if(timerready == startTimer) {
                            p.fill(color.r, color.g, color.b, 255);

                            if(shapeActivated) {
                                p.fill(color.r+2, color.g/1.5, color.b*1.5, 255);
                            } 
                        } else {
                            //reload
                            //p.stroke(100);
                            p.fill(color.r, color.g, color.b, mapFill);
                        }

                        p.push();
                        
                        p.noStroke();
                        p.translate(p.width/2, slidePos);
                        //p.rotate(knobangle); //not here 
                        polygon(0, 0, interactiveRad, shapenum.num);
                        polygonInteract(0, 0, g_shapesize, shapenum.num);
                        p.pop();

                        //TITLE
                        p.noStroke();
                        if(buttonPressed) p.fill(255);
                        else p.fill(0);
                        p.textSize(35);
                        p.text("THIS ISN'T SOLO", p.width/2, 100);

                        //DRAW BUTTON
                        p.stroke(75);
                        p.fill(255);
                        //p.fill(color.r, color.g, color.b, 255);
                        p.rect(p.width/2, p.height-buttonPos, buttonSize, buttonSize/2, 20);
                        p.noStroke();
                        //p.fill(0);
                        if(buttonPressed) p.fill(255);
                        else p.fill(0);
                        p.textSize(17);
                        p.textStyle(p.BOLD);
                        p.text("SEND", p.width/2, p.height-buttonPos+7);

                    } else {
                        p.background(0);

                        p.noStroke();
                        p.fill(255);
                        p.textSize(35);
                        p.text("THIS ISN'T SOLO", p.width/2, p.height/2-100);

                        p.textStyle(p.NORMAL);
                        p.textSize(15);
                        p.text("but your input is deactivated for now :)", p.width/2, p.height/2);
                    }

                break;
                case 9:
                    //p.background(0);
                    p.background(p.random(0, 50), p.random(0, 50), p.random(0, 50));

                    //TITLE
                    p.noStroke();
                    //p.fill(p.random(255), p.random(255), p.random(255));
                    p.fill(255);
                    p.textStyle(p.BOLD);
                    p.textSize(30);
                    p.text("THIS WASN'T SOLO", p.width/2, p.height/2-60);
                    p.textSize(20);
                    p.textStyle(p.NORMAL);
                    p.text("the end", p.width/2, p.height/2);

                    p.textSize(15);
                    p.text("Rafaele Andrade", p.width/2, p.height/2+60);
                    p.text("German Greiner", p.width/2, p.height/2+80);
                    p.text("Sabrina Verhage", p.width/2, p.height/2+100);

                break;
                default:

            }

            if(!downready && start.status) {
                timerready--;
                if(timerready<=0) {
                    downready = true;
                    timerready = startTimer;

                    start.status = false;
                    sendAway(); //send message to reset core
                }

            }
            
        }

        p.touchStarted = () => { 
            down(); 
        }

        p.mousePressed = () => {
            down();
        }

        p.touchEnded = () => {
            up();
        }

        function down() {

            switch(state) {
                case 0:
                    connect.status = true;
                    sendAway();
                break;
                case 1:
                    if(downready) downready = false;
                    isdown = true;

                    //DRAGGING KNOB
                    if (p.dist(p.mouseX, p.mouseY, p.width/2, slidePos) < p.width/3) {
                        dragging = true;
                        // If so, keep track of relative location of click to corner of rectangle
                        var dx = p.mouseX - p.width/2;
                        var dy = p.mouseY - slidePos;
                        offsetAngle = p.atan2(dy, dx) - knobangle;
                    }

                    //SLIDING BAR
                    if (p.mouseX > p.width/5*4 || p.mouseX < p.width/5) {
                        sliding = true;
                        // If so, keep track of delta mouse movement
                        offsetY = slidePos - p.mouseY;
                        //console.log('sliding');
                    }


                break;
                default:
            }

            //console.log('down is executed');
        }

        function up() {

            switch(state) {
                case 0:
                    connect.status = false;
                    sendAway();
                break;
                case 1:
                    //downready = boolean to check when you can press button again
                    isdown = false;

                    dragging = false; //for the knob
                    sliding = false; //for the slider

                    if(!downready && buttonPressed) {
                        start.status = true;
                        shapeActivated = false;


                        //save variables to send away
                        shapesize.diam = avg_shapeSize;
                        shaperot.degree = p.degrees(knobangle); //radians
                        shapepos.pos = p.map(slidePos, 40, p.height-40, 0, 255);
                        shapeedge.max = g_shapeedge;
                        //manually adjusted - to be checked later

                        sendAway();
                    }
                break;
                default:
            }

            //console.log('up is executed');
        }

        function sendAway() {
            // Send current state to server using topic "example:1:audience:state"
            if(state == 0) {
                start.status = connect.status;
            } 

            starfish.topicPublish("example:1:audience:state", {
                color: color,
                points: points,
                start: start,
                shapenum: shapenum,
                shapesize: shapesize,
                shaperot: shaperot,
                shapepos: shapepos,
                finalgroupnum: finalgroupnum,
                shapeedge: shapeedge
            });
            
        }


        function polygon(x, y, radius, npoints) {

          let angle = p.TWO_PI / npoints;
          p.beginShape();
          let count = 0; //force array numbering for points array
          for (let a = 0; a < p.TWO_PI; a += angle) {
            let sx = x + p.cos(a + knobangle) * interactiveRad[count];
            let sy = y + p.sin(a + knobangle) * interactiveRad[count];

            points[count] = { x: sx, y: sy}; 
            p.vertex(points[count].x, points[count].y);

            count++;
          }
          p.endShape(p.CLOSE);

          //console.log(p.degrees(knobangle));


        }

        function polygonInteract(x, y, radius, npoints) {

            //maybe put the polygon points in an external array
  
            shapeActivated = false;


            for (let i = 0; i < shapenum.num; i++) {

                p.noFill();

                let thedist = p.dist(p.mouseX, p.mouseY, points[i].x+p.width/2, points[i].y+slidePos);
                if((thedist < 40) && isdown) {

                    shapeActivated = true;

                    //ok so based on position of the mouse we grow or shrink
                    let testy = p.dist(p.mouseX, p.mouseY, p.width/2, slidePos);
                    if(testy > interactiveRad[i]) {
                        interactiveRad[i]+=1;
                    } else if(testy < interactiveRad[i]) {
                        interactiveRad[i]-=1;
                    }

                    //grow & shrink constraints
                    if(interactiveRad[i] >= p.width/2-10) {
                        interactiveRad[i] = p.width/2-10;
                    }
                    if(interactiveRad[i] <= 30) {
                        interactiveRad[i] = 30;
                    }

                    p.fill(255, 0, 0);
                } else {

                }

                p.stroke(0);
                p.ellipse(points[i].x, points[i].y, 30, 30);
                p.noFill();

            }

            //calculate the average size, to send to core
            var sum = 0;
            for (let i = 0; i < shapenum.num; i++) {
                sum += interactiveRad[i];
            }
            avg_shapeSize = sum/shapenum.num;

            //calculate the extreme edge thing, to send to core
            var maxdiff = 0;
            for (let i = 0; i < shapenum.num; i++) {
                var dif = 0;
                if(i > 0) diff = p.abs(interactiveRad[i] - interactiveRad[i-1]);
                if(i == 0) diff = p.abs(interactiveRad[shapenum.num-1] - interactiveRad[i]);
                if(diff > maxdiff) maxdiff = diff;
            }
            console.log(maxdiff);
            g_shapeedge = maxdiff;

        }

    }, document.getElementById('container'))
});


