-- Add quantity column to reservations
ALTER TABLE public.reservations ADD COLUMN quantity integer NOT NULL DEFAULT 1;

-- Update the reservation trigger to handle quantity
CREATE OR REPLACE FUNCTION public.handle_new_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.products
  SET quantity_reserved = quantity_reserved + NEW.quantity
  WHERE id = NEW.product_id
    AND quantity_reserved + NEW.quantity <= quantity_total;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product is no longer available for reservation';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update delete trigger to handle quantity
CREATE OR REPLACE FUNCTION public.handle_delete_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.products
  SET quantity_reserved = GREATEST(quantity_reserved - OLD.quantity, 0)
  WHERE id = OLD.product_id;
  
  RETURN OLD;
END;
$$;

-- Recreate triggers (in case they don't exist)
DROP TRIGGER IF EXISTS on_reservation_created ON public.reservations;
CREATE TRIGGER on_reservation_created
  BEFORE INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_reservation();

DROP TRIGGER IF EXISTS on_reservation_deleted ON public.reservations;
CREATE TRIGGER on_reservation_deleted
  BEFORE DELETE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_delete_reservation();