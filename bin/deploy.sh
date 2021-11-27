#!/bin/sh

PROJECT=covidvobcich
IMAGE=gcr.io/${PROJECT}/covidvobcich-importer

env_vars="ENV=production,"

gcloud builds submit --tag $IMAGE --project=$PROJECT --gcs-log-dir=gs://${PROJECT}_cloudbuild/logs && \
gcloud run deploy covidvobcich-importer \
  --image $IMAGE \
  --set-env-vars="$env_vars" \
  --project=$PROJECT \
  --platform managed \
  --allow-unauthenticated \
  --region=europe-west3