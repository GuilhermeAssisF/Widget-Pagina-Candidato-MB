var AdmissaoObrigatoriedade = {

    // 1. MAPEAMENTO DE REGRAS: Retorna true se o campo for obrigatório
    regras: function (widget) {
        var isEstagio = (widget.jornadaAdmissao === "Estagio" || widget.jornadaAdmissao === "Estagiario" || widget.jornadaAdmissao === "Estágio" || widget.jornadaAdmissao === "Estagiário");
        var isCLT = !isEstagio;
        var isMasculino = ($("#cand_sexo_" + widget.instanceId).val() === "Masculino" || $("#cand_sexo_" + widget.instanceId).val() === "M");

        // Verifica a filial para decidir se exige medidas (Roupas/EPI)
        var filialUpper = (widget.nomeFilial || "").toUpperCase();
        var exigeMedidas = false;

        // Função auxiliar para pegar valor do campo
        var val = function (id) { return $("#" + id + "_" + widget.instanceId).val(); };

        return {
            // --- Passo 2: Dados Pessoais ---
            "cand_cpf": function () { return true; },
            "cand_nascimento": function () { return true; },
            "cand_estado_natal": function () { return true; },
            "cand_naturalidade": function () { return true; },
            "cand_estado_civil": function () { return true; },
            "cand_sexo": function () { return true; },
            "cand_nacionalidade": function () { return true; },
            "cand_raca": function () { return true; },
            "cand_rg": function () { return true; },
            "cand_rg_uf": function () { return true; },
            "cand_rg_orgao": function () { return true; },
            "cand_rg_data_emissao": function () { return true; },
            "cand_titulo_digital": function () { return true; },
            "cand_titulo_eleitor": function () { return true; },
            "cand_titulo_zona": function () { return true; },
            "cand_titulo_secao": function () { return true; },
            "cand_titulo_uf": function () { return true; },
            "cand_titulo_data_emissao": function () { return true; },

            // Endereço
            "cand_cep": function () { return true; },
            "cand_pais": function () { return true; },
            "cand_tipo_logradouro": function () { return true; },
            "cand_endereco": function () { return true; },
            "cand_complemento": function () { return true; },
            "cand_numero": function () { return true; },
            "cand_tipo_bairro": function () { return true; },
            "cand_bairro": function () { return true; },
            "cand_uf": function () { return true; },
            "cand_cidade": function () { return true; },


            // Contratação e Deficiência
            "cand_possui_deficiencia": function () { return true; },
            "cand_tipo_deficiencia": function () { return val("cand_possui_deficiencia") === "Sim"; },

            // Medidas (Roupas/EPI) - Apenas para filiais que exigem
            // "cand_tamanho_calcado": function () { return exigeMedidas; },
            // "cand_tamanho_camisa": function () { return exigeMedidas; },
            // "cand_tamanho_calca": function () { return exigeMedidas; },

            // Bancários
            "cand_possui_conta_itau": function () { return true; },
            "cand_banco": function () { return true; },
            "cand_agencia": function () { return true; },
            "cand_conta_corrente": function () { return true; },
            "cand_tipo_conta": function () { return true; },
            "cand_tipo_pix": function () { return true; },
            "cand_chave_pix": function () { return true; },

            // Emergência
            "cand_emergencia_nome": function () { return true; },
            "cand_emergencia_parentesco": function () { return true; },
            "cand_emergencia_telefone": function () { return true; },

            // Docs Extras
            // "cand_primeiro_emprego": function () { return false; },
            // "cand_pis": function () { return false; },
            // "cand_ano_primeiro_emprego": function () { return false; },
            // "cand_tipo_ctps": function () { return false; },
            // "cand_ctps_numero": function () { return false; },
            // "cand_ctps_serie": function () { return false; },
            // "cand_ctps_uf": function () { return false; },

            "cand_cnh_possuo": function () { return isCLT; },
            "cand_cnh_tipo": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },
            "cand_cnh_numero": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },
            "cand_cnh_uf": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },
            "cand_cnh_orgao": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },
            "cand_cnh_data_venc": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },
            "cand_cnh_data_primeira": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },
            "cand_cnh_data_emissao": function () { return isCLT && val("cand_cnh_possuo") === "Sim"; },

            "cand_reservista_possuo": function () { return isMasculino; },
            "cand_reservista_numero": function () { return isMasculino && val("cand_reservista_possuo") === "Sim"; },
            "cand_reservista_categoria": function () { return isMasculino && val("cand_reservista_possuo") === "Sim"; },
            "cand_reservista_regiao": function () { return isMasculino && val("cand_reservista_possuo") === "Sim"; },
            "cand_reservista_orgao": function () { return isMasculino && val("cand_reservista_possuo") === "Sim"; },
            "cand_reservista_data_emissao": function () { return isMasculino && val("cand_reservista_possuo") === "Sim"; },
            "cand_reservista_situacao": function () { return isMasculino && val("cand_reservista_possuo") === "Sim"; },

            // --- Passo 3: Formação ---
            "cand_grau_instrucao": function () { return true; },
            "cand_ano_conclusao": function () { return isEstagio; },
            "cand_curso": function () { return isEstagio; },
            "cand_curso_periodo": function () { return isEstagio; },
            "cand_instituicao": function () { return isEstagio; },
            "cand_instituicao_cnpj": function () { return isEstagio; },
            "cand_coordenador_nome": function () { return isEstagio; },
            "cand_coordenador_nacionalidade": function () { return isEstagio; },

            // --- Passo 6: Benefícios ---
            "cand_vt_opcao": function () { return true; },

            "cand_ps_opcao": function () { return isCLT; },
            "cand_ps_tipo_dep": function () { return isCLT && (val("cand_ps_opcao") || "").indexOf("Opto") === 0; },
            "cand_ps_qtd_conjuge": function () { return isCLT && (val("cand_ps_opcao") || "").indexOf("Opto") === 0 && (val("cand_ps_tipo_dep") === "Cônjuge" || val("cand_ps_tipo_dep") === "Ambos"); },
            "cand_ps_qtd_filhos": function () { return isCLT && (val("cand_ps_opcao") || "").indexOf("Opto") === 0 && (val("cand_ps_tipo_dep") === "Filho(s)" || val("cand_ps_tipo_dep") === "Ambos"); }
        };
    },

    // 2. FUNÇÃO VISUAL: Desenha e remove os asteriscos na tela dinamicamente
    atualizarAsteriscos: function (widget) {
        var regras = this.regras(widget);
        var $div = $("#AdmissaoWidget_" + widget.instanceId);

        // Removemos todos os asteriscos dinâmicos antes de recalcular
        $div.find("label .asterisco-dinamico").remove();

        Object.keys(regras).forEach(function (idCampo) {
            if (regras[idCampo]()) {
                var $label = $div.find("#" + idCampo + "_" + widget.instanceId).closest(".form-group").find("label").first();
                // Adiciona o asterisco apenas se a label existir e não tiver um asterisco
                if ($label.length && $label.find(".asterisco-dinamico").length === 0) {
                    $label.append(' <span class="text-danger asterisco-dinamico">*</span>');
                }
            }
        });

        // O Passo 4 (Dependentes) tem classes genéricas em vez de IDs, tratamos a parte:
        var isCLT = (widget.jornadaAdmissao !== "Estagio" && widget.jornadaAdmissao !== "Estágio");
        if (isCLT) {
            $div.find(".dependente-card").each(function () {
                var $card = $(this);
                ["dep-parentesco", "dep-nome", "dep-sexo", "dep-cpf", "dep-nasc"].forEach(function (cls) {
                    var $label = $card.find("." + cls).closest(".form-group").find("label").first();
                    if ($label.length && $label.find(".asterisco-dinamico").length === 0) {
                        $label.append(' <span class="text-danger asterisco-dinamico">*</span>');
                    }
                });
            });
        }
    },

    // 3. FUNÇÃO TRAVA: Verifica se os campos obrigatórios estão preenchidos na hora de avançar
    validarPasso: function (passo, widget, container) {
        if (window.ignorarValidacao === true) return true;

        this.atualizarAsteriscos(widget);

        var regras = this.regras(widget);
        var $d = $("#AdmissaoWidget_" + widget.instanceId);
        var valid = true;
        var msg = "";

        // Função interna para marcar erro e salvar a mensagem
        function erro(mensagem, $campo) {
            msg = mensagem;
            valid = false;
            if ($campo && $campo.length) {
                $campo.css("border-color", "#d9534f").focus();
            }
            return false;
        }

        // Define o alvo: ou o container específico (aba), ou o passo inteiro
        var $target = container || $d.find('.step-content[data-step-content="' + passo + '"]');

        // Limpa marcações de erro anteriores
        $target.find(".form-control").css("border-color", "");
        $target.find(".upload-box").css("border", "").removeClass("shake");

        // 1. VALIDAÇÃO DE CAMPOS MAPEADOS (Passos 3, 4, 6, 7)
        if (!passo || [2, 3, 5, 6].indexOf(passo) > -1) {
            var keys = Object.keys(regras);
            for (var i = 0; i < keys.length; i++) {
                var id = keys[i];
                var $c = $target.find("#" + id + "_" + widget.instanceId);

                // Se a regra diz que é obrigatório e o campo existe neste passo/aba
                if (regras[id]() && $c.length) {
                    if (!$c.val() || $c.val().trim() === "") {
                        var labelText = $c.closest(".form-group").find("label").first().text().replace("*", "").trim() || "Campo obrigatório";
                        erro("O campo <strong>" + labelText + "</strong> é obrigatório.", $c);

                        if (passo) {
                            var tabId = $c.closest(".tab-pane").attr("id");
                            if (tabId) $d.find('a[href="#' + tabId + '"]').tab('show');
                        }
                        break; // Para no primeiro erro encontrado
                    }
                }
            }
        }

        // 2. VALIDAÇÃO DOS DEPENDENTES (Passo 4)
        if (valid && (passo == 4 || (!passo && $target.find(".dependente-card").length > 0))) {
            var isCLT = (widget.jornadaAdmissao !== "Estagio" && widget.jornadaAdmissao !== "Estágio");
            var $cards = $target.find(".dependente-card");

            if (isCLT && $cards.length > 0) {
                $cards.each(function (index) {
                    var $card = $(this);
                    // Lista de classes obrigatórias nos cards
                    var obgDeps = [
                        { cls: "dep-parentesco", nome: "Parentesco" },
                        { cls: "dep-nome", nome: "Nome" },
                        { cls: "dep-sexo", nome: "Sexo" },
                        { cls: "dep-cpf", nome: "CPF" },
                        { cls: "dep-nasc", nome: "Nascimento" }
                    ];

                    for (var d = 0; d < obgDeps.length; d++) {
                        var $f = $card.find("." + obgDeps[d].cls);
                        if ($f.length && (!$f.val() || $f.val().trim() === "")) {
                            return erro("O campo <strong>" + obgDeps[d].nome + "</strong> do dependente " + (index + 1) + " é obrigatório.", $f);
                        }
                    }

                    // Valida anexos obrigatórios visíveis do dependente
                    var anexos = [
                        { sel: ".doc-cpf", b64: ".dep-base64-cpf", nome: "CPF" },
                        { sel: ".doc-rg-frente", b64: ".dep-base64-rgf", nome: "RG Frente" },
                        { sel: ".doc-rg-verso", b64: ".dep-base64-rgv", nome: "RG Verso" },
                        { sel: ".doc-cert-nasc", b64: ".dep-base64-certnasc", nome: "Certidão" }
                    ];

                    for (var a = 0; a < anexos.length; a++) {
                        var $sec = $card.find(anexos[a].sel);
                        if ($sec.is(":visible") && !$card.find(anexos[a].b64).val()) {
                            $sec.find(".upload-box").css("border", "2px solid #d9534f").effect("shake");
                            return erro("O anexo de <strong>" + anexos[a].nome + "</strong> do dependente " + (index + 1) + " é obrigatório.");
                        }
                    }
                    return valid;
                });
            }
        }

        // 3. VALIDAÇÃO DE ROTAS DE VALE TRANSPORTE (Passo 6)
        if (valid && (passo == 6 || (!passo && $target.find(".vt-card").length > 0))) {
            var $selectOpcaoVT = $d.find("#cand_vt_opcao_" + widget.instanceId);
            var optoVT = ($selectOpcaoVT.val() === "Opto");

            if (optoVT) {
                var $rotas = $target.find(".vt-card");

                if ($rotas.length === 0) {
                    return erro("Você optou pelo Vale Transporte. Clique em 'Adicionar Rota' e insira os dados.", $selectOpcaoVT);
                } else {
                    $rotas.each(function (index) {
                        var $card = $(this);
                        // Campos que não podem ficar em branco no VT
                        var obgRotas = [
                            { cls: "vt-destino", nome: "Trajeto (Ida/Volta)" },
                            { cls: "vt-tipo", nome: "Tipo de Transporte" },
                            { cls: "vt-empresa", nome: "Empresa" },
                            { cls: "vt-linha", nome: "Linha" },
                            { cls: "vt-valor", nome: "Tarifa" }
                        ];

                        for (var r = 0; r < obgRotas.length; r++) {
                            var $f = $card.find("." + obgRotas[r].cls);
                            if ($f.length && (!$f.val() || $f.val().trim() === "")) {
                                return erro("O campo <strong>" + obgRotas[r].nome + "</strong> da Rota " + (index + 1) + " é obrigatório.", $f);
                            }
                        }
                    });
                }
            }
        }

        // 4. VALIDAÇÃO DE DOCUMENTOS (Passo 7)
        if (valid && passo == 7) {
            // Documentos Dinâmicos (Dataset)
            for (var j = 0; j < widget.configDocs.length; j++) {
                var doc = widget.configDocs[j];
                var idCampo = doc.doc_campo_interno.trim();
                var ehObg = (String(doc.doc_obrigatorio).toLowerCase() === "true");
                var preenchido = $("#" + idCampo + "_base64_" + widget.instanceId).val();

                if (ehObg && (!preenchido || preenchido.trim() === "")) {
                    $("#box_" + idCampo + "_" + widget.instanceId).css("border", "2px solid #d9534f").effect("shake");
                    erro("O documento <strong>" + doc.doc_titulo + "</strong> é obrigatório.");
                    break;
                }
            }

            // Documentos Fixos (CNH, Reservista, etc)
            if (valid && widget.docsFixosExigidos) {
                for (var f = 0; f < widget.docsFixosExigidos.length; f++) {
                    var fixo = widget.docsFixosExigidos[f];
                    var base64Fixo = $("#" + fixo.id + "_base64_" + widget.instanceId).val();

                    if (fixo.obrigatorio && (!base64Fixo || base64Fixo.trim() === "")) {
                        $("#box_" + fixo.id + "_" + widget.instanceId).css("border", "2px solid #d9534f").effect("shake");
                        erro("O documento <strong>" + fixo.titulo + "</strong> é obrigatório.");
                        break;
                    }
                }
            }
        }

        // Dispara o alerta se houver erro e bloqueia o avanço
        if (!valid) {
            FLUIGC.toast({ title: 'Atenção', message: msg, type: 'warning' });
        }

        return valid;
    },

    validarAba: function ($container, widget) {
        return this.validarPasso(null, widget, $container);
    }
};
