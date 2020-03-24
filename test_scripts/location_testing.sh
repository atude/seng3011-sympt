if test $# -lt 3
then
    echo "Usage: ./location_testing <locations_file> <article_count> <auth_token>"
    exit
fi

if ls | egrep "location_test_results" > /dev/null
then
    rm -r location_test_results
fi
mkdir location_test_results

i=1
while read location
do
    url="https://sympt-server.herokuapp.com/articles/?startdate=2019-06-02T00%3A00%3A00&enddate=2020-02-02T00%3A00%3A00=$location&keyterms=coronavirus&count=$2&page=0"
    touch "location_test_results/query_result$1.json"
    curl -X GET "$url" -H "accept: application/json" -H "authorization: $3" | jq '.' > "location_test_results/query_result$i.json"

    # Regex
    numArticles=`cat location_test_results/query_result$1.json | egrep -c "$location"`
    if test $numArticles -lt $2
    then
        echo "Test query $i FAILED. Location was not listed in all articles"
    else 
        echo "Test query $i PASSED. Location was listed in all articles"
    fi
    i=$((i + 1))
done < $1