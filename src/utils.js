/**
 * Turns a text into cameCase form, i.e.: 'hello-world' -> 'helloWorld'
 * @param   {String}    text    To transform
 * @param   {String}    sep     Text character separator or to add after transformation.
 * @return  {String}    Transformed string
 */
const camelize = (text = '', sep = '') =>
    text.split(/\W/g)
        .map((part, index) => index ? capital(part) : part)
        .join('.')
        .replace(/\./g, sep);

/**
 * Transforms a text so its first character turns to capital, i.e.: 'hello' -> 'Hello'
 * @param   {String}    text    To be transformed
 * @return  {String}    Transformed text
 */
const capital = (text = '') => `${text.charAt(0).toUpperCase()}${text.substr(1)}`;

/**
 * Finds a value referenced by a dot-chained property tree or sets its value
 * @param   {Object}    ref     Where to find the property
 * @param   {String}    prop    Dot-chained tree property
 * @param   {*}         value   New value to assign
 * @return  {*}         Current value of the property
 */
const dotProp = (ref = {}, prop = '', value) =>
{
    let result;
    if (prop.lastIndexOf('.') !== -1)
    {
        prop = prop.split('.');
        const key = prop.shift();
        if (ref && typeof ref[key] === 'object')
        {
            ref = ref[key];
            prop = prop.join('.');
            result = dotProp(ref, prop, value);
        }
    }
    else
    {
        result = ref[prop];
    }

    if (value)
    {
        ref[prop] = value;
    }

    return result;
};

module.exports  = {
    camelize,
    capital,
    dotProp
};