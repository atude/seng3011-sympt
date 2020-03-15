'use strict';


/**
 * searches database
 * By passing in the appropriate options, you can search for available ProMed disease reports in the system 
 *
 * startDate String pass a required start date
 * endDate String pass a required end date
 * location String search disease reports by a location name
 * keyterms String a comma separated list of all the key terms (optional)
 * returns List
 **/
exports.searchProMedDIseaseReports = function(startDate,endDate,location,keyterms) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reports" : {
    "event_date" : "2020-01-03 xx:xx:xx to 2020-01-15",
    "locations" : {
      "country" : "China",
      "location" : "Wuhan"
    }
  },
  "date_of_publication" : "2020-02-01 23:02:03",
  "diseases" : [ "Coronavirus", "Coronavirus" ],
  "main_text" : "NOVEL CORONAVIRUS (28): CHINA (HUBEI) ANIMAL RESERVOIR ****************************************************** A ProMED-mail post  http://www.promedmail.org  ProMED-mail is a program of the International Society for Infectious Diseases  http://www.isid.org  In this posting: [1] Measures to regulate the trade and maintenance of wild animals in China [2] Virus detection in environmental samples from the seafood market [3] Initial epidemiology, public announcement, 31 Dec 2019 ****** [1] Measures to regulate the trade and maintenance of wild animals in China Date: Fri 31 Jan 2020 Source: Xinhuanet News [in Chinese, machine trans., abridged, edited]  http://www.xinhuanet.com/politics/2020-01/31/c_1125515239.htm  On 26 Jan 2020, the China Centers for Disease Control and Prevention announced that the new coronavirus was detected in environmental samples from the South China Seafood Market in Wuhan [see item 2]. The virus originated from wild animals sold in the seafood market. For this reason, the State General Administration of Market Supervision, the Ministry of Agriculture and Rural Affairs, and the National Forestry and Grassland Bureau jointly issued a public announcement on the 26th that from now on until the end of the national epidemic, wild animal trading activities are prohibited to cut off the source and transmission of the virus.",
  "syndromes" : [ "Fever", "Fever" ],
  "headline" : "Novel coronavirus (28): China (HU) animal reservoir",
  "url" : "https://promedmail.org/promed-post/?id=6943858"
}, {
  "reports" : {
    "event_date" : "2020-01-03 xx:xx:xx to 2020-01-15",
    "locations" : {
      "country" : "China",
      "location" : "Wuhan"
    }
  },
  "date_of_publication" : "2020-02-01 23:02:03",
  "diseases" : [ "Coronavirus", "Coronavirus" ],
  "main_text" : "NOVEL CORONAVIRUS (28): CHINA (HUBEI) ANIMAL RESERVOIR ****************************************************** A ProMED-mail post  http://www.promedmail.org  ProMED-mail is a program of the International Society for Infectious Diseases  http://www.isid.org  In this posting: [1] Measures to regulate the trade and maintenance of wild animals in China [2] Virus detection in environmental samples from the seafood market [3] Initial epidemiology, public announcement, 31 Dec 2019 ****** [1] Measures to regulate the trade and maintenance of wild animals in China Date: Fri 31 Jan 2020 Source: Xinhuanet News [in Chinese, machine trans., abridged, edited]  http://www.xinhuanet.com/politics/2020-01/31/c_1125515239.htm  On 26 Jan 2020, the China Centers for Disease Control and Prevention announced that the new coronavirus was detected in environmental samples from the South China Seafood Market in Wuhan [see item 2]. The virus originated from wild animals sold in the seafood market. For this reason, the State General Administration of Market Supervision, the Ministry of Agriculture and Rural Affairs, and the National Forestry and Grassland Bureau jointly issued a public announcement on the 26th that from now on until the end of the national epidemic, wild animal trading activities are prohibited to cut off the source and transmission of the virus.",
  "syndromes" : [ "Fever", "Fever" ],
  "headline" : "Novel coronavirus (28): China (HU) animal reservoir",
  "url" : "https://promedmail.org/promed-post/?id=6943858"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

