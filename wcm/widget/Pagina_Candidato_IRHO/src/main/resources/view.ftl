<div id="AdmissaoWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide admissao-container" data-params="AdmissaoWidget.instance()">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <div class="container-fluid">
        <div class="custom-page-header">
            <div class="header-title">
                <div class="header-logo-wrapper">
                    <img src="/Pagina_Candidato_IRHO/resources/images/logo-mb.png" onerror="this.src='img/logo-mb.png'" class="header-logo" alt="Logo">
                </div>
                <div class="header-text-group">
                    <h2>PORTAL DO CANDIDATO</h2>
                    <span class="header-subtitle">Admissão Digital</span>
                </div>
            </div>
            <div class="header-actions">
                <div class="header-glass-card" style="padding: 10px 15px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);">
                    <i class="flaticon flaticon-account-circle icon-sm" style="color: #fff; margin-right: 5px;">
                    </i>
                    <span id="lblNomeCandidatoHeader" style="color: #fff; font-weight: 600; font-size: 14px;">Bem-vindo(a)</span>
                </div>
            </div>
        </div>
        <div class="main-content-card">
            <div class="modern-stepper-wrapper" id="sidebar_etapas_card">
                <div class="stepper-container">
                    <ul class="stepper-list sidebar-menu">
                        <li class="step-item active" data-step="1">
                            <div class="step-indicator">
                                <span class="step-icon">1</span>
                            </div>
                            <div class="step-label">LGPD</div>
                        </li>
                        <li class="step-item" data-step="2">
                            <div class="step-indicator">
                                <span class="step-icon">2</span>
                            </div>
                            <div class="step-label">Dados Pessoais</div>
                        </li>
                        <li class="step-item" data-step="3">
                            <div class="step-indicator">
                                <span class="step-icon">3</span>
                            </div>
                            <div class="step-label">Formação</div>
                        </li>
                        <li class="step-item" data-step="4">
                            <div class="step-indicator">
                                <span class="step-icon">4</span>
                            </div>
                            <div class="step-label">Filiação</div>
                        </li>
                        <li class="step-item" data-step="5">
                            <div class="step-indicator">
                                <span class="step-icon">5</span>
                            </div>
                            <div class="step-label">Dependentes</div>
                        </li>
                        <li class="step-item" data-step="6">
                            <div class="step-indicator">
                                <span class="step-icon">6</span>
                            </div>
                            <div class="step-label">Benefícios</div>
                        </li>
                        <li class="step-item" data-step="7">
                            <div class="step-indicator">
                                <span class="step-icon">7</span>
                            </div>
                            <div class="step-label">Documentos</div>
                        </li>
                        <li class="step-item" data-step="8">
                            <div class="step-indicator">
                                <span class="step-icon">8</span>
                            </div>
                            <div class="step-label">Final</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="form_main_container" class="container" style="max-width: 1000px; margin: 30px auto; padding: 0 15px;">
                <input type="hidden" name="idSolicitacaoRH" id="idSolicitacaoRH_${instanceId}">
                <form name="formCandidato_${instanceId}" id="formCandidato_${instanceId}" role="form">
                    <div data-step-content="1" class="step-content active">
                        <h3 class="section-title">
                            <i class="fa-solid fa-file-contract"
                                style="color: rgb(177, 151, 252);">
                            </i>
                            Termo LGPD
                        </h3>
                        <div class="document-grid primeiro-link-grid"
                            id="primeiro_link_cards_${instanceId}">
                            <div class="grid-card primeiro-link-card"
                                data-doc-type="lgpd">
                                <div class="icon-wrapper">
                                    <i class="flaticon flaticon-document-check">
                                    </i>
                                </div>
                                <div class="doc-name">Termo LGPD</div>
                                <div class="doc-status-badge"
                                    id="card_status_lgpd_${instanceId}">
                                    Ver arquivo
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-info primeiro-link-alert">
                            <i class="flaticon flaticon-info icon-md">
                            </i>
                            Clique na caixa para visualizar o Termo LGPD.
                            Após realizar a leitura, confirme o aceite para continuar
                            o preenchimento da admissão.
                        </div>
                        <div class="text-center mt-20">
                            <button type="button"
                                class="btn btn-success btn-lg"
                                id="btn_gerar_assinar_primeiro_link_${instanceId}"
                                style="display: none;">
                                <i class="flaticon flaticon-check-circle-on icon-sm">
                                </i>
                                Li e Aceito - Assinar Termo LGPD
                            </button>
                            <div id="status_assinatura_verificada_${instanceId}"
                                class="assinatura-verificada-badge"
                                style="display: none;">
                                <i class="flaticon flaticon-check-circle-on icon-sm">
                                </i>
                                Assinatura Verificada
                            </div>
                        </div>
                    </div>
                    <div data-step-content="2" class="step-content">
                        <h3 class="section-title">
                            <i class="fa-solid fa-user" style="color: rgb(177, 151, 252);">
                            </i>
                            Dados da Admissão
                        </h3>
                        <ul class="nav nav-tabs" role="tablist" id="tabMenuDados_${instanceId}">
                            <li role="presentation" class="active">
                                <a href="#tab_pessoais_${instanceId}" aria-controls="tab_pessoais_${instanceId}" role="tab" data-toggle="tab">Seus Dados</a>
                            </li>
                            <li role="presentation">
                                <a href="#tab_endereco_${instanceId}" aria-controls="tab_endereco_${instanceId}" role="tab" data-toggle="tab">Endereço</a>
                            </li>
                            <li role="presentation">
                                <a href="#tab_contratacao_${instanceId}" aria-controls="tab_contratacao_${instanceId}" role="tab" data-toggle="tab">Contratação</a>
                            </li>
                            <li role="presentation">
                                <a href="#tab_bancarios_${instanceId}" aria-controls="tab_bancarios_${instanceId}" role="tab" data-toggle="tab">Bancários</a>
                            </li>
                            <li role="presentation">
                                <a href="#tab_emergencia_${instanceId}" aria-controls="tab_emergencia_${instanceId}" role="tab" data-toggle="tab">Emergência</a>
                            </li>
                            <li role="presentation">
                                <a href="#tab_outros_docs_${instanceId}" aria-controls="tab_outros_docs_${instanceId}" role="tab" data-toggle="tab">Docs Extras</a>
                            </li>
                            <li role="presentation">
                                <a href="#tab_foto_${instanceId}" aria-controls="tab_foto_${instanceId}" role="tab" data-toggle="tab">Foto</a>
                            </li>
                        </ul>
                        <div class="tab-content shadow-panel" id="tabContentDados_${instanceId}">
                            <div role="tabpanel" class="tab-pane active" id="tab_pessoais_${instanceId}">
                                <p class="text-danger">
                                    <small>* Confira seus dados básicos.</small>
                                </p>
                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label>Nome Completo</label>
                                        <input type="text" class="form-control" id="cand_nomeCompleto_${instanceId}" readonly>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>E-mail</label>
                                        <input type="email" class="form-control" id="cand_email_${instanceId}">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label>CPF</label>
                                        <input type="text" class="form-control" id="cand_cpf_${instanceId}" readonly>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label>Celular</label>
                                        <input type="text" class="form-control" id="cand_celular_${instanceId}">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label>Nascimento</label>
                                        <input type="text" class="form-control fluig-calendar" id="cand_nascimento_${instanceId}" placeholder="DD/MM/AAAA" readonly>
                                    </div>
                                </div>
                                <hr>
                                <h4 style="color: #1eaad9;">Dados Complementares</h4>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>Estado Natal</label>
                                        <select class="form-control" id="cand_estado_natal_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="AC">AC</option>
                                            <option value="AL">AL</option>
                                            <option value="AP">AP</option>
                                            <option value="AM">AM</option>
                                            <option value="BA">BA</option>
                                            <option value="CE">CE</option>
                                            <option value="DF">DF</option>
                                            <option value="ES">ES</option>
                                            <option value="GO">GO</option>
                                            <option value="MA">MA</option>
                                            <option value="MT">MT</option>
                                            <option value="MS">MS</option>
                                            <option value="MG">MG</option>
                                            <option value="PA">PA</option>
                                            <option value="PB">PB</option>
                                            <option value="PR">PR</option>
                                            <option value="PE">PE</option>
                                            <option value="PI">PI</option>
                                            <option value="RJ">RJ</option>
                                            <option value="RN">RN</option>
                                            <option value="RS">RS</option>
                                            <option value="RO">RO</option>
                                            <option value="RR">RR</option>
                                            <option value="SC">SC</option>
                                            <option value="SP">SP</option>
                                            <option value="SE">SE</option>
                                            <option value="TO">TO</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Naturalidade</label>
                                        <select class="form-control" id="cand_naturalidade_${instanceId}">
                                            <option value="">Selecione o Estado primeiro...</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Estado Civil</label>
                                        <select class="form-control" id="cand_estado_civil_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Solteiro">Solteiro</option>
                                            <option value="Casado">Casado</option>
                                            <option value="Divorciado">Divorciado</option>
                                            <option value="Viuvo">Viúvo</option>
                                            <option value="Uniao Estavel">União Estável</option>
                                            <option value="Separado">Separado</option>
                                            <option value="Desquitado">Desquitado</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Sexo</label>
                                        <select class="form-control" id="cand_sexo_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>Nacionalidade</label>
                                        <select class="form-control" id="cand_nacionalidade_${instanceId}">
                                            <option value="10">Brasileira</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Cor / Raça</label>
                                        <select class="form-control" id="cand_raca_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="0">Indígena</option>
                                            <option value="2">Branca</option>
                                            <option value="4">Negra</option>
                                            <option value="6">Amarela</option>
                                            <option value="8">Parda</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Tipo Sanguíneo</label>
                                        <select class="form-control" id="cand_tipo_sanguineo_${instanceId}">
                                            <option value="">Carregando...</option>
                                        </select>
                                    </div>
                                </div>
                                <hr>
                                <h4 style="color: #1eaad9;">Dados do RG</h4>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>RG</label>
                                        <input type="text" class="form-control" id="cand_rg_${instanceId}" placeholder="Número do RG">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>UF do RG</label>
                                        <select class="form-control" id="cand_rg_uf_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="AC">AC</option>
                                            <option value="AL">AL</option>
                                            <option value="AP">AP</option>
                                            <option value="AM">AM</option>
                                            <option value="BA">BA</option>
                                            <option value="CE">CE</option>
                                            <option value="DF">DF</option>
                                            <option value="ES">ES</option>
                                            <option value="GO">GO</option>
                                            <option value="MA">MA</option>
                                            <option value="MT">MT</option>
                                            <option value="MS">MS</option>
                                            <option value="MG">MG</option>
                                            <option value="PA">PA</option>
                                            <option value="PB">PB</option>
                                            <option value="PR">PR</option>
                                            <option value="PE">PE</option>
                                            <option value="PI">PI</option>
                                            <option value="RJ">RJ</option>
                                            <option value="RN">RN</option>
                                            <option value="RS">RS</option>
                                            <option value="RO">RO</option>
                                            <option value="RR">RR</option>
                                            <option value="SC">SC</option>
                                            <option value="SP">SP</option>
                                            <option value="SE">SE</option>
                                            <option value="TO">TO</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Órgão Emissor</label>
                                        <input type="text" class="form-control" id="cand_rg_orgao_${instanceId}" placeholder="Ex: SSP">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Data de Emissão</label>
                                        <input type="text" class="form-control fluig-calendar" id="cand_rg_data_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                    </div>
                                </div>
                                <hr>
                                <h4 style="color: #1eaad9;">Dados do Título de Eleitor</h4>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>Título Digital?</label>
                                        <select class="form-control" id="cand_titulo_digital_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Nao">Não</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Título Eleitor</label>
                                        <input type="text" class="form-control" id="cand_titulo_eleitor_${instanceId}" placeholder="Número do Título">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Zona Eleitoral</label>
                                        <input type="text" class="form-control" id="cand_titulo_zona_${instanceId}">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Seção</label>
                                        <input type="text" class="form-control" id="cand_titulo_secao_${instanceId}">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>UF do Título</label>
                                        <select class="form-control" id="cand_titulo_uf_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="AC">AC</option>
                                            <option value="AL">AL</option>
                                            <option value="AP">AP</option>
                                            <option value="AM">AM</option>
                                            <option value="BA">BA</option>
                                            <option value="CE">CE</option>
                                            <option value="DF">DF</option>
                                            <option value="ES">ES</option>
                                            <option value="GO">GO</option>
                                            <option value="MA">MA</option>
                                            <option value="MT">MT</option>
                                            <option value="MS">MS</option>
                                            <option value="MG">MG</option>
                                            <option value="PA">PA</option>
                                            <option value="PB">PB</option>
                                            <option value="PR">PR</option>
                                            <option value="PE">PE</option>
                                            <option value="PI">PI</option>
                                            <option value="RJ">RJ</option>
                                            <option value="RN">RN</option>
                                            <option value="RS">RS</option>
                                            <option value="RO">RO</option>
                                            <option value="RR">RR</option>
                                            <option value="SC">SC</option>
                                            <option value="SP">SP</option>
                                            <option value="SE">SE</option>
                                            <option value="TO">TO</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Data Emissão</label>
                                        <input type="text" class="form-control fluig-calendar" id="cand_titulo_data_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                    </div>
                                </div>
                                <div class="text-right" style="margin-top: 20px;">
                                    <button type="button" class="btn btn-info " data-next-tab="#tab_endereco_${instanceId}">
                                        Próxima Aba
                                        <i class="flaticon flaticon-arrow-right">
                                        </i>
                                    </button>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="tab_endereco_${instanceId}">
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>CEP</label>
                                        <input type="text" class="form-control" id="cand_cep_${instanceId}" placeholder="00000-000">
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>País</label>
                                        <input type="text" class="form-control" id="cand_pais_${instanceId}" value="Brasil">
                                    </div>
                                    <div class="col-md-6">
                                        <p class="text-muted small" style="margin-top: 25px;">
                                            <i class="flaticon flaticon-info">
                                            </i>
                                            Digite o CEP para buscar o endereço.
                                        </p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>Tipo Logradouro</label>
                                        <select class="form-control" id="cand_tipo_logradouro_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Rua">Rua</option>
                                            <option value="Avenida">Avenida</option>
                                            <option value="Alameda">Alameda</option>
                                            <option value="Estrada">Estrada</option>
                                            <option value="Rodovia">Rodovia</option>
                                            <option value="Praca">Praça</option>
                                            <option value="Travessa">Travessa</option>
                                            <option value="Viela">Viela</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-9">
                                        <label>Endereço (Logradouro)</label>
                                        <input type="text" class="form-control" id="cand_endereco_${instanceId}">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>Número</label>
                                        <input type="text" class="form-control" id="cand_numero_${instanceId}">
                                    </div>
                                    <div class="form-group col-md-9">
                                        <label>Complemento</label>
                                        <input type="text" class="form-control" id="cand_complemento_${instanceId}" placeholder="Ex: Apto 101, Bloco B">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label>Tipo Bairro</label>
                                        <select class="form-control" id="cand_tipo_bairro_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Bairro">Bairro</option>
                                            <option value="Jardim">Jardim</option>
                                            <option value="Vila">Vila</option>
                                            <option value="Parque">Parque</option>
                                            <option value="Residencial">Residencial</option>
                                            <option value="Distrito">Distrito</option>
                                            <option value="Setor">Sitio</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-9">
                                        <label>Bairro</label>
                                        <input type="text" class="form-control" id="cand_bairro_${instanceId}">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label>Estado (UF)</label>
                                        <select class="form-control" id="cand_uf_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="AC">AC</option>
                                            <option value="AL">AL</option>
                                            <option value="AP">AP</option>
                                            <option value="AM">AM</option>
                                            <option value="BA">BA</option>
                                            <option value="CE">CE</option>
                                            <option value="DF">DF</option>
                                            <option value="ES">ES</option>
                                            <option value="GO">GO</option>
                                            <option value="MA">MA</option>
                                            <option value="MT">MT</option>
                                            <option value="MS">MS</option>
                                            <option value="MG">MG</option>
                                            <option value="PA">PA</option>
                                            <option value="PB">PB</option>
                                            <option value="PR">PR</option>
                                            <option value="PE">PE</option>
                                            <option value="PI">PI</option>
                                            <option value="RJ">RJ</option>
                                            <option value="RN">RN</option>
                                            <option value="RS">RS</option>
                                            <option value="RO">RO</option>
                                            <option value="RR">RR</option>
                                            <option value="SC">SC</option>
                                            <option value="SP">SP</option>
                                            <option value="SE">SE</option>
                                            <option value="TO">TO</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-8">
                                        <label>Cidade</label>
                                        <select class="form-control" id="cand_cidade_${instanceId}">
                                            <option value="">Selecione o Estado (UF) primeiro...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <button type="button" class="btn btn-info " data-next-tab="#tab_contratacao_${instanceId}">
                                        Próxima Aba
                                        <i class="flaticon flaticon-arrow-right">
                                        </i>
                                    </button>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="tab_contratacao_${instanceId}">
                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label>Empresa</label>
                                        <input type="text" class="form-control" id="cand_empresa_${instanceId}" readonly>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Admissão</label>
                                        <input type="text" class="form-control" id="cand_data_admissao_${instanceId}" readonly>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Salário</label>
                                        <input type="text" class="form-control" id="cand_salario_${instanceId}" readonly>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label>Função</label>
                                        <input type="text" class="form-control" id="cand_funcao_${instanceId}" readonly>
                                    </div>
                                    <input type="hidden" id="cand_funcao_codigo_${instanceId}">
                                    <input type="hidden" id="cand_codcoligada_${instanceId}">
                                    <div class="form-group col-md-4">
                                        <label>Seção</label>
                                        <input type="text" class="form-control" id="cand_secao_${instanceId}" readonly>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label>Turno</label>
                                        <input type="text" class="form-control" id="cand_turno_${instanceId}" readonly>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="form-group col-md-3">
                                        <label style="font-size: 12px;">Possui Deficiência?</label>
                                        <select class="form-control" id="cand_possui_deficiencia_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Nao">Não</option>
                                            <option value="Sim">Sim</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 form-group" id="div_tipo_deficiencia_${instanceId}" style="display:none;">
                                        <label style="font-size: 12px;">Tipo de Deficiência</label>
                                        <select class="form-control" id="cand_tipo_deficiencia_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Fisica">Física</option>
                                            <option value="Auditiva">Auditiva</option>
                                            <option value="Fala">Fala</option>
                                            <option value="Visual">Visual</option>
                                            <option value="Mental">Mental</option>
                                            <option value="Intelectual">Intelectual</option>
                                            <option value="Reabilitado">Reabilitado</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="bloco_medidas_uniformes_epis_${instanceId}" style="display:none;">
                                    <hr>
                                    <h4 style="color: #1eaad9;">Medidas (Uniformes e EPIs)</h4>
                                    <div class="row">
                                        <div class="form-group col-md-4">
                                            <label style="font-size: 12px;">Tamanho do Calçado</label>
                                            <select class="form-control" id="cand_tamanho_calcado_${instanceId}">
                                                <option value="">Selecione...</option>
                                                <option value="01">33</option>
                                                <option value="02">34</option>
                                                <option value="03">35</option>
                                                <option value="04">36</option>
                                                <option value="05">37</option>
                                                <option value="06">38</option>
                                                <option value="07">39</option>
                                                <option value="08">40</option>
                                                <option value="09">41</option>
                                                <option value="10">42</option>
                                                <option value="11">43</option>
                                                <option value="12">44</option>
                                                <option value="13">45</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label style="font-size: 12px;">Tamanho da Camisa</label>
                                            <select class="form-control" id="cand_tamanho_camisa_${instanceId}">
                                                <option value="">Selecione...</option>
                                                <option value="01">PP</option>
                                                <option value="02">P</option>
                                                <option value="03">M</option>
                                                <option value="04">G</option>
                                                <option value="05">GG</option>
                                                <option value="06">XG</option>
                                                <option value="07">XGG</option>
                                                <option value="08">EGG</option>
                                                <option value="09">GGG</option>
                                                <option value="10">XXG</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label style="font-size: 12px;">Tamanho da Calça</label>
                                            <select class="form-control" id="cand_tamanho_calca_${instanceId}">
                                                <option value="">Selecione...</option>
                                                <option value="36">36</option>
                                                <option value="38">38</option>
                                                <option value="40">40</option>
                                                <option value="42">42</option>
                                                <option value="44">44</option>
                                                <option value="46">46</option>
                                                <option value="48">48</option>
                                                <option value="50">50</option>
                                                <option value="52">52</option>
                                                <option value="54">54</option>
                                                <option value="56">56</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <button type="button" class="btn btn-info " data-next-tab="#tab_bancarios_${instanceId}">
                                        Próxima Aba
                                        <i class="flaticon flaticon-arrow-right">
                                        </i>
                                    </button>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="tab_bancarios_${instanceId}">
                                <div class="alert alert-info small">Dados bancários para pagamento.</div>
                                <div class="row">
                                    <div class="form-group col-md-12">
                                        <label>Possui conta no Itaú?</label>
                                        <select class="form-control" id="cand_possui_conta_itau_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Nao">Não</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="div_alerta_abertura_conta_${instanceId}" style="display:none;" class="alert alert-warning small alerta-abertura-conta">
                                    <i class="flaticon flaticon-info icon-sm">
                                    </i>
                                    <strong>Importante:</strong>
                                    É necessário providenciar a abertura de conta no Itaú.
                                    <br>
                                    <a href="#" target="_blank" class="alert-link abertura-conta-link">Clique aqui para baixar as instruções de abertura de conta.</a>
                                    <br>
                                    <br>
                                    <span class="texto-provisorio-abertura-conta">Enquanto providencia a abertura, você pode informar os dados bancários de outra instituição abaixo provisoriamente.</span>
                                </div>
                                <div id="div_campos_bancarios_${instanceId}" style="display:none;">
                                    <div class="row">
                                        <div class="form-group col-md-4">
                                            <label>Banco</label>
                                            <input type="text" class="form-control" id="cand_banco_${instanceId}">
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label>Agência</label>
                                            <input type="text" class="form-control" id="cand_agencia_${instanceId}">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label>Conta</label>
                                            <input type="text" class="form-control" id="cand_conta_corrente_${instanceId}">
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label>Tipo Conta</label>
                                            <select class="form-control" id="cand_tipo_conta_${instanceId}">
                                                <option value="Corrente">Corrente</option>
                                                <option value="Poupanca">Poupança</option>
                                                <option value="Salario">Salário</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-4">
                                            <label>Tipo Chave Pix</label>
                                            <select class="form-control" id="cand_tipo_pix_${instanceId}">
                                                <option value="">Selecione...</option>
                                                <option value="CPF_CNPJ">CPF/CNPJ</option>
                                                <option value="Email">E-mail</option>
                                                <option value="Celular">Celular</option>
                                                <option value="Aleatoria">Chave Aleatória</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-8">
                                            <label>Chave Pix</label>
                                            <input type="text" class="form-control" id="cand_chave_pix_${instanceId}" placeholder="Informe sua chave pix">
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right mt-15">
                                    <button type="button" class="btn btn-info " data-next-tab="#tab_emergencia_${instanceId}">
                                        Próxima Aba
                                        <i class="flaticon flaticon-arrow-right">
                                        </i>
                                    </button>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="tab_emergencia_${instanceId}">
                                <div class="row">
                                    <div class="form-group col-md-5">
                                        <label>Nome do Contato</label>
                                        <input type="text" class="form-control" id="cand_emergencia_nome_${instanceId}" maxlength="120">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label>Grau de Parentesco</label>
                                        <select class="form-control" id="cand_emergencia_parentesco_${instanceId}">
                                            <option value="">Selecione...</option>
                                            <option value="1">1 - CÔNJUGE</option>
                                            <option value="2">2 - FILHO(A)</option>
                                            <option value="3">3 - PAI</option>
                                            <option value="4">4 - MÃE</option>
                                            <option value="5">5 - IRMÃO(A)</option>
                                            <option value="6">6 - AMIGO(A)</option>
                                            <option value="7">7 - OUTROS</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3">
                                        <label>Telefone</label>
                                        <input type="text" class="form-control" id="cand_emergencia_telefone_${instanceId}" placeholder="(00) 00000-0000">
                                    </div>
                                </div>
                                <div class="text-right">
                                    <button type="button" class="btn btn-info " data-next-tab="#tab_outros_docs_${instanceId}">
                                        Próxima Aba
                                        <i class="flaticon flaticon-arrow-right">
                                        </i>
                                    </button>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="tab_outros_docs_${instanceId}">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <i class="fa-solid fa-id-card">
                                        </i>
                                        Carteira Nacional de Habilitação (CNH)
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="form-group col-md-3">
                                                <label>Possui CNH?</label>
                                                <select class="form-control" id="cand_cnh_possuo_${instanceId}">
                                                    <option value="Nao">Não</option>
                                                    <option value="Sim">Sim</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div id="div_campos_cnh_${instanceId}" style="display:none;">
                                            <div class="row">
                                                <div class="form-group col-md-3">
                                                    <label>Tipo de CNH</label>
                                                    <select class="form-control" id="cand_cnh_tipo_${instanceId}">
                                                        <option value="">Selecione...</option>
                                                        <option value="A">A</option>
                                                        <option value="AB">AB</option>
                                                        <option value="AC">AC</option>
                                                        <option value="ACC">ACC</option>
                                                        <option value="AD">AD</option>
                                                        <option value="AE">AE</option>
                                                        <option value="B">B</option>
                                                        <option value="C">C</option>
                                                        <option value="D">D</option>
                                                        <option value="E">E</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Número da CNH</label>
                                                        <input type="text" class="form-control" id="cand_cnh_numero_${instanceId}" name="cand_cnh_numero" placeholder="Nº Registro">
                                                    </div>
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>UF da CNH</label>
                                                    <select class="form-control" id="cand_cnh_uf_${instanceId}">
                                                        <option value="">Selecione...</option>
                                                        <option value="AC">AC</option>
                                                        <option value="AL">AL</option>
                                                        <option value="AP">AP</option>
                                                        <option value="AM">AM</option>
                                                        <option value="BA">BA</option>
                                                        <option value="CE">CE</option>
                                                        <option value="DF">DF</option>
                                                        <option value="ES">ES</option>
                                                        <option value="GO">GO</option>
                                                        <option value="MA">MA</option>
                                                        <option value="MT">MT</option>
                                                        <option value="MS">MS</option>
                                                        <option value="MG">MG</option>
                                                        <option value="PA">PA</option>
                                                        <option value="PB">PB</option>
                                                        <option value="PR">PR</option>
                                                        <option value="PE">PE</option>
                                                        <option value="PI">PI</option>
                                                        <option value="RJ">RJ</option>
                                                        <option value="RN">RN</option>
                                                        <option value="RS">RS</option>
                                                        <option value="RO">RO</option>
                                                        <option value="RR">RR</option>
                                                        <option value="SC">SC</option>
                                                        <option value="SP">SP</option>
                                                        <option value="SE">SE</option>
                                                        <option value="TO">TO</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-3">
                                                    <label>Órgão Emissor</label>
                                                    <input type="text" class="form-control" id="cand_cnh_orgao_${instanceId}" placeholder="Ex: DETRAN">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>Data Vencimento</label>
                                                    <input type="text" class="form-control fluig-calendar" id="cand_cnh_data_venc_${instanceId}" placeholder="DD/MM/AAAA">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>Data 1ª Habilitação</label>
                                                    <input type="text" class="form-control fluig-calendar" id="cand_cnh_data_primeira_${instanceId}" placeholder="DD/MM/AAAA">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>Data Emissão</label>
                                                    <input type="text" class="form-control fluig-calendar" id="cand_cnh_data_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default" id="painel_reservista_${instanceId}" style="display:none;">
                                    <div class="panel-heading">
                                        <i class="flaticon flaticon-assignment-ind">
                                        </i>
                                        Certificado de Reservista
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="form-group col-md-3">
                                                <label>Possui Reservista?</label>
                                                <select class="form-control" id="cand_reservista_possuo_${instanceId}">
                                                    <option value="Nao">Não</option>
                                                    <option value="Sim">Sim</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div id="div_campos_reservista_${instanceId}" style="display:none;">
                                            <div class="row">
                                                <div class="form-group col-md-3">
                                                    <label>Nº do Certificado</label>
                                                    <input type="text" class="form-control" id="cand_reservista_numero_${instanceId}">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>Categoria Carteira</label>
                                                    <input type="text" class="form-control" id="cand_reservista_categoria_${instanceId}">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>Circunscrição Militar</label>
                                                    <input type="text" class="form-control" id="cand_reservista_circunscricao_${instanceId}">
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label>Região Militar</label>
                                                    <input type="text" class="form-control" id="cand_reservista_regiao_${instanceId}">
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-4">
                                                    <label>Órgão de Expedição</label>
                                                    <input type="text" class="form-control" id="cand_reservista_orgao_${instanceId}">
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label>Data de Emissão</label>
                                                    <input type="text" class="form-control fluig-calendar" id="cand_reservista_data_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label>Situação Militar</label>
                                                    <select class="form-control" id="cand_reservista_situacao_${instanceId}">
                                                        <option value="">Selecione...</option>
                                                        <option value="Nao se aplica">Não se aplica</option>
                                                        <option value="Alistado">Alistado</option>
                                                        <option value="Dispensado">Dispensado</option>
                                                        <option value="Reservista">Reservista</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <#-- <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <i class="flaticon flaticon-briefcase">
                                        </i>
                                        PIS / Primeiro Emprego
                                    </div>
                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="form-group col-md-5">
                                                <label>É Primeiro Emprego (Não possui PIS)?</label>
                                                <select class="form-control" id="cand_primeiro_emprego_${instanceId}">
                                                    <option value="">Selecione...</option>
                                                    <option value="Sim">Sim</option>
                                                    <option value="Nao">Não</option>
                                                </select>
                                            </div>
                                            <div class="col-md-3 form-group" id="div_cand_pis_${instanceId}">
                                                <label>Número do PIS</label>
                                                <input type="text" class="form-control" id="cand_pis_${instanceId}" mask="000.00000.00-0">
                                            </div>
                                            <div class="col-md-4 form-group" id="div_cand_ano_primeiro_emprego_${instanceId}">
                                                <label>Ano do Primeiro Emprego</label>
                                                <input type="text" class="form-control" id="cand_ano_primeiro_emprego_${instanceId}" maxlength="4" placeholder="Ex: 2018">
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            -->
                            <#-- <div class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="flaticon flaticon-book">
                                    </i>
                                    Carteira de Trabalho (CTPS)
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="form-group col-md-4">
                                            <label>Carteira Física ou Digital?</label>
                                            <select class="form-control" id="cand_tipo_ctps_${instanceId}">
                                                <option value="">Selecione...</option>
                                                <option value="Digital">Digital</option>
                                                <option value="Fisica">Física</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label>Número da Carteira</label>
                                            <input type="text" class="form-control" id="cand_ctps_numero_${instanceId}">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label>Série</label>
                                            <input type="text" class="form-control" id="cand_ctps_serie_${instanceId}">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-4">
                                            <label>Data de Emissão</label>
                                            <input type="text" class="form-control fluig-calendar" id="cand_ctps_data_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label>UF da CTPS</label>
                                            <select class="form-control" id="cand_ctps_uf_${instanceId}">
                                                <option value="">Selecione...</option>
                                                <option value="AC">AC</option>
                                                <option value="AL">AL</option>
                                                <option value="AP">AP</option>
                                                <option value="AM">AM</option>
                                                <option value="BA">BA</option>
                                                <option value="CE">CE</option>
                                                <option value="DF">DF</option>
                                                <option value="ES">ES</option>
                                                <option value="GO">GO</option>
                                                <option value="MA">MA</option>
                                                <option value="MT">MT</option>
                                                <option value="MS">MS</option>
                                                <option value="MG">MG</option>
                                                <option value="PA">PA</option>
                                                <option value="PB">PB</option>
                                                <option value="PR">PR</option>
                                                <option value="PE">PE</option>
                                                <option value="PI">PI</option>
                                                <option value="RJ">RJ</option>
                                                <option value="RN">RN</option>
                                                <option value="RS">RS</option>
                                                <option value="RO">RO</option>
                                                <option value="RR">RR</option>
                                                <option value="SC">SC</option>
                                                <option value="SP">SP</option>
                                                <option value="SE">SE</option>
                                                <option value="TO">TO</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        -->
                        <#-- <div class="panel panel-default">
                            <div class="panel-heading">
                                <i class="fa-solid fa-heart-pulse">
                                </i>
                                Cartão SUS
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label>Número do Cartão SUS</label>
                                        <input type="text" class="form-control" id="cand_cartao_sus_${instanceId}">
                                    </div>
                                </div>
                            </div>
                    </div>
                    -->
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa-solid fa-id-badge">
                            </i>
                            Registro Profissional (Opcional)
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <label>Órgão de Classe</label>
                                    <input type="text" class="form-control" id="cand_reg_prof_orgao_${instanceId}" placeholder="Ex: CREA, OAB, CRM">
                                </div>
                                <div class="form-group col-md-3">
                                    <label>UF do Órgão</label>
                                    <select class="form-control" id="cand_reg_prof_uf_${instanceId}">
                                        <option value="">Selecione...</option>
                                        <option value="AC">AC</option>
                                        <option value="AL">AL</option>
                                        <option value="AP">AP</option>
                                        <option value="AM">AM</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MT">MT</option>
                                        <option value="MS">MS</option>
                                        <option value="MG">MG</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PR">PR</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RS">RS</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="SC">SC</option>
                                        <option value="SP">SP</option>
                                        <option value="SE">SE</option>
                                        <option value="TO">TO</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-3">
                                    <label>Número de Registro</label>
                                    <input type="text" class="form-control" id="cand_reg_prof_num_${instanceId}">
                                </div>
                                <div class="form-group col-md-3">
                                    <label>Data de Emissão</label>
                                    <input type="text" class="form-control fluig-calendar" id="cand_reg_prof_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa-solid fa-passport">
                            </i>
                            Passaporte (Opcional)
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="form-group col-md-4">
                                    <label>Número do Passaporte</label>
                                    <input type="text" class="form-control" id="cand_passaporte_num_${instanceId}">
                                </div>
                                <div class="form-group col-md-4">
                                    <label>Data de Emissão</label>
                                    <input type="text" class="form-control fluig-calendar" id="cand_passaporte_emissao_${instanceId}" placeholder="DD/MM/AAAA">
                                </div>
                                <div class="form-group col-md-4">
                                    <label>Data de Validade</label>
                                    <input type="text" class="form-control fluig-calendar" id="cand_passaporte_validade_${instanceId}" placeholder="DD/MM/AAAA">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <button type="button" class="btn btn-info " data-next-tab="#tab_foto_${instanceId}">
                            Próxima Aba
                            <i class="flaticon flaticon-arrow-right">
                            </i>
                        </button>
                    </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="tab_foto_${instanceId}">
                <div class="foto-step-shell">
                    <div class="foto-step-hero text-center">
                        <div class="foto-step-title">Adicione uma foto para continuar</div>
                        <div class="foto-step-subtitle">Escolha entre tirar agora ou enviar uma imagem salva no seu dispositivo.</div>
                        <div id="preview_foto_${instanceId}" class="foto-preview-circle">
                        </div>
                    </div>
                    <div class="foto-step-actions">
                        <button type="button" class="foto-action-card" id="btn_abrir_camera_${instanceId}">
                            <span class="foto-action-icon">
                                <i class="flaticon flaticon-camera">
                                </i>
                            </span>
                            <span class="foto-action-title">Tirar foto</span>
                            <span class="foto-action-desc">Abra a câmera e capture a imagem na hora.</span>
                        </button>
                        <button type="button" class="foto-action-card" data-trigger-upload="file_cand_foto_${instanceId}">
                            <span class="foto-action-icon">
                                <i class="flaticon flaticon-upload">
                                </i>
                            </span>
                            <span class="foto-action-title">Enviar foto</span>
                            <span class="foto-action-desc">Selecione uma foto já salva no aparelho.</span>
                        </button>
                    </div>
                    <div class="foto-step-footer text-center">
                        <span class="text-muted">A foto fica registrada no cadastro assim que for confirmada.</span>
                    </div>
                    <input type="file" id="file_cand_foto_${instanceId}" class="hidden" data-process-file="cand_foto" accept="image/*">
                    <input type="hidden" id="cand_foto_base64_${instanceId}">
                    <input type="hidden" id="cand_foto_nome_${instanceId}">
                    <div id="customModalCamera_${instanceId}" class="custom-modal-overlay foto-camera-overlay" style="display:none;">
                        <div class="custom-modal-dialog foto-camera-dialog">
                            <div class="custom-modal-content foto-camera-content">
                                <div class="custom-modal-header">
                                    <h4 class="custom-modal-title" id="modalFotoTitle_${instanceId}">Tirar foto</h4>
                                    <button type="button" class="btn-close-custom" id="btnCloseCameraModal_${instanceId}">
                                        <i class="flaticon flaticon-close icon-sm">
                                        </i>
                                    </button>
                                </div>
                                <div class="foto-camera-body">
                                    <div class="foto-camera-stage foto-camera-live-stage" id="foto_camera_stage_live_${instanceId}">
                                        <div class="foto-camera-preview-wrap">
                                            <video id="video_camera_${instanceId}" autoplay playsinline muted>
                                            </video>
                                            <canvas id="canvas_camera_${instanceId}" style="display:none;">
                                            </canvas>
                                        </div>
                                        <div class="foto-camera-hint">Posicione o rosto no centro e toque em Capturar foto.</div>
                                    </div>
                                    <div class="foto-camera-stage foto-camera-preview-stage" id="foto_camera_stage_preview_${instanceId}" style="display:none;">
                                        <div class="foto-camera-preview-wrap foto-camera-preview-final">
                                            <img id="foto_capturada_preview_${instanceId}" alt="Pré-visualização da foto capturada">
                                        </div>
                                        <div class="foto-camera-hint">Confira a imagem antes de confirmar o envio.</div>
                                    </div>
                                </div>
                                <div class="foto-camera-footer">
                                    <div class="foto-camera-actions foto-camera-live-actions" id="foto_camera_actions_live_${instanceId}">
                                        <button type="button" class="btn btn-accept" id="btn_capturar_foto_${instanceId}">
                                            <i class="flaticon flaticon-check-circle icon-sm">
                                            </i>
                                            Capturar foto
                                        </button>
                                        <button type="button" class="btn btn-decline" id="btn_fechar_camera_${instanceId}">Cancelar</button>
                                    </div>
                                    <div class="foto-camera-actions foto-camera-preview-actions" id="foto_camera_actions_preview_${instanceId}" style="display:none;">
                                        <button type="button" class="btn btn-default" id="btn_tirar_novamente_${instanceId}">
                                            <i class="flaticon flaticon-refresh icon-sm">
                                            </i>
                                            Tirar novamente
                                        </button>
                                        <button type="button" class="btn btn-success" id="btn_confirmar_foto_${instanceId}">
                                            <i class="flaticon flaticon-check-circle-on icon-sm">
                                            </i>
                                            Confirmar foto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="customModalDocumento_${instanceId}" class="custom-modal-overlay" style="display:none;">
        <div class="custom-modal-dialog">
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h4 class="custom-modal-title" id="modalDocTitle_${instanceId}">Documento</h4>
                    <button type="button" class="btn-close-custom" id="btnCloseCustomModal_${instanceId}">
                        <i class="flaticon flaticon-close icon-sm">
                        </i>
                    </button>
                </div>
                <div class="custom-modal-body" style="display:flex; flex-direction:row; align-items:stretch; overflow:hidden; background:#fff; min-height:78vh;">
                    <div class="viewer-sidebar" style="width:320px; min-width:320px; background:#273444; color:#e5eef7; display:flex; flex-direction:column;">
                        <div class="sidebar-header" style="padding:16px 18px; border-bottom:1px solid rgba(255,255,255,0.08); background:#1f2b39; font-weight:700;">
                            <i class="flaticon flaticon-folder-open icon-sm">
                            </i>
                            Contexto do Arquivo
                        </div>
                        <div class="sidebar-content" style="padding:18px;">
                            <div class="sidebar-section-title" style="text-transform:uppercase; font-size:11px; letter-spacing:1px; color:#9fb2c7; margin:0 0 10px 0; font-weight:700;">Candidato</div>
                            <div class="candidato-info-block" style="margin-bottom:18px; background:rgba(255,255,255,0.06); border-radius:8px; padding:14px;">
                                <p>
                                    <strong>Nome:</strong>
                                    <span id="modalDocNome_${instanceId}">...</span>
                                </p>
                                <p>
                                    <strong>CPF:</strong>
                                    <span id="modalDocCpf_${instanceId}">...</span>
                                </p>
                            </div>
                            <div class="sidebar-section-title" style="text-transform:uppercase; font-size:11px; letter-spacing:1px; color:#9fb2c7; margin:0 0 10px 0; font-weight:700;">Documento</div>
                            <div class="candidato-info-block" style="margin-bottom:18px; background:rgba(255,255,255,0.06); border-radius:8px; padding:14px;">
                                <p>
                                    <strong>Tipo:</strong>
                                    <span id="modalDocTipo_${instanceId}">...</span>
                                </p>
                                <p>
                                    <strong>Status:</strong>
                                    <span id="modalDocStatus_${instanceId}">...</span>
                                </p>
                            </div>
                            <div class="sidebar-section-title" style="text-transform:uppercase; font-size:11px; letter-spacing:1px; color:#9fb2c7; margin:0 0 10px 0; font-weight:700;">Orientação</div>
                            <div class="candidato-info-block" style="margin-bottom:18px; background:rgba(255,255,255,0.06); border-radius:8px; padding:14px;">
                                <p>Use o painel principal para ler o PDF. Feche e reabra quantas vezes precisar.</p>
                            </div>
                        </div>
                    </div>
                    <div class="viewer-main-content" style="flex:1; min-width:0; background:#fff;">
                        <div class="document-paper-shadow" style="height:100%; background:#fff;">
                            <iframe id="iframe_visualizador_primeiro_link_${instanceId}" src="" style="width:100%; height:100%; min-height:78vh; border:0;">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div data-step-content="3" class="step-content">
        <h3 class="section-title">
            <i class="fa-solid fa-school" style="color: rgb(177, 151, 252);">
            </i>
            Formação Acadêmica
        </h3>
        <div class="alert alert-warning" style="background-color: #fcf8e3; color: #8a6d3b;">
            <i class="flaticon flaticon-info icon-md" style="margin-right: 8px; color: #8a6d3b; vertical-align: middle;">
            </i>
            Informe sua escolaridade principal.
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="cand_grau_instrucao_${instanceId}">Grau de Instrução</label>
                <select class="form-control" id="cand_grau_instrucao_${instanceId}" name="cand_grau_instrucao">
                    <option value="">Selecione...</option>
                    <option value="Analfabeto">Analfabeto</option>
                    <option value="Até o 5º ano incompleto do ensino fundamental">Até o 5º ano incompleto do ensino fundamental</option>
                    <option value="5º ano completo do ensino fundamental">5º ano completo do ensino fundamental</option>
                    <option value="Do 6º ao 9º ano do ensino fundamental">Do 6º ao 9º ano do ensino fundamental</option>
                    <option value="Ensino fundamental completo">Ensino fundamental completo</option>
                    <option value="Ensino médio incompleto">Ensino médio incompleto</option>
                    <option value="Ensino médio completo">Ensino médio completo</option>
                    <option value="Educação superior incompleto">Educação superior incompleto</option>
                    <option value="Educação superior completo">Educação superior completo</option>
                    <option value="Pós Grad. incompleto">Pós Grad. incompleto</option>
                    <option value="Pós Grad. completo">Pós Grad. completo</option>
                    <option value="Mestrado incompleto">Mestrado incompleto</option>
                    <option value="Mestrado completo">Mestrado completo</option>
                    <option value="Doutorado incompleto">Doutorado incompleto</option>
                    <option value="Doutorado completo">Doutorado completo</option>
                    <option value="Pós Dout. incompleto">Pós Dout. incompleto</option>
                    <option value="Pós Dout. completo">Pós Dout. completo</option>
                </select>
            </div>
            <div class="form-group col-md-6">
                <label for="cand_ano_conclusao_${instanceId}">Ano de Conclusão</label>
                <input type="number" class="form-control" id="cand_ano_conclusao_${instanceId}" placeholder="Ex: 2020">
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="cand_curso_${instanceId}">Nome do Curso</label>
                <input type="text" class="form-control" id="cand_curso_${instanceId}" placeholder="Ex: Administração, Direito...">
            </div>
            <div class="form-group col-md-6">
                <label for="cand_curso_periodo_${instanceId}">Período do Curso</label>
                <input type="text" class="form-control" id="cand_curso_periodo_${instanceId}" placeholder="1° Período, 2° Período...">
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="cand_instituicao_${instanceId}">Instituição de Ensino</label>
                <input type="text" class="form-control" id="cand_instituicao_${instanceId}" placeholder="Ex: USP, UNIP...">
            </div>
            <div class="form-group col-md-6">
                <label for="cand_instituicao_cnpj_${instanceId}">CNPJ da Instituição</label>
                <input type="text" class="form-control" id="cand_instituicao_cnpj_${instanceId}" placeholder="00.000.000/0000-00">
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="cand_coordenador_nome_${instanceId}">Nome do Coordenador (Curso/Estágio)</label>
                <input type="text" class="form-control" id="cand_coordenador_nome_${instanceId}">
            </div>
            <div class="form-group col-md-6">
                <label for="cand_coordenador_nacionalidade_${instanceId}">Nacionalidade do Coordenador</label>
                <input type="text" class="form-control" id="cand_coordenador_nacionalidade_${instanceId}" value="Brasileira">
            </div>
        </div>
    </div>
    <div data-step-content="4" class="step-content">
        <h3 class="section-title">
            <i class="fa-solid fa-users" style="color: rgb(177, 151, 252);">
            </i>
            Filiação
        </h3>
        <div class="alert alert-info">
            <i class="flaticon flaticon-info">
            </i>
            Informe os dados de sua filiação.
            <strong>O cadastro da Mãe é obrigatório</strong>
            para o eSocial, mesmo que não seja dependente financeiro.
        </div>
        <div id="container_filiacao_${instanceId}">
            <div class="dependente-card" data-uuid="mae_fixa" data-filiacao="mae">
                <div class="panel panel-default" style="border-left: 4px solid #d9534f;">
                    <div class="panel-heading" style="background-color: #fcf8e3;">
                        <div class="row">
                            <div class="col-xs-12">
                                <h4 class="panel-title" style="margin-top: 5px; color: #8a6d3b;">
                                    <i class="flaticon flaticon-person icon-sm">
                                    </i>
                                    Dados da Mãe (Obrigatório)
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label>Grau de Parentesco</label>
                                <select class="form-control dep-parentesco" style="pointer-events: none; background-color: #eee;" tabindex="-1" readonly>
                                    <option value="Mae" selected>Mãe</option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label>CPF</label>
                                <input type="text" class="form-control dep-cpf" mask="000.000.000-00">
                            </div>
                            <div class="form-group col-md-6">
                                <label>Nome Completo</label>
                                <input type="text" class="form-control dep-nome" placeholder="Nome da mãe">
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label>Sexo</label>
                                <select class="form-control dep-sexo" style="pointer-events: none; background-color: #eee;" tabindex="-1" readonly>
                                    <option value="Feminino" selected>Feminino</option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label>Estado Civil</label>
                                <select class="form-control dep-est-civil">
                                    <option value="Solteiro">Solteira</option>
                                    <option value="Casado">Casada</option>
                                    <option value="Divorciado">Divorciada</option>
                                    <option value="Viuvo">Viúva</option>
                                    <option value="Uniao Estavel">União Estável</option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label>Data Nascimento</label>
                                <input type="text" class="form-control fluig-calendar dep-nasc" placeholder="DD/MM/AAAA">
                            </div>
                            <div class="form-group col-md-3">
                                <label>RG</label>
                                <input type="text" class="form-control dep-rg" placeholder="Número do RG">
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label>Possui Deficiência?</label>
                                <select class="form-control dep-possui-deficiencia">
                                    <option value="">Selecione...</option>
                                    <option value="Nao">Não</option>
                                    <option value="Sim">Sim</option>
                                </select>
                            </div>
                            <div class="form-group col-md-8 div-dep-tipo-deficiencia" style="display:none;">
                                <label>Tipo de Deficiência</label>
                                <select class="form-control dep-tipo-deficiencia">
                                    <option value="">Selecione...</option>
                                    <option value="Fisica">Física</option>
                                    <option value="Auditiva">Auditiva</option>
                                    <option value="Fala">Fala</option>
                                    <option value="Visual">Visual</option>
                                    <option value="Mental">Mental</option>
                                    <option value="Intelectual">Intelectual</option>
                                    <option value="Reabilitado">Reabilitado</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <#-- <div class="form-group col-md-4">
                                <label>Cartão SUS</label>
                                <input type="text" class="form-control dep-sus" placeholder="Nº Cartão SUS">
                        </div>
                        -->
                        <div class="form-group col-md-12">
                            <label>Observação</label>
                            <input type="text" class="form-control dep-obs" placeholder="Alguma observação?">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 form-group div-inc-irrf" style="display: none;">
                            <label>Incide IRRF?</label>
                            <select class="form-control dep-irrf">
                                <option value="Nao">Não</option>
                                <option value="Sim">Sim</option>
                            </select>
                        </div>
                        <div class="col-md-3 form-group div-inc-pensao" style="display: none;">
                            <label>Incide Pensão?</label>
                            <select class="form-control dep-pensao">
                                <option value="Nao">Não</option>
                                <option value="Sim">Sim</option>
                            </select>
                        </div>
                        <#-- <div class="col-md-3 form-group div-salario-familia" style="display: none;">
                            <label>Salário Família?</label>
                            <select class="form-control dep-sf">
                                <option value="Nao">Não</option>
                                <option value="Sim">Sim</option>
                            </select>
                    </div>
                    -->
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<div data-step-content="5" class="step-content">
    <h3 class="section-title">
        <i class="fa-solid fa-person-breastfeeding" style="color: rgb(177, 151, 252);">
        </i>
        Dependentes
    </h3>
    <div id="campos_filiacao_legacy_${instanceId}" style="display:none;">
        <input type="hidden" id="cand_mae_nome_${instanceId}">
        <input type="hidden" id="cand_mae_sexo_${instanceId}" value="Feminino">
        <input type="hidden" id="cand_mae_est_civil_${instanceId}">
        <input type="hidden" id="cand_mae_cpf_${instanceId}">
        <input type="hidden" id="cand_mae_nasc_${instanceId}">
        <input type="hidden" id="cand_pai_nome_${instanceId}">
        <input type="hidden" id="cand_pai_sexo_${instanceId}" value="Masculino">
        <input type="hidden" id="cand_pai_est_civil_${instanceId}">
        <input type="hidden" id="cand_pai_cpf_${instanceId}">
        <input type="hidden" id="cand_pai_nasc_${instanceId}">
    </div>
    <div class="alert alert-info">
        <i class="flaticon flaticon-info">
        </i>
        Adicione apenas os dependentes que deseja cadastrar. Mãe e pai são informados na etapa de Filiação.
    </div>
    <div id="container_dependentes_${instanceId}"></div>
    <div class="row" style="margin-top: 20px;">
        <div class="col-md-12 text-center">
            <button type="button" class="btn btn-info " data-add-dependente>
                <i class="flaticon flaticon-plus"></i>
                Adicionar Dependente
            </button>
        </div>
    </div>
