use std::collections::hash_map::DefaultHasher;
use std::fs::File;
use std::hash::{Hash, Hasher};
use std::io::{Read, Write};

const PHOTO_PATH: &str = "./static/photo-archive";

pub fn verify_and_remove_exif(pixels: &mut dyn Read) -> Result<Vec<u8>, ()> {
    let mut bytes = vec![];
    pixels.read_to_end(&mut bytes).unwrap();
    let img = image::load_from_memory(&bytes).expect("error during image decoding");
    let mut out: Vec<u8> = vec![];
    img.write_to(&mut out, image::ImageFormat::Jpeg)
        .expect("error during image encoding");
    Ok(out)
}

pub fn save_photo(pixels: &Vec<u8>) -> String {
    std::fs::create_dir_all(format!("{}", PHOTO_PATH)).unwrap();
    let filename = calculate_hash(pixels);
    let mut file =
        File::create(format!("{}/{}.jpeg", PHOTO_PATH, filename)).expect("error in creating file");
    file.write_all(pixels).expect("error in writing photo");
    filename.to_string()
}

fn calculate_hash<T: Hash>(t: &T) -> i64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    let bytes = s.finish().to_le_bytes();
    i64::from_le_bytes(bytes)
}
