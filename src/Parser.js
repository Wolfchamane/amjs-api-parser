const { capitalize, camelize, dotProp, decamelize } = require('@amjs/utils');
const { makeFolder }                    = require('@amjs/utils-fs');
const AmjsApiOpenApiReader              = require('@amjs/api-openapi-reader');
const AmjsLogger                        = require('@amjs/logger');
const AmjsTemplater                     = require('@amjs/templater');
const path                              = require('path');
const setup                             = require('./setup');
const writer                            = require('./writer');

module.exports = class AmjsApiParser
{
    constructor(config = {})
    {
        this.config     = config;
        this.logger     = new AmjsLogger({
            date        : config.date,
            name        : config.package.name,
            destFolder  : config.paths.logs,
            console     : true
        });
        this.parser     = null;

        this.logger.log('Parsing {{paths.source}} - INIT', config);

        setup(this);
    }

    parse()
    {
        let parsed;
        const source = this.config.paths.source;
        switch (this.config.spec)
        {
            case 'open-api':
            default:
                this.parser = new AmjsApiOpenApiReader(source);
                parsed = this.parser.read().parse();
                break;
        }

        const output = {
            sources : [],
            tests   : []
        };

        parsed.collections.forEach(item => this._composeCollectionSource(item, output), this);
        parsed.collections.forEach(item => this._composeCollectionTest(item, output), this);
        parsed.items.forEach(item => this._composeItemSource(item, output), this);

        this.logger.log('Creating source files');
        this._dumpFiles(output.sources);
        this.logger.log('Creating tests files');
        this._dumpFiles(output.tests);
    }

    _composeItemSource(config = {}, { sources = [] })
    {
        const template = dotProp(this, `config.paths.templates.sources.item`);
        const { namespace, date } = this.config;
        config.className = capitalize(camelize(`${namespace}${config.id}`));
        const context = Object.assign({}, config, { namespace, date });
        const content = AmjsTemplater(template, context);

        const id = decamelize(config.id, '/').split('/');
        let fileName = id.pop();
        const filePath = path.join(dotProp(this, 'config.paths.output.items'), id.join('/'));
        fileName = path.join(filePath, `${capitalize(fileName)}.js`);

        sources.push({
            filePath,
            fileName,
            content
        });
    }

    _composeCollectionSource(config = {}, { sources = [] })
    {
        const template = dotProp(this, `config.paths.templates.sources.collection`);
        const { namespace, date } = this.config;
        config.itemTypePath = config.itemType;
        config.itemType = `${capitalize(camelize(namespace))}${config.itemType}`;
        config.className = capitalize(camelize(`${namespace}${config.id}`));
        const context = Object.assign({}, config, { namespace, date });
        const content = AmjsTemplater(template, context);

        const id = decamelize(config.id, '/').split('/');
        let fileName = id.pop();
        const filePath = path.join(dotProp(this, 'config.paths.output.collections'), id.join('/'));
        fileName = path.join(filePath, `${capitalize(fileName)}.js`);

        sources.push({
            content,
            filePath,
            fileName
        });
    }

    _composeCollectionTest(config = {}, { tests = []})
    {
        const template = dotProp(this, `config.paths.templates.tests.collection`);
        const { namespace, date } = this.config;
        const context = Object.assign({}, config, { namespace, date });
        const content = AmjsTemplater(template, context);

        const id = decamelize(config.id, '/').split('/');
        let fileName = id.pop();
        const filePath = path.join(dotProp(this, 'config.paths.tests.collections'), id.join('/'));
        fileName = path.join(filePath, `${capitalize(fileName)}.js`);

        tests.push({
            content,
            filePath,
            fileName
        });
    }

    _compose(type = '', item, { sources = [], tests = [] })
    {
        let fileName = item.fileName || item.id;
        if (item.parent)
        {
            const destChildFolder = path.join(dotProp(this, `config.paths.output.${type}s`), item.parent);
            const destChildTestFolder = path.join(dotProp(this, `config.paths.tests.${type}s`), item.parent);
            [ destChildFolder, destChildTestFolder].forEach(folder => makeFolder(folder));

            fileName = `${item.parent}/${item.fileName}`;
        }

        const { namespace, date } = this.config;
        const className = capitalize(camelize(`${namespace}-${fileName}`));
        item = Object.assign({}, item, { className, namespace, date });

        const tplFilePath = dotProp(this, `config.paths.templates.sources.${type}`);
        const tplTestPath = dotProp(this, `config.paths.templates.tests.${type}`);

        const contentFile = AmjsTemplater(tplFilePath, item);
        const contentTestFile = AmjsTemplater(tplTestPath, item);

        const destFilePath = path.join(dotProp(this, `config.paths.output.${type}s`), `${fileName}.js`);
        const destTestPath = path.join(dotProp(this, `config.paths.tests.${type}s`), `${fileName}.js`);


        sources.push({
            content     : contentFile,
            destination : destFilePath
        });

        tests.push({
            content     : contentTestFile,
            destination : destTestPath
        });
    }

    _dumpFiles(files = [])
    {
        files.forEach(
            file =>
            {
                makeFolder(file.filePath);
                this.logger.log('Writing file @ {{fileName}}', file);
                writer(
                    file.fileName,
                    file.content,
                    true,
                    false);
            }
        );
    }
};