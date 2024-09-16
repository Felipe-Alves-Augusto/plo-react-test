import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';

// Definição da interface Enterprise
interface Enterprise {
    id: number;
    name: string;
    description: string
    // Adicione outros campos conforme necessário
}

// Definição da interface para o contexto
interface EnterpriseContextProps {
    enterprise: Enterprise | null;
    handleEnterpriseChange: (enterprise: Enterprise) => void;
}

// Criação do contexto
const EnterpriseContext = createContext<EnterpriseContextProps | undefined>(undefined);

// Definição do provedor de contexto
export const EnterpriseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);

    const handleEnterpriseChange = useCallback((enterprise: Enterprise) => {
        setEnterprise(enterprise);
    }, []);

    return (
        <EnterpriseContext.Provider value={{ enterprise, handleEnterpriseChange }}>
            {children}
        </EnterpriseContext.Provider>
    );
};

// Hook para usar o contexto
export const useEnterpriseContext = (): EnterpriseContextProps => {
    const context = useContext(EnterpriseContext);
    if (!context) {
        throw new Error("useEnterpriseContext must be used within an EnterpriseProvider");
    }
    return context;
};
