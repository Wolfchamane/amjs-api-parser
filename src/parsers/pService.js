const { log }   = require('../logger');
const path      = require('path');
const templater = require('@amjs/templater');
const writer    = require('../writer');

/**
 * Service parser. Extracts all the information of a service specified into the API file.
 * @param   {String}    _path       Service path
 * @param   {Object}    services    Available services in API spec file
 * @param   {Object}    config      api-parser configuration
 */
module.exports = (_path, services, config) =>
{
    let key = _path.replace(/\//g, ''); //@todo ---> fix key value and feature path: /path/{param} (recursively)
    key = `${key.charAt(0).toUpperCase()}${key.substr(1)}`;
    const srv = services[_path];
    const service = {
        path    : _path,
        methods : [],
        summary : srv.summary || ''
    };

    const collection = {};

    Object.keys(srv).forEach(
        method =>
        {
            service.methods.push(method.toUpperCase());

            const mthd = srv[method];
            Object.keys(mthd.responses).forEach(
                response =>
                {
                    if (response === '200' && !collection.name)
                    {
                        service.summary = mthd.summary || '';
                        service.method = method.toUpperCase();
                        collection.name = mthd.responses[response]
                            .content['application/json']
                            .schema.$ref.replace('#/components/schemas/', '');
                    }
                }
            );
        }
    );

    if (collection.name)
    {
        collection.path = `../type/collection/${collection.name}`;
    }

    const serviceContext = Object.assign(
        {},
        config,
        {
            service,
            collection,
            key,
            namespace : [config.namespace, 'service'].join('-')
        }
    );
    const servicePathFile = path.join(config.paths.services, `${key}.js`);
    const serviceTestPathFile = path.join(config.paths.tests.services, `${key}.js`);
    const tplServicePath = path.join(config.paths.templates, 'service.hbs');
    const tplTestServicePath = path.join(config.paths.templates, 'service-test.hbs');

    const serviceFileContent = templater(tplServicePath, serviceContext);
    const serviceTestFileContent = templater(tplTestServicePath, serviceContext);

    log(
        `Writing file: "${servicePathFile.replace(/(.+\/)(.+)(\.\w+)$/, `$1{{key}}$3`)}"`,
        { key },
        config,
        'blue');
    writer(servicePathFile, serviceFileContent, true, false);
    log(
        `Writing file: "${serviceTestPathFile.replace(/(.+\/)(.+)(\.\w+)$/, `$1{{key}}$3`)}"`,
        { key },
        config,
        'blue');
    writer(serviceTestPathFile, serviceTestFileContent, true, false);
};