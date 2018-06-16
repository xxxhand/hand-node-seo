const BasicRule = require('./BasicRule');
class RuleEngine extends BasicRule {
    constructor(htmlStr) {
        super(htmlStr);
    }
    addDetectMetaName(name) {
        if (!name || name.length === 0) {
            return this;
        }
        if (!this.detectMetaNames || !this.detectMetaNames instanceof Set) {
            this.detectMetaNames = new Set("description", "keywords");
        }
        this.detectMetaNames.add(name);
        return this;
    }
}

module.exports = RuleEngine;