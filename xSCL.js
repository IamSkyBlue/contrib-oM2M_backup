module.exports = function(RED) {
    function xSCL(n) {
        RED.nodes.createNode(this,n);
        this.sclId = n.sclId;
        this.host = n.host;
        this.port = n.port;
        this.baseUrl = n.baseUrl;
    }
    RED.nodes.registerType("xSCL",xSCL);
}