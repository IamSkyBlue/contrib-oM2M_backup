module.exports = function(RED){
	
	function oM2MSubscriptionNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
        this.contactPath = config.contactPath || '/data';
		this.filterCriteria = config.filterCriteria || 'content';
        //this.filterType = config.filterType || 'ifMatch';
        this.filterType = 'ifMatch';

		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);

            if(typeof this.xA !== 'undefined') {
                this.appId = this.xA.appId;

                if (typeof this.xSCL !== 'undefined') {
                    //msg.method = "POST";
                    //msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + this.xSCL.baseUrl + this.xSCL.sclId + "/applications/";
                    //msg.payload = "<om2m:subscription xmlns:om2m='http://uri.etsi.org/m2m' xmlns:xmime='http://www.w3.org/2005/05/xmlmime'>";
                    //msg.payload += "<om2m:filterCriteria><" +  this.filterType + ">" + this.filterCriteria + "</" +  this.filterType + "></om2m:filterCriteria>";
                    //msg.payload += "<om2m:contact>" + this.xA.contactUrl + this.contactPath + "</om2m:contact>"; //ORIGINAL DE EDUARDO
                    //msg.payload += "<om2m:contact> http://127.0.0.1:1880" + this.contactPath + "</om2m:contact>";
                    //msg.payload += "</om2m:subscription>";

                    msg.payload = '<om2m:subscription xmlns:om2m="http://uri.etsi.org/m2m">';
                    msg.payload += '<om2m:filterCriteria>';
                    msg.payload += '<ifMatch>content</ifMatch>';
                    msg.payload += '</om2m:filterCriteria>';
                    msg.payload += '<om2m:contact>http://'+this.xA.contactUrl+this.contactPath+'</om2m:contact>';
                    msg.payload += '</om2m:subscription>';


                    this.send(msg);
                } else {
                    node.error("No xSCL configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oM2M-Subscription",oM2MSubscriptionNode);
}
