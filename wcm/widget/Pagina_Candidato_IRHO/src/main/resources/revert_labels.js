const fs = require('fs');
const filePath = 'c:/Users/giloc/OneDrive/Documentos/WORKSPACES FLUIG/Monte Bravo Homologação/Widget Pagina Candidato/wcm/widget/Pagina_Candidato_IRHO/src/main/resources/view.ftl';
let content = fs.readFileSync(filePath, 'utf8');

// Remover a classe floating-label de todos os form-group
content = content.replace(/form-group\s+floating-label/g, 'form-group');
content = content.replace(/floating-label\s+form-group/g, 'form-group');
content = content.replace(/\s+floating-label/g, ''); // em caso de sobras

// A estrutura atual (do passo anterior) é:
// <div class="form-group ...">
//    <input ...>
//    <label ...>...</label>
// Ou com <select>. Precisamos inverter para colocar o <label> ANTES do <input/select>.

const regexInverter = /<div class="([^>]*?form-group[^>]*?)">\s*(<input[\s\S]*?>|<select[\s\S]*?>[\s\S]*?<\/select>)\s*<label([^>]*)>([\s\S]*?)<\/label>/g;

content = content.replace(regexInverter, function(match, classes, inputEl, labelAttrs, labelText) {
    return `<div class="${classes.trim()}">
        <label${labelAttrs}>${labelText}</label>
        ${inputEl}`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('view.ftl refactored to standard labels');
