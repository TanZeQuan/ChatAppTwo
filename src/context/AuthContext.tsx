import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 1️⃣ User type (adjust later)
export interface User {
  id: string;
  name: string;
  email?: string;
}

// 2️⃣ Context type
interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// 3️⃣ Create context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 4️⃣ Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Auto restore session (optional)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Example:
        // const storedUser = await AsyncStorage.getItem("user");
        // if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // 🔐 Sign in
  const signIn = async (email: string, password: string) => {
    // 🔴 replace with real API later
    await new Promise((r) => setTimeout(r, 800));

    // Mock user
    const mockUser: User = {
      id: "1",
      name: "Test User",
      email,
    };

    setUser(mockUser);

    // Example persistence:
    // await AsyncStorage.setItem("user", JSON.stringify(mockUser));
  };

  // 🚪 Sign out
  const signOut = async () => {
    setUser(null);
    // await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5️⃣ Hook
export const useAuth = () => useContext(AuthContext);
