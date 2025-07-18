#!/bin/bash
# Script to fully reset React Native/Expo caches

# Kill any running Metro and Expo processes
echo "Killing any Metro and Expo processes..."
pkill -f "metro" || true
pkill -f "expo" || true

# Clear Metro cache
echo "Clearing Metro cache..."
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
rm -rf $TMPDIR/react-*

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf .expo
mkdir -p .expo
rm -rf ~/.expo
mkdir -p ~/.expo

# Clear watchman watches
echo "Clearing watchman..."
watchman watch-del-all || true

# Clear derived data
echo "Clearing derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clear babel cache
echo "Clearing babel cache..."
rm -rf node_modules/.cache/babel-loader/*

# Force reinstall node modules
echo "Reinstalling node modules..."
rm -rf node_modules
npm install

echo "Cache clearing complete. Ready to restart Expo."
