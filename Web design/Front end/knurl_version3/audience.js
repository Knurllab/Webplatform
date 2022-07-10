
window.addEventListener('DOMContentLoaded', () => {

    const core = {};

    const starfish = StarfishClient.build({
        url: "ws://192.168.0.145:9000", // replace IP with the IP of the computer running the server
        //url: "ws://192.168.178.11:9000", // replace IP with the IP of the computer running the server
        //url: "ws://192.168.4.69:9000"
        //url: "ws://starfish.driangle.org:9000"
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

        let gui;
        let sliders = [];
        let slideval = [];

        let state = 0;

        let groupnum;
        let active = 1;

        let recActive;
        let recState;

        let c = []; //color array

        // values to send
        let connect = { status: 0 };
        let color = { r: 0, g: 0, b: 0 }
        const finalgroupnum = { num: 0 };

        p.setup = () => {
            let canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            gui = p.createGui(canvas);
            gui.loadStyle("Blue");
            gui.setStrokeWeight(3);
            //gui.setTrackWidth(0);
            sliders[0] = p.createSliderV("Slider"+0, p.width/5*1-20, 80, 40, p.height-180);
            sliders[1] = p.createSliderV("Slider"+1, p.width/5*2-20, 80, 40, p.height-180);
            sliders[2] = p.createSliderV("Slider"+2, p.width/5*3-20, 80, 40, p.height-180);
            sliders[3] = p.createSliderV("Slider"+3, p.width/5*4-20, 80, 40, p.height-180);
            

            for(var i = 0; i < 4; i++) {
                slideval[i] = 0.5;
            }

            p.rectMode(p.CENTER);
            p.textAlign(p.CENTER);
            p.textSize(18);


            p.colorMode(p.HSB, 100);
            //244°, 71%, 76%
            c[0] = p.createVector(50, p.random(20, 50), p.random(200, 255));
            c[1] = p.createVector(60, p.random(20, 50), p.random(200, 255));
            c[2] = p.createVector(0, 0, 100);
            c[3] = p.createVector(70, p.random(20, 50), p.random(200, 255));


            //CHECK URL PARAMETERS FOR GROUPNUM!!!
            const urlParams = new URLSearchParams(window.location.search);
            
            const group_present = urlParams.has('group');
            if(group_present) {
                groupnum = parseInt(urlParams.get('group'));
            } else {
                groupnum = p.floor(p.random(4));
            }
            
            finalgroupnum.num = groupnum;

            let select = groupnum;
            color = { r: c[select].x, g: c[select].y, b: c[select].z };

        }

        p.draw = () => {
            p.background(255);

            Object.values(core).forEach(member => {
                recState = member.state;
                recActive = member.active;

                //console.log(recActive);
                active = recActive[groupnum];
                //console.log(active);

                if(state != recState) {
                    state = recState;
                    p.background(255);
                }

                //console.log(recState);
            })

            let title = "";
            switch(groupnum) {
                case 0:
                    title = "ATMOSPHERE";
                    break;
                case 1:
                    title = "RECORDER / SYNTHESIS";
                    break;
                case 2:
                    title = "PERCUSSION";
                    break;
                case 3:
                    title = "NOISE";
                    break;
            }


            switch(state) { 
                case 0:
                    //p.background(color.r, color.g, color.b);
                    if(connect.status) p.background(0);
                    else p.background(color.r, color.g, color.b);

                    p.fill(0);
                    p.textSize(36);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                    
                    p.textSize(15);
                    p.textStyle(p.NORMAL);
                    p.text("a live performance between the audience and an instrument", p.width/2, p.height/2-62, p.width-80, 60);
                    p.textSize(15);
                    p.textStyle(p.NORMAL);
                    p.text("enter the performance space and tap this screen to find your seat; marked by circles in the floor projection", p.width/2, p.height/2+30, p.width-80, 60);

                    //p.textStyle(p.BOLD);
                    //p.text("you are in group: " + title, p.width/2, p.height/2+100);
                    p.textStyle(p.NORMAL);
                    p.text("keep this window open and your phone connected to the KNURL wifi (no internet) feel free to tap the screen anytime to check the connection", p.width/2, p.height/2+150, p.width-80, 90);

                    p.text("you are in group:", p.width/2, p.height-80);
                    p.textStyle(p.BOLD);
                    p.textSize(20);
                    p.text(title, p.width/2, p.height-50);


                break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    if(active == 0) {
                        if(connect.status) p.background(50);
                        else p.background(0);

                        p.fill(255);
                        p.textSize(36);
                        p.textStyle(p.BOLD);
                        p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                        p.textStyle(p.NORMAL);
                        p.textSize(15);
                        p.text("but your input is deactivated for now :)", p.width/2, p.height/2-62, p.width-80, 60);

                        p.textStyle(p.BOLD);
                        p.textSize(20);
                        p.text(title, p.width/2, p.height-50);


                    } else {


                        var changed;
                        //hehe bit messy but works
                        if(groupnum == 3) changed = p.createVector(color.r+slideval[2]*30, color.g, color.b);
                        else if (groupnum == 2) changed = p.createVector(color.r+slideval[2]*15, color.g+slideval[2]*30, color.b);
                        else if(groupnum == 1) changed = p.createVector(color.r+slideval[2]*60, color.g-slideval[2]*10, color.b);
                        else changed = p.createVector(color.r-slideval[2]*30, color.g, color.b);
                        //console.log(changed);

                        if(connect.status) p.background(255);
                        else p.background(changed.x, changed.y, changed.z);



                        for(var i = 0; i < 4; i++) {
                            if(sliders[i].isChanged) {
                                //console.log(sliders[i].val);
                            }
                            if(sliders[i].isReleased) {
                                slideval[i] = sliders[i].val;
                                //console.log(slideval);
                                sendAway(i, slideval[i]);
                            }
                        }

                        p.textSize(14);
                        p.fill(70);
                        p.textStyle(p.NORMAL);
                        p.text("watch & listen as you interact", p.width/2, 65, p.width-80, 60);


                        p.fill(70);
                        p.textSize(15);
                        p.textStyle(p.NORMAL);

                        p.textAlign(p.LEFT);

                        p.push();
                        p.translate(p.width/5-28, p.height-110);
                        p.rotate(-p.HALF_PI);     
                        p.text("number of particles", 0, 0);
                        p.pop();

                        p.push();
                        p.translate(p.width/5*2-28, p.height-110);
                        p.rotate(-p.HALF_PI);     
                        p.text("size of particles", 0, 0);
                        p.pop();

                        p.push();
                        p.translate(p.width/5*3-28, p.height-110);
                        p.rotate(-p.HALF_PI);     
                        p.text("color of particles", 0, 0);
                        p.pop();

                        p.push();
                        p.translate(p.width/5*4-28, p.height-110);
                        p.rotate(-p.HALF_PI);     
                        p.text("movement of particles", 0, 0);
                        p.pop();
                        
                        p.textAlign(p.RIGHT);

                        p.fill(0);
                        p.push();                     
                        p.translate(p.width/5-28, 80);
                        p.rotate(-p.HALF_PI);     
                        p.text("pitch", 0, 0);
                        p.pop();

                        p.push();
                        p.textAlign(p.RIGHT);
                        p.translate(p.width/5*2-28, 80);
                        p.rotate(-p.HALF_PI);     
                        p.text("volume", 0, 0);
                        p.pop();

                        p.push();
                        p.translate(p.width/5*3-28, 80);
                        p.rotate(-p.HALF_PI);     
                        p.text("filter", 0, 0);
                        p.pop();

                        p.push();
                        p.translate(p.width/5*4-28, 80);
                        p.rotate(-p.HALF_PI);     
                        p.text("movement", 0, 0);
                        p.pop();

                        p.textStyle(p.BOLD);
                        p.textAlign(p.CENTER);
                        p.textSize(20);
                        p.text(title, p.width/2, p.height-50);
                        p.drawGui();
                    }

                break;
                case 8:
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
            
            
        }

        function touchMoved() {
          // do some stuff
          return false;
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

            connect.status = 1;
            sendPing();

            // switch(state) {
            //     case 0:
            //         connect.status = 1;
            //         sendPing();
            //     break;
            //     case 1:
                    
            //     break;
            //     case 2:

            //     break;
            //     case 3:

            //     break;
            //     default:
            // }

            //console.log('down is executed');
        }

        function up() {

            connect.status = 0;
            sendPing();

            // switch(state) {
            //     case 0:
            //         connect.status = 0;
            //         sendPing();
            //     break;
            //     case 1:

            //     break;
            //     case 2:

            //     break;
            //     case 3:

            //     break;
            //     default:
            // }

            //console.log('up is executed');
        }

        function sendAway(slider, val) {

            let thefilter = "";

            switch(slider) {
                case 0:
                    thefilter = "freq";
                break;
                case 1:
                    thefilter = "amp";
                break;
                case 2:
                    thefilter = "filter";
                break;
                case 3:
                    thefilter = "lin";
                break;
                default:
            }

            let thesound = "sound" + (groupnum+1);

            oscMessage = {
                path: "/knurl/change",
                arguments: [ thesound , thefilter , val]
            };


            //SENDING TO KNURL////////////
            starfish.topicPublish("example:2:osc", oscMessage);
            //console.log('message sent ' + JSON.stringify(oscMessage));
            
            //SENDING TO VISUALS//////////
            starfish.topicPublish("example:1:audience:state", {
                // state: recState,
                // active: recActive,
                color: color,
                finalgroupnum: finalgroupnum,
                slideval: slideval,
                connect: connect,
            });
            
        }

        function sendPing() {
            //SENDING TO VISUALS//////////
            starfish.topicPublish("example:1:audience:state", {
                // state: recState,
                // active: recActive,
                color: color,
                finalgroupnum: finalgroupnum,
                slideval: slideval,
                connect: connect,
            });

            //console.log('message sent');
        }



    }, document.getElementById('container'))
});
