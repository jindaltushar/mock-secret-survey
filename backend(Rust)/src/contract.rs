use cosmwasm_std::{entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,Addr,Storage};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Survey,store_survey,read_all_surveys,get_max_survey_id,get_survey_by_id,get_survey_owner_address,
    SurveyResponse,store_response,get_response_by_id,get_responses_by_survey_id,get_max_response_id,read_all_responses,get_all_response_access,
    AddressViewKey,store_address_view_key,get_view_key,get_address_by_view_key,
    AccessData,State,new_state,store_state,load_state,add_access,AnswerReport,ResearcherSurveySummary,
    QuesAndOptions,AddressMessages,add_message,get_messages};
use crate::helpers::{get_or_generate_view_key,generate_view_key};
use std::collections::HashMap;

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError>{
    let seed = "khsalkhskd".to_string();
    let key  = generate_view_key(seed,&env);
    // make an empty address key map
    let add_view_key = AddressViewKey{
        address: info.sender.clone(),
        view_key: key,
    };
    store_address_view_key(deps.storage, &add_view_key);
    let initial_state = new_state();
    store_state(deps.storage, &initial_state);
    Ok(Response::default())
}

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreateSurvey {survey_title,question1,question2,quest1options,quest2options,seed} => try_create_survey(deps, env, info,survey_title,question1,question2,quest1options,quest2options,seed),
        ExecuteMsg::SubmitSurveyResponse {survey_id,answer1,answer2,response_type,seed} => try_submit_survey_response(deps, env, info,survey_id,answer1,answer2,response_type,seed),
        ExecuteMsg::GetMyViewKey {seed} => return_view_key(deps, env, info,seed),
        ExecuteMsg::RequestParticipation {question,answer} => try_request_participation(deps, env, info,question,answer),
    }
}


pub fn return_view_key (
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    seed: String,
) -> StdResult<Response> {
    let (deps,view_key) = get_or_generate_view_key(deps,&info.sender,seed, &env);
    // store_address_view_key(deps.storage, &add_view_key);
    let res = Response::new()
            .add_attribute("your_view_key", view_key);
    Ok(res)
}


pub fn try_create_survey(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    survey_title: String,
    question1: String,
    question2: String,
    quest1options: [String; 4],
    quest2options: [String; 4],
    seed: String,
) -> StdResult<Response>  {
    let sender_address = info.sender.clone();
     // Get the maximum survey ID and increment it
        let max_survey_id = get_max_survey_id(deps.storage);
        let survey_id = match max_survey_id {
            Some(max_id) => max_id + 1,
            None => 1, // If there are no surveys, start with ID 1
        };
        let mut survey = Survey {
            survey_id: survey_id,
            survey_title: survey_title,
            question1: question1,
            question2: question2,
            quest1options: quest1options,
            quest2options: quest2options,
            survey_owner: info.sender.clone(),
        };
        store_survey(deps.storage,&survey);
        // check if view_key already exists
        let (deps,view_key) = get_or_generate_view_key(deps,&info.sender,seed, &env);
        let mut res = Response::default().add_attribute("survey_id", survey_id.to_string());
        res = res.add_attribute("your_view_key", view_key);
        Ok(res)
}

pub fn try_submit_survey_response(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    survey_id: i32,
    answer1: String,
    answer2: String,
    response_type: String,
    seed: String,
) -> StdResult<Response>  {
    let sender_address = info.sender.clone();
    // GET max response ID and increment it
    let max_response_id = get_max_response_id(deps.storage);
    let response_id = match max_response_id {
        Some(max_id) => max_id + 1,
        None => 1, // If there are no responses, start with ID 1
    };
    // create a surveyresponse object
    let mut surveyresponse = SurveyResponse {
        response_id: response_id,
        survey_id: survey_id,
        answer1: answer1,
        answer2: answer2,
        response_type: response_type.clone(),
        response_owner: info.sender.clone(),
    };
    // store the surveyresponse object
    store_response(deps.storage,&surveyresponse);
    // generate a view key
    let (deps,view_key) = get_or_generate_view_key(deps,&info.sender,seed, &env);

    let mut res = Response::default().add_attribute("response_id", response_id.to_string());
    res = res.add_attribute("your_view_key", view_key);

    let survey_owner = get_survey_owner_address(deps.storage, survey_id);
    add_access(deps.storage,info.sender.clone(), survey_id, response_id, "full".to_string());
    if survey_owner != info.sender {
        add_access(deps.storage,survey_owner.clone(), survey_id, response_id, response_type.clone());
    }
    Ok(res)
}

