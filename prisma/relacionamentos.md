User 1:N Account
User 1:N Session
User N:N Organization via Membership

Organization 1:N Membership
Organization 1:N Invitation
Organization 1:N Subscription
Organization 1:N CreditLedger
Organization 1:N Asset
Organization 1:N Generation
Organization 1:1 BrandProfile

Plan 1:N Subscription

Generation N:N Asset via GenerationInputAsset
Generation 1:1 Asset como outputAsset
PromptTemplate 1:N Generation


Implemente o schema Prisma exatamente conforme a arquitetura definida.

Stack:
- Next.js
- Prisma
- PostgreSQL Neon
- SaaS multi-tenant

Regras:
- User representa a pessoa que faz login.
- Organization representa a empresa cliente.
- Membership liga User e Organization.
- Dados do produto pertencem à Organization, não diretamente ao User.
- Use onDelete: Cascade apenas em dados que não fazem sentido sem o pai.
- Use onDelete: SetNull para autoria/histórico, como createdById, uploadedById e actorId.
- Não salvar API key pura, apenas hash e prefixo.
- Criar models: User, Account, Session, VerificationToken, Organization, Membership, Invitation, Plan, Subscription, Invoice, Payment, WebhookEvent, CreditLedger, BrandProfile, Asset, PromptTemplate, Generation, GenerationInputAsset, ApiKey, Notification e AuditLog.
- Não rode migration destrutiva sem pedir confirmação.