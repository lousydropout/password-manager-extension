// src/options/OptionsPage.tsx
import React from "react";
import CredentialItem from "../components/CredentialItems";
import useSessionStorage from "../hooks/useSessionStorage";
import "../index.css";

interface Credential {
  url: string;
  username: string;
  password: string; // Assuming this is decrypted for display purposes
  description: string;
}

const OptionsPage: React.FC = () => {
  const [credentials, _setCredentials] = useSessionStorage<Credential[]>(
    "credentials",
    []
  );

  return (
    <div className="container mx-auto p-4 w-96 h-96">
      <h1 className="text-xl font-bold mb-4">All Credentials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {credentials.map((cred, index) => (
          <CredentialItem
            key={index}
            url={cred.url}
            username={cred.username}
            password={cred.password}
            description={cred.description}
            onUpdate={() => console.log("Update", cred)}
            onDelete={() => console.log("Delete", cred)}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionsPage;