pub fn try_request_participation(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    question: String,
    answer: String,
) -> StdResult<Response> {
    let surveys = read_all_surveys(deps.storage);
    let responses = read_all_responses(deps.storage);

    // Process matching surveys for question1
    for survey in &surveys {
        if survey.question1 == question {
            for response in &responses {
                if response.survey_id == survey.survey_id && response.answer1 == answer {
                    let message_content = format!(
                        "You have been invited to participate in a survey based on your answer {} to the question {}",
                        answer, question
                    );
                    add_message(deps.storage, response.response_owner.clone(), message_content.to_string());
                }
            }
        }
    }

    // Process matching surveys for question2
    for survey in &surveys {
        if survey.question2 == question {
            for response in &responses {
                if response.survey_id == survey.survey_id && response.answer2 == answer {
                    let message_content = format!(
                        "You have been invited to participate in a survey based on your answer {} to the question {}",
                        answer, question
                    );
                    add_message(deps.storage, response.response_owner.clone(), message_content.to_string());
                }
            }
        }
    }
    let mut res = Response::default().add_attribute("success", "true".to_string());
    Ok(res)
}


#[entry_point]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetSurvey {survey_id} => to_binary(&read_survey(deps,survey_id)?),
        QueryMsg::GetResponseById {response_id} => to_binary(&read_response_by_id(deps,response_id)?),
        QueryMsg::GetResponseBySurvey {survey_id} => to_binary(&read_response_by_survey_id(deps,survey_id)),
        QueryMsg::GetStateObject {} => to_binary(&read_state_object(deps)),
        QueryMsg::GetAnsweredSurveys {view_key} => to_binary(&get_surveys_answered_by_key(deps.storage,view_key)),
        QueryMsg::GetUnAnsweredSurveys {view_key} => to_binary(&get_surveys_notanswered_by_key(deps.storage,view_key)),
        QueryMsg::GetMySurveyResponse {view_key,survey_id} => to_binary(&view_my_response(deps.storage,view_key,survey_id)),
        QueryMsg::GetMyCreatedSurveys {view_key} => to_binary(&list_my_created_surveys(deps.storage,view_key)),
        QueryMsg::GetResearcherSurveySummary {view_key,survey_id}=> to_binary(&survey_summary_for_researcher(deps.storage,view_key,survey_id)),
        QueryMsg::GetQuesAndOptions {} => to_binary(&get_ques_and_options(deps.storage)),
        QueryMsg::GetMessages {view_key} => to_binary(&try_get_messages(deps.storage,view_key)),
        QueryMsg::GetStatsForQues {question,answer} => to_binary(&get_stats_for_ques(deps,question,answer)),
    }
}

fn read_state_object(deps: Deps) -> State {
    let state = load_state(deps.storage);
    state
}

fn read_survey(deps: Deps, survey_id: i32) -> StdResult<Survey> {
    let survey_result = get_survey_by_id(deps.storage, survey_id);
    Ok(survey_result)
}

fn read_response_by_id(deps: Deps, response_id: i32) -> StdResult<SurveyResponse> {
    let response_result = get_response_by_id(deps.storage, response_id);
    Ok(response_result)
}

fn read_response_by_survey_id(deps: Deps, survey_id: i32) -> Vec<SurveyResponse> {
    let response_result = get_responses_by_survey_id(deps.storage, survey_id);
    response_result
}

// get all surveys which have been responded to by a given address
pub fn get_surveys_answered_by_key(storage: &dyn Storage, key: String) -> Vec<Survey> {
    // get the addr from the key
    let mut addr = get_address_by_view_key(storage, key);
    if addr.is_none() {
        return Vec::new();
    }
    else{
        addr = addr;
    }
    let responses :Vec<SurveyResponse> = read_all_responses(storage);
    let matching_responses : Vec<SurveyResponse> = responses
        .into_iter()
        .filter(|response| response.response_owner == addr.clone().unwrap())
        .collect();
    let mut surveys :Vec<Survey> = Vec::new();
    for response in matching_responses {
        let survey = get_survey_by_id(storage, response.survey_id);
        surveys.push(survey);
    }
    surveys
}

// get all surveys not answered by a user
pub fn get_surveys_notanswered_by_key(storage: &dyn Storage, key: String) -> Vec<Survey> {
    let mut addr = get_address_by_view_key(storage, key);
    if addr.is_none() {
        return Vec::new();
    }
    else{
        addr = addr;
    }
    let responses = read_all_responses(storage);
    let surveys = read_all_surveys(storage);
    let mut surveys_not_answered_by_user = Vec::new();
    for survey in surveys {
        let mut survey_answered_by_user = false;
        for response in responses.clone() {
            if response.survey_id == survey.survey_id && response.response_owner == addr.clone().unwrap() {
                survey_answered_by_user = true;
            }
        }
        if !survey_answered_by_user {
            surveys_not_answered_by_user.push(survey);
        }
    }
    surveys_not_answered_by_user
}

