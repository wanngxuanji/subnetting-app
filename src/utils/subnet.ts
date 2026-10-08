/**
 * Subnet calculation logic (VLSM)
 */

export interface SubnetResult {
  name: string;
  neededHosts: number;
  allocatedHosts: number;
  networkAddress: string;
  firstUsable: string;
  lastUsable: string;
  broadcastAddress: string;
  subnetMask: string;
  cidr: number;
}

// Convert IP string to 32-bit integer
export function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Convert 32-bit integer to IP string
export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

// Convert IP to 32-bit binary string like 11000000.10101000.00000001.00000000
export function ipToBinaryString(ip: string): string {
  return ip.split('.')
    .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('.');
}

export function getBinaryStep(ip: string, cidr: number): string {
  const bin = ip.split('.').map(octet => parseInt(octet, 10).toString(2).padStart(8, '0')).join('');
  
  let result = '';
  for (let i = 0; i < 32; i++) {
    if (i === cidr) {
      result += ' | ';
    } else if (i > 0 && i % 8 === 0) {
      result += '.';
    }
    result += bin[i];
  }
  if (cidr === 32) result += ' |';
  return result;
}

// Get the subnet mask from CIDR
export function cidrToMaskInt(cidr: number): number {
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
}

export function cidrToMaskString(cidr: number): string {
  return intToIp(cidrToMaskInt(cidr));
}

// Calculate required bits for hosts
export function getRequiredBits(hosts: number): number {
  let bits = 0;
  while (Math.pow(2, bits) - 2 < hosts) {
    bits++;
  }
  return bits;
}

export function calculateSubnets(majorNetwork: string, cidr: number, requirements: {name: string, hosts: number}[]): SubnetResult[] | {error: string} {
  try {
    // Validate IP
    const parts = majorNetwork.split('.');
    if (parts.length !== 4 || parts.some(p => isNaN(parseInt(p)) || parseInt(p) < 0 || parseInt(p) > 255)) {
      return { error: 'Địa chỉ IP mạng không hợp lệ.' };
    }

    // Sort requirements descending
    const sortedReqs = [...requirements].sort((a, b) => b.hosts - a.hosts);
    const results: SubnetResult[] = [];
    
    let currentIpInt = ipToInt(majorNetwork);
    const networkMaskInt = cidrToMaskInt(cidr);
    
    // Validate that the provided IP is a network address
    if ((currentIpInt & ~networkMaskInt) !== 0) {
       currentIpInt = currentIpInt & networkMaskInt; // Enforce network address
    }

    const maxIpInt = currentIpInt + Math.pow(2, 32 - cidr) - 1;

    for (const req of sortedReqs) {
      if (req.hosts <= 0) continue;

      const hostBits = getRequiredBits(req.hosts);
      const allocatedHosts = Math.pow(2, hostBits);
      const newCidr = 32 - hostBits;

      if (currentIpInt + allocatedHosts - 1 > maxIpInt) {
        return { error: `Không đủ không gian địa chỉ cho phòng "${req.name}" (${req.hosts} máy).` };
      }

      const networkAddress = intToIp(currentIpInt);
      const firstUsable = intToIp(currentIpInt + 1);
      const broadcastAddress = intToIp(currentIpInt + allocatedHosts - 1);
      const lastUsable = intToIp(currentIpInt + allocatedHosts - 2);
      const subnetMask = cidrToMaskString(newCidr);

      results.push({
        name: req.name,
        neededHosts: req.hosts,
        allocatedHosts: allocatedHosts - 2,
        networkAddress,
        firstUsable,
        lastUsable,
        broadcastAddress,
        subnetMask,
        cidr: newCidr
      });

      // Move to next block
      currentIpInt += allocatedHosts;
    }

    return results;

  } catch (e) {
    return { error: 'Đã có lỗi xảy ra trong quá trình tính toán.' };
  }
}
