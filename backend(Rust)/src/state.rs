use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Storage,StdResult,StdError};
use cosmwasm_storage::{singleton, singleton_read, ReadonlySingleton, Singleton};
use std::collections::{HashMap, HashSet};

// Define the key for the list of surveys
pub static SURVEYS_KEY: &[u8] = b"surveys";

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct Survey {
    pub survey_id: i32,
    pub survey_title: String,
    pub question1: String,
    pub question2: String,
    pub quest1options: [String; 4],
    pub quest2options: [String; 4],
    pub survey_owner: Addr,
}

pub fn store_survey(storage: &mut dyn Storage, survey: &Survey) {
    let mut surveys: Singleton<Vec<Survey>> = singleton(storage, SURVEYS_KEY);
    let mut surveys_list = surveys.load().unwrap_or_default();
    surveys_list.push(survey.clone());
    surveys.save(&surveys_list).unwrap();
}


pub fn read_all_surveys(storage: &dyn Storage) -> Vec<Survey> {
    let surveys: ReadonlySingleton<Vec<Survey>> = singleton_read(storage, SURVEYS_KEY);
    surveys.load().unwrap_or_default()
}

pub fn get_max_survey_id(storage: &dyn Storage) -> Option<i32> {
    let surveys = read_all_surveys(storage);
    let max_id = surveys.iter().map(|survey| survey.survey_id).max();
    max_id
}

pub fn get_survey_by_id(storage: &dyn Storage, survey_id: i32) -> Survey {
    let surveys = read_all_surveys(storage);
    let survey = surveys.into_iter().find(|survey| survey.survey_id == survey_id).unwrap();
    survey
}

pub fn get_survey_owner_address(storage: &dyn Storage, survey_id: i32) -> Addr {
    let surveys = read_all_surveys(storage);
    let survey = surveys.into_iter().find(|survey| survey.survey_id == survey_id).unwrap();
    survey.survey_owner
}

// Define the key for the list of responses
pub static RESPONSES_KEY: &[u8] = b"responses";

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct SurveyResponse {
    pub response_id: i32,
    pub survey_id: i32,
    pub answer1: String,
    pub answer2: String,
    pub response_type : String,
    pub response_owner: Addr,
}

pub fn store_response(storage: &mut dyn Storage, response: &SurveyResponse) {
    let mut responses: Singleton<Vec<SurveyResponse>> = singleton(storage, RESPONSES_KEY);
    let mut responses_list = responses.load().unwrap_or_default();
    responses_list.push(response.clone());
    responses.save(&responses_list).unwrap();
}

pub fn read_all_responses(storage: &dyn Storage) -> Vec<SurveyResponse> {
    let responses: ReadonlySingleton<Vec<SurveyResponse>> = singleton_read(storage, RESPONSES_KEY);
    responses.load().unwrap_or_default()
}

pub fn get_max_response_id(storage: &dyn Storage) -> Option<i32> {
    let responses = read_all_responses(storage);
    let max_id = responses.iter().map(|response| response.response_id).max();
    max_id
}

pub fn get_response_by_id(storage: &dyn Storage, response_id: i32) -> SurveyResponse {
    let responses = read_all_responses(storage);
    let response = responses.into_iter().find(|response| response.response_id == response_id);
    response.unwrap()
}

pub fn get_responses_by_survey_id(storage: &dyn Storage, survey_id: i32) -> Vec<SurveyResponse> {
    let responses = read_all_responses(storage);
    let matching_responses = responses
        .into_iter()
        .filter(|response| response.survey_id == survey_id)
        .collect();
    matching_responses
}


pub static VIEW_KEY_MAP_KEY: &[u8] = b"view_key_map";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AddressViewKey {
    pub address: Addr,
    pub view_key: String,
}

pub fn store_address_view_key(storage: &mut dyn Storage, address_view_key: &AddressViewKey) {
    let mut view_key_map: Singleton<Vec<AddressViewKey>> = singleton(storage, VIEW_KEY_MAP_KEY);
    let mut view_key_list = view_key_map.load().unwrap_or_default();
    
    if let Some(existing_entry) = view_key_list.iter_mut().find(|entry| entry.address == address_view_key.address) {
        existing_entry.view_key = address_view_key.view_key.clone();
    } else {
        view_key_list.push(address_view_key.clone());
    }

    view_key_map.save(&view_key_list).unwrap();
}


pub fn get_view_key(storage: &dyn Storage, address: &Addr) -> Option<String> {
    let view_key_map: ReadonlySingleton<Vec<AddressViewKey>> = singleton_read(storage, VIEW_KEY_MAP_KEY);
    let view_key_list = view_key_map.load().unwrap_or_default(); // Load or default to an empty list
    
    if let Some(entry) = view_key_list.iter().find(|entry| entry.address == *address) {
        Some(entry.view_key.clone())
    } else {
        None
    }
}
pub fn get_address_by_view_key(storage: &dyn Storage, view_key: String) -> Option<Addr> {
    let view_key_map: ReadonlySingleton<Vec<AddressViewKey>> = singleton_read(storage, VIEW_KEY_MAP_KEY);
    if let Some(entry) = view_key_map.load().unwrap().iter().find(|entry| entry.view_key == view_key) {
        Some(entry.address.clone())
    } else {
        None
    }
}