</div>
<div data-step-content="6" class="step-content">
    <h3 class="section-title">
        <i class="fa-solid fa-address-card" style="color: rgb(177, 151, 252);">
        </i>
        Benefícios
    </h3>
    <div class="panel panel-default">
        <div class="panel-heading font-bold">
            <i class="flaticon flaticon-bus icon-sm">
            </i>
            Vale Transporte
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="form-group col-md-12">
                    <label>Em relação ao vale transporte, escolha uma das opções:</label>
                    <select class="form-control" id="cand_vt_opcao_${instanceId}">
                        <option value="">Selecione...</option>
                        <option value="Opto">Opto pela Utilização do Vale Transporte</option>
                        <option value="Nao opto">Não opto pela Utilização do Vale Transporte</option>
                    </select>
                </div>
            </div>
            <div id="div_vt_detalhes_${instanceId}" style="display: none; background-color: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px; margin-top: 10px;">
                <h5 class="text-info" style="margin-top:0;">
                    <i class="flaticon flaticon-map-marker icon-sm">
                    </i>
                    Detalhes das Rotas de Transporte
                </h5>
                <div id="container_rotas_vt_${instanceId}">
                </div>
                <div class="row mt-10">
                    <div class="col-md-12 text-center">
                        <button type="button" class="btn btn-default " data-add-rota>
                            <i class="flaticon flaticon-plus">
                            </i>
                            Adicionar Rota (Ida / Volta)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading font-bold">
            <i class="flaticon flaticon-medical icon-sm">
            </i>
            Plano de Saúde
        </div>
        <div class="panel-body">
            <div class="alert alert-info" style="font-size: 12px;">
                <strong>Informações sobre o Plano de Saúde:</strong>
                <br>
                &bull; Plano disponível para colaboradores CLT.
                <br>
                &bull; Mensalidade do titular paga integralmente pela empresa.
                <br>
                &bull; Coparticipação (consultas e exames) por conta do colaborador.
                <br>
                &bull; Inclusão de dependentes é opcional, com custo integral (mensalidade + coparticipação) do colaborador.
                <br>
                &bull; Inclusões realizadas em até 30 dias corridos da admissão têm isenção de carência. Após esse prazo, aplicam-se as carências contratuais.
            </div>
            <div class="row">
                <div class="form-group col-md-12">
                    <label>DESEJA ADERIR AO PLANO DE SAÚDE?</label>
                    <select class="form-control" id="cand_ps_opcao_${instanceId}">
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-12" id="div_ps_planos_${instanceId}" style="display:none;">
                    <label for="cand_ps_tipo_plano_${instanceId}">
                        Selecione o Plano de Saúde
                        <span class="text-danger">*</span>
                    </label>
                    <select class="form-control" id="cand_ps_tipo_plano_${instanceId}">
                        <option value="">Selecione o plano...</option>
                    </select>
                </div>
            </div>
            <div id="div_ps_dependentes_opcao_${instanceId}" style="display:none;">
                <div class="form-group">
                    <label>DESEJA INCLUIR DEPENDENTES NO PLANO DE SAÚDE?</label>
                    <select class="form-control" id="cand_ps_dependentes_opcao_${instanceId}">
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                </div>
            </div>
            <div id="div_ps_detalhes_${instanceId}" style="display:none; background-color: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 15px;">
                <div class="row">
                    <div class="col-md-12">
                        <label>Selecione os dependentes para inclusão:</label>
                        <div id="container_dependentes_plano_${instanceId}" style="margin-bottom: 10px;">
                        </div>
                        <div id="msg_elegibilidade_plano_${instanceId}" class="alert alert-warning" style="display: none; margin-bottom: 0; font-size: 12px;">
                            <i class="flaticon flaticon-info icon-sm">
                            </i>
                            Apenas
                            <strong>Cônjuges</strong>
                            e
                            <strong>Filhos</strong>
                            podem ser incluídos no plano de saúde. Não identificamos dependentes com este parentesco cadastrados na etapa de "Dependentes".
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" id="div_ps_custos_${instanceId}" style="display:none;">
                <div class="col-md-12">
                    <div class="well well-sm" style="font-size: 12px; color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; margin-bottom: 0;">
                        <strong>Atenção aos custos mensais:</strong>
                        <br>
                        <span id="texto_custo_plano_${instanceId}">Calculando valor para sua filial...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading font-bold">
            <i class="flaticon flaticon-face-smile icon-sm">
            </i>
            Plano Odontológico
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="form-group col-md-12">
                    <label>Deseja aderir ao Plano Odontológico?</label>
                    <select class="form-control" id="cand_po_opcao_${instanceId}">
                        <option value="" selected>Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Nao">Não</option>
                    </select>
                </div>
            </div>
            <div class="row" id="div_po_planos_${instanceId}" style="display:none;">
                <div class="form-group col-md-12">
                    <label>Qual Plano deseja aderir?</label>
                    <select class="form-control" id="cand_po_tipo_plano_${instanceId}">
                        <option value="">Selecione o plano...</option>
                    </select>
                </div>
            </div>
            <div id="div_po_dependentes_${instanceId}" style="display:none; background-color: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px; margin-top: 15px;">
                <div class="row">
                    <div class="col-md-12">
                        <label>Selecione os dependentes para inclusão no Plano Odontológico:</label>
                        <div id="container_dependentes_odonto_${instanceId}" style="margin-bottom: 10px;">
                        </div>
                        <div id="msg_elegibilidade_odonto_${instanceId}" class="alert alert-warning" style="display: none; margin-bottom: 0; font-size: 12px;">
                            <i class="fa-solid fa-circle-info">
                            </i>
                            <strong>Atenção:</strong>
                            Não identificamos dependentes elegíveis cadastrados na etapa de "Dependentes".
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div data-step-content="7" class="step-content">
    <h3 class="section-title">
        <i class="fa-solid fa-file-lines" style="color: rgb(177, 151, 252);">
        </i>
        Envio de Documentos
    </h3>
    <div style="background-color: #d9edf7; border: 1px solid #bce8f1; color: #31708f; padding: 15px; border-radius: 4px; display: flex; align-items: center; margin-bottom: 25px;">
        <i class="flaticon flaticon-info icon-md" style="margin-right: 15px; font-size: 24px;">
        </i>
        <span>
            <strong>Instrução:</strong>
            Clique nos quadros abaixo para anexar ou fotografar cada documento solicitado.
        </span>
    </div>
    <div class="row" id="container_documentos_fixos_${instanceId}">
    </div>
    <hr style="border-top: 1px dashed #ccc; margin: 10px 0 20px 0;">
    <div class="row" id="container_documentos_dinamicos_${instanceId}">
        <div class="col-md-12 text-center" style="padding: 40px;">
            <i class="flaticon flaticon-refresh is-spinning icon-xl">
            </i>
            <br>
            <span class="text-muted">Carregando lista de documentos...</span>
        </div>
    </div>
    <div id="hidden_inputs_container_${instanceId}">
    </div>
