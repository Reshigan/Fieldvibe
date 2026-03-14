-- FieldVibe D1 Seed Data - Full Distribution Company
-- Super admin: admin@demo.com / Admin@2026!

-- Tenant
INSERT OR IGNORE INTO tenants (id, name, code, domain, status, subscription_plan, max_users, created_at)
VALUES ('default-tenant-001', 'Demo Company', 'DEMO', 'demo.fieldvibe.com', 'active', 'enterprise', 100, datetime('now'));

-- ==================== USERS ====================
INSERT OR IGNORE INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, role, status, is_active, created_at)
VALUES ('super-admin-001', 'default-tenant-001', 'admin@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Super', 'Admin', '+27100000001', 'super_admin', 'active', 1, datetime('now'));

INSERT OR IGNORE INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, role, status, is_active, created_at)
VALUES
  ('manager-001', 'default-tenant-001', 'sarah.m@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Sarah', 'Mbeki', '+27100000010', 'manager', 'active', 1, datetime('now')),
  ('manager-002', 'default-tenant-001', 'david.n@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'David', 'Naidoo', '+27100000011', 'manager', 'active', 1, datetime('now'));

INSERT OR IGNORE INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, role, status, is_active, manager_id, created_at)
VALUES
  ('agent-001', 'default-tenant-001', 'thabo.m@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Thabo', 'Mokoena', '+27100000020', 'agent', 'active', 1, 'manager-001', datetime('now')),
  ('agent-002', 'default-tenant-001', 'sipho.d@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Sipho', 'Dlamini', '+27100000021', 'agent', 'active', 1, 'manager-001', datetime('now')),
  ('agent-003', 'default-tenant-001', 'lerato.k@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Lerato', 'Khumalo', '+27100000022', 'agent', 'active', 1, 'manager-002', datetime('now')),
  ('agent-004', 'default-tenant-001', 'nomsa.z@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Nomsa', 'Zulu', '+27100000023', 'agent', 'active', 1, 'manager-002', datetime('now')),
  ('agent-005', 'default-tenant-001', 'johan.v@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Johan', 'Van Wyk', '+27100000024', 'agent', 'active', 1, 'manager-001', datetime('now'));

INSERT OR IGNORE INTO users (id, tenant_id, email, password_hash, first_name, last_name, phone, role, status, is_active, created_at)
VALUES ('auditor-001', 'default-tenant-001', 'auditor@demo.com', '$2b$10$nhLnxHGmXQiT2rixGT1AXe6gDG8xd79wLc9wOyk/M7gZFVt0W0vvC', 'Priya', 'Govender', '+27100000030', 'auditor', 'active', 1, datetime('now'));

-- ==================== REGIONS / AREAS / ROUTES ====================
INSERT OR IGNORE INTO regions (id, tenant_id, name, code, status, created_at)
VALUES
  ('region-001', 'default-tenant-001', 'Gauteng', 'GP', 'active', datetime('now')),
  ('region-002', 'default-tenant-001', 'Western Cape', 'WC', 'active', datetime('now')),
  ('region-003', 'default-tenant-001', 'KwaZulu-Natal', 'KZN', 'active', datetime('now'));

INSERT OR IGNORE INTO areas (id, tenant_id, region_id, name, code, status, created_at)
VALUES
  ('area-001', 'default-tenant-001', 'region-001', 'Johannesburg CBD', 'JHB', 'active', datetime('now')),
  ('area-002', 'default-tenant-001', 'region-001', 'Sandton', 'SDT', 'active', datetime('now')),
  ('area-003', 'default-tenant-001', 'region-001', 'Soweto', 'SWT', 'active', datetime('now')),
  ('area-004', 'default-tenant-001', 'region-002', 'Cape Town CBD', 'CPT', 'active', datetime('now')),
  ('area-005', 'default-tenant-001', 'region-003', 'Durban Central', 'DBN', 'active', datetime('now'));

INSERT OR IGNORE INTO routes (id, tenant_id, area_id, name, code, salesman_id, status, created_at)
VALUES
  ('route-001', 'default-tenant-001', 'area-001', 'JHB Inner City', 'JIC', 'agent-001', 'active', datetime('now')),
  ('route-002', 'default-tenant-001', 'area-001', 'JHB East', 'JE', 'agent-002', 'active', datetime('now')),
  ('route-003', 'default-tenant-001', 'area-002', 'Sandton Main', 'SM', 'agent-003', 'active', datetime('now')),
  ('route-004', 'default-tenant-001', 'area-003', 'Soweto North', 'SN', 'agent-004', 'active', datetime('now')),
  ('route-005', 'default-tenant-001', 'area-004', 'Cape Town CBD', 'CC', 'agent-005', 'active', datetime('now')),
  ('route-006', 'default-tenant-001', 'area-005', 'Durban Central', 'DC', 'agent-001', 'active', datetime('now'));

-- ==================== TERRITORIES ====================
INSERT OR IGNORE INTO territories (id, tenant_id, name, code, boundary, manager_id, status, created_at)
VALUES
  ('terr-001', 'default-tenant-001', 'Gauteng North', 'GN', '{"type":"polygon","coordinates":[[-26.0,27.8],[-26.0,28.3],[-26.3,28.3],[-26.3,27.8]]}', 'manager-001', 'active', datetime('now')),
  ('terr-002', 'default-tenant-001', 'Gauteng South', 'GS', '{"type":"polygon","coordinates":[[-26.3,27.8],[-26.3,28.3],[-26.6,28.3],[-26.6,27.8]]}', 'manager-002', 'active', datetime('now')),
  ('terr-003', 'default-tenant-001', 'Western Cape', 'WC', '{"type":"polygon","coordinates":[[-33.8,18.3],[-33.8,18.7],[-34.1,18.7],[-34.1,18.3]]}', 'manager-001', 'active', datetime('now'));

INSERT OR IGNORE INTO territory_assignments (id, territory_id, agent_id, is_primary, assigned_at)
VALUES
  ('ta-001', 'terr-001', 'agent-001', 1, datetime('now')),
  ('ta-002', 'terr-001', 'agent-002', 0, datetime('now')),
  ('ta-003', 'terr-002', 'agent-003', 1, datetime('now')),
  ('ta-004', 'terr-002', 'agent-004', 0, datetime('now')),
  ('ta-005', 'terr-003', 'agent-005', 1, datetime('now'));

-- ==================== BRANDS / CATEGORIES / PRODUCTS ====================
INSERT OR IGNORE INTO brands (id, tenant_id, name, code, description, status, created_at)
VALUES
  ('brand-001', 'default-tenant-001', 'FieldVibe Premium', 'FVP', 'Premium quality products', 'active', datetime('now')),
  ('brand-002', 'default-tenant-001', 'Fresh Choice', 'FC', 'Fresh and healthy options', 'active', datetime('now')),
  ('brand-003', 'default-tenant-001', 'Value Plus', 'VP', 'Great value products', 'active', datetime('now')),
  ('brand-004', 'default-tenant-001', 'Township Treats', 'TT', 'Local favorites', 'active', datetime('now'));

INSERT OR IGNORE INTO categories (id, tenant_id, brand_id, name, code, description, status, created_at)
VALUES
  ('cat-001', 'default-tenant-001', 'brand-001', 'Beverages', 'BEV', 'Drinks and refreshments', 'active', datetime('now')),
  ('cat-002', 'default-tenant-001', 'brand-002', 'Dairy', 'DAI', 'Dairy products', 'active', datetime('now')),
  ('cat-003', 'default-tenant-001', 'brand-003', 'Snacks', 'SNK', 'Chips and snacks', 'active', datetime('now')),
  ('cat-004', 'default-tenant-001', 'brand-004', 'Confectionery', 'CON', 'Sweets and chocolates', 'active', datetime('now')),
  ('cat-005', 'default-tenant-001', 'brand-001', 'Frozen', 'FRZ', 'Frozen products', 'active', datetime('now')),
  ('cat-006', 'default-tenant-001', 'brand-002', 'Bakery', 'BAK', 'Bread and baked goods', 'active', datetime('now'));

INSERT OR IGNORE INTO products (id, tenant_id, name, code, sku, category_id, brand_id, unit_of_measure, price, cost_price, tax_rate, status, created_at)
VALUES
  ('prod-001', 'default-tenant-001', 'Cola 500ml', 'COLA500', 'SKU-001', 'cat-001', 'brand-001', 'bottle', 15.00, 8.50, 15, 'active', datetime('now')),
  ('prod-002', 'default-tenant-001', 'Orange Juice 1L', 'OJ1L', 'SKU-002', 'cat-001', 'brand-001', 'bottle', 25.00, 14.50, 15, 'active', datetime('now')),
  ('prod-003', 'default-tenant-001', 'Sparkling Water 750ml', 'SW750', 'SKU-003', 'cat-001', 'brand-001', 'bottle', 12.00, 6.00, 15, 'active', datetime('now')),
  ('prod-004', 'default-tenant-001', 'Energy Drink 250ml', 'ED250', 'SKU-004', 'cat-001', 'brand-001', 'can', 22.00, 12.00, 15, 'active', datetime('now')),
  ('prod-005', 'default-tenant-001', 'Full Cream Milk 1L', 'FCM1L', 'SKU-005', 'cat-002', 'brand-002', 'carton', 20.00, 12.00, 0, 'active', datetime('now')),
  ('prod-006', 'default-tenant-001', 'Low Fat Milk 1L', 'LFM1L', 'SKU-006', 'cat-002', 'brand-002', 'carton', 22.00, 13.00, 0, 'active', datetime('now')),
  ('prod-007', 'default-tenant-001', 'Yoghurt 500g', 'YOG500', 'SKU-007', 'cat-002', 'brand-002', 'tub', 18.00, 10.00, 0, 'active', datetime('now')),
  ('prod-008', 'default-tenant-001', 'Cheddar Cheese 400g', 'CHD400', 'SKU-008', 'cat-002', 'brand-002', 'block', 65.00, 38.00, 0, 'active', datetime('now')),
  ('prod-009', 'default-tenant-001', 'Potato Chips 150g', 'PC150', 'SKU-009', 'cat-003', 'brand-003', 'pack', 18.00, 10.00, 15, 'active', datetime('now')),
  ('prod-010', 'default-tenant-001', 'Corn Chips 200g', 'CC200', 'SKU-010', 'cat-003', 'brand-003', 'pack', 22.00, 12.00, 15, 'active', datetime('now')),
  ('prod-011', 'default-tenant-001', 'Pretzels 100g', 'PRZ100', 'SKU-011', 'cat-003', 'brand-003', 'pack', 15.00, 8.00, 15, 'active', datetime('now')),
  ('prod-012', 'default-tenant-001', 'Chocolate Bar 80g', 'CHB80', 'SKU-012', 'cat-004', 'brand-004', 'bar', 25.00, 14.00, 15, 'active', datetime('now')),
  ('prod-013', 'default-tenant-001', 'Gummy Bears 200g', 'GB200', 'SKU-013', 'cat-004', 'brand-004', 'pack', 20.00, 11.00, 15, 'active', datetime('now')),
  ('prod-014', 'default-tenant-001', 'Lollipops 10pk', 'LP10', 'SKU-014', 'cat-004', 'brand-004', 'pack', 12.00, 6.00, 15, 'active', datetime('now')),
  ('prod-015', 'default-tenant-001', 'Frozen Peas 1kg', 'FP1K', 'SKU-015', 'cat-005', 'brand-001', 'bag', 35.00, 20.00, 0, 'active', datetime('now')),
  ('prod-016', 'default-tenant-001', 'Fish Fingers 400g', 'FF400', 'SKU-016', 'cat-005', 'brand-001', 'box', 55.00, 32.00, 0, 'active', datetime('now')),
  ('prod-017', 'default-tenant-001', 'Ice Cream 2L', 'IC2L', 'SKU-017', 'cat-005', 'brand-001', 'tub', 65.00, 38.00, 15, 'active', datetime('now')),
  ('prod-018', 'default-tenant-001', 'White Bread 700g', 'WB700', 'SKU-018', 'cat-006', 'brand-002', 'loaf', 16.00, 9.00, 0, 'active', datetime('now')),
  ('prod-019', 'default-tenant-001', 'Brown Bread 700g', 'BB700', 'SKU-019', 'cat-006', 'brand-002', 'loaf', 18.00, 10.00, 0, 'active', datetime('now')),
  ('prod-020', 'default-tenant-001', 'Muffins 6pk', 'MF6', 'SKU-020', 'cat-006', 'brand-002', 'pack', 32.00, 18.00, 0, 'active', datetime('now')),
  ('prod-021', 'default-tenant-001', 'Apple Juice 2L', 'AJ2L', 'SKU-021', 'cat-001', 'brand-001', 'bottle', 38.00, 22.00, 15, 'active', datetime('now')),
  ('prod-022', 'default-tenant-001', 'Mineral Water 5L', 'MW5L', 'SKU-022', 'cat-001', 'brand-001', 'bottle', 28.00, 15.00, 15, 'active', datetime('now')),
  ('prod-023', 'default-tenant-001', 'Butter 500g', 'BTR500', 'SKU-023', 'cat-002', 'brand-002', 'tub', 55.00, 32.00, 0, 'active', datetime('now')),
  ('prod-024', 'default-tenant-001', 'Peanut Butter 400g', 'PB400', 'SKU-024', 'cat-003', 'brand-003', 'jar', 42.00, 24.00, 0, 'active', datetime('now')),
  ('prod-025', 'default-tenant-001', 'Biscuits 200g', 'BSC200', 'SKU-025', 'cat-004', 'brand-004', 'pack', 28.00, 16.00, 15, 'active', datetime('now'));

