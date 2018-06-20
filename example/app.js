const fs = require('fs');
const RuleEngineClass = require('../index').RuleEngineClass;


const customRuleA = {
    ruleName: 'customA',
    execReg: function (html) {
        const res = [];
        if (!html || html.length === 0) {
            res.push(`Custom A detect <h2>, 0 founded`);
            return res;
        }
        let r = /<h2>/ig;
        const arr = html.match(r);
        if (!arr || arr.length === 0) {
            res.push(`Custom A detect <h2>, 0 founded`);
            return res;
        }
        res.push(`Custom A detect <h2>, ${arr.length} founded`);
        return res;
    }
};
const customRuleB = {
    ruleName: 'customB',
    execReg: function (html) {
        const res = [];
        if (!html || html.length === 0) {
            res.push(`Custom A detect <h3>, 0 founded`);
            return res;
        }
        let r = /<h3>/ig;
        const arr = html.match(r);
        if (!arr || arr.length === 0) {
            res.push(`Custom A detect <h3>, 0 founded`);
            return res;
        }
        res.push(`Custom A detect <h3>, ${arr.length} founded`);
        return res;
    }
};
const htmlStr = fs.readFileSync('example/test/test.html').toString('utf-8');

const ruleEngine1 = new RuleEngineClass(htmlStr)
    .addCustomRule(customRuleA)
    .addCustomRule(customRuleB)
    .runH1TagDetect()
    .runStrongTagDetect(10)
    .addDetectMetaName('hands')
    .runMetaNameDetect()
    .runCustomDetect()
    .runTagWithoutAttributeDetect('img', 'alt');

ruleEngine1.toConsole();
ruleEngine1.toFile('example/reuslt/outputAsFile.txt')


console.log('==================================================');

const fileStream = ruleEngine1.toFileStream('example/reuslt/outputAsStream.txt');
ruleEngine1.resultAry.map(c => fileStream.write(`${c}\n`));
fileStream.end();
fileStream.on('finish', () => {
    console.log('write stream==================================================');
    console.log('Write stream success')
});
fileStream.on('error', err => console.error(err));



const ruleEngine = new RuleEngineClass();
// ruleEngine.loadWithStream(fs.createReadStream('test/test.html'));
ruleEngine.loadWithFile('example/test/test.html');
ruleEngine.readStreamEvent.on('readEnd', engine => {
    console.log('Load read stream==================================================');
    engine.runH1TagDetect()
        .runMetaNameDetect()
        .toConsole();
});
ruleEngine.readStreamEvent.on('error', err => console.log(err));
