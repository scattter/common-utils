import { pipeline } from "@xenova/transformers";

export const createPoem = async () => {
  // let poet = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
  // let result = await poet('Write me a love poem about cheese.', {
  //   max_new_tokens: 200,
  //   temperature: 0.9,
  //   repetition_penalty: 2.0,
  //   no_repeat_ngram_size: 3,
  // });
  let classifier = await pipeline('sentiment-analysis');
  let result = await classifier('I love transformers!');
  console.log(result, '----')
  return new Promise((resolve, reject) => {
    resolve(result);
  })
}