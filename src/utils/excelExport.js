const ExcelJS = require('exceljs');

async function budgetToExcel(budget) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Orçamento');

  sheet.addRow(['Campo', 'Valor']);
  sheet.addRow(['ID', budget.id]);
  sheet.addRow(['Cliente', budget.clientName]);
  sheet.addRow(['Descrição', budget.description]);
  sheet.addRow(['Custo Mão de Obra', budget.costs?.labor]);
  sheet.addRow(['Custo Material', budget.costs?.material]);
  sheet.addRow(['Custo Processamento', budget.costs?.processing]);
  sheet.addRow(['Total', budget.costs?.total]);
  sheet.addRow(['Margem', budget.pricing?.margin]);
  sheet.addRow(['Preço Final', budget.pricing?.finalPrice]);
  sheet.addRow(['Status', budget.status]);
  sheet.addRow(['Criado em', budget.createdAt]);
  sheet.addRow(['Atualizado em', budget.updatedAt]);

  // Adicione mais campos conforme necessário

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { budgetToExcel };
