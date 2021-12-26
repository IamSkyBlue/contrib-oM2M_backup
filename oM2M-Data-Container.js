module.exports = function(RED){
	
	function oM2MDataContainerNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		this.maxNrOfInstances = config.maxNrOfInstances || '10';
        this.obixAnnounce = config.obixAnnounce || false;

		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);

            if(this.xA) {
                this.appId = this.xA.appId;

                if (this.xSCL) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + this.xSCL.baseUrl + this.xSCL.sclId + "/applications/" + this.appId + "/containers/";
                    msg.payload = "<om2m:container xmlns:om2m='http://uri.etsi.org/m2m' om2m:id='DATA'>";
                    if (this.maxNrOfInstances > 0)
                        msg.payload += "<om2m:maxNrOfInstances>" + this.maxNrOfInstances + "</om2m:maxNrOfInstances>";

                    if (this.obixAnnounce == true) {
                        msg.payload+="<om2m:announceTo><om2m:activated>true</om2m:activated><om2m:sclList><reference>nscl</reference></om2m:sclList></om2m:announceTo>";
                    }
                    
                    msg.payload += "</om2m:container>";
                    this.send(msg);
                } else {
                    node.error("No xSCL node configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oM2M-Data-Container",oM2MDataContainerNode);
}
