#!/bin/bash

# Define paths
SCRIPT_DIR="/Users/kevincburke/Documents/GitHub/claude-tips/"
SOURCE_DIR="$SCRIPT_DIR/images"
ICONS_DIR="$SCRIPT_DIR/icons"
SIZES=(16 32 48 128)
FILES=("claude-tips" "claude-tips-disabled")

# Create icons directory if it doesn't exist
mkdir -p "$ICONS_DIR"

# Loop through each SVG file and size
for file in "${FILES[@]}"; do
    for size in "${SIZES[@]}"; do
        SOURCE_PATH="$SOURCE_DIR/$file.svg"
        OUTPUT_PATH="$ICONS_DIR/$file-$size.png"
        
        echo "Generating $OUTPUT_PATH..."
        
        # Remove existing file to ensure overwrite
        rm -f "$OUTPUT_PATH"
        
        # Convert using sips (macOS native)
        sips -s format png -z "$size" "$size" "$SOURCE_PATH" --out "$OUTPUT_PATH" > /dev/null
    done
done

echo "Done! Icons are in the $ICONS_DIR folder."
