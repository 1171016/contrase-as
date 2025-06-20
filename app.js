function generatePassword(length, name, useLower, useUpper, useNumbers, useSymbols) {
  let pool = '';
  if (useLower) pool += "abcdefghijklmnopqrstuvwxyz";
  if (useUpper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (useNumbers) pool += "0123456789";
  if (useSymbols) pool += "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";

  // Añadir letras del nombre opcionalmente
  if (name && name.length > 0) {
    const extraChars = name.replace(/\s+/g, '').toLowerCase();
    pool += extraChars;
  }

  if (pool.length === 0) return '';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += pool.charAt(Math.floor(Math.random() * pool.length));
  }
  return password;
}

function calculateEntropy(password, useLower, useUpper, useNumbers, useSymbols) {
  let pool = 0;
  if (useLower) pool += 26;
  if (useUpper) pool += 26;
  if (useNumbers) pool += 10;
  if (useSymbols) pool += 32;
  return Math.log2(pool) * password.length;
}

function getSecurityLevel(entropy) {
  if (entropy < 40) return { level: "Débil", class: "weak" };
  if (entropy < 60) return { level: "Media", class: "medium" };
  return { level: "Fuerte", class: "strong" };
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Eventos
document.getElementById("generateBtn").addEventListener("click", async () => {
  const length = parseInt(document.getElementById("length").value);
  const name = document.getElementById("name").value;
  const useLower = document.getElementById("useLower").checked;
  const useUpper = document.getElementById("useUpper").checked;
  const useNumbers = document.getElementById("useNumbers").checked;
  const useSymbols = document.getElementById("useSymbols").checked;

  const pwd = generatePassword(length, name, useLower, useUpper, useNumbers, useSymbols);
  document.getElementById("password").value = pwd;

  const entropy = calculateEntropy(pwd, useLower, useUpper, useNumbers, useSymbols);
  document.getElementById("entropy").value = entropy.toFixed(2) + " bits";

  const security = getSecurityLevel(entropy);
  const securityDiv = document.getElementById("security");
  securityDiv.textContent = security.level;
  securityDiv.className = `security ${security.class}`;

  const hash = await sha256(pwd);
  document.getElementById("hash").value = hash;
});
