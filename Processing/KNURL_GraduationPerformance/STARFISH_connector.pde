//STARFISH BY GERMAN GREINER
class starfishConnector {
  
  //MAKE SURE YOU SET THE RIGHT IP ADDRESS HERE
  final StarfishClient starfish = new StarfishClient("ws://192.168.178.11:9000");
  String clientId;
  
  class AudienceData {
    color kleur; 
    int groupnum;
    float[] thesliders = new float[4];
  }
  
  Map<String, AudienceData> audience = new HashMap<String, AudienceData>();
  
  class CoreData {
    int state;
    int[] active = new int[4];
  }
  
  Map<String, CoreData> core = new HashMap<String, CoreData>();
  
  starfishConnector() {
    try {
      // Connect and store clientId
      starfish.connect().subscribe((String _clientId) -> {
        clientId = _clientId;
      });
      // Subscribe to topics
      starfish.topic$("example:1:audience:state").subscribe((StarfishMessage message) -> {
        //System.out.println(message);
        
        String clientId = message.getHeaders().getClientId();
        List<JsonNode> arguments = new ArrayList<JsonNode>();
        message.getBody().elements().forEachRemaining(arguments::add);
        AudienceData data = new AudienceData();
        
        //System.out.println(arguments.get(0).get("r"));
        data.kleur = color(arguments.get(0).get("r").intValue(), arguments.get(0).get("g").intValue(), arguments.get(0).get("b").intValue());
        data.groupnum = arguments.get(1).get("num").intValue();
        data.thesliders[0] = arguments.get(2).get(0).floatValue();
        data.thesliders[1] = arguments.get(2).get(1).floatValue();
        data.thesliders[2] = arguments.get(2).get(2).floatValue();
        data.thesliders[3] = arguments.get(2).get(3).floatValue();
  
        audience.put(clientId, data);
        
      });
      starfish.topic$("example:1:core:state").subscribe((StarfishMessage message) -> {
        //System.out.println(message);
        
        String clientId = message.getHeaders().getClientId();
        List<JsonNode> arguments = new ArrayList<JsonNode>();
        message.getBody().elements().forEachRemaining(arguments::add);
        CoreData data = new CoreData();
        
        data.state = arguments.get(0).intValue();
        data.active[0] = arguments.get(1).get(0).intValue();
        data.active[1] = arguments.get(1).get(1).intValue();
        data.active[2] = arguments.get(1).get(2).intValue();
        data.active[3] = arguments.get(1).get(3).intValue();
  
        core.put(clientId, data);
      
      });
    } catch (StarfishClientException e) {
      System.err.println("Unable to connect to starfish server");
      e.printStackTrace();
      System.exit(1); 
    } 
  }
  
  void update() {
    
    //keep track of connected clients
    for(int i = 0; i < 4; i++) {
     isconnected[i] = 0;
    }
    
    audience.forEach((id, data) -> {    
      int thegroupnum = data.groupnum;
      isconnected[thegroupnum] += 1;
      float[] sliders = data.thesliders;
      
      //fill(data.kleur);
      //rect(width/4*thegroupnum, 0, width/4, height);
      
      //for(int i = 0; i < 4; i++) {
      //  fill(0, 50);
      //  rect(width/4*thegroupnum+width/16*i, 0, width/16, height-sliders[i]*height);
      //}
      
    });
  
    core.forEach((id, data) -> {
      
      if(STATE != data.state) {
        changeState(data.state); 
      }
      
    });
    
  }

}