-- ==================== WAREHOUSES + STOCK ====================
INSERT OR IGNORE INTO warehouses (id, tenant_id, name, code, type, address, status, created_at)
VALUES
  ('wh-001', 'default-tenant-001', 'Main Warehouse Johannesburg', 'WH-JHB', 'main', '123 Industrial Ave, Johannesburg', 'active', datetime('now')),
  ('wh-002', 'default-tenant-001', 'Distribution Center Sandton', 'WH-SDT', 'distribution', '456 Logistics Blvd, Sandton', 'active', datetime('now')),
  ('wh-003', 'default-tenant-001', 'Cape Town Depot', 'WH-CPT', 'distribution', '789 Harbour Rd, Cape Town', 'active', datetime('now'));

INSERT OR IGNORE INTO stock_levels (id, tenant_id, warehouse_id, product_id, quantity, reserved_quantity, reorder_level, created_at)
VALUES
  ('sl-001', 'default-tenant-001', 'wh-001', 'prod-001', 2500, 50, 200, datetime('now')),
  ('sl-002', 'default-tenant-001', 'wh-001', 'prod-002', 1200, 20, 100, datetime('now')),
  ('sl-003', 'default-tenant-001', 'wh-001', 'prod-003', 1800, 30, 150, datetime('now')),
  ('sl-004', 'default-tenant-001', 'wh-001', 'prod-004', 900, 15, 80, datetime('now')),
  ('sl-005', 'default-tenant-001', 'wh-001', 'prod-005', 800, 10, 60, datetime('now')),
  ('sl-006', 'default-tenant-001', 'wh-001', 'prod-006', 700, 10, 50, datetime('now')),
  ('sl-007', 'default-tenant-001', 'wh-001', 'prod-007', 500, 5, 40, datetime('now')),
  ('sl-008', 'default-tenant-001', 'wh-001', 'prod-008', 300, 5, 30, datetime('now')),
  ('sl-009', 'default-tenant-001', 'wh-001', 'prod-009', 2000, 40, 150, datetime('now')),
  ('sl-010', 'default-tenant-001', 'wh-001', 'prod-010', 1500, 25, 120, datetime('now')),
  ('sl-011', 'default-tenant-001', 'wh-001', 'prod-011', 1000, 15, 80, datetime('now')),
  ('sl-012', 'default-tenant-001', 'wh-001', 'prod-012', 3000, 60, 200, datetime('now')),
  ('sl-013', 'default-tenant-001', 'wh-001', 'prod-013', 1800, 30, 120, datetime('now')),
  ('sl-014', 'default-tenant-001', 'wh-001', 'prod-014', 2500, 50, 180, datetime('now')),
  ('sl-015', 'default-tenant-001', 'wh-001', 'prod-015', 400, 5, 30, datetime('now')),
  ('sl-016', 'default-tenant-001', 'wh-001', 'prod-016', 350, 5, 25, datetime('now')),
  ('sl-017', 'default-tenant-001', 'wh-001', 'prod-017', 250, 5, 20, datetime('now')),
  ('sl-018', 'default-tenant-001', 'wh-001', 'prod-018', 1500, 30, 100, datetime('now')),
  ('sl-019', 'default-tenant-001', 'wh-001', 'prod-019', 1200, 25, 80, datetime('now')),
  ('sl-020', 'default-tenant-001', 'wh-001', 'prod-020', 600, 10, 50, datetime('now')),
  ('sl-021', 'default-tenant-001', 'wh-001', 'prod-021', 800, 15, 60, datetime('now')),
  ('sl-022', 'default-tenant-001', 'wh-001', 'prod-022', 500, 10, 40, datetime('now')),
  ('sl-023', 'default-tenant-001', 'wh-001', 'prod-023', 400, 5, 30, datetime('now')),
  ('sl-024', 'default-tenant-001', 'wh-001', 'prod-024', 700, 10, 50, datetime('now')),
  ('sl-025', 'default-tenant-001', 'wh-001', 'prod-025', 900, 15, 70, datetime('now')),
  ('sl-026', 'default-tenant-001', 'wh-002', 'prod-001', 800, 20, 100, datetime('now')),
  ('sl-027', 'default-tenant-001', 'wh-002', 'prod-009', 600, 15, 80, datetime('now')),
  ('sl-028', 'default-tenant-001', 'wh-002', 'prod-012', 1000, 25, 120, datetime('now')),
  ('sl-029', 'default-tenant-001', 'wh-003', 'prod-001', 500, 10, 60, datetime('now')),
  ('sl-030', 'default-tenant-001', 'wh-003', 'prod-005', 300, 5, 30, datetime('now'));

-- ==================== 52 CUSTOMERS ====================
INSERT OR IGNORE INTO customers (id, tenant_id, name, code, type, customer_type, phone, email, address, latitude, longitude, route_id, credit_limit, outstanding_balance, payment_terms, category, status, created_at)
VALUES
  ('cust-001', 'default-tenant-001', 'Shoprite Braamfontein', 'SHB01', 'retail', 'CHAIN', '+27110001001', 'braam@shoprite.co.za', '100 Juta St, Braamfontein', -26.1950, 28.0334, 'route-001', 50000, 12500, 30, 'A', 'active', datetime('now')),
  ('cust-002', 'default-tenant-001', 'Pick n Pay Newtown', 'PNP01', 'retail', 'CHAIN', '+27110001002', 'newtown@pnp.co.za', '200 Market St, Newtown', -26.2010, 28.0310, 'route-001', 45000, 8750, 30, 'A', 'active', datetime('now')),
  ('cust-003', 'default-tenant-001', 'Spar Hillbrow', 'SPH01', 'retail', 'CHAIN', '+27110001003', 'hillbrow@spar.co.za', '50 Kotze St, Hillbrow', -26.1880, 28.0480, 'route-001', 35000, 5200, 30, 'A', 'active', datetime('now')),
  ('cust-004', 'default-tenant-001', 'Checkers Fordsburg', 'CKF01', 'retail', 'CHAIN', '+27110001004', 'ford@checkers.co.za', '15 Central Rd, Fordsburg', -26.2030, 28.0210, 'route-001', 40000, 3100, 30, 'A', 'active', datetime('now')),
  ('cust-005', 'default-tenant-001', 'Mini Mart Yeoville', 'MMY01', 'retail', 'SHOP', '+27110001005', 'mm@yeoville.co.za', '88 Rockey St, Yeoville', -26.1790, 28.0650, 'route-002', 8000, 1200, 15, 'B', 'active', datetime('now')),
  ('cust-006', 'default-tenant-001', 'Kwik Save Berea', 'KSB01', 'retail', 'SHOP', '+27110001006', 'ks@berea.co.za', '45 Olivia Rd, Berea', -26.1850, 28.0550, 'route-002', 6000, 800, 15, 'B', 'active', datetime('now')),
  ('cust-007', 'default-tenant-001', 'Fresh Corner Troyeville', 'FCT01', 'retail', 'SHOP', '+27110001007', 'fc@troy.co.za', '12 Bezuidenhout St, Troyeville', -26.1920, 28.0620, 'route-002', 5000, 450, 15, 'B', 'active', datetime('now')),
  ('cust-008', 'default-tenant-001', 'OK Foods Jeppestown', 'OKJ01', 'retail', 'SHOP', '+27110001008', 'ok@jeppe.co.za', '90 Main St, Jeppestown', -26.2000, 28.0580, 'route-002', 7000, 2100, 15, 'B', 'active', datetime('now')),
  ('cust-009', 'default-tenant-001', 'Tuckshop Central', 'TSC01', 'retail', 'SPAZA', '+27110001009', 'ts@central.co.za', '5 End St, Doornfontein', -26.1960, 28.0510, 'route-002', 3000, 500, 7, 'C', 'active', datetime('now')),
  ('cust-010', 'default-tenant-001', 'Spaza King Bellevue', 'SKB01', 'retail', 'SPAZA', '+27110001010', 'sk@belle.co.za', '33 Raymond St, Bellevue', -26.1830, 28.0580, 'route-002', 2500, 200, 7, 'C', 'active', datetime('now')),
  ('cust-011', 'default-tenant-001', 'Woolworths Sandton City', 'WSC01', 'retail', 'CHAIN', '+27110001011', 'sandton@woolworths.co.za', 'Sandton City Mall, Sandton', -26.1075, 28.0520, 'route-003', 80000, 22000, 45, 'A', 'active', datetime('now')),
  ('cust-012', 'default-tenant-001', 'Checkers Morningside', 'CKM01', 'retail', 'CHAIN', '+27110001012', 'morning@checkers.co.za', '22 Rivonia Rd, Morningside', -26.1120, 28.0650, 'route-003', 55000, 15500, 30, 'A', 'active', datetime('now')),
  ('cust-013', 'default-tenant-001', 'Food Lovers Sandton', 'FLS01', 'retail', 'CHAIN', '+27110001013', 'sandton@foodlovers.co.za', '50 West St, Sandown', -26.1050, 28.0600, 'route-003', 60000, 18200, 30, 'A', 'active', datetime('now')),
  ('cust-014', 'default-tenant-001', 'Cafe Milano Sandton', 'CMS01', 'retail', 'RESTAURANT', '+27110001014', 'milano@cafe.co.za', '12 5th Ave, Sandton', -26.1090, 28.0560, 'route-003', 15000, 3800, 15, 'B', 'active', datetime('now')),
  ('cust-015', 'default-tenant-001', 'Quick Stop Sandton', 'QSS01', 'retail', 'SHOP', '+27110001015', 'qs@sandton.co.za', '8 Grayston Dr, Sandton', -26.1030, 28.0580, 'route-003', 8000, 1100, 15, 'B', 'active', datetime('now')),
  ('cust-016', 'default-tenant-001', 'Shoprite Soweto', 'SHS01', 'retail', 'CHAIN', '+27110001016', 'soweto@shoprite.co.za', 'Maponya Mall, Soweto', -26.2680, 27.8960, 'route-004', 45000, 9800, 30, 'A', 'active', datetime('now')),
  ('cust-017', 'default-tenant-001', 'Pick n Pay Orlando', 'PNO01', 'retail', 'CHAIN', '+27110001017', 'orlando@pnp.co.za', '55 Khumalo St, Orlando', -26.2380, 27.9050, 'route-004', 35000, 6200, 30, 'A', 'active', datetime('now')),
  ('cust-018', 'default-tenant-001', 'Spaza Express Diepkloof', 'SED01', 'retail', 'SPAZA', '+27110001018', 'se@diep.co.za', '10 Zone 3, Diepkloof', -26.2550, 27.9220, 'route-004', 4000, 800, 7, 'C', 'active', datetime('now')),
  ('cust-019', 'default-tenant-001', 'Mamas Kitchen Meadowlands', 'MKM01', 'retail', 'RESTAURANT', '+27110001019', 'mama@meadow.co.za', '23 Meadowlands Dr', -26.2240, 27.8870, 'route-004', 6000, 1500, 15, 'B', 'active', datetime('now')),
  ('cust-020', 'default-tenant-001', 'Township General Zola', 'TGZ01', 'retail', 'SPAZA', '+27110001020', 'tg@zola.co.za', '45 Zola Rd, Soweto', -26.2450, 27.8650, 'route-004', 3500, 400, 7, 'C', 'active', datetime('now')),
  ('cust-021', 'default-tenant-001', 'Corner Cafe Dobsonville', 'CCD01', 'retail', 'SPAZA', '+27110001021', 'cc@dobs.co.za', '8 Ext 2, Dobsonville', -26.2290, 27.8550, 'route-004', 2500, 300, 7, 'C', 'active', datetime('now')),
  ('cust-022', 'default-tenant-001', 'Woolworths VA', 'WVA01', 'retail', 'CHAIN', '+27210001022', 'va@woolworths.co.za', 'VA Waterfront, Cape Town', -33.9060, 18.4210, 'route-005', 70000, 19500, 45, 'A', 'active', datetime('now')),
  ('cust-023', 'default-tenant-001', 'Spar Sea Point', 'SSP01', 'retail', 'CHAIN', '+27210001023', 'seapoint@spar.co.za', '100 Main Rd, Sea Point', -33.9150, 18.3910, 'route-005', 40000, 8800, 30, 'A', 'active', datetime('now')),
  ('cust-024', 'default-tenant-001', 'Food Lovers Canal Walk', 'FLC01', 'retail', 'CHAIN', '+27210001024', 'canal@foodlovers.co.za', 'Canal Walk Mall, Century City', -33.8940, 18.5120, 'route-005', 55000, 14200, 30, 'A', 'active', datetime('now')),
  ('cust-025', 'default-tenant-001', 'Cape Cafe Observatory', 'CCO01', 'retail', 'RESTAURANT', '+27210001025', 'cape@obs.co.za', '33 Lower Main Rd, Observatory', -33.9370, 18.4710, 'route-005', 10000, 2200, 15, 'B', 'active', datetime('now')),
  ('cust-026', 'default-tenant-001', 'Mini Mart Woodstock', 'MMW01', 'retail', 'SHOP', '+27210001026', 'mm@wood.co.za', '55 Albert Rd, Woodstock', -33.9290, 18.4480, 'route-005', 7000, 950, 15, 'B', 'active', datetime('now')),
  ('cust-027', 'default-tenant-001', 'Fresh Foods Wholesale', 'FFW01', 'wholesale', 'DISTRIBUTOR', '+27110001027', 'ff@wholesale.co.za', '100 City Deep, Johannesburg', -26.2200, 28.0680, 'route-001', 100000, 35000, 45, 'A', 'active', datetime('now')),
  ('cust-028', 'default-tenant-001', 'Metro Cash and Carry', 'MCC01', 'wholesale', 'DISTRIBUTOR', '+27110001028', 'metro@cc.co.za', '200 Industrial Rd, Germiston', -26.2150, 28.1700, 'route-002', 80000, 28000, 45, 'A', 'active', datetime('now')),
  ('cust-029', 'default-tenant-001', 'Kwik Korner Linden', 'KKL01', 'retail', 'SHOP', '+27110001029', 'kk@linden.co.za', '12 4th Ave, Linden', -26.1450, 27.9940, 'route-003', 5000, 600, 15, 'B', 'active', datetime('now')),
  ('cust-030', 'default-tenant-001', 'Deli Express Rosebank', 'DER01', 'retail', 'RESTAURANT', '+27110001030', 'deli@rosebank.co.za', '55 Oxford Rd, Rosebank', -26.1470, 28.0400, 'route-003', 12000, 2800, 15, 'B', 'active', datetime('now')),
  ('cust-031', 'default-tenant-001', 'Spar Greenside', 'SGS01', 'retail', 'CHAIN', '+27110001031', 'green@spar.co.za', '22 Greenway, Greenside', -26.1530, 28.0050, 'route-003', 30000, 7200, 30, 'A', 'active', datetime('now')),
  ('cust-032', 'default-tenant-001', 'Nkosis Tuckshop', 'NTK01', 'retail', 'SPAZA', '+27110001032', 'nk@tuck.co.za', '8 Zone 6, Meadowlands', -26.2200, 27.8800, 'route-004', 2000, 150, 7, 'C', 'active', datetime('now')),
  ('cust-033', 'default-tenant-001', 'Market on Main', 'MOM01', 'retail', 'RESTAURANT', '+27110001033', 'market@main.co.za', '264 Fox St, Maboneng', -26.2020, 28.0560, 'route-001', 18000, 4500, 15, 'B', 'active', datetime('now')),
  ('cust-034', 'default-tenant-001', 'Lucky Star Tuckshop', 'LST01', 'retail', 'SPAZA', '+27110001034', 'lucky@star.co.za', '15 Ext 4, Soweto', -26.2600, 27.8900, 'route-004', 2000, 250, 7, 'C', 'active', datetime('now')),
  ('cust-035', 'default-tenant-001', 'Busy Bee Convenience', 'BBC01', 'retail', 'SHOP', '+27110001035', 'bb@conv.co.za', '90 Louis Botha, Orange Grove', -26.1650, 28.0720, 'route-002', 6000, 1000, 15, 'B', 'active', datetime('now')),
  ('cust-036', 'default-tenant-001', 'Cape Quarter Deli', 'CQD01', 'retail', 'RESTAURANT', '+27210001036', 'cq@deli.co.za', 'Cape Quarter, De Waterkant', -33.9200, 18.4150, 'route-005', 15000, 3500, 15, 'B', 'active', datetime('now')),
  ('cust-037', 'default-tenant-001', 'Checkers Rondebosch', 'CKR01', 'retail', 'CHAIN', '+27210001037', 'ronde@checkers.co.za', 'Main Rd, Rondebosch', -33.9630, 18.4730, 'route-005', 42000, 11500, 30, 'A', 'active', datetime('now')),
  ('cust-038', 'default-tenant-001', 'Spaza World Alexandra', 'SWA01', 'retail', 'SPAZA', '+27110001038', 'sw@alex.co.za', '20 Far East Bank, Alexandra', -26.1100, 28.1000, 'route-002', 2500, 400, 7, 'C', 'active', datetime('now')),
  ('cust-039', 'default-tenant-001', 'Protea Foods Melville', 'PFM01', 'retail', 'SHOP', '+27110001039', 'pf@melville.co.za', '7th St, Melville', -26.1760, 27.9950, 'route-003', 9000, 1800, 15, 'B', 'active', datetime('now')),
  ('cust-040', 'default-tenant-001', 'Sunrise Bakery Brixton', 'SBB01', 'retail', 'SHOP', '+27110001040', 'sb@brixton.co.za', '45 High St, Brixton', -26.1820, 28.0050, 'route-003', 4000, 500, 7, 'C', 'active', datetime('now')),
  ('cust-041', 'default-tenant-001', 'Gateway Foods Kensington', 'GFK01', 'retail', 'SHOP', '+27110001041', 'gf@kens.co.za', '12 Roberts Ave, Kensington', -26.1890, 28.0900, 'route-002', 5500, 700, 15, 'B', 'active', datetime('now')),
  ('cust-042', 'default-tenant-001', 'Thandi Superette', 'TSP01', 'retail', 'SPAZA', '+27110001042', 'th@super.co.za', '33 Vilakazi St, Orlando West', -26.2450, 27.9080, 'route-004', 3000, 350, 7, 'C', 'active', datetime('now')),
  ('cust-043', 'default-tenant-001', 'Greenfields Market', 'GFM01', 'retail', 'SHOP', '+27110001043', 'gf@market.co.za', '88 Jan Smuts Ave, Parktown North', -26.1500, 28.0200, 'route-003', 7500, 1300, 15, 'B', 'active', datetime('now')),
  ('cust-044', 'default-tenant-001', 'Bongos Cafe Maboneng', 'BCM01', 'retail', 'RESTAURANT', '+27110001044', 'bongo@cafe.co.za', '286 Fox St, Maboneng', -26.2025, 28.0570, 'route-001', 8000, 1600, 15, 'B', 'active', datetime('now')),
  ('cust-045', 'default-tenant-001', 'Simons Corner Shop', 'SCS01', 'retail', 'SPAZA', '+27110001045', 'simon@corner.co.za', '9 Meadowlands Zone 1', -26.2260, 27.8880, 'route-004', 2000, 200, 7, 'C', 'active', datetime('now')),
  ('cust-046', 'default-tenant-001', 'Riverside Deli Parkhurst', 'RDP01', 'retail', 'RESTAURANT', '+27110001046', 'river@deli.co.za', '4th Ave, Parkhurst', -26.1470, 28.0110, 'route-003', 11000, 2500, 15, 'B', 'active', datetime('now')),
  ('cust-047', 'default-tenant-001', 'Budget Foods Benoni', 'BFB01', 'retail', 'SHOP', '+27110001047', 'budget@benoni.co.za', '45 Tom Jones St, Benoni', -26.1870, 28.3200, 'route-002', 6500, 900, 15, 'B', 'active', datetime('now')),
  ('cust-048', 'default-tenant-001', 'Durban Fresh Market', 'DFM01', 'retail', 'CHAIN', '+27310001048', 'fresh@durban.co.za', '100 Victoria Embankment, Durban', -29.8580, 31.0290, 'route-006', 35000, 8500, 30, 'A', 'active', datetime('now')),
  ('cust-049', 'default-tenant-001', 'Umhlanga Spar', 'UMS01', 'retail', 'CHAIN', '+27310001049', 'umhlanga@spar.co.za', 'Gateway Mall, Umhlanga', -29.7290, 31.0750, 'route-006', 40000, 10200, 30, 'A', 'active', datetime('now')),
  ('cust-050', 'default-tenant-001', 'Berea Mini Market', 'BMM01', 'retail', 'SHOP', '+27310001050', 'bm@berea.co.za', '22 Musgrave Rd, Berea, Durban', -29.8460, 31.0070, 'route-006', 5000, 600, 15, 'B', 'active', datetime('now')),
  ('cust-051', 'default-tenant-001', 'Ocean Basket Durban', 'OBD01', 'retail', 'RESTAURANT', '+27310001051', 'ocean@durban.co.za', 'uShaka Marine World, Durban', -29.8640, 31.0450, 'route-006', 12000, 2800, 15, 'B', 'active', datetime('now')),
  ('cust-052', 'default-tenant-001', 'Township Spaza Umlazi', 'TSU01', 'retail', 'SPAZA', '+27310001052', 'ts@umlazi.co.za', 'V Section, Umlazi', -29.9700, 30.8900, 'route-006', 2500, 300, 7, 'C', 'active', datetime('now'));

