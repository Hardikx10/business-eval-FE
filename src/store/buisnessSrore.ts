/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface BusinessState {
  isLoading: boolean;
  error: string | null;
  business: any | null;
  allBusiness: any | null;
  addBusiness: (businessData: any) => Promise<any>;
  updateBusiness: (businessId: string, businessData: any) => Promise<any>;
  fetchBusiness: (businessId: string) => Promise<any>;
  fetchAllBusiness: () => Promise<any>;
  deleteBusiness: (businessId: string) => Promise<any>;
  uploadFile: (businessId: string, file: File) => Promise<any>;
}

const useBusinessStore = create<BusinessState>((set) => ({
  isLoading: false,
  error: null,
  business: null,
  allBusiness: null,

  addBusiness: async (businessData) => {
    set({ isLoading: true, error: null });
    try {
      const userId = localStorage.getItem('user_id');
      const businessPayload = {
        ...businessData,
        user_id: userId,
      };

      if (userId) {
        businessPayload.user_id = userId;
      }
      const response = await axios.post(
        `${API_URL}/api/business/`,
        businessPayload
      );
      set({ isLoading: false, business: response.data });
      return response.data.newBusiness;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to add business';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Function to update an existing business
  updateBusiness: async (businessId, businessData) => {
  
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/api/business/${businessId}`,
        businessData
      );
      set({ isLoading: false });
      // console.log(response.data);
      
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update business';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchBusiness: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {

      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('User ID not found in local storage');
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/api/business/${businessId}`,config);
      set({ isLoading: false, business: response.data });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch business details';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  fetchAllBusiness: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('User ID not found in local storage');
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/api/business/`, config);
      set({ isLoading: false, allBusiness: response.data.business.data });
      
      
      return response.data.business.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch business details';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  deleteBusiness: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${API_URL}/api/business/${businessId}`,
        config
      );
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete business';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  uploadFile : async (businessId:string, file : File) => {

    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/api/business/upload/${businessId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        }
      );
      set({ isLoading: false });
      console.log(response.data);
      
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to upload file';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }    
  }
}));

export default useBusinessStore;
