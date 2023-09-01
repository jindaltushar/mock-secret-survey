import {SecretNetworkClient} from "secretjs";
const DENOM = 'SCRT';
const MINIMAL_DENOM = 'uscrt';
const CHAIN_NAME = 'secret';  //Anything you want
const LCD_URL = 'https://api.pulsar3.scrttestnet.com';
const RPC_URL = 'https://rpc.pulsar3.scrttestnet.com';
const CHAIN_ID = "pulsar-3";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getKeplr() {
    while (
      !window.keplr &&
      !window.getOfflineSigner &&
      !window.getEnigmaUtils
    ) {
      await sleep(10);
    }
    
    await window.keplr.experimentalSuggestChain({
            chainId: CHAIN_ID,
            chainName: CHAIN_NAME,
            rpc: RPC_URL,
            rest: LCD_URL,
            bip44: {
                coinType: 529,
            },
            stakeCurrency: {
                coinDenom: DENOM,
                coinMinimalDenom: MINIMAL_DENOM,
                coinDecimals: 6,
            },
            bech32Config: {
                bech32PrefixAccAddr: "secret",
                bech32PrefixAccPub: "secretpub",
                bech32PrefixValAddr: "secretvaloper",
                bech32PrefixValPub: "secretvaloperpub",
                bech32PrefixConsAddr: "secretvalcons",
                bech32PrefixConsPub: "secretvalconspub",
            },
            currencies: [
                {
                coinDenom: DENOM,
                coinMinimalDenom: MINIMAL_DENOM,
                coinDecimals: 6,
                },
            ],
            feeCurrencies: [
                {
                coinDenom: DENOM,
                coinMinimalDenom: MINIMAL_DENOM,
                coinDecimals: 6,
                gasPriceStep: {
                    low: 0.01,
                    average: 0.025,
                    high: 0.03,
                },
                },
            ],
            features: [],
            });
    await window.keplr.enable(CHAIN_ID);
    const keplrOfflineSigner = await window.getOfflineSigner(CHAIN_ID);
    const [{ address: mAddress }] =  await keplrOfflineSigner.getAccounts();
    const secretjsc = new SecretNetworkClient({
        url: LCD_URL,
        chainId: CHAIN_ID,
        wallet: keplrOfflineSigner,
        walletAddress: mAddress,
        encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
      });
      return { mAddress , secretjsc };
}

export async function get_key(secretjs, myAddress,contract_address,code_hash) {
    console.log("getting view key");

    try {
      let tx = await secretjs.tx.compute.executeContract(
        {
          sender: myAddress,
          contract_address: contract_address,
          msg: {
            get_my_view_key: {
              seed: "BabyD3oll",
            },},
            code_hash : code_hash
        },
        {
          gasLimit: 400000
        }
      );
      return tx.arrayLog.find(obj => obj.key === 'your_view_key').value;
    } catch (err) {
      console.error(err);
    }
};

export async function get_unanswered_surveys(secretjs,view_key,contract_address,code_hash){
    console.log('getting unanswered surveys');
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_un_answered_surveys : {
                        view_key : view_key
                    }
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function get_survey_by_id(secretjs,survey_id,contract_address,code_hash){
    console.log('getting survey by id');
    var d = parseInt(survey_id);
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_survey : {
                        survey_id : d
                    }
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function submit_survey_response(secretjs, myAddress,contract_address,code_hash,response_object) {
    console.log("submitting survey response");

    try {
      let tx = await secretjs.tx.compute.executeContract(
        {
          sender: myAddress,
          contract_address: contract_address,
          msg: {
            submit_survey_response : {
              survey_id: response_object.survey_id,
              answer1 : response_object.answer1,
              answer2 : response_object.answer2,
              response_type : response_object.response_type,
              seed :response_object.seed
            },},
            code_hash : code_hash
        },
        {
          gasLimit: 400000
        }
      );
      return tx.arrayLog.find(obj => obj.key === 'response_id').value;
    } catch (err) {
      console.error(err);
    }
};

export async function get_answered_surveys(secretjs,view_key,contract_address,code_hash){
    console.log('getting answered surveys');
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_answered_surveys : {
                        view_key : view_key
                    }
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function get_my_survey_response(secretjs,view_key,contract_address,code_hash,survey_id){
    console.log('getting my answer  for survey -',survey_id);
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_my_survey_response : {
                        view_key : view_key,
                        survey_id: survey_id
                    }
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function submit_survey(secretjs, myAddress,contract_address,code_hash,survey_object) {
    console.log("submitting survey");

    try {
      let tx = await secretjs.tx.compute.executeContract(
        {
          sender: myAddress,
          contract_address: contract_address,
          msg: {
            create_survey : {
              survey_title: survey_object.survey_title,
              question1 : survey_object.question1,
              question2 : survey_object.question2,
              quest1options : survey_object.quest1options,
              quest2options :survey_object.quest2options,
              seed :survey_object.seed
            },},
            code_hash : code_hash
        },
        {
          gasLimit: 400000
        }
      );
      return tx.arrayLog.find(obj => obj.key === 'survey_id').value;
    } catch (err) {
      console.error(err);
    }
};

export async function get_my_created_surveys(secretjs,view_key,contract_address,code_hash){
    console.log('getting my created surveys');
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_my_created_surveys : {
                        view_key : view_key
                    }
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function get_researcher_summary(secretjs,view_key,contract_address,code_hash,survey_id){
    console.log('getting researcher summary for survey -',survey_id);
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_researcher_survey_summary : {
                        view_key : view_key,
                        survey_id: survey_id
                    }
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function get_question_and_options(secretjs,contract_address,code_hash){
    console.log('getting my all questions and options');
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_ques_and_options : {},
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function get_stats_for_ques_ans(secretjs,contract_address,code_hash,ques,ans){
    console.log('getting stats for a ques and ans');
    try{
        let tx  = await secretjs.query.compute.queryContract({
            contract_address :contract_address,
                query :{
                    get_stats_for_ques : {
                        question: ques,
                        answer: ans
                    },
                },
                code_hash : code_hash
            });
        return tx;
    }catch (error){
        console.log(error);
    }
}

export async function reach_participants(secretjs,myAddress,contract_address,code_hash,ques,ans) {
        console.log("contacting participants ... ");
    
        try {
            const tx = await secretjs.tx.compute.executeContract(
            {
              sender: myAddress,
              contract_address: contract_address,
              msg: {
                request_participation : {
                  question: ques,
                    answer: ans
                },},
                code_hash : code_hash
            },
            {
              gasLimit: 400000
            }
          );
          return tx.arrayLog.find(obj => obj.key === 'success').value;
        } catch (err) {
          console.error(err);
        }
    }


export async function get_messages(secretjs,view_key,contract_address,code_hash){
        console.log('getting messages');
        try{
            let tx  = await secretjs.query.compute.queryContract({
                contract_address :contract_address,
                    query :{
                        get_messages : {
                            view_key : view_key
                        }
                    },
                    code_hash : code_hash
                });
            return tx;
        }catch (error){
            console.log(error);
        }
    }