</div>
<div data-step-content="8" class="step-content">
    <h3 class="section-title">
        <i class="fa-solid fa-flag" style="color: rgb(177, 151, 252);">
        </i>
        Revisão e Envio
    </h3>
    <div id="resumo_container_${instanceId}" style="margin-bottom: 30px;">
        <p class="text-center text-muted">
            <i class="flaticon flaticon-refresh is-spinning">
            </i>
            Carregando resumo...
        </p>
    </div>
    <div class="panel panel-info" style="border-color: #bce8f1;">
        <div class="panel-heading" style="background-color: #d9edf7; color: #31708f; border-color: #bce8f1;">
            <i class="flaticon flaticon-medical">
            </i>
            <strong>Agendamento do Exame Admissional</strong>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="form-group col-md-4">
                    <label class="small text-muted">Data e Hora</label>
                    <input type="text" class="form-control" id="cand_exame_datahora_${instanceId}" readonly style="background-color: #fff; font-weight:bold;">
                </div>
                <div class="form-group col-md-8">
                    <label class="small text-muted">Clínica</label>
                    <input type="text" class="form-control" id="cand_exame_clinica_${instanceId}" readonly style="background-color: #fff; font-weight:bold;">
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-12">
                    <label class="small text-muted">Endereço</label>
                    <input type="text" class="form-control" id="cand_exame_endereco_${instanceId}" readonly style="background-color: #fff; font-weight:bold;">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <label class="small text-muted">Orientação</label>
                    <div class="well well-sm" style="margin-bottom: 0;">
                        <span id="text_exame_orientacao_${instanceId}" class="text-info">Consulte as orientações no e-mail recebido.</span>
                        <textarea id="cand_exame_orientacao_${instanceId}" style="display:none;">
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="alert alert-success text-center" style="margin-top: 30px; padding: 20px;">
        <i class="flaticon flaticon-check-circle icon-xl">
        </i>
        <br>
        <h4 style="margin-top: 10px;">Tudo Pronto!</h4>
        <p>
            Confira os dados acima. Se estiver tudo correto, clique em
            <strong>"Finalizar e Enviar"</strong>
            abaixo.
        </p>
    </div>
