const BasicRule = require('./BasicRule');
class RuleEngine extends BasicRule {
    constructor(htmlStr) {
        super(htmlStr);
    }
    addDetectMetaName(...names) {
        if (!names || names.length === 0) {
            return this;
        }
        if (!this.detectMetaNames || !this.detectMetaNames instanceof Set) {
            this.detectMetaNames = new Set("description", "keywords");
        }
        names.map(n => this.detectMetaNames.add(n));
        
        return this;
    }
}

module.exports = RuleEngine;