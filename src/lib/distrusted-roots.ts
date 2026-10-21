import { X509Certificate } from "node:crypto";
import tls from "node:tls";

// SHA-256 fingerprints of the emSign roots that the fixed Node releases
// (22.23.4, 24.22.1) drop: ECC Root CA - G3, Root CA - C1, ECC Root CA - C3.
// Removing them here keeps an older platform runtime from trusting them.
const DISTRUSTED_ROOT_FINGERPRINTS = new Set([
  "86:A1:EC:BA:08:9C:4A:8D:3B:BE:27:34:C6:12:BA:34:1D:81:3E:04:3C:F9:E8:A8:62:CD:5C:57:A3:6B:BE:6B",
  "12:56:09:AA:30:1D:A0:A2:49:B9:7A:82:39:CB:6A:34:21:6F:44:DC:AC:9F:39:54:B1:42:92:F2:E8:C8:60:8F",
  "BC:4D:80:9B:15:18:9D:78:DB:3E:1D:8C:F4:F9:72:6A:79:5D:A1:64:3C:A5:F1:35:8E:1D:DB:0E:DC:0D:7E:B3",
]);

type TlsWithDefaultCa = typeof tls & {
  getCACertificates?: (type: "default") => string[];
  setDefaultCACertificates?: (certs: string[]) => void;
};

// Returns how many roots were removed; 0 when the runtime lacks the CA APIs.
export function dropDistrustedRoots(): number {
  const t = tls as TlsWithDefaultCa;
  if (
    typeof t.getCACertificates !== "function" ||
    typeof t.setDefaultCACertificates !== "function"
  )
    return 0;
  const roots = t.getCACertificates("default");
  const kept = roots.filter(
    (pem) =>
      !DISTRUSTED_ROOT_FINGERPRINTS.has(
        new X509Certificate(pem).fingerprint256,
      ),
  );
  if (kept.length !== roots.length) t.setDefaultCACertificates(kept);
  return roots.length - kept.length;
}
