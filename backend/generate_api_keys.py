#!/usr/bin/env python3
"""
Generate Secure API Keys for Learnnect Storage API
Creates cryptographically secure random keys for production use
"""

import secrets
import string
import hashlib
import base64
from datetime import datetime

def generate_secure_key(length=64, include_special=True):
    """Generate a cryptographically secure random key"""
    if include_special:
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?"
    else:
        alphabet = string.ascii_letters + string.digits
    
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_jwt_secret(length=64):
    """Generate a secure JWT secret key"""
    # Use base64 encoding for JWT secrets (more compatible)
    random_bytes = secrets.token_bytes(length)
    return base64.urlsafe_b64encode(random_bytes).decode('utf-8')

def generate_api_key_with_prefix(prefix="learnnect", length=48):
    """Generate API key with prefix for easy identification"""
    random_part = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))
    return f"{prefix}_{random_part}"

def generate_hash_based_key(seed_text, length=64):
    """Generate deterministic key based on seed text (for consistency)"""
    # Create hash from seed text
    hash_obj = hashlib.sha256(seed_text.encode())
    hash_hex = hash_obj.hexdigest()
    
    # Extend if needed
    while len(hash_hex) < length:
        hash_hex += hashlib.sha256(hash_hex.encode()).hexdigest()
    
    return hash_hex[:length]

def main():
    """Generate all required API keys"""
    print("🔐 Learnnect Storage API Key Generator")
    print("=" * 50)
    print()
    
    # Generate different types of keys
    keys = {
        "API_SECRET_KEY": generate_secure_key(64, True),
        "JWT_SECRET_KEY": generate_jwt_secret(48),
        "ADMIN_API_KEY": generate_api_key_with_prefix("learnnect_admin", 32),
        "WEBHOOK_SECRET": generate_secure_key(32, False),
        "ENCRYPTION_KEY": generate_jwt_secret(32)
    }
    
    print("🔑 Generated Secure Keys:")
    print("-" * 30)
    
    for key_name, key_value in keys.items():
        print(f"{key_name}={key_value}")
    
    print()
    print("📋 Copy these to your .env.storage file:")
    print("-" * 40)
    
    # Create .env format
    env_content = []
    for key_name, key_value in keys.items():
        env_content.append(f"{key_name}={key_value}")
    
    env_text = "\n".join(env_content)
    print(env_text)
    
    # Save to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"generated_keys_{timestamp}.txt"
    
    with open(filename, 'w') as f:
        f.write("# Learnnect Storage API - Generated Keys\n")
        f.write(f"# Generated on: {datetime.now().isoformat()}\n")
        f.write("# IMPORTANT: Keep these keys secure and never commit to version control\n\n")
        f.write(env_text)
        f.write("\n\n# Instructions:\n")
        f.write("# 1. Copy the keys above to your .env.storage file\n")
        f.write("# 2. Delete this file after copying the keys\n")
        f.write("# 3. Never share these keys publicly\n")
    
    print()
    print(f"💾 Keys saved to: {filename}")
    print("⚠️  IMPORTANT: Delete this file after copying the keys to your .env file!")
    
    print()
    print("🔒 Security Recommendations:")
    print("- Use these keys in production")
    print("- Never commit keys to version control")
    print("- Rotate keys regularly (every 6-12 months)")
    print("- Store backup keys securely")
    print("- Use environment variables in deployment")
    
    return keys

if __name__ == "__main__":
    main()
