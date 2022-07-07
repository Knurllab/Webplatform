
window.addEventListener('DOMContentLoaded', () => {
    // audience state
    const audience = {};
    const knurl = {};


    const starfish = StarfishClient.build({
        url: "ws://192.168.0.145:9000", // replace IP with the IP of the computer running the server
        //url: "ws://192.168.178.11:9000", // replace IP with the IP of the computer running the server
        //url: "ws://192.168.4.69:9000"
        //url: "ws://starfish.driangle.org:9000"
    });

    // Connect
    starfish.connect().then(clientId => {
        console.log('Connected to starfish server. ClientId: [' + clientId + ']');
        // document.getElementById("connection-status").innerText = "Connected";

        // Subscribe to topic "example:1:knurl:state" to receive knurl state
        starfish.topic$('from:knurl').subscribe(message => {
            // update audience state
            knurl[message.headers.clientId] = message.body;
        });

        // Subscribe to topic "example:1:audience:state" to receive audience state
        starfish.topic$('example:1:audience:state').subscribe(message => {
            // update audience state
            audience[message.headers.clientId] = message.body;
        });

        // Subscribe to topic "sfb:client:disconnected" to remove a user's state
        starfish.topic$('sfb:client:disconnected').subscribe(message => {
            delete audience[message.headers.clientId];
            delete knurl[messsage.headers.clientId];
        });
    }).catch(e => {
        // document.getElementById("connection-status").innerText = "Unable to Connected";
    });

    const sketch = new p5((p) => {
  
        let state = 0;
        let alone = false;
        let active = [1, 1, 1, 1];
        const connect = { status: false };

        let numAudience =  Object.values(audience).length;

        let independent = false;

        let saveTime = 10000;
        let waitTime = 3000;
        

        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight);

   
        }

        p.draw = () => {
            p.background(255);

            numAudience = Object.values(audience).length;

            Object.values(audience).forEach((member, index) => {
                const color = member.color;
                const groupnum = member.finalgroupnum.num;
                const slideval = member.slideval;
                //const connect = member.connect.status;

                connect.status = member.connect.status;
                //console.log(member.connect.status);

                p.textSize(10);
                p.textAlign(p.LEFT);
                p.text('client ' + index + ' sliders ' + slideval, 10, p.height/4+ index*15 + 100);
                
            });

            Object.values(knurl).forEach((member, index) => {
                //console.log(member.arguments);
                let thestuff = member.arguments;
                let phase = thestuff[0];
                
                if(!independent) {
                    if(state != phase) {
                        state = phase;
                        sendAway_audience();
                    }

                    console.log(thestuff);
                    if(active != thestuff.slice(1)) {
                        active = thestuff.slice(1);
                        sendAway_audience();
                    }

                }


            });

            //timer to send away to audience?
            if(p.millis()-saveTime > waitTime) {
                sendAway_audience();
                saveTime = p.millis();
                console.log('sending ping to audience');
            }
            
            p.textAlign(p.CENTER);
            p.textSize(30);
            p.fill(0);
            p.text('current state = ' + state, p.width/2, p.height/4);
            p.text('active status = ' + active, p.width/2, p.height/4+40);


            
        }

        p.keyPressed = () => {

            if(p.key == 't') sendAway_knurl(1, p.random(1), p.random(1), p.random(1), p.random(1));  

            if(p.key == 's') {
                state+=1;
                if(state >= 9) state = 0;
                sendAway_audience();
            }

            if(p.key == 'd') {
                active = [p.floor(p.random(2)), p.floor(p.random(2)), p.floor(p.random(2)), p.floor(p.random(2))];
                sendAway_audience();
            }

            if(p.key == 'f') {
                active = [1, 1, 1, 1];
                sendAway_audience();
            }

            if(p.key == 'q') {
                independent = !independent;
                console.log('I AM INDEPENDENT ' + independent);
            }

        }

        p.mousePressed = () => {
            sendAway_audience();
        }


        function sendAway_knurl(thegroup, theslider, thevar) {
            //first also send away to audience to make sure everyone is in the right state
            //sendAway_audience();

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


            oscMessage0 = {
                path: "/knurl/change",
                arguments: [ theSynth , 'freq' , p.round(thevar, 2)]
            };
            oscMessage1 = {
                path: "/knurl/change",
                arguments: [ theSynth , 'amp' , p.round(thevar, 2) ]
            };
            oscMessage2 = {
                path: "/knurl/change",
                arguments: [ theSynth , 'filter' , p.round(thevar, 2) ]
            };
            oscMessage3 = {
                path: "/knurl/change",
                arguments: [ theSynth , 'lin' , p.round(thevar, 2) ]
            };

            console.log('message sent 0 ' + JSON.stringify(oscMessage0));
            console.log('message sent 1 ' + JSON.stringify(oscMessage1));
            console.log('message sent 2 ' + JSON.stringify(oscMessage2));
            console.log('message sent 3 ' + JSON.stringify(oscMessage3));

            starfish.topicPublish("example:2:osc", oscMessage0);
            starfish.topicPublish("example:2:osc", oscMessage1);
            starfish.topicPublish("example:2:osc", oscMessage2);
            starfish.topicPublish("example:2:osc", oscMessage3);
   
            
        }

        function sendAway_audience() {
            starfish.topicPublish("example:1:core:state", {
                state: state,
                active: active,
            });
            
        }


    }, document.getElementById('container'))
});


