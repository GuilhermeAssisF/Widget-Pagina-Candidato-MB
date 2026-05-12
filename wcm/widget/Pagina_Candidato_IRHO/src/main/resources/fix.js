const fs = require('fs');
const filePath = 'c:/Users/giloc/OneDrive/Documentos/WORKSPACES FLUIG/Monte Bravo Homologação/Widget Pagina Candidato/wcm/widget/Pagina_Candidato_IRHO/src/main/resources/view.ftl';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/ADMISS.O DIGITAL/g, 'ADMISSÃO DIGITAL');
content = content.replace(/Orienta.es/g, 'Orientações');
content = content.replace(/Endere.o/g, 'Endereço');
content = content.replace(/Dados Banc.rios/g, 'Dados Bancários');
content = content.replace(/Forma.o/g, 'Formação');

for(let i = 1; i <= 9; i++) {
    const rx = new RegExp('<li class="step-item( active)?" data-step="' + i + '">\\s*<div class="step-indicator">\\s*<span class="step-icon"><\/span>', 'g');
    content = content.replace(rx, '<li class="step-item$1" data-step="' + i + '">\n                <div class="step-indicator">\n                    <span class="step-icon">' + i + '</span>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed encoding and added numbers');
