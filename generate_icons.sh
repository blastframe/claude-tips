#!/bin/bash

# Define paths
TARGET_DIR="/Users/kevincburke/Documents/GitHub/claude-tips/icons"
SIZES=(16 32 48 128)
FILES=("claude-tips" "claude-tips-disabled")

# Create icons directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Loop through each SVG file and size
for file in "${FILES[@]}"; do
    for size in "${SIZES[@]}"; do
        SOURCE_PATH="$TARGET_DIR/$file.svg"
        OUTPUT_PATH="$TARGET_DIR/$file-$size.png"
        
        echo "Generating $OUTPUT_PATH..."
        
        # Remove existing file to ensure overwrite
        rm -f "$OUTPUT_PATH"
        
        # Convert using sips (macOS native)
        sips -s format png -z "$size" "$size" "$SOURCE_PATH" --out "$OUTPUT_PATH" > /dev/null
    done
done

echo "Done! Icons are in the $TARGET_DIR folder."
