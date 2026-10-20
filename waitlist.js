const WAITLIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx6BKri-LtZ1AyO0sX2CMA1EYMdGUyG-XJ978NuR2_3FcS3zK5W5rFi-6UORiMuCYwkEw/exec';

async function submitWaitlist(data) {
  if (WAITLIST_ENDPOINT.startsWith('PASTE_')) {
    throw new Error('Waitlist setup is not finished yet.');
  }

  const body = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => body.append(key, String(value ?? '')));

  await fetch(WAITLIST_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body
  });
}
