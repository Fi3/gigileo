use crate::login::SECRET;
use rocket::Outcome::{Forward, Success};

pub struct User {}

use rocket::request::{self, FromRequest, Request};
impl<'a, 'r> FromRequest<'a, 'r> for User {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<User, ()> {
        let authorized = request
            .cookies()
            .get_private("token")
            .and_then(|cookie| cookie.value().parse::<String>().ok())
            .map(|token| token == SECRET);
        match authorized {
            Some(x) => match x {
                true => Success(User {}),
                false => Forward(()),
            },
            None => Forward(()),
        }
    }
}
