#!/bin/bash

# Define paths
SOURCE_DIR="/Users/kevincburke/Documents/GitHub/claude-tips"
OUTPUT_DIR="icons"
SIZES=(16 32 48 128)
FILES=("claude-tips" "claude-tips-disabled")

# Create icons directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through each SVG file and size
for file in "${FILES[@]}"; do
    for size in "${SIZES[@]}"; do
        SOURCE_PATH="$SOURCE_DIR/$file.svg"
        OUTPUT_PATH="$OUTPUT_DIR/$file-$size.png"
        
        echo "Generating $OUTPUT_PATH..."
        
        # Convert using sips (macOS native)
        sips -s format png -z "$size" "$size" "$SOURCE_PATH" --out "$OUTPUT_PATH" > /dev/null
    done
done

echo "Done! Icons are in the /$OUTPUT_DIR folder."
