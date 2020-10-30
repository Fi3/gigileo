use rand::Rng;
use serde::Deserialize;
use std::env;
use std::sync::{Arc, Mutex};

fn generate_secret() -> String {
    let mut rng = rand::thread_rng();
    let secret = rng.gen::<i64>();
    format!("{}", secret)
}

pub struct Secrets {
    pub cache: Arc<Mutex<Vec<String>>>,
}

impl Secrets {
    pub fn new() -> Self {
        Secrets {
            cache: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn add(&self) -> String {
        let secret = generate_secret();
        let mut inner = self.cache.lock().unwrap();
        if (*inner).len() > 10 {
            *inner = (inner[1..]).to_vec();
        };
        (*inner).push(secret.clone());
        secret
    }

    pub fn contains(&self, secret: &String) -> bool {
        let inner = self.cache.lock().unwrap();
        (*inner).contains(secret)
    }
}

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
