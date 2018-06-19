const BasicRule = require('./BasicRule');
class RuleEngine extends BasicRule {
    constructor(htmlStr) {
        super(htmlStr);
        this.customRules = [];
    }
    /**
     * to add attribute name of <meta> for searching
     * @param {string} names custom meta name for searching, can be destructuring
     * @returns {object} instance of RuleEngine
     */
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
    /**
     * to add rules for searching, ruleName must be unique, execReg must bt function
     * @param {object} rule custom rule for searching
     * @returns {object} instance of RuleEngine
     * @example
     * const customRule = {
     *      ruleName: 'customA',
     *      execReg: function (htmlString) {
     *          ...
     *      }
     * } 
     */
    addCustomRule(rule) {
        const attrs = Object.keys(rule);
        if (!attrs || attrs.length === 0) {
            throw new Error('Rule object is undefined');
        }
        if (!rule['ruleName'] || rule['ruleName'].length === 0) {
            throw new Error('Rule must have a name');
        }
        if (!rule['execReg'] || typeof rule['execReg'] !== 'function') {
            throw new Error('Rule execution must be function');
        }
        const f = this.customRules.find(x => x.ruleName === rule.ruleName);
        if (f) {
            throw new Error('Rule name must be unique');
        }
        this.customRules.push(rule);
        return this;
    }
    /**
     * run custom rules for searching
     * @returns {object} instance of RuleEngine
     */
    runCustomDetect() {
        if (!this.customRules || !Array.isArray(this.customRules) || this.customRules.length === 0) {
            return this;
        }
        for (const cr of this.customRules) {
            this.resultAry.push(`Running ${cr.ruleName}`);
            const res = cr.execReg(this.htmlString);
            if (!res || !Array.isArray(res) || res.length === 0) {
                continue;
            }
            this.resultAry = this.resultAry.concat(res);
        }
        return this;
    }
}

module.exports = RuleEngine;