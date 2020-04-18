const fretSupportPath = "./";
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities');

var fs = require('fs');

/**
 * x,y coordinates for diagrams with in scope
 * @type {Array}
 */
const inPoints = [
  ['xScope', '145'],
  ['yScope', '75'],
  ['xTiming', '145'],
  ['yTiming', '115'],
    //tom
    ['xStop','225']
];

/**
 * x,y coordinates for diagrams with in scope and regular condition
 * @type {Array}
 */
const inPointsWithCond = [
  ['xScope', '145'],
  ['yScope', '75'],
  ['xTiming', '175'],
  ['yTiming', '115'],
  ['xCondition', '150'],
    //tom
  ['xStop','215']
];

/**
 * x,y coordinates for diagrams with in scope and regular condition
 * @type {Array}
 */
const onlyInPoints = [
  ['xScopeOne', '10'],
  ['yScopeOne', '75'],
  ['xTimingOne', '10'],
    //tom
    ['yTimingOne', '115'],
];

/**
 * x,y coordinates for diagrams with after scope
 * @type {Array}
 */
const afterPoints = [
  ['xScope', '280'],
  ['yScope', '75'],
  ['xTiming', '280'],
  ['yTiming', '115'],
  ['xInfinity', '395'],
  ['yInfinity', '100'],
    //tom
    ['xStop', '360']
];

/**
 * x,y coordinates for diagrams with after scope with regular condition
 * @type {Array}
 */
const afterPointsWithCond = [
  ['xScope', '280'],
  ['yScope', '75'],
  ['xTiming', '310'],
  ['yTiming', '115'],
  ['xInfinity', '395'],
  ['yInfinity', '100'],
  ['xCondition', '285'],
    //tom
    ['xStop', '345']
];

/**
 * x,y coordinates for diagrams with before scope.
 * @type {Array}
 */
const beforePoints = [
  ['xScope', '10'],
  ['yScope', '75'],
  ['xTiming', '10'],
  ['yTiming', '115'],
    //tom
    ['xStop', '90']
];

/**
 * x,y coordinates for diagrams with before scope with regular Condition
 * @type {Array}
 */
const beforePointsWithCond = [
  ['xScope', '10'],
  ['yScope', '75'],
  ['xTiming', '40'],
  ['yTiming', '115'],
  ['xCondition', '15'],
    //tom
    ['xStop','75']
];

/**
 * x,y coordinates for diagrams with null scope
 * @type {Array}
 */
const nullPoints = [
  ['xScope', '100'],
  ['yScope', '75'],
  ['xTiming', '100'],
  ['yTiming', '115'],
  ['xInfinity', '380'],
  ['yInfinity', '100'],
    //tom
    ['xStop', '350']
];

/**
 * x,y coordinates for diagrams with null scope and with regular condition
 * @type {Array}
 */
const nullPointsWithCond = [
  ['xScope', '100'],
  ['yScope', '75'],
  ['xTiming', '265'],
  ['yTiming', '115'],
  ['xInfinity', '380'],
  ['yInfinity', '100'],
    ['xCondition', '240'],
    //tom
    ['xStop', '305']
];

/**
 * Array with patterns of keys that are used for the generation of svg code.
 * Each array element is a pair: 1. regular expression that defines the pattern of keys 2. SVG initial structure of code.
 * @type {Array}
 */
