import jsPDF from 'jspdf';
import type { Recipe } from '../App';

export function exportRecipeToPDF(recipe: Recipe) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = 20;

  // Titel
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(recipe.title, maxWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 10 + 5;

  // Linie unter Titel
  doc.setDrawColor(255, 140, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Kalorien
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${recipe.calories} kcal`, margin, yPosition);
  yPosition += 8;

  // Tags
  if (recipe.tags.length > 0) {
    doc.text(`Tags: ${recipe.tags.join(', ')}`, margin, yPosition);
    yPosition += 10;
  }

  // Beschreibung
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const descLines = doc.splitTextToSize(recipe.description, maxWidth);
  doc.text(descLines, margin, yPosition);
  yPosition += descLines.length * 6 + 10;

  // Prüfen ob neue Seite nötig
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Zutaten
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Zutaten', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  recipe.ingredients.forEach((ingredient) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    let ingredientText = '';
    if (typeof ingredient === 'string') {
      ingredientText = ingredient;
    } else {
      ingredientText = ingredient.quantity 
        ? `${ingredient.quantity} ${ingredient.name}`
        : ingredient.name;
    }

    doc.text(`• ${ingredientText}`, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Prüfen ob neue Seite nötig
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Zubereitung
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Zubereitung', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const instructionLines = doc.splitTextToSize(recipe.instructions, maxWidth);
  instructionLines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, margin, yPosition);
    yPosition += 6;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `RecipeHub - Seite ${i} von ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Dateiname erstellen und PDF speichern
  const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  doc.save(fileName);
}
