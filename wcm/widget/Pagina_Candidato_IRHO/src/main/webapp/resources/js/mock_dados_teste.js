// Arquivo: resources/js/mock_dados_teste.js

$(document).ready(function() {
    // Aguarda a renderização da widget
    setTimeout(function() {
        criarBotaoPreenchimento();
    }, 1000);
});

function criarBotaoPreenchimento() {
    // Encontra o container da widget para pegar o ID da instância
    var $container = $(".admissao-container");
    if ($container.length === 0) return;

    var containerId = $container.attr("id"); // Ex: AdmissaoWidget_123
    var instanceId = containerId.split("_")[1];

    // Cria o botão de teste
    var btnHtml = '<button type="button" class="btn btn-warning btn-sm pull-right" id="btn_mock_teste_' + instanceId + '" style="margin: 10px; z-index:9999; position:relative;">' +
                  '<i class="flaticon flaticon-science"></i> Preencher Dados Teste' +
                  '</button>';
    
    $container.find(".text-center").first().prepend(btnHtml);

    // Evento de clique
    $("#btn_mock_teste_" + instanceId).on("click", function() {
        preencherTudo(instanceId);
    });
}

function preencherTudo(id) {
    console.log("Iniciando preenchimento fictício para instância: " + id);

    // Helper para preencher e disparar change
    function setVal(fieldId, value) {
        var $el = $("#" + fieldId);
        if ($el.length) {
            $el.val(value).trigger("change").trigger("input");
        } else {
            console.warn("Mock: Campo não encontrado no HTML -> " + fieldId);
        }
    }

    // =========================================================================
    // DADOS PESSOAIS (Exceto Nome, CPF, Email, Celular, Nascimento)
    // =========================================================================
    setVal("cand_naturalidade_" + id, "São Paulo");
    setVal("cand_nacionalidade_" + id, "Brasileira");
    setVal("cand_estado_natal_" + id, "SP");
    setVal("cand_estado_civil_" + id, "Solteiro");
    setVal("cand_sexo_" + id, "Masculino");
    setVal("cand_raca_" + id, "2"); // Branca
    setVal("cand_tipo_sanguineo_" + id, "O+");

    // RG E TÍTULO DE ELEITOR
    setVal("cand_rg_" + id, "12.345.678-9");
    setVal("cand_rg_uf_" + id, "SP");
    setVal("cand_rg_orgao_" + id, "SSP");
    setVal("cand_rg_data_emissao_" + id, "2015-05-20");

    setVal("cand_titulo_digital_" + id, "Sim");
    setVal("cand_titulo_eleitor_" + id, "123456789012");
    setVal("cand_titulo_zona_" + id, "123");
    setVal("cand_titulo_secao_" + id, "456");
    setVal("cand_titulo_uf_" + id, "SP");
    setVal("cand_titulo_data_emissao_" + id, "2016-10-10");

    // =========================================================================
    // ENDEREÇO
    // =========================================================================
    setVal("cand_cep_" + id, "01001-000");
    setVal("cand_tipo_logradouro_" + id, "Rua");
    setVal("cand_endereco_" + id, "Direita");
    setVal("cand_numero_" + id, "123");
    setVal("cand_complemento_" + id, "Apto 45");
    setVal("cand_tipo_bairro_" + id, "Bairro");
    setVal("cand_bairro_" + id, "Sé");
    setVal("cand_uf_" + id, "SP");
    setVal("cand_cidade_" + id, "São Paulo");
    setVal("cand_pais_" + id, "Brasil");

    // =========================================================================
    // CONTRATAÇÃO (Apenas as medidas e complementos)
    // =========================================================================
    setVal("cand_possui_deficiencia_" + id, "Nao");
    // setVal("cand_tamanho_calcado_" + id, "08"); // 40
    // setVal("cand_tamanho_camisa_" + id, "03");  // M
    // setVal("cand_tamanho_calca_" + id, "40");   // 40

    // =========================================================================
    // BANCÁRIOS E PIX
    // =========================================================================
    setVal("cand_banco_" + id, "341"); // Itaú
    setVal("cand_agencia_" + id, "1234");
    setVal("cand_conta_corrente_" + id, "12345-6");
    setVal("cand_tipo_conta_" + id, "Corrente"); 
    setVal("cand_tipo_pix_" + id, "CPF");        
    setVal("cand_chave_pix_" + id, "123.456.789-00"); // Chave PIX livre

    // =========================================================================
    // EMERGÊNCIA
    // =========================================================================
    setVal("cand_emergencia_nome_" + id, "Maria da Silva");
    setVal("cand_emergencia_parentesco_" + id, "4"); // Mae
    setVal("cand_emergencia_telefone_" + id, "(11) 98765-4321");

    // =========================================================================
    // DOCS EXTRAS (PIS, CTPS, SUS, Reservista, CNH, Reg. Profissional, Passaporte)
    // =========================================================================
    // setVal("cand_primeiro_emprego_" + id, "Nao"); 
    // setVal("cand_pis_" + id, "123.45678.90-1");
    // setVal("cand_ano_primeiro_emprego_" + id, "2018");

    // setVal("cand_tipo_ctps_" + id, "Digital");
    // setVal("cand_ctps_numero_" + id, "1234567");
    // setVal("cand_ctps_serie_" + id, "1234");
    // setVal("cand_ctps_data_emissao_" + id, "2018-01-15");
    // setVal("cand_ctps_uf_" + id, "SP");

    // setVal("cand_cartao_sus_" + id, "123456789012345");

    setVal("cand_reservista_possuo_" + id, "Sim"); 
    setVal("cand_reservista_numero_" + id, "123456789");
    setVal("cand_reservista_categoria_" + id, "1");
    setVal("cand_reservista_circunscricao_" + id, "2 CSM");
    setVal("cand_reservista_regiao_" + id, "2 RM");
    setVal("cand_reservista_orgao_" + id, "Exército");
    setVal("cand_reservista_data_emissao_" + id, "2010-01-01");
    setVal("cand_reservista_situacao_" + id, "Reservista");

    setVal("cand_cnh_possuo_" + id, "Sim");
    setVal("cand_cnh_tipo_" + id, "B");
    setVal("cand_cnh_numero_" + id, "12345678901");
    setVal("cand_cnh_data_venc_" + id, "2028-10-10");
    setVal("cand_cnh_data_primeira_" + id, "2018-10-10");
    setVal("cand_cnh_data_emissao_" + id, "2023-10-10");
    setVal("cand_cnh_uf_" + id, "SP");
    setVal("cand_cnh_orgao_" + id, "Detran");

    setVal("cand_reg_prof_orgao_" + id, "CRM");
    setVal("cand_reg_prof_uf_" + id, "SP");
    setVal("cand_reg_prof_num_" + id, "123456");
    setVal("cand_reg_prof_emissao_" + id, "2019-02-20");

    setVal("cand_passaporte_num_" + id, "FT123456");
    setVal("cand_passaporte_emissao_" + id, "2020-03-10");
    setVal("cand_passaporte_validade_" + id, "2030-03-10");

    // =========================================================================
    // FORMAÇÃO
    // =========================================================================
    setVal("cand_grau_instrucao_" + id, "Superior Completo"); 
    setVal("cand_ano_conclusao_" + id, "2019");
    setVal("cand_curso_" + id, "Engenharia de Software");
    setVal("cand_instituicao_" + id, "Universidade Fictícia");
    setVal("cand_curso_periodo_" + id, "6º Período");
    setVal("cand_instituicao_cnpj_" + id, "12.345.678/0001-90");
    setVal("cand_coordenador_nome_" + id, "Prof. Dr. Roberto Almeida");
    setVal("cand_coordenador_nacionalidade_" + id, "Brasileira");

    // =========================================================================
    // FILIAÇÃO (Campos Fixos - Se existirem no seu layout)
    // Usando CPFs Válidos para testes
    // =========================================================================
    setVal("cand_mae_nome_" + id, "Maria da Silva");
    setVal("cand_mae_sexo_" + id, "Feminino");
    setVal("cand_mae_est_civil_" + id, "Casado");
    setVal("cand_mae_cpf_" + id, "529.982.247-25"); // CPF Válido
    setVal("cand_mae_nasc_" + id, "1970-05-10");

    setVal("cand_pai_nome_" + id, "João da Silva");
    setVal("cand_pai_sexo_" + id, "Masculino");
    setVal("cand_pai_est_civil_" + id, "Casado");
    setVal("cand_pai_cpf_" + id, "073.145.663-60"); // CPF Válido
    setVal("cand_pai_nasc_" + id, "1968-08-20");

    // =========================================================================
    // BENEFÍCIOS (Novo Padrão)
    // =========================================================================
    setVal("cand_vt_opcao_" + id, "Opto");
    setVal("cand_vt_destino_" + id, "Para empresa");
    setVal("cand_vt_tipo_" + id, "Ônibus");
    setVal("cand_vt_num_linha_" + id, "123-A");
    setVal("cand_vt_nome_linha_" + id, "Centro x Distrito");
    setVal("cand_vt_empresa_" + id, "Viação Progresso");
    setVal("cand_vt_valor_" + id, "5,50");

    setVal("cand_ps_opcao_" + id, "Opto pela inclusão de dependente(s) e estou ciente dos custos e regras");
    setVal("cand_ps_tipo_dep_" + id, "Ambos");
    setVal("cand_ps_qtd_conjuge_" + id, "1");
    setVal("cand_ps_qtd_filhos_" + id, "2");

    // =========================================================================
    // UPLOADS FALSOS (Para não travar validações de anexo)
    // =========================================================================
    mockUploadVisual("cand_foto", id, "foto_perfil.jpg");
    mockUploadVisual("cand_doc_rg", id, "rg_frente_verso.pdf");
    mockUploadVisual("cand_doc_cpf", id, "cpf.pdf");
    mockUploadVisual("cand_doc_titulo", id, "titulo.pdf");
    mockUploadVisual("cand_doc_residencia", id, "comprovante_residencia.pdf");
    mockUploadVisual("cand_doc_escolaridade", id, "diploma.pdf");
    mockUploadVisual("cand_doc_cnh", id, "cnh.pdf");
    mockUploadVisual("cand_doc_reservista", id, "reservista.pdf");
    // mockUploadVisual("cand_doc_pis", id, "comprovante_pis.pdf");

    // =========================================================================
    // DEPENDENTES DINÂMICOS (Mãe e Filho fictício)
    // =========================================================================
    mockDependentes(id);

    FLUIGC.toast({
        title: 'Mock de Teste:',
        message: 'Dados preenchidos com sucesso!',
        type: 'success'
    });
}

