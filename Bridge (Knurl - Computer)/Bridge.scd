

                    Knurl              |    Computer bridge               |     Platform or other Collaborator
ip adress         192.168.3.2          |          x                       |                x
port                 6000              |         7000                     |               8000


// Quit the server to avoid excessive messages into your sc console
s.quit;

// Allows to receive from port
thisProcess.openUDPPort(7000);


// Send to Knurl
m = NetAddr.new("192.168.30.1", 6000 );

//try to send something, like:
fork{loop {m.sendMsg('/knurl', "hey") ; 2.wait;}}

//or trigger one synth, like:
m.sendMsg('/knurl/trigger',  'Ambience',1) ;

m.sendMsg('/knurl/trigger',  'Reus',1) ;


//run this vode bellow to bridge to recieve the code:
(
f = { |msg, time, addr|
    if(msg[0] != '/status.reply') {
        "time: % sender: %\nmessage: %\n".postf(time, addr, msg);
		if(msg[1]!= msg[1]){
		m.sendMsg(msg[0].asSymbol,  msg[1], msg[2], msg[3]);
		}
    }
};
thisProcess.addOSCRecvFunc(f);
);


// to stop this process:
thisProcess.addOSCRecvFunc(f);


//to receive (only for internal test)
o = OSCFunc({ arg msg, time, addr, recvPort; [msg, time, addr, recvPort].postln(1); }, '/knurl'); // create the OSCFunc

OSCFunc.trace(true)
OSCFunc.trace(false)

