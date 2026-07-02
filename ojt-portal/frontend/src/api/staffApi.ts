import api from "../api";

export interface TraineeBasicInfo {
  id: number;
  NIC: string;
  username: string;
  email: string | null;
  status: string;
  createdAt: string;
  name: string;
  institute: string;
}

export const getAllTrainees = async (): Promise<TraineeBasicInfo[]> => {
  try {
    const response = await api.get("/api/staff/trainees");
    return response.data;
  } catch (error) {
    console.error("Error fetching all trainees:", error);
    throw error;
  }
};

export const createTrainee = async (data: any): Promise<any> => {
  try {
    const response = await api.post("/api/staff/trainees", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating trainee:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Failed to create trainee");
    }
    throw new Error("An unexpected error occurred while creating trainee");
  }
};

export const verifyTrainee = async (id: number | string, status: "Active" | "Rejected", comment?: string): Promise<any> => {
  try {
    const response = await api.put(`/api/staff/trainees/${id}/verify`, { status, comment });
    return response.data;
  } catch (error: any) {
    console.error("Error verifying trainee:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Failed to verify trainee");
    }
    throw new Error("An unexpected error occurred while verifying trainee");
  }
};


export const updateTrainee = async (id: number | string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/api/staff/trainees/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating trainee:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Failed to update trainee");
    }
    throw new Error("An unexpected error occurred while updating trainee");
  }
};

export const deleteTrainee = async (id: number | string): Promise<any> => {
  try {
    const response = await api.delete(`/api/staff/trainees/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting trainee:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Failed to delete trainee");
    }
    throw new Error("An unexpected error occurred while deleting trainee");
  }
};
