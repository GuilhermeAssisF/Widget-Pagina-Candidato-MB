function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn("status");
    newDataset.addColumn("mensagem");

    var idSolicitacao = 0;
    // O usuário que vai assumir a tarefa (seu usuário integrador)
    // Se quiser deixar dinâmico vindo da widget, use a lógica de constraints
    var USUARIO_DESTINO = "widgetpublicadeadmissao"; 

    try {
        if (constraints != null) {
            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].fieldName == "idSolicitacao") {
                    idSolicitacao = parseInt(constraints[i].initialValue);
                }
                // Opcional: Se sua widget mandar o usuário
                if (constraints[i].fieldName == "usuarioDestino") {
                    USUARIO_DESTINO = constraints[i].initialValue;
                }
            }
        }

        if (idSolicitacao == 0) {
            newDataset.addRow(["ERRO", "ID nao informado."]);
            return newDataset;
        }

        log.info(">>> DS_MOVIMENTAR: Verificando tarefa " + idSolicitacao + " para destino " + USUARIO_DESTINO);

        var workflowEngine = getServiceViaReflection();

        // Busca dados da tarefa para saber se está em Pool ou com Usuário
        var c1 = DatasetFactory.createConstraint("processTaskPK.processInstanceId", idSolicitacao, idSolicitacao, ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("active", "true", "true", ConstraintType.MUST);
        var dsTasks = DatasetFactory.getDataset("processTask", null, [c1, c2], null);

        if (dsTasks.rowsCount > 0) {
            var movementSequence = dsTasks.getValue(0, "processTaskPK.movementSequence");
            var threadSequence = dsTasks.getValue(0, "processTaskPK.threadSequence");
            var usuarioAtual = dsTasks.getValue(0, "processTaskPK.colleagueId"); // Pode vir null/vazio se estiver em Papel

            log.info(">>> DS_MOVIMENTAR: Tarefa atual com: " + (usuarioAtual ? usuarioAtual : "POOL/PAPEL"));

            // CENÁRIO 1: Tarefa já está com o usuário certo
            if (usuarioAtual == USUARIO_DESTINO) {
                newDataset.addRow(["OK", "Usuario ja e o responsavel."]);
            
            // CENÁRIO 2: Tarefa está em Pool (Papel) -> Usar takeProcessTask
            } else if (usuarioAtual == null || usuarioAtual == "" || usuarioAtual == "null") {
                log.info(">>> DS_MOVIMENTAR: Assumindo tarefa do Pool (TakeProcessTask)...");
                
                // takeProcessTask(user, processInstanceId, movementSequence, threadSequence)
                workflowEngine.takeProcessTask(USUARIO_DESTINO, idSolicitacao, parseInt(movementSequence), parseInt(threadSequence));
                
                newDataset.addRow(["OK", "Tarefa assumida do Pool com sucesso."]);

            // CENÁRIO 3: Tarefa está com outra pessoa -> Usar transferTask
            } else {
                log.info(">>> DS_MOVIMENTAR: Transferindo de " + usuarioAtual + " para " + USUARIO_DESTINO);
                
                // transferTask(userSolicitante, id, movSeq, userDestino, threadSeq, motivo)
                // Usamos USUARIO_DESTINO como solicitante assumindo que ele tem permissão (é admin ou membro do grupo)
                workflowEngine.transferTask(USUARIO_DESTINO, idSolicitacao, parseInt(movementSequence), USUARIO_DESTINO, parseInt(threadSequence), "Transferência via Widget");
                
                newDataset.addRow(["OK", "Transferido de " + usuarioAtual]);
            }

        } else {
            newDataset.addRow(["ERRO", "Nenhuma tarefa ativa encontrada para a solicitacao " + idSolicitacao]);
        }

    } catch (e) {
        log.error(">>> DS_MOVIMENTAR ERRO: " + e);
        newDataset.addRow(["ERRO", "Excecao: " + e.toString()]);
    }

    return newDataset;
}

function getServiceViaReflection() {
    // Lista de endereços JNDI possíveis para o WorkflowEngineService
    // Diferentes versões do JBoss/Fluig usam caminhos diferentes
    var paths = [
        "java:global/fluig/ecm-ejb/WorkflowEngineService",
        "java:app/ecm-ejb/WorkflowEngineService",
        "java:global/fluig/ecm-ejb/WorkflowEngineService!com.totvs.technology.ecm.workflow.engine.service.WorkflowEngineService"
    ];

    var ctx = new javax.naming.InitialContext();
    var erros = "";

    for (var i = 0; i < paths.length; i++) {
        try {
            var service = ctx.lookup(paths[i]);
            log.info(">>> DS_MOVIMENTAR: Servico carregado com sucesso via: " + paths[i]);
            return service;
        } catch (e) {
            erros += "[" + paths[i] + ": " + e.toString() + "] ";
        }
    }

    // Se chegou aqui, nenhum funcionou
    throw "Falha Crítica: Não foi possível carregar WorkflowEngineService em nenhum dos caminhos JNDI testados. Detalhes: " + erros;
}