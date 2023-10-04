#!/bin/bash
# Create vcluster
# ./create-vcl.sh <${pattern}>

test -z "$1" && echo "Please input env name" && exit 1

pattern="$1"
file_path="/tmp/${pattern}-vcl-values.yaml"

cat <<EOF > ${file_path}
sync:
  persistentvolumes:
    enabled: true
  storageclasses:
    enabled: true
  nodes:
    enabled: true
    syncAllNodes: true
  serviceaccounts:
    enabled: true
  ingresses:
    enabled: true

syncer:
  extraArgs:
    - --tls-san=${pattern}-eks.simflexcloud.com
EOF

vcluster create ${pattern} -n ${pattern} -f ${file_path} --upgrade --connect=false