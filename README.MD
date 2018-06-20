It's a demo, do not use in production


npm install hand-node-seo --save

const RuleEngineClass = require('hand-node-seo').RuleEngineClass;

input:
1 if you have a html file, you can read it as string. The string could be an argument when create instance. 

	const htmlStr = fs.readFileSync('test/test.html').toString('utf-8');
	const ruleEngine = new RuleEngineClass(htmlStr);
	
  you don't need any callback function if you create instance this way, you can use the methods directly, for example:
	const ruleEngine = new RuleEngineClass(htmlStr)
	    .addCustomRule(customRuleB)
		.runH1TagDetect()
		.runStrongTagDetect(1)
		.runTitleTagInHeadDetect()
		.addDetectMetaName('hands')
		.runMetaNameDetect()
		...
   
2 Could be a ReadStream, there are two events 'readEnd','error' with property 'readStreamEvent' while your input is ReadStream.
  You will get an engine instance while readEnd happend, for example:

	const ruleEngine = new RuleEngineClass();
	ruleEngine.loadWithStream(request.get('https://www.google.com'));
	or
	ruleEngine.loadWithFile('test/test.html');
	
	ruleEngine.readStreamEvent.on('readEnd', engine => {
		engine
			.....
	});
	ruleEngine.readStreamEvent.on('error', err => console.error(err));
	
As requirements, there are methods with the instance.

1. Detect if any <img /> tag without alt attribute
2. Detect if any <a /> tag without rel attribute

	just use the 'runTagWithoutAttributeDetect(tagName, attrName)'
	for example: runTagWithoutAttributeDetect('img', 'alt')

3. In <head> tag
	i. Detect if header doesn’t have <title> tag
	
		runTitleTagInHeadDetect()
		
	ii. Detect if header doesn’t have <meta name=“descriptions” ... /> tag
	iii. Detect if header doesn’t have <meta name=“keywords” ... /> tag	
		
		runMetaNameDetect()
		
	This method would detect attribute name with <meta> "description" and "keywords" as default, if you want to detect more names,
	just use addDetectMetaName(name) method before this method. for example:
	
		ruleEngine
			.addDetectMetaName('robots')
			.runMetaNameDetect()
4. Detect if there’re more than 15 <strong> tag in HTML (15 is a value should be configurable by user)
	
	runStrongTagDetect(maxLen)
   
   default maxLen is 15
 
5. Detect if a HTML have more than one <H1> tag.
	
	runH1TagDetect()

Custom rules

The developer can make their own rules via  addCustomRule(rule) method. The custom rules are formatted. For example:

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
	
	1. The ruleName must be unique.
	2. The function must return an array of string
And then, you can use method runCustomDetect() for running custom rules
	
	ruleEngine
		.addCustomRule(customRuleA)
		.runCustomDetect()

Output can be:

1. A file, no returns, just save as a file
	toFile(filePath)
	
2. A writeStream, return a node writeStream object
	toFileStream(filePath, encoding)
3. console, no returns, just output to console