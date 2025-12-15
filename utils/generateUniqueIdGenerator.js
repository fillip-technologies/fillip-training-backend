export default function generateUniqueId(prefixInput) {
  const envPrefix = process.env.COMPANY_NAME;
  const prefix = prefixInput || envPrefix;

  const date = new Date();
  const datePart = date.toISOString().slice(2, 10).replace(/-/g, ""); 
  const timePart = date.toISOString().slice(11, 19).replace(/:/g, ""); 


  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${prefix}-${datePart}-${timePart}-${randomPart}`;
}

