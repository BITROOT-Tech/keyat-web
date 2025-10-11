# 🔐 Keyat Development Accounts

**Quick reference for testing all user roles with same password: `Password123!`**

## 🎯 Quick Login Reference

| Role | Email | Password | Purpose | Dashboard |
|------|-------|----------|---------|-----------|
| 🏠 **Consumer** | `tenant@keyat.co.bw` | `Password123!` | Browse & book properties | `/dashboard` |
| 🏢 **Landlord** | `landlord@keyat.co.bw` | `Password123!` | Manage properties & tenants | `/landlord/dashboard` |
| 🤝 **Agent** | `agent@keyat.co.bw` | `Password123!` | List properties & manage clients | `/agent/dashboard` |
| 🔧 **Service** | `service@keyat.co.bw` | `Password123!` | Moving & maintenance services | `/service-provider/dashboard` |
| ⚡ **Admin** | `admin@keyat.co.bw` | `Password123!` | Platform management | `/admin/dashboard` |

## 🚀 Quick Switch Utility

```typescript
// In browser console during development:
await quickLogin('tenant@keyat.co.bw')
// or
await quickLogin('landlord@keyat.co.bw')