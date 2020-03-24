#!/bin/sh
if test $# -lt 3
then
    echo "Usage: ./time_testing <locations_file> <article_count> <auth_token>"
    exit
fi

if ls | egrep "time_test_results" > /dev/null
then
    rm -r time_test_results
fi
mkdir time_test_results

i=1
while read line
do
    startTime=`echo $line | egrep -o ".*," | sed "s/,//"`
    endTime=`echo $line | egrep -o ",.*" | sed "s/,//"`
    url="https://sympt-server.herokuapp.com/articles/?startdate=$startDate&enddate=$endDate&location=china&keyterms=coronavirus&count=$2&page=0"
    touch "time_test_results/query_result$i.json"
    curl -X GET "$url" -H "accept: application/json" -H "authorization: $3" | jq '.' > "time_test_results/query_result$i.json"

done < $1