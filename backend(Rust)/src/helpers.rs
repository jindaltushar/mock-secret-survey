use cosmwasm_std::{Addr, DepsMut, Env, MessageInfo, Response, StdResult, Storage, Uint128};
use crate::state::{AddressViewKey, store_address_view_key, get_view_key,Survey,SurveyResponse};
use crate::rand::Prng;
use sha2::{Digest, Sha256};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub fn get_or_generate_view_key<'a>(deps:DepsMut<'a>, sender: &Addr,seed:String,env: &Env) -> (DepsMut<'a>, String) {
    let mut view_key = get_view_key(deps.storage, sender);
    if view_key.is_none() {
        let view_key = generate_view_key(seed,&env);
        let add_view_key = AddressViewKey {
            address: sender.clone(),
            view_key: view_key.clone(),
        };
        store_address_view_key(deps.storage, &add_view_key);
        (deps,view_key)
    }
    else{
    (deps,view_key.unwrap())
    }
}


pub fn generate_view_key(seed: String, env: &Env) -> String {
    let mut seedvec = seed.as_bytes().to_vec();
    let mut entropy = Vec::default();
    entropy.extend(env.block.chain_id.as_bytes().to_vec());
    entropy.extend(&env.block.height.to_be_bytes());
    entropy = Sha256::digest(&entropy).as_slice().to_vec();
    let mut rng: Prng = Prng::new(&seedvec, &entropy);
    rng.rand_u32().to_string()
}


pub fn update_dict(mut dict: HashMap<String, i32>, key: String) -> HashMap<String, i32> {
    // Check if the key exists in the dictionary
    if let Some(value) = dict.get_mut(&key) {
        // If key exists, increment the value by 1
        *value += 1;
    } else {
        // If key does not exist, add it with value 1
        dict.insert(key, 1);
    }
    dict
}