const patterns = [
    // No condition

  ['null,null,always|never|eventually|null,action|satisfaction',
  'NOSCOPE\nTIME\nINF\nNOMODE\nSTANDARD\n'],

    //tom
    ['null,null,until|before,action|satisfaction',
       'NOSCOPE\nTIME\nINF\nNOMODE\nSTOP\nSTANDARD\n'],

  ['null,null,immediately|within|after|for,action|satisfaction',
  'NOSCOPE\nTIME\nNOMODE\nSTANDARD\n'],

  ['after,null,always|never|eventually|null,action|satisfaction',
  'SCOPE\nTIME\nINF\nMODE\nSTANDARD\n'],

    //tom
    ['after,null,until|before,action|satisfaction',
       'SCOPE\nTIME\nINF\nMODE\nSTOP\nSTANDARD\n'],

  ['after,null,immediately|within|after|for,action|satisfaction',
   'SCOPE\nTIME\nINF\nMODE\nSTANDARD\n'],

  ['in|before,null,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nMODE\nSTANDARD\n'],

    //tom
    ['in|before,null,until|before,action|satisfaction',
       'SCOPE\nTIME\nMODE\nSTOP\nSTANDARD\n'],

    // ** Regular conditions **
    
  ['null,regular,always|never|eventually|null,action|satisfaction',
   'NOSCOPE\nTIME\nREGULAR\nINF\nNOMODE\nSTANDARD\n'],

    //tom
      ['null,regular,until|before,action|satisfaction',
  'NOSCOPE\nTIME\nREGULAR\n\STOP\nINF\nNOMODE\nSTANDARD\n'],

  ['null,regular,immediately|within|after|for,action|satisfaction',
  'NOSCOPE\nTIME\nREGULAR\nNOMODE\nSTANDARD\n'],

  ['after,regular,always|never|eventually|null,action|satisfaction',
  'SCOPE\nTIME\nREGULAR\nINF\nMODE\nSTANDARD\n'],

  ['after,regular,immediately|within|after|for,action|satisfaction',
   'SCOPE\nTIME\nREGULAR\nINF\nMODE\nSTANDARD\n'],

    //tom
      ['after,regular,until|before,action|satisfaction',
  'SCOPE\nTIME\nREGULAR\nSTOP\nINF\nMODE\nSTANDARD\n'],

  ['in|before,regular,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nREGULAR\nMODE\nSTANDARD\n'],

    //tom
   ['in|before,regular,until|before,action|satisfaction',
  'SCOPE\nTIME\nREGULAR\nSTOP\nMODE\nSTANDARD\n'],


    // ** only Scopes, no condition

  ['onlyAfter,null,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nMODE\nSTANDARD\n'],

    //tom
  ['onlyAfter,null,until|before,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nMODE\nSTOP\nSTANDARD\n'],

  ['onlyIn|onlyBefore|notin,null,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nINF\nMODE\nSTANDARD\n'],

   //tom
  ['onlyIn|onlyBefore|notin,null,until|before,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nINF\nMODE\nSTOP\nSTANDARD\n'],

    // ** only Scopes, regular condition

  ['onlyAfter,regular,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nREGULAR\nMODE\nSTANDARD\n'],

    // tom
  ['onlyAfter,regular,until|before,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nREGULAR\nMODE\nSTOP\nSTANDARD\n'],

  ['onlyIn|onlyBefore|notin,regular,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
   'SCOPE\nTIME\nSCOPE\nTIME\nREGULAR\nINF\nMODE\nSTANDARD\n'],

    //tom
      ['onlyIn|onlyBefore|notin,regular,until|before,action|satisfaction',
  'SCOPE\nTIME\nSCOPE\nTIME\nREGULAR\nINF\nMODE\nSTOP\nSTANDARD\n']
];


/**
 * Array with substitution pairs for all the words of the patterns array.
 * @type {Array}
 */
const firstLevelSubstitutionsSVG = [
  ['STANDARD', '<use xlink:href="#standard"/>\n</svg>'],
  ['NOMODE', '<use xlink:href="#without_Mode" y="30" />'],
  ['MODE', '<use xlink:href="#with_Mode"/>'],
  ['INF', '<use xlink:href="#Infinity" x="xInfinity" y="yInfinity"/>'],
  ['NOSCOPE', '<use xlink:href="#ScopeForNullScope" x ="xScope" y="yScope"/>'],
  ['SCOPE', '<use xlink:href="#Scope" x ="xScope" y="yScope"/>'],
  ['TIME', '<use xlink:href="#Timing_TimeConstraint" x="xTiming" y="yTiming"/>'],
  ['REGULAR', '<use xlink:href="#trigger_Condition" x="xCondition" y="30"/>'],
  ['STOP', '<use xlink:href="#stop_Condition" x="xStop" y="30"/>'],
];