-- ==================== PRICE LISTS ====================
INSERT OR IGNORE INTO price_lists (id, tenant_id, name, description, is_default, is_active, currency, valid_from, valid_to, created_at)
VALUES
  ('pl-001', 'default-tenant-001', 'Standard Retail', 'Standard retail pricing', 1, 1, 'ZAR', '2026-01-01', '2026-12-31', datetime('now')),
  ('pl-002', 'default-tenant-001', 'Wholesale', 'Wholesale bulk pricing', 0, 1, 'ZAR', '2026-01-01', '2026-12-31', datetime('now')),
  ('pl-003', 'default-tenant-001', 'Premium Chain', 'Premium chain store pricing', 0, 1, 'ZAR', '2026-01-01', '2026-12-31', datetime('now')),
  ('pl-004', 'default-tenant-001', 'Spaza Special', 'Spaza shop pricing', 0, 1, 'ZAR', '2026-01-01', '2026-12-31', datetime('now')),
  ('pl-005', 'default-tenant-001', 'Restaurant', 'Restaurant partner pricing', 0, 1, 'ZAR', '2026-01-01', '2026-12-31', datetime('now'));

INSERT OR IGNORE INTO price_list_items (id, price_list_id, product_id, unit_price, min_qty, max_discount_pct, created_at)
VALUES
  ('pli-001', 'pl-001', 'prod-001', 15.00, 1, 10, datetime('now')),
  ('pli-002', 'pl-001', 'prod-002', 25.00, 1, 10, datetime('now')),
  ('pli-003', 'pl-001', 'prod-009', 18.00, 1, 10, datetime('now')),
  ('pli-004', 'pl-001', 'prod-012', 25.00, 1, 10, datetime('now')),
  ('pli-005', 'pl-002', 'prod-001', 12.00, 24, 15, datetime('now')),
  ('pli-006', 'pl-002', 'prod-002', 20.00, 12, 15, datetime('now')),
  ('pli-007', 'pl-002', 'prod-009', 14.00, 48, 15, datetime('now')),
  ('pli-008', 'pl-002', 'prod-012', 20.00, 48, 15, datetime('now')),
  ('pli-009', 'pl-003', 'prod-001', 14.00, 1, 5, datetime('now')),
  ('pli-010', 'pl-003', 'prod-017', 60.00, 1, 5, datetime('now'));

-- ==================== VANS ====================
INSERT OR IGNORE INTO vans (id, tenant_id, name, registration_number, driver_id, status, created_at)
VALUES
  ('van-001', 'default-tenant-001', 'Van Alpha', 'GP 123-456', 'agent-001', 'active', datetime('now')),
  ('van-002', 'default-tenant-001', 'Van Beta', 'GP 234-567', 'agent-002', 'active', datetime('now')),
  ('van-003', 'default-tenant-001', 'Van Gamma', 'GP 345-678', 'agent-004', 'active', datetime('now')),
  ('van-004', 'default-tenant-001', 'Van Delta', 'WC 456-789', 'agent-005', 'active', datetime('now'));

-- ==================== CAMPAIGNS ====================
INSERT OR IGNORE INTO campaigns (id, tenant_id, name, description, campaign_type, start_date, end_date, budget, status, created_by, created_at)
VALUES
  ('camp-001', 'default-tenant-001', 'Summer Promo 2026', 'Summer promotional campaign', 'field_marketing', '2026-01-01', '2026-03-31', 50000, 'active', 'super-admin-001', datetime('now')),
  ('camp-002', 'default-tenant-001', 'New Product Launch', 'Launching new beverage line', 'product_launch', '2026-02-01', '2026-04-30', 25000, 'active', 'super-admin-001', datetime('now')),
  ('camp-003', 'default-tenant-001', 'Spaza Penetration', 'Increase spaza shop distribution', 'distribution', '2026-03-01', '2026-06-30', 30000, 'active', 'manager-001', datetime('now'));

-- ==================== COMMISSION RULES ====================
INSERT OR IGNORE INTO commission_rules (id, tenant_id, name, source_type, rate, min_threshold, is_active, created_at)
VALUES
  ('cr-001', 'default-tenant-001', 'Sales Commission 5pct', 'sales_order', 5.0, 0, 1, datetime('now')),
  ('cr-002', 'default-tenant-001', 'Visit Bonus R10', 'visit', 10.0, 0, 1, datetime('now')),
  ('cr-003', 'default-tenant-001', 'Van Sales 7pct', 'sales_order', 7.0, 500, 1, datetime('now'));

