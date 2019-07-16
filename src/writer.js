const fs = require('fs');

/**
 * Writes a file
 * @param {String}  filePath    Destination path
 * @param {String}  fileContent Destination content
 * @param {Boolean} force       Force file creation
 * @param {Boolean} append      Append new content to existing file content
 */
module.exports = (filePath = '', fileContent = '', force = false, append = false) =>
{
    const exists = fs.existsSync(filePath) || force;

    if (exists && append)
    {
        fileContent = `${fs.readFileSync(filePath).toString()}\n${fileContent}`;
    }

    fs.writeFileSync(filePath, fileContent, 'utf-8');
};
