const PDFDocument = require('pdfkit');

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return '-';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }
    return date.toLocaleDateString('pt-BR');
}

async function budgetToPDF(budget) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (error) => reject(error));

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Orçamento', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica');
        doc.text(`Código: ${budget._id}`);
        doc.text(`Status: ${budget.status || 'Não definido'}`);
        doc.text(`Criado em: ${formatDate(budget.createdAt)}`);
        doc.moveDown();

        // Cliente e Projeto
        doc.font('Helvetica-Bold').text('Informações do Cliente', { continued: false });
        doc.font('Helvetica');
        doc.text(`Cliente: ${budget.clientId?.name || 'Não informado'}`);
        doc.text(`Empresa: ${budget.clientId?.company || 'Não informado'}`);
        doc.moveDown();

        doc.font('Helvetica-Bold').text('Informações do Projeto');
        doc.font('Helvetica');
        doc.text(`Projeto: ${budget.projectId?.name || 'Não informado'}`);
        doc.text(`Descrição do Orçamento:`);
        doc.font('Helvetica-Oblique').text(budget.description || '-', { indent: 15 });
        doc.moveDown();

        // Materiais
        doc.font('Helvetica-Bold').text('Materiais');
        if (budget.materials && budget.materials.length > 0) {
            doc.font('Helvetica');
            budget.materials.forEach((material) => {
                const totalCost = material.totalCost ?? (material.quantity || 0) * (material.unitCost || 0);
                doc.text(material.name || 'Material');
                doc.text(`Quantidade: ${material.quantity || 0}`);
                doc.text(`Custo unitário: ${formatCurrency(material.unitCost || 0)} | Total: ${formatCurrency(totalCost)}`);
                doc.moveDown(0.5);
            });
        } else {
            doc.font('Helvetica').text('Nenhum material cadastrado.');
        }
        doc.moveDown();

        // Processos
        doc.font('Helvetica-Bold').text('Processos');
        if (budget.processes && budget.processes.length > 0) {
            doc.font('Helvetica');
            budget.processes.forEach((process) => {
                const totalCost = process.totalCost ?? (process.duration || 0) * (process.hourlyRate || 0);
                doc.text(process.name || 'Processo');
                doc.text(`Duração: ${process.duration || 0} h`);
                doc.text(`Custo/hora: ${formatCurrency(process.hourlyRate || 0)} | Total: ${formatCurrency(totalCost)}`);
                doc.moveDown(0.5);
            });
        } else {
            doc.font('Helvetica').text('Nenhum processo cadastrado.');
        }
        doc.moveDown();

        // Resumo financeiro
        doc.font('Helvetica-Bold').text('Resumo Financeiro');
        doc.font('Helvetica');
        doc.text(`Custo de mão de obra: ${formatCurrency(budget.laborCost || 0)}`);
        doc.text(`Custo de materiais: ${formatCurrency(budget.materialCost || 0)}`);
        doc.text(`Custo de processos: ${formatCurrency(budget.processingCost || 0)}`);
        doc.text(`Custo total: ${formatCurrency(budget.totalCost || 0)}`);
        doc.text(`Margem aplicada: ${(Number(budget.margin || 0)).toFixed(2)} %`);
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').text(`Preço final: ${formatCurrency(budget.finalPrice || budget.totalCost || 0)}`);

        doc.end();
    });
}

module.exports = { budgetToPDF };
