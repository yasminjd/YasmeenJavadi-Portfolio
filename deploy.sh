#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Copy built files to root for GitHub Pages
echo "Preparing for deployment..."
cp -r dist/* .

# Add all files
git add .

# Commit changes
git commit -m "Deploy portfolio website"

# Push to GitHub
git push origin main

echo "Deployment complete! Your site should be live in a few minutes." 