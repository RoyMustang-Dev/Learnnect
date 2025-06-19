#!/usr/bin/env python3
"""
Deploy Learnnect Storage with Service Account Fix
This script helps deploy the storage service with proper service account formatting
"""

import os
import json
import sys

def fix_and_validate_service_account():
    """Fix and validate service account JSON"""
    print("🔧 Fixing and validating service account...")
    
    service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    if not service_account_json:
        print("❌ GOOGLE_SERVICE_ACCOUNT_JSON environment variable not found")
        return False
    
    try:
        # Parse JSON
        data = json.loads(service_account_json)
        
        # Fix private key formatting
        if 'private_key' in data:
            private_key = data['private_key']
            if '\\n' in private_key and '\n' not in private_key:
                print("🔧 Fixing private key formatting...")
                data['private_key'] = private_key.replace('\\n', '\n')
                
                # Update environment variable
                fixed_json = json.dumps(data)
                os.environ['GOOGLE_SERVICE_ACCOUNT_JSON'] = fixed_json
                print("✅ Private key formatting fixed")
        
        # Validate required fields
        required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        
        print(f"✅ Service account valid: {data.get('client_email')}")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_environment():
    """Check required environment variables"""
    print("🔍 Checking environment variables...")
    
    required_vars = [
        'GOOGLE_SERVICE_ACCOUNT_JSON',
        'LEARNNECT_DRIVE_FOLDER_ID'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {missing_vars}")
        return False
    
    print("✅ All required environment variables present")
    return True

def main():
    print("🚀 Learnnect Storage Deployment with Fix")
    print("=" * 50)
    
    # Check environment
    if not check_environment():
        print("\n❌ Environment check failed")
        sys.exit(1)
    
    # Fix service account
    if not fix_and_validate_service_account():
        print("\n❌ Service account validation failed")
        sys.exit(1)
    
    print("\n✅ Pre-deployment checks passed")
    print("🚀 Starting storage service...")
    
    # Import and start the service
    try:
        from learnnect_storage_api import app
        import uvicorn
        
        port = int(os.getenv('PORT', 8001))
        host = os.getenv('HOST', '0.0.0.0')
        
        print(f"🌐 Starting server on {host}:{port}")
        uvicorn.run(app, host=host, port=port)
        
    except Exception as e:
        print(f"❌ Failed to start service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
