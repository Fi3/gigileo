#![feature(decl_macro)]

mod font;
mod login;
mod photo;
mod user;

use font::Font;
use login::Login;
use user::User;

//#[macro_use]
extern crate rocket;

//use rocket::get;
use rocket::post;
use rocket::routes;

use rocket_contrib::serve::StaticFiles;

type ResponseConflict<T, E> = Result<Accepted<T>, Conflict<E>>;
type ResponseUnauthorized<T, E> = Result<Accepted<T>, Unauthorized<E>>;

use rocket::http::{Cookie, Cookies};
use rocket::response::status::{Accepted, Unauthorized};
use rocket_contrib::json::Json;
#[post("/login", format = "json", data = "<login>")]
fn login(mut cookies: Cookies<'_>, login: Json<Login>) -> ResponseUnauthorized<Json<bool>, ()> {
    match login.validate() {
        Ok(_) => {
            cookies.add_private(Cookie::new("token", crate::login::SECRET));
            Ok(Accepted(Some(Json(true))))
        }
        Err(_) => Err(Unauthorized::<()>(None)),
    }
}

use rocket::response::status::Conflict;
use rocket::Data;
#[post("/upload-photo", format = "plain", data = "<data>")]
fn upload_photo(data: Data, _user: User) -> ResponseConflict<String, ()> {
    let test = photo::verify_and_remove_exif(&mut data.open());
    match test {
        Ok(pixels) => {
            let filename = photo::save_photo(&pixels);
            Ok(Accepted(Some(filename)))
        }
        Err(()) => Err(Conflict::<()>(None)),
    }
}

#[post("/make-font", format = "json", data = "<font>")]
fn make_font(font: Json<Font>, _user: User) -> ResponseConflict<(), ()> {
    font.execute();
    Ok(Accepted::<()>(None))
}

//#[get("/pkg/pdf_bg.wasm")]
//fn get_pdf_generator() -> rocket::Response<'static> {
//    let pdf_generator = std::fs::read("./static/pkg/pdf_bg.wasm").unwrap();
//    rocket::Response::build()
//        .raw_header("Content-Type", "application/x-cazzi")
//        .sized_body(std::io::Cursor::new(pdf_generator))
//        .finalize()
//}

fn main() {
    rocket::ignite()
        .mount("/", routes![login, upload_photo, make_font])
        .mount("/", StaticFiles::from("static"))
        .launch();
}
