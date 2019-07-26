const fs            = require('fs');
const path          = require('path');
const packageInfo   = require(path.resolve(__dirname, '..', 'package.json'));
const cwd           = process.cwd();

const _buildTestsPaths = (config = {}) =>
{
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

    return tests;
};

const _buildOutputPaths = (config = {}) =>
{
    if (!config.paths.output.endsWith('src'))
    {
        config.paths.output = path.join(config.paths.output, 'src')
    }
    const output = {
        root    : config.paths.output
    };
    output.services    = path.join(output.root, 'services');
    output.type        = path.join(output.root, 'type');
    output.collections = path.join(output.root, 'type', 'collection');
    output.items       = path.join(output.root, 'type', 'item');

    return output;
};

const _buildTemplatesPaths = (config = {}) =>
{
    const templates = {
        root    : path.join(__dirname, 'tpls', config.templates)
    };
    templates.sources = {
        root : path.join(templates.root, 'src')
    };
    templates.tests = {
        root : path.join(templates.root, 'test')
    };
    templates.sources.collection    = path.join(templates.sources.root, 'collection.hbs');
    templates.sources.item          = path.join(templates.sources.root, 'item.hbs');
    templates.sources.service       = path.join(templates.sources.root, 'service.hbs');
    templates.tests.collection    = path.join(templates.tests.root, 'collection.hbs');
    templates.tests.item          = path.join(templates.tests.root, 'item.hbs');
    templates.tests.service       = path.join(templates.tests.root, 'service.hbs');

    return templates;
};

const _buildConfigPaths = (config = {}) =>
{
    const templates = _buildTemplatesPaths(config);
    const output = _buildOutputPaths(config);
    const tests = _buildTestsPaths(config);

    config.paths   = Object.assign(config.paths, { templates, output, tests });
};

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

    config.namespace = cwd.replace(/.+\/(.+)$/, '$1');
    config.package   = packageInfo;
    config.templates = 'javascript';
    config.spec      = 'open-api';

    args.forEach(
        (arg, index) =>
        {
            const value = args[index + 1];
            switch(arg)
            {
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
                case '--tpl':
                case '-templates':
                    config.templates = value;
                    break;
                case '--sp':
                case '-spec':
                    config.spec = value;
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

    _buildConfigPaths(config);
};
