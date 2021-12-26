module.exports = function(RED){
	
	function oM2MoneSubscriptionNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
        this.contactPath = config.contactPath || '/data';
		this.filterCriteria = config.filterCriteria || 'content';
        //this.filterType = config.filterType || 'ifMatch';
        this.filterType = 'ifMatch';

		this.on('input', function(msg) {
            this.xN_CSE = RED.nodes.getNode(config.xN_CSE);
            this.NM = RED.nodes.getNode(config.NM);
	    this.CNT = config.CNT || "";

            if(typeof this.NM !== 'undefined') {
                this.appId = this.NM.appId;

                if (typeof this.xN_CSE !== 'undefined') {
                    msg.method = "POST";
                    msg.url = "http://" + this.xN_CSE.host + ":" + this.xN_CSE.port +"/"+ this.xN_CSE.baseUrl+"/" + this.xN_CSE.sclId + "/"+ this.xN_CSE.sclId.substring(0,2)+"-name/"+ this.appId;
		    if(this.CNT != "")
			{ msg.url += "/" + this.CNT;}
                    //msg.payload = "<om2m:subscription xmlns:om2m='http://uri.etsi.org/m2m' xmlns:xmime='http://www.w3.org/2005/05/xmlmime'>";
                    //msg.payload += "<om2m:filterCriteria><" +  this.filterType + ">" + this.filterCriteria + "</" +  this.filterType + "></om2m:filterCriteria>";
                    //msg.payload += "<om2m:contact>" + this.NM.contactUrl + this.contactPath + "</om2m:contact>"; //ORIGINAL DE EDUARDO
                    //msg.payload += "<om2m:contact> http://127.0.0.1:1880" + this.contactPath + "</om2m:contact>";
                    //msg.payload += "</om2m:subscription>";

                    msg.payload = "<m2m:sub xmlns:m2m=\"http://www.onem2m.org/xml/protocols\">";
                    msg.payload += "<nu>"+this.contactPath+"</nu>";
                    msg.payload += "<nct>2</nct>";
                    msg.payload += "</m2m:sub>";
		
                    msg.headers = {
                        "Content-type": "application/xml;ty=23",
                        "X-M2M-Origin": "admin:admin",
                       // "X-M2M-NM": "SUB_"+this.appId
                    }
		    if(this.CNT != ""){
			msg.headers["X-M2M-NM"] = "SUB_" + this.CNT;
		    }else{
			msg.headers["X-M2M-NM"] = "SUB_" + this.appId;
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

	RED.nodes.registerType("oM2M-ONE-Subscription",oM2MoneSubscriptionNode);
}
