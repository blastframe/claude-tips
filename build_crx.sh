#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Safety checks
echo "Running pre-flight checks..."

# Check for clean git working directory
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Error: You have uncommitted changes. Please commit or stash them first."
  exit 1
fi

# Check that gh CLI is available
if ! command -v gh &> /dev/null; then
  echo "❌ Error: 'gh' CLI is not installed. Please install GitHub CLI."
  exit 1
fi

# Check that jq is available
if ! command -v jq &> /dev/null; then
  echo "❌ Error: 'jq' is not installed. Please install jq."
  exit 1
fi

# Fetch latest tags to ensure we have current version info
git fetch origin --tags 2>/dev/null || true

echo "✓ Pre-flight checks passed"

# Extract and increment version
echo ""
echo "Incrementing version number..."

CURRENT_VERSION=$(jq -r '.version' manifest.json)
echo "Current version: $CURRENT_VERSION"

# Parse version components (handle major.minor or major.minor.patch)
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
PATCH="${PATCH:-0}"

# Increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "New version: $NEW_VERSION"

# Update manifest.json
jq ".version = \"$NEW_VERSION\"" manifest.json > manifest.json.tmp
mv manifest.json.tmp manifest.json

# Commit version bump
git add manifest.json
git commit -m "chore: bump version to $NEW_VERSION"
echo "✓ Committed version bump"

echo ""
OUTPUT_DIR="$SCRIPT_DIR/dist"
KEY_FILE="$SCRIPT_DIR/extension.pem"
ZIP_FILE="$OUTPUT_DIR/extension.zip"
CRX_FILE="$OUTPUT_DIR/claude-tips.crx"
PUBKEY_DER="$OUTPUT_DIR/public.der"
SIG_FILE="$OUTPUT_DIR/signature.bin"

mkdir -p "$OUTPUT_DIR"

if [ ! -f "$KEY_FILE" ]; then
  echo "Generating RSA private key: $KEY_FILE"
  openssl genpkey -algorithm RSA -out "$KEY_FILE" -pkeyopt rsa_keygen_bits:2048
fi

rm -f "$ZIP_FILE" "$CRX_FILE" "$PUBKEY_DER" "$SIG_FILE"

zip -r "$ZIP_FILE" \
  manifest.json popup.html popup.css popup.js background.js \
  claude-logo.svg claude-tips.svg claude-tips-disabled.svg icons \
  >/dev/null

openssl rsa -in "$KEY_FILE" -pubout -outform DER -out "$PUBKEY_DER"
openssl dgst -sha1 -sign "$KEY_FILE" -out "$SIG_FILE" "$ZIP_FILE"

python3 - <<PY
import struct
from pathlib import Path

output = Path("$CRX_FILE")
public = Path("$PUBKEY_DER").read_bytes()
signature = Path("$SIG_FILE").read_bytes()
zip_bytes = Path("$ZIP_FILE").read_bytes()

header = b"Cr24" + struct.pack("<I", 2) + struct.pack("<I", len(public)) + struct.pack("<I", len(signature))
output.write_bytes(header + public + signature + zip_bytes)
PY

rm -f "$PUBKEY_DER" "$SIG_FILE"

echo "Created signed extension: $CRX_FILE"

echo "Private key: $KEY_FILE"

echo "Use the .crx file for local installs or distribution where Chrome accepts packaged extensions."

# Publish to GitHub as an official release
echo ""
echo "Publishing extension to GitHub..."

TAG="v$NEW_VERSION"

# Check if release already exists
if gh release view "$TAG" >/dev/null 2>&1; then
  echo "❌ Error: Release $TAG already exists."
  echo "A release with this version already exists. Please manually verify and try again."
  exit 1
fi

# Create git tag
echo "Creating git tag $TAG..."
git tag -a "$TAG" -m "Release $NEW_VERSION"
git push origin main --quiet
git push origin "$TAG" --quiet

# Create GitHub release and upload the CRX file
echo "Creating GitHub release and uploading extension..."
gh release create "$TAG" \
  "$CRX_FILE" \
  --title "Claude Tips v$NEW_VERSION" \
  --notes "Official release of Claude Tips extension v$NEW_VERSION" \
  --latest

echo ""
echo "✅ Successfully published extension v$NEW_VERSION to GitHub"
echo "Release URL: $(gh release view "$TAG" --json url --jq '.url')"
echo ""
echo "Summary:"
echo "  - Version bumped: $CURRENT_VERSION → $NEW_VERSION"
echo "  - Git commit: $(git rev-parse --short HEAD)"
echo "  - Git tag: $TAG"
echo "  - CRX file: $CRX_FILE"
