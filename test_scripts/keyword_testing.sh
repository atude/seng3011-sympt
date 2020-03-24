#!/bin/sh
if test $# -lt 3
then
    echo "Usage: ./keywords_testing <keywords_file> <article_count> <auth_token>"
    exit
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='300[0m'

if ls | egrep "keyword_test_results" > /dev/null
then
    rm -r keyword_test_results
fi
mkdir keyword_test_results

i=1
# $1 Should be diseaseList.json, or a similar list of diseases
while read line
do
    keyword=`echo $line | egrep -o ": \"[a-zA-Z ,-\(\)\.]*\"" | egrep -o "[a-zA-Z][a-zA-Z ,-]*" | sed "s/ /+/g"`
    url="https://sympt-server.herokuapp.com/articles/?startdate=2019-06-02T00%3A00%3A00&enddate=2020-02-02T00%3A00%3A00&location=china&keyterms=$keyword&count=$2&page=0"
    touch "keyword_test_results/query_result$i.json"
    curl -X GET "$url" -H "accept: application/json" -H "authorization: $3" | jq '.' > "keyword_test_results/query_result$i.json"

    # Regex Tests
    keyword=`echo $keyword | sed "s/+/ /"`
    numArticles=`cat keyword_test_results/query_result$i.json | egrep "total_articles" | egrep -o "[0-9]+"`
    if test $numArticles -gt 0
    then
        mainText=`cat keyword_test_results/query_result$i.json | egrep -v "\"$keyword\"" | egrep -o "$keyword" | wc -l`
        articleDisease=`cat keyword_test_results/query_result$i.json | egrep -c "\"$keyword\""`
        echo "Maintext: $mainText, ArticleDisease: $articleDisease, Keyword: $keyword"
        if test $articleDisease -lt $2
        then
            echo "Test query $i FAILED. Disease was not listed in all articles"
            if test $mainText -lt $2
            then
                echo "Test query $i FAILED. Article was not relevant to keyword"
            else
                echo "Test query $i PASSED. With $articleDisease/$2 articles reporting $keyword. Total mentions: $mainText"
            fi
        fi
    else
        echo "Test query $i FAILED. Returned zero articles"
    fi

    i=$((i + 1))
done < $1
