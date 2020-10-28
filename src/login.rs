use serde::Deserialize;
use std::env;

pub const SECRET: &str = "SECRET";

#[derive(Debug, Deserialize)]
pub struct Login {
    password: String,
}
impl Login {
    pub fn validate(&self) -> Result<(), ()> {
        let password = env::vars().filter(|x| x.0 == "ADMIN_PASSWORD").next();
        let password_ = match password {
            Some(x) => x.1,
            None => {
                println!("PASSOWRD NOT SET USING DEFAULT PASSWORD");
                "PASSWORD".to_string()
            }
        };
        if self.password == password_ {
            Ok(())
        } else {
            Err(())
        }
    }
}
