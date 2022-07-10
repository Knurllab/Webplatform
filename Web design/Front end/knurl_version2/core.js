
window.addEventListener('DOMContentLoaded', () => {
    // audience state
    const audience = {};

    

    const starfish = StarfishClient.build({
        //url: "ws://192.168.66.252:9000", // replace IP with the IP of the computer running the server
        url: "ws://starfish.driangle.org:9000"
    });

    // Connect
    starfish.connect().then(clientId => {
        console.log('Connected to starfish server. ClientId: [' + clientId + ']');
        // document.getElementById("connection-status").innerText = "Connected";

        // Subscribe to topic "example:1:audience:state" to receive audience state
        starfish.topic$('example:1:audience:state').subscribe(message => {
            // update audience state
            audience[message.headers.clientId] = message.body;
        });

        // Subscribe to topic "sfb:client:disconnected" to remove a user's state
        starfish.topic$('sfb:client:disconnected').subscribe(message => {
            delete audience[message.headers.clientId];
        });
    }).catch(e => {
        // document.getElementById("connection-status").innerText = "Unable to Connected";
    });

    const sketch = new p5((p) => {
  
        let state = 0;

        let numAudience =  Object.values(audience).length;
        
        //receiving assist
        let flipflop = [];
        //sending assist
        let sendflop = []; 
        let realupdating = true;
        
        let rectangles = []; //array of testrectangles
        let starfishes = []; // array of starfishes
        //the shapes are called sharfishes :) 

        //the strings (background graphics)
        let strings = [];
        let stringTouched = [];
        let stringDist = [];
        let numStrings = 4;
        let numStringPoints = 10;

        //keep track of which group they are in 
        let groupmembers = [];
        let alone = 0;

        let tisActivated = false;

        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight);

            // //draw the first starfish
            // let testcolor = p.color(0);
            // let b = new Starfish(6, testcolor, 100, 0, 100);
            // starfishes.push( b );

            p.colorMode(p.HSB, 100);

            for(var i = 0; i < numStrings; i++) {
                strings[i] = [];
                stringTouched[i] = [];
                stringDist[i] = [];
                for(var j = 0; j < numStringPoints; j++) {
                    strings[i][j] = p.createVector(p.width/2+i*15-((numStrings-1)*15/2), p.height/(numStringPoints-1)*j);
                    stringTouched[i][j] = false;
                    stringDist[i][j] = 0;
                }
            }

            for(var i = 0; i < 4; i++) {
                groupmembers[i] = 0;
            }

            flipflop[0] = false;
   
        }

        p.draw = () => {

            p.fill(0);
            p.fill(100);
            p.stroke(0);
            p.ellipse(p.width/2, p. height/2, p.width, p.width);
            p.ellipse(p.width/2, p. height/2, 100, 100);
            p.stroke(0);
            p.arc(p.width/2, p.height/2, 500, 500, 0, p.HALF_PI)

            numAudience = Object.values(audience).length;
            

            switch(state) {
                case 0:

                    //p.background();
                    p.noStroke();


                    if(numAudience == 0) resetFlipFlop(); //in case the first one disconnects?


                    //every frame recount the groupmembers thing
                    for(var i = 0; i < groupmembers.length; i++) {
                        groupmembers[i] = 0;
                    }

                    Object.values(audience).forEach((member, index) => {
                        const color = member.color;
                        const shapenum = member.shapenum.num;
                        const thestatus = member.start.status;

                        let thecolor = p.color(color.r, color.g, color.b);


                        //TRICKY SOLUTIONS TRICKY TRICKY AIII

                        if(!flipflop[index]) {
                            //new member
                            
                            //firs time setup
                            let b = new testRectangle(member.finalgroupnum.num, 0, thecolor, thestatus);
                            groupmembers[member.finalgroupnum.num] += 1;
                            rectangles.push( b );
                            flipflop.push(false);
                            sendflop.push(true);

                            flipflop[index] = true;
                        } else {
                            rectangles[index].status = thestatus;
                            rectangles[index].groupnum = member.finalgroupnum.num;
                            rectangles[index].tgroupnum =  groupmembers[rectangles[index].groupnum];
                            rectangles[index].color = thecolor;
                            groupmembers[rectangles[index].groupnum] += 1;
                        }

                        
                        if(member.start.status) {
                            if(sendflop[index]) {
                                sendflop[index] = !sendflop[index];
                                //console.log('SEND YES');
                                sendAway_knurl(rectangles[index].groupnum, 0, 0, 0, 0);
                            }
                            p.fill(255);
                            
                        } else {
                            if(!sendflop[index]) {
                                sendflop[index] = !sendflop[index];
                                //console.log('SEND NO');
                            }
                            p.fill(color.r, color.g, color.b);
                        }

                        rectangles[index].display();

                        

                    }) 

                    //console.log(groupmembers);


                    //TITLE
                    p.noStroke();
                    if(numAudience > 0) p.fill(255);
                    else p.fill(0);
                    p.textSize(65);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/9, 150);
                    p.textStyle(p.NORMAL);
                    p.textSize(25);
                    p.text("a live performance between the audience and an instrument", p.width/9, 190);
                    p.textSize(15);
                    p.text("Rafaele Andrade", p.width/9, 230);
                    p.text("German Greiner", p.width/9, 250);
                    p.text("Sabrina Verhage", p.width/9, 270);
                    


                break;
                case 1:

                    p.background(255);
                    flipflop.length = numAudience; //different use from state 0


                    //DRAW BACKGROUND GREY RECT
                    //p.fill(220);
                    p.fill(0, 0, 86);
                    p.noStroke();  
                    
                    p.rect(p.width/3, 0, p.width/3, p.height);
                    p.noStroke();
                    p.strokeWeight(2);

                    //DRAW GREEN KNURL
                    p.noStroke();
                    //p.fill(0, 26, 14);
                    p.fill(42, 100, 10);
                    p.rect(p.width/2-100, 0, 200, p.height);

                    p.fill(0);

                    tisActivated = false;
                    for(let i = 0; i < starfishes.length; i++) {
                        if(starfishes[i].x > p.width/2-20 && starfishes[i].x < p.width/2+20) {
                            p.background(0); 
                            starfishes[i].tisActivated = true;
                            tisActivated = true;
                        } else {
                            starfishes[i].tisActivated = false;
                        }
                    }

                    //receive stuff
                    Object.values(audience).forEach((member, index) => {
                        const color = member.color;
                        const points = member.points;
                        const shapenum = member.shapenum.num;
                        const shapesize = member.shapesize.diam;
                        const shaperot = member.shaperot.degree;
                        const shapepos = member.shapepos.pos;
                        const thegroup = member.finalgroupnum.num;
                        const shapeedge = member.shapeedge.max;

                        if(member.start.status) {
                            if(flipflop[index]) {
                                let thecolor = p.color(color.r, color.g, color.b);
                                let b = new Starfish(shapenum, thecolor, shapesize, shaperot, shapepos, points, thegroup, shapeedge);
                                starfishes.push( b );
                                //console.log(points);
                                flipflop[index] = false;
                            }
                        } else {
                            flipflop[index] = true;
                        }

                        //p.fill(color.r, color.g, color.b);


                    }) 

                    for(let j = 0; j < numStrings; j++) {
                        for(let k = 0; k < numStringPoints; k++) {
                            stringTouched[j][k] = false;
                        }
                    }

                    if(starfishes.length > 0) {

                        //draw and move the starfishes
                        for(let i = 0; i < starfishes.length; i++) {
                            console.log(starfishes[i].groupnum);
                            if((alone > 0 && starfishes[i].groupnum == (alone-1)) || alone == 0) {

                                starfishes[i].move();
                                starfishes[i].display();
                                     
                                //check when to ACTIVATE the starfishes
                                //activate means sending message to KNURL
                                if(starfishes[i].x > p.width/2+20 && starfishes[i].send == false) {
                                    starfishes[i].rotate = starfishes[i].rotate%360;
                                    var rotval = p.map(p.abs(starfishes[i].rotate), 0, 360, 0, 1); //lin
                                    var posval = p.map(starfishes[i].y, 0, p.height, 0, 1); //filter
                                    var sizeval = p.map(starfishes[i].size, 0, 200, 0, 1); //amp
                                    var edgeval = p.map(starfishes[i].shapeedge, 0, 180, 0, 1); //freq
                                    //console.log(starfishes[i].rotate);
                                    //console.log(rotval);

                                    starfishes[i].send = true;

                                    sendAway_knurl(starfishes[i].groupnum, edgeval, sizeval, posval, rotval);    
                                }

                                //check when strings are touched by starfishes
                                for(let j = 0; j < numStrings; j++) {
                                    for(let k = 0; k < numStringPoints; k++) {
                                    
                                        stringDist[j][k] = p.dist(starfishes[i].x, starfishes[i].y, strings[j][k].x, strings[j][k].y);
                                        if(stringDist[j][k] < (p.width / numStringPoints / 2)) {
                                            stringTouched[j][k] = true;
                                        } 
                                    }
                                }

                                // delete starfishes when they dissapear of the screen
                                if(starfishes[i].x > p.width) {
                                    starfishes.splice(i, 1);
                                }
                            }
                                    
                            
                        }
                    }
                    

                    p.stroke(255);
                    //p.strokeWeight(2);
                    p.fill(0);

                    //DRAW THE STRINGS
                    for(var i = 0; i < numStrings; i++) {
                        var thick = false;
                        for(var j = 0; j < numStringPoints; j++) {
                            if(stringTouched[i][j]) thick = true
                        }
                        if(thick) p.strokeWeight(6);
                        else p.strokeWeight(2);

                        p.beginShape();
                        for(var j = 0; j < numStringPoints; j++) {

                            p.vertex(strings[i][j].x, strings[i][j].y);                            
                        }
                        p.endShape();
                    }

                    //DRAW THE CIRCLES
                    // for(var i = 0; i < numStrings; i++) {
                    //     for(var j = 0; j < numStringPoints; j++) { 
                    //         if(stringTouched[i][j]) {
                    //             p.fill(255, 0, 0);
                    //             p.noStroke();
                    //             p.ellipse(strings[i][j].x, strings[i][j].y, 20, 20);
                    //         } else {
                    //             p.noFill();
                    //             p.noStroke();
                    //             p.ellipse(strings[i][j].x, strings[i][j].y, 10, 10);
                    //         }     
                    //     }
                    // }

                    //TITLE
                    
                    p.noStroke();
                    if(tisActivated) {
                        p.fill(255);
                    } else {
                        p.fill(255);
                        p.rect(p.width/9, 100, p.width-100, 50);
                        p.fill(0);
                    }
                    p.textSize(65);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/9, 150);
   

                break;
                case 9: 
                    //TITLE
                    p.background(0);
                    p.noStroke();
                    p.fill(155);
                    p.textSize(80);
                    p.textStyle(p.BOLD);
                    p.text("THIS WASN'T SOLO", p.width/9, p.height/2);


                break;
                default:

            }

            
        }

        p.keyPressed = () => {

            if(p.key == 't') sendAway_knurl(1, p.random(1), p.random(1), p.random(1), p.random(1));  

            if(p.key == '1') {
                state = 1;
                alone = 0;
                sendAway_audience();             
            } else if(p.key == '0') {
                state = 0;
                alone = 0;
                p.background(255);
                resetFlipFlop();
                sendAway_audience();
            } else if(p.key == '9') {
                state = 9;
                alone = 0;
                p.background(255);
                sendAway_audience();
            } else if(p.key == '5') {
                //only group 0 
                alone = 1;
                sendAway_audience();
            } else if(p.key == '6') {
                //only group 0 
                alone = 2;
                sendAway_audience();
            } else if(p.key == '7') {
                //only group 0 
                alone = 3;
                sendAway_audience();
            } else if(p.key == '8') {
                //only group 0 
                alone = 4;
                sendAway_audience();
            }
        }


        function sendAway_knurl(thegroup, var1, var2, var3, var4) {
            //first also send away to audience to make sure everyone is in the right state
            sendAway_audience();

            // Send an osc package with freq, amp, lin & mul

            // Send osc to server using topic "example:2:osc"

            var oscMessage0;
            var oscMessage1;
            var oscMessage2;
            var oscMessage3;

            let theSynth = " ";
            switch(thegroup) {
                case 0:
                    theSynth = "sound1"
                break;
                case 1:
                    theSynth = "sound2"
                break;
                case 2:
                    theSynth = "sound3"
                break;
                case 3:
                    theSynth = "sound4"
                break;
                default:
            }

            switch(state) {
                case 0:

                    let thefreq = 0;
                    switch(thegroup) {
                        case 0:
                            thefreq = 0.2;
                        break;
                        case 1:
                            thefreq = 0.4;
                        break;
                        case 2:
                            thefreq = 0.3;
                        break;
                        case 3:
                            thefreq = 0.8;
                        break;
                    }


                    oscMessage0 = {
                        path: "/knurl/trigger",
                        arguments: [ 'Plucking' , 1 , p.round(thefreq, 2) ]
                    };
                    //console.log('message sent ' + JSON.stringify(oscMessage0));

                    starfish.topicPublish("example:2:osc", oscMessage0);

                break;
                case 1:
                    oscMessage0 = {
                        path: "/knurl/change",
                        arguments: [ theSynth , 'freq' , p.round(var1, 2)]
                    };
                    oscMessage1 = {
                        path: "/knurl/change",
                        arguments: [ theSynth , 'amp' , p.round(var2, 2) ]
                    };
                    oscMessage2 = {
                        path: "/knurl/change",
                        arguments: [ theSynth , 'filter' , p.round(var3, 2) ]
                    };
                    oscMessage3 = {
                        path: "/knurl/change",
                        arguments: [ theSynth , 'lin' , p.round(var4, 2) ]
                    };

                    //console.log('message sent 0 ' + JSON.stringify(oscMessage0));
                    //console.log('message sent 1 ' + JSON.stringify(oscMessage1));
                    //console.log('message sent 2 ' + JSON.stringify(oscMessage2));
                    //console.log('message sent 3 ' + JSON.stringify(oscMessage3));

                    starfish.topicPublish("example:2:osc", oscMessage0);
                    starfish.topicPublish("example:2:osc", oscMessage1);
                    starfish.topicPublish("example:2:osc", oscMessage2);
                    starfish.topicPublish("example:2:osc", oscMessage3);

                break;
                default:
            }

            
            
        }

        function sendAway_audience() {
            starfish.topicPublish("example:1:core:state", {
                state: state,
                alone: alone
            });
            
        }

        function resetFlipFlop() {
            //HM OK MAYBE DON'T NEED THIS DON'T UNDERSTAND
            //console.log('RESETTING');

            flipflop = [];
            sendflop = [];

            //reset a bunch of stuff
            for(var i = 0; i < 4; i++) {
                groupmembers[i] = 0;
            }

            rectnalges = [];
            starfishes = [];
        }

        class testRectangle {
            constructor(tgroupnum, tingroupnum, itColor, tstatus) {
                this.groupnum = tgroupnum;
                this.ingroupnum = tingroupnum;
                this.color = itColor;
                this.status = tstatus;
            }

            display() {
                //console.log(groupmembers[this.groupnum]);
                let thechunk = p.height/groupmembers[this.groupnum];
                //p.rect(p.width/4*this.groupnum, (this.ingroupnum)*thechunk, p.width/4, thechunk);
                p.arc(p.width/2, p.height/2, 500, 500, 0, p.HALF_PI*(this.groupnum));
            }
        }


        class Starfish {
            constructor(numberCorners, itColor, tshapesize, tshaperot, tshapepos, tpoints, tgroupnum, tshapeedge) {
                //this.x = p.random(p.width);
                var extrarandom = p.random(-100, 100);
                this.x = 0;
                this.y = ((tshapepos/255)*p.height) + extrarandom;
                this.size = tshapesize;
                this.rotate = tshaperot;
                this.speed = 1;
                this.color = itColor;
                this.corners = numberCorners;
                this.points = tpoints;
                this.send = false;
                this.tisActivated = false;
                this.groupnum = tgroupnum;
                this.shapeedge = tshapeedge;
            }


            move() {
                this.y += p.random(-this.speed, this.speed);
                // this.y += random(-this.speed, this.speed);
                this.x += 2;     
            }

            display() {
                p.noStroke();
                //p.fill(100)
                if(this.send) {
                    p.fill(0, 0, 40);
                } else if (this.tisActivated) {
                    //console.log(p.red(this.color));
                    p.fill(p.red(this.color)+50, p.green(this.color)+50, p.blue(this.color)+50);
                } else {
                    p.fill(this.color);
                }
                
                p.push();
                p.translate(this.x, this.y);
                p.scale(.5);
                //p.rotate(this.rotate); //rotate now represented in the points
                polygon(0, 0, this.corners, this.points);
                p.pop();
            }


        }

        function polygon(x, y, npoints, thepoints) {
            p.beginShape();
            for(let i = 0; i < npoints; i++) {
                p.vertex(thepoints[i].x, thepoints[i].y);
            }
            p.endShape(p.CLOSE);
        }



    }, document.getElementById('container'))
});


