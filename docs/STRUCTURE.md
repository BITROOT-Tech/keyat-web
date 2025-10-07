# STRUCTURE

# KEYAT  APP - BOTSWANA REAL ESTATE PLATFORM

## *The InDrive/Yango of Botswana Real Estate*

**Powered by BITROOT** | Multi-service real estate ecosystem

---

## 🎯 **PLATFORM VISION**

Keyat is Botswana's first comprehensive real estate super app, connecting:

- **Landlords** with tenants
- **Tenants** seeking properties
- **Real Estate Agents** with clients
- **Moving Services** with customers
- **Property Services** (maintenance, cleaning, security)
- **Financial Services** (loans, insurance, payments)

### 🌍 **Target Market: Botswana**

- **Primary Cities**: Gaborone, Francistown, Maun, Kasane
- **Languages**: English, Setswana
- **Currency**: Botswana Pula (BWP)
- **Payment Methods**: Orange Money, Mascom MyZaka, Bank transfers

---

## 🏗️ **PLATFORM MODULES**

### 1. **PROPERTY RENTALS** 📍

- Short-term rentals (Airbnb-style)
- Long-term rentals (monthly/yearly)
- Student accommodation
- Corporate housing
- Vacation homes

### 2. **PROPERTY SALES** 🏠

- Residential properties
- Commercial properties
- Land sales
- Property auctions
- Investment properties

### 3. **AGENT NETWORK** 🤝

- Verified real estate agents
- Agent ratings and reviews
- Commission management
- Lead distribution system
- Agent marketing tools

### 4. **MOVING SERVICES** 🚛

- Local moving companies
- Inter-city transport
- Furniture delivery
- Packing services
- Storage solutions

### 5. **PROPERTY SERVICES** 🔧

- Maintenance and repairs
- Cleaning services
- Security services
- Garden services
- Interior design

### 6. **FINANCIAL SERVICES** 💰

- Mortgage applications
- Property insurance
- Rent-to-own options
- Payment plans
- Investment advice

---

## 👥 **USER TYPES & PERMISSIONS**

### **TENANTS/BUYERS** (Consumers)

- Browse and search properties
- Book viewings and rentals
- Apply for mortgages
- Request moving services
- Rate and review services

### **LANDLORDS/SELLERS** (Property Owners)

- List properties for rent/sale
- Manage tenant applications
- Handle bookings and payments
- Request property services
- View analytics and earnings

### **AGENTS** (Real Estate Professionals)

- Manage property listings
- Handle client relationships
- Process transactions
- Earn commissions
- Access lead generation tools

### **SERVICE PROVIDERS** (Moving/Maintenance)

- Register and verify services
- Receive job requests
- Manage schedules
- Process payments
- Build reputation through ratings

### **SUPER ADMIN** (Platform Management)

- Oversee all operations
- Manage user verifications
- Handle disputes
- Monitor platform health
- Generate reports

---

## 🗄️ **DATABASE SCHEMA EXPANSION**

```sql
-- Core User Types
user_types: tenant, landlord, agent, service_provider, admin

-- Property Categories
property_categories: rental, sale, commercial, land, student_housing

-- Service Categories
service_categories: moving, cleaning, maintenance, security, design

-- Location Data (Botswana-specific)
locations: gaborone, francistown, maun, kasane, jwaneng, lobatse

-- Payment Methods (Botswana)
payment_methods: orange_money, mascom_myzaka, bank_transfer, cash

```

### **New Tables Required:**

**Real Estate Agents**

- agent_profiles
- agent_licenses
- agent_commissions
- agent_leads

**Moving Services**

- moving_companies
- moving_requests
- moving_quotes
- vehicle_fleet

**Property Services**

- service_providers
- service_requests
- service_bookings
- service_categories

**Financial Services**

- mortgage_applications
- insurance_policies
- payment_plans
- financial_products

---

## 📱 **APP STRUCTURE (Updated)**

