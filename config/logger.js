const {Roarr} = require('roarr');
const pjson = require('../package.json');

const Logger = Roarr.child({
    application: "RealWorldExpressOttoman",
    package: pjson.name
});
module.exports = {Logger}