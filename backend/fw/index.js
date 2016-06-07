// Carregara todos os  `*.js` debaixo do diretorio atual como modulos0
//  por exemplo., `User.js` será `exports['User']` ou `exports.User`
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
        var name = file.replace('.js', '');
        exports[name] = require('./' + file);
    }
});