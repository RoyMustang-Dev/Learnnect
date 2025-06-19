#!/usr/bin/env python3
"""
Service Account Key Fixer for Learnnect Storage
This script helps diagnose and fix common Google Service Account issues
"""

import json
import os
import sys
from datetime import datetime

def fix_private_key_formatting(service_account_json):
    """Fix common private key formatting issues"""
    try:
        data = json.loads(service_account_json)
        
        if 'private_key' in data:
            private_key = data['private_key']
            
            # Check if private key has literal \n instead of actual newlines
            if '\\n' in private_key and '\n' not in private_key:
                print("🔧 Found literal \\n in private key, converting to actual newlines...")
                data['private_key'] = private_key.replace('\\n', '\n')
                return json.dumps(data, indent=2)
            elif '\n' not in private_key and '\\n' not in private_key:
                print("⚠️ Private key appears to be on a single line without proper formatting")
                print("   This might cause JWT signature errors")
                return service_account_json
            else:
                print("✅ Private key formatting appears correct")
                return service_account_json
        else:
            print("❌ No private_key found in service account JSON")
            return service_account_json
            
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        return None
    except Exception as e:
        print(f"❌ Error processing service account JSON: {e}")
        return None

def validate_service_account_json(service_account_json):
    """Validate service account JSON structure"""
    try:
        data = json.loads(service_account_json)
        
        required_fields = [
            'type', 'project_id', 'private_key_id', 
            'private_key', 'client_email', 'client_id',
            'auth_uri', 'token_uri'
        ]
        
        missing_fields = []
        for field in required_fields:
            if field not in data:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        
        # Check specific field formats
        if not data['client_email'].endswith('.iam.gserviceaccount.com'):
            print("⚠️ client_email doesn't look like a service account email")
        
        if not data['private_key'].startswith('-----BEGIN PRIVATE KEY-----'):
            print("⚠️ private_key doesn't start with proper header")
        
        if not data['private_key'].endswith('-----END PRIVATE KEY-----\n'):
            print("⚠️ private_key doesn't end with proper footer")
        
        print("✅ Service account JSON structure is valid")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        return False
    except Exception as e:
        print(f"❌ Error validating service account JSON: {e}")
        return False

def main():
    print("🔧 Learnnect Service Account Key Fixer")
    print("=" * 50)
    
    # Check if service account JSON is in environment
    service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    
    if not service_account_json:
        print("❌ GOOGLE_SERVICE_ACCOUNT_JSON environment variable not found")
        print("\nTo fix this:")
        print("1. Get your service account key from Google Cloud Console")
        print("2. Set it as an environment variable:")
        print("   export GOOGLE_SERVICE_ACCOUNT_JSON='your-json-here'")
        print("3. Or add it to your .env file")
        return
    
    print("✅ Found GOOGLE_SERVICE_ACCOUNT_JSON environment variable")
    print(f"📏 Length: {len(service_account_json)} characters")
    
    # Validate the JSON
    print("\n🔍 Validating service account JSON...")
    if not validate_service_account_json(service_account_json):
        print("❌ Service account JSON validation failed")
        return
    
    # Try to fix formatting issues
    print("\n🔧 Checking and fixing formatting...")
    fixed_json = fix_private_key_formatting(service_account_json)
    
    if fixed_json and fixed_json != service_account_json:
        print("\n✅ Fixed service account JSON formatting")
        print("📝 Updated JSON (first 100 chars):", fixed_json[:100] + "...")
        
        # Save fixed version to a file for reference
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"fixed_service_account_{timestamp}.json"
        
        try:
            with open(filename, 'w') as f:
                f.write(fixed_json)
            print(f"💾 Saved fixed JSON to: {filename}")
            print("\nTo use the fixed version:")
            print(f"1. Copy the content from {filename}")
            print("2. Update your GOOGLE_SERVICE_ACCOUNT_JSON environment variable")
            print("3. Restart your application")
        except Exception as e:
            print(f"❌ Failed to save fixed JSON: {e}")
    
    # Test basic JSON parsing
    try:
        data = json.loads(fixed_json or service_account_json)
        print(f"\n📧 Service Account Email: {data.get('client_email', 'Not found')}")
        print(f"🆔 Project ID: {data.get('project_id', 'Not found')}")
        print(f"🔑 Private Key ID: {data.get('private_key_id', 'Not found')[:20]}...")
        
        # Check private key format
        private_key = data.get('private_key', '')
        if private_key:
            lines = private_key.split('\n')
            print(f"🔐 Private Key Lines: {len(lines)}")
            if len(lines) < 5:
                print("⚠️ Private key has very few lines - this might cause issues")
        
    except Exception as e:
        print(f"❌ Error parsing JSON: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Next Steps:")
    print("1. If you see any warnings above, regenerate your service account key")
    print("2. Make sure the service account has Google Drive API access")
    print("3. Verify the service account has access to your Drive folder")
    print("4. Check that your system clock is synchronized")

if __name__ == "__main__":
    main()
