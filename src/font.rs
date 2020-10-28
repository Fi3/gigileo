use serde::Deserialize;
use std::path::Path;
use std::process::Command;

static FONT_MUTATOR: &str = "./font-mutator/mutator.py";
static STATIC_DIR: &str = "./static/";
static TEMPLATE_FONT: &str = "./static/fonts/template_font.ttf";

fn make_template_font(font_path: &str, font_weight: i32) {
    let variable_font = format!("{}/{}", STATIC_DIR, font_path);
    if Path::new(&variable_font).exists() {
        Command::new("pyhton3")
            .arg(FONT_MUTATOR)
            .arg(variable_font)
            .arg(format!("wght={}", font_weight))
            .arg("-o")
            .arg(TEMPLATE_FONT)
            .output()
            .expect(&format!(
                "failed to convert variable {} to static with wght={}",
                font_path, font_weight
            ));
    } else {
        todo!()
    }
}

#[derive(Debug, Deserialize)]
pub struct Font {
    font_path: String,
    font_weight: i32,
}

impl Font {
    pub fn execute(&self) {
        make_template_font(&self.font_path, self.font_weight);
    }
}
