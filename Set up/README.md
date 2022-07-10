# Knurl lab platform
Interactive platform for audience engagement of a hybrid instrument

## Set up

This project uses starfish, download here:
https://github.com/driangle/starfish-bridge 

You will also need to download Node.js

Components include: 
- Knurl Brigde (bridge from OSC to Knurl instrument)
- starfish-bridge (back end server handling all communications)
- Front End interface (audience & core: graphical interface for interaction & display) 

The Front End 'core' page initiates messages to the audience & to the Knurl Bridge. 
The Front End 'audience' page initiates messages to the core page. 

## Instructions
Prototype 3.0 - updated on 15/05/2022 - You can run this project in a local server or online. 

### For running the platform:
0) In the folder Change ip adressat javascript code to the one you are ussing at "core.js" and "audience.js"
1) get acess to the folder specified 
C:\Users\rafae\Documents\starfish-bridge-master-2\starfish-bridge-master\client\demos>
2) Run yarn:
yarn
yarn serve
3) Acess 127.0.0.1:8080
------------------------------------------------------------------------------------
### Running the proxy:
1) get acess to the folder specified 
C:\Users\rafae\Documents\starfish-bridge-master-2\starfish-bridge-master\client\demos>
2) Run yarn
yarn (if you never runed before)
yarn start
------------------------------------------------------------------------------------
### Send / receiving messages on Supercollider
1) get acess to the folder located with (for example):
cd Documents
2) Run the following command (make sure to use the same ip from above)
node ./starfish-osc-proxy-0.1.3.js --starfish-server-url ws://192.168.0.145:9000  --subscribe-topic example:2:osc  --to-osc-host localhost  --to-osc-port 8000  --publish-topic from:knurl --receive-osc-port 8001  --verbose 
3) In supercollider, run the folder "OSC.scd" setting the right ip adress


All ready and in sync? Time to press  start at the folder "main.scd"!