-- ==================== SALES ORDERS (35) ====================
INSERT OR IGNORE INTO sales_orders (id, tenant_id, order_number, agent_id, customer_id, order_type, status, subtotal, tax_amount, discount_amount, total_amount, payment_method, payment_status, notes, gps_latitude, gps_longitude, created_at)
VALUES
  ('so-001', 'default-tenant-001', 'SO-001', 'agent-001', 'cust-001', 'direct_sale', 'confirmed', 2500.00, 375.00, 0, 2875.00, 'credit', 'paid', 'Weekly restock', -26.1950, 28.0334, '2026-03-01 09:15:00'),
  ('so-002', 'default-tenant-001', 'SO-002', 'agent-001', 'cust-002', 'direct_sale', 'confirmed', 1800.00, 270.00, 50.00, 2020.00, 'credit', 'paid', NULL, -26.2010, 28.0310, '2026-03-01 10:30:00'),
  ('so-003', 'default-tenant-001', 'SO-003', 'agent-002', 'cust-005', 'direct_sale', 'confirmed', 650.00, 97.50, 0, 747.50, 'cash', 'paid', 'Cash sale', -26.1790, 28.0650, '2026-03-01 11:00:00'),
  ('so-004', 'default-tenant-001', 'SO-004', 'agent-003', 'cust-011', 'direct_sale', 'confirmed', 5200.00, 780.00, 200.00, 5780.00, 'credit', 'pending', 'Large order', -26.1075, 28.0520, '2026-03-02 08:30:00'),
  ('so-005', 'default-tenant-001', 'SO-005', 'agent-003', 'cust-012', 'direct_sale', 'confirmed', 3100.00, 465.00, 0, 3565.00, 'credit', 'paid', NULL, -26.1120, 28.0650, '2026-03-02 10:00:00'),
  ('so-006', 'default-tenant-001', 'SO-006', 'agent-004', 'cust-016', 'direct_sale', 'confirmed', 4500.00, 675.00, 150.00, 5025.00, 'credit', 'pending', 'Shoprite monthly', -26.2680, 27.8960, '2026-03-02 09:00:00'),
  ('so-007', 'default-tenant-001', 'SO-007', 'agent-004', 'cust-018', 'van_sale', 'confirmed', 350.00, 52.50, 0, 402.50, 'cash', 'paid', 'Spaza van sale', -26.2550, 27.9220, '2026-03-02 14:00:00'),
  ('so-008', 'default-tenant-001', 'SO-008', 'agent-005', 'cust-022', 'direct_sale', 'confirmed', 6800.00, 1020.00, 300.00, 7520.00, 'credit', 'paid', 'Woolworths weekly', -33.9060, 18.4210, '2026-03-03 08:00:00'),
  ('so-009', 'default-tenant-001', 'SO-009', 'agent-005', 'cust-023', 'direct_sale', 'confirmed', 2200.00, 330.00, 0, 2530.00, 'credit', 'pending', NULL, -33.9150, 18.3910, '2026-03-03 10:30:00'),
  ('so-010', 'default-tenant-001', 'SO-010', 'agent-001', 'cust-027', 'direct_sale', 'confirmed', 15000.00, 2250.00, 750.00, 16500.00, 'credit', 'pending', 'Wholesale bulk', -26.2200, 28.0680, '2026-03-03 09:00:00'),
  ('so-011', 'default-tenant-001', 'SO-011', 'agent-002', 'cust-008', 'direct_sale', 'confirmed', 900.00, 135.00, 0, 1035.00, 'cash', 'paid', NULL, -26.2000, 28.0580, '2026-03-04 09:30:00'),
  ('so-012', 'default-tenant-001', 'SO-012', 'agent-002', 'cust-035', 'direct_sale', 'confirmed', 550.00, 82.50, 0, 632.50, 'cash', 'paid', NULL, -26.1650, 28.0720, '2026-03-04 11:00:00'),
  ('so-013', 'default-tenant-001', 'SO-013', 'agent-003', 'cust-013', 'direct_sale', 'confirmed', 4800.00, 720.00, 100.00, 5420.00, 'credit', 'paid', NULL, -26.1050, 28.0600, '2026-03-04 08:45:00'),
  ('so-014', 'default-tenant-001', 'SO-014', 'agent-004', 'cust-017', 'direct_sale', 'confirmed', 2800.00, 420.00, 0, 3220.00, 'credit', 'pending', NULL, -26.2380, 27.9050, '2026-03-05 09:00:00'),
  ('so-015', 'default-tenant-001', 'SO-015', 'agent-001', 'cust-003', 'direct_sale', 'confirmed', 1950.00, 292.50, 50.00, 2192.50, 'credit', 'paid', NULL, -26.1880, 28.0480, '2026-03-05 10:15:00'),
  ('so-016', 'default-tenant-001', 'SO-016', 'agent-002', 'cust-006', 'van_sale', 'confirmed', 480.00, 72.00, 0, 552.00, 'cash', 'paid', NULL, -26.1850, 28.0550, '2026-03-05 13:30:00'),
  ('so-017', 'default-tenant-001', 'SO-017', 'agent-005', 'cust-024', 'direct_sale', 'confirmed', 3600.00, 540.00, 100.00, 4040.00, 'credit', 'pending', NULL, -33.8940, 18.5120, '2026-03-06 08:30:00'),
  ('so-018', 'default-tenant-001', 'SO-018', 'agent-003', 'cust-030', 'direct_sale', 'confirmed', 1200.00, 180.00, 0, 1380.00, 'cash', 'paid', NULL, -26.1470, 28.0400, '2026-03-06 09:45:00'),
  ('so-019', 'default-tenant-001', 'SO-019', 'agent-004', 'cust-019', 'van_sale', 'confirmed', 780.00, 117.00, 0, 897.00, 'cash', 'paid', NULL, -26.2240, 27.8870, '2026-03-06 14:15:00'),
  ('so-020', 'default-tenant-001', 'SO-020', 'agent-001', 'cust-004', 'direct_sale', 'confirmed', 3200.00, 480.00, 100.00, 3580.00, 'credit', 'paid', NULL, -26.2030, 28.0210, '2026-03-07 09:00:00'),
  ('so-021', 'default-tenant-001', 'SO-021', 'agent-001', 'cust-033', 'direct_sale', 'confirmed', 1500.00, 225.00, 0, 1725.00, 'cash', 'paid', NULL, -26.2020, 28.0560, '2026-03-07 11:30:00'),
  ('so-022', 'default-tenant-001', 'SO-022', 'agent-002', 'cust-041', 'direct_sale', 'confirmed', 680.00, 102.00, 0, 782.00, 'cash', 'paid', NULL, -26.1890, 28.0900, '2026-03-07 10:00:00'),
  ('so-023', 'default-tenant-001', 'SO-023', 'agent-003', 'cust-031', 'direct_sale', 'confirmed', 2900.00, 435.00, 0, 3335.00, 'credit', 'pending', NULL, -26.1530, 28.0050, '2026-03-08 08:30:00'),
  ('so-024', 'default-tenant-001', 'SO-024', 'agent-004', 'cust-020', 'van_sale', 'confirmed', 420.00, 63.00, 0, 483.00, 'cash', 'paid', NULL, -26.2450, 27.8650, '2026-03-08 14:00:00'),
  ('so-025', 'default-tenant-001', 'SO-025', 'agent-005', 'cust-037', 'direct_sale', 'confirmed', 3800.00, 570.00, 150.00, 4220.00, 'credit', 'paid', NULL, -33.9630, 18.4730, '2026-03-08 09:15:00'),
  ('so-026', 'default-tenant-001', 'SO-026', 'agent-001', 'cust-028', 'direct_sale', 'confirmed', 12000.00, 1800.00, 600.00, 13200.00, 'credit', 'pending', 'Wholesale', -26.2150, 28.1700, '2026-03-09 08:00:00'),
  ('so-027', 'default-tenant-001', 'SO-027', 'agent-002', 'cust-009', 'van_sale', 'confirmed', 280.00, 42.00, 0, 322.00, 'cash', 'paid', NULL, -26.1960, 28.0510, '2026-03-09 13:00:00'),
  ('so-028', 'default-tenant-001', 'SO-028', 'agent-003', 'cust-015', 'direct_sale', 'confirmed', 750.00, 112.50, 0, 862.50, 'cash', 'paid', NULL, -26.1030, 28.0580, '2026-03-09 10:30:00'),
  ('so-029', 'default-tenant-001', 'SO-029', 'agent-004', 'cust-042', 'van_sale', 'confirmed', 320.00, 48.00, 0, 368.00, 'cash', 'paid', NULL, -26.2450, 27.9080, '2026-03-10 14:30:00'),
  ('so-030', 'default-tenant-001', 'SO-030', 'agent-005', 'cust-025', 'direct_sale', 'confirmed', 880.00, 132.00, 0, 1012.00, 'cash', 'paid', NULL, -33.9370, 18.4710, '2026-03-10 09:45:00'),
  ('so-031', 'default-tenant-001', 'SO-031', 'agent-001', 'cust-001', 'direct_sale', 'confirmed', 3100.00, 465.00, 100.00, 3465.00, 'credit', 'paid', 'Restock', -26.1950, 28.0334, '2026-03-10 09:00:00'),
  ('so-032', 'default-tenant-001', 'SO-032', 'agent-003', 'cust-043', 'direct_sale', 'confirmed', 1100.00, 165.00, 0, 1265.00, 'cash', 'paid', NULL, -26.1500, 28.0200, '2026-03-11 10:00:00'),
  ('so-033', 'default-tenant-001', 'SO-033', 'agent-002', 'cust-038', 'van_sale', 'confirmed', 250.00, 37.50, 0, 287.50, 'cash', 'paid', NULL, -26.1100, 28.1000, '2026-03-11 14:00:00'),
  ('so-034', 'default-tenant-001', 'SO-034', 'agent-005', 'cust-049', 'direct_sale', 'confirmed', 4200.00, 630.00, 200.00, 4630.00, 'credit', 'pending', NULL, -29.7290, 31.0750, '2026-03-11 08:30:00'),
  ('so-035', 'default-tenant-001', 'SO-035', 'agent-001', 'cust-048', 'direct_sale', 'confirmed', 3500.00, 525.00, 0, 4025.00, 'credit', 'pending', NULL, -29.8580, 31.0290, '2026-03-12 09:00:00');

-- Order items
INSERT OR IGNORE INTO sales_order_items (id, sales_order_id, product_id, quantity, unit_price, discount_percent, line_total)
VALUES
  ('soi-001', 'so-001', 'prod-001', 100, 15.00, 0, 1500.00),
  ('soi-002', 'so-001', 'prod-002', 40, 25.00, 0, 1000.00),
  ('soi-003', 'so-002', 'prod-001', 60, 15.00, 0, 900.00),
  ('soi-004', 'so-002', 'prod-009', 50, 18.00, 0, 900.00),
  ('soi-005', 'so-003', 'prod-012', 26, 25.00, 0, 650.00),
  ('soi-006', 'so-004', 'prod-001', 120, 14.00, 0, 1680.00),
  ('soi-007', 'so-004', 'prod-005', 80, 20.00, 0, 1600.00),
  ('soi-008', 'so-004', 'prod-017', 30, 64.00, 0, 1920.00),
  ('soi-009', 'so-008', 'prod-001', 200, 14.00, 0, 2800.00),
  ('soi-010', 'so-008', 'prod-002', 80, 25.00, 0, 2000.00),
  ('soi-011', 'so-008', 'prod-017', 30, 66.67, 0, 2000.00),
  ('soi-012', 'so-010', 'prod-001', 500, 12.00, 0, 6000.00),
  ('soi-013', 'so-010', 'prod-009', 300, 14.00, 0, 4200.00),
  ('soi-014', 'so-010', 'prod-012', 240, 20.00, 0, 4800.00);

-- ==================== PAYMENTS ====================
INSERT OR IGNORE INTO payments (id, tenant_id, sales_order_id, amount, method, reference, status, created_at)
VALUES
  ('pay-001', 'default-tenant-001', 'so-001', 2875.00, 'eft', 'EFT-20260301-001', 'completed', '2026-03-02 08:00:00'),
  ('pay-002', 'default-tenant-001', 'so-002', 2020.00, 'eft', 'EFT-20260302-001', 'completed', '2026-03-03 08:00:00'),
  ('pay-003', 'default-tenant-001', 'so-003', 747.50, 'cash', 'CASH-20260301', 'completed', '2026-03-01 11:00:00'),
  ('pay-004', 'default-tenant-001', 'so-005', 3565.00, 'eft', 'EFT-20260304-001', 'completed', '2026-03-04 08:00:00'),
  ('pay-005', 'default-tenant-001', 'so-007', 402.50, 'cash', 'CASH-20260302', 'completed', '2026-03-02 14:00:00'),
  ('pay-006', 'default-tenant-001', 'so-008', 7520.00, 'eft', 'EFT-20260305-001', 'completed', '2026-03-05 08:00:00'),
  ('pay-007', 'default-tenant-001', 'so-011', 1035.00, 'cash', 'CASH-20260304', 'completed', '2026-03-04 09:30:00'),
  ('pay-008', 'default-tenant-001', 'so-015', 2192.50, 'eft', 'EFT-20260307-001', 'completed', '2026-03-07 08:00:00'),
  ('pay-009', 'default-tenant-001', 'so-020', 3580.00, 'eft', 'EFT-20260309-001', 'completed', '2026-03-09 08:00:00'),
  ('pay-010', 'default-tenant-001', 'so-021', 1725.00, 'cash', 'CASH-20260307', 'completed', '2026-03-07 11:30:00');

-- ==================== VAN STOCK LOADS ====================
INSERT OR IGNORE INTO van_stock_loads (id, tenant_id, agent_id, vehicle_reg, warehouse_id, status, load_date, created_at)
VALUES
  ('vsl-001', 'default-tenant-001', 'agent-001', 'GP 123-456', 'wh-001', 'loaded', '2026-03-10 06:00:00', '2026-03-10 06:00:00'),
  ('vsl-002', 'default-tenant-001', 'agent-002', 'GP 234-567', 'wh-001', 'loaded', '2026-03-10 06:15:00', '2026-03-10 06:15:00'),
  ('vsl-003', 'default-tenant-001', 'agent-004', 'GP 345-678', 'wh-001', 'loaded', '2026-03-10 06:30:00', '2026-03-10 06:30:00'),
  ('vsl-004', 'default-tenant-001', 'agent-005', 'WC 456-789', 'wh-003', 'loaded', '2026-03-10 06:00:00', '2026-03-10 06:00:00'),
  ('vsl-005', 'default-tenant-001', 'agent-001', 'GP 123-456', 'wh-001', 'completed', '2026-03-09 06:00:00', '2026-03-09 06:00:00'),
  ('vsl-006', 'default-tenant-001', 'agent-002', 'GP 234-567', 'wh-001', 'completed', '2026-03-09 06:15:00', '2026-03-09 06:15:00');

