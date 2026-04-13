-- Allow users to insert their own payment records
CREATE POLICY "Users can create own payment"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());