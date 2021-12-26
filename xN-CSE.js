module.exports = function(RED) {
    function xN_CSE(n) {
        RED.nodes.createNode(this,n);
        this.sclId = n.sclId;
        this.host = n.host;
        this.port = n.port;
        this.baseUrl = n.baseUrl;
    }
    RED.nodes.registerType("xN_CSE",xN_CSE);
}