#!/bin/bash

# Set the namespace and port variables
NAMESPACE="capitalis"
LOCAL_PORT="5678"
POD_PORT="5678"

# Get the pod name
POD_NAME=$(kubectl get pods -n $NAMESPACE -l app=postgraphile-server -o jsonpath="{.items[0].metadata.name}")

if [ -z "$POD_NAME" ]; then
    echo "Error: No PostGraphile pod found in namespace $NAMESPACE"
    exit 1
fi

echo "Setting up port-forward from localhost:$LOCAL_PORT to $POD_NAME:$POD_PORT"
echo "GraphiQL will be available at http://localhost:$LOCAL_PORT/graphiql"
echo "Press Ctrl+C to stop port-forwarding"

# Start port-forwarding
kubectl port-forward -n $NAMESPACE $POD_NAME $LOCAL_PORT:$POD_PORT
