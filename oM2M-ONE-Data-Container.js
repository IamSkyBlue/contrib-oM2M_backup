module.exports = function(RED){
	
	function oM2MoneDataContainerNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		this.maxNrOfInstances = config.maxNrOfInstances || '10';
        this.obiNMnnounce = config.obiNMnnounce || false;

		this.on('input', function(msg) {
            this.xN_CSE = RED.nodes.getNode(config.xN_CSE);
            this.NM = RED.nodes.getNode(config.NM);

            if(this.NM) {
                this.appId = this.NM.appId;

                if (this.xN_CSE) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xN_CSE.host + ":" + this.xN_CSE.port + "/"+ this.xN_CSE.baseUrl + "/"+ this.xN_CSE.sclId +"/"+this.xN_CSE.sclId.substring(0,2)+"-name/"+ this.appId;
                    msg.payload = "<om2m:cnt xmlns:om2m=\"http://www.onem2m.org/xml/protocols\">";
                    //if (this.maxNrOfInstances > 0)
                    //    msg.payload += "<om2m:maxNrOfInstances>" + this.maxNrOfInstances + "</om2m:maxNrOfInstances>";

                    //if (this.obiNMnnounce == true) {
                    //    msg.payload+="<om2m:announceTo><om2m:activated>true</om2m:activated><om2m:sclList><reference>nscl</reference></om2m:sclList></om2m:announceTo>";
                    //}
                    
                    msg.payload += "</om2m:cnt>";

                    msg.headers = {
                        "Content-type": "application/xml;ty=3",
                        "X-M2M-Origin": "admin:admin",
                        "X-M2M-NM": "DATA"
                    }

                    this.send(msg);
                } else {
                    node.error("No xN_CSE node configured", msg);
                }
            } else {
                node.error("No NM configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oM2M-ONE-Data-Container",oM2MoneDataContainerNode);
}
