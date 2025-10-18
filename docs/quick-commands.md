```markdown
# Keyat - Daily Commands

## Start/Stop
```powershell
npm run dev
Ctrl + C
```

## Cache Clear
```powershell
rm -r .next; npm run dev
```

## Test Accounts
- Admin: `admin@keyat.co.bw` / `Password123!`
- Tenant: `tenant@keyat.co.bw` / `Password123!`

## URLs
- Local: http://localhost:3000
- Admin: http://localhost:3000/admin/dashboard
- Login: http://localhost:3000/auth/login

## Emergency
```powershell
rm -r .next, node_modules\.cache; npm run dev
```
```