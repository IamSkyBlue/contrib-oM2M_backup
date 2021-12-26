module.exports = function(RED){

    function oM2MoneContentInstanceNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.obixCategory = config.obixCategory || 'demo';
        this.on('input', function(msg) {
            this.xN_CSE = RED.nodes.getNode(config.xN_CSE);
            this.NM = RED.nodes.getNode(config.NM);

            if(this.NM) {
                this.appId = this.NM.appId;
                if (this.xN_CSE) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xN_CSE.host + ":" + this.xN_CSE.port + "/"+ this.xN_CSE.baseUrl +"/" + this.xN_CSE.sclId +"/"+this.xN_CSE.sclId.substring(0,2)+"-name/"+ this.appId + "/DATA";

                    var text = "<om2m:cin xmlns:om2m=\"http://www.onem2m.org/xml/protocols\">";
                    text += "<cnf>message</cnf>";
                    text += "<con>";
                    text += "&lt;obj&gt;";
                    text += "&lt;str name=&quot;appId&quot; val=&quot;"+ this.appId +"&quot;/&gt;";
                    text += "&lt;str name=&quot;category&quot; val=&quot;"+ this.obixCategory +"&quot;/&gt;";

                    var value = JSON.parse(msg.payload);
                    switch (value.type){
                        case 'int':
                            text += "&lt;int name=&quot;data&quot; val=&quot;"+ value.data +"&quot;/&gt;";
                            break;
                        case 'string':
                            text += "&lt;int name=&quot;data&quot; val=&quot;"+ value.data +"&quot;/&gt;";
                            break;
                        case 'gps':
                            text += "&lt;int name=&quot;latitude&quot; val=&quot;"+ value.latitude +"&quot;/&gt;";
                            text += "&lt;int name=&quot;longitude&quot; val=&quot;"+ value.longitude +"&quot;/&gt;";
                            //text += "&lt;int name=&quot;data&quot; val=&quot;GPS&quot;/&gt;";
                            break;
                        default:
                            text += "&lt;int name=&quot;data&quot; val=&quot;"+ value.data +"&quot;/&gt;";
                            break;
                    }
                    text += "&lt;int name=&quot;unit&quot; val=&quot;"+ value.unit +"&quot;/&gt;";
                    text += "&lt;/obj&gt;";
                    text += "</con>";
                    text += "</om2m:cin>";
                    msg.payload = text;

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

    RED.nodes.registerType("oM2M-ONE-Data-ContentInstance",oM2MoneContentInstanceNode);
}
