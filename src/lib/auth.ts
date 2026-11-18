
export type RegisterData = {
  name: string;
  email: string;
  tel: string;
  password: string;
};

export async function registerUser(data: RegisterData) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Registration failed");
  }

  return result.data;
}
