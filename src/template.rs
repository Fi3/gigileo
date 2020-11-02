use serde::{Deserialize, Serialize};
use serde_json;
use std::fs::{remove_file, File};

const TEMPLATE_PATH: &str = "./static/template.json";

#[derive(Deserialize, Serialize)]
pub struct Template {
    font: String,
    image_width_px: f64,
    image_height_px: f64,
    image_width_browser: f64,
    image_height_browser: f64,
    max_side_mm: f64,
    document_name: String,
    font_size_pt: i64,
    name_x_from_bottom_left_browser: f64,
    name_y_from_bottom_left_browser: f64,
    surname_x_from_bottom_left_browser: f64,
    surname_y_from_bottom_left_browser: f64,
}

impl Template {
    pub fn save(&self) {
        remove_file(TEMPLATE_PATH);
        serde_json::to_writer(&File::create(TEMPLATE_PATH).unwrap(), &self);
    }
}
