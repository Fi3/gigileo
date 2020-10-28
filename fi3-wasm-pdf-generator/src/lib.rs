use printpdf::indices::{PdfLayerIndex, PdfPageIndex};
use printpdf::*;
use std::io::BufWriter;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

pub fn new_doc(
    width: Mm,
    height: Mm,
    title: &str,
) -> (PdfDocumentReference, PdfPageIndex, PdfLayerIndex) {
    let (mut doc, page1, layer1) = PdfDocument::new(title, width, height, "Layer 1");
    doc = doc.with_conformance(PdfConformance::Custom(CustomPdfConformance {
        requires_icc_profile: false,
        requires_xmp_metadata: false,
        ..Default::default()
    }));
    (doc, page1, layer1)
}

pub fn add_font(font: &Vec<u8>, doc: &PdfDocumentReference) -> IndirectFontRef {
    doc.add_external_font(Cursor::new(font))
        .expect("impossible to add fonts")
}

// image must be jpeg
pub fn embed_image(image_file: &Vec<u8>, layer: &PdfLayerReference, ratio: f64) {
    let image =
        Image::try_from(image::jpeg::JpegDecoder::new(&mut Cursor::new(image_file)).unwrap())
            .unwrap();

    // translate x, translate y, rotate, scale x, scale y
    // by default, an image is optimized to 300 DPI (if scale is None)
    // rotations and translations are always in relation to the lower left corner
    image.add_to_layer(
        layer.clone(),
        None,
        None,
        None,
        Some(ratio),
        Some(ratio),
        None,
    );
}

// x y are mesured in mm from the bottom left corner
pub fn add_text(
    text: &str,
    layer: &PdfLayerReference,
    font: &IndirectFontRef,
    font_size: i64,
    x: Mm,
    y: Mm,
) {
    layer.use_text(text, font_size, x, y, &font);
}

// get (width, height) in px return in mm
// max_mm define the sqare that must contain the document
// ratio is ho much tha pixels must be scaled to cover max_mm
pub fn pixels_to_mm(max_mm: f64, pixels: (f64, f64)) -> (Mm, Mm, f64) {
    let (x, y) = pixels;
    let ratio = get_ratio(max_mm, f64::max(x, y), 300 as f64);
    if x > y {
        (Mm(max_mm), Mm(max_mm * (pixels.1 / pixels.0)), ratio)
    } else if x < y {
        (Mm(max_mm * (pixels.0 / pixels.1)), Mm(max_mm), ratio)
    } else {
        (Mm(max_mm), Mm(max_mm), ratio)
    }
}

// return how much pixel must be scaled to equal mm at give resolution
// based on mm = ( pixels * 25.4 ) / DPI
fn get_ratio(mm: f64, pixels: f64, dpi: f64) -> f64 {
    let ratio = mm / ((pixels * 25.4) / dpi);
    ratio
}

#[wasm_bindgen]
pub struct Template {
    image: Vec<u8>,
    image_width_px: f64,
    image_height_px: f64,
    max_side_mm: f64,
    document_name: String,
    font: Vec<u8>,
    font_size_pt: i64,
    name: String,
    surname: String,
    name_x_from_bottom_left_mm: f64,
    name_y_from_bottom_left_mm: f64,
    surname_x_from_bottom_left_mm: f64,
    surname_y_from_bottom_left_mm: f64,
    result: Vec<u8>,
}

#[wasm_bindgen]
impl Template {
    pub fn build(&mut self) {
        let nx = Mm(self.name_x_from_bottom_left_mm);
        let ny = Mm(self.name_y_from_bottom_left_mm);
        let sx = Mm(self.surname_x_from_bottom_left_mm);
        let sy = Mm(self.surname_y_from_bottom_left_mm);

        let pixels = (self.image_width_px, self.image_height_px);

        let (width, height, ratio) = pixels_to_mm(self.max_side_mm, pixels);
        let (doc, page1, layer1) = new_doc(width, height, &self.document_name);

        let font = add_font(&self.font, &doc);
        let layer = doc.get_page(page1).get_layer(layer1);

        embed_image(&self.image, &layer, ratio);

        add_text(&self.name, &layer, &font, self.font_size_pt, nx, ny);
        add_text(&self.surname, &layer, &font, self.font_size_pt, sx, sy);

        let writer = vec![];
        let mut buf_writer = BufWriter::new(writer);
        doc.save(&mut buf_writer).unwrap();
        self.result = buf_writer.into_inner().unwrap();
    }

    pub fn get(self) -> Vec<u8> {
        self.result
    }

    pub fn new(
        image: Vec<u8>,
        image_width_px: f64,
        image_height_px: f64,
        max_side_mm: f64,
        document_name: String,
        font: Vec<u8>,
        font_size_pt: i64,
        name: String,
        surname: String,
        name_x_from_bottom_left_mm: f64,
        name_y_from_bottom_left_mm: f64,
        surname_x_from_bottom_left_mm: f64,
        surname_y_from_bottom_left_mm: f64,
    ) -> Self {
        Template {
            image,
            image_width_px,
            image_height_px,
            max_side_mm,
            document_name,
            font,
            font_size_pt,
            name,
            surname,
            name_x_from_bottom_left_mm,
            name_y_from_bottom_left_mm,
            surname_x_from_bottom_left_mm,
            surname_y_from_bottom_left_mm,
            result: vec![],
        }
    }
}
