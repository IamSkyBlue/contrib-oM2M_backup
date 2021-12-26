module.exports = function(RED) {
    function xA(n) {
        RED.nodes.createNode(this,n);
        this.appId = n.appId;
        this.contactUrl = n.contactUrl;
    }
    RED.nodes.registerType("xA",xA);
}