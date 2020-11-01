use fi3_wasm_pdf_generator::{add_font, add_text, embed_image, new_doc, pixels_to_mm};
use printpdf::*;
use std::fs::File;
use std::io::BufWriter;

const WIDTH: f64 = 1754 as f64;
const HEIGHT: f64 = 1217 as f64;

// load an image
// create a pdf document
// emebed the image in the document
// write name and surname
// save the document
fn main() {
    let image = std::fs::read("./examples/test.jpeg").expect("no file found");

    let (width, height, ratio) = pixels_to_mm(200 as f64, (WIDTH, HEIGHT));

    let (doc, page1, layer1) = new_doc(width, height, "EXAMPLE");

    let font = std::fs::read("./examples/examplefont.ttf").expect("no file found");
    let font = add_font(&font, &doc);

    let layer = doc.get_page(page1).get_layer(layer1);

    embed_image(&image, &layer, ratio);

    add_text("Ciao!", &layer, &font, 48, Mm(15 as f64), Mm(5 as f64));

    doc.save(&mut BufWriter::new(File::create("example.pdf").unwrap()))
        .unwrap();
}
