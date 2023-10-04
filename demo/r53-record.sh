#!/bin/bash -e
# ./r53-records.sh <action> <pattern> [<dns>]

if [[ "X" == "X$1" ]]; then
    echo "Input action 'create | delete'"
    exit 1
elif [[ "X" == "X$2" ]]; then
    echo "Input pattern, eg. app1"
    exit 1
fi

action=$(echo "$1" |  tr '[:lower:]' '[:upper:]')
pattern="$2"

HOSTED_ZONE_ID="Z00277012KVECW7RHISD6"
HOSTED_ZONE_NAME="simflexcloud.com"

AWS_REGION="ap-southeast-1"

function handle_record() {
  record="$1"
  dns="$2"
  cat<<EOF >/tmp/records.json
{
    "Comment": "${action} the ${record} ",
    "Changes": [{
        "Action": "${action}",
        "ResourceRecordSet": {
            "Name": "${record}.${HOSTED_ZONE_NAME}",
            "Type": "CNAME",
            "TTL": 60,
            "ResourceRecords": [{ "Value": "${dns}"}]
        }
    }]
}
EOF
  aws route53 change-resource-record-sets --hosted-zone-id ${HOSTED_ZONE_ID} --change-batch file:///tmp/records.json --profile mfa > /dev/null || true
}

if [ "X$3" == "X" ]; then
  DNS=$(kubectl get svc -n ${pattern} ${pattern}-lb  -o jsonpath='{.status.loadBalancer.ingress[*].hostname}')
  handle_record ${pattern}-eks ${DNS}
else
  DNS="$3"
  handle_record ${pattern} ${DNS}
fi
