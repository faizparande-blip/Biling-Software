/**
 * Ultra-Reliable Printing Utility for M.A.B TRADERS Mandi Billing System.
 *
 * Capabilities:
 * 1. Concurrency guard: prevents accidental duplicate print triggers.
 * 2. Dynamic Continuous Paper Sizing: Measures exact receipt height in millimeters
 *    and injects an exact @page rule (size: 203mm <height>mm) so Chromium print preview
 *    never defaults to A4 with excessive blank space below the receipt.
 * 3. Configurable Margins: Top, Right, Bottom, Left margins applied dynamically.
 * 4. Bounded font loading: max 800ms timeout for Devanagari web fonts.
 * 5. Bounded image loading: max 500ms timeout for SVGs/images.
 * 6. Guaranteed cleanup: resets styles and removes injected rules after printing.
 */

let isPrintingLock = false;

export const triggerReliablePrint = async ({
  paperSize = 'standard',
  customWidthMm = 203,
  marginTopMm = 2,
  marginBottomMm = 2,
  marginLeftMm = 2,
  marginRightMm = 2,
  showGraphics = true,
} = {}) => {
  if (isPrintingLock) {
    console.warn('[PrintHelper] Print already in progress, ignoring duplicate call.');
    return false;
  }

  isPrintingLock = true;
  let dynamicStyleTag = null;

  try {
    // 1. Validate that receipt element exists in DOM
    const receiptEl = document.getElementById('mab-mandi-receipt');
    if (!receiptEl) {
      console.error('[PrintHelper] Receipt element #mab-mandi-receipt not found in DOM.');
      throw new Error('Receipt element not found. Please try again.');
    }

    // 2. Wait for Marathi fonts with a bounded timeout (max 800ms)
    if (document.fonts && document.fonts.ready) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);
      } catch (fontErr) {
        console.warn('[PrintHelper] Font loading timeout, proceeding:', fontErr);
      }
    }

    // 3. Wait for any produce images with a bounded timeout (max 500ms)
    const images = Array.from(receiptEl.querySelectorAll('img'));
    if (images.length > 0) {
      const pendingImages = images.filter((img) => !img.complete);
      if (pendingImages.length > 0) {
        await Promise.race([
          Promise.all(
            pendingImages.map(
              (img) =>
                new Promise((res) => {
                  img.addEventListener('load', res, { once: true });
                  img.addEventListener('error', res, { once: true });
                })
            )
          ),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
      }
    }

    // 4. Determine target paper width in millimeters
    const targetWidthMm =
      paperSize === 'thermal'
        ? 76
        : paperSize === 'custom'
        ? (Number(customWidthMm) || 203)
        : 203;

    // 5. Measure exact receipt dimensions and calculate dynamic height in millimeters
    const rect = receiptEl.getBoundingClientRect();
    const pxPerMm = rect.width > 0 ? rect.width / targetWidthMm : 3.78;
    // Add 2mm safety padding to prevent accidental multi-page overflow
    const calculatedHeightMm = Math.ceil(rect.height / pxPerMm) + 3;

    // 6. Inject dynamic @page rule for continuous tractor-feed paper (prevents A4 blank space)
    const existingTag = document.getElementById('mab-dynamic-page-size');
    if (existingTag) {
      existingTag.remove();
    }

    dynamicStyleTag = document.createElement('style');
    dynamicStyleTag.id = 'mab-dynamic-page-size';
    dynamicStyleTag.innerHTML = `
      @page {
        size: ${targetWidthMm}mm ${calculatedHeightMm}mm !important;
        margin: ${marginTopMm}mm ${marginRightMm}mm ${marginBottomMm}mm ${marginLeftMm}mm !important;
      }
    `;
    document.head.appendChild(dynamicStyleTag);

    // 7. Apply print profile classes to document.body
    document.body.classList.remove('print-mode-standard', 'print-mode-thermal', 'print-mode-custom');
    document.body.classList.add('is-printing');

    if (paperSize === 'thermal') {
      document.body.classList.add('print-mode-thermal');
    } else if (paperSize === 'custom') {
      document.body.classList.add('print-mode-custom');
      document.documentElement.style.setProperty('--print-custom-width', `${targetWidthMm}mm`);
    } else {
      document.body.classList.add('print-mode-standard');
    }

    // 8. Double animation frame: force browser layout engine to paint DOM & CSS before print dialog
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 9. Trigger the native browser print dialog
    window.print();
    return true;
  } catch (err) {
    console.error('[PrintHelper] Print error:', err);
    throw err;
  } finally {
    // 10. Reliable cleanup of print classes and lock release
    const cleanup = () => {
      document.body.classList.remove('is-printing', 'print-mode-standard', 'print-mode-thermal', 'print-mode-custom');
      document.documentElement.style.removeProperty('--print-custom-width');
      if (dynamicStyleTag && dynamicStyleTag.parentNode) {
        dynamicStyleTag.remove();
      }
      isPrintingLock = false;
    };

    window.addEventListener('afterprint', cleanup, { once: true });
    setTimeout(cleanup, 1200);
  }
};
