module.exports = function(RED){

    function oM2MoneDescriptorMetaNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.obixType = config.obixType;
        this.obixLocation = config.obixLocation;
        this.on('input', function(msg) {
            this.xN_CSE = RED.nodes.getNode(config.xN_CSE);
            this.NM = RED.nodes.getNode(config.NM);

            if(this.NM) {
                this.appId = this.NM.appId;
                if (this.xN_CSE) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xN_CSE.host + ":" + this.xN_CSE.port + "/"+ this.xN_CSE.baseUrl +"/" + this.xN_CSE.sclId +"/"+this.xN_CSE.sclId.substring(0,2)+"-name/"+ this.appId + "/DESCRIPTOR";
                    msg.payload = "<om2m:cin xmlns:om2m=\"http://www.onem2m.org/xml/protocols\">";
                    msg.payload += "<cnf>message</cnf>";
                    msg.payload += "<con>";
                    msg.payload += "&lt;obj&gt;";
                    msg.payload += "&lt;str name=&quot;type&quot; val=&quot;"+this.obixType+"&quot;/&gt;";
                    msg.payload += "&lt;str name=&quot;location&quot; val=&quot;"+this.obixLocation+"&quot;/&gt;";
                    msg.payload += "&lt;str name=&quot;appId&quot; val=&quot;"+this.appId+"&quot;/&gt;";
                    msg.payload += "&lt;op name=&quot;getValue&quot; href=&quot;/"+this.xN_CSE.sclId+"/"+this.appId+"/DATA/la&quot;";
                    msg.payload += " in=&quot;obix:Nil&quot; out=&quot;obix:Nil&quot; is=&quot;retrieve&quot;/&gt;";
                    msg.payload += "&lt;/obj&gt;";
                    msg.payload += "</con>";
                    msg.payload += "</om2m:cin>";

                    msg.headers = {
                        "Content-type": "application/xml;ty=4",
                        "X-M2M-Origin": "admin:admin"
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

    RED.nodes.registerType("oM2M-ONE-Descriptor-ContentInstance",oM2MoneDescriptorMetaNode);
}
