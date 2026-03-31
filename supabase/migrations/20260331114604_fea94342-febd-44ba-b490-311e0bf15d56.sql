
-- Create categories enum
CREATE TYPE public.product_category AS ENUM (
  'farmacia_cuidados',
  'roupas',
  'quarto_passeio',
  'amamentacao',
  'banho'
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category product_category NOT NULL,
  quantity_total INTEGER NOT NULL DEFAULT 1,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  purchase_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_whatsapp TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Products: everyone can read
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Products: only authenticated users (admin) can insert/update/delete
CREATE POLICY "Admin can manage products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Reservations: anyone can insert (guests making reservations)
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT WITH CHECK (true);

-- Reservations: anyone can read (to show reserved status)
CREATE POLICY "Anyone can view reservations" ON public.reservations FOR SELECT USING (true);

-- Reservations: only authenticated users (admin) can delete
CREATE POLICY "Admin can delete reservations" ON public.reservations FOR DELETE TO authenticated USING (true);

-- Function to increment quantity_reserved when a reservation is made
CREATE OR REPLACE FUNCTION public.handle_new_reservation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET quantity_reserved = quantity_reserved + 1
  WHERE id = NEW.product_id
    AND quantity_reserved < quantity_total;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product is no longer available for reservation';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to decrement quantity_reserved when a reservation is deleted
CREATE OR REPLACE FUNCTION public.handle_delete_reservation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET quantity_reserved = quantity_reserved - 1
  WHERE id = OLD.product_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers
CREATE TRIGGER on_reservation_created
  BEFORE INSERT ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_reservation();

CREATE TRIGGER on_reservation_deleted
  AFTER DELETE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.handle_delete_reservation();
