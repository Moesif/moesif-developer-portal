
# Data Model

For the purpose of this project, the data model is based on below. This is just one approach, as this repo is just glue code, if your data model needs are different, you may need to adjust some of the code.

## Moesif

- User
  - This represents single user.
- Company
  - A company represent an organization that may have many users, and it may have one more subscription
- Subscription
  - The subscription is associated with the Company. In Moesif, the subscription objects is usually synced from Billing Providers.
- Plans
  - Same definition as Stripe, and synced with billing provider
- Price
  - Same definition as Stripe, and synced with billing provider

## Stripe (one of the most popular billing providers)

- Plans
  - Plans define the base price, currency, and billing cycle for recurring purchases of products.
- Price
  - Defines a specific price or rate for a usage.
- Subscription
  - The subscription is associated with a customer. Synced to Moesif Subscription object above.
- Customer
  - A customer can have multiple subscription.
  - For this project, the `stripe_customer_id` mapped to Moesif `company_id`, and Moesif `user_id` because it is an simplification. And most use cases is only one user anyways.
  - If your have use cases where there is multiple "users" that uses same subscription, then you should still evaluation your data mapping.


## Auth Provider

- User
  - Usually uniq by email.

## API gateways

- Customer (usually a concept of a customer)
  - That represent one API key. For purposes of this project, the customer id is mapped to `stripe_customer_id` and `moesif_company_id`

## Your Company

Evaluate object mapping and adjust for your use case and your business:

  - You may have different entity mapping needs, for example, you may have concept of company and users in your system. And they each may already an id. Sometimes those id are better suited for mapping than in this repo.
  - It is important to be be aware of the data model in different systems, and how you want to map them together.

