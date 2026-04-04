import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from auth.auth import AuthService
import rich

# --- 2. Simple Tests ---

def test_signup_process():
    service = AuthService()
    
    # Test 1: Naya user register hona chahiye
    res = service.signup("ali@example.com", "password123")
    rich.print("Signup Response:", res)

def test_login_process():
    service = AuthService()
    res=service.login("ali@example.com", "password123")

    rich.print("Login Response:", res)
    
if __name__ == "__main__":
    test_signup_process()
    test_login_process()
    rich.print("All tests passed!")