function mockDependentes(id) {
    var $container = $("#container_dependentes_" + id);
    
    // 1. PREENCHER A MÃE (Que já existe na tela por padrão no Card)
    var $cardMae = null;
    $container.find(".dependente-card").each(function() {
        if ($(this).find(".dep-parentesco").val() === "Mae") {
            $cardMae = $(this);
        }
    });

    if ($cardMae && $cardMae.length > 0) {
        $cardMae.find(".dep-parentesco").val("Mãe").trigger("change");
        $cardMae.find(".dep-nome").val("Maria da Silva").trigger("change");
        $cardMae.find(".dep-cpf").val("162.271.276-55").trigger("change"); // CPF VÁLIDO
        $cardMae.find(".dep-rg").val("12.345.678-9").trigger("change");
        // $cardMae.find(".dep-sus").val("123456789012345").trigger("change");
        $cardMae.find(".dep-nasc").val("1970-05-10").trigger("change");
        $cardMae.find(".dep-est-civil").val("Casado").trigger("change");
        $cardMae.find(".dep-sexo").val("Feminino").trigger("change"); 
        // $cardMae.find(".dep-sf").val("Nao").trigger("change"); 
        $cardMae.find(".dep-obs").val("Mock Dependente Mãe").trigger("change");

        // Mock upload da Mãe
        $cardMae.find(".dep-doc-ident-nome").val("rg_mae.pdf");
        $cardMae.find(".dep-doc-ident-base64").val("DATA_FAKE_BASE64");
    }

}

function mockUploadVisual(prefixo, instanceId, fileName) {
    // Preenche os hiddens que o JS principal usa para validar e enviar
    $("#" + prefixo + "_nome_" + instanceId).val(fileName).trigger("change");
    $("#" + prefixo + "_base64_" + instanceId).val("BASE64_FAKE_PARA_TESTE").trigger("change");

    // Atualiza o visual (CSS) para ficar verde
    var $box = $("#box_" + prefixo + "_" + instanceId);
    if($box.length > 0) {
        $box.css({ "border": "2px solid #5cb85c", "background-color": "#dff0d8", "opacity": "1" });
        $box.find("i.flaticon").removeClass("text-info flaticon-upload").addClass("text-success flaticon-check-circle-on");
        $box.find("p").html('<b>Arquivo Anexado:</b><br><span style="font-size:12px;">' + fileName + '</span>');
    }
}