module.exports = function(RED){
	
	function oM2MDescriptorContainerNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);

            if(this.xA) {
                this.appId = this.xA.appId;

                if (this.xSCL) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + this.xSCL.baseUrl + this.xSCL.sclId + "/applications/" + this.appId + "/containers/";
                    msg.payload = "<om2m:container xmlns:om2m='http://uri.etsi.org/m2m' om2m:id='DESCRIPTOR'>";
                    msg.payload += "<om2m:maxNrOfInstances>2</om2m:maxNrOfInstances>";
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

	RED.nodes.registerType("oM2M-Descriptor-Container",oM2MDescriptorContainerNode);
}
