-- Private per-user photograph access for Google-authenticated sessions.
create policy "nutridex_owner_photo_select" on storage.objects for select to authenticated using (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "nutridex_owner_photo_insert" on storage.objects for insert to authenticated with check (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "nutridex_owner_photo_update" on storage.objects for update to authenticated using (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "nutridex_owner_photo_delete" on storage.objects for delete to authenticated using (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "audit_logs_owner_insert" on public.audit_logs for insert to authenticated with check (actor_id = (select auth.uid()));
