
export type Service = {
  _id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  serviceFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ServicesResponse = {
  success: boolean;
  count: number;
  data: Service[];
};

const API_URL = process.env.API_URL;

export async function getServices(): Promise<Service[]> {
  const response = await fetch(`${API_URL}/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`);
  }

  const result: ServicesResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to retrieve services");
  }

  // Only return active services
  return result.data.filter((service) => service.isActive);
}
