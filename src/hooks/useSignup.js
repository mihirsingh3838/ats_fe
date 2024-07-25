import { useState } from 'react';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (email, password, fullName, phoneNumber, reportingManager, state) => {
    setIsLoading(true);
    setError(null);

    const apiUrl = process.env.REACT_APP_API_URL || '';
  
    const response = await fetch(`${apiUrl}/api/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phoneNumber, reportingManager, state })
    });
    const json = await response.json();
  
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return false;
    }
  
    setIsLoading(false);
    return true;
  };  

  return { signup, isLoading, error };
};