pub static ACCESS_KEY: &[u8] = b"access_key";

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct AccessData {
    pub response_id: i32,
    pub access_type: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct SurveyInfo {
    pub survey_id: i32,
    pub access_data: Vec<AccessData>, // Change this to a Vec<AccessData>
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct AddressInfo {
    pub addr: Addr,
    pub surveys: Vec<SurveyInfo>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct State {
    pub addresses: Vec<AddressInfo>,
}

pub fn new_state() -> State {
    State { addresses: Vec::new() }
}

pub fn add_access(storage: &mut dyn Storage, addr: Addr, survey_id: i32, response_id: i32, access_type: String) {
    let mut state = load_state(storage);

    let access_data = AccessData {
        response_id,
        access_type,
    };

    let survey_index = state.addresses.iter_mut().position(|a| a.addr == addr);

    if let Some(index) = survey_index {
        let survey = state.addresses[index]
            .surveys
            .iter_mut()
            .find(|s| s.survey_id == survey_id)
            .map(|survey| survey as &mut SurveyInfo);

        if let Some(survey) = survey {
            survey.access_data.push(access_data); // Push new access data to the existing survey
        } else {
            // Survey doesn't exist, create a new one and add it to the surveys list
            let new_survey = SurveyInfo {
                survey_id,
                access_data: vec![access_data], // Create a new Vec with a single access data
            };

            state.addresses[index].surveys.push(new_survey); // Add the new survey to the surveys list
        }
    } else {
        let survey = SurveyInfo {
            survey_id,
            access_data: vec![access_data], // Create a new Vec with a single access data
        };

        let address = AddressInfo {
            addr: addr.clone(),
            surveys: vec![survey],
        };

        state.addresses.push(address);
    }

        store_state(storage, &state);
}


pub fn get_all_survey_access(storage: &dyn Storage, addr: &Addr) -> Option<Vec<SurveyInfo>> {
    let state = load_state(storage);
    if let Some(address) = state.addresses.iter().find(|a| a.addr == *addr) {
        Some(address.surveys.clone())
    } else {
        None
    }
}

pub fn get_all_response_access(storage: &dyn Storage, addr: &Addr, survey_id: i32) -> Option<Vec<AccessData>> {
    let state = load_state(storage);
    if let Some(address) = state.addresses.iter().find(|a| a.addr == *addr) {
        if let Some(survey) = address.surveys.iter().find(|s| s.survey_id == survey_id) {
            Some(survey.access_data.clone())
        } else {
            None
        }
    } else {
        None
    }
}

pub fn get_access_type(storage: &dyn Storage, addr: &Addr, survey_id: i32, response_id: i32) -> Option<String> {
    let state = load_state(storage);

    if let Some(address) = state.addresses.iter().find(|a| a.addr == *addr) {
        if let Some(survey) = address.surveys.iter().find(|s| s.survey_id == survey_id) {
            if let Some(access) = survey.access_data.iter().find(|a| a.response_id == response_id) {
                Some(access.access_type.clone())
            } else {
                None
            }
        } else {
            None
        }
    } else {
        None
    }
}
pub fn store_state(storage: &mut dyn Storage, state: &State) {
    let mut state_store: Singleton<State> = singleton(storage, ACCESS_KEY);
    state_store.save(state).unwrap();
}

pub fn load_state(storage: &dyn Storage) -> State {
    let state_store: ReadonlySingleton<State> = singleton_read(storage, ACCESS_KEY);
    state_store.load().unwrap()
}


#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct AnswerReport {
    pub answers: Vec<(String, i32)>,
}

impl AnswerReport {
    pub fn new() -> Self {
        AnswerReport {
            answers: Vec::new(),
        }
    }

    pub fn update(&mut self, key: String) {
        if let Some(entry) = self.answers.iter_mut().find(|(k, _)| k == &key) {
            entry.1 += 1;
        } else {
            self.answers.push((key, 1));
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct ResearcherSurveySummary {
    pub survey : Survey,
    pub responses: Vec<SurveyResponse>,
    pub question1_answers:AnswerReport,
    pub question2_answers: AnswerReport,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct QuesAndOptions {
    pub question : String,
    pub options: [String; 4],
}


pub static MESSAGES_KEY: &[u8] = b"messages";

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct AddressMessages {
    pub addr: Addr,
    pub messages: Vec<String>,
}

pub fn add_message(storage: &mut dyn Storage, addr: Addr, message_content: String) {
    let mut messages = load_messages(storage);

    if let Some(address) = messages.iter_mut().find(|a| a.addr == addr) {
        address.messages.push(message_content);
    } else {
        let address = AddressMessages {
            addr: addr.clone(),
            messages: vec![message_content],
        };

        messages.push(address);
    }

    store_messages(storage, &messages);
}

pub fn get_messages(storage: &dyn Storage, addr: &Addr) -> Option<Vec<String>> {
    let messages = load_messages(storage);
    if let Some(address) = messages.iter().find(|a| a.addr == *addr) {
        Some(address.messages.clone())  // Clone the messages vector before returning
    } else {
        None
    }
}


pub fn store_messages(storage: &mut dyn Storage, messages: &Vec<AddressMessages>) {
    let mut messages_store: Singleton<Vec<AddressMessages>> = singleton(storage, MESSAGES_KEY);
    messages_store.save(messages).unwrap();
}


pub fn load_messages(storage: &dyn Storage) -> Vec<AddressMessages> {
    let messages_store: ReadonlySingleton<Vec<AddressMessages>> = singleton_read(storage, MESSAGES_KEY);
    messages_store.load().unwrap_or_default()
}
