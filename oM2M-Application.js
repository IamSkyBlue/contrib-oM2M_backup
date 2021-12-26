module.exports = function(RED){
	
	function oM2MApplicationNode(config) {
		RED.nodes.createNode(this,config);
        var req
		var node = this;
        this.obixType = config.obixType || 'demo';
		this.obixCategory = config.obixCategory || 'demo';
		this.obixLocation = config.obixLocation || 'demo';
        this.obixAnnounce = config.obixAnnounce || false;

		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);

            if(typeof this.xA !== 'undefined') {
                this.appId = this.xA.appId;

                if (typeof this.xSCL !== 'undefined') {
                    msg.method = "POST";
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + this.xSCL.baseUrl + this.xSCL.sclId + "/applications/";
                    msg.payload = "<om2m:application xmlns:om2m='http://uri.etsi.org/m2m' appId='" + this.appId + "'>";
                    msg.payload += "<om2m:searchStrings>";
                    msg.payload += "<om2m:searchString>Type/" + this.obixType + "</om2m:searchString>";
                    msg.payload += "<om2m:searchString>Category/" + this.obixCategory + "</om2m:searchString>";
                    msg.payload += "<om2m:searchString>Location/" + this.obixLocation + "</om2m:searchString>";
                    msg.payload += "</om2m:searchStrings>";

                    if (this.obixAnnounce == true) {
                        msg.payload+="<om2m:announceTo><om2m:activated>true</om2m:activated><om2m:sclList><reference>nscl</reference></om2m:sclList></om2m:announceTo>";
                    }

                    msg.payload += "</om2m:application>";

                    

                    this.send(msg);
                } else {
                    node.error("No xSCL configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oM2M-Application",oM2MApplicationNode);
}
