import React from 'react';
import ERDiagram from './ERDiagram';

interface TableSchema {
  tableName: string;
  columns: {
    name: string;
    type: string;
    description?: string;
  }[];
  sampleData: Record<string, any>[];
}

interface DataStructureProps {
  tables: TableSchema[];
}

const DataStructure: React.FC<DataStructureProps> = ({ tables }) => {
  return <ERDiagram tables={tables} />;
};

export default DataStructure;