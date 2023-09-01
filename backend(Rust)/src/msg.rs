use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreateSurvey {survey_title: String, question1: String, question2: String, quest1options: [String; 4], quest2options: [String; 4],seed:String},
    SubmitSurveyResponse {survey_id: i32, answer1: String, answer2: String,response_type:String,seed:String},
    GetMyViewKey {seed:String},
    RequestParticipation {question:String,answer:String}
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    GetSurvey {survey_id: i32},
    GetResponseById {response_id: i32},
    GetResponseBySurvey {survey_id: i32},
    GetStateObject {},
    GetAnsweredSurveys {view_key:String},
    GetUnAnsweredSurveys {view_key:String},
    GetMySurveyResponse {view_key:String,survey_id:i32},
    GetMyCreatedSurveys {view_key:String},
    GetResearcherSurveySummary {view_key:String,survey_id:i32},
    GetQuesAndOptions {},
    GetMessages {view_key:String},
    GetStatsForQues {question:String,answer:String},
}

