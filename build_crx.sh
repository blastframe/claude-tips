#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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
