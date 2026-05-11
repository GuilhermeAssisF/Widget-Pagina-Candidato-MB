function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();

    // --- COLUNAS DE DEBUG E CONTROLE ---
    // Repassadas dinamicamente logo abaixo, mas vamos garantir o debug
    dataset.addColumn("atividadeAtual");
    dataset.addColumn("DEBUG_LOG");

    var constraintsPrincipal = new Array();
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            constraintsPrincipal.push(DatasetFactory.createConstraint(constraints[i].fieldName, constraints[i].initialValue, constraints[i].finalValue, constraints[i].constraintType));
        }
    }

    try {
        // Tenta buscar o dataset do formulário
        var datasetPrincipal = DatasetFactory.getDataset("DS_FLUIG_0002", null, constraintsPrincipal, sortFields);

        if (datasetPrincipal != null && datasetPrincipal.rowsCount > 0) {

            // Adiciona dinamicamente TODAS as colunas que vieram do formulário
            var colunasDoForm = datasetPrincipal.getColumnsName();
            for (var c = 0; c < colunasDoForm.length; c++) {
                // Previne de adicionar duplicado se por acaso for adicionar status abaixo
                if (colunasDoForm[c] !== "atividadeAtual" && colunasDoForm[c] !== "DEBUG_LOG") {
                    dataset.addColumn(colunasDoForm[c]);
                }
            }

            for (var i = 0; i < datasetPrincipal.rowsCount; i++) {

                function getVal(col) { try { var v = datasetPrincipal.getValue(i, col); return (v == null || v == "null" || v == undefined) ? "" : v; } catch (e) { return ""; } }

                var idProc = getVal("idProcessoFluig");

                // --- LÓGICA DE DIAGNÓSTICO ---
                var atividadeAtual = "0";
                var logDebug = "INICIO DEBUG | ID Processo: " + idProc + " | ";

                if (idProc && idProc != "") {
                    try {
                        // Busca TODAS as tarefas ativas deste processo
                        var cT1 = DatasetFactory.createConstraint("processInstanceId", idProc, idProc, ConstraintType.MUST);
                        var cT2 = DatasetFactory.createConstraint("active", "true", "true", ConstraintType.MUST);

                        // Trazemos as colunas necessárias para comparar manualmente
                        var dsTask = DatasetFactory.getDataset("processTask", ["choosedSequence", "movementSequence"], [cT1, cT2], null);

                        if (dsTask && dsTask.rowsCount > 0) {
                            var maiorMovimento = -1;

                            // LOOP MANUAL: Acha a tarefa com maior movementSequence (a mais recente)
                            for (var k = 0; k < dsTask.rowsCount; k++) {
                                var seqAtv = parseInt(dsTask.getValue(k, "choosedSequence"));
                                var seqMov = parseInt(dsTask.getValue(k, "movementSequence"));

                                logDebug += "[Achou Task: Atv=" + seqAtv + ", Mov=" + seqMov + "] ";

                                if (seqMov > maiorMovimento) {
                                    maiorMovimento = seqMov;
                                    atividadeAtual = seqAtv.toString();
                                }
                            }
                            logDebug += ">> DECISAO FINAL: " + atividadeAtual;
                        } else {
                            logDebug += "ERRO: Nenhuma tarefa ativa encontrada no processTask. O processo pode ter sido encerrado.";
                        }
                    } catch (errTask) {
                        logDebug += "CRASH ao consultar processTask: " + errTask;
                    }
                } else {
                    logDebug += "AVISO: ID do Processo vazio. Verifique se o campo 'idProcessoFluig' esta gravado no formulario.";
                }

                // Cria a linha mesclando o debug com as colunas do formulário
                var arrLinha = [];
                // Primeiro insere as colunas de debug (por causa da criacao das colunas lá em cima)
                arrLinha.push(atividadeAtual);
                arrLinha.push(logDebug);

                // Em seguida insere o resto dinamicamente
                for (var h = 0; h < colunasDoForm.length; h++) {
                    if (colunasDoForm[h] !== "atividadeAtual" && colunasDoForm[h] !== "DEBUG_LOG") {
                        arrLinha.push(getVal(colunasDoForm[h]));
                    }
                }

                dataset.addRow(arrLinha);
            }
        } else {
            dataset.addColumn("ERRO_DATASET_FORM");
            dataset.addRow(new Array("DS_FLUIG_0002 retornou vazio ou nulo. Verifique as constraints."));
        }
    } catch (e) {
        // Se explodir tudo, retorna o erro na primeira coluna pra gente ver
        dataset.addColumn("ERRO_FATAL");
        dataset.addRow(new Array("Erro Fatal no Dataset: " + e.message));
    }
    return dataset;
}