#!/bin/bash

# Exit on any error
set -e

NAMESPACE="capitalis"
DEPLOYMENT="capitalis-ai"

echo "🔄 Restarting deployment $DEPLOYMENT in namespace $NAMESPACE..."

# Perform the rollout restart
kubectl rollout restart deployment/$DEPLOYMENT -n $NAMESPACE

# Wait for the rollout to complete
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE

# Get the new pod status
echo -e "\n📊 New Pod Status:"
kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT

# Get the deployment status
echo -e "\n📈 Deployment Status:"
kubectl get deployment -n $NAMESPACE $DEPLOYMENT

echo -e "\n✅ Deployment update complete!"