`src/app/
├── (consumer)/              # Tenant/Buyer interface
│   ├── dashboard/           # ← ADDED: Consumer dashboard
│   ├── search/
│   ├── property/
│   ├── booking/
│   ├── moving/
│   └── services/
│
├── (landlord)/              # Property Owner interface
│   ├── properties/
│   ├── tenants/
│   ├── earnings/
│   └── services/
│
├── (agent)/                 # Real Estate Agent interface
│   ├── listings/
│   ├── clients/
│   ├── commissions/
│   └── leads/
│
├── (service-provider)/      # Moving/Maintenance companies
│   ├── jobs/
│   ├── schedule/
│   ├── earnings/
│   └── fleet/
│
├── (admin)/                 # Platform management
│   ├── users/
│   ├── properties/
│   ├── transactions/
│   ├── disputes/
│   └── analytics/
│
└── api/
    ├── properties/
    ├── bookings/
    ├── agents/
    ├── moving/
    ├── services/
    ├── payments/
    ├── notifications/
    └── analytics/

---

## 🚀 **DEVELOPMENT PHASES**

### **PHASE 1: CORE RENTALS (Months 1-3)**

- Property listings (rent/sale)
- User registration (all types)
- Basic search and booking
- Payment integration (Orange Money, Mascom)
- Mobile-responsive web app

### **PHASE 2: AGENT NETWORK (Months 4-6)**

- Agent registration and verification
- Commission system
- Lead distribution
- Agent dashboard
- Client management

### **PHASE 3: MOVING SERVICES (Months 7-9)**

- Moving company onboarding
- Service request system
- Quote comparison
- Booking and scheduling
- Rating and reviews

### **PHASE 4: PROPERTY SERVICES (Months 10-12)**

- Maintenance service providers
- Service categories expansion
- Recurring service bookings
- Quality assurance system
- Service provider network

### **PHASE 5: FINANCIAL SERVICES (Year 2)**

- Mortgage application system
- Insurance partnerships
- Rent-to-own programs
- Investment tools
- Financial analytics

---

## 💰 **REVENUE STREAMS**

### **Commission-Based Revenue**

- **Property Rentals**: 3-5% commission on bookings
- **Property Sales**: 1-3% commission on transactions
- **Agent Network**: 10-20% of agent commissions
- **Moving Services**: 10-15% commission on bookings
- **Property Services**: 10-15% commission on services

### **Subscription Revenue**

- **Premium Landlord**: BWP 200/month (featured listings, analytics)
- **Pro Agent**: BWP 500/month (unlimited listings, lead priority)
- **Service Provider Plus**: BWP 300/month (priority booking, marketing)

### **Additional Revenue**

- **Advertising**: Property developers, mortgage companies
- **Lead Generation**: Qualified leads to agents and services
- **Financial Services**: Partnerships with banks and insurers
- **Data Analytics**: Market insights for institutions

---

## 🎯 **BOTSWANA-SPECIFIC FEATURES**

### **Local Integration**

- **Language Support**: English and Setswana
- **Currency**: Botswana Pula (BWP) with live exchange rates
- **Payment Methods**: Orange Money, Mascom MyZaka integration
- **Location Services**: Gaborone neighborhoods, landmarks
- **Legal Compliance**: Botswana property laws and regulations

### **Cultural Considerations**

- **Traditional Property Types**: Include traditional homes
- **Community Features**: Neighborhood information, schools, clinics
- **Public Transport**: Combi routes, taxi ranks
- **Safety Information**: Crime statistics, security features

### **Government Integration**

- **Property Registration**: Interface with Deeds Registry
- **Tax Calculations**: Property transfer tax, rental tax
- **Permit Requirements**: Business licenses, agent certifications
- **Compliance Monitoring**: Regulatory requirements

---

## 📊 **SUCCESS METRICS**

### **Year 1 Targets**

- 10,000+ registered users
- 2,000+ property listings
- 500+ completed bookings
- 100+ verified agents
- 50+ service providers
- BWP 500,000+ GMV (Gross Merchandise Value)

### **Year 3 Vision**

- 100,000+ users across Botswana
- 15,000+ properties listed
- 5,000+ monthly transactions
- 1,000+ agents in network
- 500+ service providers
- BWP 50M+ annual GMV

---

## 🛡️ **PLATFORM GOVERNANCE**

### **Quality Control**

- **User Verification**: ID verification, background checks
- **Property Verification**: Site visits, document validation
- **Service Quality**: Rating systems, quality audits
- **Dispute Resolution**: Mediation system, refund policies

### **Trust & Safety**

- **Secure Payments**: Escrow system, fraud detection
- **Background Checks**: Agent licensing, criminal background
- **Insurance**: Platform liability, user protection
- **Emergency Support**: 24/7 customer service

---

## 🎨 **BRAND POSITIONING**

**Tagline**: *"Your Complete Real Estate Solution"*

**Value Propositions**:

- **For Tenants**: "Find your perfect home in Botswana"
- **For Landlords**: "Maximize your property income"
- **For Agents**: "Grow your real estate business"
- **For Services**: "Connect with property customers"

**Competitive Advantages**:

- First comprehensive real estate super app in Botswana
- Local payment method integration
- Multi-language support
- Verified professional network
- End-to-end service ecosystem

---

*This platform positions Keyat as the dominant real estate marketplace in Botswana, creating a comprehensive ecosystem that serves all stakeholders in the property market.*