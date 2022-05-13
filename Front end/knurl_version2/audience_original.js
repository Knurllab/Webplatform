
window.addEventListener('DOMContentLoaded', () => {

    const core = {};

    const starfish = StarfishClient.build({
        url: "ws://192.168.0.145:9000", // replace IP with the IP of the computer running the server
        // url: "ws://starfish.driangle.org:9000"
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

        let variable = 0;

        //send / click interaction
        let downready = true;
        let isdown = false;
        let shapeActivated = false;
        //button
        let buttonPressed = false;

        let c = []; //color array

        let points = [];
        // Choose color
        let color = { r: 0, g: 0, b: 0 }
        const start = { status: false };
        const connect =  { status: false };
        const finalgroupnum = { num: 0 };
        const thevar = { num: 0 };
        const thesize = { num: 0 };
        const theradius = { num: 0 };
        const thespeed = { num: 0 };


        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight);
            
            p.rectMode(p.CENTER);
            p.textAlign(p.CENTER);
            p.textSize(18);

            groupnum = p.floor(p.random(4));

            finalgroupnum.num = groupnum;
            thevar.num = variable;
            thesize.num = p.floor(p.random(15, 40));
            theradius.num = p.floor(p.random(100, 380));
            thespeed.num = p.floor(p.random(300, 1000));
            
            // c[0] = p.createVector(178, 31, 53);
            // c[1] = p.createVector(255, 203, 53);
            // c[2] = p.createVector(0, 117, 58);
            // c[3] = p.createVector(0, 82, 165);
            //old RGB colors

            p.colorMode(p.HSB, 100);
            //244°, 71%, 76%
            c[0] = p.createVector(50, p.random(20, 50), p.random(200, 255));
            c[1] = p.createVector(60, p.random(20, 50), p.random(200, 255));
            c[2] = p.createVector(255, 0, 100);
            c[3] = p.createVector(70, p.random(20, 50), p.random(200, 255));


            let select = groupnum;
            // console.log(select);
            // console.log(c[select].x);

            color = { r: c[select].x, g: c[select].y, b: c[select].z };

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

            p.rectMode(p.CENTER);
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

                break;
                case 1:
                    if(connect.status) p.background(0);
                    else p.background(color.r, color.g, color.b);

                    p.fill(0);
                    p.textSize(36);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                    p.textStyle(p.NORMAL);
                    p.textSize(15);
                    p.text("a live performance between the audience and an instrument", p.width/2, p.height/2-62, p.width-80, 60);

                    p.textSize(32);
                    p.textStyle(p.BOLD);
                    p.text("TOUCH THE SCREEN", p.width/2, p.height/2+50);
                    p.textStyle(p.NORMAL);
                    p.textSize(15);
                    p.text("watch & listen; your input is part of the performance", p.width/2, p.height/2+97, p.width-80, 60);

                    //p.text("your input is part of the performance", p.width/2, p.height/2+90);

                break;
                case 2:

                    if(groupalone == 0 || (groupalone-1) == groupnum) {

                        if(connect.status) p.background(255);
                        else p.background(color.r, color.g, color.b);

                        if(connect.status) {
                            variable+=0.5;
                        } else {
                            variable-=0.5;
                        }
                        if(variable >= 100) variable = 100;
                        if(variable <= 0) variable = 0;


                        if(p.frameCount%5==0) {
                            thevar.num = variable;
                            sendAway();
                        }   

                        //TITLE
                        p.noStroke();
                        if(buttonPressed) p.fill(255);
                        else p.fill(0);
                        p.rectMode(p.CENTER);
                        p.fill(0);
                        p.textSize(36);
                        p.textStyle(p.BOLD);
                        p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                        p.textStyle(p.NORMAL);
                        p.textSize(15);
                        p.text("a live performance between the audience and an instrument", p.width/2, p.height/2-62, p.width-80, 60);

                        p.textSize(32);
                        p.textStyle(p.BOLD);
                        p.text("TOUCH THE SCREEN", p.width/2, p.height/2+50);
                        p.textStyle(p.NORMAL);
                        p.textSize(15);
                        if(groupalone > 0) {
                            p.text("when you release the slider you control the KNURL", p.width/2, p.height/2+97, p.width-80, 60);
                        } else {
                            p.text("watch & listen; your input is part of the performance", p.width/2, p.height/2+97, p.width-80, 60);
                        }

                        let mapvar = p.map(variable, 0, 100, 0, p.height);
                        p.rectMode(p.CORNER);
                        p.rect(0, p.height-mapvar, p.width, mapvar);


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
                case 3:
                    if(connect.status) p.background(0);
                    else p.background(color.r, color.g, color.b);

                    p.fill(0);
                    p.textSize(36);
                    p.textStyle(p.BOLD);
                    p.text("THIS ISN'T SOLO", p.width/2, p.height/2-110);
                    p.textStyle(p.NORMAL);
                    p.textSize(15);
                    p.text("a live performance between the audience and an instrument", p.width/2, p.height/2-62, p.width-80, 60);

                    p.textSize(32);
                    p.textStyle(p.BOLD);
                    p.text("TOUCH THE SCREEN", p.width/2, p.height/2+50);
                    p.textStyle(p.NORMAL);
                    p.textSize(15);
                    p.text("try to hit the lines to play a melody", p.width/2, p.height/2+97, p.width-80, 60);

                    //p.text("your input is part of the performance", p.width/2, p.height/2+90);

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
                case 1:
                    connect.status = true;
                    sendAway();
                break;
                case 2:
                    connect.status = true;
                    // variable++;
                    // thevar.num = variable;
                    // sendAway();
                break;
                case 3:
                    connect.status = true;
                    sendAway();
                break;
                default:
            }

            //console.log('down is executed');
        }

        function up() {

            switch(state) {
                case 1:
                    connect.status = false;
                    sendAway();
                break;
                case 2:
                    connect.status = false;
                    sendAway();
                break;
                case 3:
                    connect.status = false;
                    sendAway();
                break;
                default:
            }

            //console.log('up is executed');
        }

        function sendAway() {
            // Send current state to server using topic "example:1:audience:state"
            start.status = connect.status;
            

            starfish.topicPublish("example:1:audience:state", {
                color: color,
                start: start,
                finalgroupnum: finalgroupnum,
                thevar: thevar,
                thesize: thesize,
                theradius: theradius,
                thespeed: thespeed
            });
            
        }


    }, document.getElementById('container'))
});


