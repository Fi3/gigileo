#![feature(decl_macro)]

mod font;
mod login;
mod photo;
mod template;
mod user;

use font::Font;
use login::Login;
use template::Template;
use user::User;

//#[macro_use]
extern crate rocket;

//use rocket::get;
use rocket::routes;
use rocket::{post, State};

use rocket_contrib::serve::StaticFiles;

type ResponseConflict<T, E> = Result<Accepted<T>, Conflict<E>>;
type ResponseUnauthorized<T, E> = Result<Accepted<T>, Unauthorized<E>>;

use rocket::http::{Cookie, Cookies};
use rocket::response::status::{Accepted, Unauthorized};
use rocket_contrib::json::Json;
#[post("/login", format = "json", data = "<login>")]
fn login(
    mut cookies: Cookies<'_>,
    login: Json<Login>,
    secrets: State<login::Secrets>,
) -> ResponseUnauthorized<Json<bool>, ()> {
    match login.validate() {
        Ok(_) => {
            let secret = secrets.add();
            cookies.add_private(Cookie::new("token", secret));
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

#[post("/save-template", format = "json", data = "<template>")]
fn save_template(template: Json<Template>, _user: User) -> ResponseConflict<(), ()> {
    template.save();
    Ok(Accepted::<()>(None))
}

fn main() {
    rocket::ignite()
        .mount(
            "/gigileo",
            routes![login, upload_photo, make_font, save_template],
        )
        .mount("/gigileo", StaticFiles::from("static"))
        .manage(login::Secrets::new())
        .launch();
}
