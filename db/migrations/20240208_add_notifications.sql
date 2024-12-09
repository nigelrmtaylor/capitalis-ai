-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Add function to notify on new notification
CREATE OR REPLACE FUNCTION notify_new_notification()
RETURNS trigger AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        -- User-specific notification
        PERFORM pg_notify(
            'user_notification',
            json_build_object(
                'userId', NEW.user_id,
                'notification', row_to_json(NEW)
            )::text
        );
    ELSE
        -- Broadcast notification
        PERFORM pg_notify(
            'broadcast_notification',
            json_build_object(
                'notification', row_to_json(NEW)
            )::text
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
DROP TRIGGER IF EXISTS notify_new_notification_trigger ON public.notifications;
CREATE TRIGGER notify_new_notification_trigger
    AFTER INSERT ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_notification();

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select ON public.notifications
    FOR SELECT
    USING (
        user_id IS NULL OR  -- Allow reading broadcast notifications
        user_id = auth.uid()  -- Allow reading own notifications
    );

-- Function to create a new notification
CREATE OR REPLACE FUNCTION create_notification(
    p_title TEXT,
    p_message TEXT,
    p_type TEXT,
    p_user_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS public.notifications AS $$
DECLARE
    v_notification public.notifications;
BEGIN
    INSERT INTO public.notifications (
        title,
        message,
        type,
        user_id,
        metadata
    ) VALUES (
        p_title,
        p_message,
        p_type,
        p_user_id,
        p_metadata
    )
    RETURNING * INTO v_notification;
    
    RETURN v_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
