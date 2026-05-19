import React from 'react'
import { Helmet } from 'react-helmet-async'

const Cart = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>Shopping Cart | Guntino Glam</title>
        <meta name="description" content="Review and manage your shopping cart at Guntino Glam. Proceed to checkout to complete your purchase of premium Somali fashion." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://guntinoglam.com/cart" />
      </Helmet>
      {children}
    </>
  )
}

const Checkout = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>Checkout | Guntino Glam</title>
        <meta name="description" content="Secure checkout for your Guntino Glam purchase. Fast shipping to Nairobi and across Kenya." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://guntinoglam.com/checkout" />
      </Helmet>
      {children}
    </>
  )
}

const Orders = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>My Orders | Guntino Glam</title>
        <meta name="description" content="Track and manage your Guntino Glam orders. View order history and status updates." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://guntinoglam.com/orders" />
      </Helmet>
      {children}
    </>
  )
}

const Wishlist = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>My Wishlist | Guntino Glam</title>
        <meta name="description" content="Save your favorite Somali fashion pieces to your Guntino Glam wishlist." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://guntinoglam.com/wishlist" />
      </Helmet>
      {children}
    </>
  )
}

const Profile = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>My Account | Guntino Glam</title>
        <meta name="description" content="Manage your Guntino Glam account. View profile, orders, wishlist, and preferences." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://guntinoglam.com/profile" />
      </Helmet>
      {children}
    </>
  )
}

const InfoPages = {
  ShippingReturns: ({ children }) => (
    <>
      <Helmet>
        <title>Shipping & Returns | Guntino Glam</title>
        <meta name="description" content="Learn about Guntino Glam's shipping policy, delivery times to Nairobi and Kenya, and hassle-free returns." />
        <link rel="canonical" href="https://guntinoglam.com/shipping-returns" />
      </Helmet>
      {children}
    </>
  ),
  RefundPolicy: ({ children }) => (
    <>
      <Helmet>
        <title>Refund Policy | Guntino Glam</title>
        <meta name="description" content="Guntino Glam refund policy - Understand our refund procedures, timelines, and customer service." />
        <link rel="canonical" href="https://guntinoglam.com/refund-policy" />
      </Helmet>
      {children}
    </>
  ),
  TermsOfService: ({ children }) => (
    <>
      <Helmet>
        <title>Terms of Service | Guntino Glam</title>
        <meta name="description" content="Review Guntino Glam's terms of service, user agreements, and conditions of use." />
        <link rel="canonical" href="https://guntinoglam.com/terms-of-service" />
      </Helmet>
      {children}
    </>
  ),
  OrderInformation: ({ children }) => (
    <>
      <Helmet>
        <title>Order Information | Guntino Glam</title>
        <meta name="description" content="Need help with your order? Contact Guntino Glam for order tracking, modifications, and support." />
        <link rel="canonical" href="https://guntinoglam.com/order-information" />
      </Helmet>
      {children}
    </>
  ),
}

export { Cart, Checkout, Orders, Wishlist, Profile, InfoPages }
