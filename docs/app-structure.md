src/app/
├── consumer/                 # Tenant/Buyer interface - CLEAN
│   ├── dashboard/           
│   ├── search/             
│   ├── property/
│   │   └── [id]/          
│   ├── profile/      
│   ├── booking/            
│   ├── moving/
│   └── services/
│
├── landlord/                # Property Owner interface - CLEAN
│   ├── dashboard/          
│   ├── properties/
│   ├── tenants/
│   ├── earnings/
│   └── services/
│
├── agent/                   # Real Estate Agent interface - CLEAN
│   ├── dashboard/
│   ├── listings/
│   ├── clients/
│   ├── commissions/
│   └── leads/
│
├── service-provider/        # Moving/Maintenance companies - CLEAN
│   ├── dashboard/
│   ├── jobs/
│   ├── schedule/
│   ├── earnings/
│   └── fleet/
│
├── admin/                   # Platform management - CLEAN
│   ├── dashboard/
│   ├── users/
│   ├── properties/
│   ├── transactions/
│   ├── disputes/
│   └── analytics/
│
├── auth/                    # Authentication - CLEAN
│   ├── login/
│   ├── register/
│   └── reset-password/
│
└── api/                     # API routes
    ├── properties/
    ├── bookings/
    ├── agents/
    ├── moving/
    ├── services/
    ├── payments/
    ├── notifications/
    └── analytics/