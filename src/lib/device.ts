/**
 * Utility to extract more detailed device information from user agent string.
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') return { device: 'Server', os: 'Unknown', model: 'Unknown' };

  const ua = navigator.userAgent;
  let device = 'Desktop';
  let os = 'Unknown';
  let model = 'Unknown';

  // Basic Device Category
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) {
    device = 'Mobile';
  }

  // OS Detection
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Specific Model Extraction (Best Effort)
  if (os === 'iOS') {
    if (/iPhone/.test(ua)) model = 'iPhone';
    else if (/iPad/.test(ua)) model = 'iPad';
    else if (/iPod/.test(ua)) model = 'iPod';
  } else if (os === 'Android') {
    // Android user agents usually look like: ... Android 11; SM-G991B Build ...
    // Or: ... Android 10; Pixel 4 XL ...
    const match = ua.match(/Android\s+[\d\.]+;\s+([^;]+?)(?:\s+Build|\s+[\);])/);
    if (match && match[1]) {
      model = match[1].trim();
    } else {
      model = 'Android Device';
    }
  } else {
    model = os + ' ' + device;
  }

  return {
    device,
    os,
    model,
    userAgent: ua
  };
}
