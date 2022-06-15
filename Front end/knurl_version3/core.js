
window.addEventListener('DOMContentLoaded', () => {
    // audience state
    const audience = {};
    const knurl = {};


    const starfish = StarfishClient.build({
        //url: "ws://127.0.0.1:9000", // replace IP with the IP of the computer running the server
        //url: "ws://192.168.0.145:9000", // replace IP with the IP of the computer running the server
        url: "ws://172.20.2.89:9000", // replace IP with the IP of the computer running the server
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

        let numAudience =  Object.values(audience).length;
        

        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight);

   
        }

        p.draw = () => {
            p.background(255);

            numAudience = Object.values(audience).length;

            Object.values(audience).forEach((member, index) => {
                const color = member.color;
                const groupnum = member.finalgroupnum.num;
                const thestatus = member.start.status;

                //console.log(groupnum);
                // if(thestatus) {
                //     console.log(thestatus);
                // }
                
            });

            Object.values(knurl).forEach((member, index) => {
                //console.log(member.arguments);
                let thestuff = member.arguments;
                let phase = thestuff[0];
                //console.log("phase " + phase);
                
                if(state != phase) {
                    state = phase;
                    sendAway_audience();
                }

                console.log(thestuff);
                if(active != thestuff.slice(1)) {
                    active = thestuff.slice(1);
                    sendAway_audience();
                }
                
                //console.log(active);

            });
            
            p.textAlign(p.CENTER);
            p.textSize(30);
            p.fill(0);
            p.text('current state = ' + state, p.width/2, p.height/2);
            p.text('active status = ' + active, p.width/2, p.height/2+40);


            
        }

        p.keyPressed = () => {

            if(p.key == 't') sendAway_knurl(1, p.random(1), p.random(1), p.random(1), p.random(1));  

            if(p.key == 's') {
                state+=1;
                if(state >= 4) state = 0;
                sendAway_audience();
            }

            if(p.key == 'd') {
                active = [0, 1, 0, 1];
                sendAway_audience();
            }

            if(p.key == 'f') {
                active = [1, 1, 1, 1];
                sendAway_audience();
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
                active: active
            });
            
        }


    }, document.getElementById('container'))
});


