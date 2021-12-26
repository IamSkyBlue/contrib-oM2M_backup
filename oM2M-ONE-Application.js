module.exports = function(RED){
	
	function oM2MoneApplicationNode(config) {
		RED.nodes.createNode(this,config);
        var req
		var node = this;
        this.obixType = config.obixType || 'demo';
		this.obixCategory = config.obixCategory || 'demo';
		this.obixLocation = config.obixLocation || 'demo';
        this.obiNMnnounce = config.obiNMnnounce || false;

		this.on('input', function(msg) {
            this.xN_CSE = RED.nodes.getNode(config.xN_CSE);
            this.NM = RED.nodes.getNode(config.NM);

            if(typeof this.NM !== 'undefined') {
                this.appId = this.NM.appId;

                if (typeof this.xN_CSE !== 'undefined') {
                    msg.method = "POST";
                    msg.url = "http://" + this.xN_CSE.host + ":" + this.xN_CSE.port + "/"+ this.xN_CSE.baseUrl + "/" +this.xN_CSE.sclId;
                    msg.payload = "<om2m:ae xmlns:om2m=\"http://www.onem2m.org/xml/protocols\">";
                    msg.payload += "<api>app-sensor</api>";
                    msg.payload += "<lbl>Type/"+this.obixType+" Category/"+ this.obixCategory+" Location/"+this.obixLocation+"</lbl>";
                    msg.payload += "<rr>false</rr>";

                    //if (this.obiNMnnounce == true) {
                    //   msg.payload+="<om2m:announceTo><om2m:activated>true</om2m:activated><om2m:sclList><reference>nscl</reference></om2m:sclList></om2m:announceTo>";
                    //}

                    msg.payload += "</om2m:ae>";

                    
                    msg.headers = {
                        "Content-type": "application/xml;ty=2",
                        "X-M2M-Origin": "admin:admin",
                        "X-M2M-NM": this.appId
                    }

                    this.send(msg);
                } else {
                    node.error("No xN_CSE configured", msg);
                }
            } else {
                node.error("No NM configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oM2M-ONE-Application",oM2MoneApplicationNode);
}
