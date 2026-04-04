from dataclasses import dataclass
from datetime import datetime
import rich
from sqlmodel import create_engine, Session, select
import os
from dotenv import load_dotenv

from models import Company, Notification

# --- LOAD ENV VARIABLES ---
load_dotenv()

# --- DATABASE CONNECTION STRING ---
NEON_DB_CONNECTION = os.getenv("NEON_DB_CONNECTION")
engine  = create_engine(NEON_DB_CONNECTION)

def serialize_notification(notification) -> dict:
    """Convert notification to JSON-serializable format."""
    data = notification.model_dump()
    # Convert datetime to ISO format string
    if isinstance(data.get('created_at'), datetime):
        data['created_at'] = data['created_at'].isoformat()
    return data

@dataclass
class NotificationService:
    def create_notification(self) -> dict:
        """Create a new notification for campaigns that reached 90% of their budget."""
        try:
            with Session(engine) as session:
                campaigns = session.exec(
                    select(Company).where(Company.deleted_at == None)
                ).all()

                created_notifications = []
                for campaign in campaigns:
                    if campaign.budget and campaign.spend >= campaign.budget * 0.9:
                        message = (
                            f"Company '{campaign.client_name}' has reached 90% of its budget: "
                            f"{campaign.spend}/{campaign.budget}"
                        )
                        existing = session.exec(
                            select(Notification).where(
                                Notification.company_id == campaign.id,
                                Notification.message == message,
                            )
                        ).first()
                        if existing:
                            continue

                        notification = Notification(
                            company_id=campaign.id,
                            message=message,
                        )
                        session.add(notification)
                        session.commit()
                        session.refresh(notification)
                        created_notifications.append(serialize_notification(notification))

                if created_notifications:
                    return {
                        "status": "success",
                        "message": "Notifications created for campaigns at 90% budget.",
                        "notifications": created_notifications
                    }

                return {
                    "status": "success",
                    "message": "No campaign has reached 90% of its budget yet.",
                    "notifications": []
                }
        except Exception as e:
            rich.print(f"Error during notification creation: {e}")
            return {"status": "error", "message": "An error occurred during notification creation", "notifications": []}
        
    def get_notifications(self) -> list:
        """Retrieve all notifications."""
        try:
            with Session(engine) as session:
                statement = select(Notification)
                notifications = session.exec(statement).all()
                return [serialize_notification(notification) for notification in notifications]
        except Exception as e:
            rich.print(f"Error retrieving notifications: {e}")
            return []
    
    def unread_notification(self, notification_id: int) -> dict:
        """Mark a notification as read."""
        try:
            with Session(engine) as session:
                statement = select(Notification).where(Notification.id == notification_id)
                notification = session.exec(statement).first()
                if notification:
                    notification.read = True
                    session.add(notification)
                    session.commit()
                    return {"status": "success", "message": "Notification marked as read"}
                else:
                    return {"status": "error", "message": "Notification not found"}
        except Exception as e:
            rich.print(f"Error marking notification as read: {e}")
            return {"status": "error", "message": "An error occurred while marking the notification as read"}
        
