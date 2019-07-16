/**
 * Runs the proper file parser.
 * @param   {String}    source  API spec file.
 * @return  {*}         Parse information.
 */
module.exports = (source = '') =>
{
    return /.+\.ya?ml$/.test(source)
        ? require('./eYaml')(source)
        : {};

    // @todo: support json and raml files
};
