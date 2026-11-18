/**
 * BlueRay Wealth - Cross-Device Zero-Backend Admin Authentication
 * Stores salted SHA-256 hashes in admin-auth.json (never plain text).
 * Syncs credential changes across ALL devices via GitHub API (zero backend).
 * Shared by admin.html and seo-admin.html.
 */
(function (window) {
  'use strict';

  const SESSION_KEY = 'blueray_admin_session_v2';
  const AUTH_CACHE_KEY = 'blueray_admin_auth_cache';
  const GH_STORAGE_KEY = 'blueray_seo_gh_config';

  const DEFAULT_GH = {
    owner: 'Developer-Satish-27',
    repo: 'blueraywealth',
    branch: 'main',
    token: ''
  };

  // Fallback copy of initial admin-auth.json (used only if opened offline via file://)
  const FALLBACK_AUTH_RECORD = {
    version: 1,
    algorithm: 'SHA-256',
    salt: 'brw_a7d3f91c4e82b506',
    usernameHash: 'eb6b770e38b32c4133df09bea9c7ed7f8324087cea6157b554e7ddacd63e9e0d',
    credentialHash: '3235c2e84ab779c4ffd14d4c276e35b7255766b9e5371632c211f37722a82ea7',
    updatedAt: '2026-11-18T12:44:35.892Z'
  };

  // Pure-JS SHA-256 fallback (works even on file:// or non-HTTPS local preview)
  function sha256Fallback(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';
    const words = [];
    const bytes = new TextEncoder().encode(ascii);
    const asciiBitLength = bytes.length * 8;

    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    const padded = new Uint8Array(bytes.length + 1);
    padded.set(bytes);
    padded[bytes.length] = 0x80;

    let totalLen = padded.length;
    while (totalLen % 64 !== 56) totalLen++;
    const full = new Uint8Array(totalLen);
    full.set(padded);

    for (let i = 0; i < full.length; i++) {
      words[i >> 2] |= full[i] << ((3 - (i % 4)) * 8);
    }
    while (words.length < totalLen / 4) words.push(0);
    words.push((asciiBitLength / maxWord) | 0);
    words.push(asciiBitLength | 0);

    for (let j = 0; j < words.length;) {
      const w = words.slice(j, j += 16);
      const oldHash = hash.slice(0);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  async function sha256(str) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const data = new TextEncoder().encode(str);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (e) {
        return sha256Fallback(str);
      }
    }
    return sha256Fallback(str);
  }

  function generateSalt() {
    const arr = new Uint8Array(8);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
    } else {
      for (let i = 0; i < 8; i++) arr[i] = Math.floor(Math.random() * 256);
    }
    return 'brw_' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function encodeBase64UTF8(str) {
    const bytes = new TextEncoder().encode(str);
    let binStr = '';
    for (let i = 0; i < bytes.length; i++) binStr += String.fromCharCode(bytes[i]);
    return btoa(binStr);
  }

  function decodeBase64UTF8(b64) {
    const clean = (b64 || '').replace(/\n/g, '');
    const binStr = atob(clean);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
    return new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes);
  }

  function getGhConfig() {
    try {
      const saved = localStorage.getItem(GH_STORAGE_KEY);
      if (saved) return Object.assign({}, DEFAULT_GH, JSON.parse(saved));
    } catch (e) {}
    return Object.assign({}, DEFAULT_GH);
  }

  function isGhConnected() {
    const cfg = getGhConfig();
    return !!(cfg.token && cfg.owner && cfg.repo);
  }

  function saveGhConfig(cfg) {
    localStorage.setItem(GH_STORAGE_KEY, JSON.stringify(Object.assign({}, DEFAULT_GH, cfg)));
  }

  function disconnectGh() {
    localStorage.removeItem(GH_STORAGE_KEY);
  }

  function getCachedAuthRecord() {
    try {
      const raw = localStorage.getItem(AUTH_CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function pickNewest(records) {
    const valid = records.filter(r => r && r.salt && r.credentialHash);
    if (!valid.length) return FALLBACK_AUTH_RECORD;
    valid.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    return valid[0];
  }

  // Loads the most up-to-date admin-auth.json across GitHub / Live Domain / Local Cache
  async function loadAuthRecord() {
    const candidates = [];
    const cached = getCachedAuthRecord();
    if (cached) candidates.push(cached);

    const cfg = getGhConfig();

    // 1. If GitHub token is connected, fetch live from GitHub API (zero CDN delay)
    if (isGhConnected()) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/admin-auth.json?ref=${encodeURIComponent(cfg.branch)}&_t=${Date.now()}`,
          {
            headers: {
              'Authorization': `Bearer ${cfg.token}`,
              'Accept': 'application/vnd.github+json'
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(decodeBase64UTF8(data.content));
          candidates.push(parsed);
        }
      } catch (e) {}
    }

    // 2. Fetch live admin-auth.json from website origin (works on every device without token!)
    try {
      const res = await fetch(`./admin-auth.json?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const parsed = await res.json();
        candidates.push(parsed);
      }
    } catch (e) {}

    // 3. Also try public GitHub API if no token (handles instant cross-device updates before GitHub Pages CDN refreshes)
    if (!isGhConnected() && window.location.protocol !== 'file:') {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/admin-auth.json?ref=${encodeURIComponent(cfg.branch)}&_t=${Date.now()}`,
          { headers: { 'Accept': 'application/vnd.github+json' } }
        );
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(decodeBase64UTF8(data.content));
          candidates.push(parsed);
        }
      } catch (e) {}
    }

    const newest = pickNewest(candidates);
    try {
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(newest));
    } catch (e) {}
    return newest;
  }

  async function verifyCredentials(username, password) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = password || '';
    if (!cleanUser || !cleanPass) return { valid: false, error: 'Please enter both username and password.' };

    const record = await loadAuthRecord();
    const enteredHash = await sha256(`${record.salt}:${cleanUser}:${cleanPass}`);
    if (enteredHash === record.credentialHash) {
      return { valid: true, username: cleanUser, record };
    }
    return { valid: false, error: 'Invalid username or password.' };
  }

  async function createAuthRecord(newUsername, newPassword) {
    const cleanUser = (newUsername || '').trim().toLowerCase();
    const cleanPass = newPassword || '';
    const salt = generateSalt();
    const usernameHash = await sha256(`${salt}:${cleanUser}`);
    const credentialHash = await sha256(`${salt}:${cleanUser}:${cleanPass}`);
    return {
      version: 1,
      algorithm: 'SHA-256',
      salt,
      usernameHash,
      credentialHash,
      updatedAt: new Date().toISOString()
    };
  }

  // Publishes updated admin-auth.json directly to GitHub so EVERY device uses the new credentials
  async function updateCredentialsLive(currentUsername, currentPassword, newUsername, newPassword) {
    const cleanNewUser = (newUsername || '').trim();
    if (cleanNewUser.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Verify existing credentials first
    const check = await verifyCredentials(currentUsername, currentPassword);
    if (!check.valid) {
      throw new Error('Current username or password is incorrect.');
    }

    if (!isGhConnected()) {
      const err = new Error('GITHUB_NOT_CONNECTED');
      err.code = 'GITHUB_NOT_CONNECTED';
      throw err;
    }

    const newRecord = await createAuthRecord(cleanNewUser, newPassword);
    const jsonContent = JSON.stringify(newRecord, null, 2) + '\n';

    const cfg = getGhConfig();
    const apiUrl = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/admin-auth.json`;

    // Fetch existing file SHA if present
    let sha = null;
    try {
      const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(cfg.branch)}&_t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${cfg.token}`,
          'Accept': 'application/vnd.github+json'
        }
      });
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }
    } catch (e) {}

    const body = {
      message: 'security(admin): update cross-device admin credentials (hashed)',
      content: encodeBase64UTF8(jsonContent),
      branch: cfg.branch
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cfg.token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || `GitHub update failed (${putRes.status})`);
    }

    // Cache immediately for current browser & update session username
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(newRecord));
    setAuthenticated(cleanNewUser.toLowerCase());
    return { success: true, record: newRecord };
  }

  function isAuthenticated() {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      if (!s) return false;
      const parsed = JSON.parse(s);
      return !!(parsed && parsed.authenticated === true);
    } catch (e) {
      return false;
    }
  }

  function getSessionUsername() {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
      return s.username || '';
    } catch (e) {
      return '';
    }
  }

  function setAuthenticated(username) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      authenticated: true,
      username: (username || '').trim().toLowerCase(),
      loginAt: Date.now()
    }));
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('blueray_admin_auth');
    sessionStorage.removeItem('blueray_seo_auth');
  }

  window.AdminAuth = {
    sha256,
    loadAuthRecord,
    verifyCredentials,
    createAuthRecord,
    updateCredentialsLive,
    getGhConfig,
    isGhConnected,
    saveGhConfig,
    disconnectGh,
    isAuthenticated,
    getSessionUsername,
    setAuthenticated,
    logout
  };
})(window);
