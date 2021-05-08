
                    Knurl              |    Computer bridge               |     Platform or other Collaborator
ip adress         192.168.3.2          |          x                       |                x
port                 6000              |         7000                     |               8000



Send messages to Knurl through:

```
m = NetAddr.new("192.168.30.1", 6000 );
```

## In order to play a synth, you have to write the name of the sytnh and 1:

```
m.sendMsg('/knurl/trigger',  'Ambience',1) ;
m.sendMsg('/knurl/trigger',  'Reus',1) ;
```

## At this link you can find a list of the available synths at the moment:

## To stop, you write the name, after a 0:

```
m.sendMsg('/knurl/trigger',  'Ambience', 0) ;
m.sendMsg('/knurl/trigger',  'Reus', 0) ;
```

## To controll a variable, you can write the name of the synth, the variable, a number between 0,1:
```
m.sendMsg('/knurl/set',  'Reus', 'freq', 0.4) ;
```

You may chose 4 different variables:
freq amp filter linlin


## To receive Knurl's frequency, amplitude or the amount of pressings into a button, you have to type:

```
m.sendMsg('/knurl',  'Request acess to data') ;
```

You will receive:
'Acess accepted'

or:
'Acess denied'

Remark: Knurl can send you this messages any time, make sure to know how to handle or filter it!



## For the platform:

An extra feature diffrenciate performers from the audience: A gate into Knurl sounds will avoid people to perform in a inapropiate time or ambience. This code is internally handled, so no debuggs for you!  :) 