/**
 * Array with the timings that need additional length for null scope
 * @type {Array}
 */

//tom: added until
const timingLength = ['always', 'eventually', 'never', 'null', 'until', 'only_always'];

/**
 * Creates SVG diagram for a specific key.
 * @param  {String} key    String of a pattern key e.g., in,null,after,satisfaction
 * @param  {String} scope  Scope string
 * @param  {String} timing Timing string
 * @return {String}        Svg diagram code for specific key or undefined
 */
function createSvgString (key, scope, timing, condition){
    console.log('key: "' + key + '" scope: "' + scope + '" timing: "' + timing + '" condition: "' + condition + '"')
    //console.log('patterns: ' + JSON.stringify(patterns));
  var template = utilities.matchingBaseForSVG(key, patterns, 'no_match');
  //tom console.log('template = ' + template);
  if (template !== 'no_match') {
    var svgPattern = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500px" height="160px">\n';
    svgPattern += fs.readFileSync('../../docs/_media/user-interface/examples/svgDiagrams/svgTemplates.svg', 'utf8');
    svgPattern += template;

    firstLevelSubstitutionsSVG.forEach(function(pair){
      svgPattern = svgPattern.replace(pair[0],pair[1]);
    });
    var timingsPattern = onlyTimings(scope, timing, condition, svgPattern);
    svgPattern = replaceForScope(timingsPattern, scope, condition);
    return svgPattern;
  }
  else return constants.undefined_svg;
}

function replaceTiming (svgPattern, scope, timing, condition){
  if (timingLength.includes(timing) && scope === 'null' && condition === 'null'){
    svgPattern = svgPattern.replace('TimeConstraint', timing+'_null_scope');
  } else if (timingLength.includes(timing) && scope !== 'null' && condition === 'regular'){
    svgPattern = svgPattern.replace('TimeConstraint', timing+'_regular_condition');
  } else {
    svgPattern = svgPattern.replace('TimeConstraint', timing);
  }
   return svgPattern;
}

function onlyTimings (scope, timing, condition, svgPattern){
  if (scope.includes('only') | scope === 'notin'){
    firstLevelSubstitutionsSVG.forEach(function(pair){
      svgPattern = svgPattern.replace(pair[0],pair[1]);
    });
    if (scope.includes('only')){
      switch (timing){
        case 'null':
        case 'eventually':
        svgPattern = replaceTiming(svgPattern, scope, 'never', condition);
        svgPattern = replaceTiming(svgPattern, scope, 'never', 'null');
        break;
        case 'always':
        svgPattern = replaceTiming(svgPattern, scope, 'only_always', condition);
        svgPattern = replaceTiming(svgPattern, scope, 'only_always', 'null');
        break;
        case 'never':
        svgPattern = replaceTiming(svgPattern, scope, 'null', condition);
        svgPattern = replaceTiming(svgPattern, scope, 'null', 'null');
        break;
        case 'immediately':
        svgPattern = replaceTiming(svgPattern, scope, 'only_immediately', condition);
        if(condition === 'null' && scope.includes('In')){
          svgPattern = replaceTiming(svgPattern, scope, 'only_immediately', 'null');
        }
        break;
        case 'within':
        svgPattern = replaceTiming(svgPattern, scope, 'only_within', condition);
        if(condition === 'null'  && scope.includes('In')){
          svgPattern = replaceTiming(svgPattern, scope, 'only_within', 'null');
        }
        break;
        case 'after':
        svgPattern = replaceTiming(svgPattern, scope, 'only_after', condition);
        if(condition === 'null' && scope.includes('In')){
          svgPattern = replaceTiming(svgPattern, scope, 'only_after', 'null');
        }
        break;
        case 'for':
        svgPattern = replaceTiming(svgPattern, scope, 'only_for', condition);
        if(condition === 'null' && scope.includes('In')){
          svgPattern = replaceTiming(svgPattern, scope, 'only_for', 'null');
        }
	break;
      case 'until':
	  svgPattern = replaceTiming(svgPattern,scope,'only_until',condition);
	  if(condition === 'null' && scope.includes('In')){
          svgPattern = replaceTiming(svgPattern, scope, 'only_until', 'null');
        } 
	  break;    
      }
    }
    else {
       switch (condition){
         case 'null':
         svgPattern = replaceTiming(svgPattern, scope, timing, condition);
         svgPattern = replaceTiming(svgPattern, scope, timing, 'null');
         break;
         case 'regular':
         svgPattern = replaceTiming(svgPattern, scope, timing, condition);
      }
    }
  }
  else{
    svgPattern = replaceTiming(svgPattern, scope, timing, condition);
  }
  return svgPattern;
}

