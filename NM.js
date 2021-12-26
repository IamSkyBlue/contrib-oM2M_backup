module.exports = function(RED) {
    function NM(n) {
        RED.nodes.createNode(this,n);
        this.appId = n.appId;
        this.contactUrl = n.contactUrl;
    }
    RED.nodes.registerType("NM",NM);
}