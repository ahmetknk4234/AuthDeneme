import React, { createContext, useState, ReactNode } from 'react';

// 1. User veri tipini tanımla
interface User {
  name: string;
  email: string;
  number: string;
  address: string;
}

// 2. Context için tip tanımı
interface UserContextType {
  user: User;
  updateUser: (updatedUser: Partial<User>) => void;
}

// 3. Varsayılan değerler
const defaultValue: User = {
  name: '',
  email: '',
  number: '',
  address: '',
};

// 4. Context oluştur (başlangıçta undefined olabilir)
const UserContext = createContext<UserContextType | undefined>(undefined);

// 5. Provider bileşeni
interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultValue);

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevState) => ({ ...prevState, ...updatedUser }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
