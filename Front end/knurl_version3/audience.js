
window.addEventListener('DOMContentLoaded', () => {

    const core = {};

    const starfish = StarfishClient.build({
        //url: "ws://127.0.0.1:9000", // replace IP with the IP of the computer running the server
        //url: "ws://192.168.0.145:9000", // replace IP with the IP of the computer running the server
        url: "ws://192.168.178.11:9000", // replace IP with the IP of the computer running the server
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
        let color = { r: 0, g: 0, b: 0 }
        const finalgroupnum = { num: 0 };

        p.setup = () => {
            let canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            gui = p.createGui(canvas);
            sliders[0] = p.createSliderV("Slider"+0, p.width/5*1-20, 100, 40, p.height-200);
            sliders[1] = p.createSliderV("Slider"+1, p.width/5*2-20, 100, 40, p.height-200);
            sliders[2] = p.createSliderV("Slider"+2, p.width/5*3-20, 100, 40, p.height-200);
            sliders[3] = p.createSliderV("Slider"+3, p.width/5*4-20, 100, 40, p.height-200);
            

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
            c[2] = p.createVector(255, 0, 100);
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


            switch(state) { 
                case 0:
                    p.background(color.r, color.g, color.b);

                    p.fill(0);
                    p.textSize(36);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                    p.textStyle(p.NORMAL);
                    p.textSize(15);
                    p.text("a live performance between the audience and an instrument", p.width/2, p.height/2-62, p.width-80, 60);
                    p.text("please wait...", p.width/2, p.height/2, p.width-80, 60);

                    p.text("I am in group number: " + groupnum, p.width/2, p.height/2+100)

                break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    if(active == 0) {
                        p.background(0);

                        p.fill(255);
                        p.textSize(36);
                        p.textStyle(p.BOLD);
                        p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                        p.textStyle(p.NORMAL);
                        p.textSize(15);
                        p.text("but your input is deactivated for now :)", p.width/2, p.height/2-62, p.width-80, 60);

                        p.text("group: " + (groupnum+1), p.width/2, p.height-50);


                    } else {
                        p.background(color.r, color.g, color.b);

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

                        p.fill(0);
                        p.textSize(15);
                        p.textStyle(p.BOLD);
                        p.text("frequency", p.width/5, 50);
                        p.text("volume", p.width/5*2, 50);
                        p.text("filter", p.width/5*3, 50);
                        p.text("line", p.width/5*4, 50);

                        p.text("group: " + (groupnum+1), p.width/2, p.height-50);
                        p.drawGui();
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
                case 1:

                break;
                case 2:

                break;
                case 3:

                break;
                default:
            }

            //console.log('down is executed');
        }

        function up() {

            switch(state) {
                case 1:

                break;
                case 2:

                break;
                case 3:

                break;
                default:
            }

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
            console.log('message sent ' + JSON.stringify(oscMessage));
            
            //SENDING TO VISUALS//////////
            starfish.topicPublish("example:1:audience:state", {
                // state: recState,
                // active: recActive,
                color: color,
                finalgroupnum: finalgroupnum,
                slideval: slideval,

            });
            
        }



    }, document.getElementById('container'))
});


