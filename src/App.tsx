import React, { createContext, useState, useMemo, useEffect, Suspense } from 'react';
import RouteComponent from 'routes';
import 'i18n';
import { User } from 'firebase/auth';
import { auth as firebaseAuth } from 'services/firebase';

type TAuthContext = {
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<TAuthContext>({
  auth: null,
  setAuth: () => {},
});

const App = () => {
  const [auth, setAuth] = useState<User | null>(null);
  const context = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

  useEffect(() => {
    const unlisten = firebaseAuth.onAuthStateChanged((auth) => {
      setAuth(auth);
    });
    return () => {
      unlisten();
    };
  }, []);

  return (
    <AuthContext.Provider value={context}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouteComponent />
      </Suspense>
    </AuthContext.Provider>
  );
};

export default App;
