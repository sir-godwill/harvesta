-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type public.notification_type,
  p_title TEXT,
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    action_url,
    metadata
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_action_url,
    p_metadata
  ) RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Trigger for Order Status Changes
CREATE OR REPLACE FUNCTION public.on_order_status_change_notify()
RETURNS TRIGGER AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    v_title := CASE 
      WHEN NEW.status = 'pending' THEN 'Order Placed'
      WHEN NEW.status = 'confirmed' THEN 'Order Confirmed'
      WHEN NEW.status = 'processing' THEN 'Order Processing'
      WHEN NEW.status = 'shipped' THEN 'Order Shipped'
      WHEN NEW.status = 'delivered' THEN 'Order Delivered'
      WHEN NEW.status = 'cancelled' THEN 'Order Cancelled'
      ELSE 'Order Update'
    END;

    v_message := CASE 
      WHEN NEW.status = 'pending' THEN 'Your order ' || NEW.order_number || ' has been placed and is awaiting payment.'
      WHEN NEW.status = 'confirmed' THEN 'Payment confirmed! Your order ' || NEW.order_number || ' is now confirmed.'
      WHEN NEW.status = 'processing' THEN 'The supplier is preparing your items for ' || NEW.order_number || '.'
      WHEN NEW.status = 'shipped' THEN 'Great news! Your order ' || NEW.order_number || ' is on its way.'
      WHEN NEW.status = 'delivered' THEN 'Your order ' || NEW.order_number || ' has been delivered. please confirm receipt.'
      WHEN NEW.status = 'cancelled' THEN 'Your order ' || NEW.order_number || ' has been cancelled.'
      ELSE 'Your order ' || NEW.order_number || ' status is now ' || NEW.status || '.'
    END;

    PERFORM public.create_notification(
      NEW.user_id,
      'order',
      v_title,
      v_message,
      '/orders/' || NEW.id,
      jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_order_status_notify
AFTER INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.on_order_status_change_notify();

-- 2. Trigger for New Messages
CREATE OR REPLACE FUNCTION public.on_new_message_notify()
RETURNS TRIGGER AS $$
DECLARE
  v_participant_id UUID;
BEGIN
  -- Notify all participants except the sender
  FOR v_participant_id IN 
    SELECT user_id FROM public.conversation_participants 
    WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id
  LOOP
    PERFORM public.create_notification(
      v_participant_id,
      'message',
      'New Message',
      'You have a new message in your conversation.',
      '/messages?id=' || NEW.conversation_id,
      jsonb_build_object('conversation_id', NEW.conversation_id, 'message_id', NEW.id)
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_new_message_notify
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.on_new_message_notify();

-- 3. Trigger for New RFQ Quotes
CREATE OR REPLACE FUNCTION public.on_new_rfq_quote_notify()
RETURNS TRIGGER AS $$
DECLARE
  v_buyer_id UUID;
  v_rfq_num TEXT;
BEGIN
  -- Get buyer ID and RFQ number from rfq_requests
  SELECT user_id, id::text INTO v_buyer_id, v_rfq_num 
  FROM public.rfq_requests 
  WHERE id = NEW.rfq_request_id;

  IF v_buyer_id IS NOT NULL THEN
    PERFORM public.create_notification(
      v_buyer_id,
      'alert',
      'New RFQ Quote',
      'You received a new quote for your RFQ.',
      '/rfq/' || NEW.rfq_request_id,
      jsonb_build_object('rfq_id', NEW.rfq_request_id, 'quote_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_new_rfq_quote_notify
AFTER INSERT ON public.rfq_quotes
FOR EACH ROW
EXECUTE FUNCTION public.on_new_rfq_quote_notify();
