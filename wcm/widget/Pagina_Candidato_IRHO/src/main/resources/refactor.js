const fs = require('fs');
const filePath = 'c:/Users/giloc/OneDrive/Documentos/WORKSPACES FLUIG/Monte Bravo Homologação/Widget Pagina Candidato/wcm/widget/Pagina_Candidato_IRHO/src/main/resources/view.ftl';
let content = fs.readFileSync(filePath, 'utf8');

// Remover wizard-card
content = content.replace('<div class="wizard-card">', '');

let regexTopo = /<div class="container-fluid">\s*<input type="hidden" name="idSolicitacaoRH" id="idSolicitacaoRH_\$\{instanceId\}">\s*<div class="text-center" style="margin-bottom: 30px;">[\s\S]*?<div class="wizard-progress">[\s\S]*?<\/div>\s*<form name="formCandidato_\$\{instanceId\}" id="formCandidato_\$\{instanceId\}" role="form">/;

let newTopo = `
    <div class="container-fluid">
        <div id="layout_wrapper">
            
            <div id="sidebar_etapas_card">
                <div class="sidebar-header">
                    <h3 class="sidebar-title">Admissão Digital</h3>
                    <p style="font-size: 11px; text-align:center; color: var(--color-text-muted); margin-top: 5px;">Complete seu cadastro</p>
                </div>
                <div class="sidebar-content">
                    <ul class="sidebar-menu">
                        <li class="step-item active" data-step="1"><div class="step-circle">1</div>Proposta</li>
                        <li class="step-item" data-step="2"><div class="step-circle">2</div>LGPD</li>
                        <li class="step-item" data-step="3"><div class="step-circle">3</div>Dados</li>
                        <li class="step-item" data-step="4"><div class="step-circle">4</div>Formação</li> 
                        <li class="step-item" data-step="5"><div class="step-circle">5</div>Dependentes</li>
                        <li class="step-item" data-step="6"><div class="step-circle">6</div>Filiação</li>
                        <li class="step-item" data-step="7"><div class="step-circle">7</div>Benefícios</li>
                        <li class="step-item" data-step="8"><div class="step-circle\">8</div>Documentos</li> 
                        <li class="step-item" data-step="9"><div class="step-circle">9</div>Fim</li>
                    </ul>
                </div>
            </div>

            <div id="form_main_container">
                <input type="hidden" name="idSolicitacaoRH" id="idSolicitacaoRH_\${instanceId}">
                <form name="formCandidato_\${instanceId}" id="formCandidato_\${instanceId}" role="form">
`;

content = content.replace(regexTopo, newTopo);

// Final de tudo: precisamos fechar a div form_main_container e layout_wrapper onde fechava o wizard-card
content = content.replace(/<\/div>\s*<\/div>\s*$/, '    </div>\n        </div>\n    </div>\n</div>');

// ==========================================
// MUDAR FLOATING LABELS
// ==========================================
// Regex para pegar form-groups que possuem <label> e dps <input> ou <select>
const regexInputs = /<div class="([^"]*?)form-group([^"]*?)">\s*<label([^>]*)>([\s\S]*?)<\/label>\s*(<input[\s\S]*?>|<select[\s\S]*?>[\s\S]*?<\/select>)/g;
content = content.replace(regexInputs, function(match, preClasses, postClasses, labelAttrs, labelText, inputEl) {
    let newClasses = (preClasses + ' ' + postClasses).trim();
    if (!newClasses.includes('floating-label')) {
        newClasses += ' floating-label';
    }
    return `<div class="form-group ${newClasses}">
        ${inputEl}
        <label${labelAttrs}>${labelText}</label>`;
});

// ==========================================
// ATUALIZAR BOTÕES (btn-primary, btn-info, accept/decline)
// ==========================================
content = content.replace(/btn-success/g, 'btn-accept');
content = content.replace(/btn-danger/g, 'btn-decline');
content = content.replace(/btn-sm/g, ''); // Remover btn-sm porque definimos tamanho padrão no CSS
content = content.replace(/btn-lg/g, ''); // Remover btn-lg

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done script');
