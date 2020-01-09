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

        parsed.collections.forEach(item =>
                this._composeSource('collection', item, output)
                    ._composeTest('collection', item, output));
        parsed.items.forEach(
            item =>
                this._composeSource('item', item, output)
                    ._composeTest('item', item, output));
        parsed.paths.forEach(
            item =>
                this._composeSource('service', item, output)
                    ._composeTest('service', item, output));

        this._dumpFiles(output);
    }

    _composeTest(type = '', config = {}, { tests = [] })
    {
        const template = dotProp(this, `config.paths.templates.tests.${type}`);
        const { namespace, date } = this.config;
        const context = Object.assign({}, config, { namespace, date, for : `tests.${type}` });
        const content = AmjsTemplater(template, context);

        const id = decamelize(config.id, '/').split('/');
        let fileName = id.pop();
        const filePath = path.join(dotProp(this, `config.paths.tests.${type}s`), id.join('/'));
        fileName = path.join(filePath, `${capitalize(fileName)}.js`);

        tests.push({
            content,
            filePath,
            fileName
        });
    }

    _composeSource(type = '', config = {}, { sources = [] })
    {
        const template = dotProp(this, `config.paths.templates.sources.${type}`);
        const { namespace, date } = this.config;
        config.className = capitalize(camelize(`${namespace}-${type}-${config.id}`));
        const context = Object.assign({}, config, { namespace, date, for : `sources.${type}` });
        const content = AmjsTemplater(template, context);

        const id = decamelize(config.id, '/').split('/');
        let fileName = id.pop();
        const filePath = path.join(dotProp(this, `config.paths.output.${type}s`), id.join('/'));
        fileName = path.join(filePath, `${capitalize(fileName)}.js`);

        sources.push({
            filePath,
            fileName,
            content
        });

        return this;
    }

    _dumpFiles(stack = {})
    {
        Object.keys(stack).forEach(
            key =>
            {
                this.logger.log(`Creating ${key} files`);
                const files = stack[key] || [];
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
        );
    }
};