const fs = require('fs');
let content = fs.readFileSync('c:/Users/giloc/OneDrive/Documentos/WORKSPACES FLUIG/Monte Bravo Homologação/Widget Pagina Candidato/wcm/widget/Pagina_Candidato_IRHO/src/main/resources/view.ftl', 'utf8');

// Replace the layout_wrapper and sidebar with the new header and stepper
const stepperHtml = `
<div class="custom-page-header">
    <div class="header-title">
        <div class="header-logo-wrapper">
            <img src="/painel_admissao_irho/resources/images/logo-mb.png" onerror="this.src='img/logo-mb.png'" class="header-logo" alt="Logo">
        </div>
        <div class="header-text-group">
            <h2>ADMISSÃO DIGITAL</h2>
            <span class="header-subtitle">Plataforma do Candidato</span>
        </div>
    </div>
    <div class="header-actions">
        <div class="header-glass-card" style="padding: 10px 15px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);">
            <i class="flaticon flaticon-account-circle icon-sm" style="color: #fff; margin-right: 5px;"></i>
            <span id="lblNomeCandidatoHeader" style="color: #fff; font-weight: 600; font-size: 14px;">Bem-vindo(a)</span>
        </div>
    </div>
</div>

<div class="modern-stepper-wrapper" id="sidebar_etapas_card">
    <div class="stepper-container">
        <ul class="stepper-list sidebar-menu">
            <li class="step-item active" data-step="1">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Orientações</div>
            </li>
            <li class="step-item" data-step="2">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Dados Pessoais</div>
            </li>
            <li class="step-item" data-step="3">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Documentos</div>
            </li>
            <li class="step-item" data-step="4">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Endereço</div>
            </li>
            <li class="step-item" data-step="5">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Dependentes</div>
            </li>
            <li class="step-item" data-step="6">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Dados Bancários</div>
            </li>
            <li class="step-item" data-step="7">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Formação</div>
            </li>
            <li class="step-item" data-step="8">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Termos</div>
            </li>
            <li class="step-item" data-step="9">
                <div class="step-indicator">
                    <span class="step-icon"></span>
                </div>
                <div class="step-label">Envio</div>
            </li>
        </ul>
    </div>
</div>

<div id="form_main_container" class="container" style="max-width: 1000px; margin: 30px auto; padding: 0 15px;">
`;

// Note: I kept the IDs `sidebar_etapas_card` and `sidebar-menu` on the stepper wrapper and UL 
// to avoid breaking the JS `.find('#sidebar_etapas_card')` and `.find('.step-item[data-step="..."]')`

const regexSidebar = /<div id="layout_wrapper">[\s\S]*?<div id="form_main_container">/;
content = content.replace(regexSidebar, stepperHtml);

// Remove the closing tags of layout_wrapper that were placed at the end of the form
// The layout_wrapper closing tag usually looked like:
// </div> <!-- Fim do Layout Wrapper -->
// We will just use regex to remove that specific closing pattern at the end of the file
content = content.replace(/<\/div>\s*<!-- Fim do Layout Wrapper -->/g, '');
// Wait, when I refactored view.ftl initially to use layout_wrapper, did I add a comment?
// Let's just remove the last </div> before the final scripts if we have an extra one. 
// We can just count the <div>s or find the specific string. Let's assume it was just </div>.
// Actually, `form_main_container` is closed, and then `layout_wrapper` is closed.
// Let's replace the last `</div>\s*</div>` with just `</div>`
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/g, '</div>\n</div>\n');

fs.writeFileSync('c:/Users/giloc/OneDrive/Documentos/WORKSPACES FLUIG/Monte Bravo Homologação/Widget Pagina Candidato/wcm/widget/Pagina_Candidato_IRHO/src/main/resources/view.ftl', content, 'utf8');
console.log('Structure replaced');
