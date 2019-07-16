const fs            = require('fs');
const path          = require('path');
const packageInfo   = require(path.resolve(__dirname, '..', 'package.json'));
const cwd           = process.cwd();

/**
 * Builds api-parser configuration object
 * @param   {Array}     args    Process arguments
 * @param   {Object}    config  Base configuration object
 */
module.exports = (args = [], config = {}) =>
{
    config.paths = Object.assign(
        config.paths,
        {
            logs : path.join(__dirname, '..', '.tmp')
        },
    );

    config.logFile   = path.join(config.paths.logs, `${config.date}.log`);
    config.namespace = cwd.replace(/.+\/(.+)$/, '$1');
    config.package   = packageInfo;

    args.forEach(
        (arg, index) =>
        {
            const value = args[index + 1];
            switch(arg)
            {
                case '--nc':
                case '-no-clean':
                    config.clean = false;
                    break;
                case '--s':
                case '--src':
                case '-source':
                {
                    let isFile = true;
                    let source = path.resolve(value);
                    const stats = fs.statSync(source);
                    if (!stats.isFile() && !/.+\.(ya?ml|json)$/.test(source))
                    {
                        source = path.resolve(`${source}/api`);
                        isFile = false;
                    }
                    config.paths.source = source;
                    config.paths.isFile = isFile;
                }
                    break;
                case '--o':
                case '--out':
                case '-output':
                    config.paths.output = path.resolve(value);
                    break;
                case '--v':
                case '-verbose':
                    config.debug = true;
                    break;
            }
        }
    );

    if (!config.paths.source)
    {
        throw new Error('Missing API source file or folder');
    }

    if (!config.paths.output)
    {
        throw new Error('Missing output destination folder');
    }

    config.paths   = Object.assign(config.paths, {
        src         : config.paths.output,
        services    : path.join(config.paths.output, 'services'),
        type        : path.join(config.paths.output, 'type'),
        collections : path.join(config.paths.output, 'type', 'collection'),
        items       : path.join(config.paths.output, 'type', 'item'),
        templates   : path.join(__dirname, 'tpls')
    });

    const tests = {};
    tests.root = config.paths.output.endsWith('src')
        ? path.resolve(config.paths.output, '..')
        : config.paths.output;
    tests.root = path.join(tests.root, 'tests');
    tests.unit = path.join(tests.root, 'unit');
    tests.services = path.join(tests.unit, 'services');
    tests.type = path.join(tests.unit, 'type');
    tests.items = path.join(tests.type, 'item');
    tests.collections = path.join(tests.type, 'collections');

    config.paths.tests = tests;
};