INSERT OR IGNORE INTO van_stock_load_items (id, van_stock_load_id, product_id, quantity_loaded, quantity_sold, quantity_returned)
VALUES
  ('vsli-001', 'vsl-001', 'prod-001', 200, 120, 0),
  ('vsli-002', 'vsl-001', 'prod-009', 150, 80, 0),
  ('vsli-003', 'vsl-001', 'prod-012', 100, 65, 0),
  ('vsli-004', 'vsl-002', 'prod-001', 150, 90, 0),
  ('vsli-005', 'vsl-002', 'prod-005', 80, 45, 0),
  ('vsli-006', 'vsl-003', 'prod-001', 180, 140, 0),
  ('vsli-007', 'vsl-003', 'prod-012', 200, 160, 0),
  ('vsli-008', 'vsl-004', 'prod-001', 120, 85, 0),
  ('vsli-009', 'vsl-004', 'prod-002', 60, 40, 0),
  ('vsli-010', 'vsl-005', 'prod-001', 200, 180, 20),
  ('vsli-011', 'vsl-005', 'prod-009', 150, 130, 20),
  ('vsli-012', 'vsl-006', 'prod-001', 150, 140, 10);

-- ==================== VISITS (32) ====================
INSERT OR IGNORE INTO visits (id, tenant_id, agent_id, customer_id, visit_date, visit_type, check_in_time, check_out_time, latitude, longitude, outcome, notes, status, created_at)
VALUES
  ('vis-001', 'default-tenant-001', 'agent-001', 'cust-001', '2026-03-10', 'customer', '2026-03-10 09:00:00', '2026-03-10 09:45:00', -26.1950, 28.0334, 'order_placed', 'Restock order', 'completed', '2026-03-10 09:00:00'),
  ('vis-002', 'default-tenant-001', 'agent-001', 'cust-002', '2026-03-10', 'customer', '2026-03-10 10:15:00', '2026-03-10 10:55:00', -26.2010, 28.0310, 'order_placed', NULL, 'completed', '2026-03-10 10:15:00'),
  ('vis-003', 'default-tenant-001', 'agent-001', 'cust-003', '2026-03-10', 'customer', '2026-03-10 11:20:00', '2026-03-10 11:50:00', -26.1880, 28.0480, 'completed', 'Shelf check', 'completed', '2026-03-10 11:20:00'),
  ('vis-004', 'default-tenant-001', 'agent-001', 'cust-004', '2026-03-10', 'customer', '2026-03-10 13:00:00', '2026-03-10 13:40:00', -26.2030, 28.0210, 'order_placed', NULL, 'completed', '2026-03-10 13:00:00'),
  ('vis-005', 'default-tenant-001', 'agent-002', 'cust-005', '2026-03-10', 'customer', '2026-03-10 09:00:00', '2026-03-10 09:30:00', -26.1790, 28.0650, 'order_placed', NULL, 'completed', '2026-03-10 09:00:00'),
  ('vis-006', 'default-tenant-001', 'agent-002', 'cust-006', '2026-03-10', 'customer', '2026-03-10 10:00:00', '2026-03-10 10:25:00', -26.1850, 28.0550, 'no_order', 'Sufficient stock', 'completed', '2026-03-10 10:00:00'),
  ('vis-007', 'default-tenant-001', 'agent-002', 'cust-007', '2026-03-10', 'customer', '2026-03-10 11:00:00', '2026-03-10 11:20:00', -26.1920, 28.0620, 'completed', 'Survey done', 'completed', '2026-03-10 11:00:00'),
  ('vis-008', 'default-tenant-001', 'agent-002', 'cust-008', '2026-03-10', 'customer', '2026-03-10 13:30:00', '2026-03-10 14:10:00', -26.2000, 28.0580, 'order_placed', NULL, 'completed', '2026-03-10 13:30:00'),
  ('vis-009', 'default-tenant-001', 'agent-003', 'cust-011', '2026-03-10', 'customer', '2026-03-10 08:30:00', '2026-03-10 09:30:00', -26.1075, 28.0520, 'order_placed', 'Large order', 'completed', '2026-03-10 08:30:00'),
  ('vis-010', 'default-tenant-001', 'agent-003', 'cust-012', '2026-03-10', 'customer', '2026-03-10 10:00:00', '2026-03-10 10:40:00', -26.1120, 28.0650, 'order_placed', NULL, 'completed', '2026-03-10 10:00:00'),
  ('vis-011', 'default-tenant-001', 'agent-003', 'cust-013', '2026-03-10', 'customer', '2026-03-10 11:00:00', '2026-03-10 11:30:00', -26.1050, 28.0600, 'completed', NULL, 'completed', '2026-03-10 11:00:00'),
  ('vis-012', 'default-tenant-001', 'agent-004', 'cust-016', '2026-03-10', 'customer', '2026-03-10 09:00:00', '2026-03-10 09:50:00', -26.2680, 27.8960, 'order_placed', NULL, 'completed', '2026-03-10 09:00:00'),
  ('vis-013', 'default-tenant-001', 'agent-004', 'cust-017', '2026-03-10', 'customer', '2026-03-10 10:30:00', '2026-03-10 11:10:00', -26.2380, 27.9050, 'order_placed', NULL, 'completed', '2026-03-10 10:30:00'),
  ('vis-014', 'default-tenant-001', 'agent-004', 'cust-018', '2026-03-10', 'customer', '2026-03-10 13:00:00', '2026-03-10 13:20:00', -26.2550, 27.9220, 'order_placed', 'Quick sale', 'completed', '2026-03-10 13:00:00'),
  ('vis-015', 'default-tenant-001', 'agent-004', 'cust-020', '2026-03-10', 'customer', '2026-03-10 14:00:00', '2026-03-10 14:15:00', -26.2450, 27.8650, 'order_placed', NULL, 'completed', '2026-03-10 14:00:00'),
  ('vis-016', 'default-tenant-001', 'agent-005', 'cust-022', '2026-03-10', 'customer', '2026-03-10 08:00:00', '2026-03-10 09:00:00', -33.9060, 18.4210, 'order_placed', NULL, 'completed', '2026-03-10 08:00:00'),
  ('vis-017', 'default-tenant-001', 'agent-005', 'cust-023', '2026-03-10', 'customer', '2026-03-10 09:30:00', '2026-03-10 10:10:00', -33.9150, 18.3910, 'order_placed', NULL, 'completed', '2026-03-10 09:30:00'),
  ('vis-018', 'default-tenant-001', 'agent-005', 'cust-024', '2026-03-10', 'customer', '2026-03-10 10:30:00', '2026-03-10 11:00:00', -33.8940, 18.5120, 'completed', NULL, 'completed', '2026-03-10 10:30:00'),
  ('vis-019', 'default-tenant-001', 'agent-001', 'cust-033', '2026-03-11', 'customer', '2026-03-11 09:00:00', '2026-03-11 09:30:00', -26.2020, 28.0560, 'order_placed', NULL, 'completed', '2026-03-11 09:00:00'),
  ('vis-020', 'default-tenant-001', 'agent-001', 'cust-044', '2026-03-11', 'customer', '2026-03-11 10:00:00', '2026-03-11 10:20:00', -26.2025, 28.0570, 'completed', NULL, 'completed', '2026-03-11 10:00:00'),
  ('vis-021', 'default-tenant-001', 'agent-002', 'cust-035', '2026-03-11', 'customer', '2026-03-11 09:15:00', '2026-03-11 09:50:00', -26.1650, 28.0720, 'order_placed', NULL, 'completed', '2026-03-11 09:15:00'),
  ('vis-022', 'default-tenant-001', 'agent-002', 'cust-041', '2026-03-11', 'customer', '2026-03-11 10:30:00', '2026-03-11 11:00:00', -26.1890, 28.0900, 'no_order', NULL, 'completed', '2026-03-11 10:30:00'),
  ('vis-023', 'default-tenant-001', 'agent-003', 'cust-029', '2026-03-11', 'customer', '2026-03-11 09:00:00', '2026-03-11 09:25:00', -26.1450, 27.9940, 'order_placed', NULL, 'completed', '2026-03-11 09:00:00'),
  ('vis-024', 'default-tenant-001', 'agent-003', 'cust-039', '2026-03-11', 'customer', '2026-03-11 10:00:00', '2026-03-11 10:30:00', -26.1760, 27.9950, 'completed', NULL, 'completed', '2026-03-11 10:00:00'),
  ('vis-025', 'default-tenant-001', 'agent-004', 'cust-021', '2026-03-11', 'customer', '2026-03-11 09:00:00', '2026-03-11 09:20:00', -26.2290, 27.8550, 'order_placed', NULL, 'completed', '2026-03-11 09:00:00'),
  ('vis-026', 'default-tenant-001', 'agent-004', 'cust-032', '2026-03-11', 'customer', '2026-03-11 10:00:00', '2026-03-11 10:15:00', -26.2200, 27.8800, 'order_placed', NULL, 'completed', '2026-03-11 10:00:00'),
  ('vis-027', 'default-tenant-001', 'agent-005', 'cust-025', '2026-03-11', 'customer', '2026-03-11 09:00:00', '2026-03-11 09:30:00', -33.9370, 18.4710, 'order_placed', NULL, 'completed', '2026-03-11 09:00:00'),
  ('vis-028', 'default-tenant-001', 'agent-005', 'cust-026', '2026-03-11', 'customer', '2026-03-11 10:00:00', '2026-03-11 10:20:00', -33.9290, 18.4480, 'completed', NULL, 'completed', '2026-03-11 10:00:00'),
  ('vis-029', 'default-tenant-001', 'agent-001', 'cust-027', '2026-03-12', 'customer', '2026-03-12 08:30:00', NULL, -26.2200, 28.0680, NULL, 'In progress', 'in_progress', '2026-03-12 08:30:00'),
  ('vis-030', 'default-tenant-001', 'agent-002', 'cust-010', '2026-03-12', 'customer', NULL, NULL, -26.1830, 28.0580, NULL, 'Scheduled', 'planned', '2026-03-12 06:00:00'),
  ('vis-031', 'default-tenant-001', 'agent-003', 'cust-014', '2026-03-12', 'customer', NULL, NULL, -26.1090, 28.0560, NULL, 'Scheduled', 'planned', '2026-03-12 06:00:00'),
  ('vis-032', 'default-tenant-001', 'agent-004', 'cust-045', '2026-03-12', 'customer', NULL, NULL, -26.2260, 27.8880, NULL, 'Scheduled', 'planned', '2026-03-12 06:00:00');

