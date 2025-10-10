const ExcelJS = require('exceljs');

async function budgetToExcel(budget) {
    const workbook = new ExcelJS.Workbook();
    
    // Informações do Documento
    workbook.creator = 'ModelCalc';
    workbook.lastModifiedBy = 'ModelCalc';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Planilha Principal
    const mainSheet = workbook.addWorksheet('Orçamento', {
        properties: { tabColor: { argb: '0066CC' } }
    });

    // Estilo para títulos
    const titleStyle = {
        font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '0066CC' } },
        alignment: { horizontal: 'center', vertical: 'middle' }
    };

    // Estilo para subtítulos
    const subtitleStyle = {
        font: { bold: true, size: 11 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6E6E6' } }
    };

    // Estilo para valores monetários
    const currencyStyle = {
        numFmt: '"R$"#,##0.00'
    };

    // Informações Gerais
    mainSheet.addRow(['INFORMAÇÕES DO ORÇAMENTO']).font = { bold: true, size: 14 };
    mainSheet.addRow([]);

    const infoRows = [
        ['Projeto:', budget.projectId.name],
        ['Cliente:', budget.clientId.name],
        ['Empresa:', budget.clientId.company],
        ['Descrição:', budget.description],
        ['Status:', budget.status.toUpperCase()],
        ['Data de Criação:', new Date(budget.createdAt).toLocaleDateString('pt-BR')],
        ['Última Atualização:', new Date(budget.updatedAt).toLocaleDateString('pt-BR')]
    ];

    infoRows.forEach(row => mainSheet.addRow(row));

    mainSheet.addRow([]);

    // Materiais
    mainSheet.addRow(['LISTA DE MATERIAIS']).font = { bold: true, size: 14 };
    mainSheet.addRow(['Material', 'Quantidade', 'Custo Unitário', 'Custo Total']);
    budget.materials.forEach(material => {
        mainSheet.addRow([
            material.name,
            material.quantity,
            material.unitCost,
            material.totalCost
        ]);
    });

    mainSheet.addRow([]);

    // Processos
    mainSheet.addRow(['LISTA DE PROCESSOS']).font = { bold: true, size: 14 };
    mainSheet.addRow(['Processo', 'Duração (h)', 'Custo/Hora', 'Custo Total']);
    budget.processes.forEach(process => {
        mainSheet.addRow([
            process.name,
            process.duration,
            process.hourlyRate,
            process.totalCost
        ]);
    });

    mainSheet.addRow([]);

    // Resumo de Custos
    mainSheet.addRow(['RESUMO DE CUSTOS']).font = { bold: true, size: 14 };
    const costRows = [
        ['Custo de Materiais:', budget.materialCost],
        ['Custo de Processos:', budget.processingCost],
        ['Custo de Mão de Obra:', budget.laborCost],
        ['Custo Total:', budget.totalCost],
        ['Margem (%):', budget.margin],
        ['Preço Final:', budget.finalPrice]
    ];

    costRows.forEach(row => {
        const excelRow = mainSheet.addRow(row);
        if (row[0].includes('Total') || row[0].includes('Final')) {
            excelRow.font = { bold: true };
        }
    });

    // Arquivos CAD
    if (budget.cadFiles && budget.cadFiles.length > 0) {
        mainSheet.addRow([]);
        mainSheet.addRow(['ARQUIVOS CAD']).font = { bold: true, size: 14 };
        mainSheet.addRow(['Nome do Arquivo', 'Tipo', 'Tamanho']);
        budget.cadFiles.forEach(file => {
            mainSheet.addRow([file.name, file.fileType, `${(file.size / 1024 / 1024).toFixed(2)} MB`]);
        });
    }

    // Formatação de colunas
    mainSheet.columns.forEach(column => {
        column.width = 20;
    });

    // Aplicar estilos monetários
    mainSheet.getColumn('C').numFmt = '"R$"#,##0.00';
    mainSheet.getColumn('D').numFmt = '"R$"#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

module.exports = { budgetToExcel };