</div>
</form>
<hr>
<div class="row widget-nav-footer"
    style="display: flex; align-items: center; padding-bottom: 20px;">
    <div class="col-xs-4 widget-nav-back">
        <button type="button"
            class="btn btn-default"
            data-nav-back
            disabled>
            <i class="flaticon flaticon-arrow-left"></i>
            Voltar
        </button>
    </div>
    <div class="col-xs-4 text-center widget-nav-brand">
        <img src="/Pagina_Candidato_IRHO/resources/images/LOGO-COMPLETA.png"
            alt="Logo Interhativa"
            style="max-height: 45px; max-width: 100%;">
    </div>
    <div class="col-xs-4 text-right widget-nav-next">
        <button type="button"
            class="btn btn-primary"
            data-nav-next>
            Próximo
            <i class="flaticon flaticon-arrow-right"></i>
        </button>
        <button type="button"
            class="btn btn-accept"
            data-finish
            style="display: none;">
            Finalizar e Enviar
            <i class="flaticon flaticon-send"></i>
        </button>
    </div>
</div>
</div>
</div>
<style>
/*
                                                                                                                                                                                                                                                                                                                                                                                                                        * Linhas dinâmicas dos dependentes.
                                                                                                                                                                                                                                                                                                                                                                                                                        * Os campos visíveis dividem automaticamente o espaço disponível.
                                                                                                                                                                                                                                                                                                                                                                                                                        */