/**
 * Creates svg File corresponding to the key pattern and returns the path of the file.
 * If SVG file cannot be created it returns the constants.undefined_svg error message.
 * @param  {String} key    String of a pattern key e.g., in,null,after,satisfaction
 * @param  {String} scope  Scope string, redundant with key
 * @param  {String} timing Timing string, redundant with key
 * @param  {String} condition Condition string, redundant with key
 * @return {String}        path of created svg file or error message
 */
exports.getDiagram = (key, scope, timing, condition) => {
  var svgPath = '_media/user-interface/examples/svgDiagrams/'+key.replace(/,/g , '_')+'.svg';
  if (constants.generateSvgSemantics){
    var svgResult =createSvgString(key, scope, timing, condition);
    if (svgResult !== constants.undefined_svg){
      fs.writeFileSync('../../docs/'+svgPath, svgResult, function(err) {
        if(err) {
          return console.log(err);
        }
      });
    }
  }
  if (fs.existsSync('../../docs/'+ svgPath)){
    return svgPath;
  }
  else return constants.undefined_svg;
}

/**
 * Replaces xScope, yScope, xTiming, yTiming, xInfinity, yInfinity with the specific coordinates
 * specified in inPoints (withCond), afterPoints (withCond), nullPoints (withCond), beforePoints (withCond) arrays, depending on the
 * scope of the pattern.
 * @param  {String} svgPattern SVG code with variable coordinates
 * @param  {String} scope      Scope string of key
 * @param  {String} condition  Condition string of key
 * @return {String}            SVG code with specific coordinated based on scope
 */
function replaceForScope(svgPattern, scope, condition){
  switch (scope) {
    case 'in':
    svgPattern = replacePoints(inPoints, inPointsWithCond, svgPattern, condition);
    break;
    case 'after':
    svgPattern = replacePoints(afterPoints, afterPointsWithCond, svgPattern, condition);
    break;
    case 'before':
    svgPattern = replacePoints(beforePoints, beforePointsWithCond, svgPattern, condition);
    break;
    case 'null':
    svgPattern = replacePoints(nullPoints, nullPointsWithCond, svgPattern, condition);
    break;
    case 'onlyIn':
    case 'notin':
    svgPattern = replacePoints(beforePoints, beforePointsWithCond, svgPattern, condition);
    svgPattern = replacePoints(afterPoints, afterPointsWithCond, svgPattern, 'null');
    break;
    case 'onlyAfter':
    svgPattern = replacePoints(beforePoints, beforePointsWithCond, svgPattern, condition);
    svgPattern = replacePoints(inPoints, inPointsWithCond, svgPattern, 'null');
    break;
    case 'onlyBefore':
    svgPattern = replacePoints(inPoints, inPointsWithCond, svgPattern, condition);
    svgPattern = replacePoints(afterPoints, afterPointsWithCond, svgPattern, 'null');
  }
  return svgPattern;
}

