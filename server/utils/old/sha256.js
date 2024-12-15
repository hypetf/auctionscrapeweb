async function sha256(message) {
    console.log(message)
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    console.log(msgBuffer)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    return hashHex;
  }

  async function l() {
    const stringToHash = "Hello, world!";
    const hash = await sha256(stringToHash);
    console.log(hash);
  }

  l()