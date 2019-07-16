const { dotProp }   = require('./utils');
const chalk         = require('chalk');
const fs            = require('fs');
const templater     = require('@amjs/templater');
const writer        = require('./writer');

/**
 * Prints a message into console and into a file
 * @param   {String}    level       Level of trace to print
 * @param   {String}    toConsole   Console output
 * @param   {String}    toLog       File content
 * @param   {Object}    config      api-parser configuration object
 * @private
 */
const _print = (level = 'log', toConsole, toLog, config) =>
{
    const cTrace = `[${level.toUpperCase()}] ${toConsole}`;
    const lTrace = `[${level.toUpperCase()}] ${toLog}`;

    console.log(`${cTrace}`);

    writer(
        config.logFile,
        `[${(new Date().toISOString())}] [@amjs/api-parser] ${lTrace}`,
        false,
        true
    );
};

/**
 * Applies the required changes to any log message.
 * @param   {String}    level   Trace level
 * @param   {String}    open    Open message to display into console
 * @param   {String}    log     Message to print into log file
 * @param   {Object}    context Context to apply into messages
 * @param   {Object}    config  api-parser configuration object
 * @param   {String}    style   chalk method to apply
 * @private
 */
const _log = (level = 'log', open = '', log  = '', context = {}, config = {}, style = '') =>
{
    const chalkMethod = (style && typeof chalk[style] === 'function')
        ? (value) => chalk[style](value)
        : (value) => value;

    if (typeof context === 'function')
    {
        context = context();
    }

    if (!log && open)
    {
        log = open;
    }

    if (open.lastIndexOf('{') !== -1)
    {
        const chalked = JSON.parse(JSON.stringify(context));
        open.match(/{+[\w\.]+}+/g).forEach(match =>
        {
            const key = match.replace(/[{}]+/g, '');
            dotProp(chalked, key, chalkMethod(dotProp(context, key)));
        });

        open = templater(open, chalked)
            .replace(/&quot;/g, '"');
        log = templater(log, context)
            .replace(/&quot;/g, '"');
    }

    _print(level, open, log, config);
};

/**
 * Exports a collection of log methods
 */
module.exports  = {
    /**
     * Prints a [DEBUG] message
     * @param   {String}    message To print
     * @param   {Object}    context To apply into message
     * @param   {Object}    config  api-parser configuration
     */
    debug(message = '', context = {}, config = {})
    {
        _log(
            'debug',
            message,
            '',
            context,
            config,
            'italic'
        );
    },
    /**
     * Prints a [ERROR] message
     * @param   {*}         err     Error
     * @param   {Object}    config  api-parser configuration
     */
    error(err, config)
    {
        _log(
            'error',
            '[{{code}}] {{message}}',
            '[{{code}}] {{message}}\n{{stack}}',
            () =>
            {
                const json = {};
                Object.getOwnPropertyNames(err).forEach(
                    prop => json[prop] = err[prop]
                );

                if (!json.code)
                {
                    json.code = '999';
                }

                return json;
            },
            config,
            'red'
        );
    },
    /**
     * Prints a [LOG] message
     * @param   {String}    message To display
     * @param   {Object}    context To apply into message
     * @param   {Object}    config  api-parser configuration
     * @param   {String}    style   chalk method to apply
     */
    log(message = '', context = {}, config = {}, style = '')
    {
        _log(
            'log',
            message,
            '',
            context,
            config,
            style
        );
    },
    /**
     * Removes or ends the log file
     * @param   {Object}    config  api-parser configuration
     */
    dumpLog(config = {})
    {
        if (fs.existsSync(config.logFile))
        {
            if (config.clean)
            {
                fs.unlinkSync(config.logFile);
            }
            else
            {
                writer(config.logFile, 'END', false, true);
            }
        }
    },
    /**
     * Checks or initializes log file
     * @param   {Object}    config  api-parser configuration
     */
    checkLog(config = {})
    {
        if (!fs.existsSync(config.paths.logs))
        {
            fs.mkdirSync(config.paths.logs);
        }

        if (!fs.existsSync(config.logFile))
        {
            writer(config.logFile, 'INIT', true, false);
        }
    }
};
