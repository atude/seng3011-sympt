import { JSONArray } from "puppeteer";

var analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new analyzer("English", stemmer, "afinn");

export const getSentiment = (text: string) => {
    var nonNeutral: string[] = [];
    var positive = 0;
    var negative = 0;
    var neutral = 0;
    const array = text.split(" ");
    for(let i = 0; i < array.length; i++) {
        const element = array[i];
        const sentiment = analyzer.getSentiment([element]);
        if (sentiment) {
            nonNeutral.push(element);
            if (sentiment < 0)
                negative++;
            else
                positive++;
        } else
            neutral++;

    }
    return <JSON><unknown>{
        nPositive: positive,
        nNegative: negative,
        nNeutral: neutral,
        sentiment: analyzer.getSentiment(nonNeutral)
    };
};


export const getSentimentFile = (texts: JSONArray) => {
    var sentiments: JSONArray = [];
    for(let i = 0; i < texts.length; i++)
        sentiments.push(getSentiment(texts[i].main_text));
    return sentiments;
}