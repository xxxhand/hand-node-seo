
const fs = require('fs');
const EventEmitter = require("events").EventEmitter
const strongTagReg = /<strong>/ig;
const h1TagReg = /<h1>/ig;
const titleTagReg = /<title>/i;
const headTagStart = /<head>/i;
const headTagEnd = /<\/head>/i;
const metaTagReg = /<meta(?:>|\s+([\s\S]*?)>)/ig;

class BasicRule {
    constructor(htmlStr) {
        if (!htmlStr || htmlStr.length === 0) {
            htmlStr = '<html></html>';
        }
        /**
         * input html content for searching
         */
        this.htmlString = htmlStr;
        /**
         * SEO result, array of string
         */
        this.resultAry = [];
        /**
         * meta name for searching, default: description, keywords
         */
        this.detectMetaNames = new Set()
            .add('description')
            .add('keywords');
        /**
         * custom rule list
         */
        this.customRules = [];
        /**
         * rule engine read stream event, there are two events 'readEnd', 'error'
         */
        this.readStreamEvent = new EventEmitter();
    }
    /**
     * input a readStream for searching
     * @param {object} streamSample readStream object
     * @returns void 
     */
    loadWithStream(streamSample) {
        this.htmlString = '';
        streamSample.on('data', chunk => this.htmlString += chunk);
        streamSample.on('end', () => this.readStreamEvent.emit('readEnd', this));
        streamSample.on('error', err => this.readStreamEvent.emit('error', error));
    }
    /**
     * searching if <strong> tag exist, can be set max search 
     * @param {number} maxLen max length of <strong> for searching
     * @returns instance of RuleEngine 
     */
    runStrongTagDetect(maxLen = 15) {
        if (!this.htmlString || this.htmlString.length === 0) {
            this.resultAry.push(`There are 0 <strong> in html`);
            return this;
        }
        if (maxLen < 0) {
            maxLen = 15;
        }
        const arr = this.htmlString.match(strongTagReg);
        if (!arr || arr.length === 0) {
            this.resultAry.push(`There are 0 <strong> in html`);
            return this;
        }
        if (arr.length > maxLen) {
            this.resultAry.push(`The <strong> has ${arr.length} founded, the count is greater than you set ${maxLen}`);
            return this;
        }
        this.resultAry.push(`There are ${arr.length} <strong> in html`);
        return this;
    }
    /**
     * searching if <H1> tag exist
     * @returns instance of RuleEngine
     */
    runH1TagDetect() {
        if (!this.htmlString || this.htmlString.length === 0) {
            this.resultAry.push(`There are 0 <h1> in html`);
            return this;
        }
        const arr = this.htmlString.match(h1TagReg);
        if (!arr || arr.length === 0) {
            this.resultAry.push(`There are 0 <h1> in html`);
            return this;
        }
        if (arr.length > 1) {
            this.resultAry.push(`There are ${arr.length} <h1> founded`);
            return this;
        }
        this.resultAry.push(`There are ${arr.length} <h1> founded`);
        return this;
    }
    /**
     * searching if <title> tag exist in head section
     * @returns instance of RuleEngine 
     */
    runTitleTagInHeadDetect() {
        if (!this.htmlString || this.htmlString.length === 0) {
            this.resultAry.push(`There are 0 <title> in html`);
            return this;
        }
        const s = this.htmlString.search(headTagStart);
        const e = this.htmlString.search(headTagEnd);
        const headSectionStr = this.htmlString.substring(s, e);
        if (!headSectionStr || headSectionStr.length === 0) {
            this.resultAry.push(`There are 0 <title> in html`);
            return this;
        }
        if (!titleTagReg.test(headSectionStr)) {
            this.resultAry.push('There is not <title> in head')
            return this;
        }
        return this;
    }
    /**
    * to add attribute name of <meta> for searching
    * @param {string} names custom meta name for searching, can be destructuring
    * @returns instance of RuleEngine
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
     * searching if attribute name in meta tag
     * @returns instance of RuleEngine 
     */
    runMetaNameDetect() {
        if (!this.htmlString || this.htmlString.length === 0) {
            this.resultAry.push(`There are 0 <meta> in html`);
            return this;
        }
        if (!this.detectMetaNames || !this.detectMetaNames instanceof Set) {
            this.detectMetaNames = new Set("description", "keywords");
        }
        const s = this.htmlString.search(headTagStart);
        const e = this.htmlString.search(headTagEnd);
        const headSectionStr = this.htmlString.substring(s, e);
        if (!headSectionStr || headSectionStr.length === 0) {
            this.resultAry.push(`There are 0 <meta> in html`);
            return this;
        }
        let dectectName = '';
        for (const dName of [...this.detectMetaNames]) {
            this.resultAry.push(`meta name ${dName} searching`);
            dectectName = `name=\"${dName}\"`;
            const reg = new RegExp(dectectName, 'i');
            if (reg.test(headSectionStr)) {
                // console.log(`${dName} founded`);
                this.resultAry.push(`Meta name ${dName} founded`);
            }
        }
        return this;

    }
    /**
     * searching if attribute name exist in tag or not
     * @param {string} tagName tag name for searching 
     * @param {string} attrName attribute in tag for searching
     * @returns instance of RuleEngine 
     */
    runTagWithoutAttributeDetect(tagName, attrName) {
        if (!this.htmlString || this.htmlString.length === 0) {
            this.resultAry.push(`There are 0 <${tagName}> in html`);
            return this;
        }
        const tagRegStr = `<${tagName}(?:>|\\s+([\\s\\S]*?)>)`;
        const tagReg = new RegExp(tagRegStr, 'ig');
        const arr = this.htmlString.match(tagReg);
        if (!arr || arr.length === 0) {
            this.resultAry.push(`There are 0 <${tagName}> in html`);
            return this;
        }
        const attrReg = new RegExp(`${attrName}=*`, 'i');
        let withoutAttrCnt = 0;
        for (let aa of arr) {
            if (!attrReg.test(aa)) {
                withoutAttrCnt++;
            }
        }
        this.resultAry.push(`There are ${arr.length} <${tagName}> founded and ${withoutAttrCnt} without ${attrName} attribute`);
        return this;

    }
    /**
     * to add rules for searching, ruleName must be unique, execReg must bt function
     * @param {object} rule custom rule for searching
     * @returns instance of RuleEngine
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
     * @returns instance of RuleEngine
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
    /**
     * Outout a static file
     * @param {string} toSavePath path to save file
     * @returns Void 
     */
    toFile(toSavePath) {
        if (!toSavePath || toSavePath.length === 0) {
            throw new Error(`Must have save path`);
        }
        const saveContent = this.resultAry.join('\n');

        fs.writeFileSync(toSavePath, saveContent, { encoding: 'utf-8' });
    }
    /**
     * Output a writableStream object
     * @param {string} toSavePath the file path of writableStream
     * @param {string} fileEncoding the encoding of writableStream, default is utf-8
     * @returns stream object
     */
    toFileStream(toSavePath, fileEncoding = 'utf-8') {
        if (!toSavePath || toSavePath.length === 0) {
            throw new Error(`Must have save path`);
        }
        if (!fileEncoding || fileEncoding.length === 0) {
            fileEncoding = 'utf-8';
        }
        return fs.createWriteStream(toSavePath, { encoding: fileEncoding });
    }
    /**
     * Output to console
     */
    toConsole() {
        this.resultAry.map(x => console.log(x));
    }

}

module.exports = BasicRule;