pub fn view_my_response(storage: &dyn Storage, key: String, survey_id: i32) -> Result<SurveyResponse, String> {
    let addr = get_address_by_view_key(storage, key);

    if let Some(address) = addr {
        let responses = read_all_responses(storage);
        for response in responses {
            if response.survey_id == survey_id && response.response_owner == address {
                return Ok(response);
            }
        }
        return Err("You have not responded this survey yet.".to_string());
    } else {
        return Err("Invalid Key.".to_string());
    }
}

pub fn list_my_created_surveys(storage: &dyn Storage, key: String) -> Vec<Survey> {
    let addr = get_address_by_view_key(storage, key);
    let mut matching_surveys = Vec::new(); // Renamed the inner vector
    if let Some(address) = addr {
        let surveys = read_all_surveys(storage);
        for survey in surveys {
            if survey.survey_owner == address {
                matching_surveys.push(survey);
            }
        }
    }
    matching_surveys // Return the inner vector
}

pub fn survey_summary_for_researcher(
    storage: &dyn Storage,
    key: String,
    survey_id: i32,
) -> Result<ResearcherSurveySummary, String> {
    let addr = get_address_by_view_key(storage, key);//fine
    if let Some(address) = addr {
        let survey = get_survey_by_id(storage, survey_id);//fine
        if let survey = survey {
            if survey.survey_owner == address {
                let responses = get_all_response_access(storage, &address, survey_id);//fine
                if let Some(response_list) = responses {
                    let mut quest1_ans_dict = AnswerReport::new();//fine
                    let mut quest2_ans_dict = AnswerReport::new();//fine
                    let mut responses_list: Vec<SurveyResponse> = Vec::new();//fine
                    for response in response_list  {
                        let mut survey_response = get_response_by_id(storage, response.response_id);
                        quest1_ans_dict.update(survey_response.answer1.clone());    
                        quest2_ans_dict.update(survey_response.answer2.clone());    
                                if response.access_type == "public_read"
                                    || response.access_type == "researcher_read"
                                    || response.access_type == "full"
                                {
                                    responses_list.push(survey_response);
                                } else if response.access_type == "researcher_stats"
                                    || response.access_type == "public_stats"
                                {
                                    survey_response.answer1 = "".to_string();
                                    survey_response.answer2 = "".to_string();
                                    responses_list.push(survey_response);
                                }
                    }
                    let return_result = ResearcherSurveySummary {
                        survey :survey,
                        responses: responses_list,
                        question1_answers : quest1_ans_dict,
                        question2_answers : quest2_ans_dict,
                    };
                    return Ok(return_result);
                } else {
                    return Err("No responses found.".to_string());
                }
            } else {
                return Err("You are not the owner of this survey.".to_string());
            }
        } else {
            return Err("Survey not found.".to_string());
        }
    } else {
        return Err("Invalid Key.".to_string());
    }
}


pub fn get_ques_and_options (
    storage: &dyn Storage,
) -> Vec<QuesAndOptions> {
    let surveys = read_all_surveys(storage);
    let mut ques_and_options = Vec::new();
    for survey in surveys {
        let ques_and_option1 = QuesAndOptions {
            question: survey.question1,
            options: survey.quest1options,
        };
        ques_and_options.push(ques_and_option1);
        let ques_and_option2 = QuesAndOptions {
            question: survey.question2,
            options: survey.quest2options,
        };
        ques_and_options.push(ques_and_option2);
    }
    ques_and_options
}

pub fn try_get_messages(
    storage: &dyn Storage,
    key: String,
) -> Result<Vec<String>, String> {
    let addr = get_address_by_view_key(storage, key.clone());
    if let Some(address) = addr {
        if let Some(messages_list) = get_messages(storage, &address) {
            Ok(messages_list.to_vec())
        } else {
            Err("No messages found for the address".to_string())
        }
    } else {
        Err("Address not found".to_string())
    }
}


pub fn get_stats_for_ques(
    deps: Deps,
    question: String,
    answer: String,
) -> u32 {
    let mut counter : u32 = 0;
    let surveys = read_all_surveys(deps.storage);
    let responses = read_all_responses(deps.storage);
    // Process matching surveys for question1
    for survey in &surveys {
        if survey.question1 == question {
            for response in &responses {
                if response.survey_id == survey.survey_id && response.answer1 == answer {
                    counter = counter + 1;
                }
            }
        }
    }
    // Process matching surveys for question2
    for survey in &surveys {
        if survey.question2 == question {
            for response in &responses {
                if response.survey_id == survey.survey_id && response.answer2 == answer {
                    counter = counter + 1;
                }
            }
        }
    }
    counter
    }