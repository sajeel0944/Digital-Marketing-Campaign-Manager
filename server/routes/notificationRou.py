import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from notification import NotificationService
from fastapi import WebSocket
from typing import List

# --- 1. Notification Routes and WebSocket Management ---

Router_Notification = APIRouter(prefix="/api/notifications")
notif_service = NotificationService()

# --- WebSocket Connection Manager ---

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Agar koi connection break ho jaye toh remove kar dein
                self.active_connections.remove(connection)

# Isay instantiate karein taake ye "defined" ho jaye
manager = ConnectionManager()

# --- BACKGROUND TASK ---
# Ye loop har 30 seconds baad chalega aur budget check karega
async def check_budget_and_notify():
    while True:
        try:
            # Service call kar ke check karo 90% budget
            res = notif_service.create_notification()
            
            if res.get("status") == "success" and "notifications" in res:
                # Agar naye notifications mile, to sabko real-time bhejo
                await manager.broadcast({
                    "type": "NEW_NOTIFICATIONS",
                    "data": res["notifications"]
                })
        except Exception as e:
            print(f"Background Task Error: {e}")
         
        await asyncio.sleep(30) # 30 seconds ka gap

# --- WEBSOCKET ENDPOINT ---
@Router_Notification.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for notifications
    """
    try:
        # ✅ Accept the connection
        await manager.connect(websocket)
        print(f"✅ WebSocket connected")
       
        # 1. Initial notifications bhej do
        try:
            initial_notifs = notif_service.get_notifications()
            print(f"📊 Initial notifications: {initial_notifs}")
            
            try:
                await websocket.send_json({
                    "type": "INITIAL_DATA",
                    "data": initial_notifs
                })
                print(f"✅ Initial data sent to client")
            except Exception as send_error:
                print(f"❌ Error sending initial data: {type(send_error).__name__}: {send_error}")
                manager.disconnect(websocket)
                return
        except Exception as e:
            print(f"❌ Error retrieving notifications: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            manager.disconnect(websocket)
            return

        while True:
            # 2. Client se message receive karein (e.g., Mark as Read)
            data = await websocket.receive_json()
            print(f"📨 Received from client: {data}")
            
            if data.get("action") == "mark_read":
                notif_id = data.get("id")
                res = notif_service.unread_notification(notif_id)
                print(f"✅ Notification {notif_id} marked as read: {res}")
                
                # Wapas confirm karein ke read ho gaya
                await websocket.send_json({
                    "type": "READ_CONFIRMATION",
                    "status": res["status"],
                    "id": notif_id
                })

    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"❌ WebSocket error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        try:
            manager.disconnect(websocket)
        except:
            pass