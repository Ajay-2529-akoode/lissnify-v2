#!/usr/bin/env python3
"""
Test script to verify manage.py can be found and executed
"""

import os
import sys
import subprocess

def test_manage_py():
    """Test if manage.py can be found and executed"""
    
    # Check if we're in the right directory
    current_dir = os.getcwd()
    print(f"Current directory: {current_dir}")
    
    # Check if manage.py exists
    manage_py_path = os.path.join(current_dir, "lissnify", "manage.py")
    if os.path.exists(manage_py_path):
        print("✅ manage.py found at:", manage_py_path)
    else:
        print("❌ manage.py not found at:", manage_py_path)
        return False
    
    # Try to run a simple Django command
    try:
        os.chdir(os.path.join(current_dir, "lissnify"))
        result = subprocess.run([sys.executable, "manage.py", "check", "--deploy"], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ Django check passed")
            return True
        else:
            print("❌ Django check failed:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running manage.py: {e}")
        return False

if __name__ == "__main__":
    success = test_manage_py()
    sys.exit(0 if success else 1)
