import React, { createContext, useContext, useState, useCallback } from 'react';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, []);

  const updateProperty = useCallback((updatedProperty) => {
    setProperties(prevProperties => 
      prevProperties.map(property => 
        property._id === updatedProperty._id ? updatedProperty : property
      )
    );
  }, []);

  const addProperty = useCallback((newProperty) => {
    setProperties(prevProperties => [newProperty, ...prevProperties]);
  }, []);

  const removeProperty = useCallback((propertyId) => {
    setProperties(prevProperties => 
      prevProperties.filter(property => property._id !== propertyId)
    );
  }, []);

  const value = {
    properties,
    setProperties,
    fetchProperties,
    updateProperty,
    addProperty,
    removeProperty
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};