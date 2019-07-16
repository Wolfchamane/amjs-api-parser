const chalk = require('chalk');
const cwd   = process.cwd();
const fs    = require('fs');
const path  = require('path');

/**
 * Evaluates if @amjs/data-types dependency if installed in cwd directory
 */
module.exports = () =>
{
    let cwdPackage = path.resolve(cwd, 'package.json');
    if (fs.existsSync(cwdPackage))
    {
        cwdPackage = require(cwdPackage);
        if (!Object.keys(cwdPackage.dependencies || {}).includes('@amjs/data-types'))
        {
            console.log('\n[@amjs/api-parser] dependency "@amjs/data-types" not detected');
            console.log(`Install "@amjs/data-types" running: ${chalk.inverse('$ npm i --save @amjs/data-types')}`);
        }
    }
};