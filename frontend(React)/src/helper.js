export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    
    return randomString;
  }
  
  function maskMiddle(str) {
    if (str.length <= 6) return str; // No need to mask short strings
    const prefix = str.slice(0, 3);
    const suffix = str.slice(-3);
    const middleMasked = '*'.repeat(str.length - 40);
    return `${prefix}${middleMasked}${suffix}`;
  }
  
  export function extractFormattedResponses(jsonData) {
    const data = JSON.parse(jsonData);
    const responses = data.responses;
  
    const formattedResponses = responses.map(response => ({
      respondent: maskMiddle(response.response_owner),
      answer1: response.answer1 === "" ? false : response.answer1,
      answer2: response.answer2 === "" ? false : response.answer2
    }));
  
    return formattedResponses;
  }
  
  export function extractQuestion1Stats(jsonData) {
    const data = JSON.parse(jsonData);
    const question1Options = data.survey.quest1options;
    const question1Stats = {};
  
    const answers = data.question1_answers.answers;
    for (const [option, count] of answers) {
      question1Stats[option] = count;
    }
  
    // Initialize missing options with 0 count
    for (const option of question1Options) {
      if (!(option in question1Stats)) {
        question1Stats[option] = 0;
      }
    }
  
    // Preserve the order of keys based on quest1options array
    const orderedQuestion1Stats = {};
    question1Options.forEach(option => {
      orderedQuestion1Stats[option] = question1Stats[option];
    });
  
    return orderedQuestion1Stats;
  }

  export function extractQuestion2Stats(jsonData) {
    const data = JSON.parse(jsonData);
    const question2Options = data.survey.quest2options;
    const question2Stats = {};
  
    const answers = data.question2_answers.answers;
    for (const [option, count] of answers) {
      question2Stats[option] = count;
    }
  
    // Initialize missing options with 0 count
    for (const option of question2Options) {
      if (!(option in question2Stats)) {
        question2Stats[option] = 0;
      }
    }
  
    // Preserve the order of keys based on quest1options array
    const orderedQuestion2Stats = {};
    question2Options.forEach(option => {
      orderedQuestion2Stats[option] = question2Stats[option];
    });
  
    return orderedQuestion2Stats;
  }