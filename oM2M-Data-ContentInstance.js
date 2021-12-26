module.exports = function(RED){

    function oM2MContentInstanceNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.obixCategory = config.obixCategory || 'demo';
        this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);

            if(this.xA) {
                this.appId = this.xA.appId;
                if (this.xSCL) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + this.xSCL.baseUrl + this.xSCL.sclId + "/applications/" + this.appId + "/containers/DATA/contentInstances";

                    var text = "<obj>";
                    text += "<str name='appId' val='" + this.appId + "'/>";
                    text += "<str name='category' val='" + this.obixCategory + "'/>";
                    var value = JSON.parse(msg.payload);
                    text += "<str name='unit' val='" + value.unit + "'/>";
                    switch (value.type){
                        case 'int':
                            text += "<int name='data' val='" + value.data + "'/>";
                            break;
                        case 'string':
                            text += "<str name='data' val='" + value.data + "'/>";
                            break;
                        case 'gps':
                        default:
                            text += "<str name='latitude' val='"+value.latitude+"'/>";
                            text += "<str name='longitude' val='"+value.longitude+"'/>";
                            break;
                    }
                    text += "</obj>";
                    msg.payload = text;
                    this.send(msg);
                } else {
                    node.error("No xSCL node configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
        });
    }

    RED.nodes.registerType("oM2M-Data-ContentInstance",oM2MContentInstanceNode);
}
