// Function to collect form data and generate PDF

async function exportFormToPDF() {
  const { jsPDF } = window.jspdf;
  // Collect form data
  const title = $("#title").val();
  const subtitle = $("#subtitle").val();
  const titleImage = $("#title-preview img").attr("src");
  const floorImage = $("#floor-preview img").attr("src");
  const multiImages = [];
  $("#multi-image-container img").each(function () {
    multiImages.push($(this).attr("src"));
  });

  const objData = {
    title,
    subtitle,
    titleImage,
    floorImage,
    multiImages,
    objektart: $("#objektart").val(),
    wohnfläche: $("#wohnfläche").val(),
    zimmer: $("#zimmer").val(),
    etage: $("#etage").val(),
    balkon: $("#balkon").val(),
    baujahr: $("#baujahr").val(),
    einbauküche: $("#einbauküche").val(),
    zustand: $("#zustand").val(),
    badezimmer: $("#badezimmer").val(),
    straße: $("#straße").val(),
    plz: $("#plz").val(),
    ort: $("#ort").val(),
    kaufpreis: $("#kaufpreis").val(),
    courtage: $("#courtage").val(),
    beschreibung: $("#beschreibung").val(),
    additionalParagraphs: $("#objektbeschreibung").val(), // <-- Add this line
  };

  const doc = new jsPDF();
  console.log("PDF document created");
  

  // Function to handle page breaks if content exceeds page size
  function addPageIfNeeded(yPosition) {
    const marginBottom = 20;
    if (yPosition > doc.internal.pageSize.height - marginBottom) {
      doc.addPage();
      yPosition = 20;
    }
    return yPosition;
  }

  // Function to add header and footer to each page
  function addHeaderFooter() {
    console.log("Adding header/footer with logo");

    // Save current text color and font settings
    const currentFont = doc.internal.getFont();
    const currentFontSize = doc.internal.getFontSize();

    // Header - Logo (center aligned and reduced width)
    try {
      // Use the logo image directly without base64 conversion
      
      doc.addImage(
        window.logoBase64,
        "PNG",
        (doc.internal.pageSize.width - 40) / 2, // Centered horizontally
        10,
        40, // Reduced width
        40
      );
      console.log("Logo added to page");
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
      // Fallback: try with a different path or add text instead
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(230, 219, 205);
      doc.text("DMC Immobilien GmbH", 20, 20);
    }

    // Footer - Text (center aligned with gray color)
    const footerText = `DMC Immobilien GmbH\nAm Bronzehügel 101, 22399 Hamburg\nwww.dmc-realestate.de / info@dmc-realestate.de`;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(149, 149, 149); // Color: #959595

    const pageWidth = doc.internal.pageSize.width;
    const footerLines = footerText.split("\n");
    let footerY = doc.internal.pageSize.height - 25;

    footerLines.forEach((line) => {
      const textWidth = doc.getTextWidth(line);
      const x = (pageWidth - textWidth) / 2; // Center align
      doc.text(line, x, footerY);
      footerY += 4;
    });

    // Restore previous text color and font settings
    doc.setFont(currentFont.fontName, currentFont.fontStyle);
    doc.setFontSize(currentFontSize);
    doc.setTextColor(230, 219, 205); // Restore main content color
  }

  // First Page: Title, Subtitle, Title Image
  addHeaderFooter();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24); // Increased font size for title
  doc.setTextColor(230, 219, 205); // Color: #e6dbcd

  // Center align the main heading
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 55;

  // --------------------
  if (objData.title) {
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(230, 219, 205); // Color: #e6dbcd
    yPosition = addPageIfNeeded(yPosition);

    const maxTitleWidth = pageWidth * 0.5; // Max 50% of page width

    // Split the title into lines that fit within maxTitleWidth
    const titleLines = doc.splitTextToSize(objData.title, maxTitleWidth);

    // Render each line with reduced spacing
    const lineSpacing = 10; // Reduced line height
    titleLines.forEach((line) => {
      yPosition = addPageIfNeeded(yPosition);
      const lineWidth = doc.getTextWidth(line);
      doc.text(line, (pageWidth - lineWidth) / 2, yPosition);
      yPosition += lineSpacing;
    });
  }

  // Center align subtitle (without "Untertitel:" prefix)
  if (objData.subtitle) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(149, 149, 149); // Color: #959595
    yPosition = addPageIfNeeded(yPosition);
    const subtitleWidth = doc.getTextWidth(objData.subtitle);
    doc.text(objData.subtitle, (pageWidth - subtitleWidth) / 2, yPosition);
    yPosition += 15;
  }

  if (titleImage) {
    yPosition = addPageIfNeeded(yPosition);
    try {
      const imageWidth = pageWidth; // Full width
      const imageHeight = (imageWidth / 16) * 9; // Adjust based on image aspect ratio

      doc.addImage(
        titleImage,
        "JPEG",
        0,
        yPosition + 40,
        imageWidth,
        imageHeight
      );
      yPosition += imageHeight + 20; // Add spacing after image
    } catch (error) {
      console.error("Error adding title image:", error);
    }
  }

  doc.addPage(); // Move to the next page for Property Details

  // Second Page: Property Details (Table)
  addHeaderFooter(); // Add header/footer to second page
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(230, 219, 205); // Color: #e6dbcd
  doc.text("Eckdaten", 20, 55);

  const tableData = [
    ["Objektart", objData.objektart],
    ["Straße", objData.straße],
    ["PLZ", objData.plz],
    ["Ort", objData.ort],
    ["Wohnfläche gesamt", objData.wohnfläche],
    ["Zimmer", objData.zimmer],
    ["Badezimmer", objData.badezimmer],
    ["Etage", objData.etage],
    ["Einbauküche", objData.einbauküche],
    ["Balkon", objData.balkon],
    ["Baujahr", objData.baujahr],
    ["Zustand", objData.zustand],
    ["Kaufpreis", objData.kaufpreis],
    ["Makler Courtage Käufer", objData.courtage],
  ];

  let tableY = 70;
  const rowHeight = 9;
  const labelWidth = 80;
  const tableWidth = 150;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Color: #e6dbcd

  tableData.forEach(([label, value], index) => {
    // Draw label (left column)
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, tableY);

    // Draw value (right column)
    doc.setFont("helvetica", "bold");
    doc.text(value || "", 15 + labelWidth, tableY);

    // Draw bottom border line for the row
    doc.setDrawColor(230, 219, 205);
    doc.setLineWidth(0.1);
    doc.line(20, tableY + 1, 20 + tableWidth, tableY + 1);

    tableY += rowHeight;
  });

  doc.addPage(); // Move to the next page for Description

  // Third Page: Objekt Beschreibung
  addHeaderFooter(); // Add header/footer to third page

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(230, 219, 205); // Header color: #e6dbcd
  doc.text("Objekt Beschreibung", 20, 60); // ⬅️ Move heading higher if needed

  // Description (light text)
  const description = objData.beschreibung || "";
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(230, 219, 205);

  const splitText = doc.splitTextToSize(description, 170);
  let y = 60; // ⬅️ Start closer to heading
  splitText.forEach((line) => {
    y = addPageIfNeeded(y);
    doc.text(line, 20, y);
    y += 6; // ⬅️ Reduce line spacing between description lines
  });

  // Additional paragraph (black, larger)
  // Use the value from the form instead of the hardcoded string
  const additionalParagraphs = objData.additionalParagraphs || "";

  doc.setFontSize(10); // or 12 if you want slightly larger
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Black text

  const paragraphText = doc.splitTextToSize(additionalParagraphs.trim(), 170);

  // Slightly reduce the gap before starting the new paragraphs
  y += 5; // instead of +10 or more

  paragraphText.forEach((line) => {
    y = addPageIfNeeded(y);
    doc.text(line, 20, y);
    y += 5; // maintain compact line spacing
  });

  doc.addPage(); // Move to the next page for Grundrissbild

  // Fourth Page: Grundrissbild
  addHeaderFooter();
  if (floorImage) {
  try {
    const img = new Image();
    img.src = floorImage;

    // Wait for the image to load before drawing it
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imageWidth = pageWidth * 0.7;
    const xMargin = (pageWidth - imageWidth) / 2;

    // Maintain aspect ratio
    const aspectRatio = imgHeight / imgWidth;
    const imageHeight = imageWidth * aspectRatio;

    const imageY = 50;

    doc.addImage(
      floorImage,
      "JPEG",
      xMargin,
      imageY,
      imageWidth,
      imageHeight
    );
  } catch (error) {
    console.error("Error adding floor plan image:", error);
  }
}

  // Weitere Bilder
  // Weitere Bilder
  if (objData.multiImages.length > 0) {
    doc.addPage();
    addHeaderFooter();

    const imageWidth = pageWidth * 0.8;
    const xMargin = pageWidth * 0.1;
    const imageHeight = 90; // Reduced fixed height to prevent footer overlap

    let currentY = 55;
    let imagesOnPage = 0;

    objData.multiImages.forEach((image, index) => {
      if (imagesOnPage === 2) {
        doc.addPage();
        addHeaderFooter();
        currentY = 55;
        imagesOnPage = 0;
      }

      try {
        doc.addImage(image, "JPEG", xMargin, currentY, imageWidth, imageHeight);
      } catch (error) {
        console.error("Error adding gallery image:", error);
      }

      currentY += imageHeight + 15; // Space between stacked images
      imagesOnPage++;
    });
  }

  // last page: Contact Information
  // Add a new page after the floor plan page
  doc.addPage();
  addHeaderFooter();

  // Page Dimensions
  const pageHeight = doc.internal.pageSize.getHeight();
  const yOffset = 30; // Adjust this value to move the content further down

  // === Header Section ===

  // Heading: Two lines
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");

  const headingYStart = 30 + yOffset; // Shifted down
  const headingLineHeight = 10;

  doc.text("Ihr persönlicher", 20, headingYStart);
  doc.text("Ansprechpartner", 20, headingYStart + headingLineHeight);

  // Image beside text (e.g., profile picture)
  const profileImageX = pageWidth - 80;
  const profileImageY = 25 + yOffset; // Shifted down
  const profileImageWidth = 60;
  const profileImageHeight = 60;

  doc.addImage(
    window.ceobase64,
    "PNG",
    profileImageX,
    profileImageY,
    profileImageWidth,
    profileImageHeight
  );

  // Contact Info

  // === Contact Info ===
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(149, 149, 149); // Set text color to #959595

  const infoYStart = 55 + yOffset;
  const lineHeight = 6; // Reduced line height

  doc.text("Sidney Lazar Grass", 20, infoYStart);
  doc.text("s.g@dmc-realestate.de", 20, infoYStart + lineHeight);
  doc.text("+49 40 22 63 19 622", 20, infoYStart + lineHeight * 2);

  // === Divider Line ===
  const extraOffset = 15; // Additional downward shift

  // === Divider Line ===
  const dividerY = infoYStart + lineHeight * 3 + 5 + extraOffset;
  doc.setLineWidth(0.2); // Reduced thickness
  doc.line(20, dividerY, pageWidth - 20, dividerY);

  // === Bottom Image ===
  const bottomImageY = dividerY + 15; // Add spacing below line
  const bottomImageHeight = 100; // adjust as needed
  const bottomImageWidth = pageWidth * 0.8;
  const bottomImageX = (pageWidth - bottomImageWidth) / 2;

  doc.addImage(
    window.footerimagebase64, 
    "JPEG",
    bottomImageX,
    bottomImageY,
    bottomImageWidth,
    bottomImageHeight
  );

  // Save PDF
  doc.save("Immobilien_Expose.pdf");
}