.dependente-card .linha-condicional-dependente,
.dependente-card .linha-incidencias-dependente {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: end;
    column-gap: 30px;
    row-gap: 15px;
    margin-left: -15px;
    margin-right: -15px;
}

.dependente-card .linha-condicional-dependente {
    margin-bottom: 15px;
}

.dependente-card .linha-incidencias-dependente {
    margin-bottom: 0;
}

.dependente-card .linha-condicional-dependente>.form-group,
.dependente-card .linha-incidencias-dependente>.form-group {
    float: none;
    width: auto;
    min-width: 0;
    margin-bottom: 0;
    padding-left: 15px;
    padding-right: 15px;
}

@media (max-width: 767px) {

    .dependente-card .linha-condicional-dependente,
    .dependente-card .linha-incidencias-dependente {
        grid-template-columns: 1fr;
    }
}
</style>
<script type="text/template" class="template-dependente">
    <div class="dependente-card" style="display:none;" data-uuid="{{UUID}}">
                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="panel panel-default" style="border-left: 4px solid #1eaad9;">
                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="panel-heading" style="background-color: #f9f9f9;">
                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="col-xs-8">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <h4 class="panel-title" style="margin-top: 5px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                <i class="flaticon flaticon-person icon-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                Novo Dependente
                                                                                                                                                                                                                                                                                                                                                                                                                                            </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="col-xs-4 text-right">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <button type="button" class="btn btn-decline btn-xs btn-remove-dep" onclick="AdmissaoWidget.instance().removerDependente(this)">
                                                                                                                                                                                                                                                                                                                                                                                                                                                <i class="flaticon flaticon-trash icon-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                Remover
                                                                                                                                                                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="panel-body">
                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>Grau de Parentesco</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <select class="form-control dep-parentesco">
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="">Selecione...</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Filho">Filho(a)</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Conjuge">Cônjuge</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Companheiro">Companheiro(a)</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Enteado">Enteado(a)</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Irmao">Irmão/Irmã</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Outros">Outros</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                            </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>CPF</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="text" class="form-control dep-cpf" mask="000.000.000-00">
                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="form-group col-md-6">
                                                                                                                                                                                                                                                                                                                                                                                                                                                <label>Nome Completo</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <input type="text" class="form-control dep-nome" placeholder="Nome do dependente">
                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Sexo</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <select class="form-control dep-sexo">
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="">Selecione...</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Feminino">Feminino</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Masculino">Masculino</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Estado Civil</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <select class="form-control dep-est-civil">
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Solteiro">Solteiro</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Casado">Casado</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Divorciado">Divorciado</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Viuvo">Viúvo</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Uniao Estavel">União Estável</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Data Nascimento</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input type="text" class="form-control fluig-calendar dep-nasc" placeholder="DD/MM/AAAA">
                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <label>RG</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input type="text" class="form-control dep-rg" placeholder="Número do RG">
                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="panel panel-default div-dados-mae-filho"
                                                                                                                                                                                                                                                                                                                                                                                                                                                        style="display:none; margin-top:15px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="panel-heading">
                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h5 class="panel-title">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                <i class="flaticon flaticon-person icon-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                Dados da Mãe do Dependente
                                                                                                                                                                                                                                                                                                                                                                                                                                                            </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="panel-body">
                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-6">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Nome Completo da Mãe</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input type="text"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        class="form-control dep-mae-nome"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        placeholder="Nome completo da mãe">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <label>CPF da Mãe</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input type="text"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            class="form-control dep-mae-cpf"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            mask="000.000.000-00">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group col-md-3">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>RG da Mãe</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="text"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                class="form-control dep-mae-rg"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                placeholder="Número do RG">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="form-group col-md-6">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <label>Data de Nascimento da Mãe</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <input type="text"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    class="form-control fluig-calendar dep-mae-nasc"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    placeholder="DD/MM/AAAA">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-6">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Estado Civil da Mãe</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <select class="form-control dep-mae-est-civil">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Solteiro">Solteira</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Casado">Casada</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Divorciado">Divorciada</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Viuvo">Viúva</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Uniao Estavel">União Estável</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Separado">Separada</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Desquitado">Desquitada</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Outros">Outros</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="linha-condicional-dependente">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>Possui Deficiência?</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <select class="form-control dep-possui-deficiencia">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="">Selecione...</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Nao">Não</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Sim">Sim</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group div-dep-tipo-deficiencia"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            style="display:none;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>Tipo de Deficiência</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <select class="form-control dep-tipo-deficiencia">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="">Selecione...</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Fisica">Física</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Auditiva">Auditiva</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Fala">Fala</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Visual">Visual</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Mental">Mental</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Intelectual">Intelectual</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <option value="Reabilitado">Reabilitado</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group div-data-uniao-dependente"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            style="display:none;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>Data de União/Casamento</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="text"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                class="form-control fluig-calendar dep-data-uniao"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                placeholder="DD/MM/AAAA">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <#-- <div class="form-group col-md-4">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>Cartão SUS</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="text" class="form-control dep-sus" placeholder="Nº Cartão SUS">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            -->
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="form-group col-md-12">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <label>Observação</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <input type="text" class="form-control dep-obs" placeholder="Alguma observação sobre este dependente?">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="linha-incidencias-dependente">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group div-inc-irrf"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    style="display:none;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Incide IRRF?</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <select class="form-control dep-irrf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Nao">Não</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Sim">Sim</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group div-inc-pensao"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    style="display:none;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>Incide Pensão?</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <select class="form-control dep-pensao">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Nao">Não</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Sim">Sim</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="row div-docs-dependente" style="display: none; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-md-12">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <h4 class="text-info mb-15">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <i class="flaticon flaticon-file-check icon-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Documentos do Dependente
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </h4>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-md-4 doc-conjuge doc-cpf" style="display:none; margin-bottom: 25px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="upload-box text-center" style="padding: 15px; border: 2px dashed #bce8f1; border-radius: 6px; background-color: #f9fdfd; cursor: pointer; transition: all 0.3s ease;" onclick="$(this).siblings('input[type=\'file\']
').trigger('click');">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <i class="flaticon flaticon-person icon-xl text-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h5 class="font-bold mt-10">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            CPF
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="label label-warning" style="font-size:0.6em">OCR</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p class="text-muted small dep-file-status" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Anexar CPF</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <button type="button" class="btn btn-default btn-xs dep-file-btn">Anexar</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input type="file" class="hidden dep-file-cpf" accept="image/*,application/pdf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input type="hidden" class="dep-base64-cpf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="col-md-4 doc-conjuge doc-rg-frente" style="display:none; margin-bottom: 25px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="upload-box text-center" style="padding: 15px; border: 2px dashed #bce8f1; border-radius: 6px; background-color: #f9fdfd; cursor: pointer; transition: all 0.3s ease;" onclick="$(this).siblings('input[type=\'file\']
').trigger('click');">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <i class="flaticon flaticon-assignment-ind icon-xl text-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <h5 class="font-bold mt-10">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    RG Frente
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="label label-warning" style="font-size:0.6em">OCR</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <p class="text-muted small dep-file-status" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Anexar RG Frente</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <button type="button" class="btn btn-default btn-xs dep-file-btn">Anexar</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="file" class="hidden dep-file-rgf" accept="image/*,application/pdf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <input type="hidden" class="dep-base64-rgf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-md-4 doc-conjuge doc-rg-verso" style="display:none; margin-bottom: 25px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="upload-box text-center" style="padding: 15px; border: 2px dashed #bce8f1; border-radius: 6px; background-color: #f9fdfd; cursor: pointer; transition: all 0.3s ease;" onclick="$(this).siblings('input[type=\'file\']
').trigger('click');">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <i class="flaticon flaticon-assignment-ind icon-xl text-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h5 class="font-bold mt-10">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            RG Verso
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="label label-warning" style="font-size:0.6em">OCR</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p class="text-muted small dep-file-status" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Anexar RG Verso</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <button type="button" class="btn btn-default btn-xs dep-file-btn">Anexar</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input type="file" class="hidden dep-file-rgv" accept="image/*,application/pdf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input type="hidden" class="dep-base64-rgv">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="col-md-4 doc-filho doc-cert-nasc" style="display:none; margin-bottom: 25px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="upload-box text-center" style="padding: 15px; border: 2px dashed #bce8f1; border-radius: 6px; background-color: #f9fdfd; cursor: pointer; transition: all 0.3s ease;" onclick="$(this).siblings('input[type=\'file\']
').trigger('click');">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <i class="flaticon flaticon-file-check icon-xl text-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <h5 class="font-bold mt-10">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Cert. Nascimento
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="label label-warning" style="font-size:0.6em">OCR</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <p class="text-muted small dep-file-status" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Anexar Certidão</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <button type="button" class="btn btn-default btn-xs dep-file-btn">Anexar</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="file" class="hidden dep-file-certnasc" accept="image/*,application/pdf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <input type="hidden" class="dep-base64-certnasc">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-md-4 doc-filho doc-vacina" style="display:none; margin-bottom: 25px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="upload-box text-center" style="padding: 15px; border: 2px dashed #bce8f1; border-radius: 6px; background-color: #f9fdfd; cursor: pointer; transition: all 0.3s ease;" onclick="$(this).siblings('input[type=\'file\']
').trigger('click');">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <i class="flaticon flaticon-local-hospital icon-xl text-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <h5 class="font-bold mt-10">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Cartão Vacina
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="label label-warning" style="font-size:0.6em">OCR</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </h5>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <p class="text-muted small dep-file-status" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Opcional (até 5 anos)</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <button type="button" class="btn btn-default btn-xs dep-file-btn">Anexar</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input type="file" class="hidden dep-file-vacina" accept="image/*,application/pdf">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input type="hidden" class="dep-base64-vacina">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </script>
<script type="text/template" class="template-rota">
    <div class="vt-card" style="background-color: #fff; border: 1px solid #ddd; border-left: 4px solid #f0ad4e; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="row" style="margin-bottom: 10px; border-bottom: 1px solid #f4f4f4; padding-bottom: 5px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-xs-6">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <strong class="text-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <i class="flaticon flaticon-bus icon-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Rota
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="rota-num">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </strong>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-xs-6 text-right">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <button type="button" class="btn btn-decline btn-xs btn-remove-rota" onclick="AdmissaoWidget.instance().removerRotaVT(this)">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <i class="flaticon flaticon-trash icon-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </i>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Remover Rota
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-5">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Trajeto
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="text-danger">*</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <select class="form-control vt-destino">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="">Selecione...</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Ida">Ida (Casa -> Empresa)</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <option value="Volta">Volta (Empresa -> Casa)</option>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </select>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="form-group col-md-7">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Tipo de Transporte
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="text-danger">*</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input type="text" class="form-control vt-tipo" placeholder="Ex: Ônibus, Metrô">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="row">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="form-group col-md-5">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Empresa
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <span class="text-danger">*</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input type="text" class="form-control vt-empresa" placeholder="Viação/Empresa">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="form-group col-md-5">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Linha
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="text-danger">*</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input type="text" class="form-control vt-linha" placeholder="Nome ou Número">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="form-group col-md-2">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Tarifa
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="text-danger">*</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <input type="text" class="form-control vt-valor" placeholder="0,00">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </script>
</div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js">
</script>
<script type="text/javascript" src="/Pagina_Candidato_IRHO/resources/js/oauth-1.0a.js">
</script>
<script type="text/javascript" src="/Pagina_Candidato_IRHO/resources/js/obrigatoriedade.js">
</script>
<script type="text/javascript" src="/Pagina_Candidato_IRHO/resources/js/Pagina_Candidato_IRHO.js?v=${instanceId}">
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js">
</script>