
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
        this.htmlString = htmlStr;
        this.resultAry = [];
        this.detectMetaNames = new Set()
            .add('description')
            .add('keywords');
    }
    runStrongTagDetect(maxLen) {
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
    runMetaNameDetect() {
        if (!this.htmlString || this.htmlString.length === 0) {
            this.resultAry.push(`There are 0 <meta> in html`);
            return this;
        }
        const s = this.htmlString.search(headTagStart);
        const e = this.htmlString.search(headTagEnd);
        const headSectionStr = this.htmlString.substring(s, e);
        if (!headSectionStr || headSectionStr.length === 0) {
            this.resultAry.push(`There are 0 <meta> in html`);
            return this;
        }

    }

}

module.exports = BasicRule;