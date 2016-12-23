class Node {
    constructor(val) {
        this.val = val
        this.dot = null
        this.dash = null
    }
    getChild(dir) {return dir=="-"?this.dash:this.dot}
    getLetter(s) {
        s = s.replace(/[^\.-]/g,'');
        if (s=="") return this.val
        try {
            return this[s[0]=="-"?"dash":"dot"].getLetter(s.slice(1))
        } catch (e) {return null}
    }
}
var root = new Node(null)
var s = "etianmsurwdkgohvf*l*pjbxcyzq"
var bfs = [root]
var ctr = 0
while (bfs.length > 0) {
    if (ctr > s.length) break
    var n = bfs.shift()
    for (var i = 0 ; i < 2 ; i++) {
        var l = s[ctr++]
        if (l != "*") {
            n[i?"dash":"dot"] = new Node(l)
            bfs.push(n[i?"dash":"dot"])
        }
    }
}
module.exports = root
