module.exports = function(RED){

    function oM2MDescriptorMetaNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.obixType = config.obixType;
        this.obixLocation = config.obixLocation;
        this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);

            if(this.xA) {
                this.appId = this.xA.appId;
                if (this.xSCL) {
                    msg.method = "POST";
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + this.xSCL.baseUrl + this.xSCL.sclId + "/applications/" + this.appId + "/containers/DESCRIPTOR/contentInstances";
                    msg.payload = "<obj>";
                    msg.payload += "<str name='type' val='" + this.obixType +"'/>";
                    msg.payload += "<str name='location' val='" + this.obixLocation + "'/>";
                    msg.payload += "<str name='appId' val='" + this.appId + "'/>";
                    msg.payload += "<op name='getValue' href='" + this.xSCL.sclId + "/applications/" + this.appId + "/containers/DATA/contentInstances/latest/content' ";
                    msg.payload += " in='obix:Nil' out='obix:Nil' is='retrieve'/>";
                    msg.payload += "</obj>";
                    this.send(msg);
                } else {
                    node.error("No xSCL node configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
        });
    }

    RED.nodes.registerType("oM2M-Descriptor-ContentInstance",oM2MDescriptorMetaNode);
}
