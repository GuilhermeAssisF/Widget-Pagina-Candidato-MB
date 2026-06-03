var AdmissaoWidget = SuperWidget.extend({
    passoAtual: 1,
    totalPassos: 8,
    configDocs: [],
    abasVisitadas: {},
    usuarioIntegracao: "",
    idOrigem: null,
    documentIdFicha: null,
    saveTimeout: null,
    jornadaAdmissao: "",
    nomeFilial: "",
    idPdfProposta: null,
    idPdfLGPD: null,
    previewDocsPrimeiroLink: {
        proposta: "",
        lgpd: "",
        manifesto: ""
    },
    cameraFotoStream: null,
    fotoCapturadaDataUrl: "",
    fotoCapturadaBase64: "",
    fotoCapturadaNome: "",
    manifestoPdfDataUri: "",
    currentPrimeiroLinkBlobUrl: "",

    // =========================================================================
    // 1. INICIALIZAÇÃO E CARGA
    // =========================================================================

    init: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        this.mostrarLoading(true);

        // ==========================================================
        // SOLUÇÃO OAUTH: Atraso de milissegundos para gerar assinaturas únicas
        // ==========================================================
        setTimeout(function () { that.carregarTiposSanguineos(); }, 50);
        setTimeout(function () { that.carregarNacionalidades(); }, 150);

        var urlParams = new URLSearchParams(window.location.search);
        this.idOrigem = urlParams.get('id_origem');

        // INJEÇÃO DE CAMPOS OCULTOS PARA ESTADO DAS ASSINATURAS (F5)
        if ($("#tae_proposta_iddoc_" + this.instanceId).length === 0) {
            var inps = '<input type="hidden" id="tae_proposta_iddoc_' + this.instanceId + '">' +
                '<input type="hidden" id="tae_proposta_status_' + this.instanceId + '">' +
                '<input type="hidden" id="tae_proposta_link_' + this.instanceId + '">' +
                '<input type="hidden" id="tae_lgpd_iddoc_' + this.instanceId + '">' +
                '<input type="hidden" id="tae_lgpd_status_' + this.instanceId + '">' +
                '<input type="hidden" id="tae_lgpd_link_' + this.instanceId + '">';
            $("#AdmissaoWidget_" + this.instanceId).find("#form_main_container").append(inps);
        }

        this.iniciarListeners($div);
        this.atualizarBotoes();

        // Fluxo Inicial
        if (this.idOrigem) {
            $("#idSolicitacaoRH_" + this.instanceId).val(this.idOrigem);
            console.log("[DEBUG] ID da Solicitação encontrado na URL: " + this.idOrigem);

            // Atraso na chamada principal para garantir token exclusivo
            setTimeout(function () {
                that.verificarAtividadeEContinuar(that.idOrigem);
            }, 300);
        } else {
            console.log("[DEBUG] Nenhum ID de solicitação encontrado. Carregando modo vazio.");
            setTimeout(function () {
                that.carregarConfiguracaoDocs();
            }, 300);
        }

        // Ouvinte do botão único do Primeiro Link
        $div.on('click', '#btn_gerar_assinar_primeiro_link_' + this.instanceId, function () {
            that.gerarEAssinarPrimeiroLink($(this));
        });

        $div.on('click', '.primeiro-link-card', function () {
            that.abrirDocumentoPrimeiroLink($(this).attr('data-doc-type'));
        });

        $div.on('click', '#btnCloseCustomModal_' + this.instanceId, function () {
            that.fecharVisualizadorPrimeiroLink();
        });

        window.preencherTudo = function () {
            that.preencherMockConsole();
        };

        window.ignorarValidacao = false; // Começa sempre bloqueado por padrão
        window.removerObrigatoriedade = function () {
            window.ignorarValidacao = true;
            console.log("MODO DEUS ATIVADO: Todas as regras de obrigatoriedade foram desligadas!");
            FLUIGC.toast({ title: 'Atenção', message: 'Validações desativadas. Você pode avançar sem preencher nada.', type: 'warning' });
        };


    },

    // =========================================================================
    // MOCK DE TESTES VIA CONSOLE (preencherTudo())
    // =========================================================================
    preencherMockConsole: function () {
        var id = this.instanceId;
        var $d = $("#AdmissaoWidget_" + id);

        console.log(" Iniciando preenchimento automático (Mock)...");

        // Função auxiliar que preenche o valor e avisa o HTML que o campo mudou
        function setVal(campo, valor) {
            var $campo = $d.find("#" + campo + "_" + id);
            if ($campo.length) {
                $campo.val(valor).trigger('change');
            }
        }

        // 1. Dados Pessoais e RG
        setVal("cand_cpf", "123.456.789-00");
        setVal("cand_nascimento", "1995-05-15");
        setVal("cand_estado_natal", "SP");
        setVal("cand_naturalidade", "São Paulo");
        setVal("cand_estado_civil", "Solteiro");
        setVal("cand_sexo", "Masculino");
        setVal("cand_nacionalidade", "Brasileira");
        setVal("cand_raca", "Branca");
        setVal("cand_rg", "12.345.678-9");
        setVal("cand_rg_uf", "SP");
        setVal("cand_rg_orgao", "SSP");
        setVal("cand_rg_data_emissao", "2010-01-10");

        // 2. Título Eleitor
        setVal("cand_titulo_digital", "Não");
        setVal("cand_titulo_eleitor", "123456789012");
        setVal("cand_titulo_zona", "123");
        setVal("cand_titulo_secao", "456");
        setVal("cand_titulo_uf", "SP");
        setVal("cand_titulo_data_emissao", "2012-05-05");

        // 3. Endereço
        setVal("cand_cep", "01001-000");
        setVal("cand_tipo_logradouro", "Rua");
        setVal("cand_endereco", "Direita");
        setVal("cand_numero", "100");
        setVal("cand_tipo_bairro", "Centro");
        setVal("cand_bairro", "Centro");
        setVal("cand_uf", "SP");
        setVal("cand_cidade", "São Paulo");

        // 4. Contratação, Bancários e Emergência
        setVal("cand_possui_deficiencia", "Não");
        setVal("cand_banco", "001 - BANCO DO BRASIL S.A.");
        setVal("cand_agencia", "1234");
        setVal("cand_conta_corrente", "12345-6");
        setVal("cand_tipo_conta", "Corrente");
        setVal("cand_tipo_pix", "CPF");
        setVal("cand_chave_pix", "123.456.789-00");
        setVal("cand_emergencia_nome", "Sra. Teste Emergência");
        setVal("cand_emergencia_parentesco", "Mãe");
        setVal("cand_emergencia_telefone", "(11) 99999-9999");

        // 5. Formação e Filiação
        setVal("cand_grau_instrucao", "Ensino Superior Completo");
        setVal("cand_ano_conclusao", "2018");
        setVal("cand_mae_nome", "Maria Silva");
        setVal("cand_mae_sexo", "Feminino");
        setVal("cand_mae_est_civil", "Casada");
        setVal("cand_pai_nome", "João Silva");
        setVal("cand_pai_sexo", "Masculino");
        setVal("cand_pai_est_civil", "Casado");

        // 6. Documentos Extras (Desviando das validações opcionais)
        setVal("cand_primeiro_emprego", "Sim"); // Diz que é primeiro emprego para pular o PIS
        setVal("cand_tipo_ctps", "Digital");
        setVal("cand_ctps_numero", "1234567");
        setVal("cand_ctps_serie", "1234");
        setVal("cand_ctps_uf", "SP");
        setVal("cand_cnh_possuo", "Não");
        setVal("cand_reservista_possuo", "Não");

        // 7. Benefícios
        setVal("cand_vt_opcao", "Não Opto");
        setVal("cand_ps_opcao", "Não Opto");

        console.log(" Mock aplicado com sucesso! Todos os campos obrigatórios foram preenchidos.");
        FLUIGC.toast({ title: 'Mock Carregado', message: 'Dados de teste preenchidos com sucesso via Console.', type: 'success' });
    },

    // =========================================================================
    // TRAVA DE SEGURANÇA (VERIFICA ATIVIDADE ATUAL)
    // =========================================================================
    verificarAtividadeEContinuar: function (idSolicitacao) {
        var that = this;
        console.log("[DEBUG] Iniciando consulta no dataset 'processHistory' via Proxy para a solicitação: " + idSolicitacao);

        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        // MUDANÇA 1: Usar processHistory em vez de processTask
        var payloadObj = {
            name: "processHistory",
            constraints: [
                { _field: "processHistoryPK.processInstanceId", _initialValue: idSolicitacao, _finalValue: idSolicitacao, _type: 1, _likeSearch: false },
                { _field: "active", _initialValue: true, _finalValue: true, _type: 1, _likeSearch: false }
            ]
        };

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                console.log("[DEBUG] Retorno Bruto do Proxy na verificação de atividade:", resProxy);

                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var resData = JSON.parse(rProxy.response);
                        console.log("[DEBUG] Dados processados do processHistory:", resData);

                        if (resData.records && resData.records.length > 0) {
                            // MUDANÇA 2: O campo correto que guarda a atividade atual é o stateSequence
                            var historicoAtivo = resData.records[0];
                            var atividadeAtual = historicoAtivo.stateSequence;

                            console.log("[DEBUG] --> Atividade atual identificada: " + atividadeAtual);

                            if (atividadeAtual == 122 || atividadeAtual == "122") {
                                console.log("[DEBUG] --> SUCESSO: A solicitação está na atividade 122. Liberando carregamento dos dados.");
                                // Tudo certo! Chama a função original que carrega o formulário
                                that.carregarDadosIniciais(idSolicitacao);
                            } else {
                                console.warn("[DEBUG] --> BLOQUEIO: A solicitação NÃO está na 122. Está na: " + atividadeAtual);
                                that.bloquearAcesso("Esta solicitação não está mais disponível para preenchimento. Ela já foi enviada ao RH ou encontra-se em outra etapa.");
                            }
                        } else {
                            console.warn("[DEBUG] --> Nenhum histórico ativo encontrado. (Pode estar finalizada)");
                            that.bloquearAcesso("Solicitação não encontrada ou processo já encerrado.");
                        }
                    } else {
                        console.error("[DEBUG] Erro interno do Proxy:", rProxy.message);
                        that.bloquearAcesso("Erro ao validar o status da solicitação.");
                    }
                } else {
                    console.error("[DEBUG] A API não retornou conteúdos válidos.");
                    that.bloquearAcesso("Erro de comunicação com o servidor.");
                }
            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Falha na requisição AJAX da verificação:", error);
                that.bloquearAcesso("Falha ao verificar segurança da solicitação.");
            }
        });
    },

    bloquearAcesso: function (mensagem) {
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        // Remove o loading
        this.mostrarLoading(false);

        // Oculta completamente a barra de progresso, o formulário e os botões de avançar
        $div.find("#sidebar_etapas_card, form, hr, .row:last").hide();

        // Injeta o alerta de bloqueio na tela
        $div.find("#form_main_container").append(
            '<div class="alert alert-warning text-center" style="padding:40px; margin-top:20px; border-color: #faebcc; background-color: #fcf8e3;">' +
            '<h3 style="color:#8a6d3b;"><i class="flaticon flaticon-lock icon-md"></i> Acesso Bloqueado</h3>' +
            '<p style="color:#8a6d3b; font-size:16px; margin-top: 15px;">' + mensagem + '</p>' +
            '</div>'
        );
    },

    carregarDadosIniciais: function (id) {
        var that = this;
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        var payloadObj = {
            name: "ds_dados_publicos_candidato",
            constraints: [{ _field: "idProcessoFluig", _initialValue: id, _finalValue: id, _type: 1, _likeSearch: false }]
        };

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var resData = JSON.parse(rProxy.response);
                        if (resData.records && resData.records.length > 0) {
                            var r = resData.records[0];

                            if (r.documentid) that.documentIdFicha = r.documentid;

                            // 1. Blindagem contra Maiúsculas/Minúsculas
                            var rLower = {};
                            for (var keyOriginal in r) {
                                if (r.hasOwnProperty(keyOriginal)) {
                                    rLower[keyOriginal.toLowerCase()] = r[keyOriginal];
                                }
                            }

                            // 2. FUNÇÃO INFALÍVEL: Aceita múltiplos campos (Fallbacks)
                            // VERSÃO BLINDADA DA FUNÇÃO GETVAL
                            function getVal(keys) {
                                if (typeof keys === "string") keys = [keys];
                                for (var i = 0; i < keys.length; i++) {
                                    var key = keys[i].toLowerCase();
                                    var val = rLower[key];
                                    // Verifica se o valor existe e não é apenas espaço em branco
                                    if (val !== undefined && val !== null && String(val).trim() !== "") {
                                        return String(val).trim();
                                    }
                                }
                                return "";
                            }

                            // =========================================================
                            // CARREGAMENTO DOS PDFS DE ASSINATURA NO IFRAME (LENDO DO COFRE JSON)
                            // =========================================================

                            // 1. Puxamos o Cofre do Primeiro Link
                            var jsonPrimeiroLink = getVal("json_ids_primeiro_link") || "{}";
                            var cofrePrimeiro = {};
                            try { cofrePrimeiro = JSON.parse(jsonPrimeiroLink); } catch (e) { }

                            // 2. Extraímos os IDs de dentro do Cofre (ou do campo direto como fallback)
                            that.idPdfProposta = (cofrePrimeiro["kit_proposta_admissao"] && cofrePrimeiro["kit_proposta_admissao"].id) ? cofrePrimeiro["kit_proposta_admissao"].id : getVal("id_pdf_kit_proposta_admissao");

                            that.idPdfLGPD = (cofrePrimeiro["kit_lgpd_admissao"] && cofrePrimeiro["kit_lgpd_admissao"].id) ? cofrePrimeiro["kit_lgpd_admissao"].id : getVal("id_pdf_kit_lgpd_admissao");

                            // ========================================================
                            // RECUPERA OS ESTADOS DO COFRE PARA OS HIDDEN INPUTS (F5 SEGURO)
                            // ========================================================
                            if (cofrePrimeiro["kit_proposta_admissao"]) {
                                $("#tae_proposta_iddoc_" + that.instanceId).val(cofrePrimeiro["kit_proposta_admissao"].idDocTae || "");
                                $("#tae_proposta_status_" + that.instanceId).val(cofrePrimeiro["kit_proposta_admissao"].status || "");
                                $("#tae_proposta_link_" + that.instanceId).val(cofrePrimeiro["kit_proposta_admissao"].linkAssinaturaTae || "");
                            }
                            if (cofrePrimeiro["kit_lgpd_admissao"]) {
                                $("#tae_lgpd_iddoc_" + that.instanceId).val(cofrePrimeiro["kit_lgpd_admissao"].idDocTae || "");
                                $("#tae_lgpd_status_" + that.instanceId).val(cofrePrimeiro["kit_lgpd_admissao"].status || "");
                                $("#tae_lgpd_link_" + that.instanceId).val(cofrePrimeiro["kit_lgpd_admissao"].linkAssinaturaTae || "");
                            }
                            // ========================================================

                            console.log("[DEBUG] Documentos recuperados do Cofre JSON:", {
                                Proposta: that.idPdfProposta,
                                LGPD: that.idPdfLGPD
                            });

                            // CARTA PROPOSTA
                            if (that.idPdfProposta) {
                                that.obterBase64GED(that.idPdfProposta, function (base64) {
                                    var srcPdf = "data:application/pdf;base64," + base64;
                                    that.previewDocsPrimeiroLink.proposta = base64;
                                    that.atualizarCartoesPrimeiroLink();
                                    $("#pdf_viewer_proposta_" + that.instanceId).attr("src", srcPdf).show();
                                    $("#msg_carregando_proposta_" + that.instanceId).hide();
                                });
                            } else {
                                $("#msg_carregando_proposta_" + that.instanceId).html("<p class='text-danger'>Documento da proposta não encontrado.</p>");
                            }

                            if (!that.idPdfLGPD) {
                                $("#msg_carregando_lgpd_" + that.instanceId).html("<p class='text-danger'>Termo LGPD não encontrado.</p>");
                            } else {
                                that.obterBase64GED(that.idPdfLGPD, function (base64) {
                                    var srcPdfLgpd = "data:application/pdf;base64," + base64;
                                    that.previewDocsPrimeiroLink.lgpd = base64;
                                    that.atualizarCartoesPrimeiroLink();
                                    $("#pdf_viewer_lgpd_" + that.instanceId).attr("src", srcPdfLgpd).show();
                                    $("#msg_carregando_lgpd_" + that.instanceId).hide();
                                });
                            }
                            if (that.idPdfProposta && that.idPdfLGPD) {
                                $("#btn_gerar_assinar_primeiro_link_" + that.instanceId).fadeIn();
                            }
                            // =========================================================

                            that.jornadaAdmissao = getVal("cpJornadaAdmissao");
                            that.nomeFilial = getVal(["FUN_NOMECOMERCIAL_FILIAL", "IDDESC_EMPRESAFILIAL"]) || "";

                            var isCLT = (that.jornadaAdmissao === "CLT");

                            if (isCLT) {
                                // Oculta os campos detalhados de formação para CLT
                                $("#cand_curso_" + that.instanceId).closest("div").hide();
                                $("#cand_ano_conclusao_" + that.instanceId).closest("div").hide();
                                $("#cand_instituicao_" + that.instanceId).closest("div").hide();
                                $("#cand_cnpj_instituicao_" + that.instanceId).closest("div").hide();
                                $("#cand_coordenador_" + that.instanceId).closest("div").hide();
                                $("#cand_nacionalidade_coordenador_" + that.instanceId).closest("div").hide();

                                // Ajusta a largura do campo Grau de Instrução para ocupar a linha toda (opcional)
                                $("#cand_grau_instrucao_" + that.instanceId).closest("div").removeClass("col-md-3").addClass("col-md-12");
                            } else {
                                // Garante que fiquem visíveis para Estágio
                                $("#cand_curso_" + that.instanceId).closest("div").show();
                                $("#cand_ano_conclusao_" + that.instanceId).closest("div").show();
                                $("#cand_instituicao_" + that.instanceId).closest("div").show();
                                $("#cand_cnpj_instituicao_" + that.instanceId).closest("div").show();
                                $("#cand_coordenador_" + that.instanceId).closest("div").show();
                                $("#cand_nacionalidade_coordenador_" + that.instanceId).closest("div").show();

                                // Retorna a largura original
                                $("#cand_grau_instrucao_" + that.instanceId).closest("div").removeClass("col-md-12").addClass("col-md-3");
                            }

                            // Captura Dados Clínicos (Backup Rascunho)
                            var dadosExame = {
                                data: getVal("cpDataHoraExame"),
                                clinica: getVal("cpNomeClinica"),
                                endereco: getVal("cpEnderecoClinica"),
                                orientacao: getVal("cpOrientacao")
                            };

                            var passoSalvoFluig = getVal("cppassoatualcandidato");
                            that.passoSalvoFluig = passoSalvoFluig;

                            setTimeout(function () {
                                if (!passoSalvoFluig) {
                                    that.restaurarRascunhoLocal();
                                }
                                that.aplicarRegrasVisuaisPorJornada();

                                var filialUpper = that.nomeFilial.toUpperCase();
                                var textoPlano = "Consulte o RH para saber os valores da mensalidade do plano para sua filial.";

                                if (filialUpper.indexOf("LAJINHA") > -1 || filialUpper.indexOf("BREJETUBA") > -1 || filialUpper.indexOf("PARAGUACU") > -1 || filialUpper.indexOf("PARAGUAÇU") > -1 || filialUpper.indexOf("CAMPINA VERDE") > -1) {
                                    textoPlano = "Valor mensal fixo de mensalidade de <strong>R$ 330,61</strong> por dependente.";
                                } else if (filialUpper.indexOf("SERVICOS LTDA") > -1 || filialUpper.indexOf("SERVIÇOS LTDA") > -1 || filialUpper.indexOf("BRASIL") > -1) {
                                    textoPlano = "Valor mensal fixo de mensalidade de <strong>R$ 394,58</strong> por dependente.";
                                }

                                $("#texto_custo_plano_" + that.instanceId).html(textoPlano);

                                // 3. MAPEAMENTO GERAL INVERTIDO (Widget -> Dataset)
                                var map = {
                                    "cand_nomeCompleto_": ["txtNomeColaborador", "txtNomeSocial", "cpNomeSolicitante"],
                                    "cand_email_": ["cpEmailCandidato", "txtEmail"],
                                    "cand_cpf_": ["cpfcnpjValue", "cpfcnpj"],
                                    "cand_celular_": ["txtCELULAR", "txtTELEFONE"],
                                    "cand_naturalidade_": ["txtNaturalidade"],
                                    "cand_nacionalidade_": ["NACIONALIDADE"],
                                    "cand_estado_natal_": ["ESTADO"],
                                    "cand_estado_civil_": ["txtEstadoCivil", "FUN_ESTADOCIV_DESC_AD"],
                                    "cand_raca_": ["CORRACA"],
                                    "cand_tipo_sanguineo_": ["TipoSanguineo"],
                                    "cand_rg_": ["TxtRg"],
                                    "cand_rg_uf_": ["UFCARTIDENTIDADE"],
                                    "cand_rg_orgao_": ["ORGAOCARTIDENTIDADE"],
                                    "cand_titulo_digital_": ["Titulo_Digital"],
                                    "cand_titulo_eleitor_": ["TITULOELEITOR"],
                                    "cand_titulo_zona_": ["ZONATITELEITOR"],
                                    "cand_titulo_secao_": ["SECAOTITELEITOR"],
                                    "cand_titulo_uf_": ["UFTITULO"],
                                    "cand_cep_": ["txtCEP"],
                                    "cand_pais_": ["txtPais"],
                                    "cand_tipo_logradouro_": ["txtNOMETIPORUA", "FUN_TPLOGRADOURO_DESC_AD"],
                                    "cand_endereco_": ["txtRUA"],
                                    "cand_numero_": ["txtNUMERO"],
                                    "cand_complemento_": ["txtCOMPLEMENTO"],
                                    "cand_tipo_bairro_": ["txtNOMETIPOBAIRRO"],
                                    "cand_bairro_": ["txtBAIRRO"],
                                    "cand_uf_": ["txtNOMECODETD"],
                                    "cand_cidade_": ["txtNOMEMUNICIPIO"],
                                    "cand_empresa_": ["FUN_EMPRESA_DESC_AD", "IDDESC_EMPRESAFILIAL"],
                                    "cand_data_admissao_": ["FUN_ADMISSAO"],
                                    "cand_secao_": ["FUN_SECAO_IDDESC_AD"],
                                    "cand_funcao_": ["FUN_IDDESCFUN"],
                                    "cand_salario_": ["FUN_VLRSALARIO"],
                                    "cand_turno_": ["FUN_IDDESCTURN"],
                                    "cand_possui_deficiencia_": ["txtPossuiDeficiencia"],
                                    "cand_tipo_deficiencia_": ["txtTipoDeficiencia"],
                                    "cand_tamanho_calcado_": ["txtTamanhoCalcado"],
                                    "cand_tamanho_camisa_": ["txtTamanhoCamisa"],
                                    "txtTamanhoCalca": ["cand_tamanho_calca_"],
                                    "cand_banco_": ["BancoPAgto"],
                                    "cand_agencia_": ["AgPagto"],
                                    "cand_conta_corrente_": ["ContPagto"],
                                    "cand_tipo_pix_": ["txtTipoChavePix"],
                                    "cand_chave_pix_": ["txtChavePix"],
                                    "cand_emergencia_nome_": ["txtNomeEmergencia"],
                                    "cand_emergencia_parentesco_": ["txtParentescoEmergencia"],
                                    "cand_emergencia_telefone_": ["txtTelefoneEmergencia"],
                                    "cand_cnh_possuo_": ["txtCNH_Possui"],
                                    "cand_cnh_tipo_": ["TIPOCARTHABILIT"],
                                    "cand_cnh_numero_": ["CARTMOTORISTA"],
                                    "cand_cnh_uf_": ["CodUFCNH", "UFCNH"],
                                    "cand_cnh_orgao_": ["ORGEMISSORCNH"],
                                    "cand_reservista_possuo_": ["txtReservista_Possui"],
                                    "cand_reservista_numero_": ["CERTIFRESERV"],
                                    "cand_reservista_situacao_": ["SitMilitar"],
                                    "cand_reservista_categoria_": ["Reservista_Categoria"],
                                    "cand_reservista_circunscricao_": ["Reservista_Circunscricao"],
                                    "cand_reservista_regiao_": ["Reservista_Regiao"],
                                    "cand_reservista_orgao_": ["Reservista_Orgao"],
                                    "cand_primeiro_emprego_": ["PIS_Primeiro_Emprego"],
                                    "cand_pis_": ["PIS"],
                                    "cand_ano_primeiro_emprego_": ["PIS_Ano_Primeiro_Emp"],
                                    "cand_tipo_ctps_": ["CTPS_Fisica_Digital"],
                                    "cand_ctps_numero_": ["txtCartTrab"],
                                    "cand_ctps_serie_": ["txtSerieCart"],
                                    "cand_ctps_uf_": ["UFCARTTRAB"],
                                    "cand_cartao_sus_": ["Cartao_SUS"],
                                    "cand_reg_prof_orgao_": ["Reg_Prof_Orgao"],
                                    "cand_reg_prof_uf_": ["Reg_Prof_UF"],
                                    "cand_reg_prof_num_": ["Reg_Prof_Num"],
                                    "cand_passaporte_num_": ["Passaporte_Num"],
                                    "cand_grau_instrucao_": ["txtEscolaridade", "FUN_CODGINRAI_DESC_AD"],
                                    "cand_ano_conclusao_": ["txtAnoConclusao"],
                                    "cand_curso_": ["txtNomeCurso"],
                                    "cand_instituicao_": ["txtInstituicaoEnsino"],
                                    "txtPeriodoCurso": ["cand_curso_periodo_"],
                                    "txtCnpjInstituicao": ["cand_instituicao_cnpj_"],
                                    "txtNomeCoordenador": ["cand_coordenador_nome_"],
                                    "txtNacionalidadeCoordenador": ["cand_coordenador_nacionalidade_"],
                                    "cand_mae_nome_": ["txtNomDepen2"],
                                    "cand_mae_est_civil_": ["txtEstCivilDepen2"],
                                    "cand_mae_cpf_": ["TxtCPFDep2"],
                                    "cand_pai_nome_": ["txtNomDepen3"],
                                    "cand_pai_est_civil_": ["txtEstCivilDepen3"],
                                    "cand_pai_cpf_": ["TxtCPFDep3"],
                                    "cand_vt_destino_": ["TxtVtDestino"],
                                    "cand_vt_tipo_": ["TxtVtTipo"],
                                    "cand_vt_num_linha_": ["TxtVtNumLinha"],
                                    "cand_vt_nome_linha_": ["TxtVtNomeLinha"],
                                    "cand_vt_empresa_": ["TxtVtEmpresa"],
                                    "cand_vt_valor_": ["TxtVtValorTarifa"],
                                    "cand_ps_opcao_": ["TxtIncPlanoSaudeOpcao"],
                                    "cand_ps_tipo_dep_": ["TxtIncPlanoSaudeTipoDep"],
                                    "cand_ps_qtd_conjuge_": ["TxtIncPlanoSaudeQtdConjuge"],
                                    "cand_ps_qtd_filhos_": ["TxtIncPlanoSaudeQtdFilhos"]
                                };

                                for (var widgetField in map) {
                                    var valText = getVal(map[widgetField]);
                                    if (valText) {
                                        var $field = $("#" + widgetField + that.instanceId);
                                        if ($field.length) {
                                            $field.val(valText);
                                            if ($field.is('select') && $field.find('option[value="' + valText + '"]').length === 0) {
                                                $field.attr('data-valor-pendente', valText);
                                            }
                                            $field.trigger("change").trigger("input");
                                        }
                                    }
                                }

                                // --- LÓGICA DE BLOQUEIO BANCÁRIO ---
                                var valBanco = getVal(["zoom_banco"]);
                                var valAgencia = getVal(["zoom_agencia"]);

                                var $inputBanco = $("#cand_banco_" + that.instanceId);
                                var $inputAgencia = $("#cand_agencia_" + that.instanceId);

                                if (valBanco) {
                                    $inputBanco.val(valBanco).prop("readonly", true).css({ "background-color": "#eee", "pointer-events": "none" });
                                    if (valAgencia) {
                                        $inputAgencia.val(valAgencia).prop("readonly", true).css({ "background-color": "#eee", "pointer-events": "none" });
                                    } else {
                                        $inputAgencia.prop("readonly", false).css({ "background-color": "#fff", "pointer-events": "auto" });
                                    }
                                } else {
                                    $inputBanco.prop("readonly", false).css({ "background-color": "#fff", "pointer-events": "auto" });
                                    $inputAgencia.prop("readonly", false).css({ "background-color": "#fff", "pointer-events": "auto" });
                                }

                                var sexoCodigo = getVal(["txtSexoValue", "txtSexo"]);
                                var sexoDescricao = (sexoCodigo === "M" || sexoCodigo.toLowerCase() === "masculino") ? "Masculino" : (sexoCodigo === "F" || sexoCodigo.toLowerCase() === "feminino") ? "Feminino" : "";
                                if (sexoDescricao) $("#cand_sexo_" + that.instanceId).val(sexoDescricao).trigger("change");

                                var estCivilBruto = getVal(["txtEstadoCivil", "FUN_ESTADOCIV_DESC_AD"]);
                                if (estCivilBruto) {
                                    var mapaEstCivil = { "solteiro": "Solteiro", "casado": "Casado", "divorciado": "Divorciado", "viuvo": "Viuvo", "viúvo": "Viuvo", "uniao estavel": "Uniao Estavel", "união estável": "Uniao Estavel", "separado": "Separado", "desquitado": "Desquitado" };
                                    var estCivilNorm = estCivilBruto.replace(/\(.*?\)/g, "").trim().toLowerCase();
                                    var estCivilMapped = mapaEstCivil[estCivilNorm] || null;
                                    var $selectEstCivil = $("#cand_estado_civil_" + that.instanceId);
                                    if (estCivilMapped) {
                                        $selectEstCivil.val(estCivilMapped).trigger("change");
                                    } else {
                                        $selectEstCivil.val(estCivilBruto).trigger("change");
                                    }
                                }

                                var vtBruto = getVal("ValeTransp");
                                if (vtBruto === "1") $("#cand_vt_opcao_" + that.instanceId).val("Opto").trigger("change");
                                else if (vtBruto === "2") $("#cand_vt_opcao_" + that.instanceId).val("Nao opto").trigger("change");

                                var $selectPS = $("#cand_ps_opcao_" + that.instanceId);
                                $selectPS.val("");

                                $("#div_ps_detalhes_" + that.instanceId).hide();
                                $("#div_ps_custos_" + that.instanceId).hide();

                                var camposData = [
                                    { de: ["dtDataNascColaboradorValue", "dtDataNascColaborador"], para: "cand_nascimento_" },
                                    { de: ["DTEMISSAOIDENT"], para: "cand_rg_data_emissao_" },
                                    { de: ["DTTITELEITOR"], para: "cand_titulo_data_emissao_" },
                                    { de: ["dtDataEmissaoCartTrab"], para: "cand_ctps_data_emissao_" },
                                    { de: ["DTVENCHABILIT"], para: "cand_cnh_data_venc_" },
                                    { de: ["DTEmPrimCNH"], para: "cand_cnh_data_primeira_" },
                                    { de: ["DTEMISSAOCNH"], para: "cand_cnh_data_emissao_" },
                                    { de: ["DtCERTIFRESERV"], para: "cand_reservista_data_emissao_" },
                                    { de: ["Reg_Prof_Emissao"], para: "cand_reg_prof_emissao_" },
                                    { de: ["Passaporte_Emissao"], para: "cand_passaporte_emissao_" },
                                    { de: ["Passaporte_Validade"], para: "cand_passaporte_validade_" }
                                ];

                                for (var i = 0; i < camposData.length; i++) {
                                    var valData = getVal(camposData[i].de);
                                    if (valData) {
                                        var strDataFront = valData;
                                        if (valData.indexOf("-") > -1) {
                                            var p = valData.split('-');
                                            strDataFront = p[2] + "/" + p[1] + "/" + p[0];
                                        }
                                        var $elData = $("#" + camposData[i].para + that.instanceId);
                                        if ($elData.length) {
                                            $elData.val(strDataFront).trigger("change");
                                        }
                                    }
                                }

                                if (getVal("txtPossuiDeficiencia") == "Sim") $("#div_tipo_deficiencia_" + that.instanceId).show();

                                var temCNH = getVal(["CARTMOTORISTA", "TIPOCARTHABILIT"]);
                                if (temCNH) {
                                    $("#cand_cnh_possuo_" + that.instanceId).val("Sim").trigger("change");
                                    $("#div_campos_cnh_" + that.instanceId).slideDown();
                                }

                                var temReservista = getVal("CERTIFRESERV");
                                if (temReservista) {
                                    $("#cand_reservista_possuo_" + that.instanceId).val("Sim").trigger("change");
                                    $("#div_campos_reservista_" + that.instanceId).slideDown();
                                }

                                var nomeMae = getVal("txtNomDepen2");
                                var nascMae = getVal("txtDtNascDepen2");
                                var nomePai = getVal("txtNomDepen3");
                                var nascPai = getVal("txtDtNascDepen3");

                                var isEstagio = (that.jornadaAdmissao === "Estagio" || that.jornadaAdmissao === "Estágio");

                                if (nomeMae && !isEstagio) {
                                    setTimeout(function () {
                                        var $cards = $("#container_dependentes_" + that.instanceId).find(".dependente-card");
                                        if ($cards.length > 0) {
                                            var $cardMae = $cards.first();
                                            $cardMae.find(".dep-parentesco").val("Mae").trigger("change");
                                            $cardMae.find(".dep-nome").val(nomeMae).prop("readonly", true);
                                            if (nascMae) {
                                                var pM = nascMae.split('/');
                                                $cardMae.find(".dep-nasc").val((pM.length == 3) ? pM[2] + "-" + pM[1] + "-" + pM[0] : nascMae).prop("readonly", true);
                                            }
                                            $cardMae.find(".dep-sexo").val("Feminino").prop("readonly", true).css({ "pointer-events": "none", "background-color": "#eee" });
                                        }
                                        if (nomePai) {
                                            that.adicionarDependente("Pai", false);
                                            var $cardPai = $("#container_dependentes_" + that.instanceId).find(".dependente-card").last();
                                            $cardPai.find(".dep-parentesco").val("Pai").trigger("change");
                                            $cardPai.find(".dep-nome").val(nomePai).prop("readonly", true);
                                            if (nascPai) {
                                                var pP = nascPai.split('/');
                                                $cardPai.find(".dep-nasc").val((pP.length == 3) ? pP[2] + "-" + pP[1] + "-" + pP[0] : nascPai).prop("readonly", true);
                                            }
                                        }
                                    }, 600);
                                }

                                if (dadosExame.data) $("#cand_exame_datahora_" + that.instanceId).val(dadosExame.data);
                                if (dadosExame.clinica) $("#cand_exame_clinica_" + that.instanceId).val(dadosExame.clinica);
                                if (dadosExame.endereco) $("#cand_exame_endereco_" + that.instanceId).val(dadosExame.endereco);
                                if (dadosExame.orientacao) {
                                    $("#cand_exame_orientacao_" + that.instanceId).val(dadosExame.orientacao);
                                    $("#text_exame_orientacao_" + that.instanceId).text(dadosExame.orientacao);
                                }

                                if (passoSalvoFluig) {
                                    var pInt = parseInt(passoSalvoFluig, 10);
                                    var statusPropSalvo = $("#tae_proposta_status_" + that.instanceId).val();
                                    var statusLgpdSalvo = $("#tae_lgpd_status_" + that.instanceId).val();

                                    if (!isNaN(pInt)) {
                                        if (pInt > 2) {
                                            pInt = pInt - 1;
                                        } else if (pInt === 2 && (statusPropSalvo !== "assinado" || statusLgpdSalvo !== "assinado")) {
                                            pInt = 1;
                                        }
                                    }

                                    if (!isNaN(pInt) && pInt > 1 && pInt <= that.totalPassos) {
                                        setTimeout(function () {
                                            that.irParaPasso(pInt);
                                            FLUIGC.toast({
                                                title: 'Bem-vindo(a) de volta!',
                                                message: 'Retomando seu preenchimento a partir do Passo ' + pInt + '.',
                                                type: 'info'
                                            });
                                        }, 500); // Delay suave para esperar a UI terminar de renderizar
                                    }
                                }
                            }, 200);
                        }
                    }
                }
            },
            complete: function () {
                that.carregarConfiguracaoDocs();
            }
        });
    },

    carregarConfiguracaoDocs: function () {
        var that = this;
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        console.log("======================================================");
        console.log("[WIDGET DOCS] 1. Iniciando busca via Proxy (Todos os Docs)...");
        console.log("[WIDGET DOCS] 2. Jornada do Candidato: '" + that.jornadaAdmissao + "'");

        // Pede todos os documentos ao Dataset original sem filtros
        var payloadObj = { name: "ds_lista_documentos_admissao", constraints: [] };

        // Empacota a requisição no Proxy para garantir a permissão na página pública
        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization }, // <-- ISSO EVITA O ERRO "POST NOT SUPPORTED"
            success: function (resProxy) {
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var resData = JSON.parse(rProxy.response);

                        if (resData.records && resData.records.length > 0) {
                            var valores = resData.records;
                            that.configDocs = [];

                            // ==========================================================
                            // FILTRO FRONT-END PELA JORNADA
                            // ==========================================================
                            var jCandidato = that.jornadaAdmissao ? that.jornadaAdmissao.toLowerCase().replace("é", "e").replace("á", "a").trim() : "";

                            for (var i = 0; i < valores.length; i++) {
                                var doc = valores[i];

                                if (doc.doc_campo_interno === "erro_fluig") continue;

                                var docJornada = doc.doc_jornada ? doc.doc_jornada.toLowerCase().replace("é", "e").replace("á", "a").trim() : "ambos";

                                // Se a regra do documento não for "ambos" e for DIFERENTE do candidato, ignora
                                if (jCandidato !== "" && docJornada !== "ambos" && docJornada !== jCandidato) {
                                    console.log("[WIDGET DOCS]  Ocultado (Filtro): " + doc.doc_titulo + " (" + docJornada + ")");
                                    continue;
                                }

                                console.log("[WIDGET DOCS]  Aprovado: " + doc.doc_titulo);
                                that.configDocs.push(doc);
                            }

                            // Chama a renderização apenas com os documentos aprovados no filtro
                            that.renderizarDocumentos(that.configDocs);
                        } else {
                            console.warn("[WIDGET DOCS] Dataset retornou lista vazia.");
                        }
                    } else {
                        console.error("[WIDGET DOCS] Erro retornado pelo Proxy: " + rProxy.message);
                    }
                }
            },
            complete: function () {
                that.mostrarLoading(false);
                console.log("======================================================");
            },
            error: function (err) {
                console.error("[WIDGET DOCS] Erro de comunicação (AJAX): ", err);
                that.mostrarLoading(false);
            }
        });
    },

    // =========================================================================
    // 2. SISTEMA DE RASCUNHO LOCAL (AUTO-SAVE)
    // =========================================================================

    getKeyStorage: function () { return "admissao_draft_" + (this.idOrigem || "novo"); },

    // =========================================================================
    // FUNÇÕES VISUAIS: Pintam as caixas de verde ao recarregar a página (F5)
    // =========================================================================

    // 1. Para os Documentos Gerais do Candidato
    atualizarVisualDocumentoSucesso: function (prefixoCampo, nomeArquivo) {
        var that = this;
        var $box = $("#box_" + prefixoCampo + "_" + that.instanceId);
        var $status = $("#status_" + prefixoCampo + "_" + that.instanceId);
        var $icon = $box.find("i.flaticon");
        var $btn = $box.find("button");

        if ($box.length) {
            $box.css({ "border": "2px solid #5cb85c", "background-color": "#dff0d8", "opacity": "1" });
            $icon.removeClass("text-info text-warning flaticon-refresh is-spinning flaticon-file-check flaticon-cloudupload").addClass("text-success flaticon-check-circle");
            $box.find("h5").addClass("text-success");
            $status.html('<strong style="color:#3c763d;">Salvo na nuvem: </strong>' + nomeArquivo).removeClass("text-muted").addClass("text-success");
            $btn.text("Substituir Arquivo").removeClass("btn-default btn-warning btn-danger").addClass("btn-success").prop("disabled", false);
        }
    },

    // 2. Para os Documentos dos Dependentes
    atualizarVisualDocumentoDependenteSucesso: function ($hiddenInput, nomeArquivo) {
        var $box = $hiddenInput.siblings(".upload-box");
        var $status = $box.find(".dep-file-status");
        var $icon = $box.find("i.flaticon");
        var $btn = $box.find(".dep-file-btn");

        if ($box.length) {
            $box.css({ "border": "2px solid #5cb85c", "background-color": "#dff0d8", "opacity": "1" });
            $icon.removeClass("text-info text-warning flaticon-refresh is-spinning flaticon-person flaticon-assignment-ind flaticon-file-check flaticon-local-hospital text-danger flaticon-close").addClass("text-success flaticon-check-circle");
            $box.find("h5").addClass("text-success");
            $status.html('<strong style="color:#3c763d;">Salvo na nuvem: </strong>' + nomeArquivo).removeClass("text-muted").addClass("text-success");
            $btn.text("Substituir Arquivo").removeClass("btn-default btn-warning btn-danger").addClass("btn-success").prop("disabled", false);
        }
    },

    salvarRascunhoLocal: function () {
        var that = this;
        if (that.bloqueioRestauracaoAtivo) return;

        var $div = $("#AdmissaoWidget_" + this.instanceId);
        try {
            var dadosCampos = {};
            $div.find("input, select, textarea").each(function () {
                var $el = $(this); var id = $el.attr("id");
                if (id && $el.attr("type") !== "file") {
                    var cleanId = id.replace("_" + that.instanceId, "");
                    if (id.indexOf("_base64_") !== -1) {
                        if ($el.val() === "[ENVIADO_PROCESSO]") dadosCampos[cleanId] = $el.val();
                        return;
                    }
                    if ($el.attr("type") === "checkbox" || $el.attr("type") === "radio") {
                        if ($el.is(":checked")) dadosCampos[cleanId] = $el.val();
                    } else {
                        dadosCampos[cleanId] = $el.val();
                    }
                }
            });

            // SALVA ROTAS DE VALE TRANSPORTE
            var dadosRotasVT = [];
            $div.find(".vt-card").each(function () {
                var $card = $(this);
                dadosRotasVT.push({
                    destino: $card.find(".vt-destino").val(), tipo: $card.find(".vt-tipo").val(),
                    empresa: $card.find(".vt-empresa").val(), linha: $card.find(".vt-linha").val(), valor: $card.find(".vt-valor").val()
                });
            });

            // SALVA DEPENDENTES SELECIONADOS NO PLANO DE SAÚDE
            var depsSelecionadosPS = [];
            $div.find(".check-plano-saude:checked").each(function () { depsSelecionadosPS.push($(this).data("nome-dep")); });

            // SALVA DEPENDENTES SELECIONADOS NO PLANO ODONTOLÓGICO
            var depsSelecionadosPO = [];
            $div.find(".check-plano-odonto:checked").each(function () {
                depsSelecionadosPO.push({
                    nome: $(this).data("nome-dep") || "",
                    parentesco: $(this).data("parentesco-dep") || ""
                });
            });

            var dadosDependentes = [];
            $div.find(".dependente-card").each(function () {
                var $card = $(this); var objDep = {};
                $card.find("input, select").each(function () {
                    var className = $(this).attr("class");
                    if (className) {
                        var classes = className.split(/\s+/);
                        for (var i = 0; i < classes.length; i++) {
                            if (classes[i].indexOf("dep-") === 0) {
                                if ($(this).attr("type") === "checkbox") objDep[classes[i]] = $(this).prop("checked");
                                else {
                                    objDep[classes[i]] = $(this).val();
                                    if (classes[i].indexOf("dep-base64-") === 0) objDep[classes[i] + "-name"] = $(this).attr("data-filename") || "";
                                }
                            }
                        }
                    }
                });
                dadosDependentes.push(objDep);
            });

            var estado = {
                passo: this.passoAtual, campos: dadosCampos, dependentes: dadosDependentes,
                rotasVT: dadosRotasVT, depsPS: depsSelecionadosPS, depsPO: depsSelecionadosPO, timestamp: new Date().getTime()
            };
            localStorage.setItem(this.getKeyStorage(), JSON.stringify(estado));
        } catch (e) { console.warn("Erro ao salvar local:", e); }
    },

    restaurarRascunhoLocal: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        
        // ATIVA A TRAVA DE SEGURANÇA CONTRA CONFLITOS DE RECARGA (F5)
        that.bloqueioRestauracaoAtivo = true;

        try {
            var json = localStorage.getItem(this.getKeyStorage());
            if (!json) return;
            var estado = JSON.parse(json);

            if (estado.campos) {
                for (var key in estado.campos) {
                    var valor = estado.campos[key];
                    var $el = $("#" + key + "_" + that.instanceId);

                    // Restaura visual dos documentos gerais e da foto (Deploy V1)
                    if (key.indexOf("_nome") !== -1 || key === "cand_foto_base64") {
                        if (key === "cand_foto_base64" && valor === "[ENVIADO_PROCESSO]") {
                            var nomeFoto = estado.campos["cand_foto_nome"] || "foto.jpg";
                            setTimeout(function () {
                                $("#preview_foto_" + that.instanceId).html('<div class="alert alert-success" style="padding: 10px; border-radius: 5px;"><i class="flaticon flaticon-check-circle"></i> Foto Salva na Nuvem: ' + nomeFoto + '</div>');
                            }, 800);
                        } else {
                            var prefixoDoc = key.replace("_nome", "");
                            var flagEnviado = estado.campos[prefixoDoc + "_base64"];
                            if (flagEnviado === "[ENVIADO_PROCESSO]") {
                                (function(pref, nomeArq) {
                                    setTimeout(function() { that.atualizarVisualDocumentoSucesso(pref, nomeArq); }, 800);
                                })(prefixoDoc, valor);
                            }
                        }
                    }

                    if ($el.length > 0) {
                        if ($el.attr("type") === "checkbox" || $el.attr("type") === "radio") {
                            $el.prop("checked", true);
                        } else {
                            $el.val(valor);
                            // TRATAMENTO DE SELECTS DE DATASET (Cidades, Naturalidade, Tipo Sanguíneo)
                            if ($el.is('select') && valor && $el.find('option[value="' + valor + '"]').length === 0) {
                                $el.attr('data-valor-pendente', valor);
                                $el.append('<option value="' + valor + '" selected>' + valor + '</option>');
                            }
                        }
                        $el.trigger('change'); 
                    }
                }
            }

            if (estado.rotasVT && estado.rotasVT.length > 0) {
                $("#container_rotas_vt_" + that.instanceId).empty();
                estado.rotasVT.forEach(function (rota) {
                    that.adicionarRotaVT();
                    var $ultimaRota = $div.find(".vt-card").last();
                    $ultimaRota.find(".vt-destino").val(rota.destino);
                    $ultimaRota.find(".vt-tipo").val(rota.tipo);
                    $ultimaRota.find(".vt-empresa").val(rota.empresa);
                    $ultimaRota.find(".vt-linha").val(rota.linha);
                    $ultimaRota.find(".vt-valor").val(rota.valor);
                });
            }

            if (estado.dependentes && estado.dependentes.length > 0) {
                $("#container_dependentes_" + that.instanceId).empty();
                estado.dependentes.forEach(function (depData, index) {
                    var obrigatorio = (index === 0);
                    that.adicionarDependente(depData['dep-parentesco'] || "", obrigatorio);
                    var $ultimoCard = $div.find(".dependente-card").last();

                    for (var classKey in depData) {
                        if (classKey.indexOf("-name") > -1) continue;
                        var $campo = $ultimoCard.find("." + classKey);
                        if ($campo.length) {
                            if ($campo.attr("type") === "file") continue; 
                            
                            if ($campo.attr("type") === "checkbox") {
                                $campo.prop("checked", depData[classKey]);
                            } else {
                                $campo.val(depData[classKey]);
                            }

                            if (classKey.indexOf("dep-base64-") === 0 && depData[classKey] === "[ENVIADO_PROCESSO]") {
                                $campo.attr("data-filename", depData[classKey + "-name"] || "Documento Recuperado");
                            }
                        }
                    }

                    if (depData['dep-nome'] && depData['dep-cpf'] && depData['dep-nasc']) {
                        $ultimoCard.find(".dep-nome").prop("readonly", true);
                        $ultimoCard.find(".dep-nasc").prop("readonly", true);
                    }

                    $ultimoCard.find(".dep-parentesco").trigger('change');
                    $ultimoCard.find(".dep-nasc").trigger("change");

                    setTimeout(function() {
                        for (var ckDoc in depData) {
                            if (ckDoc.indexOf("dep-base64-") === 0 && depData[ckDoc] === "[ENVIADO_PROCESSO]") {
                                var $cH = $ultimoCard.find("." + ckDoc);
                                if ($cH.length > 0) {
                                    that.atualizarVisualDocumentoDependenteSucesso($cH, depData[ckDoc + "-name"]);
                                }
                            }
                        }
                    }, 500);
                });
            } else {
                var isEstagio = (that.jornadaAdmissao === "Estagio" || that.jornadaAdmissao === "Estágio");
                if ($div.find(".dependente-card").length === 0 && !isEstagio) {
                    that.adicionarDependente("Mae", true);
                }
            }

            // =========================================================================
            // Atraso cirúrgico de 1 segundo para garantir que triggers
            // de Filial, Sindicato ou Cargo não limpem o campo após ser preenchido
            // =========================================================================
            setTimeout(function () {
                if (estado.campos) {
                    if (estado.campos["cand_ps_opcao"]) {
                        $div.find('#cand_ps_opcao_' + that.instanceId).val(estado.campos["cand_ps_opcao"]).trigger('change');
                    }
                    if (estado.campos["cand_po_opcao"]) {
                        $div.find('#cand_po_opcao_' + that.instanceId).val(estado.campos["cand_po_opcao"]).trigger('change');
                    } else if (estado.campos["cand_odonto_opcao"]) {
                        $div.find('#cand_po_opcao_' + that.instanceId).val(estado.campos["cand_odonto_opcao"]).trigger('change');
                    }
                }
                that.atualizarOpcoesPlanoSaude();
                if (typeof that.atualizarDependentesOdonto === "function") {
                    that.atualizarDependentesOdonto();
                }
                if (typeof that.restaurarSelecaoPlanoOdonto === "function") {
                    that.restaurarSelecaoPlanoOdonto(estado.depsPO || []);
                }
            }, 1000);

            if (estado.passo) {
                setTimeout(function () { that.irParaPasso(estado.passo); }, 500);
            }

        } catch (e) { 
            console.warn("Erro ao restaurar rascunho local:", e); 
        } finally {
            setTimeout(function () {
                that.restaurarUIAssinaturas();
                
                // Desativa a trava de proteção
                that.bloqueioRestauracaoAtivo = false;
                console.log("[DEBUG_DEP]  Restauração completa. Auto-save reativado.");
            }, 2000);
        }
    },

    limparRascunhoLocal: function () { localStorage.removeItem(this.getKeyStorage()); },

    restaurarSelecaoPlanoOdonto: function (listaSelecionados) {
        var that = this;
        if (!listaSelecionados || !listaSelecionados.length) return;

        var mapa = {};
        listaSelecionados.forEach(function (item) {
            var nome = "";
            var parentesco = "";
            if (typeof item === "string") {
                nome = item;
            } else if (item) {
                nome = item.nome || "";
                parentesco = item.parentesco || "";
            }
            var chave = (nome + "||" + parentesco).toLowerCase();
            if (chave !== "||") mapa[chave] = true;
        });

        $("#container_dependentes_odonto_" + that.instanceId).find(".check-plano-odonto").each(function () {
            var $ck = $(this);
            var chave = String($ck.data("nome-dep") || "") + "||" + String($ck.data("parentesco-dep") || "");
            if (mapa[chave.toLowerCase()]) {
                $ck.prop("checked", true);
            }
        });
    },

    // =========================================================================
    // 3. LISTENERS E REGRAS
    // =========================================================================

    iniciarListeners: function ($div) {
        var that = this;

        AdmissaoObrigatoriedade.atualizarAsteriscos(that); // Chamada inicial para desenhar na tela

        $div.on("change", "select, input[type='radio'], input[type='checkbox']", function () {
            AdmissaoObrigatoriedade.atualizarAsteriscos(that); // Recalcula asteriscos sempre que trocar uma opção (ex: CNH, VT)
        });

        // Inicializa o calendário moderno do Fluig em todos os inputs com a classe
        FLUIGC.calendar('.fluig-calendar', {
            language: 'pt-br',
            pickDate: true,
            pickTime: false
        });

        $div.on("change input", "input, select, textarea", function () {
            if (that.bloqueioRestauracaoAtivo) return;
            clearTimeout(that.saveTimeout);
            clearTimeout(that.saveTimeoutFluig);
            that.saveTimeout = setTimeout(function () {
                that.salvarRascunhoLocal();
                that.saveTimeoutFluig = setTimeout(function () {
                    if (!that.documentIdFicha || that.bloqueioRestauracaoAtivo) return;
                    that.persistirFormularioNoFluig({ passoAtual: that.passoAtual }, function () { }, function () { });
                }, 1200);
            }, 500);
        });

        $div.on('change blur', '#cand_sexo_' + that.instanceId +
            ', #cand_cnh_possuo_' + that.instanceId +
            ', #cand_estado_civil_' + that.instanceId +
            ', #cand_possui_deficiencia_' + that.instanceId +
            ', #cand_banco_' + that.instanceId,
            function () {
                that.renderizarDocumentosFixos();
            });

        // Lógica de Banco Itaú
        $div.off("change", "#cand_possui_conta_itau_" + this.instanceId).on("change", "#cand_possui_conta_itau_" + this.instanceId, function () {
            var valor = $(this).val();
            var $divCampos = $("#div_campos_bancarios_" + that.instanceId);
            var $alertaAbertura = $("#div_alerta_abertura_conta_" + that.instanceId);
            var $inputBanco = $("#cand_banco_" + that.instanceId);

            if (valor === "Sim") {
                $divCampos.slideDown();
                $alertaAbertura.slideUp();
                $inputBanco.val("341 - Itaú Unibanco S.A.").prop("readonly", true).css({ "background-color": "#eee", "pointer-events": "none" });
            } else if (valor === "Nao") {
                $divCampos.slideDown();
                $alertaAbertura.slideDown();
                $inputBanco.val("").prop("readonly", false).css({ "background-color": "#fff", "pointer-events": "auto" });
            } else {
                $divCampos.slideUp();
                $alertaAbertura.slideUp();
                $inputBanco.val("").prop("readonly", false).css({ "background-color": "#fff", "pointer-events": "auto" });
            }
        });

        // Lógica de Plano Odontológico
        $div.off("change", "#cand_po_opcao_" + this.instanceId).on("change", "#cand_po_opcao_" + this.instanceId, function () {
            var valor = $(this).val();
            var $divPlanos = $("#div_po_planos_" + that.instanceId);
            var $inputTipoPlano = $("#cand_po_tipo_plano_" + that.instanceId);
            var $divDependentes = $("#div_po_dependentes_" + that.instanceId); // Novo contentor de dependentes

            if (valor === "Sim") {
                $divPlanos.slideDown();
                $divDependentes.slideDown(); // Mostra a área de seleção

                // Chama a função para buscar os dependentes cadastrados e montar os checkboxes
                if (typeof that.atualizarDependentesOdonto === "function") {
                    that.atualizarDependentesOdonto();
                }
            } else {
                $divPlanos.slideUp();
                $divDependentes.slideUp(); // Esconde a área
                $inputTipoPlano.val(""); // Limpa o plano selecionado

                // Desmarca todos os checkboxes de dependentes do odonto caso o candidato desista
                $("#container_dependentes_odonto_" + that.instanceId).find("input[type='checkbox']").prop("checked", false);
            }
        });

        this.marcarAbaComoVisitada('tab_pessoais_' + this.instanceId);
        $div.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var targetId = $(e.target).attr("href").replace("#", "");
            that.marcarAbaComoVisitada(targetId); that.salvarRascunhoLocal();
        });

        // REGRA DE PARENTESCO E SALÁRIO FAMÍLIA
        $div.off("change", ".dep-parentesco").on("change", ".dep-parentesco", function () {
            var valor = $(this).val();
            var $card = $(this).closest(".dependente-card");
            var $campoSexo = $card.find(".dep-sexo");
            var $divSalarioFamilia = $card.find(".div-salario-familia");

            if (valor === "Mae") {
                $campoSexo.val("Feminino").prop("readonly", true).css({ "pointer-events": "none", "background-color": "#eee" }).attr("tabindex", "-1");
            } else {
                $campoSexo.prop("readonly", false).css({ "pointer-events": "auto", "background-color": "#fff" }).removeAttr("tabindex");
            }

            if (valor === "Filho") $divSalarioFamilia.slideDown();
            else {
                $divSalarioFamilia.slideUp();
                $card.find(".dep-sf").val("Nao");
            }
        });

        // CONSULTA CPF DEPENDENTE
        $div.off("blur", ".dep-cpf").on("blur", ".dep-cpf", function () {
            var $input = $(this);
            var cpf = $input.val().replace(/\D/g, "");
            var $card = $input.closest(".dependente-card");

            if (cpf.length === 11) {
                that.consultarCPFDependente(cpf, $card);
            }
        });

        $div.on("input", "#cand_instituicao_cnpj_" + this.instanceId, function () {
            $(this).val(that.mascaraCNPJ($(this).val()));
        });

        // $div.off("change", ".dep-pensao").on("change", ".dep-pensao", function () {
        //     var valor = $(this).val(); var $divPensao = $(this).closest(".dependente-card").find(".div-dados-pensao");
        //     (valor === "Sim") ? $divPensao.slideDown() : ($divPensao.slideUp(), $divPensao.find("input").val(""));
        // });

        $div.off("click", "[data-trigger-upload]").on("click", "[data-trigger-upload]", function () { $("#" + $(this).attr("data-trigger-upload")).trigger('click'); });
        $div.off("change", "[data-process-file]").on("change", "[data-process-file]", function () { that.processarArquivo(this); });

        // $div.off("change", ".dep-pensao-anexo-input").on("change", ".dep-pensao-anexo-input", function () {
        //     var input = this; var $card = $(input).closest(".dependente-card");
        //     if (input.files && input.files[0]) {
        //         var file = input.files[0]; var reader = new FileReader();
        //         reader.onload = function (e) {
        //             $card.find(".dep-pensao-anexo-base64").val(e.target.result);
        //             $card.find(".dep-pensao-anexo-nome").val(file.name);
        //             FLUIGC.toast({ message: 'Ofício anexado.', type: 'success' });
        //             that.salvarRascunhoLocal();
        //         };
        //         reader.readAsDataURL(file);
        //     }
        // });

        function normalizarParentesco(valor) {
            return String(valor || "")
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        }

        function atualizarVisibilidadeDocsDependente($card) {
            var parentesco = normalizarParentesco($card.find(".dep-parentesco").val());
            var dataNasc = $card.find(".dep-nasc").val();
            var $divDocs = $card.find(".div-docs-dependente");
            var isCLT = (that.jornadaAdmissao !== "Estagio" && that.jornadaAdmissao !== "Estágio");

            $divDocs.hide();
            $card.find(".doc-conjuge, .doc-filho, .doc-vacina").hide();

            if (!isCLT) return;

            var isConjuge = (parentesco === "conjuge" || parentesco === "companheiro");
            var isFilho = (parentesco === "filho" || parentesco === "enteado");

            if (isConjuge) {
                $divDocs.show();
                $card.find(".doc-conjuge").show();
                return;
            }

            if (isFilho && dataNasc) {
                var idade = that.calcularIdadeDependente(dataNasc);
                if (idade < 14) {
                    $divDocs.show();
                    $card.find(".doc-filho.doc-cert-nasc, .doc-conjuge").show();
                    if (idade <= 5) {
                        $card.find(".doc-vacina").show();
                    }
                }
            }
        }

        // ATUALIZAR REGRAS DO DEPENDENTE AO MUDAR PARENTESCO OU NASCIMENTO
        $div.off("change", ".dep-parentesco, .dep-nasc").on("change", ".dep-parentesco, .dep-nasc", function () {
            var $card = $(this).closest(".dependente-card");
            atualizarVisibilidadeDocsDependente($card);
        });


        // Conversor de arquivo e Estilização Visual nos cards do dependente (COM COMPRESSÃO)
        $div.off("change", ".dep-file-cpf, .dep-file-rgf, .dep-file-rgv, .dep-file-certnasc, .dep-file-vacina").on("change", ".dep-file-cpf, .dep-file-rgf, .dep-file-rgv, .dep-file-certnasc, .dep-file-vacina", function () {
            var input = this; var $card = $(input).closest(".dependente-card");
            var nomeDependente = $card.find(".dep-nome").val() || "Dependente";
            var $hidden = $(input).next("input[type='hidden']"); var $box = $(input).siblings(".upload-box");
            var $icon = $box.find("i.flaticon"); var $btn = $box.find(".dep-file-btn"); var $status = $box.find(".dep-file-status");

            var docType = "Documento";
            if ($(input).hasClass("dep-file-cpf")) docType = "CPF OCR";
            else if ($(input).hasClass("dep-file-rgf")) docType = "RG Frente OCR";
            else if ($(input).hasClass("dep-file-rgv")) docType = "RG Verso OCR";
            else if ($(input).hasClass("dep-file-certnasc")) docType = "Certidão Civil OCR";
            else if ($(input).hasClass("dep-file-vacina")) docType = "Cartão Vacina OCR";

            var descricaoFluig = docType + " - " + nomeDependente;

            if (input.files && input.files[0]) {
                var file = input.files[0]; var fileName = file.name;
                if (file.size > 5 * 1024 * 1024) { FLUIGC.toast({ title: 'Erro', message: 'O arquivo excede 5MB.', type: 'danger' }); $(input).val(""); return; }

                $box.css({ "border": "2px dashed #f0ad4e", "background-color": "#fcf8e3", "opacity": "0.8" });
                $icon.removeClass("text-info flaticon-person flaticon-assignment-ind flaticon-file-check flaticon-local-hospital text-success flaticon-check-circle text-danger flaticon-close").addClass("text-warning flaticon-refresh is-spinning");
                $btn.text("Enviando...").removeClass("btn-default btn-success btn-danger").addClass("btn-warning").prop("disabled", true);
                $status.html("Transferindo...");

                that.comprimirImagemBase64(file, function (base64Otimizado) {
                    var base64Clean = base64Otimizado.indexOf(",") > -1 ? base64Otimizado.split(",")[1] : base64Otimizado;
            that.uploadAnexoIndividual(base64Clean, fileName, descricaoFluig,
                function (sucesso) {
                    $hidden.val("[ENVIADO_PROCESSO]"); $hidden.attr("data-filename", fileName);
                    $box.css({ "border": "2px solid #5cb85c", "background-color": "#dff0d8", "opacity": "1" });
                    $icon.removeClass("text-warning flaticon-refresh is-spinning").addClass("text-success flaticon-check-circle");
                    $box.find("h5").addClass("text-success");
                    $status.html('<strong style="color:#3c763d;">Salvo: </strong>' + fileName).removeClass("text-muted").addClass("text-success");
                    $btn.text("Alterar").removeClass("btn-warning").addClass("btn-success").prop("disabled", false);
                    that.salvarRascunhoLocal();
                    that.persistirFormularioNoFluig();
                },
                function (erro) {
                    FLUIGC.toast({ title: 'Falha', message: erro, type: 'danger' });
                    $box.css({ "border": "2px dashed #d9534f", "background-color": "#f2dede", "opacity": "1" });
                    $icon.removeClass("text-warning flaticon-refresh is-spinning").addClass("text-danger flaticon-close");
                            $btn.text("Tentar Novamente").removeClass("btn-warning").addClass("btn-danger").prop("disabled", false);
                            $status.html("Erro. Tente de novo."); $(input).val("");
                        }
                    );
                });
            }
        });

        $div.find("#cand_possui_deficiencia_" + this.instanceId).on("change", function () {
            var $div = $("#div_tipo_deficiencia_" + that.instanceId); ($(this).val() === "Sim") ? $div.show() : $div.hide();
        });
        $div.find("#cand_cnh_possuo_" + this.instanceId).on("change", function () {
            var $div = $("#div_campos_cnh_" + that.instanceId); ($(this).val() === "Sim") ? $div.slideDown() : $div.slideUp();
        });
        $div.find("#cand_reservista_possuo_" + this.instanceId).on("change", function () {
            var $div = $("#div_campos_reservista_" + that.instanceId); ($(this).val() === "Sim") ? $div.slideDown() : $div.slideUp();
        });

        $div.on("input", ".dep-cpf", function () { $(this).val(that.mascaraCPF($(this).val())); });
        $div.on("input", ".dep-pensao-cpf-resp", function () { $(this).val(that.mascaraCPF($(this).val())); });
        $div.find("#cand_celular_" + this.instanceId + ", #cand_emergencia_telefone_" + this.instanceId).on("input", function () { $(this).val(that.mascaraTelefone($(this).val())); });

        $div.find("#cand_cep_" + this.instanceId)
            .on("input", function () { $(this).val(that.mascaraCEP($(this).val())); })
            .on("blur", function () { that.buscaCEP($(this).val()); });

        // Controle: Se é primeiro emprego, esconde PIS e ANO
        $div.on('change', '#cand_primeiro_emprego_' + that.instanceId, function () {
            if ($(this).val() === "Sim") {
                $div.find("#div_cand_pis_" + that.instanceId).hide();
                $div.find("#div_cand_ano_primeiro_emprego_" + that.instanceId).hide();
                $div.find("#cand_pis_" + that.instanceId).val("");
                $div.find("#cand_ano_primeiro_emprego_" + that.instanceId).val("");
            } else {
                $div.find("#div_cand_pis_" + that.instanceId).show();
                $div.find("#div_cand_ano_primeiro_emprego_" + that.instanceId).show();
            }
        });

        $div.on('change', '#cand_sexo_' + that.instanceId, function () {
            var val = $(this).val();
            if (val === "Masculino" || val === "M") {
                $div.find("#painel_reservista_" + that.instanceId).slideDown();
            } else {
                $div.find("#painel_reservista_" + that.instanceId).slideUp();
                // Limpa os campos se alterar para Feminino
                $div.find("#cand_reservista_categoria_" + that.instanceId + ", #cand_reservista_circunscricao_" + that.instanceId + ", #cand_reservista_regiao_" + that.instanceId + ", #cand_reservista_orgao_" + that.instanceId).val("");
            }
        });

        $div.on("input", ".fluig-calendar", function () {
            $(this).val(that.mascaraData($(this).val()));
        });

        $("#file_cand_foto_" + this.instanceId).on('change', function () {
            if (this.files && this.files[0]) {
                var file = this.files[0];
                var $input = $(this);
                $input.val("");

                if (!file.type || String(file.type).indexOf("image/") !== 0) {
                    FLUIGC.toast({ title: 'Atenção', message: 'Selecione um arquivo de imagem válido.', type: 'warning' });
                    return;
                }

                that.comprimirImagemBase64(file, function (base64Otimizado) {
                    var base64Clean = base64Otimizado.indexOf(",") > -1 ? base64Otimizado.split(",")[1] : base64Otimizado;
                    var nomeFoto = that.gerarNomeFotoArquivo();

                    that.enviarFotoParaGED(base64Clean, base64Otimizado, nomeFoto);
                });
            }
        });

        // GARANTIA DE CLIQUE: Botão de Adicionar Dependente
        $div.off("click", "[data-add-dependente]").on("click", "[data-add-dependente]", function () {
            that.adicionarDependenteManual();
        });

        // GARANTIA DE CLIQUE: Botão de Remover Dependente
        $div.off("click", ".btn-remove-dep").on("click", ".btn-remove-dep", function () {
            that.removerDependente(this);
        });

        // Listener do botão adicionar
        $div.on('click', '[data-add-rota]', function () {
            that.adicionarRotaVT();
        });

        // Listener da Opção do VT
        $div.on('change', '#cand_vt_opcao_' + that.instanceId, function () {
            if ($(this).val() === "Opto") {
                $div.find("#div_vt_detalhes_" + that.instanceId).slideDown();
                // Se estiver vazio, já sugere uma rota de "Ida"
                if ($div.find("#container_rotas_vt_" + that.instanceId + " .vt-card").length === 0) {
                    that.adicionarRotaVT("Ida");
                }
            } else {
                $div.find("#div_vt_detalhes_" + that.instanceId).slideUp();
                // Limpa as rotas se ele desistir do VT
                $div.find("#container_rotas_vt_" + that.instanceId).empty();
            }
        });

        // Lógica de Plano de Saúde (CORRIGIDA COM OS IDs EXATOS DO VIEW.FTL)
        $div.off("change", "#cand_ps_opcao_" + this.instanceId).on("change", "#cand_ps_opcao_" + this.instanceId, function () {
            var valor = $(this).val();

            // IDs exatos baseados no seu HTML
            var $divPlanos = $("#div_ps_planos_" + that.instanceId);
            var $inputTipoPlano = $("#cand_ps_tipo_plano_" + that.instanceId);

            // Aqui estava o erro! O ID correto é div_ps_detalhes_
            var $divDependentes = $("#div_ps_detalhes_" + that.instanceId);

            if (valor === "Opto pela inclusão de dependente(s) e estou ciente dos custos e regras") {
                $divPlanos.slideDown();
                $divDependentes.slideDown();

                // Desenha os checkboxes
                if (typeof that.atualizarOpcoesPlanoSaude === "function") {
                    that.atualizarOpcoesPlanoSaude();
                }
            } else {
                $divPlanos.slideUp();
                $divDependentes.slideUp();

                // Limpa tudo se o candidato mudar de ideias
                $inputTipoPlano.val("");
                $("#container_dependentes_plano_" + that.instanceId).find("input[type='checkbox']").prop("checked", false);
            }
        });

        // Gatilho de Naturalidade
        $div.on('change', '#cand_estado_natal_' + that.instanceId, function () {
            that.carregarMunicipios($(this).val(), 'cand_naturalidade_' + that.instanceId);
        });

        // Gatilho de Endereço (Cidade)
        $div.on('change', '#cand_uf_' + that.instanceId, function () {
            that.carregarMunicipios($(this).val(), 'cand_cidade_' + that.instanceId);
        });

        $div.on('click', '#btn_abrir_camera_' + that.instanceId, function () {
            that.abrirModalFoto();
        });

        $div.on('click', '#btn_capturar_foto_' + that.instanceId, function () {
            that.capturarFotoModal();
        });

        $div.on('click', '#btn_tirar_novamente_' + that.instanceId, function () {
            that.abrirModalFoto();
        });

        $div.on('click', '#btn_confirmar_foto_' + that.instanceId, function () {
            if (!that.fotoCapturadaBase64 || !that.fotoCapturadaDataUrl) {
                FLUIGC.toast({ title: 'Atenção', message: 'Capture a foto antes de confirmar.', type: 'warning' });
                return;
            }

            var base64Clean = that.fotoCapturadaBase64;
            var dataUrl = that.fotoCapturadaDataUrl;
            var nomeFoto = that.fotoCapturadaNome || that.gerarNomeFotoArquivo();

            that.enviarFotoParaGED(base64Clean, dataUrl, nomeFoto, function () {
                that.resetarModalFoto();
            });
        });

        $div.on('click', '#btn_fechar_camera_' + that.instanceId + ', #btnCloseCameraModal_' + that.instanceId, function () {
            that.resetarModalFoto();
        });

        // Aplica máscara de moeda no valor da tarifa do VT (delegação de evento por ser dinâmico)
        $div.on("input", ".vt-valor", function () {
            $(this).val(that.mascaraMoeda($(this).val()));
        });

    },

    consultarCPFDependente: function (cpf, $card) {
        var that = this;
        var $inputNome = $card.find(".dep-nome");
        var $inputNasc = $card.find(".dep-nasc");

        // UI Feedback: Mostra que está carregando e trava os campos
        $inputNome.attr("placeholder", "Buscando na Receita Federal...").prop("readonly", true);
        $inputNasc.prop("readonly", true);

        // Mesmo formato de chamada do view.js do projeto principal
        var constraints = [
            { _field: "cpf", _initialValue: cpf, _finalValue: cpf, _type: 1, _likeSearch: false }
        ];

        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        // CHAMA O NOVO DATASET DA SERPRO (Igual ao view.js)
        var payloadObj = { name: "ds_irho_cpf_serpro", constraints: constraints };
        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                var encontrado = false;

                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rp = resProxy.content.values[0];
                    if (rp.status == "success") {
                        var resData = JSON.parse(rp.response);
                        if (resData.records && resData.records.length > 0) {
                            var r = resData.records[0];

                            // Lógica igual ao PessoaJaExiste do view.js
                            if (r.response_code == "200" && r.nome_completo) {
                                encontrado = true;

                                // Preenche o Nome
                                $inputNome.val(r.nome_completo);

                                // Preenche a Data (O formato que volta do Serpro no novo dataset costuma ser DD/MM/YYYY)
                                var dt = r.dt_nascimento;
                                if (dt && dt.indexOf("/") > -1) {
                                    // Como a tela da Widget usa campo tipo text com máscara de data, mantemos DD/MM/YYYY
                                    $inputNasc.val(dt);
                                } else {
                                    $inputNasc.val(dt);
                                }

                                // Mantém os campos bloqueados para o candidato não alterar os dados oficiais
                                $inputNome.prop("readonly", true);
                                $inputNasc.prop("readonly", true);

                                FLUIGC.toast({ message: 'Dados validados na Receita Federal.', type: 'success' });
                                that.salvarRascunhoLocal();
                            } else {
                                // Caso o CPF exista mas seja inválido ou menor de idade (se a API tiver essa regra)
                                FLUIGC.toast({ title: 'Atenção:', message: r.response_message || 'CPF não encontrado', type: 'warning' });
                            }
                        }
                    }
                }

                // Se não encontrou ou deu erro, libera para digitação manual
                if (!encontrado) {
                    $inputNome.val("").prop("readonly", false).attr("placeholder", "Nome Completo").focus();
                    $inputNasc.val("").prop("readonly", false);
                }
            },
            error: function () {
                // Em caso de erro de conexão, também libera para digitação manual
                $inputNome.val("").prop("readonly", false).attr("placeholder", "Nome Completo").focus();
                $inputNasc.val("").prop("readonly", false);
                FLUIGC.toast({ message: 'Falha ao consultar a Receita Federal. Preencha manualmente.', type: 'info' });
            }
        });
    },

    // =========================================================================
    // 4. LÓGICA DE DADOS, RESUMO E ENVIO
    // =========================================================================

    gerarResumoFinal: function () {
        var that = this;
        var id = this.instanceId;

        function v(fieldId) {
            var $el = $("#" + fieldId + "_" + id);
            if ($el.length === 0) return '<span class="text-muted">-</span>';
            var val = $el.val();
            if ($el.is("select")) {
                var text = $el.find("option:selected").text();
                return (text && text !== "Selecione...") ? text : val;
            }
            return val || '<span class="text-danger small">Não informado</span>';
        }

        var sections = [
            {
                title: "1. Dados Pessoais", icon: "flaticon-person",
                fields: [
                    { label: "Nome", id: "cand_nomeCompleto", col: 6 }, { label: "CPF", id: "cand_cpf", col: 3 }, { label: "Nascimento", id: "cand_nascimento", col: 3 },
                    { label: "Email", id: "cand_email", col: 6 }, { label: "Celular", id: "cand_celular", col: 3 }, { label: "Estado Civil", id: "cand_estado_civil", col: 3 },
                    { label: "RG", id: "cand_rg", col: 3 }, { label: "Órgão/UF", id: "cand_rg_orgao", col: 3 }, { label: "Mãe", id: "cand_nome_mae_resumo", col: 6 }
                ]
            },
            {
                title: "2. Endereço", icon: "flaticon-map-marker",
                fields: [
                    { label: "CEP", id: "cand_cep", col: 3 }, { label: "Logradouro", id: "cand_endereco", col: 6 }, { label: "Número", id: "cand_numero", col: 3 },
                    { label: "Bairro", id: "cand_bairro", col: 4 }, { label: "Cidade", id: "cand_cidade", col: 4 }, { label: "Estado", id: "cand_uf", col: 4 }
                ]
            },
            {
                title: "3. Formação e Contratação", icon: "flaticon-assignment",
                fields: [
                    { label: "Grau Instrução", id: "cand_grau_instrucao", col: 4 }, { label: "Curso", id: "cand_curso", col: 4 }, { label: "Conclusão", id: "cand_ano_conclusao", col: 4 },
                    { label: "Camisa", id: "cand_tamanho_camisa", col: 3 }, { label: "Calçado", id: "cand_tamanho_calcado", col: 3 }, { label: "Deficiência?", id: "cand_possui_deficiencia", col: 3 }
                ]
            },
            {
                title: "4. Dados Bancários", icon: "flaticon-paid",
                fields: [
                    { label: "Banco", id: "cand_banco", col: 4 }, { label: "Agência", id: "cand_agencia", col: 2 }, { label: "Conta", id: "cand_conta_corrente", col: 3 }, { label: "Tipo", id: "cand_tipo_conta", col: 3 },
                    { label: "Chave Pix", id: "cand_chave_pix", col: 12 }
                ]
            }
        ];

        var html = '<div class="panel-group" id="accordionResumo_' + id + '" role="tablist" aria-multiselectable="true">';

        sections.forEach(function (sec, index) {
            var expanded = (index === 0) ? "in" : "";
            var collapsed = (index === 0) ? "" : "collapsed";

            html += '<div class="panel panel-default">';
            html += '<div class="panel-heading" role="tab" id="heading' + index + '_' + id + '">';
            html += '<h4 class="panel-title">';
            html += '<a class="' + collapsed + '" role="button" data-toggle="collapse" data-parent="#accordionResumo_' + id + '" href="#collapse' + index + '_' + id + '" aria-expanded="true" aria-controls="collapse' + index + '_' + id + '">';
            html += '<i class="flaticon ' + sec.icon + ' icon-sm"></i> ' + sec.title;
            html += '</a>';
            html += '</h4>';
            html += '</div>';
            html += '<div id="collapse' + index + '_' + id + '" class="panel-collapse collapse ' + expanded + '" role="tabpanel" aria-labelledby="heading' + index + '_' + id + '">';
            html += '<div class="panel-body"><div class="row">';

            sec.fields.forEach(function (field) {
                var valor = "";
                if (field.id === "cand_nome_mae_resumo") {
                    valor = $("#AdmissaoWidget_" + id).find("#cand_mae_nome_" + id).val() || '<span class="text-danger small">Não informado</span>';
                } else {
                    valor = v(field.id);
                }

                html += '<div class="col-md-' + field.col + ' mb-10">';
                html += '<small class="text-muted d-block">' + field.label + '</small><br>';
                html += '<strong class="text-info">' + valor + '</strong>';
                html += '</div>';
            });

            html += '</div></div></div></div>';
        });

        html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionResumo_' + id + '" href="#collapseDeps_' + id + '"><i class="flaticon flaticon-people icon-sm"></i> 5. Dependentes</a></h4></div>';
        html += '<div id="collapseDeps_' + id + '" class="panel-collapse collapse"><div class="panel-body">';
        var hasDep = false;
        $("#container_dependentes_" + id).find(".dependente-card").each(function (i) {
            var nome = $(this).find(".dep-nome").val();
            // Só imprime no resumo final se o nome tiver sido preenchido
            if (nome && nome.trim() !== "") {
                hasDep = true;
                var parentesco = $(this).find(".dep-parentesco option:selected").text();
                html += '<div class="dashed-list-item"><strong>' + (i + 1) + '. ' + nome + '</strong> (' + parentesco + ')</div>';
            }
        });
        if (!hasDep) html += '<p class="text-muted">Nenhum dependente informado.</p>';
        html += '</div></div></div>';

        html += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionResumo_' + id + '" href="#collapseDocs_' + id + '"><i class="flaticon flaticon-file-check icon-sm"></i> 6. Status Documentos</a></h4></div>';
        html += '<div id="collapseDocs_' + id + '" class="panel-collapse collapse"><div class="panel-body"><div class="row">';

        var fotoNome = $("#cand_foto_nome_" + id).val();
        html += '<div class="col-md-6 mb-5"><i class="flaticon flaticon-face-surprised"></i> Foto de Rosto: ' + (fotoNome ? '<span class="label label-success">OK</span>' : '<span class="label label-danger">Pendente</span>') + '</div>';

        for (var i = 0; i < this.configDocs.length; i++) {
            var doc = this.configDocs[i]; var campo = doc.doc_campo_interno ? doc.doc_campo_interno.trim() : "";
            if (campo) {
                var val = $("#" + campo + "_nome_" + id).val();
                var status = val ? '<span class="label label-success">Anexado</span>' : '<span class="label label-danger">Pendente</span>';
                html += '<div class="col-md-6 mb-5" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;" title="' + doc.doc_titulo + '"><i class="flaticon flaticon-file-check"></i> ' + doc.doc_titulo + ': ' + status + '</div>';
            }
        }

        // NOVO: Renderiza os Fixos no resumo final
        if (this.docsFixosExigidos) {
            for (var f = 0; f < this.docsFixosExigidos.length; f++) {
                var docF = this.docsFixosExigidos[f];
                var valFixo = $("#" + docF.id + "_nome_" + id).val();
                var statusFixo = valFixo ? '<span class="label label-success">Anexado</span>' : '<span class="label label-danger">Pendente</span>';
                html += '<div class="col-md-6 mb-5" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;" title="' + docF.titulo + '"><i class="flaticon flaticon-file-check"></i> ' + docF.titulo + ': ' + statusFixo + '</div>';
            }
        }

        html += '</div></div></div></div>';

        html += '</div>';

        $("#resumo_container_" + id).html(html);
    },

    getDadosFormulario: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        function formatarDataBR(dataUS) {
            if (!dataUS || dataUS.indexOf("-") === -1) return dataUS;
            var p = dataUS.split("-");
            return p[2] + "/" + p[1] + "/" + p[0];
        }

        var sexoValor = $div.find("#cand_sexo_" + that.instanceId).val();
        var sexoProcesso = (sexoValor === "Masculino") ? "M" : (sexoValor === "Feminino") ? "F" : "";

        var racaProcesso = $div.find("#cand_raca_" + that.instanceId).val() || "";
        var estCivilValor = $div.find("#cand_estado_civil_" + that.instanceId).val() || "";

        var tipoContaMap = { "Corrente": "1", "Salario": "2", "Poupanca": "1" };
        var tipoContaValor = $div.find("#cand_tipo_conta_" + that.instanceId).val();
        var tipoContaProcesso = tipoContaMap[tipoContaValor] || "";

        var codNacao = $div.find("#cand_nacionalidade_" + that.instanceId).val() || "10";
        var descNacao = $div.find("#cand_nacionalidade_" + that.instanceId + " option:selected").text() || "Brasileira";

        var possuiDef = $div.find("#cand_possui_deficiencia_" + that.instanceId).val();
        var tipoDef = (possuiDef === "Sim") ? $div.find("#cand_tipo_deficiencia_" + that.instanceId).val() : "";
        var defFisico = (possuiDef === "Sim" && tipoDef === "Fisica") ? "1" : "0";
        var defAuditivo = (possuiDef === "Sim" && tipoDef === "Auditiva") ? "1" : "0";
        var defVisual = (possuiDef === "Sim" && tipoDef === "Visual") ? "1" : "0";
        var defMental = (possuiDef === "Sim" && tipoDef === "Mental") ? "1" : "0";
        var defIntelectual = (possuiDef === "Sim" && tipoDef === "Intelectual") ? "1" : "0";

        var possuiCNH = $div.find("#cand_cnh_possuo_" + that.instanceId).val();
        var dadosCNH = {
            tipo: (possuiCNH == "Sim") ? $div.find("#cand_cnh_tipo_" + that.instanceId).val() : "",
            numero: (possuiCNH == "Sim") ? $div.find("#cand_cnh_numero_" + that.instanceId).val() : "",
            vencimento: (possuiCNH == "Sim") ? formatarDataBR($div.find("#cand_cnh_data_venc_" + that.instanceId).val()) : "",
            orgao: (possuiCNH == "Sim") ? $div.find("#cand_cnh_orgao_" + that.instanceId).val() : "",
            emissao: (possuiCNH == "Sim") ? formatarDataBR($div.find("#cand_cnh_data_emissao_" + that.instanceId).val()) : "",
            uf: (possuiCNH == "Sim") ? $div.find("#cand_cnh_uf_" + that.instanceId).val() : "",
            primeira: (possuiCNH == "Sim") ? formatarDataBR($div.find("#cand_cnh_data_primeira_" + that.instanceId).val()) : ""
        };

        var possuiReservista = $div.find("#cand_reservista_possuo_" + that.instanceId).val();
        var dadosReservista = {
            numero: (possuiReservista == "Sim") ? $div.find("#cand_reservista_numero_" + that.instanceId).val() : "",
            emissao: (possuiReservista == "Sim") ? formatarDataBR($div.find("#cand_reservista_data_emissao_" + that.instanceId).val()) : "",
            situacao: (possuiReservista == "Sim") ? $div.find("#cand_reservista_situacao_" + that.instanceId).val() : "",
            categoria: (possuiReservista == "Sim") ? $div.find("#cand_reservista_categoria_" + that.instanceId).val() : "",
            circunscricao: (possuiReservista == "Sim") ? $div.find("#cand_reservista_circunscricao_" + that.instanceId).val() : "",
            regiao: (possuiReservista == "Sim") ? $div.find("#cand_reservista_regiao_" + that.instanceId).val() : "",
            orgao: (possuiReservista == "Sim") ? $div.find("#cand_reservista_orgao_" + that.instanceId).val() : ""
        };

        // MONTAGEM DO JSON QUE VAI PARA O FLUIG
        var dadosCandidato = {
            "origem_dados": "widget_saveAndSendTask",
            "FUN_CC": "3010",
            "FUN_TIPOLOGRADOURO": "1",
            "GRAUINSTRUCAOCod": "6",
            "NACIONALIDADECod": codNacao,
            "ESTADONatalCod": "MG",
            "txtCODMUNICIPIO": "3152501",
            "txtCODETD": "MG",
            "txtCODPAIS": "1",
            "CODUFCARTIDENTIDADE": "MG",
            "CODUFCTPS": "MG",
            "FUN_SALARIOBASE": "2000.00",

            "txtEstadoCivil": estCivilValor,
            "CORRACA": racaProcesso,
            "TipoSanguineo": $div.find("#cand_tipo_sanguineo_" + that.instanceId).val(),

            "txtNomeColaborador": $div.find("#cand_nomeCompleto_" + that.instanceId).val(),
            "cpfcnpj": $div.find("#cand_cpf_" + that.instanceId).val(),
            "dtDataNascColaborador": formatarDataBR($div.find("#cand_nascimento_" + that.instanceId).val()),
            "txtEmail": $div.find("#cand_email_" + that.instanceId).val(),
            "txtCELULAR": $div.find("#cand_celular_" + that.instanceId).val(),
            "txtSexo": sexoProcesso,
            "CORRACA_DESC": racaProcesso,
            "NACIONALIDADE": descNacao,
            "txtNaturalidade": $div.find("#cand_naturalidade_" + that.instanceId).val(),
            "ESTADO": $div.find("#cand_estado_natal_" + that.instanceId).val(),
            "txtPossuiDeficiencia": possuiDef, "txtTipoDeficiencia": tipoDef,
            "DEFICIENTEFISICO": defFisico, "DEFICIENTEAUDITIVO": defAuditivo, "DEFICIENTEVISUAL": defVisual,
            "DEFICIENTEMENTAL": defMental, "DEFICIENTEINTELECTUAL": defIntelectual,

            "TxtRg": $div.find("#cand_rg_" + that.instanceId).val(),
            "UFCARTIDENTIDADE": $div.find("#cand_rg_uf_" + that.instanceId).val(),
            "ORGAOCARTIDENTIDADE": $div.find("#cand_rg_orgao_" + that.instanceId).val(),
            "DTEMISSAOIDENT": formatarDataBR($div.find("#cand_rg_data_emissao_" + that.instanceId).val()),

            // NOVOS DADOS DE TÍTULO
            "Titulo_Digital": $div.find("#cand_titulo_digital_" + that.instanceId).val(),
            "TITULOELEITOR": $div.find("#cand_titulo_eleitor_" + that.instanceId).val(),
            "ZONATITELEITOR": $div.find("#cand_titulo_zona_" + that.instanceId).val(),
            "SECAOTITELEITOR": $div.find("#cand_titulo_secao_" + that.instanceId).val(),
            "UFTITULO": $div.find("#cand_titulo_uf_" + that.instanceId).val(),
            "DTTITELEITOR": formatarDataBR($div.find("#cand_titulo_data_emissao_" + that.instanceId).val()),

            // NOVOS DADOS DE PIS / CTPS
            "PIS_Primeiro_Emprego": $div.find("#cand_primeiro_emprego_" + that.instanceId).val(),
            "PIS": $div.find("#cand_pis_" + that.instanceId).val(),
            "PIS_Ano_Primeiro_Emp": $div.find("#cand_ano_primeiro_emprego_" + that.instanceId).val(),

            "CTPS_Fisica_Digital": $div.find("#cand_tipo_ctps_" + that.instanceId).val(),
            "txtCartTrab": $div.find("#cand_ctps_numero_" + that.instanceId).val(),
            "txtSerieCart": $div.find("#cand_ctps_serie_" + that.instanceId).val(),
            "UFCARTTRAB": $div.find("#cand_ctps_uf_" + that.instanceId).val(),
            "dtDataEmissaoCartTrab": formatarDataBR($div.find("#cand_ctps_data_emissao_" + that.instanceId).val()),

            "txtCNH_Possui": possuiCNH, "CARTMOTORISTA": dadosCNH.numero, "TIPOCARTHABILIT": dadosCNH.tipo,
            "DTVENCHABILIT": dadosCNH.vencimento, "ORGEMISSORCNH": dadosCNH.orgao, "DTEMISSAOCNH": dadosCNH.emissao,
            "UFCNH": dadosCNH.uf, "CodUFCNH": dadosCNH.uf, "DTEmPrimCNH": dadosCNH.primeira,

            "txtReservista_Possui": possuiReservista,
            "CERTIFRESERV": dadosReservista.numero,
            "DtCERTIFRESERV": dadosReservista.emissao,
            "SitMilitar": dadosReservista.situacao,
            "Reservista_Categoria": dadosReservista.categoria,
            "Reservista_Circunscricao": dadosReservista.circunscricao,
            "Reservista_Regiao": dadosReservista.regiao,
            "Reservista_Orgao": dadosReservista.orgao,

            "txtCEP": $div.find("#cand_cep_" + that.instanceId).val(),
            "txtNOMETIPORUA": $div.find("#cand_tipo_logradouro_" + that.instanceId).val(),
            "txtRUA": $div.find("#cand_endereco_" + that.instanceId).val(),
            "txtNUMERO": $div.find("#cand_numero_" + that.instanceId).val(),
            "txtCOMPLEMENTO": $div.find("#cand_complemento_" + that.instanceId).val(),
            "txtNOMETIPOBAIRRO": $div.find("#cand_tipo_bairro_" + that.instanceId).val(),
            "txtBAIRRO": $div.find("#cand_bairro_" + that.instanceId).val(),
            "txtNOMEMUNICIPIO": $div.find("#cand_cidade_" + that.instanceId).val(),
            "txtNOMECODETD": $div.find("#cand_uf_" + that.instanceId).val(),
            "txtPais": $div.find("#cand_pais_" + that.instanceId).val(),

            "ValeTransp": $div.find("#cand_vt_opcao_" + that.instanceId).val() === "Opto" ? "1" : "2",

            "TxtIncPlanoSaudeOpcao": $div.find("#cand_ps_opcao_" + that.instanceId).val(),
            "TxtIncPlanoSaudeTipo": ($div.find("#cand_ps_opcao_" + that.instanceId).val() || "").indexOf("Opto") !== -1 ? $div.find("#cand_ps_tipo_plano_" + that.instanceId + " option:selected").text() : "",
            "TxtDepsPlanoSaude": strDependentesPS,

            "BancoPAgto": $div.find("#cand_banco_" + that.instanceId).val(),
            "AgPagto": $div.find("#cand_agencia_" + that.instanceId).val(),
            "ContPagto": $div.find("#cand_conta_corrente_" + that.instanceId).val(),
            "TipodeContPagto": tipoContaProcesso,
            "txtTipoChavePix": $div.find("#cand_tipo_pix_" + that.instanceId).val(),
            "txtChavePix": $div.find("#cand_chave_pix_" + that.instanceId).val(),

            "txtEscolaridade": $div.find("#cand_grau_instrucao_" + that.instanceId).val(),
            "txtTamanhoCamisa": $div.find("#cand_tamanho_camisa_" + that.instanceId).val(),
            "txtTamanhoCalcado": $div.find("#cand_tamanho_calcado_" + that.instanceId).val(),
            "txtTamanhoCalca": $div.find("#cand_tamanho_calca_" + that.instanceId).val(),
            "txtNomeCurso": $div.find("#cand_curso_" + that.instanceId).val(),
            "txtInstituicaoEnsino": $div.find("#cand_instituicao_" + that.instanceId).val(),
            "txtAnoConclusao": $div.find("#cand_ano_conclusao_" + that.instanceId).val(),
            "txtPeriodoCurso": $div.find("#cand_curso_periodo_" + that.instanceId).val(),
            "txtCnpjInstituicao": $div.find("#cand_instituicao_cnpj_" + that.instanceId).val(),
            "txtNomeCoordenador": $div.find("#cand_coordenador_nome_" + that.instanceId).val(),
            "txtNacionalidadeCoordenador": $div.find("#cand_coordenador_nacionalidade_" + that.instanceId).val(),
            "txtNomeEmergencia": $div.find("#cand_emergencia_nome_" + that.instanceId).val(),
            "txtParentescoEmergencia": $div.find("#cand_emergencia_parentesco_" + that.instanceId).val(),
            "txtTelefoneEmergencia": $div.find("#cand_emergencia_telefone_" + that.instanceId).val(),

            // DADOS DE SUS, REGISTRO PROFISSIONAL E PASSAPORTE
            "Cartao_SUS": $div.find("#cand_cartao_sus_" + that.instanceId).val(),
            "Reg_Prof_Orgao": $div.find("#cand_reg_prof_orgao_" + that.instanceId).val(),
            "Reg_Prof_UF": $div.find("#cand_reg_prof_uf_" + that.instanceId).val(),
            "Reg_Prof_Num": $div.find("#cand_reg_prof_num_" + that.instanceId).val(),
            "Reg_Prof_Emissao": formatarDataBR($div.find("#cand_reg_prof_emissao_" + that.instanceId).val()),
            "Passaporte_Num": $div.find("#cand_passaporte_num_" + that.instanceId).val(),
            "Passaporte_Emissao": formatarDataBR($div.find("#cand_passaporte_emissao_" + that.instanceId).val()),
            "Passaporte_Validade": formatarDataBR($div.find("#cand_passaporte_validade_" + that.instanceId).val()),

            // DADOS EXATOS DA FILIAÇÃO (Pai e Mãe)
            "txtNomDepen2": $div.find("#cand_mae_nome_" + that.instanceId).val(),
            "txtEstCivilDepen2": $div.find("#cand_mae_est_civil_" + that.instanceId).val(),
            "txtSexoDepen2": ($div.find("#cand_mae_sexo_" + that.instanceId).val() === "Masculino") ? "M" : "F",
            "txtDtNascDepen2": formatarDataBR($div.find("#cand_mae_nasc_" + that.instanceId).val()),
            "TxtCPFDep2": $div.find("#cand_mae_cpf_" + that.instanceId).val(),

            "txtNomDepen3": $div.find("#cand_pai_nome_" + that.instanceId).val(),
            "txtEstCivilDepen3": $div.find("#cand_pai_est_civil_" + that.instanceId).val(),
            "txtSexoDepen3": ($div.find("#cand_pai_sexo_" + that.instanceId).val() === "Feminino") ? "F" : "M",
            "txtDtNascDepen3": formatarDataBR($div.find("#cand_pai_nasc_" + that.instanceId).val()),
            "TxtCPFDep3": $div.find("#cand_pai_cpf_" + that.instanceId).val(),

            "cand_foto_nome": $div.find("#cand_foto_nome_" + that.instanceId).val() || "",
            "cand_foto_base64": $div.find("#cand_foto_base64_" + that.instanceId).val() || "",
            "carta_assinada_nome": $div.find("#carta_assinada_nome_" + that.instanceId).val() || "",
            "carta_assinada_base64": $div.find("#carta_assinada_base64_" + that.instanceId).val() || "",
            "termo_lgpd_assinada_nome": $div.find("#termo_lgpd_assinada_nome_" + that.instanceId).val() || "",
            "termo_lgpd_assinada_base64": $div.find("#termo_lgpd_assinada_base64_" + that.instanceId).val() || ""
        };

        // Substitua os campos estáticos de VT antigos por isso:
        var rotasVT = [];
        var countVT = 0;
        $div.find(".vt-card").each(function () {
            countVT++;
            var $card = $(this);

            // Cria índices igual aos dependentes (Ex: TxtVtDestino___1, TxtVtDestino___2)
            dadosCandidato["TxtVtDestino___" + countVT] = $card.find(".vt-destino").val();
            dadosCandidato["TxtVtTipo___" + countVT] = $card.find(".vt-tipo").val();
            dadosCandidato["TxtVtLinha___" + countVT] = $card.find(".vt-linha").val();
            dadosCandidato["TxtVtEmpresa___" + countVT] = $card.find(".vt-empresa").val();
            dadosCandidato["TxtVtValorTarifa___" + countVT] = $card.find(".vt-valor").val();

            rotasVT.push({ destino: $card.find(".vt-destino").val() });
        });
        dadosCandidato["json_rotas_vt"] = JSON.stringify(rotasVT);

        var selecionadosPS = [];
        $div.find(".check-plano-saude:checked").each(function () {
            // Adiciona o hífen no início para criar um aspecto de lista
            selecionadosPS.push("- " + $(this).data("nome-dep") + " (" + $(this).data("parentesco-dep") + ")");
        });

        // O join("\n") cria a quebra de linha que o textarea do Fluig reconhece
        var strDependentesPS = selecionadosPS.join("\n");

        // Salva em um campo do formulário (Ex: TxtDepsPlanoSaude)
        dadosCandidato["TxtDepsPlanoSaude"] = selecionadosPS.join(", ");

        var selecionadosPO = [];
        $div.find(".check-plano-odonto:checked").each(function () {
            selecionadosPO.push("- " + $(this).data("nome-dep") + " (" + $(this).data("parentesco-dep") + ")");
        });

        // Salva em um campo do formulário
        dadosCandidato["TxtDepsPlanoOdonto"] = selecionadosPO.join(", ");
        dadosCandidato["TxtIncPlanoOdontoOpcao"] = $div.find("#cand_po_opcao_" + that.instanceId).val();
        dadosCandidato["TxtIncPlanoOdontoTipo"] = $div.find("#cand_po_opcao_" + that.instanceId).val() === "Sim" ? $div.find("#cand_po_tipo_plano_" + that.instanceId + " option:selected").text() : "";

        var deps = [];
        var countDeps = 0;
        $div.find(".dependente-card").each(function () {
            countDeps++; var i = countDeps; var $card = $(this);
            var parentesco = $card.find(".dep-parentesco").val();

            dadosCandidato["txtNomDepen___" + i] = $card.find(".dep-nome").val();
            dadosCandidato["txtParentescoDepen___" + i] = parentesco;
            dadosCandidato["cpDataNascimentoDep___" + i] = formatarDataBR($card.find(".dep-nasc").val());
            dadosCandidato["TxtCPFDep___" + i] = $card.find(".dep-cpf").val();

            var estCivilDepValor = $card.find(".dep-est-civil").val() || "";
            dadosCandidato["txtEstadoCivilDepen___" + i] = estCivilDepValor;
            dadosCandidato["txtEstCivilCodDepen___" + i] = estCivilDepValor;

            var sexoDep = $card.find(".dep-sexo").val();
            dadosCandidato["txtSexoDepen___" + i] = (sexoDep === "Masculino") ? "M" : (sexoDep === "Feminino") ? "F" : "";

            // NOVOS CAMPOS ADICIONADOS (Ajuste os nomes "TxtRgDep___", "TxtCartaoSusDep___" consoante o formulário Fluig)
            dadosCandidato["TxtRgDep___" + i] = $card.find(".dep-rg").val();
            dadosCandidato["TxtCartaoSusDep___" + i] = $card.find(".dep-sus").val();
            dadosCandidato["TxtObsDep___" + i] = $card.find(".dep-obs").val();

            // INCIDÊNCIAS (Hardcoded para 0, exceto Salário Família)
            dadosCandidato["TxtIncIRRF___" + i] = "0";
            dadosCandidato["TxtIncMedica___" + i] = "0";
            dadosCandidato["TxtIncINSS___" + i] = "0";
            dadosCandidato["TxtIncPensao___" + i] = "0";

            // SALÁRIO FAMÍLIA (O único que mantivemos na tela)
            dadosCandidato["TxtIncSalFamilia___" + i] = ($card.find(".dep-sf").val() == "Sim" ? "1" : "0");

            deps.push({ nome: $card.find(".dep-nome").val() });
        });
        dadosCandidato["json_dependentes"] = JSON.stringify(deps);

        return dadosCandidato;
    },

    soapUpdateCardData: function (cardId, dadosObjeto, callbackSucesso, callbackErro) {
        var that = this;
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        // Blindagem: Remover propriedades indefinidas para evitar sujeira no XML
        var cleanDados = {};
        for (var k in dadosObjeto) {
            if (dadosObjeto.hasOwnProperty(k)) {
                cleanDados[k] = (dadosObjeto[k] === undefined || dadosObjeto[k] === null) ? "" : String(dadosObjeto[k]);
            }
        }

        var payloadObj = {
            cardId: parseInt(cardId, 10), // FORÇA CONVERSÃO PARA INTEIRO
            cardData: cleanDados
        };

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "UPDATE_CARD_DATA", _finalValue: "UPDATE_CARD_DATA", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {

                        // CORREÇÃO: LEITURA SEGURA DO RETORNO (Evita crash do jQuery)
                        var respStr = rProxy.response;
                        try {
                            var jsonResp = JSON.parse(respStr);
                            if (jsonResp.response) respStr = jsonResp.response;
                        } catch (e) { }

                        if (respStr.indexOf("faultstring") > -1) {
                            try {
                                var parser = new DOMParser();
                                var xmlDoc = parser.parseFromString(respStr, "text/xml");
                                var faultText = xmlDoc.getElementsByTagName("faultstring")[0].textContent;
                                callbackErro(faultText);
                            } catch (e) {
                                callbackErro("Erro no Fluig: " + respStr);
                            }
                        } else {
                            callbackSucesso(respStr);
                        }

                    } else {
                        callbackErro(rProxy.message + " - " + rProxy.response);
                    }
                } else {
                    callbackErro("Retorno vazio do proxy ao tentar updateCardData.");
                }
            },
            error: function (xhr, status, error) { callbackErro("Erro na requisição Update via Proxy: " + error); }
        });
    },

    obterDadosParaPersistencia: function (opcoes) {
        var dados = this.getDadosFormulario();

        // Remove payloads pesados e preserva apenas marcadores leves de upload.
        Object.keys(dados).forEach(function (k) {
            if (k.indexOf("_base64") > -1) {
                var valor = dados[k];
                if (valor === "[ENVIADO_PROCESSO]" || valor === "[ANEXO DO PROCESSO]") return;
                delete dados[k];
            }
        });

        dados["cpPassoAtualCandidato"] = (opcoes && opcoes.passoAtual) ? opcoes.passoAtual : this.passoAtual;
        return dados;
    },

    persistirFormularioNoFluig: function (opcoes, callbackSucesso, callbackErro) {
        var that = this;

        if (typeof opcoes === "function") {
            callbackErro = callbackSucesso;
            callbackSucesso = opcoes;
            opcoes = {};
        }

        if (!that.documentIdFicha) {
            if (typeof callbackErro === "function") callbackErro("ID da ficha não carregado.");
            return;
        }

        var dadosPersistencia = that.obterDadosParaPersistencia(opcoes || {});
        dadosPersistencia["cand_foto_nome"] = $("#cand_foto_nome_" + that.instanceId).val() || "";
        dadosPersistencia["carta_assinada_nome"] = $("#carta_assinada_nome_" + that.instanceId).val() || "";
        dadosPersistencia["termo_lgpd_assinada_nome"] = $("#termo_lgpd_assinada_nome_" + that.instanceId).val() || "";

        var fotoBase64 = $("#cand_foto_base64_" + that.instanceId).val() || "";
        if (fotoBase64 === "[ENVIADO_PROCESSO]" || fotoBase64 === "[ANEXO DO PROCESSO]") {
            dadosPersistencia["cand_foto_base64"] = fotoBase64;
        } else {
            delete dadosPersistencia["cand_foto_base64"];
        }

        delete dadosPersistencia["carta_assinada_base64"];
        delete dadosPersistencia["termo_lgpd_assinada_base64"];

        that.soapUpdateCardData(that.documentIdFicha, dadosPersistencia, function (resposta) {
            if (typeof callbackSucesso === "function") callbackSucesso(resposta);
        }, function (erro) {
            console.error("Erro ao persistir formulário no Fluig:", erro);
            if (typeof callbackErro === "function") callbackErro(erro);
        });
    },

    soapSaveAndSendTask: function (comentarios, callbackSucesso, callbackErro) {
        var that = this;
        var idSolicitacao = $("#idSolicitacaoRH_" + that.instanceId).val();
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        var pdfAuditoriaBase64 = $("#ficha_auditoria_base64_" + that.instanceId).val();
        var attachmentsXml = "";

        if (pdfAuditoriaBase64 && pdfAuditoriaBase64 !== "") {
            var cleanBase64 = pdfAuditoriaBase64.indexOf(",") > -1 ? pdfAuditoriaBase64.split(",")[1] : pdfAuditoriaBase64;
            attachmentsXml = '<item><attachmentSequence>0</attachmentSequence><attachments><attach>true</attach>' +
                '<fileName>Ficha_Cadastral_Auditoria.pdf</fileName>' +
                '<filecontent>' + cleanBase64 + '</filecontent></attachments>' +
                '<description>Ficha Cadastral de Auditoria</description>' +
                '<fileName>Ficha_Cadastral_Auditoria.pdf</fileName></item>';
        }

        var payloadObj = {
            processInstanceId: parseInt(idSolicitacao, 10), choosedState: 97, comments: comentarios, attachmentsXml: attachmentsXml
        };

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "SAVE_AND_SEND_TASK", _finalValue: "SAVE_AND_SEND_TASK", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                var respStr = "";
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    respStr = resProxy.content.values[0].response;
                }

                if (respStr.indexOf("ERROR:") > -1 || respStr.indexOf("could not execute statement") > -1) {
                    callbackErro("Erro ao movimentar no Fluig: Problema de gravação no banco de dados.");
                } else if (respStr.indexOf("faultstring") > -1) {
                    callbackErro("Erro na integração SOAP.");
                } else {
                    callbackSucesso(respStr);
                }
            },
            error: function (xhr, status, error) { callbackErro("Falha na comunicação: " + error); }
        });
    },

    enviarAPI: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        var idSolicitacao = $("#idSolicitacaoRH_" + this.instanceId).val();
        var btn = $div.find("[data-finish]");
        var textoOriginal = btn.html();

        // ==========================================================
        // BARREIRA DE VALIDAÇÃO: CARTA PROPOSTA E LGPD
        // ==========================================================
        if (window.ignorarValidacao !== true) {
            var statusProp = $("#tae_proposta_status_" + that.instanceId).val();
            var statusLgpd = $("#tae_lgpd_status_" + that.instanceId).val();

            var b64Prop = $("#carta_assinada_base64_" + that.instanceId).val();
            var b64Lgpd = $("#termo_lgpd_assinada_base64_" + that.instanceId).val();

            if (statusProp !== "assinado" || statusLgpd !== "assinado") {
                FLUIGC.toast({ title: 'Atenção', message: 'A Carta Proposta ou o Termo LGPD ainda não foram assinados na TOTVS. Volte nas etapas 1 e 2.', type: 'warning' });
                return;
            }

            if (!b64Prop || !b64Lgpd) {
                FLUIGC.toast({ title: 'Atenção', message: 'Os documentos assinados ainda estão a ser descarregados do servidor. Aguarde alguns segundos e clique novamente.', type: 'info' });
                return;
            }
        }
        // ==========================================================

        var larguraAtual = btn.outerWidth();
        btn.css("width", Math.max(larguraAtual, 200) + "px");
        btn.prop("disabled", true).html('<i class="flaticon flaticon-refresh is-spinning"></i> Aguarde...');
        $div.find("[data-nav-back]").prop("disabled", true);

        var containerProgresso = '<div id="box_progresso_envio_' + that.instanceId + '" style="margin-top: 20px; padding: 25px; background: #fdfdfd; border: 1px solid #e3e3e3; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">' +
            '<h4 id="texto_progresso_' + that.instanceId + '" style="color: #31708f; margin-bottom: 15px; font-weight: 400;">Gerando Ficha Cadastral Segura...</h4>' +
            '<div class="progress" style="height: 22px; margin-bottom: 0; border-radius: 10px;">' +
            '<div id="barra_progresso_' + that.instanceId + '" class="progress-bar progress-bar-striped active progress-bar-info" role="progressbar" style="width: 15%; transition: width 0.8s ease;"></div>' +
            '</div></div>';

        $("#box_progresso_envio_" + that.instanceId).remove();
        $div.find("#form_main_container hr").before(containerProgresso);

        var $textoProgresso = $("#texto_progresso_" + that.instanceId);
        var $barraProgresso = $("#barra_progresso_" + that.instanceId);

        var etapas = [
            { txt: "Compactando documentos...", pct: 35 },
            { txt: "Transferindo arquivos para o servidor...", pct: 60 },
            { txt: "Processando os seus dados...", pct: 80 },
            { txt: "Só mais um instante, finalizando...", pct: 95 }
        ];
        var msgIndex = 0;

        var intervalFeedback = setInterval(function () {
            if (msgIndex < etapas.length) {
                $textoProgresso.html(etapas[msgIndex].txt);
                $barraProgresso.css("width", etapas[msgIndex].pct + "%");
                msgIndex++;
            }
        }, 3000);

        function tratarErro(msg) {
            clearInterval(intervalFeedback);
            $("#box_progresso_envio_" + that.instanceId).slideUp(function () { $(this).remove(); });
            FLUIGC.toast({ title: 'Erro', message: msg, type: 'danger' });
            btn.css("width", "").prop("disabled", false).html(textoOriginal);
            $div.find("[data-nav-back]").prop("disabled", false);
            console.error(msg);
        }

        if (!idSolicitacao) { tratarErro("ID da Solicitação não encontrado."); return; }
        if (!that.documentIdFicha) { tratarErro("Erro Técnico: ID da Ficha não carregado."); return; }

        var dadosCandidato = this.getDadosFormulario();

        //  NOVO: Gera a ficha em PDF antes de começar as chamadas de API
        that.gerarFichaCadastralPDF(dadosCandidato, function (pdfBase64) {
            var base64Clean = pdfBase64.split(',')[1];

            // Guarda o PDF numa input oculta
            if ($("#ficha_auditoria_base64_" + that.instanceId).length === 0) {
                $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="ficha_auditoria_base64_' + that.instanceId + '">');
                $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="ficha_auditoria_nome_' + that.instanceId + '" value="Ficha_Cadastral_Original.pdf">');
            }
            $("#ficha_auditoria_base64_" + that.instanceId).val(base64Clean);

            // PDF gerado com sucesso, agora envia tudo para o Fluig!
            that.continuarEnvioFluig(dadosCandidato, idSolicitacao, intervalFeedback, tratarErro);

        }, function (errPdf) {
            tratarErro("Erro ao gerar PDF de auditoria: " + errPdf);
        });
    },

    /**
     * Função auxiliar para concluir o envio da tarefa (Isolada para facilitar o fluxo assíncrono)
     */
    continuarEnvioFluig: function (dadosCandidato, idSolicitacao, intervalFeedback, tratarErro) {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        // Prepara os dados de texto informando que os ficheiros foram anexados via integração
        for (var i = 0; i < this.configDocs.length; i++) {
            var doc = this.configDocs[i]; var nomeCampo = doc.doc_campo_interno ? doc.doc_campo_interno.trim() : "";
            if (nomeCampo) {
                dadosCandidato[nomeCampo + "_nome"] = $("#" + nomeCampo + "_nome_" + this.instanceId).val();
                dadosCandidato[nomeCampo + "_base64"] = "[ANEXO DO PROCESSO]";
            }
        }
        $div.find(".dependente-card").each(function (index) {
            var nomePensao = $(this).find(".dep-pensao-anexo-nome").val();
            if (nomePensao) {
                dadosCandidato["txtOficioPensaoNome___" + (index + 1)] = nomePensao;
                dadosCandidato["txtOficioPensaoBase64___" + (index + 1)] = "[ANEXO DO PROCESSO]";
            }
        });

        // Efetua as chamadas SOAP para gravar o formulário e movimentar a tarefa
        that.soapUpdateCardData(that.documentIdFicha, dadosCandidato, function (sucessoUpdate) {

            that.soapSaveAndSendTask("Envio final via Widget", function (sucessoMove) {
                clearInterval(intervalFeedback);

                // FINALIZAÇÃO VISUAL: Enche a barra até 100% e muda para Verde
                $("#barra_progresso_" + that.instanceId).removeClass("progress-bar-info active").addClass("progress-bar-success").css("width", "100%");
                $("#texto_progresso_" + that.instanceId).html("Enviado com sucesso!").css("color", "#3c763d");

                that.limparRascunhoLocal();
                console.log("Sucesso Total!", sucessoMove);

                // Aguarda 800ms para o candidato ver a barra encher, e depois mostra a tela final
                setTimeout(function () {
                    $div.find("#form_main_container").html('<div class="alert alert-success text-center" style="padding:40px; margin-top:20px;"><h3>Sucesso!</h3><p style="font-size: 16px;">Seus dados e documentos foram enviados e o processo foi encaminhado ao RH.</p><i class="flaticon flaticon-check-circle icon-xl text-success" style="font-size: 60px; margin-top: 20px; display: inline-block;"></i></div>');
                    $('html, body').animate({ scrollTop: $div.offset().top - 100 }, 'slow');
                }, 800);

            }, function (erroMove) {
                tratarErro("Erro ao mover processo: " + erroMove);
            });
        }, function (erroUpdate) {
            tratarErro("Erro ao salvar dados iniciais: " + erroUpdate);
        });
    },

    proximoPasso: function () {
        var that = this;
        if (this.validarPasso(this.passoAtual) && this.passoAtual < this.totalPassos) {
            this.mostrarLoading(true);
            this.salvarRascunhoLocal();

            // LÓGICA DE PULAR ETAPA PARA ESTÁGIO
            var proximo = that.passoAtual + 1;
            if (proximo === 4 && (that.jornadaAdmissao === "Estagio" || that.jornadaAdmissao === "Estágio")) {
                proximo = 5; // Pula a aba de dependentes e vai direto para Filiação
            }

            this.persistirFormularioNoFluig({ passoAtual: proximo }, function (sucesso) {
                that.mostrarLoading(false);
                that.irParaPasso(proximo);
                that.salvarRascunhoLocal();
            }, function (erro) {
                that.mostrarLoading(false);
                console.error("Erro ao persistir no Fluig. Avanço cancelado: ", erro);
                FLUIGC.toast({
                    title: 'Erro',
                    message: 'Não foi possível salvar seu progresso no Fluig. Tente novamente.',
                    type: 'danger'
                });
            });
        }
    },

    passoAnterior: function () {
        if (this.passoAtual > 1) {
            var anterior = this.passoAtual - 1;

            // LÓGICA DE PULAR ETAPA AO VOLTAR PARA ESTÁGIO
            if (anterior === 4 && (this.jornadaAdmissao === "Estagio" || this.jornadaAdmissao === "Estágio")) {
                anterior = 3; // Pula a aba de dependentes e volta direto para formação
            }

            var that = this;
            this.persistirFormularioNoFluig({ passoAtual: anterior }, function () {
                that.irParaPasso(anterior);
            }, function (erro) {
                console.error("Erro ao persistir passo anterior no Fluig: ", erro);
                FLUIGC.toast({
                    title: 'Erro',
                    message: 'Não foi possível salvar o passo anterior no Fluig.',
                    type: 'danger'
                });
            });
        }
    },

    irParaPasso: function (p) {
        var that = this;
        var $d = $("#AdmissaoWidget_" + this.instanceId);

        console.log("[DEBUG LGPD] Mudando para o passo: " + p);

        $d.find('.step-item').removeClass('active completed');
        for (var i = 1; i < p; i++) $d.find('.step-item[data-step="' + i + '"]').addClass('completed');
        $d.find('.step-item[data-step="' + p + '"]').addClass('active');
        $d.find('.step-content').removeClass('active');
        $d.find('.step-content[data-step-content="' + p + '"]').addClass('active');

        // ====== CARREGAMENTO SOB DEMANDA DO PRIMEIRO LINK (PASSO 1) ======
        if (p === 1 || p === "1") {
            var $iframeProp = $d.find("#pdf_viewer_proposta_" + that.instanceId);
            var srcPropAtual = $iframeProp.attr("src");

            if (that.idPdfProposta && !srcPropAtual) {
                that.obterBase64GED(that.idPdfProposta, function (base64) {
                    if (base64) {
                        $iframeProp.attr("src", that.base64ToBlobUrl(base64, 'application/pdf')).show();
                        $d.find("#msg_carregando_proposta_" + that.instanceId).hide();
                    }
                });
            }

            var $iframeLgpd = $d.find("#pdf_viewer_lgpd_" + that.instanceId);
            var srcAtual = $iframeLgpd.attr("src");

            if (that.idPdfLGPD && !srcAtual) {
                that.obterBase64GED(that.idPdfLGPD, function (base64) {

                    if (base64) {
                        // SOLUÇÃO: Converter o Base64 pesado para um arquivo virtual (Blob)
                        var byteCharacters = atob(base64);
                        var byteArrays = [];

                        // Fatiar em pedaços de 512 bytes para não travar a memória
                        for (var offset = 0; offset < byteCharacters.length; offset += 512) {
                            var slice = byteCharacters.slice(offset, offset + 512);
                            var byteNumbers = new Array(slice.length);
                            for (var i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }
                            var byteArray = new Uint8Array(byteNumbers);
                            byteArrays.push(byteArray);
                        }

                        // Cria o arquivo virtual PDF
                        var blob = new Blob(byteArrays, { type: 'application/pdf' });

                        // Gera um link interno do navegador (ex: blob:http://seufluig.com/...)
                        var blobUrl = URL.createObjectURL(blob);

                        // Injeta o link super leve no iframe
                        $iframeLgpd.attr("src", blobUrl).show();

                        $d.find("#msg_carregando_lgpd_" + that.instanceId).hide();

                    } else {
                        console.error("[DEBUG LGPD] ERRO: Base64 veio vazio do servidor!");
                    }
                });
            }
        }
        // ========================================================

        if (p === 5) this.preencherFiliacaoViaDependentes();
        if (p === 6) this.atualizarOpcoesPlanoSaude();
        if (p === 8) this.gerarResumoFinal();

        this.passoAtual = p;
        this.atualizarBotoes();
        $('html,body').animate({ scrollTop: $d.offset().top - 60 }, 'fast');
    },

    atualizarBotoes: function () { var $d = $("#AdmissaoWidget_" + this.instanceId); $d.find("[data-nav-back]").prop("disabled", this.passoAtual === 1); if (this.passoAtual === this.totalPassos) { $d.find("[data-nav-next]").hide(); $d.find("[data-finish]").show(); } else { $d.find("[data-nav-next]").show(); $d.find("[data-finish]").hide(); } },

    validarPasso: function (p) {
        if (p === 1 || p === "1") {
            var statusProp = $("#tae_proposta_status_" + this.instanceId).val();
            var statusLgpd = $("#tae_lgpd_status_" + this.instanceId).val();
            var b64Prop = $("#carta_assinada_base64_" + this.instanceId).val();
            var b64Lgpd = $("#termo_lgpd_assinada_base64_" + this.instanceId).val();

            if (statusProp !== "assinado" || statusLgpd !== "assinado" || !b64Prop || !b64Lgpd) {
                FLUIGC.toast({
                    title: 'Atenção',
                    message: 'Assine a Carta Proposta e o Termo LGPD antes de avançar.',
                    type: 'warning'
                });
                return false;
            }
            return true;
        }
        return AdmissaoObrigatoriedade.validarPasso(p, this);
    },

    adicionarDependenteManual: function () { this.adicionarDependente("", false); },

    adicionarDependente: function (parentesco, obrigatorio) {
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        var tmpl = $div.find(".template-dependente").html();

        if (!tmpl) {
            console.error("Template de dependente não encontrado no HTML.");
            return;
        }

        var uuid = new Date().getTime() + "_" + Math.floor(Math.random() * 1000);
        tmpl = tmpl.replace(/{{UUID}}/g, uuid);
        var $card = $(tmpl);

        $("#container_dependentes_" + this.instanceId).append($card);

        // Injeta o calendário moderno no novo campo gerado
        FLUIGC.calendar($card.find('.dep-nasc'), {
            language: 'pt-br',
            pickDate: true,
            pickTime: false
        });

        // CORREÇÃO AQUI: O card vem com display:none do HTML, então forçamos ele a aparecer!
        $card.slideDown(300);

        if (obrigatorio) {
            $card.find(".btn-remove-dep").remove();
            $card.find(".panel").css("border-left-color", "#d9534f");
        }
        if (parentesco) {
            var $select = $card.find(".dep-parentesco");
            $select.val(parentesco);
            if (obrigatorio) $select.css("pointer-events", "none").css("background-color", "#eee");
            $select.trigger('change');
        }
    },
    removerDependente: function (el) { $(el).closest('.dependente-card').fadeOut(function () { $(this).remove(); }); },
    abrirSelecaoArquivo: function (el) { $("#" + $(el).attr("data-trigger-upload")).trigger('click'); },

    adicionarRotaVT: function (trajetoPreDefinido) {
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        var tmpl = $div.find(".template-rota").html();
        var $card = $(tmpl);

        if (trajetoPreDefinido) {
            $card.find(".vt-destino").val(trajetoPreDefinido);
        }

        $card.css("display", "none");
        $("#container_rotas_vt_" + this.instanceId).append($card);
        $card.slideDown(300);

        // CHAMADA NOVA: Atualiza os números após adicionar
        this.reordenarIndicesRotas();
    },

    removerRotaVT: function (el) {
        var that = this;
        $(el).closest('.vt-card').fadeOut(function () {
            $(this).remove();
            // CHAMADA NOVA: Atualiza os números após remover para manter a sequência
            that.reordenarIndicesRotas();
            that.salvarRascunhoLocal();
        });
    },

    reordenarIndicesRotas: function () {
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        // Percorre todos os cards de rota e atualiza o texto do número
        $div.find(".vt-card").each(function (index) {
            $(this).find(".rota-num").text(index + 1);
        });
    },

    atualizarOpcoesPlanoSaude: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        var $container = $div.find("#container_dependentes_plano_" + this.instanceId);
        var $msgAviso = $div.find("#msg_elegibilidade_plano_" + this.instanceId);

        // 1. SALVA NA MEMÓRIA QUEM JÁ ESTAVA MARCADO
        var jaMarcados = [];
        $div.find(".check-plano-saude:checked").each(function () { jaMarcados.push($(this).data("nome-dep")); });

        try {
            var json = localStorage.getItem(that.getKeyStorage());
            if (json) {
                var estado = JSON.parse(json);
                if (estado.depsPS) { estado.depsPS.forEach(function(nome) { if (jaMarcados.indexOf(nome) === -1) jaMarcados.push(nome); }); }
            }
        } catch(e) {}

        $container.empty();
        var possuiElegivel = false;
        var $listaDependentes = $div.find("#container_dependentes_" + this.instanceId + " .dependente-card");

        $listaDependentes.each(function () {
            var $card = $(this);
            var nome = $card.find(".dep-nome").val() || "";
            var parentesco = $card.find(".dep-parentesco").val() || "";
            var strParentesco = String(parentesco).toUpperCase();

            var isFilho = (strParentesco.indexOf("FILHO") > -1 || strParentesco.indexOf("ENTEADO") > -1);
            var isConjuge = (strParentesco.indexOf("CONJUGE") > -1 || strParentesco.indexOf("CÔNJUGE") > -1 || strParentesco.indexOf("COMPANHEIRO") > -1);

            if (nome.trim() !== "" && (isFilho || isConjuge)) {
                possuiElegivel = true;
                var descParentesco = isConjuge ? "Cônjuge" : "Filho(a)";
                
                // 2. RECRIAR COM A MARCAÇÃO ATIVA
                var checkedAttr = (jaMarcados.indexOf(nome) > -1) ? "checked" : "";

                var html = '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px;">' +
                    '    <label>' +
                    '        <input type="checkbox" class="check-plano-saude" data-nome-dep="' + nome + '" data-parentesco-dep="' + descParentesco + '" ' + checkedAttr + '>' +
                    '        <strong>' + nome + '</strong> <small class="text-muted">(' + descParentesco + ')</small>' +
                    '    </label>' +
                    '</div>';
                $container.append(html);
            }
        });

        var opcaoSelecionada = $div.find('#cand_ps_opcao_' + that.instanceId).val() || "";
        $msgAviso.hide(); $container.hide();

        if (opcaoSelecionada.indexOf("Opto") > -1) {
            if (possuiElegivel) $container.show();
            else $msgAviso.show(); 
        }
    },

    uploadAnexoIndividual: function (base64Clean, fileName, description, callbackSucesso, callbackErro) {
        var that = this;
        var opcoes = arguments[5] || {};
        var idSolicitacao = $("#idSolicitacaoRH_" + that.instanceId).val();
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        if (!idSolicitacao) { callbackErro("ID da solicitação não encontrado."); return; }
        if (!fileName || !base64Clean) { callbackErro("Arquivo inválido para upload."); return; }

        var processInstanceId = parseInt(idSolicitacao, 10);
        if (isNaN(processInstanceId) || processInstanceId <= 0) {
            callbackErro("ID da solicitação inválido.");
            return;
        }

        var payloadObj = {
            processInstanceId: processInstanceId,
            fileName: fileName,
            description: description,
            base64: base64Clean
        };

        if (opcoes.contentType) payloadObj.contentType = opcoes.contentType;
        if (opcoes.mimeType) payloadObj.mimeType = opcoes.mimeType;

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "UPLOAD_ATTACHMENT", _finalValue: "UPLOAD_ATTACHMENT", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var respStr = String(rProxy.response);
                        if (respStr.indexOf("ERROR:") > -1 || respStr.indexOf("could not execute statement") > -1 || respStr.indexOf("faultstring") > -1) {
                            console.error("Falha no upload do Fluig:", respStr);
                            callbackErro(respStr.replace(/^ERROR:\s*/i, "") || "Falha no Fluig ao salvar este arquivo.");
                        } else {
                            callbackSucesso(respStr);
                        }
                    } else {
                        callbackErro(rProxy.message || rProxy.response || "Erro ao comunicar com o servidor.");
                    }
                } else { callbackErro("Erro ao comunicar com o servidor."); }
            },
            error: function (xhr, status, error) { callbackErro("Falha na requisição de upload: " + error); }
        });
    },

    atualizarDependentesOdonto: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        var $container = $div.find("#container_dependentes_odonto_" + this.instanceId);
        var $msgAlerta = $div.find("#msg_elegibilidade_odonto_" + this.instanceId);
        var selecionadosAtuais = {};

        $container.find(".check-plano-odonto:checked").each(function () {
            var chaveAtual = String($(this).data("nome-dep") || "") + "||" + String($(this).data("parentesco-dep") || "");
            selecionadosAtuais[chaveAtual.toLowerCase()] = true;
        });

        $container.empty();
        var encontrouElegivel = false;

        // Busca todos os dependentes cadastrados (Passo 5)
        var $listaDependentes = $div.find("#container_dependentes_" + this.instanceId + " .dependente-card");

        $listaDependentes.each(function () {
            var $card = $(this);
            var parentesco = $card.find(".dep-parentesco").val() || "";
            var nome = $card.find(".dep-nome").val() || "";
            var strParentesco = String(parentesco).toUpperCase();

            // Regra de elegibilidade (Cônjuge, Companheiro(a), Filho(a), Enteado(a))
            var isFilho = (strParentesco.indexOf("FILHO") > -1 || strParentesco.indexOf("ENTEADO") > -1);
            var isConjuge = (strParentesco.indexOf("CONJUGE") > -1 || strParentesco.indexOf("CÔNJUGE") > -1 || strParentesco.indexOf("COMPANHEIRO") > -1);

            if (nome.trim() !== "" && (isFilho || isConjuge)) {
                encontrouElegivel = true;
                var descParentesco = isConjuge ? "Cônjuge" : "Filho(a)";

                // Cria o checkbox estilizado 
                // (Mantive os estilos inline aqui por segurança, mas herdam as classes do CSS que fizemos)
                var htmlCheckbox =
                    '<label class="dep-selection-item" style="display: flex; align-items: center; padding: 8px 12px; background: #fff; border: 1px solid #E0E6E5; border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: all 0.2s;">' +
                    '    <input type="checkbox" class="check-plano-odonto" data-nome-dep="' + nome + '" data-parentesco-dep="' + descParentesco + '" style="margin-right: 12px; width: 18px; height: 18px;">' +
                    '    <span><strong>' + nome + '</strong> <small class="text-muted">(' + descParentesco + ')</small></span>' +
                    '</label>';

                $container.append(htmlCheckbox);
                var chaveItem = (nome + "||" + descParentesco).toLowerCase();
                if (selecionadosAtuais[chaveItem]) {
                    $container.find(".check-plano-odonto").last().prop("checked", true);
                }
            }
        });

        // Mostra o alerta se não encontrar ninguém elegível
        if (!encontrouElegivel) {
            $msgAlerta.show();
        } else {
            $msgAlerta.hide();
        }
    },

    comprimirImagemBase64: function (file, callback) {
        // Se for PDF, não comprime, apenas converte para Base64
        if (file.type === "application/pdf") {
            var reader = new FileReader();
            reader.onload = function (e) { callback(e.target.result); };
            reader.readAsDataURL(file);
            return;
        }

        // Se for Imagem (JPG, PNG), faz a compressão usando HTML5 Canvas
        var readerImg = new FileReader();
        readerImg.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var MAX_WIDTH = 1200; // Resolução excelente para leitura de documentos
                var MAX_HEIGHT = 1200;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }

                canvas.width = width; canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Exporta como JPEG com 70% de qualidade (redução drástica de peso)
                var dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                callback(dataUrl);
            };
            img.src = e.target.result;
        };
        readerImg.readAsDataURL(file);
    },

    gerarNomeFotoArquivo: function () {
        return "Foto_Candidato_" + new Date().getTime() + ".jpg";
    },

    pararCameraFoto: function () {
        var video = $("#video_camera_" + this.instanceId)[0];
        if (this.cameraFotoStream) {
            this.cameraFotoStream.getTracks().forEach(function (track) { track.stop(); });
            this.cameraFotoStream = null;
        }
        if (video) {
            try { video.pause(); } catch (e) { }
            video.srcObject = null;
        }
    },

    resetarModalFoto: function () {
        var that = this;
        that.fotoCapturadaDataUrl = "";
        that.fotoCapturadaBase64 = "";
        that.fotoCapturadaNome = "";

        $("#foto_camera_stage_preview_" + that.instanceId).hide();
        $("#foto_camera_actions_preview_" + that.instanceId).hide();
        $("#foto_camera_stage_live_" + that.instanceId).show();
        $("#foto_camera_actions_live_" + that.instanceId).show();
        $("#foto_capturada_preview_" + that.instanceId).attr("src", "");
        $("#customModalCamera_" + that.instanceId).hide();
        that.pararCameraFoto();
    },

    abrirModalFoto: function () {
        var that = this;
        var video = $("#video_camera_" + that.instanceId)[0];

        that.fotoCapturadaDataUrl = "";
        that.fotoCapturadaBase64 = "";
        that.fotoCapturadaNome = "";
        $("#foto_camera_stage_preview_" + that.instanceId).hide();
        $("#foto_camera_actions_preview_" + that.instanceId).hide();
        $("#foto_camera_stage_live_" + that.instanceId).show();
        $("#foto_camera_actions_live_" + that.instanceId).show();
        $("#foto_capturada_preview_" + that.instanceId).attr("src", "");
        $("#customModalCamera_" + that.instanceId).css("display", "flex");

        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            FLUIGC.toast({ title: 'Erro', message: 'Seu navegador não suporta captura de câmera nativa.', type: 'danger' });
            return;
        }

        that.pararCameraFoto();

        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
            .then(function (stream) {
                that.cameraFotoStream = stream;
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.error("Erro ao acessar a câmera: ", err);
                that.resetarModalFoto();
                FLUIGC.toast({ title: 'Atenção', message: 'Permissão negada ou câmera indisponível.', type: 'warning' });
            });
    },

    capturarFotoModal: function () {
        var that = this;
        var video = $("#video_camera_" + that.instanceId)[0];
        var canvas = $("#canvas_camera_" + that.instanceId)[0];

        if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
            FLUIGC.toast({ title: 'Atenção', message: 'A câmera ainda não está pronta.', type: 'warning' });
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        var context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        var dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        var base64Clean = dataUrl.indexOf(",") > -1 ? dataUrl.split(",")[1] : dataUrl;

        that.pararCameraFoto();
        that.fotoCapturadaDataUrl = dataUrl;
        that.fotoCapturadaBase64 = base64Clean;
        that.fotoCapturadaNome = that.gerarNomeFotoArquivo();

        $("#foto_capturada_preview_" + that.instanceId).attr("src", dataUrl);
        $("#foto_camera_stage_live_" + that.instanceId).hide();
        $("#foto_camera_actions_live_" + that.instanceId).hide();
        $("#foto_camera_stage_preview_" + that.instanceId).show();
        $("#foto_camera_actions_preview_" + that.instanceId).show();
    },

    aplicarFotoNoPreviewPrincipal: function (dataUrl, fileName) {
        $("#preview_foto_" + this.instanceId)
            .css("background-image", "url(" + dataUrl + ")")
            .css("background-size", "cover")
            .css("background-position", "center")
            .html("");

        $("#cand_foto_base64_" + this.instanceId).val("[ENVIADO_PROCESSO]");
        $("#cand_foto_nome_" + this.instanceId).val(fileName);
    },

    enviarFotoParaGED: function (base64Clean, dataUrl, fileName, onSuccess, onError) {
        var that = this;
        FLUIGC.toast({ message: 'Enviando foto...', type: 'info' });

        that.uploadAnexoIndividual(
            base64Clean,
            fileName,
            "Foto do Candidato",
            function (sucesso) {
                that.aplicarFotoNoPreviewPrincipal(dataUrl, fileName);
                that.salvarRascunhoLocal();
                that.persistirFormularioNoFluig();
                FLUIGC.toast({ message: 'Foto salva com sucesso!', type: 'success' });
                if (typeof onSuccess === "function") onSuccess(sucesso);
            },
            function (erro) {
                if (typeof onError === "function") onError(erro);
                FLUIGC.toast({ title: 'Erro', message: 'Falha ao salvar a foto: ' + erro, type: 'danger' });
            },
            { contentType: "image/jpeg", fileType: "image/jpeg" }
        );
    },

    processarArquivo: function (el) {
        var that = this; var input = el; var prefixoCampo = $(el).attr("data-process-file");
        var $box = $("#box_" + prefixoCampo + "_" + that.instanceId); var $status = $("#status_" + prefixoCampo + "_" + that.instanceId);
        var $icon = $box.find("i.flaticon"); var $btn = $box.find("button");

        if (input.files && input.files[0]) {
            var file = input.files[0];
            if (file.size > 5 * 1024 * 1024) { FLUIGC.toast({ title: 'Erro', message: 'O arquivo excede 5MB.', type: 'danger' }); $(input).val(""); return; }

            $box.css({ "border": "2px dashed #f0ad4e", "background-color": "#fcf8e3", "opacity": "0.8" });
            $icon.removeClass("text-info flaticon-file-check flaticon-cloudupload text-success flaticon-check-circle").addClass("text-warning flaticon-refresh is-spinning");
            $btn.text("Enviando...").removeClass("btn-default btn-success").addClass("btn-warning").prop("disabled", true);
            $status.html("Transferindo...");

            that.comprimirImagemBase64(file, function (base64Otimizado) {
                var base64Clean = base64Otimizado.indexOf(",") > -1 ? base64Otimizado.split(",")[1] : base64Otimizado;
                that.uploadAnexoIndividual(base64Clean, file.name, prefixoCampo,
                    function (sucesso) {
                        $("#" + prefixoCampo + "_nome_" + that.instanceId).val(file.name);
                        $("#" + prefixoCampo + "_base64_" + that.instanceId).val("[ENVIADO_PROCESSO]");
                        $box.css({ "border": "2px solid #5cb85c", "background-color": "#dff0d8", "opacity": "1" });
                        $icon.removeClass("text-warning flaticon-refresh is-spinning").addClass("text-success flaticon-check-circle");
                        $box.find("h5").addClass("text-success");
                        $status.html('<strong style="color:#3c763d;">Salvo: </strong>' + file.name).removeClass("text-muted").addClass("text-success");
                        $btn.text("Substituir").removeClass("btn-warning").addClass("btn-success").prop("disabled", false);
                        FLUIGC.toast({ message: 'Documento salvo no Fluig com sucesso!', type: 'success' });
                        that.salvarRascunhoLocal();
                    },
                    function (erro) {
                        FLUIGC.toast({ title: 'Falha', message: erro, type: 'danger' });
                        $box.css({ "border": "2px dashed #d9534f", "background-color": "#f2dede", "opacity": "1" });
                        $icon.removeClass("text-warning flaticon-refresh is-spinning").addClass("text-danger flaticon-close");
                        $btn.text("Tentar Novamente").removeClass("btn-warning").addClass("btn-danger").prop("disabled", false);
                        $status.html("Erro. Tente de novo."); $(input).val("");
                    }
                );
            });
        }
    },

    mostrarLoading: function (exibir) {
        var $div = $("#AdmissaoWidget_" + this.instanceId);
        if (exibir) { if ($div.find("#loading_overlay").length === 0) $div.prepend('<div id="loading_overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.8); z-index:9999; display:flex; justify-content:center; align-items:center; flex-direction:column;"><i class="flaticon flaticon-refresh is-spinning icon-xl text-info"></i><h3 style="color:#555; margin-top:20px;">Carregando informações...</h3></div>'); $div.find("#loading_overlay").fadeIn(); } else $div.find("#loading_overlay").fadeOut();
    },
    bindings: { local: { 'nav-next': ['click_proximoPasso'], 'nav-back': ['click_passoAnterior'], 'finish': ['click_enviarAPI'], 'add-dependente': ['click_adicionarDependenteManual'], 'remove-row': ['click_removerDependente'], 'next-tab': ['click_avancarAba'] } },

    atualizarCofrePrimeiroLinkJSON: function (chaveDoc, novosDados) {
        var that = this;
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        var payloadObj = {
            name: "ds_dados_publicos_candidato",
            constraints: [{ _field: "idProcessoFluig", _initialValue: that.idOrigem, _finalValue: that.idOrigem, _type: 1, _likeSearch: false }]
        };

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        // 1. Busca os dados mais recentes do formulário
        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                if (resProxy.content && resProxy.content.values.length > 0 && resProxy.content.values[0].status == "success") {
                    var resData = JSON.parse(resProxy.content.values[0].response);
                    if (resData.records && resData.records.length > 0) {
                        var r = resData.records[0];

                        // Mapeia chaves para minúsculo para evitar erros de formatação
                        var rLower = {};
                        for (var keyOriginal in r) { rLower[keyOriginal.toLowerCase()] = r[keyOriginal]; }

                        var jsonStr = rLower["json_ids_primeiro_link"] || "{}";
                        var cofreOriginal = {};
                        try { cofreOriginal = JSON.parse(jsonStr); } catch (e) { }

                        // 2. Atualiza apenas a chave do documento específico (Proposta ou LGPD)
                        if (!cofreOriginal[chaveDoc]) cofreOriginal[chaveDoc] = {};
                        Object.assign(cofreOriginal[chaveDoc], novosDados);

                        // 3. Salva de volta no Fluig de forma definitiva
                        var payloadUpdate = { "json_ids_primeiro_link": JSON.stringify(cofreOriginal) };
                        that.soapUpdateCardData(that.documentIdFicha, payloadUpdate, function () {
                            console.log("Estado do documento " + chaveDoc + " salvo no Fluig com sucesso!");
                        }, function (err) { console.error("Erro ao salvar no Fluig:", err); });
                    }
                }
            }
        });
    },

    obterBase64GED: function (docId, callback) {
        var that = this;
        var url = WCMAPI.getServerURL() + '/api/public/2.0/documents/getDownloadURL/' + docId;

        $.ajax({
            url: url, type: 'GET',
            cache: true,
            headers: { "Authorization": that.getOAuthHeader(url, 'GET').Authorization },
            success: function (res) {
                var downloadUrl = res.content;
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var base64 = reader.result.split(',')[1];
                        callback(base64);
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', downloadUrl);
                xhr.responseType = 'blob';
                xhr.send();
            }
        });
    },

    // =========================================================================
    // LÓGICA PROCEDURAL DE RECUPERAÇÃO PÓS-F5 (PROPOSTA E LGPD)
    // =========================================================================
    restaurarUIAssinaturas: function () {
        var that = this;

        // --- CARTA PROPOSTA ---
        var idProp = $("#tae_proposta_iddoc_" + that.instanceId).val();
        var statusProp = $("#tae_proposta_status_" + that.instanceId).val();
        var linkProp = $("#tae_proposta_link_" + that.instanceId).val();
        var b64Prop = $("#carta_assinada_base64_" + that.instanceId).val();

        if (statusProp === "aguardando" && idProp) {
            $("#container_gerar_proposta_" + that.instanceId).hide();
            var htmlPainel = '<div class="alert alert-info text-center" style="padding:30px; border: 2px dashed #31708f; border-radius: 8px;">';
            htmlPainel += '<h3><i class="flaticon flaticon-email icon-md"></i> Verifique o seu E-mail</h3>';
            htmlPainel += '<p style="font-size: 16px;">Enviámos o código de segurança para assinar a Carta Proposta.</p>';
            if (linkProp) htmlPainel += '<a href="' + linkProp + '" target="_blank" class="btn btn-warning btn-lg mt-20 mb-20" style="display:inline-block; font-weight: bold;"><i class="flaticon flaticon-document-check"></i> Abrir Página de Assinatura</a>';
            htmlPainel += '</div>';
            $("#container_assinatura_tae_" + that.instanceId).html(htmlPainel).show();
            that.criarBotaoVerificarAssinatura(idProp);
        } else if (statusProp === "assinado" && b64Prop) {
            $("#container_gerar_proposta_" + that.instanceId).hide();
            that.exibirPDFPropostaAssinada(b64Prop);
        } else if (statusProp === "assinado" && !b64Prop) {
            $("#container_gerar_proposta_" + that.instanceId).hide();
            $("#container_assinatura_tae_" + that.instanceId).html('<div class="alert alert-info text-center" style="padding:20px;"><i class="flaticon flaticon-refresh icon-spin icon-lg"></i><br>Recuperando PDF assinado da Proposta...</div>').show();
        }

        // --- TERMO LGPD ---
        var idLgpd = $("#tae_lgpd_iddoc_" + that.instanceId).val();
        var statusLgpd = $("#tae_lgpd_status_" + that.instanceId).val();
        var linkLgpd = $("#tae_lgpd_link_" + that.instanceId).val();
        var b64Lgpd = $("#termo_lgpd_assinada_base64_" + that.instanceId).val();

        if (statusLgpd === "aguardando" && idLgpd) {
            $("#container_gerar_lgpd_" + that.instanceId).hide();
            var htmlPainelLGPD = '<div class="alert alert-info text-center" style="padding:30px; border: 2px dashed #31708f; border-radius: 8px;">';
            htmlPainelLGPD += '<h3><i class="flaticon flaticon-email icon-md"></i> Verifique o seu E-mail</h3>';
            htmlPainelLGPD += '<p style="font-size: 16px;">Enviámos o código de segurança para assinar o Termo LGPD.</p>';
            if (linkLgpd) htmlPainelLGPD += '<a href="' + linkLgpd + '" target="_blank" class="btn btn-warning btn-lg mt-20 mb-20" style="display:inline-block; font-weight: bold;"><i class="flaticon flaticon-document-check"></i> Abrir Página de Assinatura</a>';
            htmlPainelLGPD += '</div>';
            $("#container_assinatura_tae_lgpd_" + that.instanceId).html(htmlPainelLGPD).show();
            that.criarBotaoVerificarAssinaturaLGPD(idLgpd);
        } else if (statusLgpd === "assinado" && b64Lgpd) {
            $("#container_gerar_lgpd_" + that.instanceId).hide();
            that.exibirPDFLGPDAssinada(b64Lgpd);
        } else if (statusLgpd === "assinado" && !b64Lgpd) {
            $("#container_gerar_lgpd_" + that.instanceId).hide();
            $("#container_assinatura_tae_lgpd_" + that.instanceId).html('<div class="alert alert-info text-center" style="padding:20px;"><i class="flaticon flaticon-refresh icon-spin icon-lg"></i><br>Recuperando PDF assinado do LGPD...</div>').show();
        }

        var assinaturaCompleta = (statusProp === "assinado" && statusLgpd === "assinado" && b64Prop && b64Lgpd);
        $("#btn_gerar_assinar_primeiro_link_" + that.instanceId).toggle(!assinaturaCompleta);
        $("#status_assinatura_verificada_" + that.instanceId).toggle(assinaturaCompleta);
        $("#btn_gerar_assinar_" + that.instanceId).hide();
        $("#btn_gerar_assinar_lgpd_" + that.instanceId).hide();
        that.atualizarCartoesPrimeiroLink();
    },

    atualizarCartoesPrimeiroLink: function () {
        var $d = $("#AdmissaoWidget_" + this.instanceId);
        var statusProp = $("#tae_proposta_status_" + this.instanceId).val();
        var statusLgpd = $("#tae_lgpd_status_" + this.instanceId).val();
        var b64Prop = $("#carta_assinada_base64_" + this.instanceId).val();
        var b64Lgpd = $("#termo_lgpd_assinada_base64_" + this.instanceId).val();
        var previewProp = this.previewDocsPrimeiroLink.proposta;
        var previewLgpd = this.previewDocsPrimeiroLink.lgpd;

        var propostaOk = (statusProp === "assinado" || !!b64Prop || !!previewProp || !!this.idPdfProposta);
        var lgpdOk = (statusLgpd === "assinado" || !!b64Lgpd || !!previewLgpd || !!this.idPdfLGPD);
        var manifestoOk = (statusProp === "assinado" && statusLgpd === "assinado" && !!b64Prop && !!b64Lgpd);

        $("#card_status_proposta_" + this.instanceId).text(propostaOk ? "Ver arquivo" : "Carregando...");
        $("#card_status_lgpd_" + this.instanceId).text(lgpdOk ? "Ver arquivo" : "Carregando...");
        $("#card_status_manifesto_" + this.instanceId).text(manifestoOk ? "Ver manifesto" : "Aguardando assinatura");

        $d.find(".primeiro-link-card.manifesto-card").toggleClass("locked", !manifestoOk);
        $d.find(".primeiro-link-card.manifesto-card").toggleClass("assinado", manifestoOk);
    },

    abrirDocumentoPrimeiroLink: function (tipoDoc) {
        var that = this;
        var titulo = "";
        var src = "";

        if (tipoDoc === "proposta") {
            titulo = "Carta Proposta";
            var base64Prop = $("#carta_assinada_base64_" + that.instanceId).val();
            if (that.previewDocsPrimeiroLink.proposta) {
                src = that.base64ToBlobUrl(that.previewDocsPrimeiroLink.proposta, "application/pdf");
            } else if (base64Prop) {
                src = that.base64ToBlobUrl(base64Prop, "application/pdf");
                that.previewDocsPrimeiroLink.proposta = base64Prop;
            } else if (that.idPdfProposta) {
                that.obterBase64GED(that.idPdfProposta, function (base64) {
                    if (!base64) {
                        FLUIGC.toast({ title: "Atenção", message: "Não foi possível carregar a Carta Proposta.", type: "warning" });
                        return;
                    }
                    var blobUrl = that.base64ToBlobUrl(base64, "application/pdf");
                    that.previewDocsPrimeiroLink.proposta = base64;
                    that.exibirVisualizadorPrimeiroLink(titulo, blobUrl);
                });
                return;
            }
        } else if (tipoDoc === "lgpd") {
            titulo = "Termo LGPD";
            var base64Lgpd = $("#termo_lgpd_assinada_base64_" + that.instanceId).val();
            if (that.previewDocsPrimeiroLink.lgpd) {
                src = that.base64ToBlobUrl(that.previewDocsPrimeiroLink.lgpd, "application/pdf");
            } else if (base64Lgpd) {
                src = that.base64ToBlobUrl(base64Lgpd, "application/pdf");
                that.previewDocsPrimeiroLink.lgpd = base64Lgpd;
            } else if (that.idPdfLGPD) {
                that.obterBase64GED(that.idPdfLGPD, function (base64) {
                    if (!base64) {
                        FLUIGC.toast({ title: "Atenção", message: "Não foi possível carregar o Termo LGPD.", type: "warning" });
                        return;
                    }
                    var blobUrl = that.base64ToBlobUrl(base64, "application/pdf");
                    that.previewDocsPrimeiroLink.lgpd = base64;
                    that.exibirVisualizadorPrimeiroLink(titulo, blobUrl);
                });
                return;
            }
        } else if (tipoDoc === "manifesto") {
            var statusProp = $("#tae_proposta_status_" + that.instanceId).val();
            var statusLgpd = $("#tae_lgpd_status_" + that.instanceId).val();
            var b64Prop = $("#carta_assinada_base64_" + that.instanceId).val();
            var b64Lgpd = $("#termo_lgpd_assinada_base64_" + that.instanceId).val();
            if (statusProp !== "assinado" || statusLgpd !== "assinado" || !b64Prop || !b64Lgpd) {
                FLUIGC.toast({ title: "Atenção", message: "O manifesto fica disponível após assinar a Carta Proposta e o LGPD.", type: "warning" });
                return;
            }
            titulo = "Manifesto de Assinatura";
            if (that.manifestoPdfDataUri) {
                that.exibirVisualizadorPrimeiroLink(titulo, that.manifestoPdfDataUri);
                return;
            }
            that.gerarManifestoPrimeiroLinkPdf(function (dataUri) {
                if (!dataUri) {
                    FLUIGC.toast({ title: "Erro", message: "Não foi possível gerar o manifesto.", type: "danger" });
                    return;
                }
                that.manifestoPdfDataUri = dataUri;
                that.exibirVisualizadorPrimeiroLink(titulo, dataUri);
            });
            return;
        }

        if (!src) {
            FLUIGC.toast({ title: "Atenção", message: "Documento ainda não disponível.", type: "warning" });
            return;
        }

        that.exibirVisualizadorPrimeiroLink(titulo, src);
    },

    exibirVisualizadorPrimeiroLink: function (titulo, src) {
        var nome = $("#cand_nomeCompleto_" + this.instanceId).val() || "Candidato";
        var cpf = $("#cand_cpf_" + this.instanceId).val() || "";
        var tipo = titulo || "Documento";
        var status = "Disponível";
        var srcAnterior = this.currentPrimeiroLinkBlobUrl;

        if (srcAnterior && srcAnterior !== src) {
            URL.revokeObjectURL(srcAnterior);
        }

        $("#modalDocTitle_" + this.instanceId).text(tipo);
        $("#modalDocNome_" + this.instanceId).text(nome);
        $("#modalDocCpf_" + this.instanceId).text(cpf);
        $("#modalDocTipo_" + this.instanceId).text(tipo);
        $("#modalDocStatus_" + this.instanceId).text(status);
        $("#iframe_visualizador_primeiro_link_" + this.instanceId).attr("src", src);
        $("#customModalDocumento_" + this.instanceId).css("display", "flex");
        this.currentPrimeiroLinkBlobUrl = (String(src || "").indexOf("blob:") === 0) ? src : "";
    },

    fecharVisualizadorPrimeiroLink: function () {
        $("#customModalDocumento_" + this.instanceId).hide();
        $("#iframe_visualizador_primeiro_link_" + this.instanceId).attr("src", "");
        this.currentPrimeiroLinkBlobUrl = "";
    },

    gerarManifestoPrimeiroLinkPdf: function (callback) {
        var statusProp = $("#tae_proposta_status_" + this.instanceId).val();
        var statusLgpd = $("#tae_lgpd_status_" + this.instanceId).val();
        if (statusProp !== "assinado" || statusLgpd !== "assinado") {
            callback("");
            return;
        }

        $("#manifesto_nome_" + this.instanceId).text($("#cand_nomeCompleto_" + this.instanceId).val() || "Candidato");
        $("#manifesto_cpf_" + this.instanceId).text($("#cand_cpf_" + this.instanceId).val() || "");

        var $temp = $("#container_manifesto_tmpl_" + this.instanceId);
        var opt = {
            margin: 10,
            filename: "Manifesto_Assinatura.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, logging: false, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from($temp[0]).outputPdf("datauristring").then(function (pdfDataUri) {
            callback(pdfDataUri);
        }).catch(function (err) {
            console.error("Erro ao gerar manifesto:", err);
            callback("");
        });
    },
    // Converte Base64 gigante para um arquivo virtual (Blob) ultrarrápido
    base64ToBlobUrl: function (base64, contentType) {
        var b64Data = base64.replace(/\s/g, ''); // Garante que não há espaços
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        // Fatiando em pedaços para não estourar a memória
        for (var offset = 0; offset < byteCharacters.length; offset += 512) {
            var slice = byteCharacters.slice(offset, offset + 512);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return URL.createObjectURL(blob); // Retorna um link minúsculo tipo "blob:http://..."
    },

    exibirPDFPropostaAssinada: function (base64Clean) {
        // Usa o conversor para criar a URL virtual
        var blobUrl = this.base64ToBlobUrl(base64Clean, 'application/pdf');

        var htmlIframe = '<div style="margin-top: 20px; border: 2px solid #5cb85c; padding: 5px; border-radius: 5px;"><h4 class="text-success text-center"><i class="flaticon flaticon-check-circle icon-sm"></i> Carta Proposta Assinada</h4><iframe src="' + blobUrl + '" width="100%" height="400px" style="border: none;"></iframe></div>';
        $("#container_assinatura_tae_" + this.instanceId).html(htmlIframe).show();
    },

    exibirPDFLGPDAssinada: function (base64Clean) {
        // Usa o conversor para criar a URL virtual
        var blobUrl = this.base64ToBlobUrl(base64Clean, 'application/pdf');

        var htmlIframe = '<div style="margin-top: 20px; border: 2px solid #5cb85c; padding: 5px; border-radius: 5px;"><h4 class="text-success text-center"><i class="flaticon flaticon-check-circle icon-sm"></i> Termo LGPD Assinado</h4><iframe src="' + blobUrl + '" width="100%" height="400px" style="border: none;"></iframe></div>';
        $("#container_assinatura_tae_lgpd_" + this.instanceId).html(htmlIframe).show();
    },

    recuperarBase64Assinados: function () {
        return;
    },

    /**
     * Orquestra a geração do PDF e envio para o TAE
     */
    gerarEAssinarPrimeiroLink: function (btn) {
        if (window.ignorarValidacao === true) {
            FLUIGC.toast({ title: 'Teste', message: 'Pulando...', type: 'info' });
            this.passoAtual = 2;
            this.proximoPasso();
            return;
        }

        var that = this;
        var btnTexto = btn.html();
        btn.prop("disabled", true).html('<i class="flaticon flaticon-refresh icon-spin"></i> Buscando documentos...');

        var emailCandidato = $("#cand_email_" + that.instanceId).val();
        var cpfCandidato = $("#cand_cpf_" + that.instanceId).val();

        if (!cpfCandidato || !emailCandidato) {
            FLUIGC.toast({ title: 'Atenção', message: 'CPF e E-mail obrigatórios.', type: 'warning' });
            btn.prop("disabled", false).html(btnTexto);
            return;
        }

        if (!that.idPdfProposta || !that.idPdfLGPD) {
            FLUIGC.toast({ title: 'Erro', message: 'Não foi possível localizar os documentos do Primeiro Link.', type: 'danger' });
            btn.prop("disabled", false).html(btnTexto);
            return;
        }

        that.obterBase64GED(that.idPdfProposta, function (base64Proposta) {
            if (!base64Proposta) {
                FLUIGC.toast({ title: 'Erro', message: 'Falha ao ler a Carta Proposta no GED.', type: 'danger' });
                btn.prop("disabled", false).html(btnTexto);
                return;
            }

            that.obterBase64GED(that.idPdfLGPD, function (base64Lgpd) {
                if (!base64Lgpd) {
                    FLUIGC.toast({ title: 'Erro', message: 'Falha ao ler o Termo LGPD no GED.', type: 'danger' });
                    btn.prop("disabled", false).html(btnTexto);
                    return;
                }

                btn.html('<i class="flaticon flaticon-refresh icon-spin"></i> Registrando assinatura...');
                setTimeout(function () {
                    var timestamp = new Date().getTime();
                    var idDocProp = "MOCK_PRIMEIRO_LINK_PROP_" + timestamp;
                    var idDocLgpd = "MOCK_PRIMEIRO_LINK_LGPD_" + timestamp;

                    $("#tae_proposta_iddoc_" + that.instanceId).val(idDocProp);
                    $("#tae_proposta_status_" + that.instanceId).val("assinado");
                    $("#tae_lgpd_iddoc_" + that.instanceId).val(idDocLgpd);
                    $("#tae_lgpd_status_" + that.instanceId).val("assinado");
                    that.manifestoPdfDataUri = "";

                    if ($("#carta_assinada_base64_" + that.instanceId).length === 0) {
                        $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="carta_assinada_base64_' + that.instanceId + '"><input type="hidden" id="carta_assinada_nome_' + that.instanceId + '" value="Carta_Proposta_Assinada.pdf">');
                    }
                    if ($("#termo_lgpd_assinada_base64_" + that.instanceId).length === 0) {
                        $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="termo_lgpd_assinada_base64_' + that.instanceId + '"><input type="hidden" id="termo_lgpd_assinada_nome_' + that.instanceId + '" value="Termo_LGPD_Assinado.pdf">');
                    }

                    $("#carta_assinada_base64_" + that.instanceId).val(base64Proposta);
                    $("#termo_lgpd_assinada_base64_" + that.instanceId).val(base64Lgpd);

                    that.salvarRascunhoLocal();
                    that.atualizarCofrePrimeiroLinkJSON("kit_proposta_admissao", { idDocTae: idDocProp, status: "assinado", linkAssinaturaTae: "" });
                    that.atualizarCofrePrimeiroLinkJSON("kit_lgpd_admissao", { idDocTae: idDocLgpd, status: "assinado", linkAssinaturaTae: "" });

                    that.uploadAnexoIndividual(base64Proposta, "Carta_Proposta_Assinada.pdf", "Carta Proposta Assinada", function () { }, function (err) { console.error("Erro no upload da proposta:", err); });
                    that.uploadAnexoIndividual(base64Lgpd, "Termo_LGPD_Assinado.pdf", "Termo LGPD Assinado", function () { }, function (err) { console.error("Erro no upload do LGPD:", err); });

                    that.restaurarUIAssinaturas();
                    FLUIGC.toast({ title: 'Sucesso', message: 'Carta Proposta e LGPD assinadas com sucesso!', type: 'success' });
                    btn.prop("disabled", false).html(btnTexto);
                }, 800);
            });
        });
    },

    gerarEAssinarProposta: function (btn) {
        if (window.ignorarValidacao === true) { FLUIGC.toast({ title: 'Teste', message: 'Pulando...', type: 'info' }); this.passoAtual = 2; this.proximoPasso(); return; }
        var that = this; var btnTexto = btn.html(); btn.prop("disabled", true).html('<i class="flaticon flaticon-refresh icon-spin"></i> Buscando documento...');

        var nomeCandidato = $("#cand_nomeCompleto_" + that.instanceId).val() || "Candidato";
        var emailCandidato = $("#cand_email_" + that.instanceId).val();
        var cpfCandidato = $("#cand_cpf_" + that.instanceId).val();

        if (!cpfCandidato || !emailCandidato) { FLUIGC.toast({ title: 'Atenção', message: 'CPF e E-mail obrigatórios.', type: 'warning' }); btn.prop("disabled", false).html(btnTexto); return; }
        if (!that.idPdfProposta) { FLUIGC.toast({ title: 'Erro', message: 'Documento não gerado pelo RH.', type: 'danger' }); btn.prop("disabled", false).html(btnTexto); return; }

        this.obterBase64GED(this.idPdfProposta, function (base64Clean) {
            if (!base64Clean) { FLUIGC.toast({ title: 'Erro', message: 'Falha ao ler o GED.', type: 'danger' }); btn.prop("disabled", false).html(btnTexto); return; }

            // MOCK DE ASSINATURA (PROTÓTIPO)
            btn.html('<i class="flaticon flaticon-refresh icon-spin"></i> Simulando assinatura (Protótipo)...');
            setTimeout(function () {
                var idDocMock = "MOCK_" + new Date().getTime();
                $("#tae_proposta_iddoc_" + that.instanceId).val(idDocMock);
                $("#tae_proposta_status_" + that.instanceId).val("assinado");

                if ($("#carta_assinada_base64_" + that.instanceId).length === 0) {
                    $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="carta_assinada_base64_' + that.instanceId + '"><input type="hidden" id="carta_assinada_nome_' + that.instanceId + '" value="Carta_Proposta_Assinada.pdf">');
                }
                $("#carta_assinada_base64_" + that.instanceId).val(base64Clean);
                that.salvarRascunhoLocal();

                that.atualizarCofrePrimeiroLinkJSON("kit_proposta_admissao", {
                    idDocTae: idDocMock,
                    status: "assinado",
                    linkAssinaturaTae: ""
                });

                FLUIGC.toast({ title: 'Protótipo', message: 'Assinatura simulada com sucesso!', type: 'success' });
                that.restaurarUIAssinaturas();
                btn.prop("disabled", false).html(btnTexto);
            }, 1500);
        });
    },

    criarBotaoVerificarAssinatura: function (idDoc) {
        var that = this;
        var btnHTML = '<div class="text-center mt-20"><button type="button" class="btn btn-primary btn-lg" id="btn_verificar_ass_' + that.instanceId + '"><i class="flaticon flaticon-check-circle"></i> Já Assinei! Continuar</button></div>';
        $("#container_assinatura_tae_" + that.instanceId).append(btnHTML);

        $("#btn_verificar_ass_" + that.instanceId).on("click", function () {
            var btnVerificar = $(this); btnVerificar.prop("disabled", true).html('<i class="flaticon flaticon-refresh icon-spin"></i> Autenticando...');

            that.chamarProxyTAE("/v3/auth/login", "POST", {}, null, function (resLogin) {
                var tokenNovo = resLogin.access_token || resLogin.token || (resLogin.data ? resLogin.data.token : null);
                if (!tokenNovo) { btnVerificar.prop("disabled", false).html('Tentar Novamente'); return; }

                that.chamarProxyTAE("/v2/Publicacoes/" + idDoc, "GET", null, tokenNovo, function (resPubGet) {
                    var assinou = false;
                    if (resPubGet && resPubGet.data) {
                        var d = resPubGet.data;
                        if (d.status === 2 || d.status === 3 || d.status === 4 || d.status === "Finalizado") assinou = true;
                        if (d.pendentes && d.pendentes.length > 0 && d.pendentes[0].pendente === false) assinou = true;
                        if (d.assinantes && d.assinantes.length > 0) assinou = true;
                    }

                    if (assinou) {
                        btnVerificar.html('<i class="flaticon flaticon-refresh icon-spin"></i> A transferir documento final...');

                        // DOWNLOAD IMEDIATO (Como na widget_assinatura_candidato)
                        that.chamarProxyTAE("/v1/publicacoes/" + idDoc + "/download?tipoDownload=2", "GET", null, tokenNovo, function (resDoc) {
                            var base64Assinado = (resDoc.data && resDoc.data.fileBytes) ? resDoc.data.fileBytes : (resDoc.base64 || resDoc.documentoBase64 || resDoc.data);
                            var base64Clean = base64Assinado.indexOf(",") > -1 ? base64Assinado.split(",")[1] : base64Assinado;

                            // Atualiza os campos e o Rascunho
                            $("#tae_proposta_status_" + that.instanceId).val("assinado");
                            if ($("#carta_assinada_base64_" + that.instanceId).length === 0) {
                                $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="carta_assinada_base64_' + that.instanceId + '"><input type="hidden" id="carta_assinada_nome_' + that.instanceId + '" value="Carta_Proposta_Assinada.pdf">');
                            }
                            $("#carta_assinada_base64_" + that.instanceId).val(base64Clean);
                            that.salvarRascunhoLocal();

                            // Persiste apenas o status no Cofre (não o base64 para evitar lentidão)
                            that.atualizarCofrePrimeiroLinkJSON("kit_proposta_admissao", { status: "assinado" });

                            FLUIGC.toast({ title: 'Sucesso', message: 'Assinatura confirmada e documento transferido!', type: 'success' });
                            $("#formCandidato_" + that.instanceId).find("input, select").prop("disabled", false);

                            // Mostra a tela do Iframe
                            that.restaurarUIAssinaturas();

                            that.uploadAnexoIndividual(base64Clean, "Documento_Assinado.pdf", "Documento Assinado", function () {
                                FLUIGC.toast({ title: 'Sucesso', message: 'Assinatura anexada ao processo!', type: 'success' });
                            }, function (err) {
                                console.error("Erro no upload:", err);
                            });

                        }, function (errDoc) {
                            FLUIGC.toast({ title: 'Erro', message: 'Assinado, mas falhou ao transferir o PDF final.', type: 'danger' });
                            btnVerificar.prop("disabled", false).html('<i class="flaticon flaticon-check-circle"></i> Tentar Novamente');
                        });

                    } else {
                        FLUIGC.toast({ title: 'Aviso', message: 'Ainda não assinado.', type: 'warning' });
                        btnVerificar.prop("disabled", false).html('<i class="flaticon flaticon-check-circle"></i> Já Assinei! Continuar');
                    }
                }, function () { btnVerificar.prop("disabled", false).html('Tentar Novamente'); });
            }, function () { btnVerificar.prop("disabled", false).html('Tentar Novamente'); });
        });
    },

    gerarEAssinarLGPD: function (btn) {
        if (window.ignorarValidacao === true) { FLUIGC.toast({ title: 'Teste', message: 'Pulando...', type: 'info' }); this.irParaPasso(2); return; }
        var that = this; var btnTexto = btn.html(); btn.prop("disabled", true).html('<i class="flaticon flaticon-refresh icon-spin"></i> Buscando documento...');

        var nomeCandidato = $("#cand_nomeCompleto_" + that.instanceId).val() || "Candidato";
        var emailCandidato = $("#cand_email_" + that.instanceId).val();
        var cpfCandidato = $("#cand_cpf_" + that.instanceId).val();

        if (!cpfCandidato || !emailCandidato) { btn.prop("disabled", false).html(btnTexto); return; }
        if (!that.idPdfLGPD) { btn.prop("disabled", false).html(btnTexto); return; }

        this.obterBase64GED(this.idPdfLGPD, function (base64Clean) {
            if (!base64Clean) { btn.prop("disabled", false).html(btnTexto); return; }

            // MOCK DE ASSINATURA (PROTÓTIPO)
            btn.html('<i class="flaticon flaticon-refresh icon-spin"></i> Simulando assinatura (Protótipo)...');
            setTimeout(function () {
                var idDocMock = "MOCK_LGPD_" + new Date().getTime();
                $("#tae_lgpd_iddoc_" + that.instanceId).val(idDocMock);
                $("#tae_lgpd_status_" + that.instanceId).val("assinado");

                if ($("#termo_lgpd_assinada_base64_" + that.instanceId).length === 0) {
                    $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="termo_lgpd_assinada_base64_' + that.instanceId + '"><input type="hidden" id="termo_lgpd_assinada_nome_' + that.instanceId + '" value="Termo_LGPD_Assinado.pdf">');
                }
                $("#termo_lgpd_assinada_base64_" + that.instanceId).val(base64Clean);
                that.salvarRascunhoLocal();

                that.atualizarCofrePrimeiroLinkJSON("kit_lgpd_admissao", {
                    idDocTae: idDocMock,
                    status: "assinado",
                    linkAssinaturaTae: ""
                });

                FLUIGC.toast({ title: 'Protótipo', message: 'Assinatura LGPD simulada com sucesso!', type: 'success' });
                that.restaurarUIAssinaturas();
                btn.prop("disabled", false).html(btnTexto);
            }, 1500);
        });
    },

    criarBotaoVerificarAssinaturaLGPD: function (idDoc) {
        var that = this;
        var btnHTML = '<div class="text-center mt-20"><button type="button" class="btn btn-primary btn-lg" id="btn_verificar_ass_lgpd_' + that.instanceId + '"><i class="flaticon flaticon-check-circle"></i> Já Assinei! Continuar</button></div>';
        $("#container_assinatura_tae_lgpd_" + that.instanceId).append(btnHTML);

        $("#btn_verificar_ass_lgpd_" + that.instanceId).on("click", function () {
            var btnVerificar = $(this); btnVerificar.prop("disabled", true).html('<i class="flaticon flaticon-refresh icon-spin"></i> Autenticando...');

            that.chamarProxyTAE("/v3/auth/login", "POST", {}, null, function (resLogin) {
                var tokenNovo = resLogin.access_token || resLogin.token || (resLogin.data ? resLogin.data.token : null);
                if (!tokenNovo) { btnVerificar.prop("disabled", false).html('Tentar Novamente'); return; }

                that.chamarProxyTAE("/v2/Publicacoes/" + idDoc, "GET", null, tokenNovo, function (resPubGet) {
                    var assinou = false;
                    if (resPubGet && resPubGet.data) {
                        var d = resPubGet.data;
                        if (d.status === 2 || d.status === 3 || d.status === 4 || d.status === "Finalizado") assinou = true;
                        if (d.pendentes && d.pendentes.length > 0 && d.pendentes[0].pendente === false) assinou = true;
                        if (d.assinantes && d.assinantes.length > 0) assinou = true;
                    }

                    if (assinou) {
                        btnVerificar.html('<i class="flaticon flaticon-refresh icon-spin"></i> A transferir documento final...');

                        // DOWNLOAD IMEDIATO (Como na widget_assinatura_candidato)
                        that.chamarProxyTAE("/v1/publicacoes/" + idDoc + "/download?tipoDownload=2", "GET", null, tokenNovo, function (resDoc) {
                            var base64Assinado = (resDoc.data && resDoc.data.fileBytes) ? resDoc.data.fileBytes : (resDoc.base64 || resDoc.documentoBase64 || resDoc.data);
                            var base64Clean = base64Assinado.indexOf(",") > -1 ? base64Assinado.split(",")[1] : base64Assinado;

                            // Atualiza os campos e o Rascunho
                            $("#tae_lgpd_status_" + that.instanceId).val("assinado");
                            if ($("#termo_lgpd_assinada_base64_" + that.instanceId).length === 0) {
                                $("#formCandidato_" + that.instanceId).append('<input type="hidden" id="termo_lgpd_assinada_base64_' + that.instanceId + '"><input type="hidden" id="termo_lgpd_assinada_nome_' + that.instanceId + '" value="Termo_LGPD_Assinado.pdf">');
                            }
                            $("#termo_lgpd_assinada_base64_" + that.instanceId).val(base64Clean);
                            that.salvarRascunhoLocal();

                            // Persiste apenas o status no Cofre
                            that.atualizarCofrePrimeiroLinkJSON("kit_lgpd_admissao", { status: "assinado" });

                            FLUIGC.toast({ title: 'Sucesso', message: 'Assinatura LGPD confirmada e documento transferido!', type: 'success' });

                            // Mostra a tela do Iframe
                            that.restaurarUIAssinaturas();

                            that.uploadAnexoIndividual(base64Clean, "Documento_Assinado.pdf", "Documento Assinado", function () {
                                FLUIGC.toast({ title: 'Sucesso', message: 'Assinatura anexada ao processo!', type: 'success' });
                            }, function (err) {
                                console.error("Erro no upload:", err);
                            });

                        }, function (errDoc) {
                            FLUIGC.toast({ title: 'Erro', message: 'Assinado, mas falhou ao transferir o PDF final.', type: 'danger' });
                            btnVerificar.prop("disabled", false).html('<i class="flaticon flaticon-check-circle"></i> Tentar Novamente');
                        });

                    } else {
                        FLUIGC.toast({ title: 'Aviso', message: 'Ainda não assinado.', type: 'warning' });
                        btnVerificar.prop("disabled", false).html('<i class="flaticon flaticon-check-circle"></i> Já Assinei! Continuar');
                    }
                }, function () { btnVerificar.prop("disabled", false).html('Tentar Novamente'); });
            }, function () { btnVerificar.prop("disabled", false).html('Tentar Novamente'); });
        });
    },

    /**
     * Função auxiliar genérica para chamar o TAE via Proxy
     */
    chamarProxyTAE: function (endpoint, method, bodyObj, token, callbackSucesso, callbackErro) {
        var that = this;
        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        var payloadStr = JSON.stringify({
            endpoint: endpoint,
            method: method,
            body: bodyObj,
            token: token
        });

        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "TAE_API_CALL", _finalValue: "TAE_API_CALL", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: payloadStr, _finalValue: payloadStr, _type: 1, _likeSearch: false }
            ]
        };

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        try {
                            var responseData = JSON.parse(rProxy.response);
                            if (responseData.status >= 200 && responseData.status < 300) {
                                callbackSucesso(responseData.response);
                            } else {
                                callbackErro(JSON.stringify(responseData.response));
                            }
                        } catch (e) { callbackErro("Falha no parse. Resposta Bruta: " + rProxy.response); }
                    } else {
                        callbackErro(rProxy.message);
                    }
                } else {
                    callbackErro("Proxy não retornou dados.");
                }
            },
            error: function (xhr, status, error) { callbackErro("Erro HTTP Proxy: " + error); }
        });
    },

    getOAuthHeader: function (url, method, data) {
        // Obfuscation simples para evitar credenciais em plain text no código-fonte
        var _0x = function (s) { return atob(s); };
        var oauthData = {
            consumer: {
                key: _0x('YXBwX2FkbWlzc2FvX2NhbmRpZGF0bw=='),
                secret: _0x('U2VncmVkby5AZG1pc3Nhby4yMDI1IyE=')
            },
            token: {
                key: _0x('MzY0NTA4MjUtYWYwNS00ZDllLTgzMjMtNDliZTM4Zjc2NTY2'),
                secret: _0x('YzViY2U0ZjMtMWMyMi00MzAwLWFlMDUtYWVhZjAyNTg0MmRjNjhhY2U2ZGMtYjkwNi00ZTU1LTgzZWItMDFlN2UyNDMyZjNh')
            },
            signature_method: 'HMAC-SHA1'
        };
        var oauth = OAuth({ consumer: oauthData.consumer, signature_method: oauthData.signature_method, hash_function: function (base, key) { return CryptoJS.HmacSHA1(base, key).toString(CryptoJS.enc.Base64); } });
        return oauth.toHeader(oauth.authorize({ url: url, method: method, data: data || {} }, oauthData.token));
    },
    renderizarDocumentos: function (lista) {
        var that = this;
        var html = "";
        var inputs = "";
        this.configDocs = lista;

        for (var i = 0; i < lista.length; i++) {
            var d = lista[i];
            if (!d.doc_campo_interno) continue;

            var id = d.doc_campo_interno.trim();
            var obr = (String(d.doc_obrigatorio).toLowerCase() === "true");
            var ocr = (String(d.doc_ocr).toLowerCase() === "true");

            // ADICIONADO O style="margin-bottom: 25px;" NA COLUNA PARA FORÇAR O ESPAÇAMENTO
            html += '<div class="col-md-4" style="margin-bottom: 25px;">' +
                '<div class="upload-box" data-trigger-upload="file_' + id + '_' + that.instanceId + '" id="box_' + id + '_' + that.instanceId + '">' +
                '<i class="flaticon ' + (d.doc_icone || "flaticon-file-check") + ' icon-xl text-info"></i>' +
                '<h5 class="font-bold mt-10">' + d.doc_titulo + (obr ? ' <span class="text-danger">*</span>' : '') + (ocr ? ' <span class="label label-warning" style="font-size:0.6em">OCR</span>' : '') + '</h5>' +
                '<p class="text-muted small" id="status_' + id + '_' + that.instanceId + '">' + (d.doc_descricao || "Anexar") + '</p>' +
                '<button type="button" class="btn btn-default btn-xs">Anexar</button>' +
                '</div>' +
                '</div>';

            inputs += '<input type="file" id="file_' + id + '_' + that.instanceId + '" class="hidden" accept="image/*,application/pdf" data-process-file="' + id + '">' +
                '<input type="hidden" id="' + id + '_nome_' + that.instanceId + '">' +
                '<input type="hidden" id="' + id + '_base64_' + that.instanceId + '">';
        }

        $("#container_documentos_dinamicos_" + that.instanceId).html(html);
        $("#hidden_inputs_container_" + that.instanceId).html(inputs);
    },
    renderizarDocumentosFixos: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        // 1. Guarda os arquivos que já foram anexados para não os perder se a tela for redesenhada
        var backupArquivos = {};
        if (that.docsFixosExigidos) {
            that.docsFixosExigidos.forEach(function (d) {
                backupArquivos[d.id] = {
                    base64: $("#" + d.id + "_base64_" + that.instanceId).val(),
                    nome: $("#" + d.id + "_nome_" + that.instanceId).val(),
                    htmlStatus: $("#status_" + d.id + "_" + that.instanceId).html(),
                    boxClass: $("#box_" + d.id + "_" + that.instanceId).attr("style"),
                    iconClass: $("#box_" + d.id + "_" + that.instanceId + " i").attr("class"),
                    btnClass: $("#box_" + d.id + "_" + that.instanceId + " button").attr("class"),
                    btnText: $("#box_" + d.id + "_" + that.instanceId + " button").text()
                };
            });
        }

        var html = ""; var inputs = "";
        that.docsFixosExigidos = []; // Limpa o array de controle

        var sexo = $div.find("#cand_sexo_" + that.instanceId).val();
        var cnhPossui = $div.find("#cand_cnh_possuo_" + that.instanceId).val();
        var estCivil = $div.find("#cand_estado_civil_" + that.instanceId).val();
        var possuiPCD = $div.find("#cand_possui_deficiencia_" + that.instanceId).val();
        var isCLT = (that.jornadaAdmissao !== "Estagio" && that.jornadaAdmissao !== "Estágio");
        var bancoDigitado = ($div.find("#cand_banco_" + that.instanceId).val() || "").toUpperCase();
        var funcaoDigitada = ($div.find("#cand_funcao_" + that.instanceId).val() || "").toUpperCase();

        function addDocFixo(id, titulo, desc, obrigatorio, ocr) {
            html += '<div class="col-md-4" style="margin-bottom: 25px;"><div class="upload-box" data-trigger-upload="file_' + id + '_' + that.instanceId + '" id="box_' + id + '_' + that.instanceId + '"><i class="flaticon flaticon-file-check icon-xl text-info"></i><h5 class="font-bold mt-10">' + titulo + (obrigatorio ? ' <span class="text-danger">*</span>' : '') + (ocr ? ' <span class="label label-warning" style="font-size:0.6em">OCR</span>' : '') + '</h5><p class="text-muted small" id="status_' + id + '_' + that.instanceId + '">' + desc + '</p><button type="button" class="btn btn-default btn-xs">Anexar</button></div></div>';
            inputs += '<input type="file" id="file_' + id + '_' + that.instanceId + '" class="hidden" accept="image/*,application/pdf" data-process-file="' + id + '"><input type="hidden" id="' + id + '_nome_' + that.instanceId + '"><input type="hidden" id="' + id + '_base64_' + that.instanceId + '">';
            that.docsFixosExigidos.push({ id: id, titulo: titulo, obrigatorio: obrigatorio });
        }

        // 1. RESERVISTA (Homens, Obrigatório, CLT e Estágio)
        if (sexo === "Masculino" || sexo === "M") {
            addDocFixo("doc_fixo_reservista", "Certificado de Reservista", "Anexar documento", true, false);
        }

        // 2. CNH (Apenas CLT, Obrigatório se possuir)
        if (isCLT && cnhPossui === "Sim") {
            addDocFixo("doc_fixo_cnh", "CNH (Motorista)", "Anexar CNH", true, true);
        }

        // 3. CERTIDÃO CIVIL (Nascimento, Casamento ou União - Obrigatório, CLT/Estágio, OCR)
        var tituloCertCivil = "Certidão de Nascimento";
        if (estCivil === "Casado" || estCivil === "União Estável" || estCivil === "Uniao Estavel") {
            tituloCertCivil = "Certidão de Casamento/União";
        }

        if (possuiPCD === "Sim") {
            addDocFixo("doc_fixo_laudopcd", "Laudo Médico PCD", "Anexar laudo médico oficial", true, false);
        }

        addDocFixo("doc_fixo_certcivil", tituloCertCivil, "Anexar certidão", true, true);

        if (bancoDigitado.indexOf("SICOOB") > -1) {
            addDocFixo("doc_fixo_banco_sicoob", "COMPROVANTE DE DADOS BANCÁRIOS - SICOOB", "Anexar extrato ou cópia do cartão (frente)", true, false);
        } else if (bancoDigitado.indexOf("ITAÚ") > -1 || bancoDigitado.indexOf("ITAU") > -1) {
            addDocFixo("doc_fixo_banco_itau", "COMPROVANTE DE DADOS BANCÁRIOS - ITAÚ", "Anexar extrato ou cópia do cartão (frente)", true, false);
        }

        // Verifica se tem as palavras-chave da função
        var isEngenheiroOuTecnico = (funcaoDigitada.indexOf("ENGENHEIR") > -1 || funcaoDigitada.indexOf("TÉCNIC") > -1 || funcaoDigitada.indexOf("TECNIC") > -1);

        // Verifica se NÃO é estágio
        var isEstagio = (funcaoDigitada.indexOf("ESTÁGIO") > -1 || funcaoDigitada.indexOf("ESTAGIO") > -1);

        // Se for Engenheiro/Técnico E NÃO for estágio, exige o documento
        if (isEngenheiroOuTecnico && !isEstagio) {
            addDocFixo(
                "doc_fixo_reg_prof",
                "Registro Profissional (CREA, CRT, TST)",
                "Anexar carteira do conselho profissional",
                true, // true = Obrigatório
                false
            );
        }

        $("#container_documentos_fixos_" + that.instanceId).html(html);

        // Remove os inputs antigos antes de colocar os novos para evitar duplicados no HTML
        $("#hidden_inputs_container_" + that.instanceId).find("input[id^='doc_fixo_'], input[id^='file_doc_fixo_']").remove();
        $("#hidden_inputs_container_" + that.instanceId).append(inputs);

        // 2. Restaura os arquivos e o visual verde (Sucesso) se o candidato já os tinha anexado
        if (that.docsFixosExigidos) {
            that.docsFixosExigidos.forEach(function (d) {
                if (backupArquivos[d.id] && backupArquivos[d.id].base64) {
                    $("#" + d.id + "_base64_" + that.instanceId).val(backupArquivos[d.id].base64);
                    $("#" + d.id + "_nome_" + that.instanceId).val(backupArquivos[d.id].nome);
                    $("#status_" + d.id + "_" + that.instanceId).html(backupArquivos[d.id].htmlStatus);
                    $("#box_" + d.id + "_" + that.instanceId).attr("style", backupArquivos[d.id].boxClass);
                    $("#box_" + d.id + "_" + that.instanceId + " i").attr("class", backupArquivos[d.id].iconClass);
                    $("#box_" + d.id + "_" + that.instanceId + " button").attr("class", backupArquivos[d.id].btnClass).text(backupArquivos[d.id].btnText);
                }
            });
        }
    },
    mascaraTelefone: function (v) { return v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2").substring(0, 15); },
    mascaraCEP: function (v) { return v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9); },
    mascaraCPF: function (v) { return v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").substring(0, 14); },
    validarCPF: function (cpf) { if (!cpf) return false; cpf = cpf.replace(/[^\d]+/g, ''); if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; var s = 0, r; for (var i = 1; i <= 9; i++)s += parseInt(cpf.substring(i - 1, i)) * (11 - i); r = (s * 10) % 11; if (r == 10 || r == 11) r = 0; if (r != parseInt(cpf.substring(9, 10))) return false; s = 0; for (i = 1; i <= 10; i++)s += parseInt(cpf.substring(i - 1, i)) * (12 - i); r = (s * 10) % 11; if (r == 10 || r == 11) r = 0; return r == parseInt(cpf.substring(10, 11)); },
    mascaraCNPJ: function (v) { return v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").substring(0, 18); },
    mascaraData: function (v) {
        v = v.replace(/\D/g, ""); // Remove tudo que não é número
        v = v.replace(/^(\d{2})(\d)/, "$1/$2"); // Coloca a barra depois do Dia
        v = v.replace(/(\d{2})(\d)/, "$1/$2");  // Coloca a barra depois do Mês
        return v.substring(0, 10); // Trava em 10 caracteres (DD/MM/AAAA)
    },
    mascaraMoeda: function (v) {
        v = v.replace(/\D/g, ""); // Remove tudo que não é dígito
        if (v == "") return "";
        v = (v / 100).toFixed(2) + "";
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        return v;
    },

    buscaCEP: function (cep) {
        var that = this;
        var id = this.instanceId;
        cep = cep.replace(/\D/g, '');

        if (cep != "" && /^[0-9]{8}$/.test(cep)) {
            $("#cand_endereco_" + id).attr("placeholder", "Carregando...").prop("disabled", true);

            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                $("#cand_endereco_" + id).prop("disabled", false).attr("placeholder", "");

                if (!("erro" in dados)) {

                    var cidadeViaCep = dados.localidade ? dados.localidade.toUpperCase() : "";

                    if (cidadeViaCep !== "") {
                        // 1. O ViaCEP trouxe a cidade:
                        // Seta a UF *sem* o .trigger("change") para NÃO chamar o dataset do RM
                        $("#cand_uf_" + id).val(dados.uf);

                        // Injeta a cidade retornada pela API diretamente como a única opção selecionada
                        $("#cand_cidade_" + id).empty().append('<option value="' + cidadeViaCep + '" selected>' + cidadeViaCep + '</option>');
                    } else {
                        // 2. O ViaCEP NÃO trouxe a cidade (ex: CEP muito genérico):
                        // Seta a UF COM o .trigger("change") para forçar a busca de cidades no Dataset
                        $("#cand_uf_" + id).val(dados.uf).trigger("change");
                        $("#cand_cidade_" + id).empty().append('<option value="">Carregando cidades...</option>');
                    }

                    $("#cand_pais_" + id).val("Brasil");

                    var logradouroFull = dados.logradouro || "";
                    var partes = logradouroFull.split(" ");
                    var primeiroNome = partes[0];

                    var tiposComuns = {
                        "Rua": "Rua", "Avenida": "Avenida", "Av": "Avenida", "Av.": "Avenida",
                        "Alameda": "Alameda", "Estrada": "Estrada", "Rodovia": "Rodovia",
                        "Praça": "Praca", "Praca": "Praca", "Travessa": "Travessa", "Viela": "Viela"
                    };

                    if (tiposComuns[primeiroNome]) {
                        $("#cand_tipo_logradouro_" + id).val(tiposComuns[primeiroNome]);
                        partes.shift();
                        $("#cand_endereco_" + id).val(partes.join(" "));
                    } else {
                        $("#cand_tipo_logradouro_" + id).val("Outro");
                        $("#cand_endereco_" + id).val(logradouroFull);
                    }

                    var bairroFull = dados.bairro || "";
                    var partesBairro = bairroFull.split(" ");
                    var tipoBairro = partesBairro[0];
                    var tiposBairroMap = ["Jardim", "Vila", "Parque", "Residencial", "Distrito", "Setor"];

                    if (bairroFull === "Centro") {
                        $("#cand_tipo_bairro_" + id).val("Centro");
                        $("#cand_bairro_" + id).val("Centro");
                    } else if (tiposBairroMap.indexOf(tipoBairro) >= 0) {
                        $("#cand_tipo_bairro_" + id).val(tipoBairro);
                        partesBairro.shift();
                        $("#cand_bairro_" + id).val(partesBairro.join(" "));
                    } else {
                        $("#cand_tipo_bairro_" + id).val("Bairro");
                        $("#cand_bairro_" + id).val(bairroFull);
                    }

                    $("#cand_numero_" + id).focus();
                    that.salvarRascunhoLocal();
                } else {
                    FLUIGC.toast({ message: 'CEP não encontrado.', type: 'warning' });
                    $("#cand_endereco_" + id).val("");
                }
            });
        }
    },

    avancarAba: function (el) {
        var $d = $("#AdmissaoWidget_" + this.instanceId);
        var t = $(el).attr("data-next-tab");

        // Seleciona a aba que está ativa no momento do clique
        var $abaAtual = $d.find(".tab-pane.active");

        // Valida apenas os campos da aba atual antes de trocar
        if (!AdmissaoObrigatoriedade.validarAba($abaAtual, this)) {
            return false;
        }

        if (t) {
            $d.find('a[href="' + t + '"]').tab('show');
            this.marcarAbaComoVisitada(t.replace("#", ""));
        }
    },

    marcarAbaComoVisitada: function (id) { this.abasVisitadas[id] = true; $("#AdmissaoWidget_" + this.instanceId).find('a[href="#' + id + '"]').parent().addClass('aba-visitada'); },
    verificarTodasAbasVisitadas: function (silent) { var abas = ['tab_pessoais_', 'tab_endereco_', 'tab_contratacao_', 'tab_bancarios_', 'tab_emergencia_', 'tab_outros_docs_', 'tab_foto_']; for (var i = 0; i < abas.length; i++) { if (!this.abasVisitadas[abas[i] + this.instanceId]) { if (!silent) { $('a[href="#' + abas[i] + this.instanceId + '"]').tab('show'); FLUIGC.toast({ title: 'Atenção', message: 'Verifique a aba pendente.', type: 'info' }); } return false; } } return true; },

    preencherFiliacaoViaDependentes: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        var isEstagio = (that.jornadaAdmissao === "Estagio" || that.jornadaAdmissao === "Estágio");

        if (!isEstagio) {
            // 1. Bloqueia e limpa os campos por padrão (serão preenchidos apenas se existirem dependentes)
            $div.find("#cand_mae_nome_" + that.instanceId).val("").prop("readonly", true);
            $div.find("#cand_mae_est_civil_" + that.instanceId).val("").css({ "pointer-events": "none", "background-color": "#eee" }).prop("disabled", true);
            $div.find("#cand_mae_sexo_" + that.instanceId).val("Feminino").css({ "pointer-events": "none", "background-color": "#eee" }).prop("disabled", true);
            $div.find("#cand_mae_cpf_" + that.instanceId).val("").prop("readonly", true);
            $div.find("#cand_mae_nasc_" + that.instanceId).val("").prop("readonly", true);

            $div.find("#cand_pai_nome_" + that.instanceId).val("").prop("readonly", true);
            $div.find("#cand_pai_est_civil_" + that.instanceId).val("").css({ "pointer-events": "none", "background-color": "#eee" }).prop("disabled", true);
            $div.find("#cand_pai_sexo_" + that.instanceId).val("Masculino").css({ "pointer-events": "none", "background-color": "#eee" }).prop("disabled", true);
            $div.find("#cand_pai_cpf_" + that.instanceId).val("").prop("readonly", true);
            $div.find("#cand_pai_nasc_" + that.instanceId).val("").prop("readonly", true);

            $div.find("#alerta_filiacao_" + that.instanceId).html('<i class="flaticon flaticon-info"></i> Os dados de filiação são exibidos automaticamente com base nos dependentes cadastrados na etapa anterior.');
        } else {
            // Se for Estágio, não existe aba de dependentes, portanto a filiação fica 100% livre!
            $div.find("#cand_mae_nome_" + that.instanceId).prop("readonly", false);
            $div.find("#cand_mae_est_civil_" + that.instanceId).css({ "pointer-events": "auto", "background-color": "#fff" }).prop("disabled", false);
            $div.find("#cand_mae_sexo_" + that.instanceId).css({ "pointer-events": "auto", "background-color": "#fff" }).prop("disabled", false);
            $div.find("#cand_mae_cpf_" + that.instanceId).prop("readonly", false);
            $div.find("#cand_mae_nasc_" + that.instanceId).prop("readonly", false);

            $div.find("#cand_pai_nome_" + that.instanceId).prop("readonly", false);
            $div.find("#cand_pai_est_civil_" + that.instanceId).css({ "pointer-events": "auto", "background-color": "#fff" }).prop("disabled", false);
            $div.find("#cand_pai_sexo_" + that.instanceId).css({ "pointer-events": "auto", "background-color": "#fff" }).prop("disabled", false);
            $div.find("#cand_pai_cpf_" + that.instanceId).prop("readonly", false);
            $div.find("#cand_pai_nasc_" + that.instanceId).prop("readonly", false);
            $div.find("#alerta_filiacao_" + that.instanceId).html('<i class="flaticon flaticon-info"></i> Preencha os dados de seus pais abaixo.');
            return;
        }

        // 2. Varre a lista de dependentes (Apenas para CLT)
        $div.find(".dependente-card").each(function () {
            var parentesco = $(this).find(".dep-parentesco").val();
            var nome = $(this).find(".dep-nome").val();
            var estCivil = $(this).find(".dep-est-civil").val();
            var cpf = $(this).find(".dep-cpf").val();
            var nasc = $(this).find(".dep-nasc").val();
            var sexo = $(this).find(".dep-sexo").val();

            if (parentesco === "Mae") {
                // Só espelha e bloqueia na Filiação se o candidato realmente tiver digitado o NOME nos dependentes
                if (nome && nome.trim() !== "") {
                    $div.find("#cand_mae_nome_" + that.instanceId).val(nome);
                    if (estCivil) $div.find("#cand_mae_est_civil_" + that.instanceId).val(estCivil);
                    if (sexo) $div.find("#cand_mae_sexo_" + that.instanceId).val(sexo);
                    if (cpf) $div.find("#cand_mae_cpf_" + that.instanceId).val(cpf);
                    if (nasc) $div.find("#cand_mae_nasc_" + that.instanceId).val(nasc);
                }
            }

            if (parentesco === "Pai") {
                // Só espelha e bloqueia na Filiação se o candidato realmente tiver digitado o NOME nos dependentes
                if (nome && nome.trim() !== "") {
                    $div.find("#cand_pai_nome_" + that.instanceId).val(nome);
                    if (estCivil) $div.find("#cand_pai_est_civil_" + that.instanceId).val(estCivil);
                    if (sexo) $div.find("#cand_pai_sexo_" + that.instanceId).val(sexo);
                    if (cpf) $div.find("#cand_pai_cpf_" + that.instanceId).val(cpf);
                    if (nasc) $div.find("#cand_pai_nasc_" + that.instanceId).val(nasc);
                }
            }
        });
    },

    carregarTiposSanguineos: function (tentativas) {
        var that = this;
        var $select = $("#cand_tipo_sanguineo_" + that.instanceId);

        // CANCELA REQUISIÇÕES ANTERIORES PARA EVITAR "RACE CONDITION"
        if ($select.data('jqxhr')) {
            $select.data('jqxhr').abort();
        }

        var maxTentativas = 3;
        tentativas = tentativas || 0;

        var nomeDataset = "ds_irho_tipoSanguineo";
        var payloadObj = { name: nomeDataset, constraints: [] };
        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        var ajaxCall = $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                var carregouViaDataset = false;
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var resData = JSON.parse(rProxy.response);
                        if (resData.records && resData.records.length > 0) {
                            if (!resData.records[0].ERROR || resData.records[0].ERROR === "") {
                                $select.empty().append('<option value="">Selecione...</option>');

                                resData.records.forEach(function (item) {
                                    var valor = item.TIPOSANG;
                                    var texto = item.IDDESC_SANGUE || item.TIPOSANG;
                                    if (valor) $select.append('<option value="' + valor + '">' + texto + '</option>');
                                });
                                carregouViaDataset = true;
                            }
                        }
                    }
                }

                if (!carregouViaDataset) {
                    if (tentativas < maxTentativas) {
                        setTimeout(function () { that.carregarTiposSanguineos(tentativas + 1); }, 1500);
                        return;
                    }
                    $select.empty().append('<option value="">Falha ao carregar do RM</option>');
                }

                // VERIFICA SE EXISTE VALOR PENDENTE DA RESTAURAÇÃO
                if ($select.attr('data-valor-pendente')) {
                    $select.val($select.attr('data-valor-pendente')).trigger('change');
                    $select.removeAttr('data-valor-pendente');
                }
            },
            error: function (xhr) {
                if (xhr.statusText === "abort") return; // Ignora erros de aborto intencional
                if (tentativas < maxTentativas) { setTimeout(function () { that.carregarTiposSanguineos(tentativas + 1); }, 1500); return; }
                $select.empty().append('<option value="">Erro de conexão</option>');
            }
        });

        $select.data('jqxhr', ajaxCall);
    },

    carregarNacionalidades: function (tentativas) {
        var that = this;
        var $select = $("#cand_nacionalidade_" + that.instanceId);

        // Controle de Tentativas Invisíveis
        var maxTentativas = 3;
        tentativas = tentativas || 0;

        var payloadObj = { name: "ds_irho_codNacionalidade", constraints: [] };
        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                var carregou = false;
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var resData = JSON.parse(rProxy.response);
                        if (resData.records && resData.records.length > 0) {
                            if (!resData.records[0].ERROR || resData.records[0].ERROR === "") {
                                $select.empty().append('<option value="">Selecione...</option>');

                                resData.records.forEach(function (item) {
                                    var valor = item.CODNACAO;
                                    var texto = item.DESCRICAO;

                                    if (valor) {
                                        var selected = (valor == "10" || valor == 10) ? " selected" : "";
                                        $select.append('<option value="' + valor + '"' + selected + '>' + texto + '</option>');
                                    }
                                });
                                carregou = true;
                            }
                        }
                    }
                }

                if (!carregou) {
                    // RETENTATIVA: Tenta de novo se o RM falhar ou vier vazio
                    if (tentativas < maxTentativas) {
                        setTimeout(function () { that.carregarNacionalidades(tentativas + 1); }, 1500);
                        return; // Para a execução aqui para não limpar os dados pendentes
                    }
                    $select.empty().append('<option value="10">Brasileira</option>');
                }

                // Trata o carregamento assíncrono (Fallbacks e Restauração)
                if ($select.attr('data-valor-pendente')) {
                    var vp = $select.attr('data-valor-pendente');
                    if ($select.find('option[value="' + vp + '"]').length > 0) {
                        $select.val(vp).trigger('change');
                    } else {
                        $select.find('option').each(function () {
                            if ($(this).text().toUpperCase() === vp.toUpperCase()) {
                                $select.val($(this).val()).trigger('change');
                            }
                        });
                    }
                    $select.removeAttr('data-valor-pendente');
                }
            },
            error: function () {
                // RETENTATIVA: Erro 500 ou queda de conexão do Fluig
                if (tentativas < maxTentativas) {
                    setTimeout(function () { that.carregarNacionalidades(tentativas + 1); }, 1500);
                    return;
                }
                $select.empty().append('<option value="10">Brasileira</option>');
            }
        });
    },

    carregarMunicipios: function (ufSelecionada, idCampoSelect, tentativas) {
        var that = this;
        var $select = $("#" + idCampoSelect);

        if (!ufSelecionada || ufSelecionada === "") {
            $select.empty().append('<option value="">Selecione o Estado primeiro...</option>');
            return;
        }

        if (!tentativas || tentativas === 0) {
            // SALVA O VALOR ATUAL ANTES DE LIMPAR (Proteção contra limpezas indevidas)
            var valorAtual = $select.val();
            if (valorAtual && valorAtual !== "" && valorAtual.indexOf("Carregando") === -1 && valorAtual.indexOf("Selecione") === -1) {
                $select.attr('data-valor-pendente', valorAtual);
            }
            $select.empty().append('<option value="">Carregando...</option>');
        }

        // CANCELA REQUISIÇÕES ANTERIORES PARA EVITAR "RACE CONDITION"
        if ($select.data('jqxhr')) {
            $select.data('jqxhr').abort();
        }

        var maxTentativas = 3;
        tentativas = tentativas || 0;

        var constraints = [{ _field: "CODETDMUNICIPIO", _initialValue: ufSelecionada, _finalValue: ufSelecionada, _type: 1, _likeSearch: false }];
        var payloadObj = { name: "ds_irho_municipios", constraints: constraints };
        var dataProxy = {
            name: "ds_irho_api_proxy",
            constraints: [
                { _field: "action", _initialValue: "GET_DATASET", _finalValue: "GET_DATASET", _type: 1, _likeSearch: false },
                { _field: "payload", _initialValue: JSON.stringify(payloadObj), _finalValue: JSON.stringify(payloadObj), _type: 1, _likeSearch: false }
            ]
        };

        var url = WCMAPI.getServerURL() + '/api/public/ecm/dataset/datasets';

        var ajaxCall = $.ajax({
            url: url, type: 'POST', contentType: 'application/json', data: JSON.stringify(dataProxy),
            headers: { "Authorization": that.getOAuthHeader(url, 'POST').Authorization },
            success: function (resProxy) {
                var carregou = false;
                if (resProxy.content && resProxy.content.values && resProxy.content.values.length > 0) {
                    var rProxy = resProxy.content.values[0];
                    if (rProxy.status == "success") {
                        var resData = JSON.parse(rProxy.response);
                        if (resData.records && resData.records.length > 0) {
                            if (!resData.records[0].ERROR || resData.records[0].ERROR === "") {
                                $select.empty().append('<option value="">Selecione a cidade...</option>');

                                resData.records.forEach(function (item) {
                                    var nomeMunicipio = item.NOMEMUNICIPIO;
                                    if (nomeMunicipio) $select.append('<option value="' + nomeMunicipio + '">' + nomeMunicipio + '</option>');
                                });
                                carregou = true;
                            }
                        }
                    }
                }

                if (!carregou) {
                    if (tentativas < maxTentativas) { setTimeout(function () { that.carregarMunicipios(ufSelecionada, idCampoSelect, tentativas + 1); }, 1500); return; }
                    $select.empty().append('<option value="">Nenhuma cidade encontrada</option>');
                }

                // >>> DEVOLVE O VALOR SALVO (BUSCA INTELIGENTE) <<<
                var valorPendente = $select.attr('data-valor-pendente');
                if (valorPendente) {
                    var opcaoEncontrada = false;
                    $select.find("option").each(function () {
                        if ($(this).text().toUpperCase() === valorPendente.toUpperCase()) {
                            $select.val($(this).val()).trigger('change');
                            opcaoEncontrada = true;
                        }
                    });

                    // Se não encontrou, injeta como segurança
                    if (!opcaoEncontrada) {
                        $select.append('<option value="' + valorPendente + '" selected>' + valorPendente + '</option>');
                    }
                    $select.removeAttr('data-valor-pendente');
                }
            },
            error: function (xhr) {
                if (xhr.statusText === "abort") return; // Ignora erros de aborto intencional
                if (tentativas < maxTentativas) { setTimeout(function () { that.carregarMunicipios(ufSelecionada, idCampoSelect, tentativas + 1); }, 1500); return; }
                $select.empty().append('<option value="">Erro de conexão</option>');
            }
        });

        // Associa a chamada AJAX ao campo para controlo futuro
        $select.data('jqxhr', ajaxCall);
    },

    aplicarRegrasVisuaisPorJornada: function () {
        var that = this;
        var $div = $("#AdmissaoWidget_" + this.instanceId);

        // 1. Mapeia os blocos exclusivos CLT 
        var $painelCTPS = $div.find("#cand_tipo_ctps_" + that.instanceId).closest(".panel");
        var $painelCNH = $div.find("#cand_cnh_possuo_" + that.instanceId).closest(".panel");
        var $painelRegProf = $div.find("#cand_reg_prof_orgao_" + that.instanceId).closest(".panel");
        var $painelPlanoSaude = $div.find("#cand_ps_opcao_" + that.instanceId).closest(".panel");

        // ABA DE DEPENDENTES INTEIRA (Passo 5) no topo da tela
        var $abaDependentes = $div.find('.step-item[data-step="4"]');

        // 2. Mapeia TODOS os campos exclusivos de Estágio na aba de Formação
        var $camposEstagio = $div.find(
            "#cand_ano_conclusao_" + that.instanceId +
            ", #cand_curso_periodo_" + that.instanceId +
            ", #cand_curso_" + that.instanceId +
            ", #cand_instituicao_" + that.instanceId +
            ", #cand_instituicao_cnpj_" + that.instanceId +
            ", #cand_coordenador_nome_" + that.instanceId +
            ", #cand_coordenador_nacionalidade_" + that.instanceId).closest(".form-group");

        if (that.jornadaAdmissao === "Estagio" || that.jornadaAdmissao === "Estágio") {
            $painelCTPS.hide();
            $painelCNH.hide();
            $painelRegProf.hide();
            $painelPlanoSaude.hide();
            $abaDependentes.hide();

            // Exibe os campos detalhados de formação para Estágio
            $camposEstagio.show();
            // Retorna o Grau de Instrução para metade da tela
            $("#cand_grau_instrucao_" + that.instanceId).closest(".form-group").removeClass("col-md-12").addClass("col-md-6");
        } else {
            // LÓGICA PARA CLT
            $painelCTPS.show();
            $painelCNH.show();
            $painelRegProf.show();
            $painelPlanoSaude.show();
            $abaDependentes.show();

            // Oculta os campos detalhados de formação
            $camposEstagio.hide();
            // Estica o Grau de Instrução para ocupar a linha toda, já que os outros sumiram
            $("#cand_grau_instrucao_" + that.instanceId).closest(".form-group").removeClass("col-md-6").addClass("col-md-12");
        }

        // Força a renderização dos documentos fixos baseada na jornada e nos dados preenchidos
        that.renderizarDocumentosFixos();
    },

    carregarTiposSanguineosEstatico: function ($select) {
        // Lista fixa de emergência caso a integração RM/Dataset falhe
        var tipos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Não Sabe"];
        $select.empty().append('<option value="">Selecione...</option>');
        tipos.forEach(function (t) {
            $select.append('<option value="' + t + '">' + t + '</option>');
        });
    },

    calcularIdadeDependente: function (dataNasc) {
        if (!dataNasc) return 999;
        var parts = dataNasc.split('-');
        if (parts.length !== 3) return 999;
        var nasc = new Date(parts[0], parts[1] - 1, parts[2]);
        var hoje = new Date();
        var idade = hoje.getFullYear() - nasc.getFullYear();
        var m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
        return idade;
    },

    /**
     * Gera um PDF de Auditoria com todos os dados preenchidos pelo candidato.
     */
    gerarFichaCadastralPDF: function (dados, callbackSucesso, callbackErro) {
        var html = '<div id="fichaPdfTemp" style="padding: 30px; font-family: Helvetica, Arial, sans-serif;">';
        html += '<div style="text-align: center; margin-bottom: 20px;">';
        html += '<h2 style="margin:0; color: #015eb4;">Ficha Cadastral Original - Admissão</h2>';
        html += '<p style="color: #666; margin-top: 5px;">Documento de auditoria gerado automaticamente com os dados preenchidos pelo candidato.</p>';
        html += '</div>';

        html += '<table style="width: 100%; border-collapse: collapse; font-size: 11px;"><tbody>';

        function secao(titulo) {
            html += '<tr><td colspan="2" style="background-color: #015eb4; color: #fff; padding: 8px; font-weight: bold; margin-top: 15px; border: 1px solid #015eb4;">' + titulo + '</td></tr>';
        }

        function linha(label, valor) {
            var v = (valor === undefined || valor === null || valor === "") ? "Não informado" : valor;
            html += '<tr>';
            html += '<td style="padding: 6px 8px; border: 1px solid #ddd; width: 35%; font-weight: bold; background-color: #f9f9f9;">' + label + '</td>';
            html += '<td style="padding: 6px 8px; border: 1px solid #ddd;">' + v + '</td>';
            html += '</tr>';
        }

        secao("Dados Pessoais");
        linha("Nome Completo", dados.txtNomeColaborador);
        linha("CPF", dados.cpfcnpj);
        linha("Data de Nascimento", dados.dtDataNascColaborador);
        linha("E-mail", dados.txtEmail);
        linha("Celular", dados.txtCELULAR);
        linha("Estado Civil", dados.txtEstadoCivil);
        linha("Sexo", dados.txtSexo === "M" ? "Masculino" : (dados.txtSexo === "F" ? "Feminino" : "Não informado"));
        linha("Nacionalidade", dados.NACIONALIDADE);
        linha("Naturalidade / UF", dados.txtNaturalidade + " / " + dados.ESTADO);

        secao("Documentação");
        linha("RG", dados.TxtRg + " (" + dados.ORGAOCARTIDENTIDADE + "/" + dados.UFCARTIDENTIDADE + ")");
        linha("Emissão RG", dados.DTEMISSAOIDENT);
        linha("PIS", dados.PIS);
        linha("CTPS (Física/Digital)", dados.CTPS_Fisica_Digital + " - " + dados.txtCartTrab);
        linha("Título de Eleitor", dados.TITULOELEITOR + " (Zona: " + dados.ZONATITELEITOR + " / Seção: " + dados.SECAOTITELEITOR + ")");

        if (dados.txtCNH_Possui === "Sim") linha("CNH", dados.CARTMOTORISTA + " (Cat: " + dados.TIPOCARTHABILIT + ")");
        if (dados.txtReservista_Possui === "Sim") linha("Reservista", dados.CERTIFRESERV + " (Sit: " + dados.SitMilitar + ")");

        secao("Endereço");
        linha("CEP", dados.txtCEP);
        linha("Logradouro", dados.txtNOMETIPORUA + " " + dados.txtRUA + ", " + dados.txtNUMERO);
        linha("Complemento", dados.txtCOMPLEMENTO);
        linha("Bairro", dados.txtNOMETIPOBAIRRO + " " + dados.txtBAIRRO);
        linha("Cidade / UF", dados.txtNOMEMUNICIPIO + " / " + dados.txtNOMECODETD);

        secao("Dados Bancários");
        linha("Banco", dados.BancoPAgto);
        linha("Agência", dados.AgPagto);
        linha("Conta " + (dados.TipodeContPagto == "1" ? "Corrente/Poupança" : "Salário"), dados.ContPagto);
        linha("Chave PIX (" + dados.txtTipoChavePix + ")", dados.txtChavePix);

        secao("Formação Acadêmica");
        linha("Grau de Instrução", dados.txtEscolaridade);
        linha("Curso", dados.txtNomeCurso);
        linha("Instituição", dados.txtInstituicaoEnsino);
        linha("Ano Conclusão", dados.txtAnoConclusao);

        secao("Benefícios e Diversidade");
        linha("Vale Transporte", dados.ValeTransp === "1" ? "Optante" : "Não Optante");
        linha("Plano de Saúde", dados.TxtIncPlanoSaudeOpcao);
        linha("Possui Deficiência?", dados.txtPossuiDeficiencia + (dados.txtPossuiDeficiencia === "Sim" ? (" - " + dados.txtTipoDeficiencia) : ""));

        secao("Medidas para Uniforme");
        linha("Tamanho Camisa", dados.txtTamanhoCamisa);
        linha("Tamanho Calça", dados.txtTamanhoCalca);
        linha("Tamanho Calçado", dados.txtTamanhoCalcado);

        secao("Contato de Emergência");
        linha("Nome", dados.txtNomeEmergencia);
        linha("Parentesco", dados.txtParentescoEmergencia);
        linha("Telefone", dados.txtTelefoneEmergencia);

        html += '</tbody></table>';
        html += '<div style="margin-top: 30px; text-align: center; font-size: 10px; color: #999;">IP/Data do registro: ' + new Date().toLocaleString() + '</div></div>';

        // Anexa o HTML fora da tela (html2pdf não consegue ler display:none)
        var $tempDiv = $(html).css({
            'position': 'absolute',
            'top': '-9999px',
            'left': '-9999px',
            'width': '800px', // Largura fixa perfeita para o formato A4
            'background-color': '#ffffff'
        }).appendTo('body');

        var opt = {
            margin: 10,
            filename: 'Ficha_Cadastral_Auditoria.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from($tempDiv[0]).outputPdf('datauristring').then(function (pdfBase64) {
            $tempDiv.remove();
            callbackSucesso(pdfBase64);
        }).catch(function (err) {
            $tempDiv.remove();
            callbackErro(err);
        });
    },

});





