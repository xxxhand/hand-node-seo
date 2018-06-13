const BasicRule = require('./BasicRule');
class RuleEngine extends BasicRule {
    constructor(htmlStr) {
        super(htmlStr);
    }
    addDetectMetaName(name) {
        if (!name || name.length === 0) {
            return this;
        }
        this.detectMetaNames.add(name);
        return this;
    }
}

module.exports = RuleEngine;