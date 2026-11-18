
export type Appointment = {
  _id: string;
  service: {
    _id: string;
    name: string;
    description: string;
    estimatedDuration: number;
    serviceFee: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  registrationNumber: string;
  brand: string;
  model: string;
  appointmentDate: string;
  startTime: string;
  user: {
    _id: string;
    name: string;
    email: string;
    tel: string;
    role: string;
    createdAt: string;
  };
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
};

type AppointmentsResponse = {
  success: boolean;
  count: number;
  data: Appointment[];
};

const API_URL =
  process.env.API_URL || "http://localhost:5000/api/v1";

export async function getAppointments(
  accessToken: string
): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch appointments: ${response.status}`);
  }

  const result: AppointmentsResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to retrieve appointments.");
  }

  return result.data;
}