-- ==================== COMMISSION EARNINGS (20) ====================
INSERT OR IGNORE INTO commission_earnings (id, tenant_id, earner_id, source_type, source_id, rule_id, rate, base_amount, amount, status, period_start, period_end, created_at)
VALUES
  ('ce-001', 'default-tenant-001', 'agent-001', 'sales_order', 'so-001', 'cr-001', 5.0, 2875.00, 143.75, 'approved', '2026-03-01', '2026-03-31', '2026-03-01 09:15:00'),
  ('ce-002', 'default-tenant-001', 'manager-001', 'sales_order_override', 'so-001', 'cr-001', 1.5, 2875.00, 43.13, 'approved', '2026-03-01', '2026-03-31', '2026-03-01 09:15:00'),
  ('ce-003', 'default-tenant-001', 'agent-001', 'sales_order', 'so-002', 'cr-001', 5.0, 2020.00, 101.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-01 10:30:00'),
  ('ce-004', 'default-tenant-001', 'agent-002', 'sales_order', 'so-003', 'cr-001', 5.0, 747.50, 37.38, 'approved', '2026-03-01', '2026-03-31', '2026-03-01 11:00:00'),
  ('ce-005', 'default-tenant-001', 'agent-003', 'sales_order', 'so-004', 'cr-001', 5.0, 5780.00, 289.00, 'pending', '2026-03-01', '2026-03-31', '2026-03-02 08:30:00'),
  ('ce-006', 'default-tenant-001', 'manager-002', 'sales_order_override', 'so-004', 'cr-001', 1.5, 5780.00, 86.70, 'pending', '2026-03-01', '2026-03-31', '2026-03-02 08:30:00'),
  ('ce-007', 'default-tenant-001', 'agent-003', 'sales_order', 'so-005', 'cr-001', 5.0, 3565.00, 178.25, 'approved', '2026-03-01', '2026-03-31', '2026-03-02 10:00:00'),
  ('ce-008', 'default-tenant-001', 'agent-004', 'sales_order', 'so-006', 'cr-001', 5.0, 5025.00, 251.25, 'pending', '2026-03-01', '2026-03-31', '2026-03-02 09:00:00'),
  ('ce-009', 'default-tenant-001', 'agent-005', 'sales_order', 'so-008', 'cr-001', 5.0, 7520.00, 376.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-03 08:00:00'),
  ('ce-010', 'default-tenant-001', 'agent-001', 'sales_order', 'so-010', 'cr-001', 5.0, 16500.00, 825.00, 'pending', '2026-03-01', '2026-03-31', '2026-03-03 09:00:00'),
  ('ce-011', 'default-tenant-001', 'manager-001', 'sales_order_override', 'so-010', 'cr-001', 1.5, 16500.00, 247.50, 'pending', '2026-03-01', '2026-03-31', '2026-03-03 09:00:00'),
  ('ce-012', 'default-tenant-001', 'agent-001', 'visit', 'vis-001', 'cr-002', 10.0, 1.00, 10.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-10 09:00:00'),
  ('ce-013', 'default-tenant-001', 'agent-001', 'visit', 'vis-002', 'cr-002', 10.0, 1.00, 10.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-10 10:15:00'),
  ('ce-014', 'default-tenant-001', 'agent-002', 'visit', 'vis-005', 'cr-002', 10.0, 1.00, 10.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-10 09:00:00'),
  ('ce-015', 'default-tenant-001', 'agent-003', 'visit', 'vis-009', 'cr-002', 10.0, 1.00, 10.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-10 08:30:00'),
  ('ce-016', 'default-tenant-001', 'agent-004', 'visit', 'vis-012', 'cr-002', 10.0, 1.00, 10.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-10 09:00:00'),
  ('ce-017', 'default-tenant-001', 'agent-005', 'visit', 'vis-016', 'cr-002', 10.0, 1.00, 10.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-10 08:00:00'),
  ('ce-018', 'default-tenant-001', 'agent-001', 'sales_order', 'so-031', 'cr-001', 5.0, 3465.00, 173.25, 'pending', '2026-03-01', '2026-03-31', '2026-03-10 09:00:00'),
  ('ce-019', 'default-tenant-001', 'agent-005', 'sales_order', 'so-025', 'cr-001', 5.0, 4220.00, 211.00, 'approved', '2026-03-01', '2026-03-31', '2026-03-08 09:15:00'),
  ('ce-020', 'default-tenant-001', 'agent-001', 'sales_order', 'so-026', 'cr-001', 5.0, 13200.00, 660.00, 'pending', '2026-03-01', '2026-03-31', '2026-03-09 08:00:00');

-- ==================== VAN RECONCILIATIONS ====================
INSERT OR IGNORE INTO van_reconciliations (id, tenant_id, van_stock_load_id, cash_expected, cash_actual, variance, denominations, status, notes, created_at)
VALUES
  ('vr-001', 'default-tenant-001', 'vsl-005', 4500.00, 4480.00, -20.00, '{"R200":10,"R100":20,"R50":8,"R20":3,"R10":1,"R5":0,"R2":0,"R1":0,"coins":0}', 'discrepancy', 'Short R20', '2026-03-09 17:00:00'),
  ('vr-002', 'default-tenant-001', 'vsl-006', 3200.00, 3200.00, 0, '{"R200":8,"R100":14,"R50":4,"R20":0,"R10":0,"R5":0,"R2":0,"R1":0,"coins":0}', 'balanced', NULL, '2026-03-09 17:15:00');

-- ==================== ANOMALY FLAGS ====================
INSERT OR IGNORE INTO anomaly_flags (id, tenant_id, agent_id, anomaly_type, severity, description, reference_type, reference_id, data, status, created_at)
VALUES
  ('af-001', 'default-tenant-001', 'agent-004', 'SHORT_VISIT', 'MEDIUM', 'Visit duration 15min below minimum 20min', 'VISIT', 'vis-015', '{"duration":15,"minimum":20}', 'OPEN', '2026-03-10 14:15:00'),
  ('af-002', 'default-tenant-001', 'agent-004', 'SHORT_VISIT', 'MEDIUM', 'Visit duration 15min below minimum 20min', 'VISIT', 'vis-026', '{"duration":15,"minimum":20}', 'OPEN', '2026-03-11 10:15:00'),
  ('af-003', 'default-tenant-001', 'agent-001', 'CASH_VARIANCE', 'LOW', 'Cash variance R20 on van load vsl-005', 'RECONCILIATION', 'vr-001', '{"expected":4500,"actual":4480,"variance":-20}', 'OPEN', '2026-03-09 17:00:00');

-- ==================== TRADE PROMOTIONS ====================
INSERT OR IGNORE INTO trade_promotions (id, tenant_id, name, promotion_type, description, start_date, end_date, budget, status, config, created_by, created_at)
VALUES
  ('tp-001', 'default-tenant-001', 'Buy 10 Get 1 Free Cola', 'VOLUME_DISCOUNT', 'Buy 10 cases get 1 free', '2026-03-01', '2026-03-31', 10000, 'ACTIVE', '{"discount_pct":9.09,"min_qty":10}', 'super-admin-001', datetime('now')),
  ('tp-002', 'default-tenant-001', '15pct Off New Snacks', 'PERCENTAGE', '15pct discount on snacks', '2026-03-01', '2026-04-30', 15000, 'ACTIVE', '{"discount_pct":15.0,"min_qty":1}', 'super-admin-001', datetime('now')),
  ('tp-003', 'default-tenant-001', 'Dairy Bundle Deal', 'BUNDLE', 'Buy 2 milk + 1 yoghurt at 10pct off', '2026-03-15', '2026-04-15', 8000, 'ACTIVE', '{"discount_pct":10.0,"min_qty":3}', 'manager-001', datetime('now'));

-- ==================== SURVEYS / QUESTIONNAIRES ====================
INSERT OR IGNORE INTO questionnaires (id, tenant_id, name, visit_type, questions, is_default, is_active, created_at)
VALUES
  ('quest-001', 'default-tenant-001', 'Customer Visit Survey', 'customer', '[{"id":"q1","question":"Is the store open?","type":"boolean"},{"id":"q2","question":"Stock availability","type":"rating"},{"id":"q3","question":"Competitor visible?","type":"boolean"},{"id":"q4","question":"Notes","type":"text"}]', 1, 1, datetime('now')),
  ('quest-002', 'default-tenant-001', 'Merchandising Checklist', 'merchandising', '[{"id":"q1","question":"Products on shelf?","type":"boolean"},{"id":"q2","question":"Price tags visible?","type":"boolean"},{"id":"q3","question":"Promo displayed?","type":"boolean"},{"id":"q4","question":"Shelf share","type":"number"}]', 0, 1, datetime('now'));

INSERT OR IGNORE INTO surveys (id, tenant_id, name, description, questions, status, created_at)
VALUES
  ('surv-001', 'default-tenant-001', 'Customer Satisfaction Q1', 'Quarterly satisfaction survey', '[{"id":"s1","question":"Overall satisfaction","type":"rating"},{"id":"s2","question":"Delivery timeliness","type":"rating"},{"id":"s3","question":"Recommend us?","type":"boolean"},{"id":"s4","question":"Feedback","type":"text"}]', 'active', datetime('now'));

-- ==================== BEATS + ROUTE CUSTOMERS ====================
INSERT OR IGNORE INTO beats (id, tenant_id, name, description, created_at)
VALUES
  ('beat-001', 'default-tenant-001', 'JHB Morning Beat', 'Morning delivery route JHB CBD', datetime('now')),
  ('beat-002', 'default-tenant-001', 'Sandton Express', 'Express deliveries to Sandton', datetime('now')),
  ('beat-003', 'default-tenant-001', 'Soweto Community', 'Community store visits Soweto', datetime('now'));

INSERT OR IGNORE INTO route_customers (id, tenant_id, route_id, customer_id, sequence_order, created_at)
VALUES
  ('rc-001', 'default-tenant-001', 'route-001', 'cust-001', 1, datetime('now')),
  ('rc-002', 'default-tenant-001', 'route-001', 'cust-002', 2, datetime('now')),
  ('rc-003', 'default-tenant-001', 'route-001', 'cust-003', 3, datetime('now')),
  ('rc-004', 'default-tenant-001', 'route-001', 'cust-004', 4, datetime('now')),
  ('rc-005', 'default-tenant-001', 'route-002', 'cust-005', 1, datetime('now')),
  ('rc-006', 'default-tenant-001', 'route-002', 'cust-006', 2, datetime('now')),
  ('rc-007', 'default-tenant-001', 'route-002', 'cust-007', 3, datetime('now')),
  ('rc-008', 'default-tenant-001', 'route-002', 'cust-008', 4, datetime('now')),
  ('rc-009', 'default-tenant-001', 'route-003', 'cust-011', 1, datetime('now')),
  ('rc-010', 'default-tenant-001', 'route-003', 'cust-012', 2, datetime('now')),
  ('rc-011', 'default-tenant-001', 'route-003', 'cust-013', 3, datetime('now')),
  ('rc-012', 'default-tenant-001', 'route-004', 'cust-016', 1, datetime('now')),
  ('rc-013', 'default-tenant-001', 'route-004', 'cust-017', 2, datetime('now')),
  ('rc-014', 'default-tenant-001', 'route-004', 'cust-018', 3, datetime('now')),
  ('rc-015', 'default-tenant-001', 'route-005', 'cust-022', 1, datetime('now')),
  ('rc-016', 'default-tenant-001', 'route-005', 'cust-023', 2, datetime('now')),
  ('rc-017', 'default-tenant-001', 'route-005', 'cust-024', 3, datetime('now'));

-- ==================== NOTIFICATIONS ====================
INSERT OR IGNORE INTO notifications (id, tenant_id, user_id, type, title, message, is_read, related_type, related_id, created_at)
VALUES
  ('notif-001', 'default-tenant-001', 'super-admin-001', 'info', 'Welcome to FieldVibe', 'Your distribution company is set up.', 0, NULL, NULL, datetime('now')),
  ('notif-002', 'default-tenant-001', 'super-admin-001', 'warning', 'Low Stock Alert', 'Ice Cream 2L below threshold.', 0, 'stock', 'sl-017', datetime('now')),
  ('notif-003', 'default-tenant-001', 'manager-001', 'warning', 'Short Visit', 'Agent Nomsa had 15min visit.', 0, 'anomaly', 'af-001', datetime('now')),
  ('notif-004', 'default-tenant-001', 'agent-001', 'info', 'Commission Earned', 'R143.75 on order SO-001.', 1, 'commission', 'ce-001', datetime('now')),
  ('notif-005', 'default-tenant-001', 'agent-001', 'info', 'Commission Earned', 'R825.00 on order SO-010.', 0, 'commission', 'ce-010', datetime('now'));

-- ==================== SETTINGS ====================
INSERT OR IGNORE INTO settings (id, tenant_id, key, value, category, created_at)
VALUES
  ('set-001', 'default-tenant-001', 'geofence_radius_meters', '200', 'field_ops', datetime('now')),
  ('set-002', 'default-tenant-001', 'min_visit_duration_minutes', '10', 'field_ops', datetime('now')),
  ('set-003', 'default-tenant-001', 'currency', 'ZAR', 'general', datetime('now')),
  ('set-004', 'default-tenant-001', 'default_tax_rate', '15', 'finance', datetime('now'));

-- ==================== AUDIT LOG ====================
INSERT OR IGNORE INTO audit_log (id, tenant_id, user_id, action, resource_type, resource_id, new_values, created_at)
VALUES
  ('audit-001', 'default-tenant-001', 'super-admin-001', 'CREATE', 'tenant', 'default-tenant-001', '{"name":"Demo Company"}', datetime('now')),
  ('audit-002', 'default-tenant-001', 'super-admin-001', 'CREATE', 'user', 'agent-001', '{"name":"Thabo Mokoena"}', datetime('now')),
  ('audit-003', 'default-tenant-001', 'super-admin-001', 'CREATE', 'user', 'agent-002', '{"name":"Sipho Dlamini"}', datetime('now')),
  ('audit-004', 'default-tenant-001', 'agent-001', 'CREATE', 'sales_order', 'so-001', '{"total":2875.00}', '2026-03-01 09:15:00'),
  ('audit-005', 'default-tenant-001', 'agent-003', 'CREATE', 'sales_order', 'so-004', '{"total":5780.00}', '2026-03-02 08:30:00');

-- ==================== RETURNS ====================
INSERT OR IGNORE INTO returns (id, tenant_id, original_order_id, return_number, return_type, status, total_credit_amount, restock_fee, net_credit_amount, reason, approved_by, created_by, created_at)
VALUES
  ('ret-001', 'default-tenant-001', 'so-003', 'RET-001', 'PARTIAL', 'APPROVED', 162.50, 16.25, 146.25, 'Damaged packaging on delivery', 'manager-001', 'agent-002', '2026-03-05 10:00:00'),
  ('ret-002', 'default-tenant-001', 'so-011', 'RET-002', 'FULL', 'APPROVED', 1035.00, 0, 1035.00, 'Wrong products delivered', 'manager-001', 'agent-002', '2026-03-06 14:00:00'),
  ('ret-003', 'default-tenant-001', 'so-015', 'RET-003', 'PARTIAL', 'PENDING', 500.00, 50.00, 450.00, 'Customer changed mind on some items', NULL, 'agent-001', '2026-03-08 11:00:00'),
  ('ret-004', 'default-tenant-001', 'so-007', 'RET-004', 'FULL', 'APPROVED', 402.50, 0, 402.50, 'Expired products found', 'manager-002', 'agent-004', '2026-03-09 09:00:00'),
  ('ret-005', 'default-tenant-001', 'so-018', 'RET-005', 'PARTIAL', 'REJECTED', 300.00, 30.00, 270.00, 'Products not defective upon inspection', 'manager-001', 'agent-003', '2026-03-10 15:00:00');

INSERT OR IGNORE INTO return_items (id, return_id, product_id, quantity, condition, unit_price, line_credit, original_order_item_id)
VALUES
  ('ri-001', 'ret-001', 'prod-012', 5, 'damaged', 25.00, 125.00, 'soi-005'),
  ('ri-002', 'ret-001', 'prod-009', 2, 'good', 18.75, 37.50, NULL),
  ('ri-003', 'ret-002', 'prod-001', 30, 'good', 15.00, 450.00, NULL),
  ('ri-004', 'ret-002', 'prod-009', 20, 'good', 18.00, 360.00, NULL),
  ('ri-005', 'ret-002', 'prod-012', 9, 'good', 25.00, 225.00, NULL),
  ('ri-006', 'ret-003', 'prod-001', 20, 'good', 15.00, 300.00, NULL),
  ('ri-007', 'ret-003', 'prod-002', 8, 'good', 25.00, 200.00, NULL),
  ('ri-008', 'ret-004', 'prod-001', 15, 'expired', 15.00, 225.00, NULL),
  ('ri-009', 'ret-004', 'prod-012', 7, 'expired', 25.00, 175.00, NULL),
  ('ri-010', 'ret-005', 'prod-009', 10, 'good', 18.00, 180.00, NULL),
  ('ri-011', 'ret-005', 'prod-012', 4, 'good', 25.00, 100.00, NULL);

-- ==================== CREDIT NOTES ====================
INSERT OR IGNORE INTO credit_notes (id, tenant_id, return_id, customer_id, credit_number, amount, status, applied_to_orders, created_at)
VALUES
  ('cn-001', 'default-tenant-001', 'ret-001', 'cust-005', 'CN-001', 146.25, 'APPLIED', '["so-012"]', '2026-03-05 11:00:00'),
  ('cn-002', 'default-tenant-001', 'ret-002', 'cust-008', 'CN-002', 1035.00, 'ISSUED', NULL, '2026-03-06 15:00:00'),
  ('cn-003', 'default-tenant-001', 'ret-004', 'cust-018', 'CN-003', 402.50, 'APPLIED', '["so-024"]', '2026-03-09 10:00:00'),
  ('cn-004', 'default-tenant-001', NULL, 'cust-011', 'CN-004', 500.00, 'ISSUED', NULL, '2026-03-10 09:00:00'),
  ('cn-005', 'default-tenant-001', NULL, 'cust-001', 'CN-005', 250.00, 'VOIDED', NULL, '2026-03-07 14:00:00');

-- ==================== STOCK MOVEMENTS ====================
INSERT OR IGNORE INTO stock_movements (id, tenant_id, warehouse_id, product_id, movement_type, quantity, reference_type, reference_id, notes, created_by, created_at)
VALUES
  ('sm-001', 'default-tenant-001', 'wh-001', 'prod-001', 'INBOUND', 500, 'purchase_order', 'po-001', 'PO receipt', 'super-admin-001', '2026-03-01 08:00:00'),
  ('sm-002', 'default-tenant-001', 'wh-001', 'prod-002', 'INBOUND', 200, 'purchase_order', 'po-001', 'PO receipt', 'super-admin-001', '2026-03-01 08:00:00'),
  ('sm-003', 'default-tenant-001', 'wh-001', 'prod-009', 'INBOUND', 400, 'purchase_order', 'po-002', 'PO receipt', 'super-admin-001', '2026-03-02 08:00:00'),
  ('sm-004', 'default-tenant-001', 'wh-001', 'prod-001', 'OUTBOUND', 200, 'van_load', 'vsl-001', 'Van Alpha load', 'agent-001', '2026-03-10 06:00:00'),
  ('sm-005', 'default-tenant-001', 'wh-001', 'prod-009', 'OUTBOUND', 150, 'van_load', 'vsl-001', 'Van Alpha load', 'agent-001', '2026-03-10 06:00:00'),
  ('sm-006', 'default-tenant-001', 'wh-001', 'prod-012', 'OUTBOUND', 100, 'van_load', 'vsl-001', 'Van Alpha load', 'agent-001', '2026-03-10 06:00:00'),
  ('sm-007', 'default-tenant-001', 'wh-001', 'prod-001', 'OUTBOUND', 150, 'van_load', 'vsl-002', 'Van Beta load', 'agent-002', '2026-03-10 06:15:00'),
  ('sm-008', 'default-tenant-001', 'wh-001', 'prod-005', 'OUTBOUND', 80, 'van_load', 'vsl-002', 'Van Beta load', 'agent-002', '2026-03-10 06:15:00'),
  ('sm-009', 'default-tenant-001', 'wh-001', 'prod-001', 'RETURN', 20, 'return', 'ret-001', 'Return from Kwik Save', 'agent-002', '2026-03-05 10:30:00'),
  ('sm-010', 'default-tenant-001', 'wh-001', 'prod-012', 'RETURN', 5, 'return', 'ret-001', 'Return damaged stock', 'agent-002', '2026-03-05 10:30:00'),
  ('sm-011', 'default-tenant-001', 'wh-001', 'prod-017', 'ADJUSTMENT', -5, 'stock_adjustment', 'sa-001', 'Damaged in warehouse', 'super-admin-001', '2026-03-03 09:00:00'),
  ('sm-012', 'default-tenant-001', 'wh-002', 'prod-001', 'TRANSFER_IN', 200, 'transfer', NULL, 'Transfer from main warehouse', 'super-admin-001', '2026-03-04 10:00:00'),
  ('sm-013', 'default-tenant-001', 'wh-001', 'prod-001', 'TRANSFER_OUT', 200, 'transfer', NULL, 'Transfer to Sandton DC', 'super-admin-001', '2026-03-04 10:00:00'),
  ('sm-014', 'default-tenant-001', 'wh-003', 'prod-001', 'INBOUND', 300, 'purchase_order', 'po-003', 'Cape Town restock', 'super-admin-001', '2026-03-05 08:00:00'),
  ('sm-015', 'default-tenant-001', 'wh-001', 'prod-012', 'INBOUND', 600, 'purchase_order', 'po-002', 'PO receipt', 'super-admin-001', '2026-03-02 08:00:00');

-- ==================== STOCK ADJUSTMENTS ====================
INSERT OR IGNORE INTO stock_adjustments (id, tenant_id, warehouse_id, product_id, adjustment_type, quantity, reason, reference_type, reference_id, created_by, created_at)
VALUES
  ('sa-001', 'default-tenant-001', 'wh-001', 'prod-017', 'DECREASE', 5, 'Damaged in warehouse - forklift accident', 'DAMAGE', NULL, 'super-admin-001', '2026-03-03 09:00:00'),
  ('sa-002', 'default-tenant-001', 'wh-001', 'prod-014', 'DECREASE', 10, 'Expired stock removed', 'EXPIRY', NULL, 'super-admin-001', '2026-03-05 10:00:00'),
  ('sa-003', 'default-tenant-001', 'wh-001', 'prod-007', 'INCREASE', 20, 'Found miscounted during audit', 'RECOUNT', NULL, 'auditor-001', '2026-03-07 14:00:00'),
  ('sa-004', 'default-tenant-001', 'wh-002', 'prod-009', 'DECREASE', 3, 'Samples given for marketing event', 'PROMO_SAMPLE', NULL, 'manager-001', '2026-03-08 11:00:00'),
  ('sa-005', 'default-tenant-001', 'wh-001', 'prod-004', 'INCREASE', 50, 'Supplier credit - additional stock received', 'SUPPLIER_CREDIT', NULL, 'super-admin-001', '2026-03-09 08:00:00'),
  ('sa-006', 'default-tenant-001', 'wh-003', 'prod-005', 'DECREASE', 8, 'Theft reported and investigated', 'THEFT', NULL, 'manager-001', '2026-03-10 16:00:00');

-- ==================== PURCHASE ORDERS ====================
INSERT OR IGNORE INTO purchase_orders (id, tenant_id, po_number, supplier_name, warehouse_id, total_amount, status, received_at, created_by, created_at)
VALUES
  ('po-001', 'default-tenant-001', 'PO-001', 'SA Beverages Ltd', 'wh-001', 12500.00, 'received', '2026-03-01 10:00:00', 'super-admin-001', '2026-02-25 09:00:00'),
  ('po-002', 'default-tenant-001', 'PO-002', 'Snack Masters SA', 'wh-001', 8400.00, 'received', '2026-03-02 10:00:00', 'super-admin-001', '2026-02-26 09:00:00'),
  ('po-003', 'default-tenant-001', 'PO-003', 'SA Beverages Ltd', 'wh-003', 4500.00, 'received', '2026-03-05 10:00:00', 'super-admin-001', '2026-03-01 09:00:00'),
  ('po-004', 'default-tenant-001', 'PO-004', 'Dairy Fresh Suppliers', 'wh-001', 15200.00, 'partial', NULL, 'super-admin-001', '2026-03-08 09:00:00'),
  ('po-005', 'default-tenant-001', 'PO-005', 'Confectionery World', 'wh-001', 9800.00, 'pending', NULL, 'manager-001', '2026-03-10 09:00:00'),
  ('po-006', 'default-tenant-001', 'PO-006', 'SA Beverages Ltd', 'wh-002', 6200.00, 'draft', NULL, 'super-admin-001', '2026-03-12 09:00:00');

INSERT OR IGNORE INTO purchase_order_items (id, purchase_order_id, product_id, quantity_ordered, quantity_received, unit_cost, line_total)
VALUES
  ('poi-001', 'po-001', 'prod-001', 500, 500, 8.50, 4250.00),
  ('poi-002', 'po-001', 'prod-002', 200, 200, 14.50, 2900.00),
  ('poi-003', 'po-001', 'prod-003', 300, 300, 6.00, 1800.00),
  ('poi-004', 'po-001', 'prod-004', 200, 200, 12.00, 2400.00),
  ('poi-005', 'po-001', 'prod-021', 50, 50, 22.00, 1100.00),
  ('poi-006', 'po-002', 'prod-009', 400, 400, 10.00, 4000.00),
  ('poi-007', 'po-002', 'prod-012', 600, 600, 14.00, 8400.00),
  ('poi-008', 'po-003', 'prod-001', 300, 300, 8.50, 2550.00),
  ('poi-009', 'po-003', 'prod-005', 100, 100, 12.00, 1200.00),
  ('poi-010', 'po-003', 'prod-022', 50, 50, 15.00, 750.00),
  ('poi-011', 'po-004', 'prod-005', 400, 200, 12.00, 4800.00),
  ('poi-012', 'po-004', 'prod-006', 300, 150, 13.00, 3900.00),
  ('poi-013', 'po-004', 'prod-007', 200, 100, 10.00, 2000.00),
  ('poi-014', 'po-004', 'prod-008', 100, 50, 38.00, 3800.00),
  ('poi-015', 'po-004', 'prod-023', 20, 0, 32.00, 640.00),
  ('poi-016', 'po-005', 'prod-012', 300, 0, 14.00, 4200.00),
  ('poi-017', 'po-005', 'prod-013', 200, 0, 11.00, 2200.00),
  ('poi-018', 'po-005', 'prod-014', 300, 0, 6.00, 1800.00),
  ('poi-019', 'po-005', 'prod-025', 100, 0, 16.00, 1600.00);

-- ==================== COMMISSION PAYOUTS ====================
INSERT OR IGNORE INTO commission_payouts (id, tenant_id, earner_id, period_start, period_end, total_amount, status, approved_by, approved_at, paid_at, payment_reference, created_at)
VALUES
  ('cp-001', 'default-tenant-001', 'agent-001', '2026-02-01', '2026-02-28', 1250.00, 'PAID', 'manager-001', '2026-03-02 10:00:00', '2026-03-05 08:00:00', 'EFT-PAY-001', '2026-03-01 08:00:00'),
  ('cp-002', 'default-tenant-001', 'agent-002', '2026-02-01', '2026-02-28', 850.00, 'PAID', 'manager-001', '2026-03-02 10:00:00', '2026-03-05 08:00:00', 'EFT-PAY-002', '2026-03-01 08:00:00'),
  ('cp-003', 'default-tenant-001', 'agent-003', '2026-02-01', '2026-02-28', 1100.00, 'PAID', 'manager-002', '2026-03-02 11:00:00', '2026-03-05 08:00:00', 'EFT-PAY-003', '2026-03-01 08:00:00'),
  ('cp-004', 'default-tenant-001', 'agent-004', '2026-02-01', '2026-02-28', 780.00, 'PAID', 'manager-002', '2026-03-02 11:00:00', '2026-03-05 08:00:00', 'EFT-PAY-004', '2026-03-01 08:00:00'),
  ('cp-005', 'default-tenant-001', 'agent-005', '2026-02-01', '2026-02-28', 950.00, 'PAID', 'manager-001', '2026-03-02 10:00:00', '2026-03-05 08:00:00', 'EFT-PAY-005', '2026-03-01 08:00:00'),
  ('cp-006', 'default-tenant-001', 'agent-001', '2026-03-01', '2026-03-31', 1913.00, 'APPROVED', 'manager-001', '2026-03-12 10:00:00', NULL, NULL, '2026-03-12 08:00:00'),
  ('cp-007', 'default-tenant-001', 'agent-002', '2026-03-01', '2026-03-31', 47.38, 'PENDING', NULL, NULL, NULL, NULL, '2026-03-12 08:00:00'),
  ('cp-008', 'default-tenant-001', 'agent-003', '2026-03-01', '2026-03-31', 477.25, 'PENDING', NULL, NULL, NULL, NULL, '2026-03-12 08:00:00'),
  ('cp-009', 'default-tenant-001', 'agent-005', '2026-03-01', '2026-03-31', 597.00, 'APPROVED', 'manager-001', '2026-03-12 10:00:00', NULL, NULL, '2026-03-12 08:00:00'),
  ('cp-010', 'default-tenant-001', 'manager-001', '2026-03-01', '2026-03-31', 290.63, 'PENDING', NULL, NULL, NULL, NULL, '2026-03-12 08:00:00');

-- ==================== GOALS ====================
INSERT OR IGNORE INTO goals (id, tenant_id, title, description, goal_type, target_value, current_value, start_date, end_date, status, created_by, created_at)
VALUES
  ('goal-001', 'default-tenant-001', 'March Sales Target', 'Achieve R150,000 in total sales for March', 'revenue', 150000, 98500, '2026-03-01', '2026-03-31', 'active', 'super-admin-001', '2026-03-01 08:00:00'),
  ('goal-002', 'default-tenant-001', 'Customer Visits - 200', 'Complete 200 customer visits in March', 'visits', 200, 148, '2026-03-01', '2026-03-31', 'active', 'manager-001', '2026-03-01 08:00:00'),
  ('goal-003', 'default-tenant-001', 'New Customer Acquisition', 'Onboard 10 new customers in March', 'customers', 10, 6, '2026-03-01', '2026-03-31', 'active', 'super-admin-001', '2026-03-01 08:00:00'),
  ('goal-004', 'default-tenant-001', 'Spaza Penetration Drive', 'Visit 50 spaza shops for distribution expansion', 'visits', 50, 32, '2026-03-01', '2026-04-30', 'active', 'manager-002', '2026-03-01 08:00:00'),
  ('goal-005', 'default-tenant-001', 'February Sales Target', 'Achieve R120,000 in total sales for February', 'revenue', 120000, 125800, '2026-02-01', '2026-02-28', 'completed', 'super-admin-001', '2026-02-01 08:00:00');

INSERT OR IGNORE INTO goal_assignments (id, goal_id, user_id, target_value, current_value)
VALUES
  ('ga-001', 'goal-001', 'agent-001', 35000, 28500),
  ('ga-002', 'goal-001', 'agent-002', 20000, 14200),
  ('ga-003', 'goal-001', 'agent-003', 35000, 22800),
  ('ga-004', 'goal-001', 'agent-004', 25000, 16500),
  ('ga-005', 'goal-001', 'agent-005', 35000, 26500),
  ('ga-006', 'goal-002', 'agent-001', 45, 38),
  ('ga-007', 'goal-002', 'agent-002', 40, 32),
  ('ga-008', 'goal-002', 'agent-003', 40, 28),
  ('ga-009', 'goal-002', 'agent-004', 40, 30),
  ('ga-010', 'goal-002', 'agent-005', 35, 20);

-- ==================== CAMPAIGN ASSIGNMENTS ====================
INSERT OR IGNORE INTO campaign_assignments (id, campaign_id, user_id, territory_notes, assigned_at)
VALUES
  ('ca-001', 'camp-001', 'agent-001', 'Cover JHB CBD and Braamfontein areas', datetime('now')),
  ('ca-002', 'camp-001', 'agent-002', 'Cover Yeoville, Berea, Troyeville', datetime('now')),
  ('ca-003', 'camp-001', 'agent-004', 'Cover Soweto areas', datetime('now')),
  ('ca-004', 'camp-002', 'agent-003', 'Cover Sandton premium stores', datetime('now')),
  ('ca-005', 'camp-002', 'agent-005', 'Cover Cape Town stores', datetime('now')),
  ('ca-006', 'camp-003', 'agent-004', 'Soweto spaza shops', datetime('now')),
  ('ca-007', 'camp-003', 'agent-002', 'Alexandra and East Rand spazas', datetime('now'));

-- ==================== ACTIVATIONS ====================
INSERT OR IGNORE INTO activations (id, tenant_id, campaign_id, name, location_description, customer_id, agent_id, scheduled_start, scheduled_end, actual_start, actual_end, start_latitude, start_longitude, status, created_at)
VALUES
  ('act-001', 'default-tenant-001', 'camp-001', 'Summer Tasting - Shoprite Braamfontein', 'Shoprite Braamfontein entrance', 'cust-001', 'agent-001', '2026-03-08 09:00:00', '2026-03-08 15:00:00', '2026-03-08 09:05:00', '2026-03-08 14:55:00', -26.1950, 28.0334, 'completed', '2026-03-01 08:00:00'),
  ('act-002', 'default-tenant-001', 'camp-001', 'Summer Tasting - Pick n Pay Newtown', 'Pick n Pay Newtown front', 'cust-002', 'agent-001', '2026-03-09 09:00:00', '2026-03-09 15:00:00', '2026-03-09 09:10:00', '2026-03-09 14:50:00', -26.2010, 28.0310, 'completed', '2026-03-01 08:00:00'),
  ('act-003', 'default-tenant-001', 'camp-002', 'Product Launch - Woolworths Sandton', 'Woolworths Sandton City main aisle', 'cust-011', 'agent-003', '2026-03-15 10:00:00', '2026-03-15 16:00:00', NULL, NULL, -26.1075, 28.0520, 'scheduled', '2026-03-05 08:00:00'),
  ('act-004', 'default-tenant-001', 'camp-001', 'Summer Tasting - Maponya Mall', 'Shoprite Soweto entrance', 'cust-016', 'agent-004', '2026-03-10 09:00:00', '2026-03-10 15:00:00', '2026-03-10 09:00:00', NULL, -26.2680, 27.8960, 'in_progress', '2026-03-01 08:00:00'),
  ('act-005', 'default-tenant-001', 'camp-003', 'Spaza Distribution Push - Zola', 'Township General Zola area', 'cust-020', 'agent-004', '2026-03-12 08:00:00', '2026-03-12 14:00:00', NULL, NULL, -26.2450, 27.8650, 'scheduled', '2026-03-08 08:00:00');

-- ==================== TRADE PROMOTION ENROLLMENTS ====================
INSERT OR IGNORE INTO trade_promotion_enrollments (id, tenant_id, promotion_id, customer_id, status, enrolled_by, enrolled_at, baseline_volume, target_volume, actual_volume)
VALUES
  ('tpe-001', 'default-tenant-001', 'tp-001', 'cust-001', 'ENROLLED', 'agent-001', '2026-03-02 09:00:00', 100, 200, 160),
  ('tpe-002', 'default-tenant-001', 'tp-001', 'cust-002', 'ENROLLED', 'agent-001', '2026-03-02 10:00:00', 80, 150, 95),
  ('tpe-003', 'default-tenant-001', 'tp-001', 'cust-011', 'ENROLLED', 'agent-003', '2026-03-03 09:00:00', 120, 250, 180),
  ('tpe-004', 'default-tenant-001', 'tp-002', 'cust-016', 'ENROLLED', 'agent-004', '2026-03-03 10:00:00', 50, 100, 65),
  ('tpe-005', 'default-tenant-001', 'tp-002', 'cust-022', 'ENROLLED', 'agent-005', '2026-03-04 09:00:00', 90, 180, 120),
  ('tpe-006', 'default-tenant-001', 'tp-003', 'cust-005', 'ENROLLED', 'agent-002', '2026-03-15 09:00:00', 30, 60, 0),
  ('tpe-007', 'default-tenant-001', 'tp-003', 'cust-006', 'ENROLLED', 'agent-002', '2026-03-15 10:00:00', 25, 50, 0),
  ('tpe-008', 'default-tenant-001', 'tp-001', 'cust-027', 'COMPLETED', 'agent-001', '2026-03-01 09:00:00', 300, 500, 520);

-- ==================== TRADE PROMOTION CLAIMS ====================
INSERT OR IGNORE INTO trade_promotion_claims (id, tenant_id, promotion_id, customer_id, enrollment_id, claim_type, amount, status, evidence, approved_by, approved_at, period_start, period_end, created_at)
VALUES
  ('tpc-001', 'default-tenant-001', 'tp-001', 'cust-001', 'tpe-001', 'VOLUME_REBATE', 145.00, 'APPROVED', '{"invoices":["SO-001","SO-031"],"total_qty":160}', 'manager-001', '2026-03-10 10:00:00', '2026-03-01', '2026-03-10', '2026-03-10 09:00:00'),
  ('tpc-002', 'default-tenant-001', 'tp-001', 'cust-002', 'tpe-002', 'VOLUME_REBATE', 86.00, 'APPROVED', '{"invoices":["SO-002"],"total_qty":95}', 'manager-001', '2026-03-10 10:00:00', '2026-03-01', '2026-03-10', '2026-03-10 09:30:00'),
  ('tpc-003', 'default-tenant-001', 'tp-001', 'cust-011', 'tpe-003', 'VOLUME_REBATE', 163.00, 'PENDING', '{"invoices":["SO-004"],"total_qty":180}', NULL, NULL, '2026-03-01', '2026-03-10', '2026-03-11 09:00:00'),
  ('tpc-004', 'default-tenant-001', 'tp-002', 'cust-016', 'tpe-004', 'DISCOUNT_CLAIM', 97.50, 'APPROVED', '{"invoices":["SO-006"],"total_qty":65}', 'manager-002', '2026-03-11 10:00:00', '2026-03-01', '2026-03-10', '2026-03-11 09:30:00'),
  ('tpc-005', 'default-tenant-001', 'tp-001', 'cust-027', 'tpe-008', 'VOLUME_REBATE', 472.00, 'PAID', '{"invoices":["SO-010","SO-026"],"total_qty":520}', 'super-admin-001', '2026-03-09 14:00:00', '2026-03-01', '2026-03-09', '2026-03-09 12:00:00');

-- ==================== ROLES ====================
INSERT OR IGNORE INTO roles (id, tenant_id, name, description, is_system, created_at)
VALUES
  ('role-001', 'default-tenant-001', 'Super Administrator', 'Full system access', 1, datetime('now')),
  ('role-002', 'default-tenant-001', 'Regional Manager', 'Manage regions and teams', 1, datetime('now')),
  ('role-003', 'default-tenant-001', 'Sales Agent', 'Field sales operations', 1, datetime('now')),
  ('role-004', 'default-tenant-001', 'Van Sales Agent', 'Van-based sales and deliveries', 0, datetime('now')),
  ('role-005', 'default-tenant-001', 'Warehouse Manager', 'Inventory and warehouse operations', 0, datetime('now')),
  ('role-006', 'default-tenant-001', 'Finance Officer', 'Financial operations and reporting', 0, datetime('now')),
  ('role-007', 'default-tenant-001', 'Auditor', 'Compliance and audit access', 1, datetime('now'));

-- ==================== VISIT RESPONSES (survey answers) ====================
INSERT OR IGNORE INTO visit_responses (id, tenant_id, visit_id, questionnaire_id, answers, created_at)
VALUES
  ('vr-r-001', 'default-tenant-001', 'vis-001', 'quest-001', '{"q1":true,"q2":4,"q3":false,"q4":"Good stock levels, shelf well organized"}', '2026-03-10 09:30:00'),
  ('vr-r-002', 'default-tenant-001', 'vis-002', 'quest-001', '{"q1":true,"q2":3,"q3":true,"q4":"Competitor visible in aisle 3"}', '2026-03-10 10:40:00'),
  ('vr-r-003', 'default-tenant-001', 'vis-005', 'quest-001', '{"q1":true,"q2":2,"q3":false,"q4":"Low stock on beverages"}', '2026-03-10 09:20:00'),
  ('vr-r-004', 'default-tenant-001', 'vis-009', 'quest-001', '{"q1":true,"q2":5,"q3":true,"q4":"Premium display in place"}', '2026-03-10 09:15:00'),
  ('vr-r-005', 'default-tenant-001', 'vis-012', 'quest-001', '{"q1":true,"q2":4,"q3":false,"q4":"Restocked all shelves"}', '2026-03-10 09:40:00'),
  ('vr-r-006', 'default-tenant-001', 'vis-007', 'quest-002', '{"q1":true,"q2":true,"q3":false,"q4":60}', '2026-03-10 11:10:00'),
  ('vr-r-007', 'default-tenant-001', 'vis-011', 'quest-002', '{"q1":true,"q2":true,"q3":true,"q4":80}', '2026-03-10 11:20:00');

-- ==================== AGENT LOCATIONS (real-time tracking) ====================
INSERT OR IGNORE INTO agent_locations (id, tenant_id, user_id, latitude, longitude, accuracy, created_at)
VALUES
  ('al-001', 'default-tenant-001', 'agent-001', -26.1950, 28.0334, 10.5, '2026-03-12 09:00:00'),
  ('al-002', 'default-tenant-001', 'agent-002', -26.1790, 28.0650, 8.2, '2026-03-12 09:05:00'),
  ('al-003', 'default-tenant-001', 'agent-003', -26.1075, 28.0520, 12.0, '2026-03-12 09:10:00'),
  ('al-004', 'default-tenant-001', 'agent-004', -26.2680, 27.8960, 6.5, '2026-03-12 09:15:00'),
  ('al-005', 'default-tenant-001', 'agent-005', -33.9060, 18.4210, 9.0, '2026-03-12 09:20:00');

-- ==================== ROUTE PLANS ====================
INSERT OR IGNORE INTO route_plans (id, tenant_id, agent_id, plan_date, status, created_at)
VALUES
  ('rp-001', 'default-tenant-001', 'agent-001', '2026-03-12', 'active', '2026-03-12 06:00:00'),
  ('rp-002', 'default-tenant-001', 'agent-002', '2026-03-12', 'active', '2026-03-12 06:00:00'),
  ('rp-003', 'default-tenant-001', 'agent-003', '2026-03-12', 'active', '2026-03-12 06:00:00'),
  ('rp-004', 'default-tenant-001', 'agent-004', '2026-03-12', 'active', '2026-03-12 06:00:00'),
  ('rp-005', 'default-tenant-001', 'agent-005', '2026-03-12', 'active', '2026-03-12 06:00:00');

INSERT OR IGNORE INTO route_plan_stops (id, route_plan_id, customer_id, sequence_order, estimated_arrival, status, created_at)
VALUES
  ('rps-001', 'rp-001', 'cust-027', 1, '2026-03-12 08:30:00', 'in_progress', '2026-03-12 06:00:00'),
  ('rps-002', 'rp-001', 'cust-001', 2, '2026-03-12 10:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-003', 'rp-001', 'cust-002', 3, '2026-03-12 11:30:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-004', 'rp-001', 'cust-044', 4, '2026-03-12 13:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-005', 'rp-002', 'cust-010', 1, '2026-03-12 09:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-006', 'rp-002', 'cust-035', 2, '2026-03-12 10:30:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-007', 'rp-002', 'cust-038', 3, '2026-03-12 12:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-008', 'rp-003', 'cust-014', 1, '2026-03-12 09:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-009', 'rp-003', 'cust-031', 2, '2026-03-12 10:30:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-010', 'rp-004', 'cust-045', 1, '2026-03-12 09:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-011', 'rp-004', 'cust-032', 2, '2026-03-12 10:00:00', 'pending', '2026-03-12 06:00:00'),
  ('rps-012', 'rp-005', 'cust-037', 1, '2026-03-12 09:00:00', 'pending', '2026-03-12 06:00:00');
