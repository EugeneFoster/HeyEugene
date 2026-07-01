-- Add color to tenants for project-centric UI
alter table support_tenants add column if not exists color text default '#3b82f6';

update support_tenants set color = '#f59e0b' where prefix = 'MP';
update support_tenants set color = '#475569' where prefix = 'CST';
