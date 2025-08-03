import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  sendOTP: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; message: string; user?: User }>;
  registerUser: (userData: { email: string; username: string; password: string; mobile: string }) => Promise<{ success: boolean; message: string }>;
  verifyRegistrationOTP: (mobile: string, otp: string, userData: { email: string; username: string; password: string; mobile: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mona-user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem("mona-user");
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Check for test credentials
      if (username === "test" && password === "test") {
        const user: User = {
          id: "test_admin_user",
          phone: "+91 98765 43210",
          email: "test@monadesigners.com",
          username: "test",
          name: "Test Admin"
        };

        // Store user in localStorage
        localStorage.setItem("mona-user", JSON.stringify(user));

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return {
          success: true,
          message: "Login successful!",
          user
        };
      } else {
        return {
          success: false,
          message: "Invalid username or password. Use 'test' for both username and password."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Login failed. Please try again."
      };
    }
  };

  const sendOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call to send OTP
    try {
      // In real app, this would make an API call to your backend
      // which would use services like Firebase Auth, Twilio, etc.
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For demo purposes, we'll always return success
      return {
        success: true,
        message: `OTP sent to ${phone}. Use 123456 for demo.`
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send OTP. Please try again."
      };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For demo purposes, accept "123456" as valid OTP
      if (otp === "123456") {
        const user: User = {
          id: `user_${Date.now()}`,
          phone: phone,
          name: "Guest User",
        };

        // Store user in localStorage
        localStorage.setItem("mona-user", JSON.stringify(user));
        
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return {
          success: true,
          message: "Login successful!",
          user
        };
      } else {
        return {
          success: false,
          message: "Invalid OTP. Please try again."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Verification failed. Please try again."
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("mona-user");
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const registerUser = async (userData: { email: string; username: string; password: string; mobile: string }): Promise<{ success: boolean; message: string }> => {
    try {
      // Simulate API call to register user and send OTP
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // In real app, this would:
      // 1. Check if email/username/mobile already exists
      // 2. Hash the password
      // 3. Store user data temporarily
      // 4. Send OTP to mobile number

      // For demo purposes, we'll always return success
      return {
        success: true,
        message: `OTP sent to ${userData.mobile}. Use 123456 for demo.`
      };
    } catch (error) {
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }
  };

  const verifyRegistrationOTP = async (mobile: string, otp: string, userData: { email: string; username: string; password: string; mobile: string }): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // For demo purposes, accept "123456" as valid OTP
      if (otp === "123456") {
        const user: User = {
          id: `user_${Date.now()}`,
          phone: mobile,
          email: userData.email,
          username: userData.username,
          name: userData.username, // Use username as display name initially
        };

        // Store user in localStorage
        localStorage.setItem("mona-user", JSON.stringify(user));

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return {
          success: true,
          message: "Account created successfully!",
          user
        };
      } else {
        return {
          success: false,
          message: "Invalid OTP. Please try again."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Verification failed. Please try again."
      };
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem("mona-user", JSON.stringify(updatedUser));
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  const value = {
    state,
    sendOTP,
    verifyOTP,
    registerUser,
    verifyRegistrationOTP,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
