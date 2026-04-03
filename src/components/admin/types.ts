export type Reservation = {
  id: string;
  product_id: string;
  guest_name: string;
  guest_whatsapp: string;
  guest_email: string;
  message: string | null;
  quantity: number;
  created_at: string;
  products: { name: string } | null;
};