/**
 * Replaces based on the pattern pairs.
 * @param  {Array}  points      x,y coordinates for a specific scope with null Condition
 * @param  {Array}  pointsCond  x,y coordinates for a specific scope with regular Condition
 * @param  {String} svgPattern  SVG code with variable coordinates
 * @param  {String} condition   Condition string of key
 * @return {String}             SVG code with specific coordinates based on scope
 */
function replacePoints(points, pointsCond, svgPattern, condition){
  if (condition === 'null'){
    points.forEach(function(pair){
      svgPattern = svgPattern.replace(pair[0],pair[1]);
    });
  } else if (condition === 'regular'){
    pointsCond.forEach(function(pair){
      svgPattern = svgPattern.replace(pair[0],pair[1]);
    });
  }
  return svgPattern
}

console.log(this.getDiagram('null,null,until,satisfaction','null','until','null'));
console.log(this.getDiagram('null,regular,until,satisfaction','null','until','regular'));
console.log(this.getDiagram('in,null,until,satisfaction','in','until','null'));
console.log(this.getDiagram('in,regular,until,satisfaction','in','until','regular'));

console.log(this.getDiagram('notin,null,until,satisfaction','notin','until','null'));
console.log(this.getDiagram('notin,regular,until,satisfaction','notin','until','regular'));

console.log(this.getDiagram('onlyIn,null,until,satisfaction','onlyIn','until','null'));
console.log(this.getDiagram('onlyIn,regular,until,satisfaction','onlyIn','until','regular'));


console.log(this.getDiagram('before,null,until,satisfaction','before','until','null'));
console.log(this.getDiagram('before,regular,until,satisfaction','before','until','regular'));

console.log(this.getDiagram('onlyBefore,null,until,satisfaction','onlyBefore','until','null'));
console.log(this.getDiagram('onlyBefore,regular,until,satisfaction','onlyBefore','until','regular'));


console.log(this.getDiagram('after,null,until,satisfaction','after','until','null'));
console.log(this.getDiagram('after,regular,until,satisfaction','after','until','regular'));

console.log(this.getDiagram('onlyAfter,null,until,satisfaction','onlyAfter','until','null'));
console.log(this.getDiagram('onlyAfter,regular,until,satisfaction','onlyAfter','until','regular'));



/*
console.log(this.getDiagram('null,null,within,satisfaction','null','within','null'));
console.log(this.getDiagram('null,regular,within,satisfaction','null','within','regular'));
console.log(this.getDiagram('in,null,within,satisfaction','in','within','null'));
console.log(this.getDiagram('in,regular,within,satisfaction','in','within','regular'));

console.log(this.getDiagram('notin,null,within,satisfaction','notin','within','null'));
console.log(this.getDiagram('notin,regular,within,satisfaction','notin','within','regular'));

console.log(this.getDiagram('onlyIn,null,within,satisfaction','onlyIn','within','null'));
console.log(this.getDiagram('onlyIn,regular,within,satisfaction','onlyIn','within','regular'));


console.log(this.getDiagram('before,null,within,satisfaction','before','within','null'));
console.log(this.getDiagram('before,regular,within,satisfaction','before','within','regular'));

console.log(this.getDiagram('onlyBefore,null,within,satisfaction','onlyBefore','within','null'));
console.log(this.getDiagram('onlyBefore,regular,within,satisfaction','onlyBefore','within','regular'));


console.log(this.getDiagram('after,null,within,satisfaction','after','within','null'));
console.log(this.getDiagram('after,regular,within,satisfaction','after','within','regular'));

console.log(this.getDiagram('onlyAfter,null,within,satisfaction','onlyAfter','within','null'));
console.log(this.getDiagram('onlyAfter,regular,within,satisfaction','onlyAfter','within','regular'));

*/
