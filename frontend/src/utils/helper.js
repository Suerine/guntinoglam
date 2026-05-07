export const getWhatsAppLink = (product) => {
  const phoneNumber = "254748312150"; // your number

  const message = `Hello, I'm interested in:
   ${product.name}
   Price: KSh ${product.price}
   Link: ${window.location.href}`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
