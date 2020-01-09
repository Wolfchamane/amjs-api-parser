const { decamelize, camelize, capitalize, dotProp } = require('@amjs/utils');
const Handlebars                           = require('handlebars');

const ormBasics = ['string', 'number', 'boolean', 'object', 'array', 'collection', 'date', 'password'];
const ormBasicsMap = value => ({
    'Integer': 'Number'
}[value] || value);

const countChar = (value = '', char = '') =>
{
    let acum = 0;
    if (value)
    {
        for (let i = value.length - 1, l = 0; i >= l; i--)
        {
            if (value[i] === char)
            {
                acum++;
            }
        }
    }
    return acum;
};

const filePath = (value = '') =>
{
    value = decamelize(value).split('-');
    return value.map((it, id) => id === value.length - 1 ? capitalize(it) : it).join('/');
};

Handlebars.registerHelper('camelize', value => camelize(value));
Handlebars.registerHelper('capitalCamelize', value => capitalize(camelize(value)));
Handlebars.registerHelper('dotSep', value => decamelize(value, '.').toLowerCase());
Handlebars.registerHelper('parseRequirement',
    value =>
    {
        value = ormBasicsMap(value);
        if (ormBasics.includes(value.toLowerCase()))
        {
            value = `@amjs/data-types/src/${capitalize(value)}.js`;
        }
        else
        {
            value = `./${filePath(value)}`;
        }

        return value;
    }
);
Handlebars.registerHelper('filePath', (value, context = {}) =>
{
    const data = dotProp(context, 'data.root');
    value = ormBasicsMap(value);
    if (ormBasics.includes(value.toLowerCase()))
    {
        value = `@amjs/data-types/src/${value}`;
    }
    else
    {
        value = filePath(value);
        const type = data.itemType
            ? 'type/collection'
            : data.url
                ? 'services'
                : 'type/item';
        let base = '';
        for (let i = 0, l = countChar(value, '/') - 1; i <= l; i++)
        {
            base = `../${base}`;
        }

        switch (data.for)
        {
            case 'sources.service':
                base += `../type/collection/`;
                break;
            case 'sources.item':
                base = './';
                break;
            case 'sources.collection':
                base += '../item/';
                break;
            case 'tests.service':
            case 'tests.collection':
            case 'tests.item':
                base += `${type !== 'services' ? '../' : ''}../../../src/${type}/`;
        }

        value = `${base}${value}`;
    }

    return value;
});

Handlebars.registerHelper('itemPropType', (value, context) =>
{
    value = ormBasicsMap(value);
    return `{${ value !== '*'
        ? ormBasics.includes(value.toLowerCase())
            ? `amjs.dataTypes.${value}`
            : `${camelize(context.data.root.namespace, '.').toLowerCase()}.${value}`
        : value }}`;
});