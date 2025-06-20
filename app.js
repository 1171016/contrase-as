// Generar contraseña
function generatePassword(length, options, name) {
  let pool = "";
  if (options.lower) pool += "abcdefghijklmnopqrstuvwxyz";
  if (options.upper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.numbers) pool += "0123456789";
  if (options.symbols) pool += "!@#$%^&*()-_=+<>?";

  let extraLetters = "";
  if (name) extraLetters = name.replace(/[^A-Za-z]/g, "").slice(0, 3);

  let pwd = "";
  for (let i = 0; i < length; i++) {
    const source = i < extraLetters.length ? extraLetters : pool;
    pwd += source.charAt(Math.floor(Math.random() * source.length));
  }
  return pwd;
}

// Calcular entropía
function calculateEntropy(password, options) {
  let pool = 0;
  if (options.lower) pool += 26;
  if (options.upper) pool += 26;
  if (options.numbers) pool += 10;
  if (options.symbols) pool += 32;
  return Math.log2(pool) * password.length;
}

// Nivel de seguridad
function getSecurityLevel(entropy) {
  if (entropy < 40) return { level: "Débil", className: "weak" };
  if (entropy < 60) return { level: "Media", className: "medium" };
  return { level: "Fuerte", className: "strong" };
}

// SHA-256 hash
async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Eventos
document.getElementById('generateBtn').addEventListener('click', async () => {
  const length = parseInt(document.getElementById('length').value) || 12;
  const name = document.getElementById('name').value;
  const options = {
    lower: document.getElementById('useLower').checked,
    upper: document.getElementById('useUpper').checked,
    numbers: document.getElementById('useNumbers').checked,
    symbols: document.getElementById('useSymbols').checked
  };

  // Validar que al menos una casilla esté marcada
  if (!options.lower && !options.upper && !options.numbers && !options.symbols) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = "⚠️ Debes seleccionar al menos una opción para generar la contraseña.";
    return;
  } else {
    document.getElementById('errorMessage').innerText = "";
  }

  const pwd = generatePassword(length, options, name);
  document.getElementById('password').value = pwd;

  const entropy = calculateEntropy(pwd, options);
  document.getElementById('entropy').value = entropy.toFixed(2) + " bits";

  const level = getSecurityLevel(entropy);
  const security = document.getElementById('security');
  security.innerText = level.level;
  security.className = "security " + level.className;

  document.getElementById('hash').value = await sha256(pwd);
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const pwd = document.getElementById('password').value;
  if (!pwd) return; // No copiar si no hay contraseña
  await navigator.clipboard.writeText(pwd);
  const copyMessage = document.getElementById('copyMessage');
  copyMessage.style.display = "block";
  setTimeout(() => copyMessage.style.display = "none", 2000);
});


