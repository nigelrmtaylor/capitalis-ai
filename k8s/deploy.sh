#!/bin/bash

# Exit on any error
set -e

echo "Creating namespace if it doesn't exist..."
kubectl create namespace capitalis --dry-run=client -o yaml | kubectl apply -f -

echo "Applying Kubernetes manifests..."

# Apply the deployment and service
kubectl apply -f capitalis-ai-deployment.yaml

# Apply the ClusterIssuer and Ingress
kubectl apply -f capitalis-ai-ingress.yaml

# Wait for the deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/capitalis-ai -n capitalis

# Get the deployment status
echo -e "\nDeployment Status:"
kubectl get deployments -n capitalis capitalis-ai

# Get the service details
echo -e "\nService Details:"
kubectl get service -n capitalis capitalis-ai

# Get the pods
echo -e "\nPod Details:"
kubectl get pods -n capitalis -l app=capitalis-ai

# Get the ingress details
echo -e "\nIngress Details:"
kubectl get ingress -n capitalis capitalis-ai

# Get the certificate details
echo -e "\nCertificate Details:"
kubectl get certificate -n capitalis capitalis-ai-tls-prod

# Check certificate status
echo -e "\nDetailed Certificate Status:"
kubectl describe certificate -n capitalis capitalis-ai-tls-prod

echo -e "\nDeployment complete! 🚀"
